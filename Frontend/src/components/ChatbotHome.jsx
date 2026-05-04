'use client'

import { useState } from 'react'

export default function ChatbotHome() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Olá 👋 Quer saber mais sobre o TermoGuard?' }
  ])
  const [input, setInput] = useState('')

  function handleSend(customInput) {
    const text = customInput || input
    if (!text.trim()) return

    const userMessage = { from: 'user', text }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    const botText = getBotResponse(text)

    const botMessage = { from: 'bot', text: botText }
    setMessages(prev => [...prev, botMessage])
  }

  function handleQuick(msg) {
    handleSend(msg)
  }

  function getBotResponse(msg) {
    const text = msg.toLowerCase()

    // 🏢 EMPRESA
    if (text.includes('empresa') || text.includes('termoguard')) {
      return '🏢 O TermoGuard é uma plataforma de monitoramento ambiental que acompanha temperatura e umidade em tempo real usando sensores IoT.'
    }

    // 💰 PLANOS
    if (text.includes('plano') || text.includes('preço') || text.includes('preco')) {
      return `
💰 Planos do TermoGuard:

🟢 Básico
- Monitoramento em tempo real
- 1 ambiente
- Histórico simples

🟣 Profissional
- Múltiplas salas
- Alertas automáticos
- Dashboard completo

🔴 Empresarial
- Monitoramento 24/7
- Relatórios de auditoria
- Suporte prioritário
      `
    }

    // ⚙️ COMO FUNCIONA
    if (text.includes('funciona') || text.includes('como')) {
      return '⚙️ Sensores instalados nos ambientes enviam dados continuamente para a plataforma, que analisa e alerta em caso de problemas.'
    }

    // 📱 APP
    if (text.includes('app') || text.includes('celular')) {
      return '📱 Você recebe alertas direto no celular e pode registrar ocorrências em tempo real.'
    }

    return 'Posso te ajudar com planos, funcionamento ou sobre a empresa 😊'
  }

  return (
    <>
      {/* BOTÃO */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-[9999] bg-purple-600 text-white p-4 rounded-full shadow-lg"
      >
        💬
      </button>

      {/* CHAT */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-[420px] bg-black border border-purple-500 rounded-xl flex flex-col shadow-2xl">

          <div className="bg-purple-600 text-white p-3 rounded-t-xl font-semibold">
            TermoGuard
          </div>

          {/* BOTÕES */}
          <div className="p-2 flex flex-wrap gap-2">
            <button onClick={() => handleQuick('empresa')} className="bg-gray-800 text-white px-2 py-1 rounded text-xs">🏢 Empresa</button>
            <button onClick={() => handleQuick('planos')} className="bg-gray-800 text-white px-2 py-1 rounded text-xs">💰 Planos</button>
            <button onClick={() => handleQuick('como funciona')} className="bg-gray-800 text-white px-2 py-1 rounded text-xs">⚙️ Como funciona</button>
          </div>

          {/* MENSAGENS */}
          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2 whitespace-pre-line">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.from === 'user'
                    ? 'bg-purple-500 ml-auto text-white'
                    : 'bg-gray-800 text-gray-200'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="p-2 flex gap-2 border-t border-gray-800">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pergunte algo..."
              className="flex-1 p-2 rounded bg-gray-900 text-white outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="bg-purple-600 px-3 rounded text-white"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
