"use client";

import { useState, useMemo } from "react";
import { initialAlerts } from "@/data/mockData";
import AlertsList from "@/components/AlertsList";
import { themes } from "@/theme/theme";
import { useTheme } from "@/contexts/ThemeContext";
import Chatbot from "@/components/Chatbot";
import {
  Bell, Filter, CheckCheck, AlertCircle,
  History, ShieldAlert, ArrowRight
} from "lucide-react";

export default function AlertasPage() {
  const [alertsData, setAlertsData] = useState(initialAlerts);
  const [filter, setFilter] = useState("pendentes");

  const { dark } = useTheme();
  const T = dark ? themes.dark : themes.light;

  const handleVerify = (id) => {
    setAlertsData((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, verified: true, verifiedAt: new Date().toLocaleTimeString() } : a
      )
    );
  };

  const filteredAlerts = useMemo(() => {
    if (filter === "pendentes") return alertsData.filter((a) => !a.verified);
    if (filter === "verificados") return alertsData.filter((a) => a.verified);
    return alertsData;
  }, [alertsData, filter]);

  const criticalCount = alertsData.filter((a) => !a.verified && a.severity === "high").length;
  const pendingCount  = alertsData.filter((a) => !a.verified).length;
  const resolvedCount = alertsData.filter((a) => a.verified).length;

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ background: "#080516" }}>
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
          font-family: 'Orbitron', monospace;
        }
        .tg-section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(124,58,237,0.3), transparent);
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="tg-glass-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(168,85,247,0.25))",
              border: "1px solid rgba(124,58,237,0.4)",
              boxShadow: "0 0 16px rgba(124,58,237,0.3)",
            }}
          >
            <Bell size={20} style={{ color: "#c084fc" }} />
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
              CENTRAL DE ALERTAS
            </div>
            <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)", letterSpacing: "2px", textTransform: "uppercase" }}>
              Gerencie e verifique as ocorrências do sistema
            </div>
          </div>
        </div>

        {/* Toggle filter */}
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.2)" }}
        >
          {[
            { key: "pendentes",   label: `Pendentes (${pendingCount})` },
            { key: "verificados", label: "Resolvidos" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={
                filter === key
                  ? {
                      background: "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(168,85,247,0.3))",
                      color: "#c084fc",
                      border: "1px solid rgba(124,58,237,0.4)",
                    }
                  : { color: "rgba(148,163,184,0.5)", border: "1px solid transparent" }
              }
            >
              {label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div>
        <div className="tg-section-label mb-3">Resumo de Ocorrências</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              label: "Críticos",
              value: criticalCount,
              icon: <ShieldAlert size={18} />,
              color: "#ef4444",
              border: "border-l-red-500",
            },
            {
              label: "Advertências",
              value: pendingCount - criticalCount,
              icon: <AlertCircle size={18} />,
              color: "#f97316",
              border: "border-l-orange-500",
            },
            {
              label: "Resolvidos Hoje",
              value: resolvedCount,
              icon: <CheckCheck size={18} />,
              color: "#22c55e",
              border: "border-l-green-500",
            },
          ].map(({ label, value, icon, color, border }) => (
            <div
              key={label}
              className={`tg-glass border-l-4 ${border} p-4 flex items-center gap-4`}
              style={{ borderRadius: "0 16px 16px 0" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}
              >
                {icon}
              </div>
              <div>
                <div
                  className="text-2xl font-bold"
                  style={{ fontFamily: "'Orbitron', monospace", color }}
                >
                  {value}
                </div>
                <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN AREA ── */}
      <div>
        <div className="tg-section-label mb-3">Ocorrências</div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

          {/* Lista principal */}
          <div className="lg:col-span-3">
            <div className="tg-glass overflow-hidden">
              {/* sub-header */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{
                  background: "rgba(124,58,237,0.07)",
                  borderBottom: "1px solid rgba(124,58,237,0.15)",
                }}
              >
                <span
                  className="text-xs font-bold flex items-center gap-2"
                  style={{ color: "rgba(192,132,252,0.7)" }}
                >
                  <Filter size={13} />
                  Exibindo: {filter}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
                  <span style={{ fontSize: "10px", color: "rgba(148,163,184,0.4)", letterSpacing: "1px", textTransform: "uppercase" }}>
                    Auto-refresh: 30s
                  </span>
                </div>
              </div>

              <div className="p-3">
                {filteredAlerts.length > 0 ? (
                  <AlertsList alerts={filteredAlerts} onVerify={handleVerify} T={T} />
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div
                      className="inline-flex p-5 rounded-2xl"
                      style={{
                        background: "rgba(124,58,237,0.1)",
                        border: "1px solid rgba(124,58,237,0.2)",
                      }}
                    >
                      <CheckCheck size={32} style={{ color: "#a855f7" }} />
                    </div>
                    <p style={{ color: "rgba(148,163,184,0.5)", fontSize: "13px" }}>
                      Nenhum alerta <strong style={{ color: "#a855f7" }}>{filter}</strong> encontrado.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">

            {/* Timeline */}
            <div className="tg-glass p-5">
              <h3
                className="font-bold text-sm mb-5 flex items-center gap-2"
                style={{ color: "#e2e8f0" }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  <History size={13} style={{ color: "#a855f7" }} />
                </div>
                Últimas Verificações
              </h3>

              <div className="space-y-4">
                {alertsData.filter((a) => a.verified).slice(0, 3).map((a, i) => (
                  <div
                    key={i}
                    className="relative pl-4 py-1"
                    style={{ borderLeft: "1px solid rgba(124,58,237,0.25)" }}
                  >
                    <div
                      className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full"
                      style={{
                        background: "#7c3aed",
                        boxShadow: "0 0 6px rgba(124,58,237,0.6)",
                      }}
                    />
                    <p style={{ fontSize: "10px", color: "rgba(168,85,247,0.6)", fontFamily: "'Orbitron', monospace", letterSpacing: "0.5px" }}>
                      {a.verifiedAt || "Há pouco"}
                    </p>
                    <p className="text-xs truncate mt-0.5" style={{ color: "rgba(148,163,184,0.6)" }}>
                      {a.msg}
                    </p>
                  </div>
                ))}

                {alertsData.filter((a) => a.verified).length === 0 && (
                  <p style={{ fontSize: "11px", color: "rgba(148,163,184,0.35)" }} className="text-center py-4">
                    Nenhuma verificação ainda.
                  </p>
                )}

                <button
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all text-xs font-bold uppercase tracking-widest mt-2"
                  style={{
                    color: "rgba(168,85,247,0.5)",
                    border: "1px solid rgba(124,58,237,0.15)",
                    background: "rgba(124,58,237,0.05)",
                    letterSpacing: "1px",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#a855f7"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.35)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(168,85,247,0.5)"; e.currentTarget.style.borderColor = "rgba(124,58,237,0.15)"; }}
                >
                  Ver Log Completo <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Dica */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(168,85,247,0.05))",
                border: "1px solid rgba(124,58,237,0.2)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#a855f7" }} />
                <p style={{ fontSize: "9px", textTransform: "uppercase", letterSpacing: "2px", color: "#a855f7", fontFamily: "'Orbitron', monospace" }}>
                  Protocolo
                </p>
              </div>
              <p className="text-xs leading-relaxed italic" style={{ color: "rgba(148,163,184,0.55)" }}>
                "Alertas críticos não resolvidos em 15 minutos serão escalados automaticamente para o gestor de plantão."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="text-center py-4 text-[10px] tracking-widest"
        style={{ fontFamily: "'Orbitron', monospace", color: "rgba(168,85,247,0.2)" }}
      >
        © 2026 TERMOGUARD — SISTEMA DE MONITORAMENTO TÉRMICO
      </div>

      <Chatbot />
    </div>
  );
}