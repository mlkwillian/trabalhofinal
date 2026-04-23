"use client";

import { useState, useMemo, useEffect } from "react";
import EnvironmentCard from "@/components/EnvironmentCard";
import TemperatureChart from "@/components/TemperatureChart";
import { themes } from "@/theme/theme";
import { Search, Activity, AlertTriangle, Thermometer } from "lucide-react";
import { api } from "@/services/api";

export default function AmbientesPage() {
  const [salas, setSalas] = useState([]);
  const [selectedSala, setSelectedSala] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const T = themes.dark;

  // 🔥 BUSCAR SALAS DO BACKEND
  useEffect(() => {
    const fetchSalas = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setErro("Usuário não autenticado");
          setLoading(false);
          return;
        }

        const res = await api.get("/api/salas");

        setSalas(res.data);

        if (res.data.length > 0) {
          setSelectedSala(res.data[0]);
        }

      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar salas");
      } finally {
        setLoading(false);
      }
    };

    fetchSalas();
  }, []);

  // 🔍 FILTRO
  const filteredSalas = useMemo(() => {
    return salas.filter(sala =>
      sala.nome_sala.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [salas, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-purple-400">
        Carregando ambientes...
      </div>
    );
  }

  if (salas.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen text-purple-400">
        Nenhuma sala cadastrada
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex items-center justify-center h-screen text-red-400">
        {erro}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 min-h-screen bg-[#0a0910]">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Ambientes</h1>
          <p className="text-purple-500 text-sm">
            Monitoramento de salas
          </p>
        </div>

        <div className="bg-[#1a1825] border border-purple-900/30 rounded-lg flex items-center px-3 py-2">
          <Search size={18} className="text-purple-500 mr-2" />
          <input
            type="text"
            placeholder="Buscar sala..."
            className="bg-transparent outline-none text-sm text-purple-200 placeholder:text-purple-700"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1825] p-4 rounded-xl flex items-center gap-4">
          <Activity className="text-purple-400" />
          <div>
            <p className="text-purple-500 text-xs">Salas</p>
            <p className="text-white text-xl">{salas.length}</p>
          </div>
        </div>

        <div className="bg-[#1a1825] p-4 rounded-xl flex items-center gap-4">
          <AlertTriangle className="text-orange-400" />
          <div>
            <p className="text-purple-500 text-xs">Alertas</p>
            <p className="text-white text-xl">--</p>
          </div>
        </div>

        <div className="bg-[#1a1825] p-4 rounded-xl flex items-center gap-4">
          <Thermometer className="text-blue-400" />
          <div>
            <p className="text-purple-500 text-xs">Faixa Média</p>
            <p className="text-white text-xl">--</p>
          </div>
        </div>
      </div>

      {/* LISTA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredSalas.map((sala) => (
          <EnvironmentCard
            key={sala.id_sala}
            env={{
              id: sala.id_sala,
              name: sala.nome_sala,
              minTemp: sala.temperatura_min,
              maxTemp: sala.temperatura_max,
            }}
            T={T}
            selected={selectedSala?.id_sala === sala.id_sala}
            onClick={() => setSelectedSala(sala)}
          />
        ))}
      </div>

      {/* DETALHE */}
      {selectedSala && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          <div className="lg:col-span-3 bg-[#0f0e1a] p-4 rounded-xl">
            <h2 className="text-white mb-4">
              {selectedSala.nome_sala}
            </h2>

            {/* ⚠️ AINDA MOCK (depois ligamos sensores) */}
            <TemperatureChart
              env={{
                name: selectedSala.nome_sala,
                minTemp: selectedSala.temperatura_min,
                maxTemp: selectedSala.temperatura_max,
                history: [] // depois vem do backend
              }}
              T={T}
            />
          </div>

          <div className="bg-[#1a1825] p-4 rounded-xl">
            <h3 className="text-white mb-3">Configuração</h3>

            <p className="text-sm text-purple-400">
              Mín: {selectedSala.temperatura_min}°C
            </p>

            <p className="text-sm text-purple-400">
              Máx: {selectedSala.temperatura_max}°C
            </p>
          </div>

        </div>
      )}

    </div>
  );
}