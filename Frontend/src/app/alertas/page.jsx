"use client";

import { useState, useMemo } from "react";
import { initialAlerts } from "@/data/mockData";
import AlertsList from "@/components/AlertsList";
import { themes } from "@/theme/theme";
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
  const [filter, setFilter] = useState("pendentes"); // pendentes | verificados | todos
  const T = themes.dark;

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

  // Estatísticas de Alertas
  const criticalCount = alertsData.filter(a => !a.verified && a.severity === "high").length;
  const pendingCount = alertsData.filter(a => !a.verified).length;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      {/* Header de Alertas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600/20 rounded-lg">
            <Bell className="text-purple-400" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white leading-none">Central de Alertas</h1>
            <p className="text-purple-500 text-sm mt-1">Gerencie e verifique as ocorrências do sistema</p>
          </div>
        </div>

        <div className="flex gap-2 bg-[#1a1825] p-1 rounded-xl border border-purple-900/20">
          <button 
            onClick={() => setFilter("pendentes")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'pendentes' ? 'bg-purple-600 text-white' : 'text-purple-500 hover:text-purple-300'}`}
          >
            PENDENTES ({pendingCount})
          </button>
          <button 
            onClick={() => setFilter("verificados")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'verificados' ? 'bg-purple-900/40 text-purple-300' : 'text-purple-500 hover:text-purple-300'}`}
          >
            RESOLVIDOS
          </button>
        </div>
      </div>

      {/* Grid de Resumo de Criticidade */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1825] border-l-4 border-red-500 p-4 rounded-r-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-purple-500 uppercase font-bold tracking-widest">Críticos</p>
              <h3 className="text-2xl font-bold text-white font-mono">{criticalCount}</h3>
            </div>
            <ShieldAlert size={20} className="text-red-500/50" />
          </div>
        </div>
        
        <div className="bg-[#1a1825] border-l-4 border-orange-500 p-4 rounded-r-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-purple-500 uppercase font-bold tracking-widest">Advertências</p>
              <h3 className="text-2xl font-bold text-white font-mono">{pendingCount - criticalCount}</h3>
            </div>
            <AlertCircle size={20} className="text-orange-500/50" />
          </div>
        </div>

        <div className="bg-[#1a1825] border-l-4 border-green-500 p-4 rounded-r-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-purple-500 uppercase font-bold tracking-widest">Resolvidos (Hoje)</p>
              <h3 className="text-2xl font-bold text-white font-mono">
                {alertsData.filter(a => a.verified).length}
              </h3>
            </div>
            <CheckCheck size={20} className="text-green-500/50" />
          </div>
        </div>
      </div>

      {/* Área Principal de Lista */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <div className="lg:col-span-3">
          <div className="bg-[#0f0e1a] border border-purple-900/20 rounded-2xl overflow-hidden">
            <div className="p-4 bg-purple-950/10 border-b border-purple-900/10 flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-2">
                <Filter size={14} /> Exibindo {filter}
              </span>
              <span className="text-[10px] text-purple-600 uppercase font-bold">Auto-refresh: 30s</span>
            </div>
            
            <div className="p-2">
              {filteredAlerts.length > 0 ? (
                <AlertsList alerts={filteredAlerts} onVerify={handleVerify} T={T} />
              ) : (
                <div className="py-20 text-center">
                  <div className="inline-flex p-4 bg-purple-900/10 rounded-full mb-4">
                    <CheckCheck size={32} className="text-purple-600" />
                  </div>
                  <p className="text-purple-400 font-medium">Nenhum alerta {filter} encontrado.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Lateral de Atividade */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-[#1a1825] border border-purple-900/20 p-5 rounded-2xl">
            <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <History size={16} className="text-purple-500" />
              Últimas Verificações
            </h3>
            
            <div className="space-y-4">
              {alertsData.filter(a => a.verified).slice(0, 3).map((a, i) => (
                <div key={i} className="relative pl-4 border-l border-purple-900/30 py-1">
                  <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-purple-600" />
                  <p className="text-[10px] text-purple-500 font-bold uppercase">{a.verifiedAt || "Há pouco"}</p>
                  <p className="text-xs text-purple-200 truncate">{a.msg}</p>
                </div>
              ))}

              <button className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-purple-500 hover:text-purple-300 transition-colors uppercase tracking-widest">
                Ver Log Completo <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-900/20 p-5 rounded-2xl">
             <p className="text-[10px] text-purple-400 uppercase font-bold mb-2">Dica de Segurança</p>
             <p className="text-xs text-purple-300 leading-relaxed italic opacity-70">
               "Alertas críticos não resolvidos em 15 minutos serão escalados automaticamente para o gestor de plantão."
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}