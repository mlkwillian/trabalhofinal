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

    if (text.includes('empresa') || text.includes('termoguard')) {
      return '🏢 O TermoGuard é uma plataforma de monitoramento ambiental com sensores IoT.'
    }

    if (text.includes('plano') || text.includes('preço') || text.includes('preco')) {
      return `💰 Planos:

🟢 Básico
🟣 Profissional
🔴 Empresarial`
    }

    if (text.includes('funciona') || text.includes('como')) {
      return '⚙️ Sensores enviam dados em tempo real para o sistema.'
    }

    if (text.includes('app')) {
      return '📱 Você recebe alertas direto no celular.'
    }

    return 'Posso te ajudar com planos ou funcionamento 😊'
  }

  return (
    <>
      {/* BOTÃO */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-[999999] bg-purple-600 text-white p-4 rounded-full shadow-lg"
        style={{ pointerEvents: 'auto' }}
      >
        💬
      </button>

      {/* CHAT */}
      {open && (
        <div
          className="fixed inset-0 z-[999998] pointer-events-none"
        >
          {/* CONTAINER DO CHAT */}
          <div
            className="absolute bottom-20 right-6 w-80 h-[420px] bg-black border border-purple-500 rounded-xl flex flex-col shadow-2xl"
            style={{ pointerEvents: 'auto', zIndex: 999999 }}
          >

            {/* HEADER */}
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
        </div>
      )}
    </>
  )
}
