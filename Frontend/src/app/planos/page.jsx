"use client";
import Navbar from "@/components/Navbar";
import { useState, useRef, useEffect } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const plans = [
  {
    name: "Starter",
    price: "R$ 38,99",
    originalPrice: "R$ 54,99",
    discount: "29%",
    credits: "Monitoramento de até 3 sensores/mês",
    highlight: false,
    badge: null,
    domain: "Instalação remota não inclusa",
    emailBoxes: "1 conta de acesso ao painel ThermoGuard por unidade durante 1 ano",
    annualNote:
      "12 meses por apenas R$ 467,88 (preço normal R$ 659,88). Renovação por R$ 38,99/mês.",
    baseFeatures: null,
    features: [
      "Monitora 1 ambiente",
      "Alertas de temperatura e umidade em tempo real",
      "Histórico de registros e relatórios mensais",
      "Conformidade com normas ANVISA e INMETRO",
      "Análise inteligente de dados com IA",
      "Configuração simples pelo painel ThermoGuard",
      "Suporte básico",
    ],
  },{
    name: "Profissional",
    price: "R$ 76,99",
    originalPrice: "R$ 109,99",
    discount: "30%",
    credits: "Monitoramento de até 15 sensores/mês",
    highlight: true,
    badge: "MAIS POPULAR",
    domain: "Instalação remota inclusa",
    emailBoxes: "2 contas de acesso ao painel ThermoGuard por unidade durante 1 ano",
    annualNote:
      "12 meses por apenas R$ 923,88 (preço normal R$ 1.319,88). Renovação por R$ 76,99/mês.",
    baseFeatures: "Tudo no Starter, e mais:",
    features: [
      "Monitora até 5 ambientes",
      "Suporte prioritário 24h",
      "Gerencie assinaturas e contratos de clientes",
      "Chatbot com IA para análise e recomendações térmicas",
      "Relatórios automáticos para auditorias",
      "Acompanhe métricas e dashboards em tempo real",
      "Alertas por voz e imagem via aplicativo",
      "Assistente ThermoGuard para suporte e orientação",
      "Edite configurações de limites sem acionar a IA",
      "Recarregue créditos de monitoramento a qualquer momento",
      "Colabore com sua equipe técnica nos projetos",
    ],
  },
  {
    name: "Empresarial",
    price: "R$ 219,99",
    originalPrice: "R$ 274,99",
    discount: "25%",
    credits: "Monitoramento de até 50 sensores/mês",
    highlight: false,
    badge: null,
    domain: "Instalação remota inclusa",
    emailBoxes: "5 contas de acesso ao painel ThermoGuard por unidade durante 1 ano",
    annualNote:
      "12 meses por apenas R$ 2.639,88 (preço normal R$ 3.299,88). Renovação por R$ 219,99/mês.",
    baseFeatures: "Tudo no Profissional, e mais:",
    features: [
      "Monitora até 20 ambientes",
      "Acesso à API ThermoGuard para integrações",
      "Duplique configurações de ambientes como modelos reutilizáveis",
    ],
  },
  {
    name: "Enterprise",
    price: "R$ 438,99",
    originalPrice: "R$ 549,99",
    discount: "20%",
    credits: "Monitoramento ilimitado de sensores",
    highlight: false,
    badge: null,
    domain: "Instalação remota e suporte on-site incluso",
    emailBoxes: "5 contas de acesso ao painel ThermoGuard por unidade durante 1 ano",
    annualNote:
      "12 meses por apenas R$ 5.267,88 (preço normal R$ 6.599,88). Renovação por R$ 438,99/mês.",
    baseFeatures: "Tudo no Empresarial, e mais:",
    features: ["Acesso antecipado a novos recursos e sensores ThermoGuard"],
  },
];

const testimonialsRow1 = [
  {
    name: "Fernanda Oliveira",
    handle: "@fernanda_ops",
    role: "Gestora de Qualidade",
    text: "A ThermoGuard mudou completamente nossa rotina de auditorias. Os relatórios automáticos economizam horas de trabalho toda semana.",
    avatar: "FO",
    hasX: false,
  },
  {
    name: "Carlos Mendes",
    handle: "@carlosmendes_ind",
    role: null,
    text: "Fiquei impressionado com a facilidade de configurar os alertas de temperatura. Em menos de uma hora tínhamos todos os ambientes monitorados e a equipe notificada em tempo real.",
    avatar: "CM",
    hasX: true,
  },
  {
    name: "Patrícia Souza",
    handle: "@patriciasouza",
    role: "Farmacêutica Responsável",
    text: "Com a ThermoGuard, finalmente tenho a segurança de que os medicamentos estão armazenados dentro dos parâmetros exigidos pela ANVISA — sem precisar checar manualmente.",
    avatar: "PS",
    hasX: false,
  },
  {
    name: "logística_real",
    handle: "@log_real_br",
    role: null,
    text: "Estou adorando a evolução da @ThermoGuard! A nova atualização de alertas inteligentes fez diferença enorme no nosso armazém frigorífico. Recomendo para qualquer operação que leve temperatura a sério.",
    avatar: "LR",
    hasX: true,
  },
  {
    name: "Rafael Teixeira",
    handle: "@rafateixeira_ti",
    role: null,
    text: "A integração via API da ThermoGuard com nosso ERP reduziu em 40% o tempo gasto em registros manuais de temperatura. Simples, rápido e confiável.",
    avatar: "RT",
    hasX: true,
  },
];

const testimonialsRow2 = [
  {
    name: "Andressa Lima",
    handle: "@andressa_lab",
    role: null,
    text: "Testei a ThermoGuard no nosso laboratório e superou as expectativas. Em minutos configuramos os limites críticos e já recebemos o primeiro alerta antes que qualquer dano ocorresse.",
    avatar: "AL",
    hasX: true,
  },
  {
    name: "Bruno Castilho",
    handle: "@brunocastilho",
    role: null,
    text: "É como ter um técnico especializado monitorando seus ambientes 24 horas por dia, sem custo de hora extra.",
    avatar: "BC",
    hasX: true,
  },
  {
    name: "Mariana Rocha",
    handle: "@marianarocha",
    role: "Diretora de Operações",
    text: "A ThermoGuard vai muito além de um simples termômetro conectado — é uma plataforma completa de gestão de ambientes críticos.",
    avatar: "MR",
    hasX: false,
  },
  {
    name: "TechFood BR",
    handle: "@techfoodbr",
    role: null,
    text: "Fico impressionado como a ThermoGuard consegue entregar conformidade com normas tão rigorosas de forma tão intuitiva. Nossa equipe adotou sem nenhum treinamento especial.",
    avatar: "TF",
    hasX: true,
  },
  {
    name: "Juliana Neves",
    handle: "@juliana_neves",
    role: null,
    text: "Tinha um projeto de modernização da nossa câmara fria na lista há anos. Com a ThermoGuard, em dois dias estava tudo configurado, monitorando e gerando relatórios. Não acreditei como foi simples!",
    avatar: "JN",
    hasX: true,
  },
];

const faqs = [
  {
    question: "Quais são as diferenças entre os planos da ThermoGuard?",
    answer:
      "Cada plano oferece uma quantidade diferente de sensores monitorados por mês, número de ambientes cobertos, recursos como acesso à API, suporte prioritário e instalação remota. O Starter é ideal para pequenas operações, enquanto o Enterprise atende empresas com grande volume de ambientes e exigências de conformidade.",
  },
  {
    question: "Como funciona o monitoramento de sensores?",
    answer:
      "Os sensores registram continuamente temperatura e umidade dos ambientes configurados. Os dados são enviados em tempo real ao painel ThermoGuard, onde você pode visualizar leituras, histórico e receber alertas automáticos sempre que os limites definidos forem ultrapassados.",
  },
  {
    question: "Posso ver o histórico de leituras dos meus ambientes?",
    answer:
      "Sim! No painel ThermoGuard você tem acesso em tempo real e histórico completo de todas as leituras dos seus sensores, podendo exportar relatórios para auditorias e conformidade com normas como ANVISA e INMETRO.",
  },
  {
    question:
      "Posso adicionar mais sensores sem fazer upgrade para um plano superior?",
    answer:
      "Sim, é possível adquirir pacotes de sensores adicionais sem precisar mudar de plano. Essa opção é ideal para empresas que precisam expandir o monitoramento pontualmente.",
  },
  {
    question: "Preciso de hardware específico para usar a ThermoGuard?",
    answer:
      "A ThermoGuard é compatível com os sensores homologados pela plataforma. Para novos clientes, oferecemos orientação completa na escolha e configuração dos equipamentos, e os planos Profissional em diante incluem instalação remota.",
  },
  {
    question: "Que tipos de ambientes posso monitorar com a ThermoGuard?",
    answer:
      "Você pode monitorar câmaras frias, estoque de medicamentos, laboratórios, salas de servidores, indústrias alimentícias, hospitais e qualquer ambiente que exija controle preciso de temperatura e umidade.",
  },
  {
    question: "Consigo acessar o painel ThermoGuard pelo celular?",
    answer:
      "Sim! O painel ThermoGuard é totalmente responsivo e pode ser acessado pelo navegador em qualquer dispositivo móvel, permitindo acompanhar os ambientes e receber alertas de onde você estiver.",
  },
  {
    question: "Os dados coletados pelos sensores são de minha propriedade?",
    answer:
      "Sim, todos os dados gerados pelos seus sensores são de sua propriedade. Você pode exportá-los, integrá-los a outros sistemas e utilizá-los como quiser, inclusive para relatórios de conformidade.",
  },
  {
    question:
      "É possível integrar a ThermoGuard com outros sistemas da minha empresa?",
    answer:
      "Sim! Os planos Empresarial e Enterprise oferecem acesso à API ThermoGuard, permitindo integração com ERPs, sistemas de qualidade, ferramentas de BI e outros serviços externos utilizados pela sua operação.",
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0, marginTop: 2 }}
    >
      <circle cx="8" cy="8" r="8" fill="#7c3aed" opacity="0.15" />
      <path
        d="M4.5 8.5l2.5 2.5 4-5"
        stroke="#a78bfa"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlanCard({ plan }) {
  const [hovered, setHovered] = useState(false);

  return (
    
    <div
    
      style={{

        background: plan.highlight
          ? "linear-gradient(180deg, #1a0a3a 0%, #0f0520 100%)"
          : "rgba(255,255,255,0.03)",
        border: plan.highlight
          ? "1px solid #7c3aed"
          : "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered
          ? plan.highlight
            ? "0 20px 60px rgba(124,58,237,0.3)"
            : "0 20px 60px rgba(0,0,0,0.4)"
          : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {plan.badge && (
        <div
          style={{
            position: "absolute",
            top: -12,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#7c3aed",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            padding: "4px 14px",
            borderRadius: 20,
            whiteSpace: "nowrap",
          }}
        >
          {plan.badge}
        </div>
      )}

      {!plan.badge && (
        <div
          style={{
            fontSize: 11,
            color: "#a78bfa",
            fontWeight: 600,
            letterSpacing: "0.05em",
            marginBottom: 8,
          }}
        >
          {plan.discount} de desconto
        </div>
      )}
      {plan.badge && <div style={{ height: 12 }} />}

      <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 6 }}>
        {plan.name}
      </div>

      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.35)",
          textDecoration: "line-through",
          marginBottom: 2,
        }}
      >
        {plan.originalPrice}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: "#fff" }}>{plan.price}</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>/mês</span>
      </div>

      <div
        style={{
          fontSize: 12,
          color: "#a78bfa",
          fontWeight: 600,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#7c3aed",
            display: "inline-block",
          }}
        />
        {plan.credits}
      </div>

      <button
        style={{
          width: "100%",
          padding: "11px 0",
          borderRadius: 8,
          border: plan.highlight ? "none" : "1px solid rgba(255,255,255,0.2)",
          background: plan.highlight ? "#7c3aed" : "transparent",
          color: "#fff",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 14,
        }}
      >
        Selecione o plano
      </button>

      <p
        style={{
          fontSize: 10,
          color: "rgba(255,255,255,0.3)",
          margin: "0 0 16px",
          lineHeight: 1.5,
        }}
      >
        {plan.annualNote}
      </p>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
          {plan.domain}
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
          {plan.emailBoxes}
        </div>

        {plan.baseFeatures && (
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "rgba(255,255,255,0.7)",
              marginBottom: 4,
            }}
          >
            {plan.baseFeatures}
          </div>
        )}

        {plan.features.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <CheckIcon />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              {f}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ t }) {
  const colors = ["#7c3aed", "#0e7490", "#b45309", "#be185d", "#047857"];
  const idx = t.name.charCodeAt(0) % colors.length;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 14,
        padding: "20px 22px",
        width: 300,
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: colors[idx],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {t.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {t.hasX && (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="rgba(255,255,255,0.6)"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            )}
            <span
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {t.name}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            {t.role || t.handle}
          </div>
        </div>
      </div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>
        {t.text}
      </p>
    </div>
  );
}

function InfiniteRow({ testimonials, reverse }) {
  const trackRef = useRef(null);
  const pausedRef = useRef(false);
  const posRef = useRef(0);
  const rafRef = useRef(null);
  const speed = 0.4;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const children = Array.from(track.children);
    const totalWidth = children
      .slice(0, testimonials.length)
      .reduce((acc, el) => acc + el.offsetWidth + 16, 0);

    posRef.current = reverse ? -totalWidth : 0;

    function animate() {
      if (!pausedRef.current) {
        posRef.current += reverse ? speed : -speed;
        if (!reverse && posRef.current <= -totalWidth) posRef.current = 0;
        if (reverse && posRef.current >= 0) posRef.current = -totalWidth;
        if (track) track.style.transform = `translateX(${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reverse, testimonials.length]);

  const doubled = [...testimonials, ...testimonials];

  return (
    <div
      style={{ overflow: "hidden", width: "100%" }}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: 16,
          width: "max-content",
          willChange: "transform",
        }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

function FAQItem({ item }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 15, color: "#fff", fontWeight: 400, lineHeight: 1.5 }}>
          {item.question}
        </span>
        <span
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.6)",
            fontSize: 18,
            transition: "transform 0.2s",
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>
      {open && (
        <div
          style={{
            paddingBottom: 20,
            fontSize: 14,
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.7,
          }}
        >
          {item.answer}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function PlansPage() {
  return (
    <main
      style={{
        background: "#0a0010",
        minHeight: "100vh",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: "#fff",
      }}
    >
      {/* ── SECTION 1: Plans ── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div
              style={{
                display: "inline-flex",
                gap: 32,
                fontSize: 13,
                color: "rgba(255,255,255,0.5)",
                marginBottom: 24,
              }}
            >
              <span>○ 30 dias para pedir reembolso*</span>
              <span>○ Cancele a qualquer momento</span>
            </div>
            <h1
              style={{
                fontSize: "clamp(28px, 5vw, 48px)",
                fontWeight: 800,
                lineHeight: 1.15,
                margin: "0 0 8px",
                color: "#fff",
              }}
            >
              Desbloqueie a experiência completa
              <br />
              da ThermoGuard
            </h1>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
              marginTop: 48,
              alignItems: "start",
            }}
          >
            {plans.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              marginTop: 32,
            }}
          >
            O preço exibido é o valor mensal sem os impostos.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 12,
              fontSize: 12,
              color: "rgba(255,255,255,0.4)",
              flexWrap: "wrap",
            }}
          >
            O pagamento pode ser parcelado em até 12x
            <span style={{ display: "flex", gap: 6 }}>
              {["VISA", "MC", "PIX", "AMEX"].map((c) => (
                <span
                  key={c}
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 4,
                    padding: "2px 6px",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {c}
                </span>
              ))}
            </span>
          </div>

          <p
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "rgba(255,255,255,0.25)",
              marginTop: 12,
            }}
          >
            *Nossa garantia de reembolso de 30 dias se aplica a contas com menos de 30
            créditos utilizados.
          </p>
        </div>
      </section>

      {/* ── SECTION 2: Testimonials ── */}
      <section style={{ padding: "80px 0", overflow: "hidden" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: "clamp(24px, 4vw, 40px)",
            fontWeight: 700,
            marginBottom: 56,
            padding: "0 24px",
            lineHeight: 1.3,
            color: "#fff",
          }}
        >
          O que os usuários estão dizendo
          <br />
          sobre a ThermoGuard
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <InfiniteRow testimonials={testimonialsRow1} reverse={false} />
          <InfiniteRow testimonials={testimonialsRow2} reverse={true} />
        </div>
      </section>

      {/* ── SECTION 3: FAQ ── */}
      <section style={{ padding: "80px 24px 100px" }}>
        <div style={{ maxWidth: 740, margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontSize: "clamp(24px, 4vw, 40px)",
              fontWeight: 700,
              marginBottom: 56,
              lineHeight: 1.3,
              color: "#fff",
            }}
          >
            Perguntas frequentes sobre a
            <br />
            ThermoGuard
          </h2>

          <div>
            {faqs.map((faq, i) => (
              <FAQItem key={i} item={faq} />
            ))}
          </div>
        </div>
      </section>
     
    </main>
    
  );
}