"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Chatbot from "@/components/Chatbot"
import {
  ShieldCheck,
  Plus,
  Search,
  Pencil,
  Trash2,
  User,
  X
} from "lucide-react"

export default function AdminPage() {
  const [usuarios, setUsuarios] = useState([])
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo_usuario: "gestor"
  })

  async function carregarUsuarios() {
    const token = localStorage.getItem("token")

    const res = await fetch("http://localhost:3000/api/usuarios", {
      headers: { Authorization: `Bearer ${token}` }
    })

    const data = await res.json()
    setUsuarios(data)
  }

  useEffect(() => {
    carregarUsuarios()
  }, [])

  function abrirModal(usuario = null) {
    if (usuario) {
      setEditando(usuario)
      setForm(usuario)
    } else {
      setEditando(null)
      setForm({ nome: "", email: "", senha: "", tipo_usuario: "gestor" })
    }
    setModalOpen(true)
  }

  async function salvar() {
    const token = localStorage.getItem("token")

    if (editando) {
      await fetch(`http://localhost:3000/api/usuarios/${editando.id_usuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })
    } else {
      await fetch("http://localhost:3000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
    }

    setModalOpen(false)
    carregarUsuarios()
  }

  async function deletar(id) {
    const token = localStorage.getItem("token")

    await fetch(`http://localhost:3000/api/usuarios/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })

    carregarUsuarios()
  }

  const filtrados = usuarios.filter(u =>
    u.nome.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className="p-8 min-h-screen flex flex-col items-center"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="w-full max-w-6xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ShieldCheck style={{ color: "var(--purple)" }} />
              Painel Administrativo
            </h1>
            <p style={{ color: "var(--text-sub)" }}>
              Gerencie usuários do sistema
            </p>
          </div>

          <button
            onClick={() => abrirModal()}
            className="px-5 py-2 rounded-xl flex items-center gap-2 text-white font-medium"
            style={{
              background: "linear-gradient(135deg, var(--purple), var(--purple-l))",
              boxShadow: "var(--shadow)"
            }}
          >
            <Plus size={18} />
            Novo Usuário
          </button>
        </div>

        {/* SEARCH */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-6"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border-soft)"
          }}
        >
          <Search size={18} style={{ color: "var(--muted)" }} />
          <input
            placeholder="Buscar usuário..."
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none bg-transparent"
          />
        </div>

        {/* TABELA */}
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--card)",
            border: "1px solid var(--border-soft)"
          }}
        >
          <table className="w-full">

            <thead style={{ background: "var(--surface)" }}>
              <tr style={{ color: "var(--text-sub)" }}>
                <th className="p-4 text-left">Usuário</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Tipo</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map(u => (
                <tr
                  key={u.id_usuario}
                  style={{ borderTop: "1px solid var(--border-soft)" }}
                >
                  <td className="p-4 flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: "var(--purple-dim)" }}
                    >
                      <User size={16} />
                    </div>
                    {u.nome}
                  </td>

                  <td className="p-4">{u.email}</td>

                  <td className="p-4">
                    <span
                      className="px-2 py-1 rounded-full text-xs"
                      style={{
                        background: "var(--accent-soft)",
                        color: "var(--green)"
                      }}
                    >
                      {u.tipo_usuario}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => abrirModal(u)}
                      className="mr-2"
                      style={{ color: "var(--blue)" }}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => deletar(u.id_usuario)}
                      style={{ color: "var(--red)" }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filtrados.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-6">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* MODAL BONITO */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setModalOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative p-6 rounded-xl w-full max-w-md"
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)"
              }}
            >
              <div className="flex justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {editando ? "Editar" : "Novo"} Usuário
                </h2>
                <X onClick={() => setModalOpen(false)} className="cursor-pointer" />
              </div>

              <input
                placeholder="Nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full mb-2 p-2 rounded"
                style={{ background: "var(--surface)" }}
              />

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mb-2 p-2 rounded"
                style={{ background: "var(--surface)" }}
              />

              {!editando && (
                <input
                  type="password"
                  placeholder="Senha"
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                  className="w-full mb-2 p-2 rounded"
                  style={{ background: "var(--surface)" }}
                />
              )}

              <select
                value={form.tipo_usuario}
                onChange={(e) => setForm({ ...form, tipo_usuario: e.target.value })}
                className="w-full mb-4 p-2 rounded"
                style={{ background: "var(--surface)" }}
              >
                <option value="admin">Admin</option>
                <option value="operador">Operador</option>
                <option value="gestor">Gestor</option>
                <option value="manutencao">Manutenção</option>
                <option value="qualidade">Qualidade</option>
              </select>

              <button
                onClick={salvar}
                className="w-full p-2 rounded text-white font-medium"
                style={{
                  background: "linear-gradient(135deg, var(--purple), var(--purple-l))"
                }}
              >
                Salvar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Chatbot />
    </div>
  )
}