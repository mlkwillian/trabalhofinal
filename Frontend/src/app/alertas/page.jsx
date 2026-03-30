"use client";

import { useState } from "react";
import { initialAlerts } from "@/data/mockData";
import AlertsList from "@/components/AlertsList";
import { themes } from "@/theme/theme";

export default function AlertasPage() {
  const [alertsData, setAlertsData] = useState(initialAlerts);
  const T = themes.dark;

  const handleVerify = (id) => {
    setAlertsData(prev =>
      prev.map(a => a.id === id ? { ...a, verified: true } : a)
    );
  };

  return (
    <div className="p-6 max-w-2xl">
      <AlertsList alerts={alertsData} onVerify={handleVerify} T={T} />
    </div>
  );
}