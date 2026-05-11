"use client";

import { useState, useMemo, useEffect } from "react";
import EnvironmentCard from "@/components/EnvironmentCard";
import TemperatureChart from "@/components/TemperatureChart";
import { themes } from "@/theme/theme";
import { Search, Activity, AlertTriangle, Thermometer } from "lucide-react";
import { api } from "@/services/api";
import Chatbot from '@/components/Chatbot';
import { useTheme } from "@/contexts/ThemeContext"; // ✅ mesmo contexto da Sidebar

export default function AmbientesPage() {
  const [salas, setSalas] = useState([]);
  const [selectedSala, setSelectedSala] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // ✅ Usa o mesmo contexto de tema que a Sidebar já usa
  const { dark } = useTheme();
  const T = dark ? themes.dark : themes.light;

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
      <div className="flex items-center justify-center h-screen" style={{ color: T.purpleL }}>
        Carregando ambientes...
      </div>
    );
  }

  if (salas.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ color: T.purpleL }}>
        Nenhuma sala cadastrada
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ color: T.red }}>
        {erro}
      </div>
    );
  }

  return (
    <div
      className="space-y-6 p-6 min-h-screen transition-colors duration-300"
      style={{ background: T.bg }}
    >

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: T.text }}>
            Gestão de Ambientes
          </h1>
          <p className="text-sm" style={{ color: T.purple }}>
            Monitoramento de salas
          </p>
        </div>

        <div
          className="rounded-lg flex items-center px-3 py-2"
          style={{
            background: T.surface,
            border: `1px solid ${T.border}`,
          }}
        >
          <Search size={18} className="mr-2" style={{ color: T.purple }} />
          <input
            type="text"
            placeholder="Buscar sala..."
            className="bg-transparent outline-none text-sm"
            style={{ color: T.text }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="p-4 rounded-xl flex items-center gap-4 transition-colors duration-300"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <Activity style={{ color: T.purpleL }} />
          <div>
            <p className="text-xs" style={{ color: T.muted }}>Salas</p>
            <p className="text-xl" style={{ color: T.text }}>{salas.length}</p>
          </div>
        </div>

        <div
          className="p-4 rounded-xl flex items-center gap-4 transition-colors duration-300"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <AlertTriangle style={{ color: T.accent }} />
          <div>
            <p className="text-xs" style={{ color: T.muted }}>Alertas</p>
            <p className="text-xl" style={{ color: T.text }}>--</p>
          </div>
        </div>

        <div
          className="p-4 rounded-xl flex items-center gap-4 transition-colors duration-300"
          style={{ background: T.card, border: `1px solid ${T.border}` }}
        >
          <Thermometer style={{ color: T.blue }} />
          <div>
            <p className="text-xs" style={{ color: T.muted }}>Faixa Média</p>
            <p className="text-xl" style={{ color: T.text }}>--</p>
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

          <div
            className="lg:col-span-3 p-4 rounded-xl transition-colors duration-300"
            style={{ background: T.surface, border: `1px solid ${T.border}` }}
          >
            <h2 className="mb-4" style={{ color: T.text }}>
              {selectedSala.nome_sala}
            </h2>

            <TemperatureChart
              env={{
                name: selectedSala.nome_sala,
                minTemp: selectedSala.temperatura_min,
                maxTemp: selectedSala.temperatura_max,
                history: []
              }}
              T={T}
            />
          </div>

          <div
            className="p-4 rounded-xl transition-colors duration-300"
            style={{ background: T.card, border: `1px solid ${T.border}` }}
          >
            <h3 className="mb-3" style={{ color: T.text }}>Configuração</h3>

            <p className="text-sm" style={{ color: T.textSub }}>
              Mín: {selectedSala.temperatura_min}°C
            </p>

            <p className="text-sm" style={{ color: T.textSub }}>
              Máx: {selectedSala.temperatura_max}°C
            </p>
          </div>

        </div>
      )}

      <Chatbot />
    </div>
  );
}