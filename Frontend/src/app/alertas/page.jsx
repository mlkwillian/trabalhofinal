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
import Chatbot from "@/components/Chatbot";
import { BarChart3, Wifi, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const [envs, setEnvs] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [timeRange, setTimeRange] = useState("hoje");
  const [loading, setLoading] = useState(true);

  const { dark } = useTheme();
  const T = dark ? themes.dark : themes.light;
  const router = useRouter();

  // 🔐 Proteção de rota
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/");
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

  const stats = [
    { label: "Ambientes",          value: envs.length,                                          icon: BarChart3,    accentColor: "#7c3aed" },
    { label: "Dispositivos Online", value: `${envs.filter((e) => e.online).length}/${envs.length}`, icon: Wifi,         accentColor: "#22c55e" },
    { label: "Alertas Ativos",     value: alertsData.filter((a) => !a.verified).length,          icon: AlertTriangle, accentColor: "#f97316" },
    { label: "SLA de Resposta",    value: `${complianceScore}%`,                                 icon: CheckCircle2,  accentColor: "#3b82f6" },
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#080516" }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');`}</style>
        <div className="text-center space-y-4">
          <div
            className="text-lg tracking-widest"
            style={{ fontFamily: "'Orbitron', monospace", color: "#a855f7" }}
          >
            TERMOGUARD
          </div>
          <div className="flex gap-1.5 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-bounce"
                style={{ background: "#7c3aed", animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <p className="text-xs tracking-widest" style={{ color: "rgba(168,85,247,0.4)" }}>
            CARREGANDO DADOS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen space-y-6 p-6"
      style={{ background: "#080516" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');

        .tg-glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 16px;
        }
        .tg-glass-header {
          background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(15,15,30,0.85));
          backdrop-filter: blur(14px);
          border: 1px solid rgba(124,58,237,0.25);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
        }
        .tg-glass-header::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #a855f7, transparent);
        }
        .tg-section-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: rgba(168,85,247,0.5);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tg-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(124,58,237,0.3), transparent);
        }
        .tg-range-btn {
          padding: 5px 14px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .tg-range-btn.active {
          background: linear-gradient(135deg, rgba(124,58,237,0.4), rgba(168,85,247,0.25));
          color: #c084fc;
          border-color: rgba(124,58,237,0.4);
          box-shadow: 0 0 14px rgba(124,58,237,0.2);
        }
        .tg-range-btn:not(.active) {
          color: rgba(148,163,184,0.6);
        }
        .tg-range-btn:not(.active):hover {
          color: rgba(148,163,184,0.9);
          background: rgba(255,255,255,0.04);
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="tg-glass-header flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              boxShadow: "0 0 20px rgba(124,58,237,0.45)",
            }}
          >
            🌡️
          </div>
          <div>
            <div
              className="text-lg font-bold"
              style={{
                fontFamily: "'Orbitron', monospace",
                background: "linear-gradient(135deg, #a855f7, #c084fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "1px",
              }}
            >
              TERMOGUARD
            </div>
            <div style={{ color: "rgba(148,163,184,0.5)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" }}>
              Painel de Controle Térmico
            </div>
          </div>
        </div>

        {/* Time range selector */}
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.2)" }}
        >
          {["hoje", "semana", "mês"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`tg-range-btn ${timeRange === range ? "active" : ""}`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <div>
        <div className="tg-section-label mb-3">Métricas Gerais</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="tg-glass p-4 flex items-center gap-4 transition-all duration-300"
              style={{ animationDelay: `${i * 0.07}s` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${s.accentColor}55`;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 24px ${s.accentColor}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.2)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${s.accentColor}18`, border: `1px solid ${s.accentColor}30` }}
              >
                <s.icon size={18} style={{ color: s.accentColor }} />
              </div>
              <div>
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Orbitron', monospace", color: s.accentColor }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AMBIENTES ── */}
      {envs.length > 0 && (
        <div>
          <div className="tg-section-label mb-3">Ambientes Monitorados</div>
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
        </div>
      )}

      {/* ── GRÁFICO ── */}
      {selectedEnv && (
        <div>
          <div className="tg-section-label mb-3">Histórico de Temperatura</div>
          <div
            className="tg-glass overflow-hidden"
            style={{ height: "320px", padding: "0" }}
          >
            <TemperatureChart env={selectedEnv} T={T} />
          </div>
        </div>
      )}

      {/* ── ALERTAS + RELATÓRIO ── */}
      <div>
        <div className="tg-section-label mb-3">Alertas & Auditoria</div>
        <div className="space-y-4">
          <AlertsList alerts={alertsData} onVerify={handleVerify} T={T} />
          <AuditReport alerts={alertsData} T={T} />
        </div>
      </div>

      {/* Footer */}
      <div
        className="text-center py-4 text-[10px] tracking-widest"
        style={{ fontFamily: "'Orbitron', monospace", color: "rgba(168,85,247,0.25)" }}
      >
        © 2026 TERMOGUARD — SISTEMA DE MONITORAMENTO TÉRMICO
      </div>

      <Chatbot />
    </div>
  );
}