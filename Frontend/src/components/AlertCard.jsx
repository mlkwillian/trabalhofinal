"use client";

import { CheckCircle2, AlertTriangle, Thermometer, WifiOff } from "lucide-react";

// 🔥 CONFIG (cria se você ainda não tiver separado em utils)
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
      color: T.muted,
      border: `${T.muted}55`,
      glow: `${T.muted}33`,
      stripe: `${T.muted}22`,
    }),
  },
  warning: {
    label: "Alerta",
    icon: AlertTriangle,
    getStyle: (T) => ({
      color: T.accent,
      border: `${T.accent}55`,
      glow: `${T.accent}33`,
      stripe: `${T.accent}22`,
    }),
  },
};

export default function AlertCard({ alert, onVerify, T }) {

  // 🔒 proteção
  if (!alert) return null;

  const cfg = alertConfig[alert.type] ?? alertConfig.offline;
  const s = cfg.getStyle(T);
  const Icon = cfg.icon;
  const pending = !alert.verified;

  return (
    <div
      className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        border: `1.5px solid ${s.border}`,
        background: T.card,
        boxShadow: pending
          ? `0 0 0 0px ${s.glow}, 0 4px 20px ${s.glow}`
          : "none",
        opacity: alert.verified ? 0.55 : 1,
      }}
    >
      {/* barra lateral */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          background: pending
            ? `linear-gradient(180deg, ${s.color}, ${s.color}88)`
            : T.border,
          borderRadius: "2px 0 0 2px",
        }}
      />

      {/* efeito */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${s.stripe} 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <div className="relative pl-5 pr-4 py-4">
        <div className="flex items-start gap-3">

          {/* ícone */}
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: `${s.color}18`,
              border: `1.5px solid ${s.color}35`,
              boxShadow: pending ? `0 0 12px ${s.color}25` : "none",
            }}
          >
            <Icon
              style={{ color: s.color, width: 18, height: 18 }}
            />
          </div>

          {/* conteúdo */}
          <div className="flex-1 min-w-0">

            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{
                  background: `${s.color}20`,
                  color: s.color,
                  border: `1px solid ${s.color}30`,
                }}
              >
                {cfg.label}
              </span>

              <span
                className="text-[10px] tabular-nums shrink-0"
                style={{
                  color: T.muted,
                  fontFamily: "'Space Mono', monospace",
                }}
              >
                {alert.time}
              </span>
            </div>

            <p
              className="text-sm font-black leading-tight"
              style={{ color: T.text }}
            >
              {alert.envName}
            </p>

            <p
              className="text-[11px] mt-1 leading-snug"
              style={{ color: T.textSub }}
            >
              {alert.message}
            </p>

            <div className="flex items-center justify-between mt-3 gap-2">

              {alert.verified && alert.verifiedBy ? (
                <div
                  className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg"
                  style={{
                    background: `${T.green}15`,
                    color: T.green,
                    border: `1px solid ${T.green}30`,
                  }}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="font-bold">
                    Verificado por {alert.verifiedBy}
                  </span>
                </div>
              ) : (
                <div
                  className="flex items-center gap-1.5 text-[10px]"
                  style={{ color: T.muted }}
                >
                  <div
                    className="h-1.5 w-1.5 rounded-full animate-pulse"
                    style={{ background: s.color }}
                  />
                  <span>Aguardando verificação</span>
                </div>
              )}

              {pending && (
                <button
                  onClick={() => onVerify?.(alert.id)}
                  className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-xl font-black transition-all duration-200 hover:scale-105 shrink-0"
                  style={{
                    background: `${s.color}22`,
                    color: s.color,
                    border: `1.5px solid ${s.color}50`,
                    boxShadow: `0 2px 8px ${s.color}20`,
                  }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
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