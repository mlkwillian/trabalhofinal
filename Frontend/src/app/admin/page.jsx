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
  User, // Importação que estava faltando
  Fingerprint,
  Mail,
  Lock
} from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("usuarios")
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Estados para dados (Iniciando com os mocks das imagens)
  const [usuarios, setUsuarios] = useState([
    { id: 1, nome: "Admin Thermo", email: "admin@guard.com", cpf: "123.456.789-00", cargo: "Administrador" },
    { id: 2, nome: "João Silva", email: "joao@empresa.com", cpf: "987.654.321-11", cargo: "Operador" },
  ])

  const [ambientes, setAmbientes] = useState([
    { id: 1, nome: "Almoxarifado Principal", status: "Monitorado" },
    { id: 2, nome: "Laboratório Químico", status: "Monitorado" },
  ])

  // Funções de Gerenciamento
  const handleDeleteUser = (id) => setUsuarios(usuarios.filter(u => u.id !== id))
  const handleDeleteAmbiente = (id) => setAmbientes(ambientes.filter(a => a.id !== id))

  return (
    
    <div className="p-8 min-h-screen text-white bg-[#080516] flex flex-col items-center">
      <style jsx global>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(190, 80, 230, 0.15);
          border-radius: 16px;
        }
        .btn-purple {
          background: linear-gradient(135deg, #be50e6 0%, #7c3aed 100%);
          transition: all 0.2s;
        }
        .tab-active { color: #be50e6; border-bottom: 2px solid #be50e6; }
      `}</style>

      <div className="w-full max-w-6xl">
        {/* Header Centralizado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-3">
              <ShieldCheck className="text-purple-500" size={32} />
              Painel Administrativo
            </h1>
            <p className="text-purple-200/50 mt-1 text-sm">Gerencie usuários e ambientes do sistema TermoGuard.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-purple px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/20"
          >
            <Plus size={20} />
            {activeTab === "usuarios" ? "Novo Usuário" : "Novo Ambiente"}
          </button>
        </div>

        {/* Barra de Navegação e Busca */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 glass-card p-4 gap-4">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab("usuarios")}
              className={`pb-1 font-medium transition-all ${activeTab === "usuarios" ? "tab-active" : "text-gray-400"}`}
            >
              Usuários
            </button>
            <button 
              onClick={() => setActiveTab("ambientes")}
              className={`pb-1 font-medium transition-all ${activeTab === "ambientes" ? "tab-active" : "text-gray-400"}`}
            >
              Ambientes
            </button>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400/50" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar registro..." 
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-purple-500/50 transition-all"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabela de Dados */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-x-auto"
        >
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-white/5 text-purple-300/70 text-xs uppercase tracking-wider">
              <tr>
                {activeTab === "usuarios" ? (
                  <>
                    <th className="px-6 py-4 font-semibold text-center w-16">Avatar</th>
                    <th className="px-6 py-4 font-semibold">Nome / CPF</th>
                    <th className="px-6 py-4 font-semibold">E-mail</th>
                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 font-semibold">Nome do Ambiente</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {activeTab === "usuarios" ? (
                usuarios.map((u) => (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 mx-auto border border-purple-500/30">
                        <User size={18} />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{u.nome}</div>
                      <div className="text-xs text-gray-500">{u.cpf}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{u.email}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-colors"><Pencil size={18} /></button>
                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                ambientes.map((amb) => (
                  <tr key={amb.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <MapPin size={18} className="text-purple-400" />
                      <span className="font-medium">{amb.nome}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-[11px] font-bold uppercase tracking-wider border border-green-500/20">
                        {amb.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-colors"><Pencil size={18} /></button>
                        <button onClick={() => handleDeleteAmbiente(amb.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </div>

      {/* Rodapé fixo seguindo o padrão TermoGuard */}
      <div className="mt-12 text-purple-400/30 text-xs">
        © 2026 TermoGuard. Acesso restrito ao administrador.
      </div>
      <Chatbot />
    </div>
  )
}