"use client";

import { useRef, useState, useEffect } from "react";
import {
  Shield,
  Globe,
  Lock,
  Bell,
  User,
  Eye,
  EyeOff,
  ChevronRight,
  Save,
} from "lucide-react";
import { api } from "@/services/api";

export default function ConfiguracoesSistema() {
  // USER
  const [usuario, setUsuario] = useState(null);

  // STATES
  const [idioma, setIdioma] = useState("pt-BR");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  // REFS
  const perfilRef = useRef(null);
  const idiomaRef = useRef(null);
  const segurancaRef = useRef(null);
  const notificacoesRef = useRef(null);

  // PEGAR USUARIO
  useEffect(() => {
    const usuarioStorage = localStorage.getItem("usuario");

    if (usuarioStorage) {
      const dados = JSON.parse(usuarioStorage);

      setUsuario(dados);

      setNome(dados.nome || "");
      setEmail(dados.email || "");
    }
  }, []);

  // SCROLL
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const salvarAlteracoes = async () => {
    try {
  
      setSalvando(true);
      setMensagem("");
  
      const token = localStorage.getItem("token");
  
      const usuarioStorage =
        localStorage.getItem("usuario");
  
      if (!usuarioStorage) {
        setMensagem("Usuário não encontrado");
        return;
      }
  
      const usuarioAtual =
        JSON.parse(usuarioStorage);
  
        const response = await fetch(
          `http://localhost:3000/api/usuarios/${usuarioAtual.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              nome,
              email,
              senha: senha || null,
              tipo_usuario: usuarioAtual.tipo,
            }),
          }
        );
  
      const data = await response.json();
  
      console.log(data);
  
      const usuarioAtualizado = {
        ...usuarioAtual,
        nome,
        email,
      };
  
      localStorage.setItem(
        "usuario",
        JSON.stringify(usuarioAtualizado)
      );
      setUsuario(usuarioAtualizado);
      window.location.reload();
      setUsuario(usuarioAtualizado);
  
      setMensagem(
        "Alterações salvas com sucesso!"
      );
  
      setSenha("");
  
    } catch (err) {
  
      console.error(err);
  
      setMensagem(
        "Erro ao salvar alterações"
      );
  
    } finally {
  
      setSalvando(false);
  
    }
  };

  return (
    <div className="min-h-screen bg-[#05010b] text-white flex overflow-hidden">
      {/* SIDEBAR */}
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
        {/* PERFIL */}
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
            {nome?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <h2 className="mt-6 text-4xl font-bold text-center">
            {nome || "Usuário"}
          </h2>

          <p className="text-purple-300 mt-2 text-sm">
            {usuario?.tipo || "comum"}
          </p>

          <div className="w-full border-t border-purple-900/30 mt-10 pt-8">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">
                Último acesso
              </span>

              <span className="font-semibold">
                Hoje
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

        {/* MENU */}
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

      {/* CONTEÚDO */}
      <main className="flex-1 overflow-y-auto px-14 py-10">
        {/* HEADER */}
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
                Ajuste suas preferências da conta.
              </p>
            </div>
          </div>

          <button
            onClick={salvarAlteracoes}
            disabled={salvando}
            className="
              bg-gradient-to-r
              from-purple-500
              to-purple-700
              hover:scale-105
              transition-all
              duration-300
              px-5
              py-3
              rounded-xl
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              shadow-[0_0_20px_rgba(168,85,247,0.35)]
            "
          >
            <Save size={16} />

            {salvando
              ? "Salvando..."
              : "Salvar Alterações"}
          </button>
        </div>

        {mensagem && (
          <div
            className="
              mt-6
              bg-purple-500/10
              border
              border-purple-500/30
              text-purple-300
              px-5
              py-4
              rounded-2xl
            "
          >
            {mensagem}
          </div>
        )}

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
                  value={nome}
                  onChange={(e) =>
                    setNome(e.target.value)
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
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm">
                  E-mail
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
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
                />
              </div>
            </div>
          </div>
        </section>

        {/* IDIOMA */}
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
                <option value="pt-BR">
                  Português (Brasil)
                </option>

                <option value="en-US">
                  English
                </option>

                <option value="es">
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
                type={
                  mostrarSenha
                    ? "text"
                    : "password"
                }
                value={senha}
                onChange={(e) =>
                  setSenha(e.target.value)
                }
                placeholder="Digite uma nova senha"
                className="
                  mt-3
                  w-full
                  bg-[#140520]
                  border
                  border-purple-900/40
                  rounded-2xl
                  px-5
                  py-4
                  pr-14
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
                {mostrarSenha ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
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