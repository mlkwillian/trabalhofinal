"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const zones = [
  {
    id: "prod",
    label: "Linha de Produção",
    emoji: "🏭",
    base: 32.4,
    delta: 1.2,
    min: 0,
    max: 50,
    colorClass: "text-orange-400",
    barColor: "linear-gradient(90deg,#f97316,#facc15)",
    status: "⚠ Acima do ideal",
    statusClass: "bg-orange-500/15 text-orange-300",
  },
  {
    id: "cold",
    label: "Câmara Fria",
    emoji: "❄️",
    base: 4.1,
    delta: 0.3,
    min: -10,
    max: 20,
    colorClass: "text-sky-400",
    barColor: "linear-gradient(90deg,#38bdf8,#818cf8)",
    status: "✓ Temperatura ideal",
    statusClass: "bg-green-500/15 text-green-400",
  },
  {
    id: "dc",
    label: "Data Center",
    emoji: "🖥",
    base: 21.8,
    delta: 0.5,
    min: 15,
    max: 30,
    colorClass: "text-green-400",
    barColor: "linear-gradient(90deg,#4ade80,#38bdf8)",
    status: "✓ Temperatura ideal",
    statusClass: "bg-green-500/15 text-green-400",
  },
  {
    id: "stock",
    label: "Almoxarifado",
    emoji: "📦",
    base: 28.9,
    delta: 0.8,
    min: 0,
    max: 50,
    colorClass: "text-red-400",
    barColor: "linear-gradient(90deg,#f97316,#ef4444)",
    status: "🔥 Alerta ativo",
    statusClass: "bg-red-500/15 text-red-400",
  },
];

function pct(value, min, max) {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

export function LiveGauges() {
  const [values, setValues] = useState(
    Object.fromEntries(zones.map((z) => [z.id, z.base]))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(
        Object.fromEntries(
          zones.map((z) => [
            z.id,
            parseFloat((z.base + (Math.random() - 0.5) * z.delta).toFixed(1)),
          ])
        )
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="inline-block mb-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs uppercase tracking-widest">
            Monitoramento ao Vivo
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Suas áreas agora</h2>
          <p className="text-purple-300">Temperaturas atualizadas em tempo real de cada setor.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map((zone, i) => {
            const val = values[zone.id];
            const bar = pct(val, zone.min, zone.max);
            return (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, borderColor: "rgba(139,92,246,0.5)" }}
                className="bg-purple-950/30 border border-purple-500/20 rounded-2xl p-6 transition-colors"
              >
                <div className="text-xs text-purple-400 uppercase tracking-widest mb-3">
                  {zone.emoji} {zone.label}
                </div>
                <div className={`text-5xl font-bold tabular-nums mb-3 ${zone.colorClass}`}>
                  {val}°
                </div>
                <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block mb-4 ${zone.statusClass}`}>
                  {zone.status}
                </div>
                <div className="h-1.5 rounded-full bg-purple-500/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: zone.barColor }}
                    animate={{ width: `${bar}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}