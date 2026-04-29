"use client";

import { motion } from "framer-motion";

const checks = [
  "Sensores de alta precisão ±0.1°C",
  "Conectividade Wi-Fi, LoRa e Zigbee",
  "Análise preditiva com machine learning",
  "Dashboard personalizado por setor",
];

// Thermometer fill: cycles through cold → warm → hot → normal
const levels = [
  { height: "40%", color: "linear-gradient(to top,#818cf8,#38bdf8)", bulb: "4°C" },
  { height: "72%", color: "linear-gradient(to top,#7c3aed,#a78bfa)", bulb: "24°C" },
  { height: "88%", color: "linear-gradient(to top,#f97316,#facc15)", bulb: "38°C" },
  { height: "60%", color: "linear-gradient(to top,#7c3aed,#a78bfa)", bulb: "20°C" },
];

const scaleLabels = ["50°", "40°", "30°", "20°", "10°", "0°"];

export function ThermoAnimation() {
  return (
    <section className="border-t border-b border-purple-500/20 bg-purple-950/10 py-20 px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Text */}
        <div className="flex-1">
          <div className="inline-block mb-3 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs uppercase tracking-widest">
            Tecnologia
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Precisão que faz diferença
          </h2>
          <p className="text-purple-300 leading-relaxed mb-6 max-w-md">
            Nossa plataforma detecta variações mínimas e age antes que se tornem um problema.
            Sensores calibrados, dados confiáveis, decisões mais rápidas.
          </p>
          <ul className="flex flex-col gap-3">
            {checks.map((c) => (
              <li key={c} className="flex items-center gap-3 text-purple-200 text-sm">
                <span className="text-green-400 font-bold">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* Animated thermometer */}
        <div className="relative flex flex-col items-center flex-shrink-0">
          {/* Scale */}
          <div className="absolute right-[-40px] top-0 bottom-[56px] flex flex-col justify-between text-xs text-purple-400">
            {scaleLabels.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </div>

          {/* Tube */}
          <div className="w-10 h-52 rounded-t-full border border-purple-500/30 bg-purple-500/5 relative overflow-hidden mb-[-2px]">
            <motion.div
              className="absolute bottom-0 left-0 right-0 rounded-t-full"
              animate={{
                height: levels.map((l) => l.height),
                background: levels.map((l) => l.color),
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                times: [0, 0.33, 0.66, 1],
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Bulb */}
          <motion.div
            className="w-14 h-14 rounded-full border border-purple-500/30 flex items-center justify-center text-xs font-bold text-white"
            animate={{
              background: levels.map((l) =>
                l.color.replace("to top,", "135deg,")
              ),
              boxShadow: [
                "0 0 20px rgba(124,58,237,0.5)",
                "0 0 20px rgba(124,58,237,0.5)",
                "0 0 30px rgba(249,115,22,0.6)",
                "0 0 20px rgba(56,189,248,0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          >
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Display changes with animation phase — simple static label */}
              °C
            </motion.span>
          </motion.div>
        </div>

        {/* Sparkline card */}
        <div className="flex-1 w-full">
          <div className="bg-purple-950/40 border border-purple-500/20 rounded-2xl p-6">
            <div className="text-xs text-purple-400 uppercase tracking-widest mb-4">
              Últimas 24h — Câmara Fria
            </div>
            <svg width="100%" height="100" viewBox="0 0 280 100" className="overflow-visible">
              <defs>
                <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 70 C20 68 30 72 50 65 C70 58 80 75 100 60 C120 45 140 70 160 55 C180 40 200 65 220 50 C240 35 260 60 280 48"
                fill="none"
                stroke="#a78bfa"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M0 70 C20 68 30 72 50 65 C70 58 80 75 100 60 C120 45 140 70 160 55 C180 40 200 65 220 50 C240 35 260 60 280 48 L280 100 L0 100 Z"
                fill="url(#sparkGrad)"
              />
              {/* Live dot */}
              <circle cx="280" cy="48" r="4" fill="#a78bfa" />
              <motion.circle
                cx={280}
                cy={48}
                r={4}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="1"
                animate={{ r: [4, 12, 4], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <text x="0" y="98" fill="#9b8fc0" fontSize="10">00h</text>
              <text x="125" y="98" fill="#9b8fc0" fontSize="10">12h</text>
              <text x="258" y="98" fill="#9b8fc0" fontSize="10">24h</text>
            </svg>
            <div className="flex justify-between mt-4 pt-4 border-t border-purple-500/20">
              {[
                { label: "Mínima", value: "3.2°C", color: "text-sky-400" },
                { label: "Média",  value: "4.8°C", color: "text-white"   },
                { label: "Máxima", value: "6.1°C", color: "text-yellow-400" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-xs text-purple-400 mb-1">{s.label}</div>
                  <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}