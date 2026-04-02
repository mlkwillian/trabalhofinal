"use client";

import React from "react";
import {
  CheckCircle2, AlertTriangle, XCircle, Download,
  BarChart3, TrendingUp, ArrowLeft, Filter, ChevronDown
} from "lucide-react";

const dados = [
  { ambiente: "Almoxarifado Principal",  total: 174, conformes: 139, atencao: 28, criticos: 7 },
  { ambiente: "Cozinha Industrial",      total: 174, conformes: 142, atencao: 24, criticos: 8 },
  { ambiente: "Laboratório de Análises", total: 174, conformes: 137, atencao: 25, criticos: 12 },
];

const historico = [
  { dt: "02/07/2025 14:00", env: "Câmara Fria A",    temp: "-17.8°C", faixa: "-22°C a -15°C", status: "conforme" },
  { dt: "02/07/2025 14:00", env: "Câmara Fria B",    temp: "-13.9°C", faixa: "-22°C a -15°C", status: "crítico"  },
  { dt: "02/07/2025 14:00", env: "Sala de Vacinas",  temp:   "5.1°C", faixa:   "2°C a 8°C",  status: "conforme" },
  { dt: "02/07/2025 14:00", env: "Estufa 01",        temp:  "38.2°C", faixa: "35°C a 40°C",  status: "conforme" },
  { dt: "02/07/2025 08:00", env: "Câmara Fria A",    temp: "-21.1°C", faixa: "-22°C a -15°C", status: "atenção"  },
  { dt: "02/07/2025 08:00", env: "Lab. de Análises", temp:  "22.0°C", faixa: "18°C a 25°C",  status: "conforme" },
];

const totalLeituras = dados.reduce((s, d) => s + d.total, 0);
const totalConf     = dados.reduce((s, d) => s + d.conformes, 0);
const totalAtenc    = dados.reduce((s, d) => s + d.atencao, 0);
const totalCrit     = dados.reduce((s, d) => s + d.criticos, 0);
const taxa          = ((totalConf / totalLeituras) * 100).toFixed(1);

function taxaClasses(pct) {
  const n = parseFloat(pct);
  if (n >= 85) return { text: "text-emerald-400", bar: "bg-emerald-400" };
  if (n >= 75) return { text: "text-amber-400",   bar: "bg-amber-400"   };
  return         { text: "text-red-400",           bar: "bg-red-400"     };
}

const STATUS_CFG = {
  conforme: { cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", Icon: CheckCircle2 },
  atenção:  { cls: "text-amber-400   bg-amber-400/10   border-amber-400/30",   Icon: AlertTriangle },
  crítico:  { cls: "text-red-400     bg-red-400/10     border-red-400/30",     Icon: XCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG["conforme"];
  const Icon = cfg.Icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider font-mono ${cfg.cls}`}>
      <Icon className="w-2.5 h-2.5" />
      {status}
    </span>
  );
}

function Pill({ value, cls }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black font-mono border ${cls}`}>
      {value}
    </span>
  );
}

export default function RelatorioAuditoria() {
  const exportarCSV = () => {
    const header = ["Ambiente", "Total", "Conformes", "Atenção", "Críticos", "Conformidade (%)"];
    const rows = dados.map(d => [
      d.ambiente, d.total, d.conformes, d.atencao, d.criticos,
      ((d.conformes / d.total) * 100).toFixed(1),
    ]);
    const csv = [header, ...rows].map(r => r.map(v => `"${v}"`).join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_auditoria_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#080612] px-6 py-8 space-y-6">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 rounded-xl border border-[#251840] bg-[#140c24] flex items-center justify-center text-[#6b5c8a] hover:text-violet-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#ede9fe] font-mono tracking-tight">Relatório de Auditoria</h1>
            <p className="text-[11px] text-[#6b5c8a] font-mono mt-0.5">Histórico completo e análise de conformidade</p>
          </div>
        </div>
        <button
          onClick={exportarCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-black font-mono transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Exportar Relatório
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 rounded-xl bg-[#140c24] border border-[#251840]">
        <span className="flex items-center gap-2 text-[#6b5c8a] text-[10px] font-black font-mono uppercase tracking-widest">
          <Filter className="w-3 h-3" />
          Filtros:
        </span>
        {["Todos os ambientes", "Últimos 7 dias"].map(f => (
          <button key={f} className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#100a1e] border border-[#251840] text-[#ede9fe] text-xs font-mono hover:border-violet-600/60 transition-colors">
            {f}
            <ChevronDown className="w-3 h-3 text-[#6b5c8a]" />
          </button>
        ))}
        <span className="ml-auto text-[10px] text-[#2e2050] font-mono">{totalLeituras} leituras</span>
      </div>

      {/* Summary cards */}
      <section>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2e2050] font-mono mb-3">Resumo Geral</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Total de Leituras",    value: totalLeituras, Icon: BarChart3,     tc: "text-violet-400",  hi: false },
            { label: "Conformes",            value: totalConf,     Icon: CheckCircle2,  tc: "text-emerald-400", hi: false },
            { label: "Atenção",              value: totalAtenc,    Icon: AlertTriangle, tc: "text-amber-400",   hi: false },
            { label: "Críticos",             value: totalCrit,     Icon: XCircle,       tc: "text-red-400",     hi: false },
            { label: "Taxa de Conformidade", value: `${taxa}%`,   Icon: TrendingUp,    tc: "text-sky-400",     hi: true  },
          ].map(({ label, value, Icon, tc, hi }) => (
            <div key={label} className={`p-4 rounded-2xl border ${hi ? "bg-sky-400/5 border-sky-400/20" : "bg-[#140c24] border-[#251840]"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-3.5 h-3.5 ${tc}`} />
                <span className="text-[10px] text-[#6b5c8a] font-black uppercase tracking-wider font-mono leading-tight">{label}</span>
              </div>
              <p className={`text-2xl font-black font-mono leading-none ${tc}`}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Conformidade por ambiente */}
      <section>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2e2050] font-mono mb-3">Conformidade por Ambiente</p>
        <div className="rounded-2xl border border-[#251840] bg-[#140c24] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1030] border-b border-[#251840]">
                  {["Ambiente", "Total", "Conformes", "Atenção", "Críticos", "Conformidade"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-[#6b5c8a] font-mono whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dados.map((d, i) => {
                  const pct = ((d.conformes / d.total) * 100).toFixed(1);
                  const { text, bar } = taxaClasses(pct);
                  return (
                    <tr key={i} className={`border-b border-[#1a1030] hover:bg-violet-600/5 transition-colors ${i % 2 !== 0 ? "bg-[#1a1030]/40" : ""}`}>
                      <td className="px-5 py-3.5 text-[#ede9fe] font-semibold">{d.ambiente}</td>
                      <td className="px-5 py-3.5 text-[#6b5c8a] font-mono">{d.total}</td>
                      <td className="px-5 py-3.5">
                        <Pill value={d.conformes} cls="text-emerald-400 bg-emerald-400/10 border-emerald-400/30" />
                      </td>
                      <td className="px-5 py-3.5">
                        <Pill value={d.atencao}   cls="text-amber-400 bg-amber-400/10 border-amber-400/30" />
                      </td>
                      <td className="px-5 py-3.5">
                        <Pill value={d.criticos}  cls="text-red-400 bg-red-400/10 border-red-400/30" />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 rounded-full bg-[#1a1030] overflow-hidden min-w-[50px]">
                            <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className={`text-xs font-black font-mono min-w-[40px] ${text}`}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Histórico detalhado */}
      <section>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2e2050] font-mono mb-3">Histórico Detalhado</p>
        <div className="rounded-2xl border border-[#251840] bg-[#140c24] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1a1030] border-b border-[#251840]">
                  {["Data/Hora", "Ambiente", "Temperatura", "Faixa Aceitável", "Status"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-[#6b5c8a] font-mono whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historico.map((r, i) => {
                  const tempCls =
                    r.status === "crítico" ? "text-red-400" :
                    r.status === "atenção" ? "text-amber-400" :
                    "text-emerald-400";
                  return (
                    <tr key={i} className={`border-b border-[#1a1030] hover:bg-violet-600/5 transition-colors ${i % 2 !== 0 ? "bg-[#1a1030]/40" : ""}`}>
                      <td className="px-5 py-3 text-[#2e2050] font-mono whitespace-nowrap">{r.dt}</td>
                      <td className="px-5 py-3 text-[#ede9fe] font-semibold">{r.env}</td>
                      <td className={`px-5 py-3 font-black font-mono ${tempCls}`}>{r.temp}</td>
                      <td className="px-5 py-3 text-[#6b5c8a] font-mono">{r.faixa}</td>
                      <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <p className="text-center text-[10px] text-[#2e2050] font-mono pb-2">
        ThermoGuard — Relatório gerado em {new Date().toLocaleString("pt-BR")}
      </p>
    </div>
  );
}