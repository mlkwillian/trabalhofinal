"use client";

import { Bell, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import AlertCard from "@/components/AlertCard";

export default function AlertsList({ alerts = [], onVerify, T }) {
  const pending  = alerts.filter((a) => !a.verified);
  const resolved = alerts.filter((a) => a.verified);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(124,58,237,0.2)",
        backdropFilter: "blur(12px)",
        boxShadow: T.shadow,
      }}
    >
      {/* ── HEADER ── */}
      <div
        className="px-5 pt-5 pb-4"
        style={{ borderBottom: "1px solid rgba(124,58,237,0.15)" }}
      >
        {/* Título */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center relative"
              style={{
                background: "rgba(249,115,22,0.15)",
                border: "1.5px solid rgba(249,115,22,0.3)",
                boxShadow: pending.length > 0 ? "0 0 14px rgba(249,115,22,0.2)" : "none",
              }}
            >
              <Bell size={16} style={{ color: "#f97316" }} />
              {pending.length > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full flex items-center justify-center text-[8px] font-black"
                  style={{
                    background: "#f97316",
                    color: "#fff",
                    fontFamily: "'Orbitron', monospace",
                    boxShadow: "0 0 8px rgba(249,115,22,0.5)",
                  }}
                >
                  {pending.length}
                </span>
              )}
            </div>

            <div>
              <span
                className="text-sm font-black"
                style={{ color: "#e2e8f0", fontFamily: "'Orbitron', monospace", letterSpacing: "0.5px" }}
              >
                Central de Alertas
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
                <p style={{ fontSize: "9px", color: "rgba(148,163,184,0.4)", letterSpacing: "2px", textTransform: "uppercase" }}>
                  Monitoramento ativo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges resumo */}
        <div className="flex gap-2">
          <div
            className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full font-bold flex-1 justify-center"
            style={{
              background: "rgba(249,115,22,0.1)",
              color: "#f97316",
              border: "1px solid rgba(249,115,22,0.25)",
            }}
          >
            <AlertTriangle size={11} />
            {pending.length} pendente{pending.length !== 1 ? "s" : ""}
          </div>
          <div
            className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full font-bold flex-1 justify-center"
            style={{
              background: "rgba(34,197,94,0.1)",
              color: "#22c55e",
              border: "1px solid rgba(34,197,94,0.25)",
            }}
          >
            <CheckCircle2 size={11} />
            {resolved.length} resolvido{resolved.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* ── LISTA ── */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-3">

          {pending.length > 0 && (
            <>
              <p
                className="text-[9px] font-black uppercase px-1 mb-2"
                style={{
                  color: "#f97316",
                  fontFamily: "'Orbitron', monospace",
                  letterSpacing: "2px",
                }}
              >
                ● Pendentes
              </p>
              {pending.map((alert) => (
                <AlertCard
                  key={alert.id_incidente || alert.id}
                  alert={alert}
                  onVerify={onVerify}
                  T={T}
                />
              ))}
            </>
          )}

          {resolved.length > 0 && (
            <>
              <p
                className="text-[9px] font-black uppercase px-1 mt-5 mb-2"
                style={{
                  color: "#22c55e",
                  fontFamily: "'Orbitron', monospace",
                  letterSpacing: "2px",
                }}
              >
                ✓ Resolvidos
              </p>
              {resolved.map((alert) => (
                <AlertCard
                  key={alert.id_incidente || alert.id}
                  alert={alert}
                  onVerify={onVerify}
                  T={T}
                />
              ))}
            </>
          )}

          {alerts.length === 0 && (
            <div className="py-16 text-center">
              <p style={{ color: "rgba(148,163,184,0.35)", fontSize: "13px" }}>
                Nenhum alerta para exibir.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}