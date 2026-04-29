"use client"

import React, { useState } from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import { Mail, Lock, User, ArrowLeft, Fingerprint } from "lucide-react"
import { api } from "@/services/api"
import { useRouter } from "next/navigation"

export default function CreateAccountPage() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")
  const router = useRouter()

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const handleCpfChange = (e) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
      setCpf(value)
    }
  }

  const handleRegister = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setErro("")

    if (!nome || !cpf || !email || !senha) {
      setErro("Preencha todos os campos")
      setLoading(false)
      return
    }

    try {
      const cpfLimpo = cpf.replace(/\D/g, "")
      await api.post("/api/register", { nome, cpf: cpfLimpo, email, senha })
      router.push("/login")
    } catch (err) {
      setErro(err.response?.data?.mensagem || "Erro ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');
        * { font-family: 'Outfit', sans-serif; }

        @keyframes btn-glow {
          0%, 100% { box-shadow: 0 0 18px rgba(190,80,230,0.5), 0 0 40px rgba(120,60,200,0.2); }
          50% { box-shadow: 0 0 28px rgba(210,100,255,0.7), 0 0 60px rgba(140,80,220,0.35); }
        }
        .btn-login {
          animation: btn-glow 2.2s ease-in-out infinite;
          background: linear-gradient(135deg, #be50e6 0%, #7c3aed 100%);
          border: none;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s;
        }
        .btn-login:hover { opacity: 0.9; transform: translateY(-1px); }
        .input-field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: white;
          width: 100%;
          padding: 11px 14px 11px 42px;
          font-size: 14px;
          outline: none;
          box-sizing: border-box;
        }
        .input-field:focus {
          border-color: rgba(190,80,230,0.6);
          background: rgba(255,255,255,0.07);
        }
      `}</style>

      {/* Fundo com Overlay Radial para destacar o centro */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('/imagens/baixados.gif')` }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at center, rgba(0,0,0,0.4), rgba(0,0,0,0.92))" }} />

      {/* Container Centralizado */}
      <div className="relative z-10 w-full flex justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          onMouseMove={handleMouseMove} 
          className="group relative w-full max-w-[380px]"
        >
          <motion.div className="absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl"
            style={{ background: useMotionTemplate`radial-gradient(220px circle at ${mouseX}px ${mouseY}px, rgba(190,80,230,0.45), transparent 75%)` }}
          />

          <div className="relative rounded-2xl overflow-hidden px-9 py-10 space-y-5" style={{ background: "rgba(8, 5, 22, 0.8)", backdropFilter: "blur(28px)", border: "1.5px solid rgba(190,80,230,0.22)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}>
            
            <h1 className="text-[28px] font-bold tracking-tight text-white">Criar conta<span className="text-purple-500">.</span></h1>

            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-[12px] text-purple-200/80 font-medium">Nome Completo</label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/70" />
                  <input type="text" placeholder="Seu nome" className="input-field" value={nome} onChange={(e) => setNome(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] text-purple-200/80 font-medium">CPF</label>
                <div className="relative">
                  <Fingerprint size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/70" />
                  <input type="text" placeholder="000.000.000-00" className="input-field" value={cpf} onChange={handleCpfChange} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] text-purple-200/80 font-medium">E-mail</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/70" />
                  <input type="email" placeholder="seu@email.com" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[12px] text-purple-200/80 font-medium">Senha</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/70" />
                  <input type="password" placeholder="••••••••" className="input-field" value={senha} onChange={(e) => setSenha(e.target.value)} />
                </div>
              </div>
            </div>

            <button onClick={handleRegister} disabled={loading} className="btn-login w-full rounded-xl text-white font-semibold py-3 mt-2 active:scale-[0.98]">
              {loading ? "Criando..." : "Cadastrar"}
            </button>

            {erro && <p className="text-red-400 text-sm text-center font-medium">{erro}</p>}

            <button onClick={() => router.push("/login")} className="flex items-center justify-center gap-2 w-full text-[12.5px] text-purple-400 hover:text-purple-300 bg-transparent border-none cursor-pointer mt-1">
              <ArrowLeft size={14} /> Já tenho uma conta
            </button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 w-full text-center text-purple-400/60 text-[12px] z-10">
        © 2026 TermoGuard. Todos os direitos reservados.
      </div>
    </div>
  )
}