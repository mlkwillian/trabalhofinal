"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft, Download, Filter, ChevronDown,
  CheckCircle2, AlertTriangle, XCircle,
  BarChart3, TrendingUp
} from "lucide-react";

const PER_PAGE = 10;

// ─── Helpers ─────────────────────────────────────────────────
function calcDesvio(r) {
  if (r.temp < r.min) return `${(r.temp - r.min).toFixed(1)}°C`;
  if (r.temp > r.max) return `+${(r.temp - r.max).toFixed(1)}°C`;
  return "—";
}

function statusCfg(status) {
  return {
    conforme: { color: "text-emerald-400", Icon: CheckCircle2 },
    atenção: { color: "text-amber-400", Icon: AlertTriangle },
    crítico: { color: "text-red-400", Icon: XCircle },
  }[status];
}

// ─── Components ───────────────────────────────────────────────
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
          className="bg-[#140c24] border border-[#251840] rounded-xl px-4 py-3
          flex justify-between items-center
          hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-600/10
          transition-all"
        >
          <div>
            <p className="text-xs text-[#6b5c8a] font-mono">{r.dt}</p>
            <p className="text-[#ede9fe] font-semibold">{r.env}</p>
          </div>

          <div className="text-right">
            <p className={`font-black font-mono ${
              r.status === "crítico"
                ? "text-red-400"
                : r.status === "atenção"
                ? "text-amber-400"
                : "text-emerald-400"
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

// ─── CONSTANTES ──────────────────────────────────────────────
const TABS = [
  { id: "historico", label: "Histórico" },
];

const PERIODS = ["hoje", "semana", "mês"];

// ─── MAIN ────────────────────────────────────────────────────
export default function HistoricoPage() {
  const [data, setData] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("");
  const [envFilter, setEnvFilter] = useState("");
  const [period, setPeriod] = useState("hoje");
  const [activeTab, setActiveTab] = useState("historico");

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

  return (
    <div className="min-h-screen bg-[#080612] px-6 py-8 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center border-b border-[#251840] pb-6">
        <div className="flex items-center gap-3">
          <ArrowLeft className="text-[#6b5c8a]" />

          <div>
            <h1 className="text-xl font-black text-[#ede9fe] font-mono">
              Histórico de Leituras
            </h1>

            <p className="text-xs text-[#6b5c8a] flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Atualização em tempo real
            </p>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white
          bg-gradient-to-r from-violet-600 to-purple-600
          hover:from-violet-500 hover:to-purple-500
          shadow-md shadow-violet-600/20 transition-all"
        >
          Exportar CSV
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-3 bg-[#100a1e] border border-[#251840] rounded-xl px-4 py-3">

        <input
          type="text"
          placeholder="Buscar ambiente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#140c24] border border-[#251840] rounded-lg px-3 py-1 text-sm text-white
          focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 outline-none"
        />

        <select
          value={statusFilter}
          onChange={e => setStatus(e.target.value)}
          className="bg-[#140c24] border border-[#251840] rounded-lg px-3 py-1 text-sm text-white"
        >
          <option value="">Status</option>
          <option value="conforme">Conforme</option>
          <option value="atenção">Atenção</option>
          <option value="crítico">Crítico</option>
        </select>

        <select
          value={envFilter}
          onChange={e => setEnvFilter(e.target.value)}
          className="bg-[#140c24] border border-[#251840] rounded-lg px-3 py-1 text-sm text-white"
        >
          <option value="">Ambiente</option>
          {ENVS.map(e => <option key={e}>{e}</option>)}
        </select>

        <div className="flex gap-1">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 text-xs rounded-lg ${
                period === p
                  ? "bg-violet-600 text-white"
                  : "text-[#6b5c8a] hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

      </div>

      {/* CONTENT */}
      {activeTab === "historico" && (
        <TabHistorico data={filtered} />
      )}

      <p className="text-center text-xs text-[#3d2f60] font-mono">
        ThermoGuard — {data.length} registros em tempo real
      </p>
    </div>
  );
}