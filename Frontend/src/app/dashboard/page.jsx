"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import StatCard from "@/components/StatCard";
import EnvironmentCard from "@/components/EnvironmentCard";
import TemperatureChart from "@/components/TemperatureChart";
import AlertsList from "@/components/AlertsList";
import AuditReport from "@/components/AuditReport";
import { themes } from "@/theme/theme";
import { api } from "@/services/api";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { BarChart3, Wifi, AlertTriangle, CheckCircle2 } from "lucide-react";

// ─── Inline styles injetados uma única vez ───────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

  :root {
    --tg-bg:        #0a0a14;
    --tg-bg2:       #0f0f1e;
    --tg-bg3:       #141428;
    --tg-purple:    #7c3aed;
    --tg-purple2:   #a855f7;
    --tg-purple3:   #c084fc;
    --tg-pglow:     rgba(124,58,237,0.35);
    --tg-red:       #ef4444;
    --tg-redglow:   rgba(239,68,68,0.45);
    --tg-amber:     #f59e0b;
    --tg-green:     #10b981;
    --tg-blue:      #3b82f6;
    --tg-text:      #e2e8f0;
    --tg-muted:     #94a3b8;
    --tg-border:    rgba(124,58,237,0.22);
  }

  @keyframes tg-float-snow {
    0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0; }
    10%  { opacity: 0.8; }
    90%  { opacity: 0.6; }
    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
  }
  @keyframes tg-heat-rise {
    0%   { transform: scale(1);   opacity: 0.55; }
    100% { transform: scale(1.6) scaleY(1.9); opacity: 0; }
  }
  @keyframes tg-critical-pulse {
    0%,100% { box-shadow: inset 0 0 60px rgba(239,68,68,0.08); background: rgba(239,68,68,0.025); }
    50%     { box-shadow: inset 0 0 120px rgba(239,68,68,0.28); background: rgba(239,68,68,0.08); }
  }
  @keyframes tg-badge-ring {
    0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
    50%     { box-shadow: 0 0 0 7px rgba(239,68,68,0); }
  }
  @keyframes tg-dot-beat {
    0%,100% { transform: scale(1);   opacity: 1; }
    50%     { transform: scale(1.6); opacity: 0.5; }
  }
  @keyframes tg-tab-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.3); }
    50%     { box-shadow: 0 0 14px rgba(239,68,68,0.55); }
  }
  @keyframes tg-card-glow {
    0%,100% { box-shadow: 0 0 24px rgba(239,68,68,0.25), inset 0 0 30px rgba(239,68,68,0.05); }
    50%     { box-shadow: 0 0 44px rgba(239,68,68,0.55), inset 0 0 55px rgba(239,68,68,0.12); }
  }
  @keyframes tg-banner-glow {
    0%,100% { box-shadow: 0 0 10px rgba(239,68,68,0.2); }
    50%     { box-shadow: 0 0 28px rgba(239,68,68,0.55); }
  }
  @keyframes tg-slide-down {
    from { transform: translateY(-18px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes tg-sensor-ping {
    0%,100% { transform: scale(1);   opacity: 0.4; }
    50%     { transform: scale(1.6); opacity: 0; }
  }
  @keyframes tg-draw-line {
    to { stroke-dashoffset: 0; }
  }
  @keyframes tg-bar-rise {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  @keyframes tg-counter {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes tg-live-blink {
    0%,100% { opacity: 1; }
    50%     { opacity: 0.25; }
  }
  @keyframes tg-thermo-fill {
    from { height: 0%; }
  }
  @keyframes tg-gauge-needle {
    from { transform: rotate(-90deg); }
  }
  @keyframes tg-card-hover {
    to { transform: translateY(-4px); }
  }

  .tg-snow        { animation: tg-float-snow linear infinite; position: absolute; pointer-events: none; }
  .tg-heat        { animation: tg-heat-rise linear infinite; position: absolute; pointer-events: none; border-radius: 50%; border: 1px solid rgba(239,68,68,0.18); }
  .tg-live-dot    { animation: tg-live-blink 1.1s ease-in-out infinite; }
  .tg-badge-crit  { animation: tg-badge-ring 1s ease-in-out infinite; }
  .tg-beat        { animation: tg-dot-beat 1s ease-in-out infinite; }
  .tg-tab-crit    { animation: tg-tab-pulse 1s ease-in-out infinite; }
  .tg-card-crit   { animation: tg-card-glow 1.5s ease-in-out infinite; }
  .tg-overlay-crit{ animation: tg-critical-pulse 1.5s ease-in-out infinite; }
  .tg-banner      { animation: tg-slide-down 0.4s cubic-bezier(.34,1.56,.64,1), tg-banner-glow 1.5s ease-in-out infinite; }
  .tg-sensor-ping { animation: tg-sensor-ping 2s ease-in-out infinite; }
  .tg-card:hover  { transform: translateY(-3px); transition: transform 0.25s; }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function genLine(base, noise, len) {
  const pts = [];
  let v = base;
  for (let i = 0; i < len; i++) {
    v += (Math.random() - 0.5) * noise;
    pts.push(Math.round(v * 10) / 10);
  }
  return pts;
}

function toSvgPath(pts, yMin, yMax, W, H) {
  return pts
    .map((v, i) => {
      const x = (i / (pts.length - 1)) * W;
      const y = H - ((v - yMin) / (yMax - yMin)) * (H - 20) - 10;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function useCounter(target, decimals = 1, duration = 1400) {
  const [val, setVal] = useState(null);
  useEffect(() => {
    let start = null;
    const from = 0;
    function tick(ts) {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal((from + (target - from) * ease).toFixed(decimals));
      if (prog < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target]);
  return val ?? target.toFixed(decimals);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Snowflakes + heat waves floating in the background */
function BgParticles() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        char: ["❄", "❅", "❆", "✦"][i % 4],
        left: `${(i * 5.5) % 100}%`,
        size: 10 + (i % 5) * 3,
        dur: `${6 + (i % 10)}s`,
        delay: `${(i * 0.7) % 12}s`,
      })),
    []
  );
  const waves = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        size: 20 + i * 9,
        right: `${10 + i * 3}%`,
        bottom: `${5 + i * 4}%`,
        dur: `${3 + i}s`,
        delay: `${i * 0.8}s`,
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="tg-snow"
          style={{
            left: f.left,
            top: "-20px",
            fontSize: f.size,
            color: "rgba(147,197,253,0.7)",
            textShadow: "0 0 8px rgba(147,197,253,0.8)",
            animationDuration: f.dur,
            animationDelay: f.delay,
          }}
        >
          {f.char}
        </span>
      ))}
      {waves.map((w) => (
        <div
          key={w.id}
          className="tg-heat"
          style={{
            width: w.size,
            height: w.size,
            right: w.right,
            bottom: w.bottom,
            animationDuration: w.dur,
            animationDelay: w.delay,
          }}
        />
      ))}
    </div>
  );
}

/** Animated thermometer bar */
function Thermo({ pct, gradient }) {
  return (
    <div
      style={{
        width: 8,
        height: 44,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 4,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: `${pct}%`,
          background: gradient,
          borderRadius: 4,
          transition: "height 1.2s cubic-bezier(.34,1.56,.64,1)",
          animation: "tg-thermo-fill 1.2s cubic-bezier(.34,1.56,.64,1) forwards",
        }}
      />
    </div>
  );
}

/** Metric card (top row) */
function MetricCard({ label, icon, value, delta, deltaDir, thermoPct, thermoGrad, critical }) {
  return (
    <div
      className={`tg-card relative rounded-2xl p-4 overflow-hidden transition-all cursor-default ${critical ? "tg-card-crit" : ""}`}
      style={{
        background: "linear-gradient(135deg,var(--tg-bg2),var(--tg-bg3))",
        border: critical
          ? "1px solid rgba(239,68,68,0.55)"
          : "1px solid var(--tg-border)",
      }}
    >
      {/* top shine */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-40"
        style={{ background: "linear-gradient(90deg,transparent,var(--tg-purple2),transparent)" }}
      />
      <p
        className="text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1"
        style={{ color: "var(--tg-muted)" }}
      >
        <span className="text-sm">{icon}</span>
        {label}
      </p>
      <p
        className="font-['Orbitron'] text-2xl font-bold leading-none mb-1 animate-[tg-counter_0.6s_ease_forwards]"
        style={{ color: critical ? "var(--tg-red)" : "var(--tg-purple2)" }}
      >
        {value}
      </p>
      <p
        className="text-[11px] flex items-center gap-1"
        style={{ color: deltaDir === "up" ? "var(--tg-red)" : deltaDir === "down" ? "var(--tg-green)" : "var(--tg-muted)" }}
      >
        {deltaDir === "up" ? "↑" : deltaDir === "down" ? "↓" : ""} {delta}
      </p>
      {thermoPct !== undefined && (
        <div className="mt-2">
          <Thermo pct={thermoPct} gradient={thermoGrad} />
        </div>
      )}
    </div>
  );
}

/** Animated SVG line chart */
function LineChart({ pts_a, pts_b, pts_c }) {
  const W = 540, H = 175;
  const all = [...pts_a, ...pts_b, ...pts_c];
  const yMin = Math.min(...all) - 5;
  const yMax = Math.max(...all) + 5;

  const pathA = toSvgPath(pts_a, yMin, yMax, W, H);
  const pathB = toSvgPath(pts_b, yMin, yMax, W, H);
  const pathC = toSvgPath(pts_c, yMin, yMax, W, H);

  const lastY = (pts) => {
    const v = pts[pts.length - 1];
    return H - ((v - yMin) / (yMax - yMin)) * (H - 20) - 10;
  };

  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const y = 10 + (i / 4) * (H - 20);
    const val = yMax - (i / 4) * (yMax - yMin);
    return { y: y.toFixed(1), label: val.toFixed(0) };
  });

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f87171" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid */}
      {gridLines.map((g) => (
        <g key={g.y}>
          <line x1="0" y1={g.y} x2={W} y2={g.y} stroke="rgba(124,58,237,0.12)" strokeWidth="1" />
          <text x="2" y={parseFloat(g.y) + 4} fill="rgba(148,163,184,0.55)" fontSize="9" fontFamily="Inter">
            {g.label}°
          </text>
        </g>
      ))}

      {/* Area fills */}
      <path d={`${pathA} L${W} ${H} L0 ${H} Z`} fill="url(#ga)" />
      <path d={`${pathB} L${W} ${H} L0 ${H} Z`} fill="url(#gb)" />
      <path d={`${pathC} L${W} ${H} L0 ${H} Z`} fill="url(#gc)" />

      {/* Animated lines */}
      {[
        { path: pathA, color: "#a855f7", delay: "0.2s" },
        { path: pathB, color: "#60a5fa", delay: "0.5s" },
        { path: pathC, color: "#f87171", delay: "0.8s", w: 2.5 },
      ].map(({ path, color, delay, w = 2 }) => (
        <path
          key={color}
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={w}
          strokeDasharray="1000"
          strokeDashoffset="1000"
          style={{ animation: `tg-draw-line 1.8s ease forwards ${delay}` }}
        />
      ))}

      {/* Live dots */}
      {[
        { pts: pts_a, color: "#a855f7" },
        { pts: pts_b, color: "#60a5fa" },
        { pts: pts_c, color: "#f87171" },
      ].map(({ pts, color }) => (
        <circle
          key={color}
          cx={W}
          cy={lastY(pts).toFixed(1)}
          r="4"
          fill={color}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        >
          <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />
        </circle>
      ))}

      {/* Time labels */}
      {Array.from({ length: 6 }, (_, i) => (
        <text
          key={i}
          x={(i / 5) * W}
          y={H}
          fill="rgba(148,163,184,0.45)"
          fontSize="9"
          fontFamily="Inter"
          textAnchor="middle"
        >
          {String((i * 4) % 24).padStart(2, "0")}:00
        </text>
      ))}
    </svg>
  );
}

/** Bar chart by zone */
function BarChartZones({ zones, temps, colors }) {
  const W = 480, H = 130;
  const tMin = -40, tMax = 90;
  const barW = 50;
  const gap = (W - zones.length * barW) / (zones.length + 1);
  const zeroY = H - 20 - ((0 - tMin) / (tMax - tMin)) * (H - 40);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <line x1="0" y1={zeroY} x2={W} y2={zeroY} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="4 4" />
      <text x="2" y={zeroY - 3} fill="rgba(148,163,184,0.5)" fontSize="9" fontFamily="Inter">0°</text>

      {zones.map((z, i) => {
        const x = gap + i * (barW + gap);
        const t = temps[i];
        const barH = Math.abs(((t - 0) / (tMax - tMin)) * (H - 40));
        const y = t >= 0 ? zeroY - barH : zeroY;
        const col = colors[i];
        const labelY = t >= 0 ? y - 5 : y + barH + 13;

        return (
          <g key={z}>
            <rect
              x={x.toFixed(1)}
              y={zeroY}
              width={barW}
              height="0"
              rx="4"
              fill={col}
              opacity="0.85"
              style={{ transformOrigin: `${x + barW / 2}px ${zeroY}px` }}
            >
              <animate attributeName="height" from="0" to={barH.toFixed(1)} dur="0.8s" begin={`${i * 0.12}s`} fill="freeze" />
              <animate attributeName="y" from={zeroY} to={y.toFixed(1)} dur="0.8s" begin={`${i * 0.12}s`} fill="freeze" />
            </rect>
            <text x={(x + barW / 2).toFixed(1)} y={labelY.toFixed(1)} fill={col} fontSize="10" fontFamily="Orbitron,monospace" fontWeight="700" textAnchor="middle">
              {t}°
            </text>
            <text x={(x + barW / 2).toFixed(1)} y={H - 4} fill="rgba(148,163,184,0.7)" fontSize="10" fontFamily="Inter" textAnchor="middle">
              Zona {z}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/** Weekly trend sparkline */
function WeekChart({ vals, days }) {
  const W = 460, H = 150;
  const yMin = Math.min(...vals) - 2;
  const yMax = Math.max(...vals) + 2;
  const path = toSvgPath(vals, yMin, yMax, W, H - 20);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: 4 }, (_, i) => {
        const y = 10 + (i / 3) * (H - 30);
        const v = yMax - (i / 3) * (yMax - yMin);
        return (
          <g key={i}>
            <line x1="0" y1={y} x2={W} y2={y} stroke="rgba(124,58,237,0.1)" strokeWidth="1" />
            <text x="0" y={y + 4} fill="rgba(148,163,184,0.45)" fontSize="9" fontFamily="Inter">{v.toFixed(0)}°</text>
          </g>
        );
      })}
      <path d={`${path} L${W} ${H - 20} L0 ${H - 20} Z`} fill="url(#wg)" />
      <path d={path} fill="none" stroke="#a855f7" strokeWidth="2.5">
        <animate attributeName="strokeDashoffset" from="600" to="0" dur="1.5s" fill="freeze" />
      </path>
      {vals.map((v, i) => {
        const x = (i / (vals.length - 1)) * W;
        const y = H - 20 - ((v - yMin) / (yMax - yMin)) * (H - 40);
        return (
          <g key={i}>
            <circle cx={x} cy={y.toFixed(1)} r="0" fill="#a855f7" style={{ filter: "drop-shadow(0 0 4px #a855f7)" }}>
              <animate attributeName="r" from="0" to="4" dur="0.3s" begin={`${i * 0.18 + 1}s`} fill="freeze" />
            </circle>
            <text x={x} y={H} fill="rgba(148,163,184,0.55)" fontSize="10" fontFamily="Inter" textAnchor="middle">{days[i]}</text>
            <text x={x} y={(y - 9).toFixed(1)} fill="#c084fc" fontSize="9" fontFamily="Orbitron,monospace" textAnchor="middle">{v.toFixed(1)}</text>
          </g>
        );
      })}
    </svg>
  );
}

/** Sensor row item */
function SensorRow({ sensor }) {
  const statusColor = { normal: "#10b981", warning: "#f59e0b", critical: "#ef4444" };
  const trendIcon = { up: "↑", down: "↓", stable: "→" };
  const trendColor = { up: "#f87171", down: "#60a5fa", stable: "#94a3b8" };
  const tempColor =
    sensor.temp < -10 ? "#60a5fa" : sensor.temp < 30 ? "#10b981" : sensor.temp < 60 ? "#f59e0b" : "#ef4444";
  const pct = Math.max(0, Math.min(100, ((sensor.temp + 40) / 130) * 100));
  const col = statusColor[sensor.status];

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer hover:translate-x-1"
      style={{
        background: sensor.status === "critical" ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.03)",
        borderColor: sensor.status === "critical" ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.07)",
      }}
    >
      <div className="relative" style={{ width: 10, height: 10, borderRadius: "50%", background: col, flexShrink: 0 }}>
        <div
          className="tg-sensor-ping absolute inset-0 rounded-full"
          style={{ margin: "-4px", border: `1px solid ${col}`, opacity: 0.4 }}
        />
      </div>
      <span
        className="text-[10px] font-mono px-2 py-0.5 rounded"
        style={{ background: "rgba(124,58,237,0.15)", color: "var(--tg-muted)", minWidth: 40, textAlign: "center" }}
      >
        {sensor.id}
      </span>
      <div className="flex-1">
        <p className="text-[13px] font-medium" style={{ color: "var(--tg-text)" }}>{sensor.name}</p>
        <p className="text-[11px]" style={{ color: "var(--tg-muted)" }}>{sensor.loc}</p>
      </div>
      <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: tempColor, borderRadius: 2, transition: "width 1s" }} />
      </div>
      <span className="font-['Orbitron'] text-[15px] font-bold" style={{ color: tempColor }}>
        {sensor.temp > 0 ? "+" : ""}{sensor.temp.toFixed(1)}°
      </span>
      <span className="text-[12px]" style={{ color: trendColor[sensor.trend] }}>{trendIcon[sensor.trend]}</span>
    </div>
  );
}

/** Alert item */
function AlertItem({ level, icon, title, desc, time }) {
  const styles = {
    critical: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.35)", bar: "var(--tg-red)", text: "var(--tg-red)" },
    warning:  { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.3)",  bar: "var(--tg-amber)", text: "var(--tg-amber)" },
    info:     { bg: "rgba(59,130,246,0.08)",  border: "rgba(59,130,246,0.3)",  bar: "var(--tg-blue)", text: "var(--tg-blue)" },
  };
  const s = styles[level];
  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl border relative overflow-hidden cursor-pointer transition-all hover:opacity-90"
      style={{ background: s.bg, borderColor: s.border }}
    >
      <div className="absolute top-0 left-0 w-[3px] h-full rounded-l-xl" style={{ background: s.bar }} />
      <span className="text-[18px] ml-1">{icon}</span>
      <div className="flex-1">
        <p className="text-[13px] font-semibold mb-0.5" style={{ color: "var(--tg-text)" }}>{title}</p>
        <p className="text-[11px]" style={{ color: "var(--tg-muted)" }}>{desc}</p>
        <p className="text-[10px] mt-1" style={{ color: "var(--tg-muted)" }}>{time}</p>
      </div>
    </div>
  );
}

// ─── CARD WRAPPER ─────────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return (
    <div
      className={`relative rounded-2xl p-[18px] overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg,var(--tg-bg2),var(--tg-bg3))",
        border: "1px solid var(--tg-border)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-35"
        style={{ background: "linear-gradient(90deg,transparent,var(--tg-purple2),transparent)" }}
      />
      {/* dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [envs, setEnvs] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [timeRange, setTimeRange] = useState("hoje");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isCritical, setIsCritical] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [clock, setClock] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [chartPts, setChartPts] = useState(null);
  const cssInjected = useRef(false);

  const { dark } = useTheme();
  const T = dark ? themes.dark : themes.light;
  const router = useRouter();

  // Inject global CSS once
  useEffect(() => {
    if (cssInjected.current) return;
    cssInjected.current = true;
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
  }, []);

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString("pt-BR"));
      setDateStr(now.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Route guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/");
  }, []);

  // Generate chart data once
  useEffect(() => {
    setChartPts({
      a: genLine(22, 8, 24),
      b: genLine(-18, 5, 24),
      c: genLine(72, 12, 24),
    });
  }, []);

  // Load API data
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
      prev.map((a) => (a.id_incidente === alertId ? { ...a, verified: true } : a))
    );
  };

  const complianceScore = useMemo(() => {
    const total = alertsData.length;
    const verified = alertsData.filter((a) => a.verified).length;
    return total > 0 ? Math.round((verified / total) * 100) : 100;
  }, [alertsData]);

  const activeAlerts = alertsData.filter((a) => !a.verified).length;

  // Static demo sensors (replace with real data as needed)
  const demoSensors = [
    { id: "S-01", name: "Recepção Principal",   loc: "Piso 1 • Bloco A",   temp: 22.0,  status: "normal",   trend: "stable" },
    { id: "S-02", name: "Sala de Servidores",   loc: "Piso 2 • TI",        temp: 19.2,  status: "normal",   trend: "down" },
    { id: "S-03", name: "Câmara Frigorífica A", loc: "Piso -2 • Bloco A",  temp: -18.5, status: "normal",   trend: "stable" },
    { id: "S-04", name: "Câmara Frigorífica B", loc: "Piso -2 • Bloco B",  temp: -32.1, status: "critical", trend: "down" },
    { id: "S-05", name: "Laboratório 1",        loc: "Piso 3 • Pesquisa",  temp: 20.8,  status: "normal",   trend: "up" },
    { id: "S-06", name: "Sala de Máquinas",     loc: "Piso -1 • Mec.",     temp: 38.4,  status: "warning",  trend: "up" },
    { id: "S-07", name: "Lab. Criogênico",      loc: "Piso -1 • Bloco A",  temp: -18.5, status: "normal",   trend: "stable" },
    { id: "S-08", name: "Caldeira Industrial",  loc: "Piso -1 • Energia",  temp: 52.1,  status: "warning",  trend: "up" },
    { id: "S-09", name: "Área de Produção",     loc: "Piso 1 • Fábrica",   temp: 26.3,  status: "normal",   trend: "stable" },
    { id: "S-10", name: "Depósito Central",     loc: "Piso 1 • Logíst.",   temp: 18.0,  status: "normal",   trend: "down" },
    { id: "S-11", name: "Estufa C",             loc: "Piso 3 • Bloco C",   temp: 78.4,  status: "warning",  trend: "up" },
    { id: "S-12", name: "Câmara Clean Room",    loc: "Piso 4 • P&D",       temp: 21.0,  status: "normal",   trend: "stable" },
  ];

  const weekDays  = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const weekVals  = [18.2, 21.5, 19.8, 24.3, 22.1, 17.6, 20.4];
  const zoneNames = ["A", "B", "C", "D", "E", "F"];
  const zoneTemps = [22.1, -18.5, 78.4, 15.3, 45.2, -32.1];
  const zoneColors= ["#a855f7","#60a5fa","#ef4444","#10b981","#f59e0b","#3b82f6"];

  const toggleCritical = () => {
    const next = !isCritical;
    setIsCritical(next);
    setShowBanner(next);
  };

  const tabs = [
    { key: "overview",   label: " Visão Geral" },
  
  ];

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--tg-bg)" }}
      >
        <div className="text-center">
          <p className="font-['Orbitron'] text-2xl mb-3" style={{ color: "var(--tg-purple2)" }}>
            ThermoGuard
          </p>
          <p className="text-sm animate-pulse" style={{ color: "var(--tg-muted)" }}>
            Carregando dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ background: "var(--tg-bg)", color: "var(--tg-text)" }}>

      {/* Background effects */}
      <BgParticles />

      {/* Critical overlay */}
      {isCritical && (
        <div
          className="tg-overlay-crit fixed inset-0 pointer-events-none z-40"
          style={{ border: "2px solid rgba(239,68,68,0.15)" }}
        />
      )}

      <div className="relative z-10 max-w-[1400px] mx-auto p-4 space-y-4">

        {/* ── HEADER ── */}
        <div
          className="flex items-center justify-between px-5 py-3 rounded-2xl backdrop-blur-md relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(15,15,30,0.8))",
            border: "1px solid var(--tg-border)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg,transparent,var(--tg-purple2),transparent)" }}
          />
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{
                background: "linear-gradient(135deg,var(--tg-purple),var(--tg-purple2))",
                boxShadow: "0 0 18px var(--tg-pglow)",
              }}
            >
              🌡
            </div>
            <div>
              <p
                className="font-['Orbitron'] text-[18px] font-bold tracking-wide"
                style={{
                  background: "linear-gradient(135deg,var(--tg-purple2),var(--tg-purple3))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                ThermoGuard
              </p>
              <p className="text-[10px] tracking-[2px] uppercase" style={{ color: "var(--tg-muted)" }}>
                Sistema de Monitoramento Térmico
              </p>
            </div>
          </div>

          {/* Right: time range + clock + status */}
          <div className="flex items-center gap-4">
            {/* Time range buttons (original functionality) */}
            <div
              className="flex gap-1 p-1 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--tg-border)" }}
            >
              {["hoje", "semana", "mês"].map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className="px-3 py-1 text-xs rounded-lg capitalize transition-all"
                  style={
                    timeRange === r
                      ? { background: "var(--tg-purple)", color: "#fff", boxShadow: "0 0 12px var(--tg-pglow)" }
                      : { color: "var(--tg-muted)" }
                  }
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="text-right" style={{ fontFamily: "Orbitron,monospace" }}>
              <p className="text-base font-bold" style={{ color: "var(--tg-purple3)" }}>{clock}</p>
              <p className="text-[10px]" style={{ color: "var(--tg-muted)" }}>{dateStr}</p>
            </div>

            <button
              onClick={toggleCritical}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wide border transition-all"
              style={
                isCritical
                  ? {
                      background: "rgba(239,68,68,0.15)",
                      borderColor: "rgba(239,68,68,0.5)",
                      color: "var(--tg-red)",
                    }
                  : {
                      background: "rgba(16,185,129,0.15)",
                      borderColor: "rgba(16,185,129,0.4)",
                      color: "var(--tg-green)",
                    }
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${isCritical ? "tg-beat" : ""}`}
                style={{ background: "currentColor" }}
              />
              {isCritical ? "Alerta Crítico" : "Sistema Normal"}
            </button>
          </div>
        </div>

        {/* ── ALERT BANNER ── */}
        {showBanner && (
          <div
            className="tg-banner flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{
              background: "linear-gradient(135deg,rgba(239,68,68,0.2),rgba(239,68,68,0.08))",
              borderColor: "rgba(239,68,68,0.5)",
            }}
          >
            <span className="text-xl">🚨</span>
            <p className="flex-1 text-[13px]" style={{ color: "#fca5a5" }}>
              <strong style={{ color: "var(--tg-red)" }}>ALERTA CRÍTICO! </strong>
              Sensor S-04 (Câmara Frigorífica B) atingiu{" "}
              <strong>-32.1°C</strong> — limite inferior excedido.
            </p>
            <button onClick={() => setShowBanner(false)} className="text-lg" style={{ color: "var(--tg-muted)" }}>
              ✕
            </button>
          </div>
        )}

        {/* ── TABS ── */}
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--tg-border)" }}
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
                        color: isAlertsAndCrit ? "var(--tg-red)" : "var(--tg-purple3)",
                        border: `1px solid ${isAlertsAndCrit ? "rgba(239,68,68,0.5)" : "rgba(124,58,237,0.3)"}`,
                        boxShadow: isAlertsAndCrit ? "0 0 16px rgba(239,68,68,0.2)" : "0 0 16px rgba(124,58,237,0.2)",
                      }
                    : isAlertsAndCrit
                    ? {
                        background: "linear-gradient(135deg,rgba(239,68,68,0.3),rgba(239,68,68,0.15))",
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
                    style={{ background: "rgba(239,68,68,0.3)", color: "#fca5a5" }}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ═══════════════ OVERVIEW ═══════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Stats (original StatCard + themed metric cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricCard label="Temp. Média"       icon="🌡" value="21.4°C" delta="+2.3° última hora"       deltaDir="up"   thermoPct={52} thermoGrad="linear-gradient(to top,#7c3aed,#a855f7)" />
              <MetricCard label="Mín. Registrada"   icon="❄️" value="-32.1°C" delta="Câmara Criogênica"       deltaDir="down" thermoPct={12} thermoGrad="linear-gradient(to top,#1d4ed8,#60a5fa)" />
              <MetricCard label="Máx. Registrada"   icon="🔥" value="78.4°C" delta="⚠ ALERTA ATIVO"          deltaDir="up"   thermoPct={88} thermoGrad="linear-gradient(to top,#dc2626,#f87171)" critical />
              <MetricCard label="Ambientes Online"  icon="✅" value={`${envs.filter((e) => e.online).length || 12}/12`} delta="100% operacionais" deltaDir="neutral" thermoPct={undefined} />
            </div>

            {/* Original env cards (from API) */}
            {envs.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
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
            )}

            {/* Main chart + gauge + top sensors */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr] gap-3">
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] uppercase tracking-widest" style={{ color: "var(--tg-muted)" }}>
                    Temperatura em Tempo Real — Últimas 24h
                  </p>
                  <span className="text-[11px] tg-live-dot" style={{ color: "var(--tg-purple3)" }}>
                    ● AO VIVO
                  </span>
                </div>
                {chartPts && <LineChart pts_a={chartPts.a} pts_b={chartPts.b} pts_c={chartPts.c} />}
                <div className="flex gap-4 mt-2">
                  {[["#a855f7", "Zona A"], ["#60a5fa", "Zona B (Frio)"], ["#f87171", "Zona C (Crítica)"]].map(
                    ([c, label]) => (
                      <span key={label} className="flex items-center gap-1 text-[10px]" style={{ color: "var(--tg-muted)" }}>
                        <span style={{ width: 12, height: 2, background: c, display: "inline-block", borderRadius: 2 }} />
                        {label}
                      </span>
                    )
                  )}
                </div>
              </Card>

              {/* Gauge */}
              <Card>
                <p className="text-[11px] uppercase tracking-widest mb-2" style={{ color: "var(--tg-muted)" }}>
                  Índice de Risco Térmico
                </p>
                <div className="flex flex-col items-center">
                  <svg width="160" height="110" viewBox="0 0 160 100">
                    <defs>
                      <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="#3b82f6" />
                        <stop offset="40%"  stopColor="#10b981" />
                        <stop offset="65%"  stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                    <path d="M 20 90 A 60 60 0 0 1 140 90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
                    <path d="M 20 90 A 60 60 0 0 1 140 90" fill="none" stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round" />
                    <line
                      x1="80" y1="90" x2="80" y2="38"
                      stroke="white" strokeWidth="2" strokeLinecap="round"
                      transform="rotate(7 80 90)"
                      style={{ transition: "transform 1.5s cubic-bezier(.34,1.56,.64,1)", animation: "tg-gauge-needle 1.5s cubic-bezier(.34,1.56,.64,1) forwards" }}
                    />
                    <circle cx="80" cy="90" r="5" fill="#7c3aed" />
                    <text x="16" y="100" fill="#60a5fa" fontSize="8" fontFamily="Inter">Baixo</text>
                    <text x="115" y="100" fill="#ef4444" fontSize="8" fontFamily="Inter">Alto</text>
                    <text x="68" y="76" fill="white" fontSize="14" fontFamily="Orbitron,monospace" fontWeight="700">72</text>
                  </svg>
                  <p className="text-[11px] font-semibold tracking-wider" style={{ color: "var(--tg-amber)" }}>
                    ⚠ RISCO MODERADO
                  </p>
                  <div className="grid grid-cols-3 gap-2 w-full mt-3">
                    {[["3", "var(--tg-green)", "Normal"], ["2", "var(--tg-amber)", "Alerta"], ["1", "var(--tg-red)", "Crítico"]].map(
                      ([val, col, lbl]) => (
                        <div key={lbl} className="rounded-lg p-2 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
                          <p className="font-['Orbitron'] text-sm font-bold" style={{ color: col }}>{val}</p>
                          <p className="text-[9px] uppercase tracking-wider mt-0.5" style={{ color: "var(--tg-muted)" }}>{lbl}</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Card>

              {/* Top sensors */}
              <Card>
                <p className="text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--tg-muted)" }}>
                  Top Sensores Ativos
                </p>
                <div className="space-y-2">
                  {[
                    { id: "S-04", name: "Câm. Frig. B",  loc: "Piso -2",  temp: -32.1, color: "var(--tg-red)" },
                    { id: "S-11", name: "Estufa C",       loc: "Piso 3",   temp: 78.4,  color: "var(--tg-amber)" },
                    { id: "S-01", name: "Recepção",       loc: "Piso 1",   temp: 22.0,  color: "var(--tg-green)" },
                    { id: "S-07", name: "Lab. Criog.",    loc: "Piso -1",  temp: -18.5, color: "var(--tg-blue)" },
                    { id: "S-02", name: "Sala Server",    loc: "Piso 2",   temp: 19.2,  color: "var(--tg-purple2)" },
                  ].map((s) => (
                    <div key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all hover:translate-x-1 cursor-pointer"
                      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
                      <div className="w-2 h-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                      <div className="flex-1">
                        <p className="text-[12px] font-medium" style={{ color: "var(--tg-text)" }}>{s.name}</p>
                        <p className="text-[10px]" style={{ color: "var(--tg-muted)" }}>{s.loc}</p>
                      </div>
                      <span className="font-['Orbitron'] text-[13px] font-bold" style={{ color: s.color }}>
                        {s.temp > 0 ? "+" : ""}{s.temp.toFixed(1)}°
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Bar charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <Card>
                <p className="text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--tg-muted)" }}>
                  Distribuição de Temperatura por Zona
                </p>
                <BarChartZones zones={zoneNames} temps={zoneTemps} colors={zoneColors} />
              </Card>
              <Card>
                <p className="text-[11px] uppercase tracking-widest mb-3" style={{ color: "var(--tg-muted)" }}>
                  Tendência Semanal — Temp. Média
                </p>
                <WeekChart vals={weekVals} days={weekDays} />
              </Card>
            </div>

            {/* Original chart + alerts + report */}
            {selectedEnv && (
              <div className="w-full h-[300px]">
                <TemperatureChart env={selectedEnv} T={T} />
              </div>
            )}
            <AlertsList alerts={alertsData} onVerify={handleVerify} T={T} />
            <AuditReport alerts={alertsData} T={T} />
          </div>
        )}
       


      </div>
    </div>
  );
}