"use client";
import { useState } from "react";
import {
  Thermometer, Shield, AlertTriangle, CheckCircle2, Plus,
  Activity, Bell, Clock, User, FileText, BarChart3,
  Wifi, WifiOff, Snowflake, Flame, Droplets, Wind, Zap
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart
} from "recharts";
import { toast } from "sonner";

// ── palette tokens ──────────────────────────────────────────────────────────
const P = {
  bg:       "#0d0618",
  surface:  "#130920",
  card:     "#1a0d2e",
  border:   "#2d1a4a",
  purple:   "#7c3aed",
  purpleL:  "#a855f7",
  purpleDim:"#3b1a6b",
  yellow:   "#f5c518",
  yellowDim:"#78600a",
  text:     "#e8d5ff",
  muted:    "#7b5ea7",
  faint:    "#3d2660",
};

// ── mock data ───────────────────────────────────────────────────────────────
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
  { id: "a1", envId: "2", envName: "Câmara Fria B", type: "high",    message: "Temperatura acima do limite máximo", temp: -14.1, time: "14:32", verified: false, verifiedBy: null, observation: null },
  { id: "a2", envId: "1", envName: "Câmara Fria A", type: "sensor",  message: "Sensor de umidade sem resposta",     temp: -18.2, time: "13:15", verified: true,  verifiedBy: "Operador", observation: "Sensor substituído." },
  { id: "a3", envId: "4", envName: "Estufa 01",     type: "offline", message: "Dispositivo offline",               temp: null,  time: "11:00", verified: false, verifiedBy: null, observation: null },
];

// ── helpers ─────────────────────────────────────────────────────────────────
const envIcon = (icon, cls = "h-5 w-5") => {
  if (icon === "snowflake") return <Snowflake className={cls} />;
  if (icon === "flame")     return <Flame className={cls} />;
  if (icon === "droplets")  return <Droplets className={cls} />;
  return <Wind className={cls} />;
};

const alertMeta = {
  high:    { color: P.yellow,   bg: "#1a1400", border: "#4a3800", label: "Alta" },
  low:     { color: "#60a5fa",  bg: "#001020", border: "#003060", label: "Baixa" },
  sensor:  { color: P.purpleL,  bg: "#1a0a30", border: "#4a1a80", label: "Sensor" },
  offline: { color: P.muted,    bg: "#120820", border: P.faint,   label: "Offline" },
};

// ── PulsingDot ───────────────────────────────────────────────────────────────
const PulsingDot = ({ color = P.purple }) => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
      style={{ backgroundColor: color }} />
    <span className="relative inline-flex rounded-full h-2 w-2"
      style={{ backgroundColor: color }} />
  </span>
);

// ── StatCard ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accentColor }) => (
  <div className="rounded-2xl border p-4 flex items-center gap-4 transition-all hover:scale-[1.02]"
    style={{ background: P.card, borderColor: P.border }}>
    <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${accentColor}18`, border: `1px solid ${accentColor}33` }}>
      <Icon className="h-5 w-5" style={{ color: accentColor }} />
    </div>
    <div>
      <p className="text-2xl font-bold leading-none" style={{ color: P.text, fontFamily: "var(--font-dm-mono)" }}>
        {value}
      </p>
      <p className="text-xs mt-1" style={{ color: P.muted, fontFamily: "var(--font-syne)" }}>{label}</p>
    </div>
  </div>
);

// ── EnvironmentCard ──────────────────────────────────────────────────────────
const EnvironmentCard = ({ env, selected, onClick }) => {
  const isAlert = env.status === "alert" || env.status === "danger";
  const tempColor = isAlert ? P.yellow : P.purpleL;

  return (
    <button onClick={onClick}
      className="w-full text-left rounded-2xl border p-4 transition-all duration-200 hover:scale-[1.02] group"
      style={{
        background: selected ? "#1f0d35" : P.card,
        borderColor: selected ? P.purple : isAlert ? P.yellowDim : P.border,
        boxShadow: selected ? `0 0 0 1px ${P.purple}55, 0 8px 32px #7c3aed22` : "none",
      }}>

      {/* top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ background: `${tempColor}15`, border: `1px solid ${tempColor}30` }}>
          <span style={{ color: tempColor }}>{envIcon(env.icon)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {env.online
            ? <PulsingDot color={isAlert ? P.yellow : P.purple} />
            : <WifiOff className="h-3 w-3" style={{ color: P.faint }} />}
        </div>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wider truncate"
        style={{ color: P.muted, fontFamily: "var(--font-syne)" }}>
        {env.name}
      </p>
      <p className="text-4xl font-bold mt-1 tabular-nums"
        style={{ color: tempColor, fontFamily: "var(--font-dm-mono)", letterSpacing: "-0.02em" }}>
        {env.temp != null ? `${env.temp}°` : "—"}
      </p>

      <div className="flex items-center justify-between mt-2 text-[10px]"
        style={{ color: P.faint, fontFamily: "var(--font-dm-mono)" }}>
        <span>{env.minTemp}° mín</span>
        <span>{env.humidity}% UR</span>
        <span>{env.maxTemp}° máx</span>
      </div>

      {/* sparkline */}
      <div className="mt-3 h-10 opacity-60 group-hover:opacity-90 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={env.history.slice(-14)}>
            <defs>
              <linearGradient id={`sg${env.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tempColor} stopOpacity={0.3} />
                <stop offset="100%" stopColor={tempColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="temp" stroke={tempColor} strokeWidth={1.5}
              fill={`url(#sg${env.id})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </button>
  );
};

// ── TemperatureChart ─────────────────────────────────────────────────────────
const TemperatureChart = ({ env }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl px-3 py-2 text-xs border"
        style={{ background: P.surface, borderColor: P.border }}>
        <p style={{ color: P.muted, fontFamily: "var(--font-syne)" }}>{label}</p>
        <p className="font-bold mt-0.5" style={{ color: P.yellow, fontFamily: "var(--font-dm-mono)", fontSize: 14 }}>
          {payload[0].value}°C
        </p>
      </div>
    );
  };

  return (
    <div className="rounded-2xl border p-5 h-full" style={{ background: P.card, borderColor: P.border }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" style={{ color: P.purple }} />
          <span className="text-sm font-semibold" style={{ color: P.text, fontFamily: "var(--font-syne)" }}>
            {env.name}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: P.purpleDim, color: P.purpleL, fontFamily: "var(--font-syne)" }}>
            24h
          </span>
        </div>
        <span className="text-[10px]" style={{ color: P.muted, fontFamily: "var(--font-dm-mono)" }}>
          ao vivo
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={env.history} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={P.purple} stopOpacity={0.4} />
              <stop offset="100%" stopColor={P.purple} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={P.faint} strokeOpacity={0.5} />
          <XAxis dataKey="time" tick={{ fontSize: 9, fill: P.faint, fontFamily: "var(--font-dm-mono)" }}
            tickLine={false} axisLine={false} interval={3} />
          <YAxis tick={{ fontSize: 9, fill: P.faint, fontFamily: "var(--font-dm-mono)" }}
            tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={env.maxTemp} stroke={P.yellow} strokeDasharray="4 2" strokeOpacity={0.7}
            label={{ value: "máx", fontSize: 8, fill: P.yellow, position: "right" }} />
          <ReferenceLine y={env.minTemp} stroke="#60a5fa" strokeDasharray="4 2" strokeOpacity={0.7}
            label={{ value: "mín", fontSize: 8, fill: "#60a5fa", position: "right" }} />
          <Area type="monotone" dataKey="temp" stroke={P.purpleL} strokeWidth={2}
            fill="url(#tempGrad)" dot={false}
            activeDot={{ r: 5, fill: P.yellow, strokeWidth: 2, stroke: P.bg }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// ── AlertsList ───────────────────────────────────────────────────────────────
const AlertsList = ({ alerts, onVerify }) => (
  <div className="rounded-2xl border h-full flex flex-col" style={{ background: P.card, borderColor: P.border }}>
    <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: P.border }}>
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4" style={{ color: P.purple }} />
        <span className="text-sm font-semibold" style={{ color: P.text, fontFamily: "var(--font-syne)" }}>
          Alertas
        </span>
      </div>
      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
        style={{ background: `${P.yellow}22`, color: P.yellow, fontFamily: "var(--font-dm-mono)" }}>
        {alerts.filter(a => !a.verified).length} pendentes
      </span>
    </div>

    <ScrollArea className="flex-1 px-4 py-3">
      <div className="space-y-2">
        {alerts.map(alert => {
          const meta = alertMeta[alert.type] ?? alertMeta.offline;
          return (
            <div key={alert.id}
              className="rounded-xl border p-3 transition-all"
              style={{
                background: meta.bg,
                borderColor: meta.border,
                opacity: alert.verified ? 0.45 : 1,
              }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{ background: `${meta.color}20`, color: meta.color, fontFamily: "var(--font-syne)" }}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs font-semibold truncate" style={{ color: P.text, fontFamily: "var(--font-syne)" }}>
                    {alert.envName}
                  </p>
                  <p className="text-[10px] mt-0.5 leading-snug" style={{ color: P.muted }}>
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[9px]" style={{ color: P.faint, fontFamily: "var(--font-dm-mono)" }}>
                    <Clock className="h-2.5 w-2.5" />{alert.time}
                    {alert.verified && <><User className="h-2.5 w-2.5 ml-1" />{alert.verifiedBy}</>}
                  </div>
                </div>
                {!alert.verified ? (
                  <button
                    className="text-[10px] px-2.5 py-1 rounded-lg font-semibold transition-all hover:scale-105 shrink-0"
                    style={{ background: `${P.yellow}20`, color: P.yellow, border: `1px solid ${P.yellowDim}`, fontFamily: "var(--font-syne)" }}
                    onClick={() => onVerify(alert.id)}>
                    OK
                  </button>
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: P.purple }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  </div>
);

// ── AuditReport ──────────────────────────────────────────────────────────────
const AuditReport = ({ alerts }) => (
  <div className="rounded-2xl border" style={{ background: P.card, borderColor: P.border }}>
    <div className="flex items-center gap-2 px-5 py-4 border-b" style={{ borderColor: P.border }}>
      <FileText className="h-4 w-4" style={{ color: P.purple }} />
      <span className="text-sm font-semibold" style={{ color: P.text, fontFamily: "var(--font-syne)" }}>
        Relatório de Auditoria
      </span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: `1px solid ${P.border}` }}>
            {["Ambiente", "Tipo", "Mensagem", "Horário", "Status", "Operador"].map(h => (
              <th key={h} className="px-4 py-3 text-left font-semibold uppercase tracking-wider text-[10px]"
                style={{ color: P.muted, fontFamily: "var(--font-syne)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alerts.map((a, i) => {
            const meta = alertMeta[a.type] ?? alertMeta.offline;
            return (
              <tr key={a.id}
                style={{ borderBottom: `1px solid ${P.faint}55`, background: i % 2 === 0 ? "transparent" : "#ffffff04" }}>
                <td className="px-4 py-3 font-medium" style={{ color: P.text, fontFamily: "var(--font-syne)" }}>{a.envName}</td>
                <td className="px-4 py-3">
                  <span className="text-[9px] font-bold uppercase px-2 py-1 rounded"
                    style={{ background: `${meta.color}18`, color: meta.color, border: `1px solid ${meta.border}` }}>
                    {meta.label}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-[200px] truncate" style={{ color: P.muted }}>{a.message}</td>
                <td className="px-4 py-3" style={{ color: P.faint, fontFamily: "var(--font-dm-mono)" }}>{a.time}</td>
                <td className="px-4 py-3">
                  {a.verified
                    ? <span className="flex items-center gap-1" style={{ color: P.purpleL }}><CheckCircle2 className="h-3 w-3" />Verificado</span>
                    : <span className="flex items-center gap-1" style={{ color: P.yellow }}><AlertTriangle className="h-3 w-3" />Pendente</span>}
                </td>
                <td className="px-4 py-3" style={{ color: P.faint, fontFamily: "var(--font-dm-mono)" }}>{a.verifiedBy ?? "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

// ── AddEnvironmentDialog ─────────────────────────────────────────────────────
const AddEnvironmentDialog = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all hover:scale-105"
          style={{ background: `${P.purple}25`, color: P.purpleL, border: `1px solid ${P.purpleDim}`, fontFamily: "var(--font-syne)" }}>
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Novo Ambiente</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm border" style={{ background: P.card, borderColor: P.border }}>
        <DialogHeader>
          <DialogTitle className="text-sm font-bold" style={{ color: P.text, fontFamily: "var(--font-syne)" }}>
            Adicionar Ambiente
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          {[["Nome", "ex: Câmara Fria C"], ["Temp. Mínima (°C)", "-22"], ["Temp. Máxima (°C)", "-15"]].map(([label, placeholder]) => (
            <div key={label} className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: P.muted, fontFamily: "var(--font-syne)" }}>
                {label}
              </label>
              <input placeholder={placeholder}
                className="w-full h-8 px-3 rounded-lg text-xs outline-none transition-all"
                style={{
                  background: P.surface, border: `1px solid ${P.border}`,
                  color: P.text, fontFamily: "var(--font-dm-mono)",
                }} />
            </div>
          ))}
          <button
            className="w-full h-9 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] mt-1"
            style={{ background: P.purple, color: "#fff", fontFamily: "var(--font-syne)" }}
            onClick={() => setOpen(false)}>
            Adicionar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ── INDEX PAGE ───────────────────────────────────────────────────────────────
export default function Index() {
  const [selectedEnv, setSelectedEnv] = useState(initialEnvs[0]);
  const [alertsData, setAlertsData]   = useState(initialAlerts);

  const handleVerify = (alertId) => {
    setAlertsData(prev =>
      prev.map(a =>
        a.id === alertId
          ? { ...a, verified: true, verifiedBy: "Operador", observation: "Verificado no local." }
          : a
      )
    );
    toast.success("Alerta verificado!", {
      style: { background: P.card, border: `1px solid ${P.border}`, color: P.text }
    });
  };

  const stats = {
    total:  initialEnvs.length,
    online: initialEnvs.filter(e => e.online).length,
    alerts: alertsData.filter(a => !a.verified).length,
    ok:     initialEnvs.filter(e => e.status === "ok").length,
  };

  return (
    <div className="min-h-screen" style={{
      background: P.bg,
      backgroundImage: `
        radial-gradient(ellipse 60% 40% at 20% 0%, #3b1a6b33 0%, transparent 60%),
        radial-gradient(ellipse 40% 30% at 80% 100%, #f5c51808 0%, transparent 50%)
      `,
      fontFamily: "var(--font-syne)",
    }}>

      {/* ── header ── */}
      <header className="border-b sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: `${P.bg}cc`, borderColor: P.border }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center"
              style={{ background: `${P.purple}20`, border: `1px solid ${P.purple}40` }}>
              <Thermometer className="h-4 w-4" style={{ color: P.purpleL }} />
            </div>
            <div>
              <h1 className="text-sm font-extrabold leading-none tracking-tight" style={{ color: P.text }}>
                ThermoGuard
              </h1>
              <span className="text-[9px] uppercase tracking-widest" style={{ color: P.faint }}>
                Controle de Temperatura
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs" style={{ color: P.muted }}>
              <PulsingDot color={P.purple} />
              <span>Sistema Ativo</span>
            </div>
            <div className="h-4 w-px" style={{ background: P.border }} />
            <AddEnvironmentDialog />
          </div>
        </div>
      </header>

      {/* ── main ── */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Ambientes"      value={stats.total}  icon={BarChart3}     accentColor={P.purpleL} />
          <StatCard label="Online"         value={stats.online} icon={Wifi}          accentColor={P.purple} />
          <StatCard label="Alertas Ativos" value={stats.alerts} icon={AlertTriangle} accentColor={P.yellow} />
          <StatCard label="Normais"        value={stats.ok}     icon={CheckCircle2}  accentColor="#a78bfa" />
        </div>

        {/* environments */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: P.faint }}>
            Ambientes Monitorados
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {initialEnvs.map(env => (
              <EnvironmentCard key={env.id} env={env}
                selected={selectedEnv.id === env.id}
                onClick={() => setSelectedEnv(env)} />
            ))}
          </div>
        </section>

        {/* chart + alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ minHeight: 300 }}>
          <div className="lg:col-span-2">
            <TemperatureChart env={selectedEnv} />
          </div>
          <AlertsList alerts={alertsData} onVerify={handleVerify} />
        </div>

        {/* audit */}
        <AuditReport alerts={alertsData} />

        {/* footer */}
        <p className="text-center text-[10px] pb-4" style={{ color: P.faint, fontFamily: "var(--font-dm-mono)" }}>
          ThermoGuard © 2025 — Monitoramento em tempo real
        </p>
      </main>
    </div>
  );
}