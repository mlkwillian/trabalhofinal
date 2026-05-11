"use client";

import { useRef, useState } from "react";
import {
  Shield,
  Globe,
  Lock,
  Bell,
  User,
  Eye,
  ChevronRight,
} from "lucide-react";

export default function ConfiguracoesSistema() {
  // STATES
  const [idioma, setIdioma] = useState("pt-BR");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // REFS
  const perfilRef = useRef(null);
  const idiomaRef = useRef(null);
  const segurancaRef = useRef(null);
  const notificacoesRef = useRef(null);

  // SCROLL
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-[#05010b] text-white flex overflow-hidden">
     
      <aside
        className="
          w-[340px]
          border-r
          border-purple-900/30
          bg-[#090114]
          px-8
          py-10
          flex
          flex-col
        "
      >
        
        <div className="flex flex-col items-center">
          <div
            className="
              w-28
              h-28
              rounded-full
              bg-gradient-to-br
              from-purple-400
              to-purple-700
              flex
              items-center
              justify-center
              text-4xl
              font-bold
              shadow-[0_0_50px_rgba(168,85,247,0.45)]
            "
          >
            AT
          </div>

          <h2 className="mt-6 text-4xl font-bold">
            Admin Thermo
          </h2>

          

          <div className="w-full border-t border-purple-900/30 mt-10 pt-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                Último acesso
              </span>

              <span className="font-semibold">
                Hoje, 09:14
              </span>
            </div>

            <div className="flex justify-between text-sm mt-4">
              <span className="text-gray-400">
                Status
              </span>

              <span className="text-green-400 font-semibold">
                Ativa
              </span>
            </div>
          </div>
        </div>

        
        <div className="mt-12 flex flex-col gap-3">
          <button
            onClick={() => scrollToSection(perfilRef)}
            className="
              group
              flex
              items-center
              justify-between
              bg-purple-950/60
              hover:bg-purple-900/60
              transition-all
              duration-300
              px-5
              py-4
              rounded-2xl
            "
          >
            <div className="flex items-center gap-4">
              <User size={20} />
              <span className="text-lg">
                Dados do Perfil
              </span>
            </div>

            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition"
            />
          </button>

          <button
            onClick={() => scrollToSection(idiomaRef)}
            className="
              group
              flex
              items-center
              justify-between
              hover:bg-purple-950/40
              transition-all
              duration-300
              px-5
              py-4
              rounded-2xl
            "
          >
            <div className="flex items-center gap-4">
              <Globe size={20} />
              <span className="text-lg">
                Idioma
              </span>
            </div>

            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition"
            />
          </button>

          <button
            onClick={() => scrollToSection(segurancaRef)}
            className="
              group
              flex
              items-center
              justify-between
              hover:bg-purple-950/40
              transition-all
              duration-300
              px-5
              py-4
              rounded-2xl
            "
          >
            <div className="flex items-center gap-4">
              <Lock size={20} />
              <span className="text-lg">
                Segurança
              </span>
            </div>

            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition"
            />
          </button>

          <button
            onClick={() => scrollToSection(notificacoesRef)}
            className="
              group
              flex
              items-center
              justify-between
              hover:bg-purple-950/40
              transition-all
              duration-300
              px-5
              py-4
              rounded-2xl
            "
          >
            <div className="flex items-center gap-4">
              <Bell size={20} />
              <span className="text-lg">
                Notificações
              </span>
            </div>

            <ChevronRight
              size={18}
              className="group-hover:translate-x-1 transition"
            />
          </button>
        </div>
      </aside>

      
      <main className="flex-1 overflow-y-auto px-14 py-10">
        
        <div className="flex items-start justify-between">
          <div className="flex gap-5">
            <div
              className="
                w-16
                h-16
                rounded-2xl
                bg-purple-600/20
                border
                border-purple-500/30
                flex
                items-center
                justify-center
              "
            >
              <Shield
                size={34}
                className="text-purple-400"
              />
            </div>

            <div>
              <h1 className="text-5xl font-extrabold leading-tight">
                Configurações do Sistema
              </h1>

              <p className="text-gray-400 text-lg mt-3">
                Ajuste suas preferências de conta e
                monitoramento.
              </p>
            </div>
          </div>

          <button
            className="
              bg-gradient-to-r
              from-purple-500
              to-purple-700
              hover:scale-105
              transition-all
              duration-300
              px-3
              py-2
              rounded-xl
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              shadow-[0_0_20px_rgba(168,85,247,0.35)]
            "
          >
            Salvar Alterações
          </button>
        </div>

        {/* PERFIL */}
        <section
          ref={perfilRef}
          className="mt-24"
        >
          <div
            className="
              bg-[#0d0217]
              border
              border-purple-900/30
              rounded-3xl
              p-8
            "
          >
            <h2 className="text-3xl font-bold mb-8">
              Dados do Perfil
            </h2>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-gray-400 text-sm">
                  Nome
                </label>

                <input
                  type="text"
                  placeholder="Admin Thermo"
                  className="
                    mt-3
                    w-full
                    bg-[#140520]
                    border
                    border-purple-900/40
                    rounded-2xl
                    px-5
                    py-4
                    outline-none
                    focus:border-purple-500
                  "
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">
                  E-mail
                </label>

                <input
                  type="email"
                  placeholder="admin@thermo.com"
                  className="
                    mt-3
                    w-full
                    bg-[#140520]
                    border
                    border-purple-900/40
                    rounded-2xl
                    px-5
                    py-4
                    outline-none
                    focus:border-purple-500
                  "
                />
              </div>
            </div>
          </div>
        </section>

        
        <section
          ref={idiomaRef}
          className="mt-10"
        >
          <div
            className="
              bg-[#0d0217]
              border
              border-purple-900/30
              rounded-3xl
              p-8
            "
          >
            <div className="flex items-center gap-3 mb-8">
              <Globe
                className="text-purple-400"
                size={28}
              />

              <h2 className="text-3xl font-bold">
                Idioma
              </h2>
            </div>

            <div className="max-w-[420px]">
              <label className="text-gray-400 text-sm">
                Idioma do Sistema
              </label>

              <select
                value={idioma}
                onChange={(e) =>
                  setIdioma(e.target.value)
                }
                className="
                  mt-3
                  w-full
                  bg-[#140520]
                  border
                  border-purple-900/40
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  focus:border-purple-500
                "
              >
                <option
                  value="pt-BR"
                  className="bg-[#140520]"
                >
                  Português (Brasil)
                </option>

                <option
                  value="en-US"
                  className="bg-[#140520]"
                >
                  English
                </option>

                <option
                  value="es"
                  className="bg-[#140520]"
                >
                  Español
                </option>
              </select>
            </div>
          </div>
        </section>

        {/* SEGURANÇA */}
        <section
          ref={segurancaRef}
          className="mt-10"
        >
          <div
            className="
              bg-[#0d0217]
              border
              border-purple-900/30
              rounded-3xl
              p-8
            "
          >
            <div className="flex items-center gap-3 mb-8">
              <Lock
                className="text-purple-400"
                size={28}
              />

              <h2 className="text-3xl font-bold">
                Segurança da Conta
              </h2>
            </div>

            <div className="relative">
              <label className="text-gray-400 text-sm">
                Nova Senha
              </label>

              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) =>
                  setSenha(e.target.value)
                }
                placeholder="••••••••"
                className="
                  mt-3
                  w-full
                  bg-[#140520]
                  border
                  border-purple-900/40
                  rounded-2xl
                  px-5
                  py-4
                  outline-none
                  focus:border-purple-500
                "
              />

              <button
                onClick={() =>
                  setMostrarSenha(!mostrarSenha)
                }
                className="
                  absolute
                  right-5
                  top-[52px]
                  text-gray-400
                  hover:text-purple-400
                "
              >
                <Eye size={20} />
              </button>
            </div>

            <div className="mt-8">
              <button
                className="
                  bg-gradient-to-r
                  from-purple-500
                  to-purple-700
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                  px-6
                  py-3
                  rounded-2xl
                  text-sm
                  font-semibold
                  shadow-[0_0_20px_rgba(168,85,247,0.35)]
                "
              >
                Alterar Senha
              </button>
            </div>
          </div>
        </section>

        {/* NOTIFICAÇÕES */}
        <section
          ref={notificacoesRef}
          className="mt-10 pb-20"
        >
          <div
            className="
              bg-[#0d0217]
              border
              border-purple-900/30
              rounded-3xl
              p-8
            "
          >
            <div className="flex items-center gap-3 mb-8">
              <Bell
                className="text-purple-400"
                size={28}
              />

              <h2 className="text-3xl font-bold">
                Preferências de Notificação
              </h2>
            </div>

            <div className="space-y-5">
              <div
                className="
                  bg-[#140520]
                  border
                  border-purple-900/40
                  rounded-2xl
                  p-6
                  flex
                  items-center
                  justify-between
                "
              >
                <span className="text-lg">
                  Notificar variações críticas
                </span>

                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 accent-purple-500"
                />
              </div>

              <div
                className="
                  bg-[#140520]
                  border
                  border-purple-900/40
                  rounded-2xl
                  p-6
                  flex
                  items-center
                  justify-between
                "
              >
                <span className="text-lg">
                  Alertas de sensor offline
                </span>

                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 accent-purple-500"
                />
              </div>

              <div
                className="
                  bg-[#140520]
                  border
                  border-purple-900/40
                  rounded-2xl
                  p-6
                  flex
                  items-center
                  justify-between
                "
              >
                <span className="text-lg">
                  Relatórios automáticos por e-mail
                </span>

                <input
                  type="checkbox"
                  className="w-5 h-5 accent-purple-500"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}