"use client";

import { Activity } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";

export default function TemperatureChart({ env, T }) {

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div
        className="rounded-xl px-3 py-2.5 text-xs border backdrop-blur-md"
        style={{
          background: T.glass,
          borderColor: T.border,
          boxShadow: T.shadow,
        }}
      >
        <p
          style={{
            color: T.muted,
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
          }}
        >
          {label}
        </p>

        <p
          className="font-black mt-0.5"
          style={{
            color: T.accent,
            fontFamily: "'Space Mono', monospace",
            fontSize: 16,
          }}
        >
          {payload[0].value}°C
        </p>
      </div>
    );
  };

  // 🔒 proteção (evita crash)
  const data = env?.history || [];

  return (
    <div
      className="rounded-2xl border p-6 h-full"
      style={{
        background: T.card,
        borderColor: T.border,
        boxShadow: T.shadow,
      }}
    >
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-xl flex items-center justify-center"
            style={{ background: `${T.purple}15` }}
          >
            <Activity className="h-4 w-4" style={{ color: T.purpleL }} />
          </div>

          <div>
            <span
              className="text-sm font-black"
              style={{ color: T.text }}
            >
              {env?.name}
            </span>

            <p
              className="text-[9px] font-bold uppercase tracking-widest mt-0.5"
              style={{ color: T.muted }}
            >
              Histórico 24h
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full"
          style={{ background: T.borderSoft, color: T.muted }}
        >
          <div
            className="h-1.5 w-1.5 rounded-full animate-pulse"
            style={{ background: T.green }}
          />
          Ao vivo
        </div>
      </div>

      {/* gráfico */}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 20, left: -18, bottom: 0 }}
        >
          <defs>
            <linearGradient id="tempGradMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={T.purple} stopOpacity={0.35} />
              <stop offset="100%" stopColor={T.purple} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={T.borderSoft}
            strokeOpacity={0.8}
          />

          <XAxis
            dataKey="time"
            tick={{
              fontSize: 9,
              fill: T.faint,
              fontFamily: "'Space Mono', monospace",
            }}
            tickLine={false}
            axisLine={false}
            interval={3}
          />

          <YAxis
            tick={{
              fontSize: 9,
              fill: T.faint,
              fontFamily: "'Space Mono', monospace",
            }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: T.border, strokeWidth: 1 }}
          />

          {/* limites */}
          {env?.maxTemp != null && (
            <ReferenceLine
              y={env.maxTemp}
              stroke={T.accent}
              strokeDasharray="5 3"
              strokeOpacity={0.8}
              label={{
                value: "máx",
                fontSize: 9,
                fill: T.accent,
                position: "right",
              }}
            />
          )}

          {env?.minTemp != null && (
            <ReferenceLine
              y={env.minTemp}
              stroke={T.blue}
              strokeDasharray="5 3"
              strokeOpacity={0.8}
              label={{
                value: "mín",
                fontSize: 9,
                fill: T.blue,
                position: "right",
              }}
            />
          )}

          <Area
            type="monotone"
            dataKey="temp"
            stroke={T.purpleL}
            strokeWidth={2.5}
            fill="url(#tempGradMain)"
            dot={false}
            activeDot={{
              r: 6,
              fill: T.accent,
              strokeWidth: 2.5,
              stroke: T.card,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}