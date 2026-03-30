"use client";

import { Bell, AlertTriangle, CheckCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"; // ⚠️ verifique se existe
import AlertCard from "@/components/AlertCard"; // ⚠️ verifique se existe

export default function AlertsList({ alerts = [], onVerify, T }) {

  const pending = alerts.filter(a => !a.verified);
  const resolved = alerts.filter(a => a.verified);

  return (
    <div
      className="rounded-2xl border h-full flex flex-col"
      style={{
        background: T.card,
        borderColor: T.border,
        boxShadow: T.shadow,
      }}
    >
      {/* HEADER */}
      <div
        className="px-5 pt-5 pb-4 border-b"
        style={{ borderColor: T.border }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center relative"
              style={{
                background: `${T.accent}18`,
                border: `1.5px solid ${T.accent}35`,
              }}
            >
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
              <span
                className="text-sm font-black"
                style={{ color: T.text }}
              >
                Central de Alertas
              </span>

              <p
                className="text-[9px] font-bold uppercase tracking-widest"
                style={{ color: T.muted }}
              >
                Monitoramento ativo
              </p>
            </div>
          </div>
        </div>

        {/* RESUMO */}
        <div className="flex gap-2">
          
          <div
            className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full font-bold flex-1 justify-center"
            style={{
              background: `${T.accent}15`,
              color: T.accent,
              border: `1px solid ${T.accent}30`,
            }}
          >
            <AlertTriangle className="h-3 w-3" />
            {pending.length} pendente{pending.length !== 1 ? "s" : ""}
          </div>

          <div
            className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-full font-bold flex-1 justify-center"
            style={{
              background: `${T.green}15`,
              color: T.green,
              border: `1px solid ${T.green}30`,
            }}
          >
            <CheckCircle2 className="h-3 w-3" />
            {resolved.length} resolvido{resolved.length !== 1 ? "s" : ""}
          </div>

        </div>
      </div>

      {/* LISTA */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-3">

          {pending.length > 0 && (
            <>
              <p
                className="text-[9px] font-black uppercase tracking-[0.2em] px-1"
                style={{ color: T.accent }}
              >
                ● Pendentes
              </p>

              {pending.map(alert => (
                <AlertCard
                  key={alert.id}
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
                className="text-[9px] font-black uppercase tracking-[0.2em] px-1 mt-4"
                style={{ color: T.green }}
              >
                ✓ Resolvidos
              </p>

              {resolved.map(alert => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onVerify={onVerify}
                  T={T}
                />
              ))}
            </>
          )}

        </div>
      </ScrollArea>
    </div>
  );
}