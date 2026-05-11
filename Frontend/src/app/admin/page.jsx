"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Chatbot from '@/components/Chatbot'
import {
  Users,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Search,
  ShieldCheck,
  X,
  User,
  Fingerprint,
  Mail,
  Lock
} from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("usuarios")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: "Admin Thermo", email: "admin@guard.com", cpf: "123.456.789-00", cargo: "Administrador" },
    { id: 2, nome: "João Silva", email: "joao@empresa.com", cpf: "987.654.321-11", cargo: "Operador" },
  ])

  const [ambientes, setAmbientes] = useState([
    { id: 1, nome: "Almoxarifado Principal", status: "Monitorado" },
    { id: 2, nome: "Laboratório Químico", status: "Monitorado" },
  ])

  const handleDeleteUser = (id) => setUsuarios(usuarios.filter(u => u.id !== id))
  const handleDeleteAmbiente = (id) => setAmbientes(ambientes.filter(a => a.id !== id))

  const filteredUsuarios = usuarios.filter(u =>
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  )
  const filteredAmbientes = ambientes.filter(a =>
    a.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div
      className="min-h-screen text-white flex flex-col items-center px-4 py-8"
      style={{ background: "#080516", fontFamily: "'Inter', sans-serif" }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');

        .tg-glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(124, 58, 237, 0.25);
          border-radius: 16px;
        }
        .tg-glass-header {
          background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(15,15,30,0.8));
          backdrop-filter: blur(12px);
          border: 1px solid rgba(124, 58, 237, 0.25);
          border-radius: 16px;
          position: relative;
          overflow: hidden;
        }
        .tg-glass-header::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #a855f7, transparent);
        }
        .tg-btn {
          background: linear-gradient(135deg, #be50e6 0%, #7c3aed 100%);
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(124,58,237,0.3);
        }
        .tg-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(124,58,237,0.5);
        }
        .tg-tab-active {
          color: #a855f7;
          border-bottom: 2px solid #a855f7;
        }
        .tg-row:hover {
          background: rgba(124,58,237,0.04);
        }
        .tg-logo {
          font-family: 'Orbitron', monospace;
          font-weight: 700;
          background: linear-gradient(135deg, #a855f7, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 1px;
        }
      `}</style>

      <div className="w-full max-w-5xl flex flex-col gap-6">

        {/* ── HEADER ── */}
        <div className="tg-glass-header flex flex-col md:flex-row justify-between items-center gap-4 px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                boxShadow: "0 0 16px rgba(124,58,237,0.4)"
              }}
            >
              🌡️
            </div>
            <div>
              <div className="tg-logo text-lg">TERMOGUARD</div>
              <div className="text-[10px] text-slate-400 tracking-[2px] uppercase">Painel Administrativo</div>
            </div>
          </div>

          {/* Title + desc */}
          <div className="text-center flex-1 hidden md:block">
            <h1 className="text-base font-semibold flex items-center justify-center gap-2 text-slate-200">
              <ShieldCheck size={18} className="text-purple-400" />
              Gestão de Usuários e Ambientes
            </h1>
            <p className="text-xs text-purple-200/40 mt-0.5">Acesso restrito ao administrador</p>
          </div>

          {/* Add button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="tg-btn px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 text-sm"
          >
            <Plus size={18} />
            {activeTab === "usuarios" ? "Novo Usuário" : "Novo Ambiente"}
          </button>
        </div>

        {/* ── STATS ROW ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Usuários", value: usuarios.length, icon: <Users size={18} />, color: "#a855f7" },
            { label: "Administradores", value: usuarios.filter(u => u.cargo === "Administrador").length, icon: <ShieldCheck size={18} />, color: "#7c3aed" },
            { label: "Ambientes", value: ambientes.length, icon: <MapPin size={18} />, color: "#c084fc" },
            { label: "Monitorados", value: ambientes.filter(a => a.status === "Monitorado").length, icon: <Fingerprint size={18} />, color: "#10b981" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="tg-glass p-4 flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${stat.color}22`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[11px] text-slate-400">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── NAV + SEARCH ── */}
        <div className="tg-glass flex flex-col md:flex-row justify-between items-center gap-4 px-5 py-3">
          {/* Tabs */}
          <div className="flex gap-6">
            {[
              { key: "usuarios", label: "Usuários", icon: <Users size={15} /> },
              { key: "ambientes", label: "Ambientes", icon: <MapPin size={15} /> },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-1 font-medium text-sm flex items-center gap-1.5 transition-all ${
                  activeTab === tab.key ? "tg-tab-active" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/50" size={16} />
            <input
              type="text"
              placeholder="Pesquisar registro..."
              className="w-full text-sm rounded-lg py-2 pl-9 pr-4 outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(124,58,237,0.2)",
                color: "#e2e8f0",
              }}
              onFocus={e => e.target.style.borderColor = "rgba(168,85,247,0.5)"}
              onBlur={e => e.target.style.borderColor = "rgba(124,58,237,0.2)"}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* ── TABLE ── */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="tg-glass overflow-x-auto"
        >
          <table className="w-full text-left min-w-[560px]">
            <thead style={{ background: "rgba(124,58,237,0.07)" }}>
              <tr className="text-[11px] uppercase tracking-wider text-purple-300/60">
                {activeTab === "usuarios" ? (
                  <>
                    <th className="px-6 py-4 font-semibold w-16 text-center">Avatar</th>
                    <th className="px-6 py-4 font-semibold">Nome / CPF</th>
                    <th className="px-6 py-4 font-semibold">E-mail</th>
                    <th className="px-6 py-4 font-semibold">Cargo</th>
                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 font-semibold">Ambiente</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody style={{ borderTop: "1px solid rgba(124,58,237,0.1)" }}>
              <AnimatePresence>
                {activeTab === "usuarios"
                  ? filteredUsuarios.map((u, idx) => (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="tg-row transition-colors text-sm"
                        style={{ borderBottom: "1px solid rgba(124,58,237,0.07)" }}
                      >
                        <td className="px-6 py-4">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center mx-auto"
                            style={{
                              background: "rgba(168,85,247,0.15)",
                              border: "1px solid rgba(168,85,247,0.3)",
                              color: "#a855f7"
                            }}
                          >
                            <User size={17} />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-200">{u.nome}</div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Fingerprint size={11} /> {u.cpf}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-400 flex items-center gap-1.5">
                            <Mail size={13} className="text-purple-400/50" />
                            {u.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                            style={
                              u.cargo === "Administrador"
                                ? { background: "rgba(124,58,237,0.15)", color: "#c084fc", border: "1px solid rgba(124,58,237,0.3)" }
                                : { background: "rgba(59,130,246,0.1)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.2)" }
                            }
                          >
                            {u.cargo}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              className="p-2 rounded-lg transition-colors text-blue-400"
                              style={{ background: "transparent" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 rounded-lg transition-colors text-red-400"
                              style={{ background: "transparent" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  : filteredAmbientes.map((amb, idx) => (
                      <motion.tr
                        key={amb.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        className="tg-row transition-colors text-sm"
                        style={{ borderBottom: "1px solid rgba(124,58,237,0.07)" }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                              style={{ background: "rgba(168,85,247,0.12)", color: "#a855f7" }}
                            >
                              <MapPin size={15} />
                            </div>
                            <span className="font-medium text-slate-200">{amb.nome}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
                            style={{
                              background: "rgba(16,185,129,0.1)",
                              color: "#10b981",
                              border: "1px solid rgba(16,185,129,0.2)"
                            }}
                          >
                            ● {amb.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              className="p-2 rounded-lg transition-colors text-blue-400"
                              style={{ background: "transparent" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteAmbiente(amb.id)}
                              className="p-2 rounded-lg transition-colors text-red-400"
                              style={{ background: "transparent" }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
                              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
              </AnimatePresence>

              {/* Empty state */}
              {((activeTab === "usuarios" && filteredUsuarios.length === 0) ||
                (activeTab === "ambientes" && filteredAmbientes.length === 0)) && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </motion.div>

        {/* ── FOOTER ── */}
        <div className="text-center text-[11px] mt-4" style={{ color: "rgba(168,85,247,0.3)", fontFamily: "'Orbitron', monospace", letterSpacing: "1px" }}>
          © 2026 TERMOGUARD — ACESSO RESTRITO AO ADMINISTRADOR
        </div>
      </div>

      <Chatbot />
    </div>
  )
}