"use client";

import { motion } from "framer-motion";
import { ArrowRight, Thermometer } from "lucide-react";
import Link from "next/link";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block mb-4 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30"
            >
              <span className="text-purple-300 text-sm">Monitoramento Inteligente</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl mb-6 bg-gradient-to-r from-purple-200 via-violet-200 to-purple-300 bg-clip-text text-transparent">
              Controle Total da Temperatura
            </h1>

            <p className="text-xl text-purple-200 mb-8 leading-relaxed">
              Monitore e gerencie a temperatura de todas as áreas da sua empresa em tempo real. 
              Previna problemas, economize energia e garanta o ambiente ideal para seus processos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
             <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl hover:from-purple-500 hover:to-violet-500 transition-all flex items-center gap-2 justify-center"
                >
                  <span>Acessar Dashboard</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-purple-500/50 rounded-xl text-purple-200 hover:bg-purple-500/10 transition-all"
              >
                Saiba Mais
              </motion.button>
            </div>
          </motion.div>

          {/* Right content - Animated illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Central thermometer */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-3xl" />
                  <Thermometer className="h-32 w-32 text-purple-400 relative z-10" />
                </div>
              </motion.div>

              {/* Orbiting elements */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20 + i * 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div
                    className="absolute w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/30 to-violet-500/30 border border-purple-500/50 backdrop-blur-sm flex items-center justify-center"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-180px) rotate(-${angle}deg)`,
                    }}
                  >
                    <span className="text-purple-300">{18 + i * 2}°C</span>
                  </div>
                </motion.div>
              ))}

              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 60px 20px rgba(147, 51, 234, 0.3)",
                    "0 0 80px 30px rgba(168, 85, 247, 0.4)",
                    "0 0 60px 20px rgba(147, 51, 234, 0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>
    </section>
  );
}
