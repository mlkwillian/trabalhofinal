'use client'

import { useState } from 'react'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Olá 👋 Sou o assistente do TermoGuard.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  // 📩 ENVIAR MENSAGEM
  async function handleSend(customInput) {
    const text = customInput || input
    if (!text.trim()) return

    const userMessage = { from: 'user', text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    const botText = await getBotResponse(text)

    const botMessage = { from: 'bot', text: botText }
    setMessages(prev => [...prev, botMessage])

    setLoading(false)
  }

  // ⚡ BOTÕES RÁPIDOS
  function handleQuick(msg) {
    handleSend(msg)
  }

  // 🤖 RESPOSTA DO BOT (INTELIGENTE)
  async function getBotResponse(msg) {
    const text = msg.toLowerCase()

    try {
      const res = await fetch('http://localhost:3000/api/leituras/ultimas')
      const data = await res.json()

      if (!data.length) return 'Nenhuma leitura encontrada 😢'

      // 🔥 FORMATA DADOS
      const leituras = data.map(s => {
        const temp = Number(s.temperatura)
        const min = Number(s.temperatura_min)
        const max = Number(s.temperatura_max)

        const fora = temp < min || temp > max

        return {
          sala: s.sala,
          texto: `🌡️ ${s.sala}: ${temp}°C ${fora ? '🔴 FORA DO PADRÃO' : '🟢 OK'
            }`,
          fora
        }
      })

      // 🌡️ TODAS
      if (text.includes('temp') || text.includes('calor')) {
        return leituras.map(l => l.texto).join('\n')
      }

      // 🚨 PROBLEMAS
      if (text.includes('problema') || text.includes('fora')) {
        const ruins = leituras.filter(l => l.fora)

        if (!ruins.length) return '✅ Nenhuma sala com problema'

        return ruins.map(l => l.texto).join('\n')
      }

      // 🏢 ALMOXARIFADO
      if (text.includes('almoxarifado')) {
        const sala = leituras.find(l =>
          l.sala.toLowerCase().includes('almoxarifado')
        )

        if (!sala) return 'Sala não encontrada 😢'

        return sala.texto
      }

      // 🧪 LAB
      if (text.includes('laboratório') || text.includes('laboratorio')) {
        const sala = leituras.find(l =>
          l.sala.toLowerCase().includes('laboratório')
        )

        if (!sala) return 'Sala não encontrada 😢'

        return sala.texto
      }

      // 🚨 ALERTAS
      if (text.includes('alerta')) {
        const res2 = await fetch('http://localhost:3000/api/alertas')
        const alertas = await res2.json()

        if (!alertas.length) return '✅ Nenhum alerta ativo'

        return alertas
          .map(a => `🚨 ${a.sala} com problema desde ${a.data_inicio}`)
          .join('\n')
      }

      // 🏢 EMPRESA
      if (text.includes('empresa') || text.includes('termoguard')) {
        return '🏢 O TermoGuard monitora ambientes críticos em tempo real usando sensores IoT.'
      }

      return 'Não entendi 😅 Tente perguntar sobre temperatura, problemas ou alertas.'

    } catch (err) {
      console.error(err)
      return 'Erro ao buscar dados 😢'
    }
  }

  return (
    <>
      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
    fixed bottom-6 right-6 z-[9999]
    flex items-center gap-3
    px-5 py-3
    rounded-2xl
    bg-zinc-900/95
    backdrop-blur-xl
    border border-zinc-700
    shadow-2xl
    hover:border-purple-500
    hover:shadow-purple-500/20
    hover:-translate-y-1
    transition-all duration-300
  "
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-500 overflow-hidden">
          <img
            src="https://play-lh.googleusercontent.com/qh6Pnf73m0fLjAYwyokuT73d_LB6sdXkfaCCSGgpIU1EneH15dUgBLV31X-2QkXsNQ"
            alt="Assistente IA"
            className="w-6 h-6 object-contain"
          />
        </div>

        <div className="text-left">
          <p className="text-white text-sm font-semibold">
            Assistente IA
          </p>
          <p className="text-zinc-400 text-xs">
            Como posso ajudar?
          </p>
        </div>
      </button>

      {/* CHAT */}
      {open && (
        <div className="fixed bottom-30 right-6 w-80 h-[430px] z-[9999] bg-black border border-purple-500 rounded-xl flex flex-col shadow-2xl">

          {/* HEADER */}
          <div className="bg-purple-600 text-white p-3 rounded-t-xl font-semibold">
            TermoGuard Chat
          </div>

          {/* BOTÕES RÁPIDOS */}
          <div className="p-2 flex flex-wrap gap-2">
            <button onClick={() => handleQuick('temperatura')} className="bg-gray-800 text-white px-2 py-1 rounded text-xs">🌡️ Temperatura</button>
            <button onClick={() => handleQuick('problema')} className="bg-gray-800 text-white px-2 py-1 rounded text-xs">🚨 Problemas</button>
            <button onClick={() => handleQuick('almoxarifado')} className="bg-gray-800 text-white px-2 py-1 rounded text-xs">🏢 Almoxarifado</button>
            <button onClick={() => handleQuick('alerta')} className="bg-gray-800 text-white px-2 py-1 rounded text-xs">🚨 Alertas</button>
          </div>

          {/* MENSAGENS */}
          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2 whitespace-pre-line">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${msg.from === 'user'
                    ? 'bg-purple-500 ml-auto text-white'
                    : 'bg-gray-800 text-gray-200'
                  }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-xs">Digitando...</div>
            )}
          </div>

          {/* INPUT */}
          <div className="p-2 flex gap-2 border-t border-gray-800">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua pergunta..."
              className="flex-1 p-2 rounded bg-gray-900 text-white outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="bg-purple-600 px-3 rounded text-white hover:bg-purple-700"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
