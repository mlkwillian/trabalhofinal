"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";

// ─── CSS global (mesma base do Dashboard) ────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');

  :root {
    --tg-bg:      #0a0a14;
    --tg-bg2:     #0f0f1e;
    --tg-bg3:     #141428;
    --tg-purple:  #7c3aed;
    --tg-purple2: #a855f7;
    --tg-purple3: #c084fc;
    --tg-pglow:   rgba(124,58,237,0.35);
    --tg-red:     #ef4444;
    --tg-amber:   #f59e0b;
    --tg-green:   #10b981;
    --tg-blue:    #3b82f6;
    --tg-text:    #e2e8f0;
    --tg-muted:   #94a3b8;
    --tg-border:  rgba(124,58,237,0.22);
  }

  @keyframes tg-float-snow {
    0%   { transform: translateY(-20px) rotate(0deg);   opacity: 0; }
    10%  { opacity: 0.7; }
    90%  { opacity: 0.5; }
    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
  }
  @keyframes tg-heat-rise {
    0%   { transform: scale(1);        opacity: 0.5; }
    100% { transform: scale(1.7) scaleY(2); opacity: 0; }
  }
  @keyframes tg-critical-pulse {
    0%,100% { box-shadow: inset 0 0 60px rgba(239,68,68,0.07), 0 0 0 0 rgba(239,68,68,0.4); }
    50%     { box-shadow: inset 0 0 120px rgba(239,68,68,0.22), 0 0 0 8px rgba(239,68,68,0); }
  }
  @keyframes tg-banner-glow {
    0%,100% { box-shadow: 0 0 12px rgba(239,68,68,0.2); }
    50%     { box-shadow: 0 0 32px rgba(239,68,68,0.55); }
  }
  @keyframes tg-slide-down {
    from { transform: translateY(-14px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes tg-card-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes tg-beat {
    0%,100% { transform: scale(1);   opacity: 1; }
    50%     { transform: scale(1.6); opacity: 0.5; }
  }
  @keyframes tg-row-in {
    from { opacity: 0; transform: translateX(-8px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .tg-snow          { animation: tg-float-snow linear infinite; position: absolute; pointer-events: none; }
  .tg-heat          { animation: tg-heat-rise  linear infinite; position: absolute; pointer-events: none; border-radius: 50%; border: 1px solid rgba(239,68,68,0.18); }
  .tg-beat          { animation: tg-beat 1s ease-in-out infinite; }
  .tg-card-in       { animation: tg-card-in 0.4s ease forwards; }
  .tg-banner        { animation: tg-slide-down 0.4s cubic-bezier(.34,1.56,.64,1), tg-banner-glow 1.5s ease-in-out 0.4s infinite; }
  .tg-critical-card { animation: tg-critical-pulse 1.5s ease-in-out infinite; }
  .tg-row-in        { animation: tg-row-in 0.35s ease forwards; }
  .tg-alert-row:hover { transform: translateX(4px); transition: transform 0.2s; }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  critical: {
    bg:     "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.4)",
    bar:    "#ef4444",
    badge:  { bg: "rgba(239,68,68,0.2)", text: "#fca5a5" },
    label:  "Crítico",
  },
  warning: {
    bg:     "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.3)",
    bar:    "#f59e0b",
    badge:  { bg: "rgba(245,158,11,0.2)", text: "#fcd34d" },
    label:  "Atenção",
  },
  info: {
    bg:     "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.3)",
    bar:    "#3b82f6",
    badge:  { bg: "rgba(59,130,246,0.2)", text: "#93c5fd" },
    label:  "Info",
  },
};

/** Mapeia um incidente do back para um nível visual */
function incidentToLevel(incidente) {
  // Ajuste esses campos conforme a estrutura real do seu back
  const tipo = (incidente.tipo || incidente.nivel || "").toLowerCase();
  if (tipo.includes("crít") || tipo.includes("crit") || tipo.includes("alto"))  return "critical";
  if (tipo.includes("aten") || tipo.includes("warn") || tipo.includes("médio")) return "warning";
  return "info";
}

/** Formata data do back para exibição relativa */
function formatTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const diff = Math.floor((Date.now() - d) / 60000); // minutos
  if (diff < 1)  return "Agora mesmo";
  if (diff < 60) return `Há ${diff} min`;
  if (diff < 1440) return `Há ${Math.floor(diff / 60)}h`;
  return `Há ${Math.floor(diff / 1440)}d`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BgParticles() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        char: ["❄", "❅", "❆", "✦"][i % 4],
        left: `${(i * 7.1) % 100}%`,
        size: 10 + (i % 5) * 3,
        dur:  `${7 + (i % 9)}s`,
        delay:`${(i * 0.9) % 12}s`,
      })),
    []
  );
  const waves = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => ({
        id: i, size: 24 + i * 10,
        right: `${8 + i * 4}%`, bottom: `${6 + i * 5}%`,
        dur: `${3 + i}s`, delay: `${i * 0.9}s`,
      })),
    []
  );
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {flakes.map((f) => (
        <span key={f.id} className="tg-snow"
          style={{ left: f.left, top: "-20px", fontSize: f.size,
            color: "rgba(147,197,253,0.6)", textShadow: "0 0 8px rgba(147,197,253,0.7)",
            animationDuration: f.dur, animationDelay: f.delay }}>
          {f.char}
        </span>
      ))}
      {waves.map((w) => (
        <div key={w.id} className="tg-heat"
          style={{ width: w.size, height: w.size, right: w.right, bottom: w.bottom,
            animationDuration: w.dur, animationDelay: w.delay }} />
      ))}
    </div>
  );
}

function Card({ children, className = "", critical = false }) {
  return (
    <div
      className={`relative rounded-2xl p-5 overflow-hidden tg-card-in ${critical ? "tg-critical-card" : ""} ${className}`}
      style={{
        background: "linear-gradient(135deg,var(--tg-bg2),var(--tg-bg3))",
        border: critical ? "1px solid rgba(239,68,68,0.5)" : "1px solid var(--tg-border)",
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-px opacity-40"
        style={{ background: "linear-gradient(90deg,transparent,var(--tg-purple2),transparent)" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(124,58,237,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(124,58,237,0.04) 1px,transparent 1px)",
          backgroundSize: "30px 30px",
        }} />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/** Linha de alerta individual */
function AlertRow({ incidente, onVerify, delay = 0 }) {
  const level  = incidentToLevel(incidente);
  const config = LEVEL_CONFIG[level];
  const isVerified = !!incidente.verified;

  // Campos do back — ajuste conforme sua estrutura real
  const title   = incidente.descricao   || incidente.titulo    || incidente.tipo  || "Incidente";
  const sensor  = incidente.sensor      || incidente.nome_sala  || incidente.sala  || "—";
  const valor   = incidente.valor       !== undefined ? `${incidente.valor}°C` : null;
  const limite  = incidente.limite      !== undefined ? `Limite: ${incidente.limite}°C` : null;
  const time    = formatTime(incidente.data_hora || incidente.created_at || incidente.timestamp);

  return (
    <div
      className="tg-alert-row tg-row-in flex items-start gap-3 px-4 py-4 rounded-xl border relative overflow-hidden cursor-pointer transition-all"
      style={{
        background: isVerified ? "rgba(255,255,255,0.02)" : config.bg,
        borderColor: isVerified ? "rgba(255,255,255,0.07)" : config.border,
        opacity: isVerified ? 0.55 : 1,
        animationDelay: `${delay}s`,
      }}
    >
      {/* Barra lateral colorida */}
      <div className="absolute top-0 left-0 w-[3px] h-full rounded-l-xl"
        style={{ background: isVerified ? "var(--tg-muted)" : config.bar }} />

      {/* Ícone de nível */}
      <span className="text-lg ml-1 flex-shrink-0">
        {isVerified ? "✅" : level === "critical" ? "🔴" : level === "warning" ? "🟡" : "🔵"}
      </span>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="text-[13px] font-semibold" style={{ color: "var(--tg-text)" }}>
            {title}
          </p>
          {!isVerified && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: config.badge.bg, color: config.badge.text }}>
              {config.label}
            </span>
          )}
          {isVerified && (
            <span className="text-[10px] px-2 py-0.5 rounded-full"
              style={{ background: "rgba(16,185,129,0.15)", color: "var(--tg-green)" }}>
              Verificado
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-0.5">
          <p className="text-[11px]" style={{ color: "var(--tg-muted)" }}>
            📡 {sensor}
          </p>
          {valor  && <p className="text-[11px]" style={{ color: "var(--tg-muted)" }}>🌡 {valor}</p>}
          {limite && <p className="text-[11px]" style={{ color: "var(--tg-muted)" }}>{limite}</p>}
        </div>

        <p className="text-[10px] mt-1.5" style={{ color: "var(--tg-muted)" }}>
          🕐 {time} • ID #{incidente.id_incidente || incidente.id || "—"}
        </p>
      </div>

      {/* Botão verificar (original handleVerify) */}
      {!isVerified && (
        <button
          onClick={(e) => { e.stopPropagation(); onVerify(incidente.id_incidente); }}
          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all hover:opacity-80 active:scale-95"
          style={{
            background: "rgba(124,58,237,0.15)",
            borderColor: "rgba(124,58,237,0.35)",
            color: "var(--tg-purple3)",
          }}
        >
          Verificar
        </button>
      )}
    </div>
  );
}

// Barra de progresso de SLA
function SlaBar({ score }) {
  const color = score >= 80 ? "var(--tg-green)" : score >= 50 ? "var(--tg-amber)" : "var(--tg-red)";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span style={{ color: "var(--tg-muted)" }}>SLA de Resposta</span>
        <span style={{ color }} className="font-['Orbitron'] font-bold">{score}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${score}%`, background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
}

// ─── ALERTS PAGE ─────────────────────────────────────────────────────────────
export default function AlertsPage() {
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos"); // todos | ativos | verificados | critical | warning
  const [clock, setClock] = useState("");
  const [dateStr, setDateStr] = useState("");
  const cssInjected = useRef(false);

  const router = useRouter();

  // CSS
  useEffect(() => {
    if (cssInjected.current) return;
    cssInjected.current = true;
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
  }, []);

  // Relógio
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

  // 🔐 Proteção de rota (igual ao dashboard)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/");
  }, []);

  // 🔌 Carregar incidentes do back
  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        const res = await api.get("/api/incidentes").catch(() => ({ data: [] }));
        setAlertsData(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar alertas", err);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  // 🔥 Verificar alerta (mesma lógica do dashboard)
  const handleVerify = (alertId) => {
    setAlertsData((prev) =>
      prev.map((a) => (a.id_incidente === alertId ? { ...a, verified: true } : a))
    );
  };

  // Stats derivados dos dados reais
  const stats = useMemo(() => {
    const total      = alertsData.length;
    const verified   = alertsData.filter((a) => a.verified).length;
    const ativos     = total - verified;
    const criticos   = alertsData.filter((a) => incidentToLevel(a) === "critical" && !a.verified).length;
    const warnings   = alertsData.filter((a) => incidentToLevel(a) === "warning"  && !a.verified).length;
    const compliance = total > 0 ? Math.round((verified / total) * 100) : 100;
    return { total, verified, ativos, criticos, warnings, compliance };
  }, [alertsData]);

  const hasCritical = stats.criticos > 0;

  // Filtros
  const filtered = useMemo(() => {
    switch (filter) {
      case "ativos":      return alertsData.filter((a) => !a.verified);
      case "verificados": return alertsData.filter((a) =>  a.verified);
      case "critical":    return alertsData.filter((a) => incidentToLevel(a) === "critical");
      case "warning":     return alertsData.filter((a) => incidentToLevel(a) === "warning");
      default:            return alertsData;
    }
  }, [alertsData, filter]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--tg-bg)" }}>
        <div className="text-center space-y-3">
          <p className="font-['Orbitron'] text-2xl font-bold"
            style={{
              background: "linear-gradient(135deg,var(--tg-purple2),var(--tg-purple3))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
            ThermoGuard
          </p>
          <p className="text-sm animate-pulse" style={{ color: "var(--tg-muted)" }}>Carregando alertas...</p>
        </div>
      </div>
    );
  }

  // ── Render ──
  return (
    <div className="relative min-h-screen" style={{ background: "var(--tg-bg)", color: "var(--tg-text)" }}>
      <BgParticles />

      {/* Overlay pulsante quando há críticos */}
      {hasCritical && (
        <div className="fixed inset-0 pointer-events-none z-40 rounded-none"
          style={{
            boxShadow: "inset 0 0 80px rgba(239,68,68,0.12)",
            animation: "tg-critical-pulse 1.5s ease-in-out infinite",
          }} />
      )}

      <div className="relative z-10 max-w-[1100px] mx-auto p-5 space-y-5">

        {/* ── HEADER ── */}
        <div
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 px-5 py-4 rounded-2xl relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(15,15,30,0.85))",
            border: "1px solid var(--tg-border)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg,transparent,var(--tg-purple2),transparent)" }} />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{
                background: hasCritical
                  ? "linear-gradient(135deg,#dc2626,#ef4444)"
                  : "linear-gradient(135deg,var(--tg-purple),var(--tg-purple2))",
                boxShadow: hasCritical ? "0 0 20px rgba(239,68,68,0.5)" : "0 0 20px var(--tg-pglow)",
              }}>
              {hasCritical ? "🚨" : "⚠️"}
            </div>
            <div>
              <h1 className="font-['Orbitron'] text-lg font-bold tracking-wide"
                style={{
                  background: hasCritical
                    ? "linear-gradient(135deg,#f87171,#fca5a5)"
                    : "linear-gradient(135deg,var(--tg-purple2),var(--tg-purple3))",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                Central de Alertas
              </h1>
              <p className="text-[10px] uppercase tracking-[2px]" style={{ color: "var(--tg-muted)" }}>
                ThermoGuard — Monitoramento de Incidentes
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right" style={{ fontFamily: "Orbitron,monospace" }}>
              <p className="text-base font-bold" style={{ color: "var(--tg-purple3)" }}>{clock}</p>
              <p className="text-[10px]" style={{ color: "var(--tg-muted)" }}>{dateStr}</p>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wide border"
              style={
                hasCritical
                  ? { background: "rgba(239,68,68,0.15)", borderColor: "rgba(239,68,68,0.5)", color: "var(--tg-red)" }
                  : stats.ativos > 0
                  ? { background: "rgba(245,158,11,0.15)", borderColor: "rgba(245,158,11,0.4)", color: "var(--tg-amber)" }
                  : { background: "rgba(16,185,129,0.15)", borderColor: "rgba(16,185,129,0.4)", color: "var(--tg-green)" }
              }
            >
              <span className={`w-2 h-2 rounded-full ${hasCritical || stats.ativos > 0 ? "tg-beat" : ""}`}
                style={{ background: "currentColor" }} />
              {hasCritical ? "Situação Crítica" : stats.ativos > 0 ? `${stats.ativos} Pendentes` : "Tudo Normal"}
            </div>
          </div>
        </div>

        {/* ── BANNER CRÍTICO (aparece só quando há críticos não verificados) ── */}
        {hasCritical && (
          <div className="tg-banner flex items-center gap-3 px-4 py-3 rounded-xl border"
            style={{
              background: "linear-gradient(135deg,rgba(239,68,68,0.18),rgba(239,68,68,0.06))",
              borderColor: "rgba(239,68,68,0.5)",
            }}>
            <span className="text-xl">🚨</span>
            <p className="flex-1 text-[13px]" style={{ color: "#fca5a5" }}>
              <strong style={{ color: "var(--tg-red)" }}>
                {stats.criticos} alerta{stats.criticos > 1 ? "s" : ""} crítico{stats.criticos > 1 ? "s" : ""} ativo{stats.criticos > 1 ? "s" : ""}!
              </strong>{" "}
              Verificação imediata necessária.
            </p>
          </div>
        )}

        {/* ── CARDS DE RESUMO ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total de Alertas",  value: stats.total,      color: "var(--tg-purple2)", icon: "📋" },
            { label: "Alertas Ativos",    value: stats.ativos,     color: stats.ativos > 0 ? "var(--tg-amber)" : "var(--tg-green)", icon: "⚡" },
            { label: "Críticos",          value: stats.criticos,   color: stats.criticos > 0 ? "var(--tg-red)" : "var(--tg-green)", icon: "🔴", critical: stats.criticos > 0 },
            { label: "Verificados",       value: stats.verified,   color: "var(--tg-green)",   icon: "✅" },
          ].map((s) => (
            <Card key={s.label} critical={s.critical}>
              <p className="text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1.5"
                style={{ color: "var(--tg-muted)" }}>
                <span>{s.icon}</span>{s.label}
              </p>
              <p className="font-['Orbitron'] text-3xl font-bold" style={{ color: s.color }}>
                {s.value}
              </p>
            </Card>
          ))}
        </div>

        {/* ── SLA + FILTROS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center">
          <Card>
            <SlaBar score={stats.compliance} />
          </Card>

          {/* Filtros */}
          <div className="flex flex-wrap gap-2 p-1 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--tg-border)" }}>
            {[
              { key: "todos",      label: `Todos (${stats.total})` },
              { key: "ativos",     label: `Ativos (${stats.ativos})` },
              { key: "critical",   label: `Críticos (${stats.criticos})` },
              { key: "warning",    label: `Atenção (${stats.warnings})` },
              { key: "verificados",label: `Verificados (${stats.verified})` },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
                style={
                  filter === f.key
                    ? {
                        background:
                          f.key === "critical" ? "rgba(239,68,68,0.3)"
                          : f.key === "warning" ? "rgba(245,158,11,0.25)"
                          : "rgba(124,58,237,0.3)",
                        color:
                          f.key === "critical" ? "var(--tg-red)"
                          : f.key === "warning" ? "var(--tg-amber)"
                          : "var(--tg-purple3)",
                        border: `1px solid ${
                          f.key === "critical" ? "rgba(239,68,68,0.4)"
                          : f.key === "warning" ? "rgba(245,158,11,0.35)"
                          : "rgba(124,58,237,0.4)"
                        }`,
                      }
                    : { color: "var(--tg-muted)" }
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── LISTA DE ALERTAS DO BACK ── */}
        <Card>
          <p className="text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--tg-muted)" }}>
            Incidentes — {filter === "todos" ? "Todos" : filter === "ativos" ? "Ativos" : filter === "verificados" ? "Verificados" : filter === "critical" ? "Críticos" : "Atenção"}
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-4xl mb-3">✅</p>
              <p className="text-sm" style={{ color: "var(--tg-muted)" }}>
                Nenhum incidente encontrado para este filtro.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((inc, i) => (
                <AlertRow
                  key={inc.id_incidente || inc.id || i}
                  incidente={inc}
                  onVerify={handleVerify}
                  delay={i * 0.04}
                />
              ))}
            </div>
          )}
        </Card>

        {/* ── RODAPÉ DE AÇÕES ── */}
        {stats.ativos > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "var(--tg-border)" }}>
            <p className="text-[12px]" style={{ color: "var(--tg-muted)" }}>
              {stats.ativos} alerta{stats.ativos > 1 ? "s" : ""} pendente{stats.ativos > 1 ? "s" : ""} de verificação
            </p>
            <button
              onClick={() => {
                // Verifica todos de uma vez
                setAlertsData((prev) => prev.map((a) => ({ ...a, verified: true })));
              }}
              className="px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all hover:opacity-80 active:scale-95"
              style={{
                background: "rgba(16,185,129,0.15)",
                borderColor: "rgba(16,185,129,0.4)",
                color: "var(--tg-green)",
              }}
            >
              ✅ Verificar Todos
            </button>
          </div>
        )}

      </div>
    </div>
  );
}