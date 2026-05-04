"use client";

import { useState, useMemo } from "react";
import { initialAlerts } from "@/data/mockData";
import AlertsList from "@/components/AlertsList";
import { themes } from "@/theme/theme";
import { useTheme } from "@/contexts/ThemeContext";
import Chatbot from '@/components/Chatbot'
import { 
  Bell, 
  Filter, 
  CheckCheck, 
  AlertCircle, 
  History, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";

export default function AlertasPage() {
  const [alertsData, setAlertsData] = useState(initialAlerts);
  const [filter, setFilter] = useState("pendentes");

  // ✅ Tema dinâmico
  const { dark } = useTheme();
  const T = dark ? themes.dark : themes.light;

  const handleVerify = (id) => {
    setAlertsData(prev =>
      prev.map(a => a.id === id ? { ...a, verified: true, verifiedAt: new Date().toLocaleTimeString() } : a)
    );
  };

  const filteredAlerts = useMemo(() => {
    if (filter === "pendentes") return alertsData.filter(a => !a.verified);
    if (filter === "verificados") return alertsData.filter(a => a.verified);
    return alertsData;
  }, [alertsData, filter]);

  const criticalCount = alertsData.filter(a => !a.verified && a.severity === "high").length;
  const pendingCount = alertsData.filter(a => !a.verified).length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: "color-mix(in srgb, var(--purple) 15%, transparent)" }}>
            <Bell style={{ color: "var(--purple-l)" }} size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-none" style={{ color: "var(--text)" }}>
              Central de Alertas
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--purple)" }}>
              Gerencie e verifique as ocorrências do sistema
            </p>
          </div>
        </div>

        <div
          className="flex gap-2 p-1 rounded-xl"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
        >
          <button 
            onClick={() => setFilter("pendentes")}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={
              filter === "pendentes"
                ? { background: "var(--purple)", color: "#fff" }
                : { color: "var(--muted)" }
            }
          >
            PENDENTES ({pendingCount})
          </button>
          <button 
            onClick={() => setFilter("verificados")}
            className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={
              filter === "verificados"
                ? { background: "color-mix(in srgb, var(--purple) 30%, transparent)", color: "var(--purple-l)" }
                : { color: "var(--muted)" }
            }
          >
            RESOLVIDOS
          </button>
        </div>
      </div>

      {/* Grid de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="border-l-4 border-red-500 p-4 rounded-r-xl"
          style={{ background: "var(--card)" }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "var(--muted)" }}>Críticos</p>
              <h3 className="text-2xl font-bold font-mono" style={{ color: "var(--text)" }}>{criticalCount}</h3>
            </div>
            <ShieldAlert size={20} className="text-red-500/50" />
          </div>
        </div>
        
        <div
          className="border-l-4 border-orange-500 p-4 rounded-r-xl"
          style={{ background: "var(--card)" }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "var(--muted)" }}>Advertências</p>
              <h3 className="text-2xl font-bold font-mono" style={{ color: "var(--text)" }}>{pendingCount - criticalCount}</h3>
            </div>
            <AlertCircle size={20} className="text-orange-500/50" />
          </div>
        </div>

        <div
          className="border-l-4 border-green-500 p-4 rounded-r-xl"
          style={{ background: "var(--card)" }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest" style={{ color: "var(--muted)" }}>Resolvidos (Hoje)</p>
              <h3 className="text-2xl font-bold font-mono" style={{ color: "var(--text)" }}>
                {alertsData.filter(a => a.verified).length}
              </h3>
            </div>
            <CheckCheck size={20} className="text-green-500/50" />
          </div>
        </div>
      </div>

      {/* Área Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="lg:col-span-3">
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <div
              className="p-4 flex items-center justify-between"
              style={{
                background: "var(--surface)",
                borderBottom: "1px solid var(--border-soft)",
              }}
            >
              <span className="text-xs font-bold flex items-center gap-2" style={{ color: "var(--text-sub)" }}>
                <Filter size={14} /> Exibindo {filter}
              </span>
              <span className="text-[10px] uppercase font-bold" style={{ color: "var(--muted)" }}>
                Auto-refresh: 30s
              </span>
            </div>
            
            <div className="p-2">
              {filteredAlerts.length > 0 ? (
                <AlertsList alerts={filteredAlerts} onVerify={handleVerify} T={T} />
              ) : (
                <div className="py-20 text-center">
                  <div
                    className="inline-flex p-4 rounded-full mb-4"
                    style={{ background: "color-mix(in srgb, var(--purple) 10%, transparent)" }}
                  >
                    <CheckCheck size={32} style={{ color: "var(--purple)" }} />
                  </div>
                  <p className="font-medium" style={{ color: "var(--text-sub)" }}>
                    Nenhum alerta {filter} encontrado.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Lateral */}
        <div className="lg:col-span-1 space-y-4">
          <div
            className="p-5 rounded-2xl"
            style={{ background: "var(--card)", border: "1px solid var(--border)" }}
          >
            <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ color: "var(--text)" }}>
              <History size={16} style={{ color: "var(--purple)" }} />
              Últimas Verificações
            </h3>
            
            <div className="space-y-4">
              {alertsData.filter(a => a.verified).slice(0, 3).map((a, i) => (
                <div
                  key={i}
                  className="relative pl-4 py-1"
                  style={{ borderLeft: "1px solid var(--border)" }}
                >
                  <div
                    className="absolute -left-[5px] top-2 w-2 h-2 rounded-full"
                    style={{ background: "var(--purple)" }}
                  />
                  <p className="text-[10px] font-bold uppercase" style={{ color: "var(--muted)" }}>
                    {a.verifiedAt || "Há pouco"}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--text-sub)" }}>{a.msg}</p>
                </div>
              ))}

              <button
                className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors"
                style={{ color: "var(--muted)" }}
              >
                Ver Log Completo <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div
            className="p-5 rounded-2xl"
            style={{
              background: "color-mix(in srgb, var(--purple) 8%, var(--card))",
              border: "1px solid var(--border)",
            }}
          >
            <p className="text-[10px] uppercase font-bold mb-2" style={{ color: "var(--purple-l)" }}>
              Dica de Segurança
            </p>
            <p className="text-xs leading-relaxed italic opacity-70" style={{ color: "var(--text-sub)" }}>
              "Alertas críticos não resolvidos em 15 minutos serão escalados automaticamente para o gestor de plantão."
            </p>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}