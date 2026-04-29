"use client";

import { useState, useRef, useEffect } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const plans = [
  {
    name: "Explorer",
    price: "R$ 38,99",
    originalPrice: "R$ 54,99",
    discount: "29%",
    credits: "30 créditos de IA/mês",
    highlight: false,
    badge: null,
    domain: "Domínio grátis não incluso",
    emailBoxes: "1 caixa de e-mail grátis por site durante 1 ano",
    annualNote:
      "12 meses por apenas R$ 467,88 (preço normal R$ 659,88). Renovação por R$ 38,99/mês.",
    baseFeatures: null,
    features: [
      "Cria 1 site",
      "Adicione cadastro de usuários, sistema de login, armazenamento de dados",
      "Histórico de versões do projeto",
      "Projetos otimizados para SEO",
      "Apareça nas ferramentas de IA",
      "Comandos com texto",
      "Suporte básico",
    ],
  },
  {
    name: "Starter",
    price: "R$ 76,99",
    originalPrice: "R$ 109,99",
    discount: "30%",
    credits: "70 créditos de IA/mês",
    highlight: true,
    badge: "MAIS POPULAR",
    domain: "Domínio grátis por 1 ano",
    emailBoxes: "2 caixas de e-mail grátis por site por 1 ano",
    annualNote:
      "12 meses por apenas R$ 923,88 (preço normal R$ 1.319,88). Renovação por R$ 76,99/mês.",
    baseFeatures: "Tudo no Explorer, e mais:",
    features: [
      "Cria até 25 sites",
      "Suporte prioritário 24h",
      "Venda assinaturas",
      "Adicione chatbots e outros recursos com IA",
      "Venda produtos físicos e digitais",
      "Acompanhe análises dos visitantes do projeto",
      "Comandos com imagens e voz",
      "Modo de bate-papo grátis para ajuda e orientação",
      "Edite texto e imagens sem solicitar a IA",
      "Recarregue os créditos de IA a qualquer momento",
      "Colabore em projetos",
    ],
  },
  {
    name: "Hobbyist",
    price: "R$ 219,99",
    originalPrice: "R$ 274,99",
    discount: "25%",
    credits: "200 créditos de IA/mês",
    highlight: false,
    badge: null,
    domain: "Domínio grátis por 1 ano",
    emailBoxes: "5 caixas de e-mail grátis por site por 1 ano",
    annualNote:
      "12 meses por apenas R$ 2.639,88 (preço normal R$ 3.299,88). Renovação por R$ 219,99/mês.",
    baseFeatures: "Tudo no Starter, e mais:",
    features: [
      "Cria até 50 sites",
      "Editor de código",
      "Duplique projetos para usar como modelos",
    ],
  },
  {
    name: "Hustler",
    price: "R$ 438,99",
    originalPrice: "R$ 549,99",
    discount: "20%",
    credits: "400 créditos de IA/mês",
    highlight: false,
    badge: null,
    domain: "Domínio grátis por 1 ano",
    emailBoxes: "5 caixas de e-mail grátis por site por 1 ano",
    annualNote:
      "12 meses por apenas R$ 5.267,88 (preço normal R$ 6.599,88). Renovação por R$ 438,99/mês.",
    baseFeatures: "Tudo no Hobbyist, e mais:",
    features: ["Garanta acesso antecipado a novos recursos"],
  },
];

const testimonialsRow1 = [
  {
    name: "Ivana Mikleuš",
    handle: "@ivanamikleus",
    role: "Especialista digital",
    text: "A Hostinger Horizons é uma nova e inovadora maneira de criar MVPs e testar ideias antes de investir.",
    avatar: "IM",
    hasX: false,
  },
  {
    name: "Eric Hill",
    handle: "@EHillPapercraft",
    role: null,
    text: "Fiquei impressionado com a facilidade de criar tudo o que preciso para meu site e para meus clientes usando a IA Horizons da Hostinger. É simplesmente fantástica — vale a pena conferir!",
    avatar: "EH",
    hasX: true,
  },
  {
    name: "Albert Bermejo",
    handle: "@albertbermejo",
    role: "Criador de conteúdo",
    text: "Com a Hostinger Horizons, você transforma aquela ideia que teve em realidade — é só explicar o que quer, e a ferramenta faz acontecer.",
    avatar: "AB",
    hasX: false,
  },
  {
    name: "techmano",
    handle: "@nice_gamin60974",
    role: null,
    text: "Estou adorando o rumo que as coisas estão tomando com a @Hostinger Horizons! A nova atualização de IA tem sido muito divertida de interagir. Foi uma mudança radical não só para mim, mas também para muitas outras pessoas que conheço.",
    avatar: "TM",
    hasX: true,
  },
  {
    name: "mark diantonio",
    handle: "@markdiantonio",
    role: null,
    text: "O Vibe coding reduz o desenvolvimento em 45%, com ferramentas como a Hostinger Horizons transformando linguagem natural em protótipos que funcionam em horas, e não em semanas.",
    avatar: "MD",
    hasX: true,
  },
];

const testimonialsRow2 = [
  {
    name: "Abhihephaestus",
    handle: "@HephaestusNo1",
    role: null,
    text: "Experimentei a Hostinger Horizons e é fantástica! Em poucos minutos, consegui criar sites e apps incríveis sem precisar programar — a IA cuida do design, do código e até do conteúdo. Vale muito a pena testar!",
    avatar: "AH",
    hasX: true,
  },
  {
    name: "Steven Pillow",
    handle: "@spillow82",
    role: null,
    text: "É como ter um desenvolvedor profissional do mais alto nível ao seu lado, pronto para criar o que quiser.",
    avatar: "SP",
    hasX: true,
  },
  {
    name: "Brooks Boshears",
    handle: "@brooksboshears",
    role: "Empreendedor",
    text: "Você pode criar coisas bem legais com a Hostinger Horizons. É diferente dos construtores de sites comuns — é muito mais.",
    avatar: "BB",
    hasX: false,
  },
  {
    name: "RameshR",
    handle: "@rezmeram",
    role: null,
    text: "Fico imaginando como a Hostinger criou a Horizons… É impressionante a rapidez com que qualquer pessoa consegue implementar um front e um back end.",
    avatar: "RR",
    hasX: true,
  },
  {
    name: "Zera",
    handle: "@TheZoyaThinking",
    role: null,
    text: "Não consigo dizer há quanto tempo esse projeto ficou na minha lista de 'um dia eu tiro do papel' ATÉ vocês criarem a IA da Horizons. Não sei nada de programação de web apps. Zero. E ele está lá. Meu projeto dos sonhos está ONLINE. Que demais!",
    avatar: "ZR",
    hasX: true,
  },
];

const faqs = [
  {
    question: "Quais são as diferenças entre os planos da Hostinger Horizons?",
    answer:
      "Cada plano oferece uma quantidade diferente de créditos de IA por mês, número de sites que você pode criar, recursos como editor de código, suporte prioritário, domínio grátis e caixas de e-mail. O Explorer é ideal para quem está começando, enquanto o Hustler atende projetos mais robustos.",
  },
  {
    question: "Como funcionam os créditos de IA?",
    answer:
      "Os créditos de IA são consumidos sempre que você utiliza funcionalidades alimentadas por inteligência artificial, como geração de código, criação de conteúdo e edição de imagens. Cada plano inclui uma cota mensal e você pode recarregar a qualquer momento se precisar de mais.",
  },
  {
    question: "Posso ver quantos créditos de IA meu app utilizou?",
    answer:
      "Sim! No painel da Hostinger Horizons você tem acesso em tempo real ao consumo de créditos de IA do seu projeto, podendo acompanhar o histórico de uso e planejar melhor sua cota mensal.",
  },
  {
    question:
      "Posso comprar créditos adicionais sem fazer upgrade para um plano superior?",
    answer:
      "Sim, é possível adquirir pacotes de créditos avulsos sem precisar mudar de plano. Essa opção é ideal para meses em que você tem projetos mais intensos.",
  },
  {
    question: "Posso contratar a Hostinger Horizons sem hospedagem?",
    answer:
      "A Hostinger Horizons é um produto integrado ao ecossistema Hostinger. Para publicar seus projetos, você precisará de um plano que inclua hospedagem, mas pode criar e testar localmente antes de publicar.",
  },
  {
    question: "Que tipos de sites posso publicar com a Hostinger Horizons?",
    answer:
      "Você pode criar portfólios, lojas virtuais, landing pages, blogs, apps com autenticação de usuários, sistemas de assinatura e muito mais. A plataforma suporta projetos simples até aplicações web completas.",
  },
  {
    question: "Posso gerar um aplicativo para celular com a Hostinger Horizons?",
    answer:
      "No momento, a Hostinger Horizons é focada em aplicações web responsivas. Seus projetos são otimizados para funcionar bem em dispositivos móveis pelo navegador.",
  },
  {
    question: "De quem é a propriedade do código criado com a Hostinger Horizons?",
    answer:
      "Todo o código gerado é de sua propriedade. Você tem total liberdade para exportar, editar e utilizar o código criado na plataforma como quiser.",
  },
  {
    question:
      "É possível integrar APIs ou serviços externos com a Hostinger Horizons?",
    answer:
      "Sim! A plataforma permite integrar APIs externas, serviços de pagamento, ferramentas de analytics e outros recursos de terceiros diretamente nos seus projetos.",
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
              da Hostinger Horizons
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
          sobre a Hostinger Horizons
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
            Hostinger Horizons
          </h2>

          <div>
            {faqs.map((faq, i) => (
              <FAQItem key={i} item={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      {/* 
        Substitua o bloco abaixo pelo seu footer existente:
        import SeuFooter from "@/components/SeuFooter"
        e use <SeuFooter /> aqui
      */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "48px 24px",
          textAlign: "center",
          color: "rgba(255,255,255,0.3)",
          fontSize: 13,
        }}
      >
        <p>Seu footer aqui — importe o componente existente</p>
      </footer>
    </main>
  );
}