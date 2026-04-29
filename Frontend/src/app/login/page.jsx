"use client"

import React, { useState } from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { api } from "@/services/api"
import { useRouter } from "next/navigation"


export default function LoginPage() {

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [showPassword, setShowPassword] = useState(false)

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

  const handleLogin = async (e) => {
    e?.preventDefault()
    setLoading(true)
    setErro("")

    if (!email || !senha) {
      setErro("Preencha todos os campos")
      setLoading(false)
      return
    }

    try {
      const res = await api.post("/api/login", {
        email,
        senha
      })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario))
      router.push("/dashboard")

    } catch (err) {
      console.error(err)

      const mensagem =
        err.response?.data?.mensagem ||
        "Email ou senha inválidos";

      setErro(mensagem)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-black">

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
        .btn-login:active { transform: translateY(0); }

        .input-field {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: white;
          width: 100%;
          padding: 11px 14px 11px 42px;
          font-size: 14px;
          font-family: 'Outfit', sans-serif;
          outline: none;
          transition: border-color 0.25s, background 0.25s;
          box-sizing: border-box;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.28); }
        .input-field:focus {
          border-color: rgba(190,80,230,0.6);
          background: rgba(255,255,255,0.07);
        }
      `}</style>

     
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/imagens/baixados.gif')` }}
      />

      
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              to right,
              rgba(0,0,0,0.92) 0%,
              rgba(0,0,0,0.85) 20%,
              rgba(0,0,0,0.55) 45%,
              rgba(0,0,0,0.15) 100%
            )
          `
        }}
      />

      
      <div className="absolute z-10 flex items-center justify-center" style={{ left: 0, top: 0, bottom: 0, width: "45%" }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          onMouseMove={handleMouseMove}
          className="group relative w-full max-w-[360px]"
        >
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  220px circle at ${mouseX}px ${mouseY}px,
                  rgba(190,80,230,0.45),
                  transparent 75%
                )
              `,
            }}
          />

          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "rgba(8, 5, 22, 0.72)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1.5px solid rgba(190,80,230,0.22)",
              boxShadow: "inset 0 0 30px rgba(168,85,247,0.08), 0 24px 64px rgba(0,0,0,0.6)",
            }}
          >
            <div className="px-9 py-10 space-y-7">

              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="text-[28px] font-bold text-white tracking-tight"
              >
                Faça seu login
                <span style={{ color: "#be50e6", marginLeft: "3px" }}>.</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label style={{ color: "rgba(200,180,230,0.85)", fontSize: "13px", fontWeight: 500 }}>
                    E-mail
                  </label>
                  <div className="relative">
                    <Mail size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(190,80,230,0.7)" }} />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      className="input-field"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label style={{ color: "rgba(200,180,230,0.85)", fontSize: "13px", fontWeight: 500 }}>
                    Senha
                  </label>
                  <div className="relative">
                    <Lock size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "rgba(190,80,230,0.7)" }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="input-field"
                      style={{ paddingRight: "42px" }}
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleLogin()
                      }}
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(190,80,230,0.6)", padding: 0, display: "flex", alignItems: "center" }}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* --- LINK CORRIGIDO PARA A PASTA 'ESQUECI' --- */}
                <div className="text-right">
                  <button 
                    onClick={() => router.push("/login/esqueci")}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "rgba(190,80,230,0.8)", textDecoration: "none", padding: 0 }}
                    onMouseEnter={e => e.target.style.color = "rgba(220,130,255,1)"}
                    onMouseLeave={e => e.target.style.color = "rgba(190,80,230,0.8)"}
                  >
                    Esqueci minha senha
                  </button>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.5 }}>
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="btn-login w-full rounded-xl text-white font-semibold text-[15px] py-3"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </motion.div>

              {erro && (
                <p className="text-red-400 text-sm text-center">
                  {erro}
                </p>
              )}

              
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
                className="text-center"
                style={{ fontSize: "12.5px", color: "rgba(180,160,210,0.6)" }}
              >
                Ainda não tenho uma conta{" "}
                <button 
                  onClick={() => router.push("/login/criar")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(190,80,230,0.85)", textDecoration: "none", fontWeight: 600, padding: 0 }}
                  onMouseEnter={e => e.target.style.color = "rgba(220,130,255,1)"}
                  onMouseLeave={e => e.target.style.color = "rgba(190,80,230,0.85)"}
                >
                  Registre-se
                </button>
              </motion.p>

            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10"
        style={{ color: "rgb(192, 132, 252)", fontSize: "12px" }}
      >
        <span>© 2026 TermoGuard. Todos os direitos reservados.</span>
      </motion.div>

    </div>
  )
}