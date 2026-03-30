"use client";

import { useState } from "react";
import { initialEnvs } from "@/data/mockData";
import EnvironmentCard from "@/components/EnvironmentCard";
import TemperatureChart from "@/components/TemperatureChart";
import { themes } from "@/theme/theme";

export default function AmbientesPage() {
  const [selectedEnv, setSelectedEnv] = useState(initialEnvs[0]);
  const T = themes.dark;

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {initialEnvs.map(env => (
          <EnvironmentCard
            key={env.id}
            env={env}
            T={T}
            selected={selectedEnv.id === env.id}
            onClick={() => setSelectedEnv(env)}
          />
        ))}
      </div>

      <TemperatureChart env={selectedEnv} T={T} />
    </div>
  );
}