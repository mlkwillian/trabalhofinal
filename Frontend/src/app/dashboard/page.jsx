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
import Chatbot from "@/components/Chatbot";
import {
  BarChart3, Wifi, AlertTriangle, CheckCircle2,
  Thermometer, Snowflake, Flame, Activity,
} from "lucide-react";

/* ─── dados estáticos do HTML ─── */
const TOP_SENSORS = [
  { id: "S-04", name: "Câm. Frig. B",  loc: "Piso -2 • Bloco B", temp: -32.1, color: "#ef4444" },
  { id: "S-11", name: "Estufa C",       loc: "Piso 3 • Bloco C",  temp:  78.4, color: "#f59e0b" },
  { id: "S-01", name: "Recepção",       loc: "Piso 1 • Entrada",  temp:  22.0, color: "#10b981" },
  { id: "S-07", name: "Lab. Criog.",    loc: "Piso -1 • Bloco A", temp: -18.5, color: "#3b82f6" },
  { id: "S-02", name: "Sala Server",    loc: "Piso 2 • TI",       temp:  19.2, color: "#a855f7" },
];

const SENSOR_DOTS = [
  "#10b981","#10b981","#10b981","#10b981","#10b981","#10b981",
  "#f59e0b","#10b981","#ef4444","#10b981","#10b981","#10b981",
];

const ZONES = ["A","B","C","D","E","F"];
const ZONE_TEMPS   = [22, -18, 72, 15, -5, 45];
const ZONE_HUM     = [65, 82, 45, 70, 55, 90];
const WEEK_DAYS    = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
const WEEK_VALS    = [18.2, 21.5, 19.8, 24.3, 22.1, 17.6, 20.4];

/* ─── helpers SVG ─── */
function genLine(base, noise, len) {
  const pts = []; let v = base;
  for (let i = 0; i < len; i++) {
    v += (Math.random() - 0.5) * noise;
    pts.push(Math.round(v * 10) / 10);
  }
  return pts;
}
function toPath(pts, w, h, yMin, yMax) {
  return pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((v - yMin) / (yMax - yMin)) * (h - 20) - 10;
    return (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
  }).join(" ");
}

/* ─── Gráfico de linha principal ─── */
function MainLineChart() {
  const [paths, setPaths] = useState({ a: "", b: "", c: "", aFill: "", bFill: "", cFill: "" });
  useEffect(() => {
    const W = 540, H = 180;
    const pts_a = genLine(22, 8, 24);
    const pts_b = genLine(-18, 5, 24);
    const pts_c = genLine(72, 12, 24);
    const allVals = [...pts_a, ...pts_b, ...pts_c];
    const yMin = Math.min(...allVals) - 5;
    const yMax = Math.max(...allVals) + 5;
    const pa = toPath(pts_a, W, H, yMin, yMax);
    const pb = toPath(pts_b, W, H, yMin, yMax);
    const pc = toPath(pts_c, W, H, yMin, yMax);
    const bottom = `L${W} ${H-10} L0 ${H-10} Z`;
    setPaths({ a: pa, b: pb, c: pc, aFill: pa + bottom, bFill: pb + bottom, cFill: pc + bottom });
  }, []);

  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const y = 10 + (i / 4) * 160;
    return <line key={i} x1="0" y1={y} x2="540" y2={y} stroke="rgba(124,58,237,0.08)" strokeWidth="1" />;
  });
  const hours = Array.from({ length: 7 }, (_, i) => {
    const x = (i / 6) * 540;
    return <text key={i} x={x} y="178" fill="rgba(148,163,184,0.5)" fontSize="9" fontFamily="Inter" textAnchor="middle">{`${i * 4}h`}</text>;
  });

  return (
    <svg width="100%" height="180" viewBox="0 0 540 180" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="gb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f87171" stopOpacity="0.2"/>
          <stop offset="100%" stopColor="#f87171" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {gridLines}
      {hours}
      {paths.aFill && <path d={paths.aFill} fill="url(#ga)" />}
      {paths.bFill && <path d={paths.bFill} fill="url(#gb)" />}
      {paths.cFill && <path d={paths.cFill} fill="url(#gc)" />}
      {paths.a && <path d={paths.a} fill="none" stroke="#a855f7" strokeWidth="2" />}
      {paths.b && <path d={paths.b} fill="none" stroke="#60a5fa" strokeWidth="2" />}
      {paths.c && <path d={paths.c} fill="none" stroke="#f87171" strokeWidth="2" />}
    </svg>
  );
}

/* ─── Gauge SVG ─── */
function GaugeSVG() {
  return (
    <svg width="160" height="130" viewBox="0 0 160 100">
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#3b82f6"/>
          <stop offset="40%"  stopColor="#10b981"/>
          <stop offset="65%"  stopColor="#f59e0b"/>
          <stop offset="100%" stopColor="#ef4444"/>
        </linearGradient>
      </defs>
      <path d="M 20 90 A 60 60 0 0 1 140 90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round"/>
      <path d="M 20 90 A 60 60 0 0 1 140 90" fill="none" stroke="url(#gaugeGrad)" strokeWidth="10" strokeLinecap="round"/>
      <line x1="80" y1="90" x2="80" y2="38" stroke="white" strokeWidth="2" strokeLinecap="round" transform="rotate(7 80 90)" style={{ transition: "transform 1.5s cubic-bezier(0.34,1.56,0.64,1)" }}/>
      <circle cx="80" cy="90" r="5" fill="#7c3aed"/>
      <text x="16" y="100" fill="#60a5fa" fontSize="8" fontFamily="Inter">Baixo</text>
      <text x="115" y="100" fill="#ef4444" fontSize="8" fontFamily="Inter">Alto</text>
      <text x="68" y="75" fill="white" fontSize="14" fontFamily="Orbitron,monospace" fontWeight="700">72</text>
    </svg>
  );
}

/* ─── Bar Chart por zona ─── */
function BarZoneChart() {
  const W = 480, H = 130;
  const barW = 50;
  const gap = (W - ZONES.length * barW) / (ZONES.length + 1);
  const tempMin = -30, tempMax = 90;

  const bars = ZONES.map((z, i) => {
    const t = ZONE_TEMPS[i];
    const pct = (t - tempMin) / (tempMax - tempMin);
    const barH = Math.abs(pct - 0.5) * (H - 40) * 1.2;
    const col = t < -10 ? "#60a5fa" : t < 30 ? "#10b981" : t < 60 ? "#f59e0b" : "#ef4444";
    const x = gap + i * (barW + gap);
    const baseY = H - 20 - ((0 - tempMin) / (tempMax - tempMin)) * (H - 40);
    const y = t >= 0 ? baseY - barH : baseY;
    const labelY = t >= 0 ? y - 5 : y + barH + 13;
    return (
      <g key={z}>
        <rect x={x} y={y} width={barW} height={barH} rx="4" fill={col} opacity="0.8"/>
        <text x={x + barW / 2} y={labelY} fill={col} fontSize="10" fontFamily="Orbitron,monospace" fontWeight="700" textAnchor="middle">{t}°</text>
        <text x={x + barW / 2} y={H - 5} fill="rgba(148,163,184,0.7)" fontSize="10" fontFamily="Inter" textAnchor="middle">Zona {z}</text>
      </g>
    );
  });
  const baseY = H - 20 - ((0 - tempMin) / (tempMax - tempMin)) * (H - 40);
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <line x1="0" y1={baseY} x2={W} y2={baseY} stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4"/>
      {bars}
    </svg>
  );
}

/* ─── Humidity Chart ─── */
function HumChart() {
  const W = 340, H = 130;
  const barW = 24;
  const gap = (W - 30 - ZONES.length * barW) / (ZONES.length + 1);
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const y = 10 + i * (H - 30) / 4;
    return (
      <g key={i}>
        <line x1="30" y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
        <text x="28" y={y + 4} fill="rgba(148,163,184,0.4)" fontSize="9" fontFamily="Inter" textAnchor="end">{100 - i * 25}%</text>
      </g>
    );
  });
  const bars = ZONES.map((z, i) => {
    const x = 30 + gap + i * (barW + gap);
    const h = ZONE_HUM[i];
    const barH = (h / 100) * (H - 40);
    const y = H - 20 - barH;
    return (
      <g key={z}>
        <rect x={x} y={y} width={barW} height={barH} rx="3" fill="#60a5fa" opacity="0.7"/>
        <text x={x + barW / 2} y={H - 5} fill="rgba(148,163,184,0.6)" fontSize="9" fontFamily="Inter" textAnchor="middle">Z{z}</text>
        <text x={x + barW / 2} y={y - 3} fill="#93c5fd" fontSize="9" fontFamily="Inter" textAnchor="middle">{h}%</text>
      </g>
    );
  });
  return (
    <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      {gridLines}
      {bars}
    </svg>
  );
}

/* ═══════════════════════════════ PAGE ═══════════════════════════════ */
export default function DashboardPage() {
  const [envs, setEnvs] = useState([]);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [alertsData, setAlertsData] = useState([]);
  const [timeRange, setTimeRange] = useState("hoje");
  const [loading, setLoading] = useState(true);
  const [clock, setClock] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [avgTemp, setAvgTemp] = useState(21.4);
  const [liveVisible, setLiveVisible] = useState(true);

  const { dark } = useTheme();
  const T = dark ? themes.dark : themes.light;
  const router = useRouter();

  /* relógio */
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

  /* temp flutuante */
  useEffect(() => {
    const id = setInterval(() => setAvgTemp((v) => +(v + (Math.random() - 0.5) * 1.5).toFixed(1)), 3000);
    return () => clearInterval(id);
  }, []);

  /* live label pisca */
  useEffect(() => {
    const id = setInterval(() => setLiveVisible((v) => !v), 800);
    return () => clearInterval(id);
  }, []);

  /* rota */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/");
  }, []);

  /* dados */
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

  const handleVerify = (alertId) =>
    setAlertsData((prev) =>
      prev.map((a) => (a.id_incidente === alertId ? { ...a, verified: true } : a))
    );

  const complianceScore = useMemo(() => {
    const total = alertsData.length;
    const verified = alertsData.filter((a) => a.verified).length;
    return total > 0 ? Math.round((verified / total) * 100) : 100;
  }, [alertsData]);

  const stats = [
    { label: "Ambientes",           value: envs.length,                                               icon: BarChart3,    accentColor: "#7c3aed" },
    { label: "Dispositivos Online", value: `${envs.filter((e) => e.online).length}/${envs.length}`,  icon: Wifi,         accentColor: "#22c55e" },
    { label: "Alertas Ativos",      value: alertsData.filter((a) => !a.verified).length,              icon: AlertTriangle, accentColor: "#f97316" },
    { label: "SLA de Resposta",     value: `${complianceScore}%`,                                     icon: CheckCircle2, accentColor: "#3b82f6" },
  ];

  /* ─── Loading ─── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#080516" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap');`}</style>
        <div className="text-center space-y-4">
          <div className="text-lg tracking-widest" style={{ fontFamily: "'Orbitron', monospace", color: "#a855f7" }}>TERMOGUARD</div>
          <div className="flex gap-1.5 justify-center">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#7c3aed", animationDelay: `${i * 0.15}s` }}/>
            ))}
          </div>
          <p className="text-xs tracking-widest" style={{ color: "rgba(168,85,247,0.4)" }}>CARREGANDO DADOS...</p>
        </div>
      </div>
    );
  }

  /* ─── Render ─── */
  return (
    <div className="min-h-screen space-y-6 p-6" style={{ background: "#080516" }}>
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
        .tg-chart-card {
          background: linear-gradient(135deg, #0f0f1e, #141428);
          border: 1px solid rgba(124,58,237,0.25);
          border-radius: 16px;
          padding: 18px;
          position: relative;
          overflow: hidden;
        }
        .tg-chart-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #a855f7, transparent);
          opacity: 0.4;
        }
        .tg-grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(124,58,237,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,58,237,0.04) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
          border-radius: 16px;
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
        .tg-range-btn:not(.active) { color: rgba(148,163,184,0.6); }
        .tg-range-btn:not(.active):hover { color: rgba(148,163,184,0.9); background: rgba(255,255,255,0.04); }
        .tg-sensor-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          transition: all 0.2s;
          cursor: pointer;
        }
        .tg-sensor-item:hover {
          background: rgba(124,58,237,0.08);
          border-color: rgba(124,58,237,0.3);
          transform: translateX(3px);
        }
        .tg-stat-mini {
          background: rgba(255,255,255,0.04);
          border-radius: 10px;
          padding: 10px;
          text-align: center;
        }
      `}</style>

      {/* ── HEADER ── */}
      <div className="tg-glass-header flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 20px rgba(124,58,237,0.45)" }}
          >
            🌡️
          </div>
          <div>
            <div className="text-lg font-bold" style={{ fontFamily: "'Orbitron', monospace", background: "linear-gradient(135deg, #a855f7, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "1px" }}>
              TERMOGUARD
            </div>
            <div style={{ color: "rgba(148,163,184,0.5)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" }}>
              Painel de Controle Térmico
            </div>
          </div>
        </div>

        {/* relógio + time range */}
        <div className="flex items-center gap-4">
          <div style={{ fontFamily: "'Orbitron', monospace", textAlign: "right" }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#c084fc" }}>{clock}</div>
            <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)" }}>{dateStr}</div>
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(124,58,237,0.2)" }}>
            {["hoje", "semana", "mês"].map((range) => (
              <button key={range} onClick={() => setTimeRange(range)} className={`tg-range-btn ${timeRange === range ? "active" : ""}`}>
                {range}
              </button>
            ))}
          </div>
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
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${s.accentColor}55`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 24px ${s.accentColor}20`; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(124,58,237,0.2)"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.accentColor}18`, border: `1px solid ${s.accentColor}30` }}>
                <s.icon size={18} style={{ color: s.accentColor }}/>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Orbitron', monospace", color: s.accentColor }}>{s.value}</div>
                <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CARDS TEMPERATURA (do HTML) ── */}
      <div>
        <div className="tg-section-label mb-3">Leituras Térmicas</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Temp Média */}
          <div className="tg-chart-card">
            <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.6)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Thermometer size={13} style={{ color: "#a855f7" }}/> Temp. Média
            </div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "26px", fontWeight: 700, color: "#a855f7", lineHeight: 1, marginBottom: "6px" }}>{avgTemp.toFixed(1)}°C</div>
            <div style={{ fontSize: "11px", color: "#f87171", display: "flex", alignItems: "center", gap: "4px" }}>↑ +2.3° última hora</div>
            <div style={{ marginTop: "10px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "52%", background: "linear-gradient(to right,#7c3aed,#a855f7)", borderRadius: "4px", transition: "width 1s" }}/>
            </div>
          </div>
          {/* Mín */}
          <div className="tg-chart-card">
            <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.6)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Snowflake size={13} style={{ color: "#60a5fa" }}/> Mín. Registrada
            </div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "26px", fontWeight: 700, color: "#60a5fa", lineHeight: 1, marginBottom: "6px" }}>-32.1°C</div>
            <div style={{ fontSize: "11px", color: "#60a5fa" }}>↓ Câmara Criogênica</div>
            <div style={{ marginTop: "10px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "12%", background: "linear-gradient(to right,#1d4ed8,#60a5fa)", borderRadius: "4px" }}/>
            </div>
          </div>
          {/* Máx — crítico */}
          <div className="tg-chart-card" style={{ borderColor: "rgba(239,68,68,0.6)", boxShadow: "0 0 24px rgba(239,68,68,0.25)" }}>
            <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.6)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Flame size={13} style={{ color: "#ef4444" }}/> Máx. Registrada
            </div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "26px", fontWeight: 700, color: "#ef4444", lineHeight: 1, marginBottom: "6px" }}>+78.4°C</div>
            <div style={{ fontSize: "11px", color: "#ef4444" }}>⚠ ALERTA ATIVO</div>
            <div style={{ marginTop: "10px", height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "88%", background: "linear-gradient(to right,#dc2626,#f87171)", borderRadius: "4px" }}/>
            </div>
          </div>
          {/* Sensores online */}
          <div className="tg-chart-card">
            <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.6)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
              <Activity size={13} style={{ color: "#10b981" }}/> Sensores Online
            </div>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "26px", fontWeight: 700, color: "#10b981", lineHeight: 1, marginBottom: "6px" }}>12/12</div>
            <div style={{ fontSize: "11px", color: "#10b981" }}>100% operacionais</div>
            <div style={{ display: "flex", gap: "3px", marginTop: "10px", flexWrap: "wrap" }}>
              {SENSOR_DOTS.map((col, i) => (
                <div key={i} style={{ width: "10px", height: "10px", borderRadius: "3px", background: col, boxShadow: `0 0 6px ${col}` }}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── GRÁFICO PRINCIPAL + GAUGE + TOP SENSORES ── */}
      <div>
        <div className="tg-section-label mb-3">Temperatura em Tempo Real</div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Linha chart */}
          <div className="lg:col-span-6 tg-chart-card">
            <div className="tg-grid-overlay"/>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(148,163,184,0.6)", marginBottom: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Últimas 24h</span>
              <span style={{ color: "#a855f7", opacity: liveVisible ? 1 : 0.3, transition: "opacity 0.3s" }}>● AO VIVO</span>
            </div>
            <MainLineChart/>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px", fontSize: "10px", color: "rgba(148,163,184,0.6)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "12px", height: "2px", background: "#a855f7", display: "inline-block", borderRadius: "2px" }}/> Zona A</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "12px", height: "2px", background: "#60a5fa", display: "inline-block", borderRadius: "2px" }}/> Zona B (Frio)</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><span style={{ width: "12px", height: "2px", background: "#f87171", display: "inline-block", borderRadius: "2px" }}/> Zona C (Crítica)</span>
            </div>
          </div>

          {/* Gauge */}
          <div className="lg:col-span-3 tg-chart-card flex flex-col items-center">
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(148,163,184,0.6)", marginBottom: "14px", width: "100%" }}>Índice de Risco Térmico</div>
            <GaugeSVG/>
            <div style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600, letterSpacing: "1px", marginTop: "4px" }}>⚠ RISCO MODERADO</div>
            <div className="grid grid-cols-3 gap-2 w-full mt-4">
              {[{ val: 3, lbl: "Normal", col: "#10b981" }, { val: 2, lbl: "Alerta", col: "#f59e0b" }, { val: 1, lbl: "Crítico", col: "#ef4444" }].map((s) => (
                <div key={s.lbl} className="tg-stat-mini">
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "14px", fontWeight: 700, color: s.col }}>{s.val}</div>
                  <div style={{ fontSize: "9px", color: "rgba(148,163,184,0.5)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px" }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Sensores */}
          <div className="lg:col-span-3 tg-chart-card">
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(148,163,184,0.6)", marginBottom: "14px" }}>Top Sensores Ativos</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {TOP_SENSORS.map((s) => (
                <div key={s.id} className="tg-sensor-item">
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: s.color, boxShadow: `0 0 6px ${s.color}`, flexShrink: 0 }}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.id} {s.name}</div>
                    <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.5)" }}>{s.loc}</div>
                  </div>
                  <div style={{ fontFamily: "'Orbitron', monospace", fontSize: "12px", fontWeight: 700, color: s.color, flexShrink: 0 }}>{s.temp > 0 ? "+" : ""}{s.temp}°</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── DIST. ZONA + UMIDADE ── */}
      <div>
        <div className="tg-section-label mb-3">Distribuição Zonal</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="tg-chart-card">
            <div className="tg-grid-overlay"/>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(148,163,184,0.6)", marginBottom: "14px", display: "flex", justifyContent: "space-between" }}>
              <span>Distribuição de Temperatura por Zona</span>
              <span style={{ fontSize: "10px", color: "rgba(148,163,184,0.4)" }}>Hoje</span>
            </div>
            <BarZoneChart/>
          </div>
          <div className="tg-chart-card">
            <div className="tg-grid-overlay"/>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(148,163,184,0.6)", marginBottom: "14px", display: "flex", justifyContent: "space-between" }}>
              <span>Umidade Relativa & Ponto de Orvalho</span>
              <span style={{ fontSize: "10px", color: "rgba(148,163,184,0.4)" }}>Zonas A–F</span>
            </div>
            <HumChart/>
          </div>
        </div>
      </div>

      {/* ── AMBIENTES (existente) ── */}
      {envs.length > 0 && (
        <div>
          <div className="tg-section-label mb-3">Ambientes Monitorados</div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {envs.map((env) => (
              <EnvironmentCard key={env.id} env={env} selected={selectedEnv?.id === env.id} onClick={() => setSelectedEnv(env)} T={T}/>
            ))}
          </div>
        </div>
      )}

      {/* ── GRÁFICO EXISTENTE ── */}
      {selectedEnv && (
        <div>
          <div className="tg-section-label mb-3">Histórico de Temperatura</div>
          <div className="tg-glass overflow-hidden" style={{ height: "320px", padding: "0" }}>
            <TemperatureChart env={selectedEnv} T={T}/>
          </div>
        </div>
      )}

      {/* ── ALERTAS + AUDITORIA ── */}
      <div>
        <div className="tg-section-label mb-3">Alertas & Auditoria</div>
        <div className="space-y-4">
          <AlertsList alerts={alertsData} onVerify={handleVerify} T={T}/>
          <AuditReport alerts={alertsData} T={T}/>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-[10px] tracking-widest" style={{ fontFamily: "'Orbitron', monospace", color: "rgba(168,85,247,0.25)" }}>
        © 2026 TERMOGUARD — SISTEMA DE MONITORAMENTO TÉRMICO
      </div>

      <Chatbot/>
    </div>
  );
}