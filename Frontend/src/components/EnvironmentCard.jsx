"use client";

import { useRef } from "react";
import { WifiOff } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { useSnowEffect } from "@/hooks/useSnowEffect";
import { PulsingDot } from "@/components/PulsingDot";
import { envIcon } from "@/utils/envIcon";

export default function EnvironmentCard({ env, selected, onClick, T }) {
  const isCold = env?.icon === "snowflake";
  const canvasRef = useRef(null);

  useSnowEffect(canvasRef, selected && isCold);

  const isAlert = env?.status === "alert" || env?.status === "danger";

  const tempColor =
    selected && isCold
      ? T.cold.text
      : isAlert
      ? T.accent
      : T.purpleL;

  const borderColor =
    selected && isCold
      ? T.cold.border
      : selected
      ? T.purple
      : isAlert
      ? T.accentDim
      : T.border;

  const bgColor =
    selected && isCold
      ? T.cold.bg
      : selected
      ? T.cardHover
      : T.card;

  const boxShadow = selected
    ? isCold
      ? `0 0 0 1.5px ${T.cold.border}, 0 12px 40px rgba(56,189,248,0.12)`
      : `0 0 0 1.5px ${T.purple}60, 0 12px 40px rgba(124,58,237,0.15)`
    : T.shadow;

  // 🔒 proteção de dados
  const history = env?.history?.slice(-14) || [];
  const hasTemp = env?.temp !== null && env?.temp !== undefined;

  let pct = 0;
  let inRange = true;

  if (hasTemp && env?.maxTemp !== env?.minTemp) {
    const range = env.maxTemp - env.minTemp;
    pct = Math.min(100, Math.max(0, ((env.temp - env.minTemp) / range) * 100));
    inRange = env.temp >= env.minTemp && env.temp <= env.maxTemp;
  }

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border p-4 group"
      style={{
        background: bgColor,
        borderColor,
        boxShadow,
        position: "relative",
        overflow: "hidden",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* ❄️ efeito neve */}
      {isCold && (
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            borderRadius: 16,
            zIndex: 1,
          }}
          width={260}
          height={280}
        />
      )}

      {isCold && selected && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 16,
            pointerEvents: "none",
            zIndex: 0,
            background: `linear-gradient(135deg, ${T.cold.overlay} 0%, transparent 100%)`,
          }}
        />
      )}

      <div style={{ position: "relative", zIndex: 2 }}>
        
        {/* topo */}
        <div className="flex items-start justify-between mb-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{
              background: `${tempColor}15`,
              border: `1.5px solid ${tempColor}25`,
            }}
          >
            <span style={{ color: tempColor }}>
              {envIcon?.(env?.icon) || "?"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {env?.online ? (
              <>
                <PulsingDot
                  color={
                    selected && isCold
                      ? T.blue
                      : isAlert
                      ? T.accent
                      : T.purple
                  }
                />
                <span
                  className="text-[9px] font-bold uppercase tracking-wider"
                  style={{ color: T.muted }}
                >
                  online
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3" style={{ color: T.faint }} />
                <span
                  className="text-[9px] font-bold uppercase tracking-wider"
                  style={{ color: T.faint }}
                >
                  offline
                </span>
              </>
            )}
          </div>
        </div>

        {/* nome */}
        <p
          className="text-[10px] font-black uppercase tracking-[0.18em] truncate"
          style={{ color: T.muted }}
        >
          {env?.name}
        </p>

        {/* temperatura */}
        <p
          className="text-4xl font-black mt-1 tabular-nums leading-none"
          style={{
            color: tempColor,
            fontFamily: "'Space Mono', monospace",
            letterSpacing: "-0.02em",
          }}
        >
          {hasTemp ? `${env.temp}°` : "—"}
        </p>

        {/* barra */}
        <div className="mt-3 relative">
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: T.borderSoft }}
          >
            {hasTemp && (
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: inRange
                    ? `linear-gradient(90deg, ${T.blue}80, ${T.purple})`
                    : `linear-gradient(90deg, ${T.accent}, ${T.red})`,
                }}
              />
            )}
          </div>

          <div
            className="flex items-center justify-between mt-1.5 text-[9px]"
            style={{
              color: T.faint,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            <span>{env?.minTemp}°</span>
            <span style={{ color: T.muted }}>{env?.humidity}% UR</span>
            <span>{env?.maxTemp}°</span>
          </div>
        </div>

        {/* gráfico */}
        <div className="mt-3 h-10 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id={`sg${env?.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tempColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={tempColor} stopOpacity={0} />
                </linearGradient>
              </defs>

              <Area
                type="monotone"
                dataKey="temp"
                stroke={tempColor}
                strokeWidth={1.5}
                fill={`url(#sg${env?.id})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </button>
  );
}