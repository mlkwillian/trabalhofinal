"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft,
  CheckCircle2, AlertTriangle, XCircle,
} from "lucide-react";
import Chatbot from '@/components/Chatbot'
const PERIODS = ["hoje", "semana", "mês"];

function statusCfg(status) {
  return {
    conforme: { color: "text-emerald-400", Icon: CheckCircle2 },
    atenção:  { color: "text-amber-400",   Icon: AlertTriangle },
    crítico:  { color: "text-red-400",     Icon: XCircle },
  }[status];
}

function StatusBadge({ status }) {
  const { color, Icon } = statusCfg(status);
  return (
    <span className={`flex items-center gap-1 text-xs font-mono ${color}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

function TabHistorico({ data }) {
  return (
    <div className="space-y-2">
      {data.map((r, i) => (
        <div
          key={i}
          className="rounded-xl px-4 py-3 flex justify-between items-center transition-all"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "color-mix(in srgb, var(--purple) 40%, transparent)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <div>
            <p className="text-xs font-mono" style={{ color: "var(--muted)" }}>{r.dt}</p>
            <p className="font-semibold" style={{ color: "var(--text)" }}>{r.env}</p>
          </div>

          <div className="text-right">
            <p className={`font-black font-mono ${
              r.status === "crítico" ? "text-red-400" :
              r.status === "atenção" ? "text-amber-400" :
              "text-emerald-400"
            }`}>
              {r.temp > 0 ? "+" : ""}{r.temp.toFixed(1)}°C
            </p>
            <StatusBadge status={r.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HistoricoPage() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [envFilter, setEnvFilter] = useState("");
  const [period, setPeriod] = useState("hoje");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("http://localhost:3000/api/leituras");
        const json = await res.json();
        const formatted = json.map(item => ({
          dt: new Date(item.createdAt).toLocaleString("pt-BR"),
          env: item.environment,
          temp: item.temperature,
          min: item.min,
          max: item.max,
          faixa: `${item.min}°C a ${item.max}°C`,
          status: item.status
        }));
        setData(formatted);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const ENVS = useMemo(() => [...new Set(data.map(r => r.env))], [data]);

  const filtered = useMemo(() => {
    return data.filter(r => {
      if (search && !r.env.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (envFilter && r.env !== envFilter) return false;
      return true;
    });
  }, [data, search, statusFilter, envFilter]);

  function exportCSV() {
    const csv = filtered.map(r => `${r.dt};${r.env};${r.temp}`).join("\n");
    const blob = new Blob([csv]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
  }

  const inputStyle = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: "0.5rem",
    padding: "0.25rem 0.75rem",
    fontSize: "0.875rem",
    outline: "none",
  };

  return (
    <div className="min-h-screen px-6 py-8 space-y-8" style={{ background: "var(--bg)" }}>

      {/* HEADER */}
      <div
        className="flex justify-between items-center pb-6"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <ArrowLeft style={{ color: "var(--muted)" }} />
          <div>
            <h1 className="text-xl font-black font-mono" style={{ color: "var(--text)" }}>
              Histórico de Leituras
            </h1>
            <p className="text-xs flex items-center gap-2" style={{ color: "var(--muted)" }}>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Atualização em tempo real
            </p>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
          style={{ background: "var(--purple)" }}
        >
          Exportar CSV
        </button>
      </div>

      {/* FILTROS */}
      <div
        className="flex flex-wrap gap-3 rounded-xl px-4 py-3"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <input
          type="text"
          placeholder="Buscar ambiente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={inputStyle}
        />

        <select
          value={statusFilter}
          onChange={e => setStatus(e.target.value)}
          style={inputStyle}
        >
          <option value="">Status</option>
          <option value="conforme">Conforme</option>
          <option value="atenção">Atenção</option>
          <option value="crítico">Crítico</option>
        </select>

        <select
          value={envFilter}
          onChange={e => setEnvFilter(e.target.value)}
          style={inputStyle}
        >
          <option value="">Ambiente</option>
          {ENVS.map(e => <option key={e}>{e}</option>)}
        </select>

        <div className="flex gap-1">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="px-3 py-1 text-xs rounded-lg transition-all"
              style={
                period === p
                  ? { background: "var(--purple)", color: "#fff" }
                  : { color: "var(--muted)" }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <TabHistorico data={filtered} />

      <p className="text-center text-xs font-mono" style={{ color: "var(--muted)" }}>
        ThermoGuard — {data.length} registros em tempo real
      </p>
      <Chatbot />
    </div>
  );
}