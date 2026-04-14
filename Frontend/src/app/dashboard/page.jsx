"use client";

import { useState, useMemo, useEffect } from "react";
import StatCard from "@/components/StatCard";
import EnvironmentCard from "@/components/EnvironmentCard";
import TemperatureChart from "@/components/TemperatureChart";
import AlertsList from "@/components/AlertsList";
import AuditReport from "@/components/AuditReport";
import { themes } from "@/theme/theme";
import { api } from "@/services/api";
import { useTheme } from "@/contexts/ThemeContext";

import {
  BarChart3,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter
} from "lucide-react";

export default function DashboardPage() {
  const [envs, setEnvs] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [timeRange, setTimeRange] = useState("hoje");

  // ✅ Usa o tema dinâmico ao invés de sempre themes.dark
  const { dark } = useTheme();
  const T = dark ? themes.dark : themes.light;

  useEffect(() => {
    async function loadData() {
      try {
        const [salasRes, incidentesRes] = await Promise.all([
          api.get("/salas"),
          api.get("/incidentes").catch(() => ({ data: [] }))
        ]);

        const mappedSalas = salasRes.data.map(sala => ({
          id: sala.id_sala,
          name: sala.nome_sala,
          minTemp: sala.temperatura_min,
          maxTemp: sala.temperatura_max,
          online: true,
          history: [
            { time: "08:00", temp: 22 },
            { time: "09:00", temp: 23 }
          ]
        }));

        setEnvs(mappedSalas);
        setAlertsData(incidentesRes.data);

        if (mappedSalas.length > 0) {
          setSelectedEnv(mappedSalas[0]);
        }

      } catch (err) {
        console.error("Erro ao carregar dashboard", err);
      }
    }

    loadData();
  }, []);

  const handleVerify = (alertId) => {
    setAlertsData(prev =>
      prev.map(a =>
        a.id === alertId ? { ...a, verified: true } : a
      )
    );
  };

  const complianceScore = useMemo(() => {
    const total = alertsData.length;
    const verified = alertsData.filter(a => a.verified).length;
    return total > 0 ? Math.round((verified / total) * 100) : 100;
  }, [alertsData]);

  const stats = [
    {
      label: "Ambientes",
      value: envs.length,
      icon: BarChart3,
      accentColor: "#7c3aed",
    },
    {
      label: "Dispositivos Online",
      value: `${envs.filter(e => e.online).length}/${envs.length}`,
      icon: Wifi,
      accentColor: "#22c55e",
    },
    {
      label: "Alertas Ativos",
      value: alertsData.filter(a => !a.verified).length,
      icon: AlertTriangle,
      accentColor: "#f97316",
    },
    {
      label: "SLA de Resposta",
      value: `${complianceScore}%`,
      icon: CheckCircle2,
      accentColor: "#3b82f6",
    },
  ];

  return (
    <div
      className="space-y-6 p-6 min-h-screen"
      style={{ background: "var(--bg)" }}
    >

      {/* HEADER */}
      <div
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6"
        style={{ borderBottom: "1px solid var(--border-soft)" }}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--text)" }}
            >
              Painel de Controle
            </h1>
          </div>
          <p className="text-sm" style={{ color: "var(--purple)" }}>
            Visão geral da integridade térmica do ecossistema
          </p>
        </div>

        <div
          className="flex items-center gap-4 p-1.5 rounded-xl"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          {["hoje", "semana", "mês"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider"
              style={
                timeRange === range
                  ? { background: "var(--purple)", color: "#fff" }
                  : { color: "var(--muted)" }
              }
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="relative group">
            <StatCard {...s} T={T} />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight size={14} style={{ color: "var(--muted)" }} />
            </div>
          </div>
        ))}
      </div>

      {/* GRID CENTRAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* AMBIENTES */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2
              className="text-sm font-bold uppercase tracking-widest"
              style={{ color: "var(--text-sub)" }}
            >
              Monitoramento
            </h2>
            <Filter size={14} style={{ color: "var(--purple)" }} className="cursor-pointer" />
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {envs.map((env) => (
              <EnvironmentCard
                key={env.id}
                env={env}
                T={T}
                selected={selectedEnv?.id === env.id}
                onClick={() => setSelectedEnv(env)}
              />
            ))}
          </div>
        </div>

        {/* GRÁFICO */}
        <div className="lg:col-span-8 space-y-4">
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl rounded-full -mr-16 -mt-16" />

            {selectedEnv && (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                  <div>
                    <h3
                      className="text-lg font-bold leading-tight"
                      style={{ color: "var(--text)" }}
                    >
                      {selectedEnv.name}
                    </h3>

                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className="text-xs flex items-center gap-1 font-mono"
                        style={{ color: "var(--text-sub)" }}
                      >
                        <Clock size={12} /> Live: 2s ago
                      </span>

                      <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 uppercase font-bold">
                        Estável
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className="text-[10px] uppercase font-bold tracking-tighter"
                      style={{ color: "var(--muted)" }}
                    >
                      Tendência 1h
                    </p>
                    <p
                      className="text-xl font-mono"
                      style={{ color: "var(--purple-l)" }}
                    >
                      -0.4°C
                    </p>
                  </div>
                </div>

                <TemperatureChart env={selectedEnv} T={T} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ALERTAS + AUDITORIA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AlertsList
            alerts={alertsData}
            onVerify={handleVerify}
            T={T}
          />
        </div>

        <div
          className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            className="p-4"
            style={{
              borderBottom: "1px solid var(--border-soft)",
              background: "var(--surface)",
            }}
          >
            <h3
              className="text-sm font-bold flex items-center gap-2"
              style={{ color: "var(--text)" }}
            >
              <CheckCircle2 size={16} style={{ color: "var(--purple)" }} />
              Auditoria e Relatórios de Conformidade
            </h3>
          </div>

          <AuditReport alerts={alertsData} T={T} />
        </div>
      </div>
    </div>
  );
}