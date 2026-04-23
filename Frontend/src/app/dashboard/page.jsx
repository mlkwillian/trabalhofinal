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
  const [loading, setLoading] = useState(true);

  const { dark } = useTheme();
  const T = dark ? themes.dark : themes.light;

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [salasRes, incidentesRes] = await Promise.all([
          api.get("/api/salas"),
          api.get("/api/incidentes").catch(() => ({ data: [] }))
        ]);

        const mappedSalas = (salasRes.data || []).map(sala => ({
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
        setAlertsData(incidentesRes.data || []);

        if (mappedSalas.length > 0) {
          setSelectedEnv(mappedSalas[0]);
        }

      } catch (err) {
        console.error("Erro ao carregar dashboard", err);
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Carregando dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 min-h-screen" style={{ background: "var(--bg)" }}>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6"
        style={{ borderBottom: "1px solid var(--border-soft)" }}>
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>
              Painel de Controle
            </h1>
          </div>
          <p className="text-sm" style={{ color: "var(--purple)" }}>
            Visão geral da integridade térmica
          </p>
        </div>

        <div className="flex gap-2">
          {["hoje", "semana", "mês"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className="px-3 py-1 text-xs rounded"
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
          <StatCard key={s.label} {...s} T={T} />
        ))}
      </div>

      {/* AMBIENTES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {envs.map(env => (
          <EnvironmentCard
            key={env.id}
            env={env}
            selected={selectedEnv?.id === env.id}
            onClick={() => setSelectedEnv(env)}
            T={T}
          />
        ))}
      </div>

      {/* GRÁFICO */}
      {selectedEnv && (
        <TemperatureChart env={selectedEnv} T={T} />
      )}

      {/* ALERTAS */}
      <AlertsList
        alerts={alertsData}
        onVerify={handleVerify}
        T={T}
      />

      {/* RELATÓRIO */}
      <AuditReport alerts={alertsData} T={T} />

    </div>
  );
}