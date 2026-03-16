"use client";
import { motion } from "motion/react";
import { Radio, Database, Gauge, BellRing } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: Radio,
      title: "Sensores Instalados",
      description: "Sensores IoT de alta precisão instalados em todas as áreas críticas da empresa.",
      step: "01",
    },
    {
      icon: Database,
      title: "Coleta de Dados",
      description: "Dados de temperatura coletados continuamente e enviados para nossa plataforma.",
      step: "02",
    },
    {
      icon: Gauge,
      title: "Processamento",
      description: "Sistema analisa os dados em tempo real e identifica padrões e anomalias.",
      step: "03",
    },
    {
      icon: BellRing,
      title: "Alertas e Ações",
      description: "Você recebe notificações instantâneas e pode tomar decisões baseadas em dados.",
      step: "04",
    },
  ];

  return (
    <section className="py-20 px-8 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-200 to-violet-200 bg-clip-text text-transparent">
            Como Funciona
          </h2>
          <p className="text-purple-300 text-lg max-w-2xl mx-auto">
            Um processo simples e eficiente para garantir o controle total
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                <div className="text-center">
                  {/* Step number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    className="relative inline-block mb-6"
                  >
                    <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl" />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center border-2 border-purple-400/50">
                      <span className="text-2xl">{step.step}</span>
                    </div>
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="mb-4 inline-block p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 border border-purple-500/30"
                  >
                    <step.icon className="h-8 w-8 text-purple-400" />
                  </motion.div>

                  {/* Title and description */}
                  <h3 className="text-xl mb-3 text-purple-100">
                    {step.title}
                  </h3>
                  <p className="text-purple-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                    className="hidden lg:block absolute top-10 -right-4 text-purple-500"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}