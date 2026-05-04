"use client";

import { motion } from "framer-motion";

export function LandingHero() {
  const chips = [
    { label: "18°C · Sala Fria", color: "#4ade80", pos: "top-[8%] left-[2%]", anim: [0, -8, 0], rot: [-2, 2] },
    { label: "32°C · Produção", color: "#fb923c", pos: "top-[22%] right-[-4%]", anim: [0, -12, 0], rot: [3, -1] },
    { label: "22°C · Escritório", color: "#38bdf8", pos: "bottom-[18%] left-[0%]", anim: [0, -6, 0], rot: [-1, 3] },
    { label: "26°C · Almoxarife", color: "#818cf8", pos: "bottom-[6%] right-[-2%]", anim: [0, -9, 0], rot: [2, -2] },
  ];

  return (
    <section className="relative overflow-hidden pt-20 pb-32 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-purple-200 via-violet-200 to-purple-300 bg-clip-text text-transparent">
              Controle Total da Temperatura
            </h1>
            <div className="flex items-center gap-4 mt-4">
             <motion.a
    href="/planos"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-medium shadow-lg shadow-purple-500/20 border border-purple-400/30"
  >
    Nossos Planos
  </motion.a>

  <motion.a
    href="#sobre"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className="px-6 py-3 rounded-xl border border-purple-500/30 text-purple-300 font-medium backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300"
  >
    Saiba mais
  </motion.a>
  </div>
  
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto flex items-center justify-center">

              {/* ORBITAS */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute w-60 h-60 rounded-full border border-dashed border-purple-500/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                className="absolute w-[310px] h-[310px] rounded-full border border-dashed border-purple-500/55"
              />

              {/* 🔥 TERMÔMETRO SVG ANIMADO */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg
                  width="110"
                  height="110"
                  viewBox="0 0 110 110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow-[0_0_30px_rgba(167,139,250,0.5)]"
                >
                  <defs>
                    <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(167,139,250,0.4)" />
                      <stop offset="100%" stopColor="rgba(167,139,250,0)" />
                    </radialGradient>
                  </defs>

                  {/* glow */}
                  <ellipse cx="55" cy="55" rx="50" ry="50" fill="url(#glowGrad)" />

                  {/* tubo */}
                  <rect
                    x="44"
                    y="14"
                    width="22"
                    height="58"
                    rx="11"
                    stroke="#a78bfa"
                    strokeWidth="2.5"
                  />

                  {/* líquido animado */}
                  <rect x="50" y="20" width="10" rx="5" fill="#7c3aed" opacity="0.7">
                    <animate
                      attributeName="height"
                      values="30;42;20;38;30"
                      dur="6s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="fill"
                      values="#7c3aed;#fb923c;#38bdf8;#7c3aed;#7c3aed"
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </rect>

                  {/* bulbo externo */}
                  <circle
                    cx="55"
                    cy="82"
                    r="16"
                    stroke="#a78bfa"
                    strokeWidth="2.5"
                  />

                  {/* bulbo interno animado */}
                  <circle cx="55" cy="82" r="11" fill="#7c3aed">
                    <animate
                      attributeName="fill"
                      values="#7c4ad1;#fb923c;#38bdf8;#7c3aed;#7c3aed"
                      dur="6s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* marcações */}
                  <line x1="34" y1="35" x2="44" y2="35" stroke="#a78bfa" strokeWidth="1.5" opacity="0.6" />
                  <line x1="34" y1="50" x2="44" y2="50" stroke="#a78bfa" strokeWidth="1.5" opacity="0.6" />
                  <line x1="34" y1="65" x2="44" y2="65" stroke="#a78bfa" strokeWidth="1.5" opacity="0.6" />
                </svg>
              </motion.div>

             
               {/* CHIPS */}
              {chips.map((chip, i) => (
                <motion.div
                  key={i}
                  animate={{ y: chip.anim, rotate: chip.rot }}
                  transition={{ duration: 5 + i, repeat: Infinity }}
                  className={`absolute ${chip.pos} flex items-center gap-2 px-3 py-2 rounded-xl backdrop-blur-sm border border-purple-500/30 bg-[#0e0c1e]/90 text-sm text-white`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: chip.color }}
                  />
                  {chip.label}
                </motion.div>
              ))}

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}