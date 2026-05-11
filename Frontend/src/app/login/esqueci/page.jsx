"use client"

import React, { useState } from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import {
  Mail,
  Lock,
  ArrowLeft,
  Eye,
 EyeOff
} from "lucide-react"

import { api } from "@/services/api"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const [email, setEmail] = useState("")
  const [novaSenha, setNovaSenha] = useState("")
  const [confirmarSenha, setConfirmarSenha] = useState("")

  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)

  const [status, setStatus] = useState({
    type: "",
    msg: ""
  })

  const router = useRouter()

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY
  }) {

    const { left, top } =
      currentTarget.getBoundingClientRect()

    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const handleReset = async (e) => {

    e.preventDefault()

    setStatus({
      type: "",
      msg: ""
    })

    if (
      !email ||
      !novaSenha ||
      !confirmarSenha
    ) {
      return setStatus({
        type: "error",
        msg: "Preencha todos os campos"
      })
    }

    if (novaSenha.length < 6) {
      return setStatus({
        type: "error",
        msg: "A senha deve ter no mínimo 6 caracteres"
      })
    }

    if (novaSenha !== confirmarSenha) {
      return setStatus({
        type: "error",
        msg: "As senhas não coincidem"
      })
    }

    try {

      setLoading(true)

      await api.put("/api/reset-password", {
        email,
        novaSenha
      })

      setStatus({
        type: "success",
        msg: "Senha alterada com sucesso!"
      })

      setTimeout(() => {
        router.push("/login")
      }, 1800)

    } catch (err) {

      console.error(err)

      setStatus({
        type: "error",
        msg:
          err?.response?.data?.erro ||
          err?.response?.data?.mensagem ||
          "Erro ao alterar senha"
      })

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white">

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');

        * {
          font-family: 'Outfit', sans-serif;
        }

        @keyframes glow {
          0%,100% {
            box-shadow:
              0 0 18px rgba(190,80,230,0.45),
              0 0 50px rgba(124,58,237,0.15);
          }

          50% {
            box-shadow:
              0 0 30px rgba(210,100,255,0.65),
              0 0 70px rgba(124,58,237,0.22);
          }
        }

        .btn-glow {
          animation: glow 2.2s ease-in-out infinite;
          background: linear-gradient(
            135deg,
            #be50e6 0%,
            #7c3aed 100%
          );
          border: none;
          cursor: pointer;
          transition:
            opacity .2s,
            transform .15s;
        }

        .btn-glow:hover {
          opacity: .92;
        }

        .btn-glow:active {
          transform: scale(.98);
        }

        .input-field {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          outline: none;
          transition: all .25s ease;
          box-sizing: border-box;
        }

        .input-field::placeholder {
          color: rgba(255,255,255,0.28);
        }

        .input-field:focus {
          border-color: rgba(190,80,230,0.6);
          background: rgba(255,255,255,0.08);
        }
      `}</style>

      {/* fundo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/imagens/baixados.gif')"
        }}
      />

      {/* overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.35), rgba(0,0,0,0.94))"
        }}
      />

      {/* container */}
      <div className="relative z-10 w-full flex justify-center px-4">

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.7
          }}
          onMouseMove={handleMouseMove}
          className="group relative w-full max-w-[390px]"
        >

          {/* glow */}
          <motion.div
            className="absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl"
            style={{
              background: useMotionTemplate`
                radial-gradient(
                  220px circle at ${mouseX}px ${mouseY}px,
                  rgba(190,80,230,0.4),
                  transparent 75%
                )
              `
            }}
          />

          {/* card */}
          <div
            className="relative rounded-2xl overflow-hidden px-9 py-10"
            style={{
              background: "rgba(8,5,22,0.78)",
              backdropFilter: "blur(28px)",
              border:
                "1.5px solid rgba(190,80,230,0.22)",
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.6)"
            }}
          >

            {/* título */}
            <div className="mb-7">

              <h1 className="text-[28px] font-bold tracking-tight">
                Redefinir senha
                <span className="text-purple-500">
                  .
                </span>
              </h1>

              <p className="text-[13px] text-purple-200/50 mt-1">
                Digite seu e-mail e sua nova senha.
              </p>

            </div>

            {/* formulário */}
            <form
              onSubmit={handleReset}
              className="space-y-4"
            >

              {/* email */}
              <div className="space-y-1.5">

                <label className="text-[12px] text-purple-200/80 font-medium">
                  E-mail
                </label>

                <div className="relative">

                  <Mail
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/70"
                  />

                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="input-field"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                  />

                </div>
              </div>

              {/* nova senha */}
              <div className="space-y-1.5">

                <label className="text-[12px] text-purple-200/80 font-medium">
                  Nova senha
                </label>

                <div className="relative">

                  <Lock
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/70"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="••••••••"
                    className="input-field"
                    style={{
                      paddingRight: "42px"
                    }}
                    value={novaSenha}
                    onChange={(e) =>
                      setNovaSenha(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-purple-500/60 hover:text-purple-400"
                  >
                    {showPassword
                      ? <EyeOff size={15} />
                      : <Eye size={15} />
                    }
                  </button>

                </div>
              </div>

              {/* confirmar */}
              <div className="space-y-1.5">

                <label className="text-[12px] text-purple-200/80 font-medium">
                  Confirmar senha
                </label>

                <div className="relative">

                  <Lock
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/70"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="••••••••"
                    className="input-field"
                    value={confirmarSenha}
                    onChange={(e) =>
                      setConfirmarSenha(e.target.value)
                    }
                  />

                </div>
              </div>

              {/* status */}
              {status.msg && (
                <p
                  className={`text-sm text-center font-medium ${
                    status.type === "error"
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {status.msg}
                </p>
              )}

              {/* botão */}
              <button
                type="submit"
                disabled={loading}
                className="btn-glow w-full rounded-xl py-3.5 text-white font-semibold mt-2"
              >
                {
                  loading
                    ? "Alterando..."
                    : "Alterar Senha"
                }
              </button>

            </form>

            {/* voltar */}
            <button
              onClick={() =>
                router.push("/login")
              }
              className="flex items-center justify-center gap-2 w-full mt-5 text-[13px] text-purple-400 hover:text-purple-300 transition"
            >
              <ArrowLeft size={14} />
              Voltar para login
            </button>

          </div>

        </motion.div>

      </div>

    </div>
  )
}