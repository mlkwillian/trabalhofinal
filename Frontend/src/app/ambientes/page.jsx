"use client";

import { useState, useMemo } from "react";
import { initialEnvs } from "@/data/mockData";
import EnvironmentCard from "@/components/EnvironmentCard";
import TemperatureChart from "@/components/TemperatureChart";
import { themes } from "@/theme/theme";
import { Search, Activity, AlertTriangle, Thermometer, Wind } from "lucide-react";

export default function AmbientesPage() {
  const [selectedEnv, setSelectedEnv] = useState(initialEnvs[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const T = themes.dark;

  // Filtro de ambientes
  const filteredEnvs = useMemo(() => {
    return initialEnvs.filter(env => 
      env.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6 p-6 min-h-screen bg-[#0a0910]">
      
      {/* Cabeçalho e Stats Rápidos */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Ambientes</h1>
          <p className="text-purple-500 text-sm">Monitoramento em tempo real de múltiplos setores</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#1a1825] border border-purple-900/30 rounded-lg flex items-center px-3 py-2">
            <Search size={18} className="text-purple-500 mr-2" />
            <input 
              type="text" 
              placeholder="Buscar ambiente..."
              className="bg-transparent border-none outline-none text-sm text-purple-200 placeholder:text-purple-700 w-48"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Grid de Resumo Estatístico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1825] border border-purple-900/20 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-purple-600/10 rounded-lg text-purple-400">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-purple-500 text-xs uppercase font-bold tracking-wider">Sensores Ativos</p>
            <p className="text-white text-xl font-mono">24 / 24</p>
          </div>
        </div>
        <div className="bg-[#1a1825] border border-purple-900/20 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-orange-600/10 rounded-lg text-orange-400">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p className="text-purple-500 text-xs uppercase font-bold tracking-wider">Alertas Pendentes</p>
            <p className="text-white text-xl font-mono">02</p>
          </div>
        </div>
        <div className="bg-[#1a1825] border border-purple-900/20 p-4 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 rounded-lg text-blue-400">
            <Thermometer size={20} />
          </div>
          <div>
            <p className="text-purple-500 text-xs uppercase font-bold tracking-wider">Média Térmica</p>
            <p className="text-white text-xl font-mono">21.4°C</p>
          </div>
        </div>
      </div>

      {/* Ambientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredEnvs.map((env) => (
          <EnvironmentCard
            key={env.id}
            env={env}
            T={T}
            selected={selectedEnv.id === env.id}
            onClick={() => setSelectedEnv(env)}
          />
        ))}
      </div>

      {/* Gráfico e Detalhes Específicos */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="bg-[#0f0e1a] border border-purple-900/20 rounded-xl p-4 h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-purple-200 font-semibold flex items-center gap-2">
                <Activity size={16} className="text-purple-500" />
                Análise Detalhada: {selectedEnv.name}
              </h2>
              <div className="flex gap-2">
                <span className="text-[10px] bg-purple-900/30 text-purple-300 px-2 py-1 rounded">24h</span>
                <span className="text-[10px] text-purple-600 px-2 py-1 rounded hover:bg-purple-900/20 cursor-pointer">7d</span>
              </div>
            </div>
            <TemperatureChart env={selectedEnv} T={T} />
          </div>
        </div>

        {/* Sidebar de Informações do Ambiente Selecionado */}
        <div className="space-y-4">
          <div className="bg-[#1a1825] border border-purple-900/20 p-5 rounded-xl">
            <h3 className="text-white font-bold mb-4 text-sm">Status do Setor</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-purple-500 text-xs">Umidade</span>
                <div className="flex items-center gap-2">
                  <Wind size={14} className="text-blue-400" />
                  <span className="text-white text-sm font-mono">{selectedEnv.humidity || "45"}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-purple-500 text-xs">Setpoint</span>
                <span className="text-white text-sm font-mono">18°C - 24°C</span>
              </div>

              <div className="pt-4 border-t border-purple-900/30">
                <p className="text-[10px] text-purple-600 mb-2 uppercase tracking-tighter font-bold">Última Ocorrência</p>
                <p className="text-xs text-purple-300 leading-relaxed italic">
                  "Variação de +2°C detectada às 08:42 devido à abertura de porta."
                </p>
              </div>

              <button className="w-full py-2 bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 text-xs font-bold rounded-lg border border-purple-600/20 transition-all">
                GERAR RELATÓRIO PDF
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}