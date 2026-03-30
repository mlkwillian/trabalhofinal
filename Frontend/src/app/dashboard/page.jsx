"use client";

import { useState } from "react";
import { initialEnvs, initialAlerts } from "@/data/mockData";
import StatCard from "@/components/StatCard";
import EnvironmentCard from "@/components/EnvironmentCard";
import TemperatureChart from "@/components/TemperatureChart";
import AlertsList from "@/components/AlertsList";
import AuditReport from "@/components/AuditReport";
import { themes } from "@/theme/theme";

// ✅ IMPORTANTE: importar os ícones
import { BarChart3, Wifi, AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const [selectedEnv, setSelectedEnv] = useState(initialEnvs[0]);
  const [alertsData, setAlertsData] = useState(initialAlerts);

  const T = themes.dark;

  const handleVerify = (alertId) => {
    setAlertsData(prev =>
      prev.map(a => a.id === alertId ? { ...a, verified: true } : a)
    );
  };

  // ✅ AGORA COM ICON E COR
  const stats = [
    {
      label: "Ambientes",
      value: initialEnvs.length,
      icon: BarChart3,
      accentColor: "#7c3aed",
    },
    {
      label: "Online",
      value: initialEnvs.filter(e => e.online).length,
      icon: Wifi,
      accentColor: "#22c55e",
    },
    {
      label: "Alertas",
      value: alertsData.filter(a => !a.verified).length,
      icon: AlertTriangle,
      accentColor: "#f97316",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} T={T} />
        ))}
      </div>

      {/* Ambientes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {initialEnvs.map((env) => (
          <EnvironmentCard
            key={env.id}
            env={env}
            T={T}
            selected={selectedEnv.id === env.id}
            onClick={() => setSelectedEnv(env)}
          />
        ))}
      </div>

      {/* Gráfico + Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TemperatureChart env={selectedEnv} T={T} />
        </div>

        <AlertsList
          alerts={alertsData}
          onVerify={handleVerify}
          T={T}
        />
      </div>

      {/* Relatório */}
      <AuditReport alerts={alertsData} T={T} />
    </div>
  );
}