"use client";
import { useState, useRef, useEffect } from "react";
import {
  Thermometer, Shield, AlertTriangle, CheckCircle2, Plus,
  Activity, Bell, Clock, User, FileText, BarChart3,
  Wifi, WifiOff, Snowflake, Flame, Droplets, Wind, Sun, Moon,
  TrendingUp, TrendingDown, RefreshCw, Zap
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from "recharts";
import { toast } from "sonner";

// ── Theme tokens ─────────────────────────────────────────────────────────────
const themes = {
  dark: {
    bg:         "#080612",
    bgGrad:     "radial-gradient(ellipse 80% 50% at 10% -10%, #2a0e5522 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 110%, #f5c51806 0%, transparent 50%)",
    surface:    "#100a1e",
    card:       "#140c24",
    cardHover:  "#1c1230",
    border:     "#251840",
    borderSoft: "#1a1030",
    purple:     "#7c3aed",
    purpleL:    "#a78bfa",
    purpleDim:  "#2d1560",
    accent:     "#f5c518",
    accentDim:  "#5a420a",
    accentSoft: "#f5c51812",
    blue:       "#38bdf8",
    green:      "#34d399",
    red:        "#f87171",
    text:       "#ede9fe",
    textSub:    "#a393c8",
    muted:      "#6b5c8a",
    faint:      "#2e2050",
    glass:      "rgba(20,12,36,0.85)",
    shadow:     "0 8px 32px rgba(0,0,0,0.6)",
    cold:       { bg: "#060f1a", border: "#1a4060", text: "#7dd3fc", overlay: "#38bdf808" },
  },
  light: {
    bg:         "#f5f0ff",
    bgGrad:     "radial-gradient(ellipse 80% 50% at 10% -10%, #ede9fe 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 110%, #fef3c7 0%, transparent 50%)",
    surface:    "#faf8ff",
    card:       "#ffffff",
    cardHover:  "#f5f0ff",
    border:     "#e2d9f3",
    borderSoft: "#ede9fe",
    purple:     "#7c3aed",
    purpleL:    "#6d28d9",
    purpleDim:  "#ede9fe",
    accent:     "#d97706",
    accentDim:  "#fde68a",
    accentSoft: "#fef3c710",
    blue:       "#0284c7",
    green:      "#059669",
    red:        "#dc2626",
    text:       "#1e1233",
    textSub:    "#5b4d7a",
    muted:      "#7c6fa0",
    faint:      "#c4b5d8",
    glass:      "rgba(250,248,255,0.92)",
    shadow:     "0 8px 32px rgba(100,60,180,0.1)",
    cold:       { bg: "#f0f9ff", border: "#bae6fd", text: "#0369a1", overlay: "#e0f2fe40" },
  }
};

// ── Mock data ────────────────────────────────────────────────────────────────
const generateHistory = (base, variance, points = 24) =>
  Array.from({ length: points }, (_, i) => ({
    time: `${String(i).padStart(2, "0")}:00`,
    temp: +(base + (Math.random() - 0.5) * variance * 2).toFixed(1),
  }));

const initialEnvs = [
  { id: "1", name: "Câmara Fria A", icon: "snowflake", temp: -18.2, minTemp: -22, maxTemp: -15, humidity: 68, status: "ok",    online: true,  history: generateHistory(-18, 2) },
  { id: "2", name: "Câmara Fria B", icon: "snowflake", temp: -14.1, minTemp: -22, maxTemp: -15, humidity: 71, status: "alert", online: true,  history: generateHistory(-14, 3) },
  { id: "3", name: "Sala de Vacinas",icon: "droplets", temp:   4.8, minTemp:   2, maxTemp:   8, humidity: 55, status: "ok",    online: true,  history: generateHistory(5, 1.5) },
  { id: "4", name: "Estufa 01",     icon: "flame",    temp:  37.4, minTemp:  35, maxTemp:  40, humidity: 42, status: "ok",    online: false, history: generateHistory(37, 2) },
];

const initialAlerts = [
  { id: "a1", envId: "2", envName: "Câmara Fria B", type: "high",    message: "Temperatura acima do limite máximo", temp: -14.1, time: "14:32", verified: false, verifiedBy: null },
  { id: "a2", envId: "1", envName: "Câmara Fria A", type: "sensor",  message: "Sensor de umidade sem resposta",     temp: -18.2, time: "13:15", verified: true,  verifiedBy: "Operador" },
  { id: "a3", envId: "4", envName: "Estufa 01",     type: "offline", message: "Dispositivo offline",               temp: null,  time: "11:00", verified: false, verifiedBy: null },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
const envIcon = (icon, cls = "h-5 w-5") => {
  if (icon === "snowflake") return <Snowflake className={cls} />;
  if (icon === "flame")     return <Flame className={cls} />;
  if (icon === "droplets")  return <Droplets className={cls} />;
  return <Wind className={cls} />;
};

const alertMeta = {
  high:    { label: "Alta",    getColor: (T) => ({ color: T.accent,  bg: T.accentSoft, border: T.accentDim }) },
  low:     { label: "Baixa",   getColor: (T) => ({ color: T.blue,    bg: `${T.blue}10`, border: `${T.blue}30` }) },
  sensor:  { label: "Sensor",  getColor: (T) => ({ color: T.purpleL, bg: T.purpleDim,  border: T.border }) },
  offline: { label: "Offline", getColor: (T) => ({ color: T.muted,   bg: T.borderSoft, border: T.border }) },
};

// ── Snow Effect ──────────────────────────────────────────────────────────────
const useSnowEffect = (canvasRef, active) => {
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const particles = [];
    let animId = null;
    let running = true;

    const spawn = () => ({
      x: Math.random() * canvas.width, y: -10,
      r: Math.random() * 2.8 + 0.8,
      speed: Math.random() * 0.9 + 0.3,
      drift: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      spin: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.03,
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (active && Math.random() < 0.3) particles.push(spawn());
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y += p.speed; p.x += p.drift; p.spin += p.spinSpeed;
        if (p.y > canvas.height + 10) { particles.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.spin);
        if (p.r > 1.8) {
          ctx.strokeStyle = "#bae6fd"; ctx.lineWidth = 0.6;
          for (let a = 0; a < 6; a++) {
            ctx.save(); ctx.rotate(a * Math.PI / 3);
            ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -p.r * 2.8); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, -p.r * 1.2); ctx.lineTo(-p.r * 0.7, -p.r * 1.8); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, -p.r * 1.2); ctx.lineTo(p.r * 0.7, -p.r * 1.8); ctx.stroke();
            ctx.restore();
          }
        } else {
          ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2);
          ctx.fillStyle = "#bae6fd"; ctx.fill();
        }
        ctx.restore();
      }
      if (running || particles.length > 0) animId = requestAnimationFrame(draw);
    };

    if (active) draw();
    return () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active, canvasRef]);
};

// ── PulsingDot ────────────────────────────────────────────────────────────────
const PulsingDot = ({ color }) => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ backgroundColor: color }} />
    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: color }} />
  </span>
);

// ── StatCard ──────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accentColor, T, trend }) => (
  <div
    className="rounded-2xl border p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] cursor-default group"
    style={{ background: T.card, borderColor: T.border, boxShadow: T.shadow }}
  >
    <div
      className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
      style={{ background: `${accentColor}15`, border: `1.5px solid ${accentColor}30` }}
    >
      <Icon className="h-5 w-5" style={{ color: accentColor }} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-3xl font-black leading-none tabular-nums" style={{ color: T.text, fontFamily: "'Space Mono', monospace" }}>
        {value}
      </p>
      <p className="text-[11px] mt-1 font-semibold uppercase tracking-widest truncate" style={{ color: T.muted }}>
        {label}
      </p>
    </div>
    {trend !== undefined && (
      <div className="shrink-0">
        {trend >= 0
          ? <TrendingUp className="h-4 w-4" style={{ color: T.green }} />
          : <TrendingDown className="h-4 w-4" style={{ color: T.red }} />
        }
      </div>
    )}
  </div>
);

// ── EnvironmentCard ───────────────────────────────────────────────────────────
const EnvironmentCard = ({ env, selected, onClick, T }) => {
  const isCold = env.icon === "snowflake";
  const canvasRef = useRef(null);
  useSnowEffect(canvasRef, selected && isCold);

  const isAlert = env.status === "alert" || env.status === "danger";

  const tempColor = selected && isCold ? T.cold.text
    : isAlert ? T.accent : T.purpleL;

  const borderColor = selected && isCold ? T.cold.border
    : selected ? T.purple
    : isAlert ? T.accentDim
    : T.border;

  const bgColor = selected && isCold ? T.cold.bg
    : selected ? T.cardHover : T.card;

  const boxShadow = selected
    ? (isCold
        ? `0 0 0 1.5px ${T.cold.border}, 0 12px 40px rgba(56,189,248,0.12)`
        : `0 0 0 1.5px ${T.purple}60, 0 12px 40px rgba(124,58,237,0.15)`)
    : T.shadow;

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl border p-4 group"
      style={{
        background: bgColor, borderColor,
        boxShadow, position: "relative", overflow: "hidden",
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {isCold && (
        <canvas ref={canvasRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 16, zIndex: 1 }}
          width={260} height={280} />
      )}

      {isCold && selected && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none", zIndex: 0,
          background: `linear-gradient(135deg, ${T.cold.overlay} 0%, transparent 100%)`,
        }} />
      )}

      <div style={{ position: "relative", zIndex: 2 }}>
        <div className="flex items-start justify-between mb-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{ background: `${tempColor}15`, border: `1.5px solid ${tempColor}25` }}
          >
            <span style={{ color: tempColor }}>{envIcon(env.icon)}</span>
          </div>
          <div className="flex items-center gap-2">
            {env.online
              ? <><PulsingDot color={selected && isCold ? T.blue : isAlert ? T.accent : T.purple} />
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: T.muted }}>online</span></>
              : <><WifiOff className="h-3 w-3" style={{ color: T.faint }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: T.faint }}>offline</span></>
            }
          </div>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.18em] truncate" style={{ color: T.muted }}>
          {env.name}
        </p>
        <p
          className="text-4xl font-black mt-1 tabular-nums leading-none"
          style={{ color: tempColor, fontFamily: "'Space Mono', monospace", letterSpacing: "-0.02em" }}
        >
          {env.temp != null ? `${env.temp}°` : "—"}
        </p>

        {/* range bar */}
        <div className="mt-3 relative">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: T.borderSoft }}>
            {env.temp != null && (() => {
              const range = env.maxTemp - env.minTemp;
              const pct = Math.min(100, Math.max(0, ((env.temp - env.minTemp) / range) * 100));
              const inRange = env.temp >= env.minTemp && env.temp <= env.maxTemp;
              return (
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: inRange
                      ? `linear-gradient(90deg, ${T.blue}80, ${T.purple})`
                      : `linear-gradient(90deg, ${T.accent}, ${T.red})`,
                  }}
                />
              );
            })()}
          </div>
          <div className="flex items-center justify-between mt-1.5 text-[9px]"
            style={{ color: T.faint, fontFamily: "'Space Mono', monospace" }}>
            <span>{env.minTemp}°</span>
            <span style={{ color: T.muted }}>{env.humidity}% UR</span>
            <span>{env.maxTemp}°</span>
          </div>
        </div>

        {/* sparkline */}
        <div className="mt-3 h-10 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={env.history.slice(-14)}>
              <defs>
                <linearGradient id={`sg${env.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tempColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={tempColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="temp" stroke={tempColor} strokeWidth={1.5}
                fill={`url(#sg${env.id})`} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </button>
  );
};

// ── TemperatureChart ──────────────────────────────────────────────────────────
const TemperatureChart = ({ env, T }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl px-3 py-2.5 text-xs border backdrop-blur-md"
        style={{ background: T.glass, borderColor: T.border, boxShadow: T.shadow }}>
        <p style={{ color: T.muted, fontFamily: "'Space Mono', monospace", fontSize: 10 }}>{label}</p>
        <p className="font-black mt-0.5" style={{ color: T.accent, fontFamily: "'Space Mono', monospace", fontSize: 16 }}>
          {payload[0].value}°C
        </p>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border p-6 h-full" style={{ background: T.card, borderColor: T.border, boxShadow: T.shadow }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: `${T.purple}15` }}>
            <Activity className="h-4 w-4" style={{ color: T.purpleL }} />
          </div>
          <div>
            <span className="text-sm font-black" style={{ color: T.text }}>{env.name}</span>
            <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: T.muted }}>Histórico 24h</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full"
            style={{ background: T.borderSoft, color: T.muted }}>
            <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: T.green }} />
            Ao vivo
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={env.history} margin={{ top: 10, right: 20, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGradMain" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={T.purple} stopOpacity={0.35} />
              <stop offset="100%" stopColor={T.purple} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={T.borderSoft} strokeOpacity={0.8} />
          <XAxis dataKey="time"
            tick={{ fontSize: 9, fill: T.faint, fontFamily: "'Space Mono', monospace" }}
            tickLine={false} axisLine={false} interval={3} />
          <YAxis
            tick={{ fontSize: 9, fill: T.faint, fontFamily: "'Space Mono', monospace" }}
            tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: T.border, strokeWidth: 1 }} />
          <ReferenceLine y={env.maxTemp} stroke={T.accent} strokeDasharray="5 3" strokeOpacity={0.8}
            label={{ value: "máx", fontSize: 9, fill: T.accent, position: "right" }} />
          <ReferenceLine y={env.minTemp} stroke={T.blue} strokeDasharray="5 3" strokeOpacity={0.8}
            label={{ value: "mín", fontSize: 9, fill: T.blue, position: "right" }} />
          <Area type="monotone" dataKey="temp" stroke={T.purpleL} strokeWidth={2.5}
            fill="url(#tempGradMain)" dot={false}
            activeDot={{ r: 6, fill: T.accent, strokeWidth: 2.5, stroke: T.card }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// ── Alert type configs ────────────────────────────────────────────────────────
const alertConfig = {
  high:    { label: "Temperatura Alta", icon: Flame,         getStyle: (T) => ({ color: "#f97316", glow: "#f9731630", border: "#f9731640", bg: "#f9731608", stripe: "#f9731615" }) },
  low:     { label: "Temperatura Baixa",icon: Snowflake,     getStyle: (T) => ({ color: T.blue,    glow: `${T.blue}30`, border: `${T.blue}40`, bg: `${T.blue}08`, stripe: `${T.blue}15` }) },
  sensor:  { label: "Falha de Sensor",  icon: Zap,           getStyle: (T) => ({ color: T.purpleL, glow: `${T.purpleL}30`, border: `${T.purpleL}40`, bg: `${T.purpleL}08`, stripe: `${T.purpleL}15` }) },
  offline: { label: "Dispositivo Offline", icon: WifiOff,   getStyle: (T) => ({ color: T.muted,   glow: `${T.muted}20`, border: T.border, bg: T.borderSoft, stripe: `${T.muted}10` }) },
};

// ── AlertCard ─────────────────────────────────────────────────────────────────
const AlertCard = ({ alert, onVerify, T }) => {
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
        boxShadow: pending ? `0 0 0 0px ${s.glow}, 0 4px 20px ${s.glow}` : "none",
        opacity: alert.verified ? 0.55 : 1,
      }}
    >
      {/* colored left bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: pending
          ? `linear-gradient(180deg, ${s.color}, ${s.color}88)`
          : T.border,
        borderRadius: "2px 0 0 2px",
      }} />

      {/* subtle background tint */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(135deg, ${s.stripe} 0%, transparent 60%)`,
        pointerEvents: "none",
      }} />

      <div className="relative pl-5 pr-4 py-4">
        <div className="flex items-start gap-3">

          {/* icon bubble */}
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{
              background: `${s.color}18`,
              border: `1.5px solid ${s.color}35`,
              boxShadow: pending ? `0 0 12px ${s.color}25` : "none",
            }}
          >
            <Icon className="h-4.5 w-4.5" style={{ color: s.color, width: 18, height: 18 }} />
          </div>

          {/* content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span
                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}30` }}
              >
                {cfg.label}
              </span>
              <span className="text-[10px] tabular-nums shrink-0" style={{ color: T.muted, fontFamily: "'Space Mono', monospace" }}>
                {alert.time}
              </span>
            </div>

            <p className="text-sm font-black leading-tight" style={{ color: T.text }}>
              {alert.envName}
            </p>
            <p className="text-[11px] mt-1 leading-snug" style={{ color: T.textSub }}>
              {alert.message}
            </p>

            {/* footer row */}
            <div className="flex items-center justify-between mt-3 gap-2">
              {alert.verified && alert.verifiedBy ? (
                <div className="flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-lg"
                  style={{ background: `${T.green}15`, color: T.green, border: `1px solid ${T.green}30` }}>
                  <CheckCircle2 className="h-3 w-3" />
                  <span className="font-bold">Verificado por {alert.verifiedBy}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[10px]" style={{ color: T.muted }}>
                  <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: s.color }} />
                  <span>Aguardando verificação</span>
                </div>
              )}

              {pending && (
                <button
                  onClick={() => onVerify(alert.id)}
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
};

// ── AlertsList ────────────────────────────────────────────────────────────────
const AlertsList = ({ alerts, onVerify, T }) => {
  const pending = alerts.filter(a => !a.verified);
  const resolved = alerts.filter(a => a.verified);

  return (
    <div className="rounded-2xl border h-full flex flex-col" style={{ background: T.card, borderColor: T.border, boxShadow: T.shadow }}>

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: T.border }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center relative"
              style={{ background: `${T.accent}18`, border: `1.5px solid ${T.accent}35` }}>
              <Bell className="h-4 w-4" style={{ color: T.accent }} />
              {pending.length > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-black"
                  style={{ background: T.accent, color: "#fff" }}
                >
                  {pending.length}
                </span>
              )}
            </div>
            <div>
              <span className="text-sm font-black" style={{ color: T.text }}>Central de Alertas</span>
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.muted }}>Monitoramento ativo</p>
            </div>
          </div>
        </div>

        {/* summary pills */}
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full font-bold flex-1 justify-center"
            style={{ background: `${T.accent}15`, color: T.accent, border: `1px solid ${T.accent}30` }}>
            <AlertTriangle className="h-3 w-3" />
            {pending.length} pendente{pending.length !== 1 ? "s" : ""}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full font-bold flex-1 justify-center"
            style={{ background: `${T.green}15`, color: T.green, border: `1px solid ${T.green}30` }}>
            <CheckCircle2 className="h-3 w-3" />
            {resolved.length} resolvido{resolved.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Alerts list */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-3">
          {pending.length > 0 && (
            <>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] px-1" style={{ color: T.accent }}>
                ● Pendentes
              </p>
              {pending.map(alert => (
                <AlertCard key={alert.id} alert={alert} onVerify={onVerify} T={T} />
              ))}
            </>
          )}

          {resolved.length > 0 && (
            <>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] px-1 mt-4" style={{ color: T.green }}>
                ✓ Resolvidos
              </p>
              {resolved.map(alert => (
                <AlertCard key={alert.id} alert={alert} onVerify={onVerify} T={T} />
              ))}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

// ── AuditReport ───────────────────────────────────────────────────────────────
const AuditReport = ({ alerts, T }) => (
  <div className="rounded-2xl border" style={{ background: T.card, borderColor: T.border, boxShadow: T.shadow }}>
    <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor: T.border }}>
      <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: `${T.purpleL}15` }}>
        <FileText className="h-4 w-4" style={{ color: T.purpleL }} />
      </div>
      <div>
        <span className="text-sm font-black" style={{ color: T.text }}>Relatório de Auditoria</span>
        <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.muted }}>Registro de eventos</p>
      </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: `1px solid ${T.border}`, background: T.borderSoft }}>
            {["Ambiente", "Tipo", "Mensagem", "Horário", "Status", "Operador"].map(h => (
              <th key={h} className="px-5 py-3 text-left font-black uppercase tracking-wider text-[10px]"
                style={{ color: T.muted }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alerts.map((a, i) => {
            const meta = alertMeta[a.type] ?? alertMeta.offline;
            const { color, border } = meta.getColor(T);
            return (
              <tr key={a.id}
                className="transition-colors duration-150 hover:bg-opacity-50"
                style={{ borderBottom: `1px solid ${T.borderSoft}`, background: i % 2 === 0 ? "transparent" : T.borderSoft + "40" }}>
                <td className="px-5 py-3.5 font-bold" style={{ color: T.text }}>{a.envName}</td>
                <td className="px-5 py-3.5">
                  <span className="text-[9px] font-black uppercase px-2 py-1 rounded-md"
                    style={{ background: `${color}15`, color, border: `1px solid ${border}` }}>
                    {meta.label}
                  </span>
                </td>
                <td className="px-5 py-3.5 max-w-[200px] truncate" style={{ color: T.muted }}>{a.message}</td>
                <td className="px-5 py-3.5" style={{ color: T.faint, fontFamily: "'Space Mono', monospace" }}>{a.time}</td>
                <td className="px-5 py-3.5">
                  {a.verified
                    ? <span className="flex items-center gap-1.5 font-bold" style={{ color: T.green }}>
                        <CheckCircle2 className="h-3.5 w-3.5" />Verificado
                      </span>
                    : <span className="flex items-center gap-1.5 font-bold" style={{ color: T.accent }}>
                        <AlertTriangle className="h-3.5 w-3.5" />Pendente
                      </span>}
                </td>
                <td className="px-5 py-3.5" style={{ color: T.faint, fontFamily: "'Space Mono', monospace" }}>
                  {a.verifiedBy ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ── AddEnvironmentDialog ──────────────────────────────────────────────────────
const AddEnvironmentDialog = ({ T }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl font-black transition-all duration-200 hover:scale-105"
          style={{
            background: `${T.purple}20`, color: T.purpleL,
            border: `1.5px solid ${T.purpleDim}`,
          }}>
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Novo Ambiente</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm border" style={{ background: T.card, borderColor: T.border }}>
        <DialogHeader>
          <DialogTitle className="text-sm font-black" style={{ color: T.text }}>
            Adicionar Ambiente
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-3">
          {[["Nome", "ex: Câmara Fria C"], ["Temp. Mínima (°C)", "-22"], ["Temp. Máxima (°C)", "-15"]].map(([label, placeholder]) => (
            <div key={label} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: T.muted }}>{label}</label>
              <input placeholder={placeholder}
                className="w-full h-9 px-3 rounded-xl text-xs outline-none transition-all"
                style={{ background: T.surface, border: `1.5px solid ${T.border}`, color: T.text, fontFamily: "'Space Mono', monospace" }} />
            </div>
          ))}
          <button
            className="w-full h-10 rounded-xl text-xs font-black transition-all hover:scale-[1.02] mt-2"
            style={{ background: T.purple, color: "#fff" }}
            onClick={() => setOpen(false)}>
            Adicionar Ambiente
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ── ThemeToggle ───────────────────────────────────────────────────────────────
const ThemeToggle = ({ isDark, onToggle, T }) => (
  <button
    onClick={onToggle}
    className="h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
    style={{ background: T.borderSoft, border: `1.5px solid ${T.border}`, color: T.muted }}
    title={isDark ? "Modo claro" : "Modo escuro"}
  >
    {isDark
      ? <Sun className="h-4 w-4" style={{ color: T.accent }} />
      : <Moon className="h-4 w-4" style={{ color: T.purpleL }} />}
  </button>
);

// ── INDEX PAGE ────────────────────────────────────────────────────────────────
export default function Index() {
  const [isDark, setIsDark]           = useState(true);
  const [selectedEnv, setSelectedEnv] = useState(initialEnvs[0]);
  const [alertsData, setAlertsData]   = useState(initialAlerts);

  const T = isDark ? themes.dark : themes.light;

  const handleVerify = (alertId) => {
    setAlertsData(prev =>
      prev.map(a => a.id === alertId
        ? { ...a, verified: true, verifiedBy: "Operador" }
        : a)
    );
    toast.success("Alerta verificado com sucesso!", {
      style: { background: T.card, border: `1px solid ${T.border}`, color: T.text }
    });
  };

  const stats = [
    { label: "Ambientes",      value: initialEnvs.length,                              icon: BarChart3,     accentColor: T.purpleL },
    { label: "Online",         value: initialEnvs.filter(e => e.online).length,        icon: Wifi,          accentColor: T.green },
    { label: "Alertas Ativos", value: alertsData.filter(a => !a.verified).length,      icon: AlertTriangle, accentColor: T.accent },
    { label: "Normais",        value: initialEnvs.filter(e => e.status === "ok").length,icon: CheckCircle2, accentColor: T.blue },
  ];

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ background: T.bg, backgroundImage: T.bgGrad }}
    >
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');`}</style>

      {/* ── Header ── */}
      <header
        className="border-b sticky top-0 z-50 backdrop-blur-xl transition-colors duration-500"
        style={{ background: T.glass, borderColor: T.border }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-2xl flex items-center justify-center"
              style={{ background: `${T.purple}20`, border: `1.5px solid ${T.purple}40` }}
            >
              <Thermometer className="h-5 w-5" style={{ color: T.purpleL }} />
            </div>
            <div>
              <h1 className="text-base font-black leading-none tracking-tight" style={{ color: T.text, fontFamily: "'Space Mono', monospace" }}>
                ThermoGuard
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: T.muted }}>
                Controle de Temperatura
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
              style={{ background: T.borderSoft, color: T.muted }}>
              <PulsingDot color={T.green} />
              <span className="font-semibold">Sistema Ativo</span>
            </div>
            <div className="h-5 w-px" style={{ background: T.border }} />
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} T={T} />
            <AddEnvironmentDialog T={T} />
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-7 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(s => (
            <StatCard key={s.label} T={T} {...s} />
          ))}
        </div>

        {/* Environments */}
        <section>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-3" style={{ color: T.faint }}>
            Ambientes Monitorados
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {initialEnvs.map(env => (
              <EnvironmentCard key={env.id} env={env} T={T}
                selected={selectedEnv.id === env.id}
                onClick={() => setSelectedEnv(env)} />
            ))}
          </div>
        </section>

        {/* Chart + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: 320 }}>
          <div className="lg:col-span-2">
            <TemperatureChart env={selectedEnv} T={T} />
          </div>
          <AlertsList alerts={alertsData} onVerify={handleVerify} T={T} />
        </div>

        {/* Audit */}
        <AuditReport alerts={alertsData} T={T} />

        {/* Footer */}
        <p className="text-center text-[10px] pb-6 font-bold" style={{ color: T.faint, fontFamily: "'Space Mono', monospace" }}>
          ThermoGuard © 2025 — Monitoramento em tempo real
        </p>
      </main>
    </div>
  );
}