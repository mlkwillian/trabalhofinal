"use client"

import React, { useState } from "react"
import { motion, useMotionValue, useMotionTemplate } from "framer-motion"
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react"

import { useRouter } from "next/navigation"
import axios from "axios"

export default function CreateAccountPage() {

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [tipoUsuario, setTipoUsuario] = useState("qualidade")

  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("")

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

  const handleRegister = async (e) => {

    e.preventDefault()

    setLoading(true)
    setErro("")

    try {

      if (!nome || !email || !senha) {
        setErro("Preencha todos os campos")
        setLoading(false)
        return
      }

      const response = await axios.post(
        "http://localhost:3000/api/usuarios",
        {
          nome,
          email,
          senha,
          tipo_usuario: tipoUsuario
        }
      )

      console.log(response.data)

      alert("Conta criada com sucesso!")

      router.push("/login")

    } catch (err) {

      console.error(err)

      setErro(
        err?.response?.data?.erro ||
        err?.response?.data?.mensagem ||
        "Erro ao criar conta"
      )

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');

        * {
          font-family: 'Outfit', sans-serif;
        }

        @keyframes glow {
          0%,100% {
            box-shadow:
              0 0 20px rgba(190,80,230,0.35),
              0 0 60px rgba(124,58,237,0.15);
          }

          50% {
            box-shadow:
              0 0 35px rgba(210,100,255,0.55),
              0 0 80px rgba(124,58,237,0.25);
          }
        }

        .btn-register {
          animation: glow 2.4s ease-in-out infinite;
          background: linear-gradient(
            135deg,
            #be50e6 0%,
            #7c3aed 100%
          );
        }

        .btn-register:hover {
          opacity: 0.92;
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
        }

        .input-field:focus {
          border-color: rgba(190,80,230,0.6);
          background: rgba(255,255,255,0.08);
        }

        .input-field::placeholder {
          color: rgba(255,255,255,0.3);
        }

        select option {
          background: #12091f;
          color: white;
        }
      `}</style>

      {/* background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/imagens/baixados.gif')"
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.35), rgba(0,0,0,0.94))"
        }}
      />

      {/* card */}
      <div className="relative z-10 w-full flex justify-center px-4">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1]
          }}
          onMouseMove={handleMouseMove}
          className="group relative w-full max-w-[380px]"
        >

          {/* glow */}
          <motion.div
            className="absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-500 rounded-2xl"
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

          {/* content */}
          <div
            className="relative rounded-2xl overflow-hidden px-8 py-9"
            style={{
              background: "rgba(8,5,22,0.78)",
              backdropFilter: "blur(28px)",
              border:
                "1.5px solid rgba(190,80,230,0.2)",
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.6)"
            }}
          >

            {/* title */}
            <h1 className="text-[28px] font-bold text-white tracking-tight mb-7">
              Criar conta
              <span className="text-purple-500">.</span>
            </h1>

            {/* form */}
            <form
              onSubmit={handleRegister}
              className="space-y-4"
            >

              {/* nome */}
              <div className="space-y-1.5">

                <label className="text-[12px] text-purple-200/80 font-medium">
                  Nome completo
                </label>

                <div className="relative">

                  <User
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/70"
                  />

                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="input-field"
                    value={nome}
                    onChange={(e) =>
                      setNome(e.target.value)
                    }
                  />

                </div>
              </div>

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

              {/* tipo usuario */}
              <div className="space-y-1.5">

                <label className="text-[12px] text-purple-200/80 font-medium">
                  Tipo de usuário
                </label>

                <div className="relative">

                  <User
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/70"
                  />

                  <select
                    className="input-field appearance-none"
                    value={tipoUsuario}
                    onChange={(e) =>
                      setTipoUsuario(e.target.value)
                    }
                  >
                    <option value="gestor">
                      Gestor
                    </option>

                    <option value="manutencao">
                      Manutenção
                    </option>

                    <option value="qualidade">
                      Qualidade
                    </option>

                  </select>

                </div>
              </div>

              {/* senha */}
              <div className="space-y-1.5">

                <label className="text-[12px] text-purple-200/80 font-medium">
                  Senha
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
                    value={senha}
                    onChange={(e) =>
                      setSenha(e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-purple-400"
                  >
                    {showPassword
                      ? <EyeOff size={15} />
                      : <Eye size={15} />
                    }
                  </button>

                </div>
              </div>

              {/* erro */}
              {erro && (
                <p className="text-red-400 text-sm text-center">
                  {erro}
                </p>
              )}

              {/* button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-register w-full rounded-xl text-white font-semibold py-3 mt-2 transition-all"
              >
                {
                  loading
                    ? "Criando conta..."
                    : "Cadastrar"
                }
              </button>

            </form>

            {/* login */}
            <button
              onClick={() => router.push("/login")}
              className="flex items-center justify-center gap-2 w-full mt-5 text-[13px] text-purple-400 hover:text-purple-300 transition"
            >
              <ArrowLeft size={14} />
              Já tenho uma conta
            </button>

          </div>

        </motion.div>

      </div>

      {/* footer */}
      <div className="absolute bottom-6 w-full text-center text-purple-400/50 text-[12px] z-10">
        © 2026 TermoGuard
      </div>

    </div>
  )
}