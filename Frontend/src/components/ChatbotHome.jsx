'use client'

import { useState, useRef, useEffect } from 'react'

export default function ChatbotHome() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [accordionOpen, setAccordionOpen] = useState(null)

  const [messages, setMessages] = useState([
    {
      from: 'bot',
      type: 'text',
      text: 'Olá 👋 Sou o assistente da TermoGuard.\nPosso te ajudar com dúvidas, planos ou funcionamento.'
    },
    {
      from: 'bot',
      type: 'faq'
    }
  ])

  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  function handleSend(custom) {
    const text = custom || input
    if (!text.trim()) return

    setMessages(prev => [...prev, { from: 'user', type: 'text', text }])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          from: 'bot',
          type: 'text',
          text: getBotResponse(text)
        }
      ])
      setTyping(false)
    }, 900)
  }

  function getBotResponse(msg) {
    const text = msg.toLowerCase()

    if (
      text.includes('empresa') ||
      text.includes('termoguard') ||
      text.includes('o que é') ||
      text.includes('como funciona')
    ) {
      return `A TermoGuard é uma solução completa de monitoramento ambiental em tempo real 🌡️

Utilizamos sensores IoT para coletar dados continuamente e enviar tudo para uma plataforma online.

Com isso você consegue:
• Acompanhar em tempo real  
• Receber alertas automáticos  
• Evitar perdas de produtos sensíveis  

Ideal para laboratórios, indústrias e estoques.`
    }

    if (
      text.includes('plano') ||
      text.includes('preço') ||
      text.includes('valor') ||
      text.includes('quanto custa')
    ) {
      return `Temos planos flexíveis 💼

Eles variam conforme:
• Quantidade de sensores  
• Tipo de operação  
• Recursos necessários  

Assim você paga só pelo que realmente usa.

Se quiser, te ajudo a escolher 😉`
    }

    if (
      text.includes('segurança') ||
      text.includes('dados') ||
      text.includes('proteção')
    ) {
      return `Levamos segurança muito a sério 🔒

• Dados criptografados  
• Armazenamento em nuvem segura  
• Proteção contra acessos não autorizados  

Tudo com rastreabilidade completa para auditorias.`
    }

    if (
      text.includes('alerta') ||
      text.includes('notificação')
    ) {
      return `O sistema envia alertas em tempo real 🚨

Se algo sair do padrão, você é avisado na hora.

Isso permite agir rápido e evitar prejuízos.`
    }

    if (
      text.includes('acesso') ||
      text.includes('celular') ||
      text.includes('remoto')
    ) {
      return `Você pode acessar de qualquer lugar 🌍

Funciona em:
• Celular  
• Computador  
• Tablet  

Tudo online e em tempo real.`
    }

    if (
      text.includes('instalar') ||
      text.includes('instalação')
    ) {
      return `A instalação é simples ⚙️

Sensores plug & play:
• Sem complicação  
• Configuração rápida  
• Pronto para uso em pouco tempo`
    }

    if (
      text.includes('diferencial') ||
      text.includes('vantagem')
    ) {
      return `O diferencial é a inteligência 🧠

• Alertas em tempo real  
• Histórico completo  
• Prevenção de problemas  

Mais controle e menos risco para sua operação.`
    }

    return `Posso te ajudar com:

• Como funciona o sistema  
• Planos e valores  
• Segurança  
• Alertas  

O que você quer saber? 😉`
  }

  function toggleAccordion(i) {
    setAccordionOpen(prev => (prev === i ? null : i))
  }

  const faqs = [
    {
      q: '🔒 O sistema é seguro?',
      a: 'Sim. Utilizamos criptografia e armazenamento seguro na nuvem.'
    },
    {
      q: '⚙️ Precisa instalar algo?',
      a: 'Não. Sensores plug & play e plataforma 100% online.'
    },
    {
      q: '📊 Posso acessar remotamente?',
      a: 'Sim, de qualquer lugar em tempo real.'
    },
    {
      q: '🚨 Como funcionam os alertas?',
      a: 'Você recebe alertas automáticos sempre que algo sai do padrão.'
    },
    {
      q: '🧠 Qual o diferencial?',
      a: 'Monitoramento inteligente com prevenção de problemas.'
    }
  ]

  return (
    <>
      {/* BOTÃO */}
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
        <div className="fixed bottom-24 right-6 z-50 w-[360px] h-[520px] 
        bg-[#0A0A0F] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#1F1F2E]">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white p-4">
            <p className="font-semibold text-lg">TermoGuard</p>
            <p className="text-xs opacity-80">● Online agora</p>
          </div>

          {/* MENSAGENS */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#050507] text-white">

            {messages.map((msg, i) => (
              <div key={i}>

                {msg.type === 'text' && (
                  <div className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm max-w-[75%] whitespace-pre-line ${msg.from === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white'
                          : 'bg-[#11111A] border border-[#1F1F2E] text-gray-200'
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                )}

                {msg.type === 'faq' && (
                  <div className="space-y-2 mt-2">
                    {faqs.map((item, index) => (
                      <div
                        key={index}
                        className="bg-[#11111A] border border-[#1F1F2E] rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleAccordion(index)}
                          className="w-full text-left px-4 py-3 text-sm font-medium flex justify-between items-center hover:bg-[#1A1A26]"
                        >
                          {item.q}
                          <span className="text-purple-400">
                            {accordionOpen === index ? '−' : '+'}
                          </span>
                        </button>

                        <div
                          className={`px-4 text-sm text-gray-400 transition-all duration-300 ${accordionOpen === index ? 'max-h-40 py-2' : 'max-h-0 overflow-hidden'
                            }`}
                        >
                          {item.a}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}

            {typing && (
              <div className="text-xs text-gray-500">digitando...</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 border-t border-[#1F1F2E] flex gap-2 bg-[#0A0A0F]">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-2 rounded-full 
              bg-[#11111A] border border-[#1F1F2E] text-white text-sm 
              outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => handleSend()}
              className="bg-gradient-to-r from-purple-600 to-fuchsia-500 
              hover:opacity-90 text-white px-5 rounded-full text-sm"
            >
              Enviar
            </button>
          </div>

        </div>
      )}
    </>
  )
}