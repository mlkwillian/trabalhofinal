"use client";

import { initialAlerts } from "@/data/mockData";
import AuditReport from "@/components/AuditReport";
import { themes } from "@/theme/theme";

export default function RelatoriosPage() {
  const T = themes.dark;

  return (
    <div className="p-6">
      <AuditReport alerts={initialAlerts} T={T} />
    </div>
  );
}