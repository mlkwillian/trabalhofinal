"use client";

import { CheckCircle2, AlertTriangle, Thermometer, WifiOff } from "lucide-react";

const alertConfig = {
  temp_high: {
    label: "Temperatura Alta",
    icon: Thermometer,
    getStyle: (T) => ({
      color: T.red || "#ef4444",
      border: `${T.red || "#ef4444"}55`,
      glow: `${T.red || "#ef4444"}33`,
      stripe: `${T.red || "#ef4444"}22`,
    }),
  },
  temp_low: {
    label: "Temperatura Baixa",
    icon: Thermometer,
    getStyle: (T) => ({
      color: T.blue || "#3b82f6",
      border: `${T.blue || "#3b82f6"}55`,
      glow: `${T.blue || "#3b82f6"}33`,
      stripe: `${T.blue || "#3b82f6"}22`,
    }),
  },
  offline: {
    label: "Dispositivo Offline",
    icon: WifiOff,
    getStyle: (T) => ({
      color: T.muted || "#64748b",
      border: `${T.muted || "#64748b"}55`,
      glow: `${T.muted || "#64748b"}33`,
      stripe: `${T.muted || "#64748b"}22`,
    }),
  },
  warning: {
    label: "Alerta",
    icon: AlertTriangle,
    getStyle: (T) => ({
      color: T.accent || "#f97316",
      border: `${T.accent || "#f97316"}55`,
      glow: `${T.accent || "#f97316"}33`,
      stripe: `${T.accent || "#f97316"}22`,
    }),
  },
};

export default function AlertCard({ alert, onVerify, T }) {
  if (!alert) return null;

  const cfg = alertConfig[alert.type] ?? alertConfig.offline;
  const s = cfg.getStyle(T);
  const Icon = cfg.icon;
  const pending = !alert.verified;

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: `1.5px solid ${pending ? s.border : "rgba(124,58,237,0.12)"}`,
        boxShadow: pending ? `0 4px 24px ${s.glow}` : "none",
        opacity: alert.verified ? 0.55 : 1,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Barra lateral colorida */}
      <div
        style={{
          position: "absolute",
          left: 0, top: 0, bottom: 0,
          width: 4,
          background: pending
            ? `linear-gradient(180deg, ${s.color}, ${s.color}66)`
            : "rgba(124,58,237,0.2)",
          borderRadius: "2px 0 0 2px",
        }}
      />

      {/* Gradiente de fundo sutil */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${s.stripe} 0%, transparent 55%)`,
          pointerEvents: "none",
        }}
      />

      {/* Top glow line quando pendente */}
      {pending && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${s.color}88, transparent)`,
          }}
        />
      )}

      <div className="relative pl-6 pr-4 py-4">
        <div className="flex items-start gap-3">

          {/* Ícone */}
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: `${s.color}15`,
              border: `1.5px solid ${s.color}35`,
              boxShadow: pending ? `0 0 14px ${s.color}25` : "none",
            }}
          >
            <Icon size={18} style={{ color: s.color }} />
          </div>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">

            {/* Badge tipo + hora */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span
                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{
                  background: `${s.color}18`,
                  color: s.color,
                  border: `1px solid ${s.color}30`,
                  fontFamily: "'Orbitron', monospace",
                  letterSpacing: "0.5px",
                }}
              >
                {cfg.label}
              </span>
              <span
                className="text-[10px] tabular-nums shrink-0"
                style={{ color: "rgba(148,163,184,0.5)", fontFamily: "'Space Mono', monospace" }}
              >
                {alert.time}
              </span>
            </div>

            {/* Nome ambiente */}
            <p className="text-sm font-black leading-tight" style={{ color: "#e2e8f0" }}>
              {alert.envName}
            </p>

            {/* Mensagem */}
            <p className="text-[11px] mt-1 leading-snug" style={{ color: "rgba(148,163,184,0.6)" }}>
              {alert.message}
            </p>

            {/* Footer do card */}
            <div className="flex items-center justify-between mt-3 gap-2">
              {alert.verified && alert.verifiedBy ? (
                <div
                  className="flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-lg"
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    color: "#22c55e",
                    border: "1px solid rgba(34,197,94,0.25)",
                    fontFamily: "'Orbitron', monospace",
                    letterSpacing: "0.3px",
                  }}
                >
                  <CheckCircle2 size={11} />
                  <span className="font-bold">Verificado por {alert.verifiedBy}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(148,163,184,0.45)" }}>
                  <div
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: s.color }}
                  />
                  Aguardando verificação
                </div>
              )}

              {pending && (
                <button
                  onClick={() => onVerify?.(alert.id_incidente || alert.id)}
                  className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-xl font-black transition-all duration-200 hover:scale-105 shrink-0"
                  style={{
                    background: `${s.color}20`,
                    color: s.color,
                    border: `1.5px solid ${s.color}45`,
                    boxShadow: `0 2px 10px ${s.color}20`,
                    fontFamily: "'Orbitron', monospace",
                    letterSpacing: "0.3px",
                    fontSize: "10px",
                  }}
                >
                  <CheckCircle2 size={13} />
                  Verificar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}