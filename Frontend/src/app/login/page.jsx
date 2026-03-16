"use client"

import React from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Thermometer, Activity, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#0B0217] overflow-hidden">
      
      <style jsx global>{`
        @keyframes neon-pulse {
          0%, 100% { box-shadow: 0 0 15px rgba(168, 85, 247, 0.4); }
          50% { box-shadow: 0 0 25px rgba(168, 85, 247, 0.7); }
        }
        .animate-neon-pulse {
          animation: neon-pulse 2s infinite;
        }
      `}</style>

      {/* --- LADO ESQUERDO --- */}
      <div className="relative hidden lg:flex flex-col justify-center px-12 xl:px-24 border-r border-purple-900/30 bg-gradient-to-br from-[#0B0217] to-[#1A0F35]">
        <div className="absolute w-[500px] h-[500px] bg-purple-700/10 blur-[120px] rounded-full -top-20 -left-20 animate-pulse" />
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-6"
        >
          <div className="flex items-center gap-2 text-purple-400 mb-4">
            <Thermometer className="w-8 h-8" />
            <span className="text-2xl font-bold tracking-tight text-white">ThermoGuard</span>
          </div>
          <h2 className="text-5xl font-extrabold text-white leading-tight">
            Precisão absoluta no <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              clima do seu negócio.
            </span>
          </h2>
          <p className="text-lg text-purple-300/70 max-w-md leading-relaxed">
            Monitore e controle a temperatura em tempo real com segurança e eficiência.
          </p>
        </motion.div>
      </div>

      {/* --- LADO DIREITO: LOGIN --- */}
      <div className="flex items-center justify-center p-8 relative">
        <div className="absolute w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full bottom-0 right-0 animate-pulse" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onMouseMove={handleMouseMove}
          className="group relative w-full max-w-[400px] z-10 p-[1.5px] rounded-2xl overflow-hidden"
        >
          {/* O SEGREDO DO CONTORNO INTEIRO:
              Este div fica atrás do card e simula a borda neon em volta de tudo.
          */}
          <div className="absolute inset-0 bg-purple-900/40 group-hover:bg-purple-500 transition-colors duration-500" />
          
          {/* Brilho que segue o mouse na borda */}
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-500"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  250px circle at ${mouseX}px ${mouseY}px,
                  #a855f7,
                  transparent 80%
                )
              `,
            }}
          />

          <Card className="relative bg-[#0B0217] border-none rounded-[14px] overflow-hidden">
            {/* Sombra interna para dar profundidade ao contorno */}
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(168,85,247,0.15)] pointer-events-none" />
            
            <CardContent className="p-10 space-y-6 text-white relative z-10">
              <div className="text-center space-y-2 lg:text-left">
                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-white to-purple-200">
                  Bem-vindo!
                </h3>
                <p className="text-sm text-purple-300/60">
                  Acesse sua conta para continuar.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-purple-200">Email</Label>
                  <Input
                    placeholder="seu@email.com"
                    className="bg-black/60 border-purple-900/30 focus:border-purple-500 h-11 text-white placeholder:text-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-purple-200">Senha</Label>
                    <a href="#" className="text-xs text-purple-400 hover:text-purple-300">Esqueceu?</a>
                  </div>
                  <Input
                    type="password"
                    placeholder="********"
                    className="bg-black/60 border-purple-900/30 focus:border-purple-500 h-11 text-white placeholder:text-white/10"
                  />
                </div>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold h-11 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all animate-neon-pulse">
                Entrar no Sistema
              </Button>

              <p className="text-center text-xs text-purple-300/40">
                &copy; 2026 ThermoGuard - Todos os direitos reservados.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}