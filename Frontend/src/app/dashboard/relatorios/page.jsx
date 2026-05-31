"use client";

import React from "react";
import {
  CheckCircle2, AlertTriangle, XCircle, Download,
  BarChart3, TrendingUp, ArrowLeft, Filter, ChevronDown
} from "lucide-react";
import Chatbot from '@/components/Chatbot'
import { api } from "@/services/api";


function taxaClasses(pct) {
  const n = parseFloat(pct);
  if (n >= 85) return { text: "text-emerald-400", bar: "bg-emerald-400" };
  if (n >= 75) return { text: "text-amber-400", bar: "bg-amber-400" };
  return { text: "text-red-400", bar: "bg-red-400" };
}

const STATUS_CFG = {
  conforme: { cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", Icon: CheckCircle2 },
  atenção: { cls: "text-amber-400   bg-amber-400/10   border-amber-400/30", Icon: AlertTriangle },
  crítico: { cls: "text-red-400     bg-red-400/10     border-red-400/30", Icon: XCircle },
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

  const [dados, setDados] = React.useState([]);
  const [historico, setHistorico] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    carregarDados();

    const interval = setInterval(() => {
      carregarDados();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);

      const [salasRes, leiturasRes] = await Promise.all([
        api.get("/api/salas"),
        api.get("/api/leituras/ultimas"),
      ]);

      const salas = salasRes.data || [];
      const leituras = leiturasRes.data || [];

      const historicoFormatado = leituras.map(item => {
        let status = "conforme";

        if (
          item.temperatura < item.temperatura_min ||
          item.temperatura > item.temperatura_max
        ) {
          status = "crítico";
        }

        return {
          dt: new Date(item.data_leitura).toLocaleString("pt-BR"),
          env: item.sala,
          temp: `${item.temperatura}°C`,
          faixa: `${item.temperatura_min}°C a ${item.temperatura_max}°C`,
          status,
        };
      });

      setHistorico(historicoFormatado);

      const resumo = salas.map(sala => {
        const leiturasSala = leituras.filter(
          l => l.sala === sala.nome_sala
        );

        let conformes = 0;
        let atencao = 0;
        let criticos = 0;

        leiturasSala.forEach(l => {
          const temp = Number(l.temperatura);

          if (
            temp >= sala.temperatura_min &&
            temp <= sala.temperatura_max
          ) {
            conformes++;
          } else if (
            temp >= sala.temperatura_min - 2 &&
            temp <= sala.temperatura_max + 2
          ) {
            atencao++;
          } else {
            criticos++;
          }
        });

        return {
          ambiente: sala.nome_sala,
          total: leiturasSala.length,
          conformes,
          atencao,
          criticos,
        };
      });

      setDados(resumo);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }


  const totalLeituras = dados.reduce((s, d) => s + d.total, 0);

  const totalConf = dados.reduce(
    (s, d) => s + d.conformes,
    0
  );

  const totalAtenc = dados.reduce(
    (s, d) => s + d.atencao,
    0
  );

  const totalCrit = dados.reduce(
    (s, d) => s + d.criticos,
    0
  );

  const taxa =
    totalLeituras > 0
      ? ((totalConf / totalLeituras) * 100).toFixed(1)
      : "0.0";

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


  React.useEffect(() => {
    const interval = setInterval(() => {
      carregarDados();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg)" }}
      >
        <div
          className="px-6 py-4 rounded-xl font-mono"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--text)"
          }}
        >
          Carregando relatório...
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen px-6 py-8 space-y-6" style={{ background: "var(--bg)" }}>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--muted)",
            }}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-black font-mono tracking-tight" style={{ color: "var(--text)" }}>
              Relatório de Auditoria
            </h1>
            <p className="text-[11px] font-mono mt-0.5" style={{ color: "var(--muted)" }}>
              Histórico completo e análise de conformidade
            </p>
          </div>
        </div>
        <button
          onClick={exportarCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-black font-mono transition-colors"
          style={{ background: "var(--purple)" }}
        >
          <Download className="w-3.5 h-3.5" />
          Exportar Relatório
        </button>
      </div>

      {/* Filters */}
      <div
        className="flex flex-wrap items-center gap-3 px-5 py-3.5 rounded-xl"
        style={{ background: "var(--card)", border: "1px solid var(--border)" }}
      >
        <span className="flex items-center gap-2 text-[10px] font-black font-mono uppercase tracking-widest" style={{ color: "var(--muted)" }}>
          <Filter className="w-3 h-3" />
          Filtros:
        </span>
        {["Todos os ambientes", "Últimos 7 dias"].map(f => (
          <button
            key={f}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-colors"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
          >
            {f}
            <ChevronDown className="w-3 h-3" style={{ color: "var(--muted)" }} />
          </button>
        ))}
        <span className="ml-auto text-[10px] font-mono" style={{ color: "var(--faint)" }}>
          {totalLeituras} leituras
        </span>
      </div>

      {/* Summary cards */}
      <section>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] font-mono mb-3" style={{ color: "var(--border)" }}>
          Resumo Geral
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: "Total de Leituras", value: totalLeituras, Icon: BarChart3, tc: "text-violet-400", hi: false },
            { label: "Conformes", value: totalConf, Icon: CheckCircle2, tc: "text-emerald-400", hi: false },
            { label: "Atenção", value: totalAtenc, Icon: AlertTriangle, tc: "text-amber-400", hi: false },
            { label: "Críticos", value: totalCrit, Icon: XCircle, tc: "text-red-400", hi: false },
            { label: "Taxa de Conformidade", value: `${taxa}%`, Icon: TrendingUp, tc: "text-sky-400", hi: true },
          ].map(({ label, value, Icon, tc, hi }) => (
            <div
              key={label}
              className="p-4 rounded-2xl"
              style={
                hi
                  ? { background: "color-mix(in srgb, var(--blue) 6%, var(--card))", border: "1px solid color-mix(in srgb, var(--blue) 20%, transparent)" }
                  : { background: "var(--card)", border: "1px solid var(--border)" }
              }
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-3.5 h-3.5 ${tc}`} />
                <span className="text-[10px] font-black uppercase tracking-wider font-mono leading-tight" style={{ color: "var(--muted)" }}>
                  {label}
                </span>
              </div>
              <p className={`text-2xl font-black font-mono leading-none ${tc}`}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Conformidade por ambiente */}
      <section>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] font-mono mb-3" style={{ color: "var(--border)" }}>
          Conformidade por Ambiente
        </p>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                  {["Ambiente", "Total", "Conformes", "Atenção", "Críticos", "Conformidade"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider font-mono whitespace-nowrap" style={{ color: "var(--muted)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dados.map((d, i) => {
                  const pct =
                    d.total > 0
                      ? ((d.conformes / d.total) * 100).toFixed(1)
                      : "0.0";
                  const { text, bar } = taxaClasses(pct);
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid var(--border-soft)",
                        background: i % 2 !== 0 ? "var(--surface)" : "transparent",
                      }}
                    >
                      <td className="px-5 py-3.5 font-semibold" style={{ color: "var(--text)" }}>{d.ambiente}</td>
                      <td className="px-5 py-3.5 font-mono" style={{ color: "var(--muted)" }}>{d.total}</td>
                      <td className="px-5 py-3.5">
                        <Pill value={d.conformes} cls="text-emerald-400 bg-emerald-400/10 border-emerald-400/30" />
                      </td>
                      <td className="px-5 py-3.5">
                        <Pill value={d.atencao} cls="text-amber-400 bg-amber-400/10 border-amber-400/30" />
                      </td>
                      <td className="px-5 py-3.5">
                        <Pill value={d.criticos} cls="text-red-400 bg-red-400/10 border-red-400/30" />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden min-w-[50px]" style={{ background: "var(--border)" }}>
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
        <p className="text-[10px] font-black uppercase tracking-[0.2em] font-mono mb-3" style={{ color: "var(--border)" }}>
          Histórico Detalhado
        </p>
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", background: "var(--card)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                  {["Data/Hora", "Ambiente", "Temperatura", "Faixa Aceitável", "Status"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider font-mono whitespace-nowrap" style={{ color: "var(--muted)" }}>
                      {h}
                    </th>
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
                    <tr
                      key={i}
                      style={{
                        borderBottom: "1px solid var(--border-soft)",
                        background: i % 2 !== 0 ? "var(--surface)" : "transparent",
                      }}
                    >
                      <td className="px-5 py-3 font-mono whitespace-nowrap" style={{ color: "var(--muted)" }}>{r.dt}</td>
                      <td className="px-5 py-3 font-semibold" style={{ color: "var(--text)" }}>{r.env}</td>
                      <td className={`px-5 py-3 font-black font-mono ${tempCls}`}>{r.temp}</td>
                      <td className="px-5 py-3 font-mono" style={{ color: "var(--muted)" }}>{r.faixa}</td>
                      <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <p className="text-center text-[10px] font-mono pb-2" style={{ color: "var(--muted)" }}>
        ThermoGuard — Relatório gerado em {new Date().toLocaleString("pt-BR")}
      </p>
      <Chatbot />
    </div>
  );
}