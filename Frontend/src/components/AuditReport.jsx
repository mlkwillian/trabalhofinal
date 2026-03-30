"use client";

import { FileText, CheckCircle2, AlertTriangle, Thermometer, WifiOff } from "lucide-react";

// 🔥 CONFIG (igual ao AlertCard, mas simplificado)
const alertMeta = {
  temp_high: {
    label: "Temp. Alta",
    getColor: (T) => ({
      color: T.red || "#ef4444",
      border: `${T.red || "#ef4444"}55`,
    }),
  },
  temp_low: {
    label: "Temp. Baixa",
    getColor: (T) => ({
      color: T.blue || "#3b82f6",
      border: `${T.blue || "#3b82f6"}55`,
    }),
  },
  offline: {
    label: "Offline",
    getColor: (T) => ({
      color: T.muted,
      border: `${T.muted}55`,
    }),
  },
  warning: {
    label: "Alerta",
    getColor: (T) => ({
      color: T.accent,
      border: `${T.accent}55`,
    }),
  },
};

export default function AuditReport({ alerts = [], T }) {

  return (
    <div
      className="rounded-2xl border"
      style={{
        background: T.card,
        borderColor: T.border,
        boxShadow: T.shadow,
      }}
    >
      {/* HEADER */}
      <div
        className="flex items-center gap-3 px-6 py-4 border-b"
        style={{ borderColor: T.border }}
      >
        <div
          className="h-8 w-8 rounded-xl flex items-center justify-center"
          style={{ background: `${T.purpleL}15` }}
        >
          <FileText className="h-4 w-4" style={{ color: T.purpleL }} />
        </div>

        <div>
          <span
            className="text-sm font-black"
            style={{ color: T.text }}
          >
            Relatório de Auditoria
          </span>

          <p
            className="text-[9px] font-bold uppercase tracking-widest"
            style={{ color: T.muted }}
          >
            Registro de eventos
          </p>
        </div>
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          
          <thead>
            <tr
              style={{
                borderBottom: `1px solid ${T.border}`,
                background: T.borderSoft,
              }}
            >
              {["Ambiente", "Tipo", "Mensagem", "Horário", "Status", "Operador"].map(h => (
                <th
                  key={h}
                  className="px-5 py-3 text-left font-black uppercase tracking-wider text-[10px]"
                  style={{ color: T.muted }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {alerts.map((a, i) => {

              const meta = alertMeta[a?.type] ?? alertMeta.offline;
              const { color, border } = meta.getColor(T);

              return (
                <tr
                  key={a?.id ?? i}
                  className="transition-colors duration-150"
                  style={{
                    borderBottom: `1px solid ${T.borderSoft}`,
                    background: i % 2 === 0
                      ? "transparent"
                      : `${T.borderSoft}40`,
                  }}
                >
                  <td className="px-5 py-3.5 font-bold" style={{ color: T.text }}>
                    {a?.envName}
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className="text-[9px] font-black uppercase px-2 py-1 rounded-md"
                      style={{
                        background: `${color}15`,
                        color,
                        border: `1px solid ${border}`,
                      }}
                    >
                      {meta.label}
                    </span>
                  </td>

                  <td
                    className="px-5 py-3.5 max-w-[200px] truncate"
                    style={{ color: T.muted }}
                  >
                    {a?.message}
                  </td>

                  <td
                    className="px-5 py-3.5"
                    style={{
                      color: T.faint,
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {a?.time}
                  </td>

                  <td className="px-5 py-3.5">
                    {a?.verified ? (
                      <span
                        className="flex items-center gap-1.5 font-bold"
                        style={{ color: T.green }}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verificado
                      </span>
                    ) : (
                      <span
                        className="flex items-center gap-1.5 font-bold"
                        style={{ color: T.accent }}
                      >
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Pendente
                      </span>
                    )}
                  </td>

                  <td
                    className="px-5 py-3.5"
                    style={{
                      color: T.faint,
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    {a?.verifiedBy ?? "—"}
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