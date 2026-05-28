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
import { useRouter } from "next/navigation";

import {
  BarChart3,
  Wifi,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  const [envs, setEnvs] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [timeRange, setTimeRange] = useState("hoje");
  const [loading, setLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const { dark } = useTheme();
  const T = dark ? themes.dark : themes.light;
  const router = useRouter();

  // 🔐 Proteção de rota
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [salasRes, incidentesRes] = await Promise.all([
          api.get("/api/salas"),
          api.get("/api/incidentes").catch(() => ({ data: [] })),
        ]);
        const mappedSalas = (salasRes.data || []).map((sala) => ({
          id: sala.id_sala,
          name: sala.nome_sala,
          minTemp: sala.temperatura_min,
          maxTemp: sala.temperatura_max,
          online: true,
          history: [],
        }));
        setEnvs(mappedSalas);
        setAlertsData(incidentesRes.data || []);
        if (mappedSalas.length > 0) setSelectedEnv(mappedSalas[0]);
      } catch (err) {
        console.error("Erro ao carregar dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ✅ Fix 1: handleVerify agora está corretamente fechado com };
  const handleVerify = (alertId) => {
    setAlertsData((prev) =>
      prev.map((a) =>
        a.id_incidente === alertId ? { ...a, verified: true } : a
      )
    );
  };

  const complianceScore = useMemo(() => {
    const total = alertsData.length;
    const verified = alertsData.filter((a) => a.verified).length;
    return total > 0 ? Math.round((verified / total) * 100) : 100;
  }, [alertsData]);

  // ✅ Fix 2: isCritical e tabs declarados antes do uso no JSX
  const isCritical = alertsData.some((a) => !a.verified);

  const tabs = [
    { key: "overview", label: "Visão Geral", count: 0 },
    {
      key: "alerts",
      label: "Alertas",
      count: alertsData.filter((a) => !a.verified).length,
    },
  ];

  const stats = [
    {
      label: "Ambientes",
      value: envs.length,
      icon: BarChart3,
      accentColor: "#7c3aed",
    },
    {
      label: "Dispositivos Online",
      value: `${envs.filter((e) => e.online).length}/${envs.length}`,
      icon: Wifi,
      accentColor: "#22c55e",
    },
    {
      label: "Alertas Ativos",
      value: alertsData.filter((a) => !a.verified).length,
      icon: AlertTriangle,
      accentColor: "#f97316",
    },
    {
      label: "SALA de Resposta",
      value: `${complianceScore}%`,
      icon: CheckCircle2,
      accentColor: "#3b82f6",
    },
  ];

  // ✅ Fix 3: if (loading) agora está DENTRO do componente, antes do return
  if (loading) {
    return (
      <div className="p-10 text-center text-gray-400">
        Carregando dashboard...
      </div>
    );
  }

  return (
    <div
      className="space-y-6 p-6 min-h-screen"
      style={{ background: "var(--bg)" }}
    >
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 pb-6 border-b border-[var(--border-soft)]">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--text)" }}
          >
            Painel de Controle
          </h1>
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

        {/* ALERT BANNER */}
        {showBanner && (
          <div
            className="tg-banner flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{
              background:
                "linear-gradient(135deg,rgba(239,68,68,0.2),rgba(239,68,68,0.08))",
              borderColor: "rgba(239,68,68,0.5)",
            }}
          >
            <span className="text-xl">🚨</span>
            <p
              className="flex-1 text-[13px]"
              style={{ color: "#fca5a5" }}
            >
              <strong style={{ color: "var(--tg-red)" }}>
                ALERTA CRÍTICO!{" "}
              </strong>
              Sensor S-04 (Câmara Frigorífica B) atingiu{" "}
              <strong>-32.1°C</strong> — limite inferior excedido.
            </p>
            <button
              onClick={() => setShowBanner(false)}
              className="text-lg"
              style={{ color: "var(--tg-muted)" }}
            >
              ✕
            </button>
          </div>
        )}

        {/* TABS */}
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--tg-border)",
          }}
        >
          {tabs.map((t) => {
            const isAlertsAndCrit = t.key === "alerts" && isCritical;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-[9px] text-[13px] font-medium transition-all
                  ${isAlertsAndCrit ? "tg-tab-crit" : ""}`}
                style={
                  isActive
                    ? {
                        background: isAlertsAndCrit
                          ? "linear-gradient(135deg,rgba(239,68,68,0.4),rgba(239,68,68,0.2))"
                          : "linear-gradient(135deg,rgba(124,58,237,0.4),rgba(168,85,247,0.25))",
                        color: isAlertsAndCrit
                          ? "var(--tg-red)"
                          : "var(--tg-purple3)",
                        border: `1px solid ${
                          isAlertsAndCrit
                            ? "rgba(239,68,68,0.5)"
                            : "rgba(124,58,237,0.3)"
                        }`,
                        boxShadow: isAlertsAndCrit
                          ? "0 0 16px rgba(239,68,68,0.2)"
                          : "0 0 16px rgba(124,58,237,0.2)",
                      }
                    : isAlertsAndCrit
                    ? {
                        background:
                          "linear-gradient(135deg,rgba(239,68,68,0.3),rgba(239,68,68,0.15))",
                        color: "var(--tg-red)",
                        border: "1px solid rgba(239,68,68,0.4)",
                      }
                    : { color: "var(--tg-muted)" }
                }
              >
                {t.label}
                {t.count > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "rgba(239,68,68,0.3)",
                      color: "#fca5a5",
                    }}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
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
        {envs.map((env) => (
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
      <div className="w-full h-[300px]">
        {selectedEnv && <TemperatureChart env={selectedEnv} T={T} />}
      </div>

      {/* ALERTAS */}
      <AlertsList alerts={alertsData} onVerify={handleVerify} T={T} />

      {/* RELATÓRIO */}
      <AuditReport alerts={alertsData} T={T} />
    </div>
  );
}