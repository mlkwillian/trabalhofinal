"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft, Download, Filter, ChevronDown,
  CheckCircle2, AlertTriangle, XCircle,
  BarChart3, TrendingUp, ArrowUpDown,
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────
const RAW_DATA = [
  { dt: "06/04/2026 14:30", env: "Câmara Fria A",    temp: -17.8, faixa: "-22°C a -15°C", min: -22, max: -15, status: "conforme" },
  { dt: "06/04/2026 14:30", env: "Câmara Fria B",    temp: -13.9, faixa: "-22°C a -15°C", min: -22, max: -15, status: "crítico"  },
  { dt: "06/04/2026 14:30", env: "Sala de Vacinas",  temp: 5.1,   faixa: "2°C a 8°C",     min: 2,   max: 8,   status: "conforme" },
  { dt: "06/04/2026 14:30", env: "Estufa 01",        temp: 38.2,  faixa: "35°C a 40°C",   min: 35,  max: 40,  status: "conforme" },
  { dt: "06/04/2026 08:00", env: "Câmara Fria A",    temp: -21.1, faixa: "-22°C a -15°C", min: -22, max: -15, status: "atenção"  },
  { dt: "06/04/2026 08:00", env: "Lab. de Análises", temp: 22.0,  faixa: "18°C a 25°C",   min: 18,  max: 25,  status: "conforme" },
  { dt: "05/04/2026 22:00", env: "Câmara Fria B",    temp: -14.5, faixa: "-22°C a -15°C", min: -22, max: -15, status: "atenção"  },
  { dt: "05/04/2026 22:00", env: "Sala de Vacinas",  temp: 7.8,   faixa: "2°C a 8°C",     min: 2,   max: 8,   status: "conforme" },
  { dt: "05/04/2026 22:00", env: "Almoxarifado",     temp: 19.5,  faixa: "15°C a 25°C",   min: 15,  max: 25,  status: "conforme" },
  { dt: "05/04/2026 14:00", env: "Estufa 01",        temp: 41.3,  faixa: "35°C a 40°C",   min: 35,  max: 40,  status: "crítico"  },
  { dt: "05/04/2026 14:00", env: "Lab. de Análises", temp: 26.2,  faixa: "18°C a 25°C",   min: 18,  max: 25,  status: "atenção"  },
  { dt: "05/04/2026 08:00", env: "Câmara Fria A",    temp: -18.4, faixa: "-22°C a -15°C", min: -22, max: -15, status: "conforme" },
  { dt: "04/04/2026 22:00", env: "Câmara Fria B",    temp: -16.1, faixa: "-22°C a -15°C", min: -22, max: -15, status: "conforme" },
  { dt: "04/04/2026 22:00", env: "Sala de Vacinas",  temp: 3.5,   faixa: "2°C a 8°C",     min: 2,   max: 8,   status: "conforme" },
  { dt: "04/04/2026 14:00", env: "Almoxarifado",     temp: 27.1,  faixa: "15°C a 25°C",   min: 15,  max: 25,  status: "atenção"  },
  { dt: "04/04/2026 08:00", env: "Estufa 01",        temp: 36.9,  faixa: "35°C a 40°C",   min: 35,  max: 40,  status: "conforme" },
  { dt: "03/04/2026 22:00", env: "Lab. de Análises", temp: 24.5,  faixa: "18°C a 25°C",   min: 18,  max: 25,  status: "conforme" },
  { dt: "03/04/2026 14:00", env: "Câmara Fria A",    temp: -22.5, faixa: "-22°C a -15°C", min: -22, max: -15, status: "crítico"  },
  { dt: "03/04/2026 08:00", env: "Câmara Fria B",    temp: -19.2, faixa: "-22°C a -15°C", min: -22, max: -15, status: "conforme" },
  { dt: "02/04/2026 22:00", env: "Sala de Vacinas",  temp: 8.9,   faixa: "2°C a 8°C",     min: 2,   max: 8,   status: "crítico"  },
  { dt: "02/04/2026 14:00", env: "Almoxarifado",     temp: 21.0,  faixa: "15°C a 25°C",   min: 15,  max: 25,  status: "conforme" },
  { dt: "02/04/2026 08:00", env: "Estufa 01",        temp: 39.8,  faixa: "35°C a 40°C",   min: 35,  max: 40,  status: "conforme" },
  { dt: "01/04/2026 22:00", env: "Lab. de Análises", temp: 17.3,  faixa: "18°C a 25°C",   min: 18,  max: 25,  status: "atenção"  },
  { dt: "01/04/2026 14:00", env: "Câmara Fria A",    temp: -16.0, faixa: "-22°C a -15°C", min: -22, max: -15, status: "conforme" },
];

const PER_PAGE = 10;

const ENVS = [...new Set(RAW_DATA.map(r => r.env))].sort();

// ─── Helpers ──────────────────────────────────────────────────────────────────
function calcDesvio(r) {
  if (r.temp < r.min) return `${(r.temp - r.min).toFixed(1)}°C`;
  if (r.temp > r.max) return `+${(r.temp - r.max).toFixed(1)}°C`;
  return "—";
}

function statusCfg(status) {
  return {
    conforme: { badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25", temp: "text-emerald-400", Icon: CheckCircle2 },
    atenção:  { badge: "text-amber-400 bg-amber-400/10 border-amber-400/25",       temp: "text-amber-400",   Icon: AlertTriangle },
    crítico:  { badge: "text-red-400 bg-red-400/10 border-red-400/25",             temp: "text-red-400",     Icon: XCircle },
  }[status] ?? { badge: "", temp: "text-emerald-400", Icon: CheckCircle2 };
}

function calcTrend(env, allData) {
  const rows = allData.filter(r => r.env === env);
  if (rows.length < 2) return null;
  return rows[0].temp - rows[1].temp;
}

function calcConformidade(rows) {
  if (!rows.length) return 0;
  return ((rows.filter(r => r.status === "conforme").length / rows.length) * 100);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const { badge, Icon } = statusCfg(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider font-mono ${badge}`}>
      <Icon className="w-2.5 h-2.5" />
      {status}
    </span>
  );
}

function Sparkline({ env }) {
  const rows = RAW_DATA.filter(r => r.env === env).slice(0, 7);
  if (!rows.length) return null;
  const vals = rows.map(r => r.temp);
  const mn = Math.min(...vals), mx = Math.max(...vals);
  const range = mx - mn || 1;
  return (
    <div className="flex items-end gap-0.5 h-7">
      {vals.map((v, i) => {
        const h = Math.max(4, Math.round(((v - mn) / range) * 22));
        const { temp } = statusCfg(rows[i].status);
        return (
          <div
            key={i}
            className={`w-1.5 rounded-t-sm ${temp.replace("text-", "bg-")}`}
            style={{ height: `${h}px` }}
          />
        );
      })}
    </div>
  );
}

function TrendCell({ env }) {
  const diff = calcTrend(env, RAW_DATA);
  if (diff === null) return <span className="text-[#3d2f60] font-mono text-xs">—</span>;
  if (Math.abs(diff) < 0.3) return <span className="text-[#6b5c8a] font-mono text-xs">→ estável</span>;
  if (diff > 0) return <span className="text-red-400 font-mono text-xs">↑ +{diff.toFixed(1)}°C</span>;
  return <span className="text-emerald-400 font-mono text-xs">↓ {diff.toFixed(1)}°C</span>;
}

function ConformidadeBar({ value }) {
  const pct = value.toFixed(1);
  const color = value >= 85 ? "bg-emerald-400" : value >= 75 ? "bg-amber-400" : "bg-red-400";
  const textColor = value >= 85 ? "text-emerald-400" : value >= 75 ? "text-amber-400" : "text-red-400";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 rounded-full bg-[#1a1030] overflow-hidden min-w-[50px]">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-black font-mono min-w-[42px] ${textColor}`}>{pct}%</span>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function TabHistorico({ data, sortCol, sortDir, onSort }) {
  const [page, setPage] = useState(1);
  const total = data.length;
  const pages = Math.ceil(total / PER_PAGE);
  const slice = data.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const SortTh = ({ col, children }) => (
    <th
      onClick={() => onSort(col)}
      className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-[#6b5c8a] font-mono whitespace-nowrap cursor-pointer select-none hover:text-purple-400 transition-colors"
    >
      <span className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={`w-3 h-3 ${sortCol === col ? "text-purple-400" : "text-[#3d2f60]"}`} />
      </span>
    </th>
  );

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-[#251840] bg-[#140c24] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#1a1030] border-b border-[#251840]">
              <tr>
                <SortTh col="dt">Data/Hora</SortTh>
                <SortTh col="env">Ambiente</SortTh>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-[#6b5c8a] font-mono">Temperatura</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-[#6b5c8a] font-mono">Faixa Aceitável</th>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-[#6b5c8a] font-mono">Desvio</th>
                <SortTh col="status">Status</SortTh>
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-[#6b5c8a] font-mono">Tendência</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((r, i) => {
                const { temp: tc } = statusCfg(r.status);
                const desvio = calcDesvio(r);
                const devColor = r.status === "crítico" ? "text-red-400" : r.status === "atenção" ? "text-amber-400" : "text-[#3d2f60]";
                return (
                  <tr key={i} className={`border-b border-[#1a1030] hover:bg-violet-600/5 transition-colors ${i % 2 !== 0 ? "bg-[#1a1030]/40" : ""}`}>
                    <td className="px-4 py-3 text-[#3d2f60] font-mono whitespace-nowrap">{r.dt}</td>
                    <td className="px-4 py-3 text-[#ede9fe] font-semibold">{r.env}</td>
                    <td className={`px-4 py-3 font-black font-mono ${tc}`}>{r.temp > 0 ? "+" : ""}{r.temp.toFixed(1)}°C</td>
                    <td className="px-4 py-3 text-[#6b5c8a] font-mono">{r.faixa}</td>
                    <td className={`px-4 py-3 font-bold font-mono ${devColor}`}>{desvio}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3"><TrendCell env={r.env} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-[11px] text-[#6b5c8a] font-mono">
          Exibindo {Math.min((page - 1) * PER_PAGE + 1, total)}–{Math.min(page * PER_PAGE, total)} de {total} leituras
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono border transition-colors ${
                p === page
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "bg-[#100a1e] border-[#251840] text-[#6b5c8a] hover:border-violet-600/60 hover:text-[#ede9fe]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabAmbientes() {
  return (
    <div className="rounded-2xl border border-[#251840] bg-[#140c24] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#1a1030] border-b border-[#251840]">
            <tr>
              {["Ambiente", "Total Leituras", "Conformes", "Atenção", "Críticos", "Conformidade", "Últimas leituras"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider text-[#6b5c8a] font-mono whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ENVS.map((env, i) => {
              const rows = RAW_DATA.filter(r => r.env === env);
              const ok = rows.filter(r => r.status === "conforme").length;
              const at = rows.filter(r => r.status === "atenção").length;
              const cr = rows.filter(r => r.status === "crítico").length;
              const pct = calcConformidade(rows);
              return (
                <tr key={env} className={`border-b border-[#1a1030] hover:bg-violet-600/5 transition-colors ${i % 2 !== 0 ? "bg-[#1a1030]/40" : ""}`}>
                  <td className="px-4 py-3 text-[#ede9fe] font-semibold">{env}</td>
                  <td className="px-4 py-3 text-[#6b5c8a] font-mono">{rows.length}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono border text-emerald-400 bg-emerald-400/10 border-emerald-400/25">{ok}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono border text-amber-400 bg-amber-400/10 border-amber-400/25">{at}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono border text-red-400 bg-red-400/10 border-red-400/25">{cr}</span>
                  </td>
                  <td className="px-4 py-3 min-w-[160px]">
                    <ConformidadeBar value={pct} />
                  </td>
                  <td className="px-4 py-3">
                    <Sparkline env={env} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabTendencia() {
  const days = ["02/04", "03/04", "04/04", "05/04", "06/04"];
  const buckets = days.map(d => {
    const rows = RAW_DATA.filter(r => r.dt.startsWith(d + "/2026"));
    return {
      d,
      ok: rows.filter(r => r.status === "conforme").length,
      at: rows.filter(r => r.status === "atenção").length,
      cr: rows.filter(r => r.status === "crítico").length,
      total: rows.length,
    };
  });
  const maxT = Math.max(...buckets.map(b => b.total)) || 1;

  return (
    <div className="rounded-2xl border border-[#251840] bg-[#140c24] p-6 space-y-6">
      <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#2e2050] font-mono">Distribuição por Status — Últimos 7 dias</p>

      {/* Bar chart */}
      <div className="flex gap-3 items-flex-end h-44 pb-1">
        {buckets.map(b => {
          const h = b.total ? Math.round((b.total / maxT) * 160) : 4;
          const okH = b.total ? Math.round((b.ok / b.total) * h) : 0;
          const atH = b.total ? Math.round((b.at / b.total) * h) : 0;
          const crH = h - okH - atH;
          return (
            <div key={b.d} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end gap-px" style={{ height: "160px" }}>
                {crH > 0 && <div className="bg-red-400 rounded-t-sm w-full" style={{ height: `${crH}px` }} />}
                {atH > 0 && <div className="bg-amber-400 w-full" style={{ height: `${atH}px` }} />}
                {okH > 0 && <div className="bg-emerald-400 rounded-b-sm w-full" style={{ height: `${okH}px` }} />}
              </div>
              <span className="text-[10px] text-[#6b5c8a] font-mono">{b.d}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-5">
        <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" /> Conforme
        </span>
        <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" /> Atenção
        </span>
        <span className="text-[11px] text-red-400 font-mono flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" /> Crítico
        </span>
      </div>

      {/* Stats por dia */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-[#1a1030]">
        {buckets.map(b => {
          const pct = b.total ? ((b.ok / b.total) * 100).toFixed(0) : "0";
          const color = parseInt(pct) >= 85 ? "text-emerald-400" : parseInt(pct) >= 75 ? "text-amber-400" : "text-red-400";
          return (
            <div key={b.d} className="bg-[#1a1030] rounded-xl p-3 text-center">
              <p className="text-[10px] text-[#6b5c8a] font-mono mb-1">{b.d}</p>
              <p className={`text-lg font-black font-mono ${color}`}>{pct}%</p>
              <p className="text-[10px] text-[#3d2f60] font-mono">{b.total} leituras</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HistoricoPage() {
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatus]   = useState("");
  const [envFilter, setEnvFilter]   = useState("");
  const [period, setPeriod]         = useState("hoje");
  const [activeTab, setActiveTab]   = useState("historico");
  const [sortCol, setSortCol]       = useState("dt");
  const [sortDir, setSortDir]       = useState(-1);

  function handleSort(col) {
    if (sortCol === col) setSortDir(d => d * -1);
    else { setSortCol(col); setSortDir(-1); }
  }

  const filtered = useMemo(() => {
    return RAW_DATA.filter(r => {
      if (search && !r.env.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && r.status !== statusFilter) return false;
      if (envFilter && r.env !== envFilter) return false;
      return true;
    }).sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol];
      if (typeof av === "string") return sortDir * av.localeCompare(bv);
      return sortDir * (av - bv);
    });
  }, [search, statusFilter, envFilter, sortCol, sortDir]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const ok    = filtered.filter(r => r.status === "conforme").length;
    const at    = filtered.filter(r => r.status === "atenção").length;
    const cr    = filtered.filter(r => r.status === "crítico").length;
    const taxa  = total ? ((ok / total) * 100).toFixed(1) : "0.0";
    return [
      { label: "Total de Leituras",    value: total,     Icon: BarChart3,    color: "text-violet-400" },
      { label: "Conformes",            value: ok,        Icon: CheckCircle2, color: "text-emerald-400" },
      { label: "Atenção",              value: at,        Icon: AlertTriangle,color: "text-amber-400" },
      { label: "Críticos",             value: cr,        Icon: XCircle,      color: "text-red-400" },
      { label: "Taxa de Conformidade", value: `${taxa}%`,Icon: TrendingUp,   color: "text-sky-400" },
    ];
  }, [filtered]);

  function exportCSV() {
    const header = ["Data/Hora", "Ambiente", "Temperatura (°C)", "Faixa Aceitável", "Desvio", "Status"];
    const rows = filtered.map(r => [r.dt, r.env, r.temp.toFixed(1), r.faixa, calcDesvio(r), r.status]);
    const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historico_thermoguard_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const TABS = [
    { id: "historico",  label: "Histórico"    },
    { id: "ambientes",  label: "Por Ambiente" },
    { id: "tendencia",  label: "Tendência"    },
  ];

  const PERIODS = ["hoje", "semana", "mês"];

  return (
    <div className="min-h-screen bg-[#080612] px-6 py-8 space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-purple-900/10 pb-6">
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl border border-[#251840] bg-[#140c24] flex items-center justify-center text-[#6b5c8a] hover:text-violet-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <h1 className="text-xl font-black text-[#ede9fe] font-mono tracking-tight">Histórico de Leituras</h1>
            </div>
            <p className="text-[11px] text-[#6b5c8a] font-mono">Monitoramento contínuo · Atualizado 2s atrás</p>
          </div>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-black font-mono transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Exportar CSV
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {stats.map(({ label, value, Icon, color }) => (
          <div key={label} className="bg-[#140c24] border border-[#251840] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              <span className="text-[10px] text-[#6b5c8a] font-black uppercase tracking-wider font-mono leading-tight">{label}</span>
            </div>
            <p className={`text-2xl font-black font-mono leading-none ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1.5 bg-[#140c24] border border-[#251840] rounded-xl p-1.5 w-fit">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all uppercase tracking-wider font-mono ${
              activeTab === tab.id
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                : "text-[#6b5c8a] hover:text-[#ede9fe]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3 bg-[#140c24] border border-[#251840] rounded-xl px-5 py-3.5">
        <span className="flex items-center gap-2 text-[#6b5c8a] text-[10px] font-black font-mono uppercase tracking-widest">
          <Filter className="w-3 h-3" />
          Filtros:
        </span>

        {/* Search */}
        <input
          type="text"
          placeholder="Buscar ambiente..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-[#100a1e] border border-[#251840] rounded-lg px-3 py-1.5 text-[12px] text-[#ede9fe] font-mono outline-none placeholder-[#3d2f60] focus:border-violet-600/50 w-44"
        />

        {/* Status select */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={e => setStatus(e.target.value)}
            className="appearance-none bg-[#100a1e] border border-[#251840] rounded-lg pl-3 pr-8 py-1.5 text-[11px] text-[#ede9fe] font-mono outline-none cursor-pointer hover:border-violet-600/50"
          >
            <option value="">Todos os status</option>
            <option value="conforme">Conforme</option>
            <option value="atenção">Atenção</option>
            <option value="crítico">Crítico</option>
          </select>
          <ChevronDown className="w-3 h-3 text-[#6b5c8a] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Env select */}
        <div className="relative">
          <select
            value={envFilter}
            onChange={e => setEnvFilter(e.target.value)}
            className="appearance-none bg-[#100a1e] border border-[#251840] rounded-lg pl-3 pr-8 py-1.5 text-[11px] text-[#ede9fe] font-mono outline-none cursor-pointer hover:border-violet-600/50"
          >
            <option value="">Todos os ambientes</option>
            {ENVS.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
          <ChevronDown className="w-3 h-3 text-[#6b5c8a] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Period chips */}
        <div className="flex gap-1.5">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold font-mono border transition-all uppercase tracking-wider ${
                period === p
                  ? "bg-violet-600 border-violet-600 text-white"
                  : "bg-[#100a1e] border-[#251840] text-[#6b5c8a] hover:text-[#ede9fe] hover:border-violet-600/50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <span className="ml-auto text-[10px] text-[#3d2f60] font-mono">{filtered.length} leituras</span>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "historico" && (
        <TabHistorico data={filtered} sortCol={sortCol} sortDir={sortDir} onSort={handleSort} />
      )}
      {activeTab === "ambientes" && <TabAmbientes />}
      {activeTab === "tendencia" && <TabTendencia />}

      <p className="text-center text-[10px] text-[#2e2050] font-mono pb-2">
        ThermoGuard — Histórico gerado em {new Date().toLocaleString("pt-BR")}
      </p>
    </div>
  );
}