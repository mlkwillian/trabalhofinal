"use client";
import { useState, useRef, useEffect } from "react";
import {
  Thermometer, Shield, AlertTriangle, CheckCircle2, Plus,
  Activity, Bell, Clock, User, FileText, BarChart3,
  Wifi, WifiOff, Snowflake, Flame, Droplets, Wind, Sun, Moon,
  TrendingUp, TrendingDown, RefreshCw, Zap,
  LayoutDashboard, Home, Settings, LogOut, ChevronLeft,
  ChevronRight, Menu, X, Gauge
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
    sidebar:    "#0b0818",
    sidebarBorder: "#1e1438",
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
    sidebar:    "#faf8ff",
    sidebarBorder: "#e2d9f3",
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

// ── Nav pages ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard",     label: "Dashboard",    icon: LayoutDashboard },
  { id: "ambientes",     label: "Ambientes",    icon: Home },
  { id: "alertas",       label: "Alertas",      icon: Bell,      badge: true },
  { id: "historico",     label: "Histórico",    icon: Activity },
  { id: "relatorios",    label: "Relatórios",   icon: FileText },
  { id: "configuracoes", label: "Configurações",icon: Settings },
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
  const tempColor = selected && isCold ? T.cold.text : isAlert ? T.accent : T.purpleL;
  const borderColor = selected && isCold ? T.cold.border : selected ? T.purple : isAlert ? T.accentDim : T.border;
  const bgColor = selected && isCold ? T.cold.bg : selected ? T.cardHover : T.card;
  const boxShadow = selected
    ? (isCold ? `0 0 0 1.5px ${T.cold.border}, 0 12px 40px rgba(56,189,248,0.12)` : `0 0 0 1.5px ${T.purple}60, 0 12px 40px rgba(124,58,237,0.15)`)
    : T.shadow;

  return (
    <button onClick={onClick} className="w-full text-left rounded-2xl border p-4 group"
      style={{ background: bgColor, borderColor, boxShadow, position: "relative", overflow: "hidden", transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)" }}>
      {isCold && (
        <canvas ref={canvasRef}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 16, zIndex: 1 }}
          width={260} height={280} />
      )}
      {isCold && selected && (
        <div style={{ position: "absolute", inset: 0, borderRadius: 16, pointerEvents: "none", zIndex: 0, background: `linear-gradient(135deg, ${T.cold.overlay} 0%, transparent 100%)` }} />
      )}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div className="flex items-start justify-between mb-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300"
            style={{ background: `${tempColor}15`, border: `1.5px solid ${tempColor}25` }}>
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
        <p className="text-[10px] font-black uppercase tracking-[0.18em] truncate" style={{ color: T.muted }}>{env.name}</p>
        <p className="text-4xl font-black mt-1 tabular-nums leading-none"
          style={{ color: tempColor, fontFamily: "'Space Mono', monospace", letterSpacing: "-0.02em" }}>
          {env.temp != null ? `${env.temp}°` : "—"}
        </p>
        <div className="mt-3 relative">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: T.borderSoft }}>
            {env.temp != null && (() => {
              const range = env.maxTemp - env.minTemp;
              const pct = Math.min(100, Math.max(0, ((env.temp - env.minTemp) / range) * 100));
              const inRange = env.temp >= env.minTemp && env.temp <= env.maxTemp;
              return (
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: inRange ? `linear-gradient(90deg, ${T.blue}80, ${T.purple})` : `linear-gradient(90deg, ${T.accent}, ${T.red})` }} />
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
        <div className="mt-3 h-10 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={env.history.slice(-14)}>
              <defs>
                <linearGradient id={`sg${env.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={tempColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={tempColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="temp" stroke={tempColor} strokeWidth={1.5} fill={`url(#sg${env.id})`} dot={false} />
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
        <div className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full"
          style={{ background: T.borderSoft, color: T.muted }}>
          <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: T.green }} />
          Ao vivo
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
          <XAxis dataKey="time" tick={{ fontSize: 9, fill: T.faint, fontFamily: "'Space Mono', monospace" }} tickLine={false} axisLine={false} interval={3} />
          <YAxis tick={{ fontSize: 9, fill: T.faint, fontFamily: "'Space Mono', monospace" }} tickLine={false} axisLine={false} />
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

// ── Alert configs ─────────────────────────────────────────────────────────────
const alertConfig = {
  high:    { label: "Temperatura Alta",    icon: Flame,    getStyle: (T) => ({ color: "#f97316", glow: "#f9731630", border: "#f9731640", bg: "#f9731608", stripe: "#f9731615" }) },
  low:     { label: "Temperatura Baixa",   icon: Snowflake,getStyle: (T) => ({ color: T.blue,    glow: `${T.blue}30`, border: `${T.blue}40`, bg: `${T.blue}08`, stripe: `${T.blue}15` }) },
  sensor:  { label: "Falha de Sensor",     icon: Zap,      getStyle: (T) => ({ color: T.purpleL, glow: `${T.purpleL}30`, border: `${T.purpleL}40`, bg: `${T.purpleL}08`, stripe: `${T.purpleL}15` }) },
  offline: { label: "Dispositivo Offline", icon: WifiOff,  getStyle: (T) => ({ color: T.muted,   glow: `${T.muted}20`, border: T.border, bg: T.borderSoft, stripe: `${T.muted}10` }) },
};

// ── AlertCard ─────────────────────────────────────────────────────────────────
const AlertCard = ({ alert, onVerify, T }) => {
  const cfg = alertConfig[alert.type] ?? alertConfig.offline;
  const s = cfg.getStyle(T);
  const Icon = cfg.icon;
  const pending = !alert.verified;
  return (
    <div className="relative rounded-2xl overflow-hidden transition-all duration-300"
      style={{ border: `1.5px solid ${s.border}`, background: T.card, boxShadow: pending ? `0 0 0 0px ${s.glow}, 0 4px 20px ${s.glow}` : "none", opacity: alert.verified ? 0.55 : 1 }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: pending ? `linear-gradient(180deg, ${s.color}, ${s.color}88)` : T.border, borderRadius: "2px 0 0 2px" }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${s.stripe} 0%, transparent 60%)`, pointerEvents: "none" }} />
      <div className="relative pl-5 pr-4 py-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: `${s.color}18`, border: `1.5px solid ${s.color}35`, boxShadow: pending ? `0 0 12px ${s.color}25` : "none" }}>
            <Icon className="h-4.5 w-4.5" style={{ color: s.color, width: 18, height: 18 }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}30` }}>{cfg.label}</span>
              <span className="text-[10px] tabular-nums shrink-0" style={{ color: T.muted, fontFamily: "'Space Mono', monospace" }}>{alert.time}</span>
            </div>
            <p className="text-sm font-black leading-tight" style={{ color: T.text }}>{alert.envName}</p>
            <p className="text-[11px] mt-1 leading-snug" style={{ color: T.textSub }}>{alert.message}</p>
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
                <button onClick={() => onVerify(alert.id)}
                  className="flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-xl font-black transition-all duration-200 hover:scale-105 shrink-0"
                  style={{ background: `${s.color}22`, color: s.color, border: `1.5px solid ${s.color}50`, boxShadow: `0 2px 8px ${s.color}20` }}>
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
      <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: T.border }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center relative"
              style={{ background: `${T.accent}18`, border: `1.5px solid ${T.accent}35` }}>
              <Bell className="h-4 w-4" style={{ color: T.accent }} />
              {pending.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-black"
                  style={{ background: T.accent, color: "#fff" }}>{pending.length}</span>
              )}
            </div>
            <div>
              <span className="text-sm font-black" style={{ color: T.text }}>Central de Alertas</span>
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: T.muted }}>Monitoramento ativo</p>
            </div>
          </div>
        </div>
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
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-3">
          {pending.length > 0 && (
            <>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] px-1" style={{ color: T.accent }}>● Pendentes</p>
              {pending.map(alert => <AlertCard key={alert.id} alert={alert} onVerify={onVerify} T={T} />)}
            </>
          )}
          {resolved.length > 0 && (
            <>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] px-1 mt-4" style={{ color: T.green }}>✓ Resolvidos</p>
              {resolved.map(alert => <AlertCard key={alert.id} alert={alert} onVerify={onVerify} T={T} />)}
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
              <th key={h} className="px-5 py-3 text-left font-black uppercase tracking-wider text-[10px]" style={{ color: T.muted }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alerts.map((a, i) => {
            const meta = alertMeta[a.type] ?? alertMeta.offline;
            const { color, border } = meta.getColor(T);
            return (
              <tr key={a.id} className="transition-colors duration-150"
                style={{ borderBottom: `1px solid ${T.borderSoft}`, background: i % 2 === 0 ? "transparent" : T.borderSoft + "40" }}>
                <td className="px-5 py-3.5 font-bold" style={{ color: T.text }}>{a.envName}</td>
                <td className="px-5 py-3.5">
                  <span className="text-[9px] font-black uppercase px-2 py-1 rounded-md"
                    style={{ background: `${color}15`, color, border: `1px solid ${border}` }}>{meta.label}</span>
                </td>
                <td className="px-5 py-3.5 max-w-[200px] truncate" style={{ color: T.muted }}>{a.message}</td>
                <td className="px-5 py-3.5" style={{ color: T.faint, fontFamily: "'Space Mono', monospace" }}>{a.time}</td>
                <td className="px-5 py-3.5">
                  {a.verified
                    ? <span className="flex items-center gap-1.5 font-bold" style={{ color: T.green }}><CheckCircle2 className="h-3.5 w-3.5" />Verificado</span>
                    : <span className="flex items-center gap-1.5 font-bold" style={{ color: T.accent }}><AlertTriangle className="h-3.5 w-3.5" />Pendente</span>}
                </td>
                <td className="px-5 py-3.5" style={{ color: T.faint, fontFamily: "'Space Mono', monospace" }}>{a.verifiedBy ?? "—"}</td>
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
        <button className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl font-black transition-all duration-200 hover:scale-105"
          style={{ background: `${T.purple}20`, color: T.purpleL, border: `1.5px solid ${T.purpleDim}` }}>
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Novo Ambiente</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm border" style={{ background: T.card, borderColor: T.border }}>
        <DialogHeader>
          <DialogTitle className="text-sm font-black" style={{ color: T.text }}>Adicionar Ambiente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-3">
          {[["Nome", "ex: Câmara Fria C"], ["Temp. Mínima (°C)", "-22"], ["Temp. Máxima (°C)", "-15"]].map(([label, placeholder]) => (
            <div key={label} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: T.muted }}>{label}</label>
              <input placeholder={placeholder} className="w-full h-9 px-3 rounded-xl text-xs outline-none transition-all"
                style={{ background: T.surface, border: `1.5px solid ${T.border}`, color: T.text, fontFamily: "'Space Mono', monospace" }} />
            </div>
          ))}
          <button className="w-full h-10 rounded-xl text-xs font-black transition-all hover:scale-[1.02] mt-2"
            style={{ background: T.purple, color: "#fff" }} onClick={() => setOpen(false)}>
            Adicionar Ambiente
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
const Sidebar = ({ T, isDark, onToggleTheme, currentPage, onNavigate, alertCount, collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) => {
  const user = { name: "Admin ThermoGuard", email: "admin@thermoguard.com", initials: "AT" };
  const [showUserMenu, setShowUserMenu] = useState(false);

  const sidebarWidth = collapsed ? 64 : 220;

  const content = (
    <div style={{
      width: sidebarWidth,
      height: "100vh",
      background: T.sidebar,
      borderRight: `1px solid ${T.sidebarBorder}`,
      display: "flex",
      flexDirection: "column",
      transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
      position: "relative",
      flexShrink: 0,
      overflow: "hidden",
    }}>
      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center",
        gap: 10,
        padding: collapsed ? "18px 0" : "18px 16px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderBottom: `1px solid ${T.sidebarBorder}`,
        minHeight: 64,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: `linear-gradient(135deg, ${T.purple}, ${T.purpleL})`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Thermometer style={{ width: 16, height: 16, color: "#fff" }} />
        </div>
        {!collapsed && (
          <div style={{ overflow: "hidden" }}>
            <p style={{ color: T.text, fontWeight: 800, fontSize: 13, margin: 0, fontFamily: "'Space Mono', monospace", whiteSpace: "nowrap" }}>ThermoGuard</p>
            <p style={{ color: T.muted, fontSize: 9, margin: 0, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Controle de Temp.</p>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button onClick={onToggleCollapse} style={{
        position: "absolute", top: 20, right: -12,
        width: 24, height: 24, borderRadius: "50%",
        background: T.card, border: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", zIndex: 50, color: T.purpleL,
        transition: "background 0.2s",
      }}>
        {collapsed
          ? <ChevronRight style={{ width: 10, height: 10 }} />
          : <ChevronLeft style={{ width: 10, height: 10 }} />}
      </button>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: 2, overflowY: "auto", overflowX: "hidden" }}>
        {NAV_ITEMS.map((item) => {
          const isActive = currentPage === item.id;
          const Icon = item.icon;
          const badgeCount = item.badge ? alertCount : 0;
          return (
            <button key={item.id} onClick={() => { onNavigate(item.id); onCloseMobile?.(); }}
              title={collapsed ? item.label : undefined}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 8, border: "none", cursor: "pointer",
                color: isActive ? T.purpleL : T.muted,
                background: isActive ? `${T.purple}14` : "transparent",
                borderLeft: `2px solid ${isActive ? T.purple : "transparent"}`,
                transition: "all 0.18s",
                position: "relative",
                fontSize: 13, fontWeight: isActive ? 700 : 400,
                whiteSpace: "nowrap", width: "100%", textAlign: "left",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = `${T.purple}08`; e.currentTarget.style.color = T.purpleL; }}}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.muted; }}}
            >
              <span style={{ flexShrink: 0, position: "relative" }}>
                <Icon style={{ width: 17, height: 17 }} />
                {collapsed && badgeCount > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -4, width: 7, height: 7, borderRadius: "50%", background: T.accent }} />
                )}
              </span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && badgeCount > 0 && (
                <span style={{ marginLeft: "auto", background: T.accent, color: "#fff", fontSize: 9, fontWeight: 800, borderRadius: 10, padding: "1px 6px", flexShrink: 0 }}>
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: 1, background: T.sidebarBorder, margin: "0 8px" }} />

      {/* Theme toggle row */}
      <div style={{ padding: "8px 8px 0" }}>
        <button onClick={onToggleTheme} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: collapsed ? "10px 0" : "10px 12px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 8, border: "none", cursor: "pointer",
          color: T.muted, background: "transparent",
          transition: "all 0.18s", width: "100%", fontSize: 13, fontFamily: "inherit",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${T.purple}08`; e.currentTarget.style.color = T.purpleL; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.muted; }}
        >
          {isDark
            ? <Sun style={{ width: 17, height: 17, flexShrink: 0, color: T.accent }} />
            : <Moon style={{ width: 17, height: 17, flexShrink: 0, color: T.purpleL }} />}
          {!collapsed && <span>{isDark ? "Modo Claro" : "Modo Escuro"}</span>}
        </button>
      </div>

      {/* User section */}
      <div style={{ padding: "8px", borderTop: `1px solid ${T.sidebarBorder}`, position: "relative" }}>
        <button onClick={() => setShowUserMenu(v => !v)} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 10,
          padding: collapsed ? "10px 0" : "10px 12px",
          justifyContent: collapsed ? "center" : "flex-start",
          borderRadius: 8, background: showUserMenu ? `${T.purple}10` : "transparent",
          border: "none", cursor: "pointer", transition: "background 0.18s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = `${T.purple}08`; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = showUserMenu ? `${T.purple}10` : "transparent"; }}
        >
          {/* Avatar */}
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: `linear-gradient(135deg, ${T.purpleDim}, ${T.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 800, color: T.purpleL, flexShrink: 0,
            border: `1.5px solid ${T.purpleL}30`, fontFamily: "'Space Mono', monospace",
          }}>
            {user.initials}
          </div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, textAlign: "left", overflow: "hidden", minWidth: 0 }}>
                <p style={{ color: T.text, fontSize: 12, fontWeight: 700, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
                <p style={{ color: T.faint, fontSize: 10, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Space Mono', monospace" }}>{user.email}</p>
              </div>
              <ChevronLeft style={{ width: 13, height: 13, color: T.muted, flexShrink: 0, transform: showUserMenu ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform 0.2s" }} />
            </>
          )}
        </button>

        {/* User dropdown */}
        {showUserMenu && (
          <div style={{
            position: "absolute",
            bottom: collapsed ? 64 : 84,
            left: collapsed ? 72 : 8, right: collapsed ? "auto" : 8,
            width: collapsed ? 180 : "auto",
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 12, overflow: "hidden",
            boxShadow: T.shadow, zIndex: 100,
          }}>
            {[
              { label: "Meu Perfil", icon: User, action: () => { onNavigate("perfil"); setShowUserMenu(false); } },
              { label: "Configurações", icon: Settings, action: () => { onNavigate("configuracoes"); setShowUserMenu(false); } },
            ].map(({ label, icon: Icon, action }) => (
              <button key={label} onClick={action} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", color: T.purpleL, background: "transparent",
                border: "none", cursor: "pointer", fontSize: 12, textAlign: "left", fontFamily: "inherit",
                transition: "background 0.15s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${T.purple}10`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <Icon style={{ width: 14, height: 14 }} />
                {label}
              </button>
            ))}
            <div style={{ height: 1, background: T.border, margin: "2px 0" }} />
            <button onClick={() => { setShowUserMenu(false); toast("Logout efetuado!", { style: { background: T.card, border: `1px solid ${T.border}`, color: T.text } }); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px", color: T.red, background: "transparent",
                border: "none", cursor: "pointer", fontSize: 12, textAlign: "left", fontFamily: "inherit",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = `${T.red}10`; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <LogOut style={{ width: 14, height: 14 }} />
              Sair
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex" style={{ position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
        {content}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
            onClick={onCloseMobile} />
          <div style={{ position: "relative", zIndex: 201 }}>{content}</div>
        </div>
      )}
    </>
  );
};

// ── Placeholder pages ─────────────────────────────────────────────────────────
const PlaceholderPage = ({ title, icon: Icon, T }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <div style={{ width: 72, height: 72, borderRadius: 20, background: `${T.purple}15`, border: `1.5px solid ${T.purpleDim}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Icon style={{ width: 32, height: 32, color: T.purpleL }} />
    </div>
    <p style={{ color: T.text, fontFamily: "'Space Mono', monospace", fontWeight: 800, fontSize: 18 }}>{title}</p>
    <p style={{ color: T.muted, fontSize: 12 }}>Página em construção</p>
  </div>
);

// ── INDEX PAGE ────────────────────────────────────────────────────────────────
export default function Index() {
  const [isDark, setIsDark]             = useState(true);
  const [selectedEnv, setSelectedEnv]   = useState(initialEnvs[0]);
  const [alertsData, setAlertsData]     = useState(initialAlerts);
  const [currentPage, setCurrentPage]   = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false);

  const T = isDark ? themes.dark : themes.light;
  const pendingAlerts = alertsData.filter(a => !a.verified).length;

  const handleVerify = (alertId) => {
    setAlertsData(prev =>
      prev.map(a => a.id === alertId ? { ...a, verified: true, verifiedBy: "Operador" } : a)
    );
    toast.success("Alerta verificado com sucesso!", {
      style: { background: T.card, border: `1px solid ${T.border}`, color: T.text }
    });
  };

  const stats = [
    { label: "Ambientes",      value: initialEnvs.length,                               icon: BarChart3,     accentColor: T.purpleL },
    { label: "Online",         value: initialEnvs.filter(e => e.online).length,         icon: Wifi,          accentColor: T.green },
    { label: "Alertas Ativos", value: alertsData.filter(a => !a.verified).length,       icon: AlertTriangle, accentColor: T.accent },
    { label: "Normais",        value: initialEnvs.filter(e => e.status === "ok").length, icon: CheckCircle2, accentColor: T.blue },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map(s => <StatCard key={s.label} T={T} {...s} />)}
            </div>
            <section>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-3" style={{ color: T.faint }}>Ambientes Monitorados</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {initialEnvs.map(env => (
                  <EnvironmentCard key={env.id} env={env} T={T}
                    selected={selectedEnv.id === env.id} onClick={() => setSelectedEnv(env)} />
                ))}
              </div>
            </section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: 320 }}>
              <div className="lg:col-span-2"><TemperatureChart env={selectedEnv} T={T} /></div>
              <AlertsList alerts={alertsData} onVerify={handleVerify} T={T} />
            </div>
            <AuditReport alerts={alertsData} T={T} />
          </div>
        );
      case "ambientes":
        return (
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.22em]" style={{ color: T.faint }}>Todos os Ambientes</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {initialEnvs.map(env => (
                <EnvironmentCard key={env.id} env={env} T={T}
                  selected={selectedEnv.id === env.id} onClick={() => setSelectedEnv(env)} />
              ))}
            </div>
            <div className="mt-4"><TemperatureChart env={selectedEnv} T={T} /></div>
          </div>
        );
      case "alertas":
        return (
          <div className="max-w-2xl">
            <AlertsList alerts={alertsData} onVerify={handleVerify} T={T} />
          </div>
        );
      case "relatorios":
        return <AuditReport alerts={alertsData} T={T} />;
      default:
        return (
          <PlaceholderPage
            title={NAV_ITEMS.find(n => n.id === currentPage)?.label ?? currentPage}
            icon={NAV_ITEMS.find(n => n.id === currentPage)?.icon ?? Gauge}
            T={T}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen transition-colors duration-500"
      style={{ background: T.bg, backgroundImage: T.bgGrad }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');`}</style>

      {/* Sidebar */}
      <Sidebar
        T={T}
        isDark={isDark}
        onToggleTheme={() => setIsDark(d => !d)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        alertCount={pendingAlerts}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(c => !c)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="border-b sticky top-0 z-40 backdrop-blur-xl transition-colors duration-500"
          style={{ background: T.glass, borderColor: T.border }}>
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button className="flex md:hidden items-center justify-center h-9 w-9 rounded-xl"
                style={{ background: T.borderSoft, border: `1px solid ${T.border}`, color: T.muted }}
                onClick={() => setMobileMenuOpen(true)}>
                <Menu style={{ width: 18, height: 18 }} />
              </button>

              {/* Breadcrumb */}
              <div>
                <h1 className="text-sm font-black" style={{ color: T.text, fontFamily: "'Space Mono', monospace" }}>
                  {NAV_ITEMS.find(n => n.id === currentPage)?.label ?? "ThermoGuard"}
                </h1>
                <p className="text-[9px] font-bold uppercase tracking-widest hidden sm:block" style={{ color: T.muted }}>
                  Controle de Temperatura
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
                style={{ background: T.borderSoft, color: T.muted }}>
                <PulsingDot color={T.green} />
                <span className="font-semibold">Sistema Ativo</span>
              </div>
              {pendingAlerts > 0 && (
                <button onClick={() => setCurrentPage("alertas")}
                  className="relative h-9 w-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${T.accent}15`, border: `1.5px solid ${T.accent}35`, color: T.accent }}>
                  <Bell style={{ width: 16, height: 16 }} />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-black"
                    style={{ background: T.accent, color: "#fff" }}>{pendingAlerts}</span>
                </button>
              )}
              <AddEnvironmentDialog T={T} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 py-7">
          {renderPage()}
          <p className="text-center text-[10px] pb-6 mt-8 font-bold" style={{ color: T.faint, fontFamily: "'Space Mono', monospace" }}>
            ThermoGuard © 2025 — Monitoramento em tempo real
          </p>
        </main>
      </div>
    </div>
  );
}