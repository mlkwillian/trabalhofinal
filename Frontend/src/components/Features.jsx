"use client";

import { motion } from "motion/react";
import { Activity, Bell, LineChart, Shield, Zap, Clock } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Activity,
      title: "Monitoramento em Tempo Real",
      description: "Acompanhe a temperatura de todas as áreas simultaneamente com atualização instantânea.",
    },
    {
      icon: Bell,
      title: "Alertas Inteligentes",
      description: "Receba notificações automáticas quando a temperatura sair dos limites estabelecidos.",
    },
    {
      icon: LineChart,
      title: "Análise de Dados",
      description: "Visualize gráficos e históricos detalhados para identificar padrões e tendências.",
    },
    {
      icon: Shield,
      title: "Segurança Garantida",
      description: "Dados criptografados e sistema confiável para proteger as informações da sua empresa.",
    },
    {
      icon: Zap,
      title: "Economia de Energia",
      description: "Otimize o uso de sistemas de climatização e reduza custos operacionais.",
    },
    {
      icon: Clock,
      title: "Histórico Completo",
      description: "Acesse registros completos de temperatura para auditorias e análises posteriores.",
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
            Funcionalidades Principais
          </h2>
          <p className="text-purple-300 text-lg max-w-2xl mx-auto">
            Tudo que você precisa para ter controle total sobre o ambiente da sua empresa
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-violet-900/20 p-8 backdrop-blur-sm"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="mb-6 inline-block p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20"
              >
                <feature.icon className="h-8 w-8 text-purple-400" />
              </motion.div>

              <h3 className="text-xl mb-3 text-purple-100">
                {feature.title}
              </h3>
              <p className="text-purple-300 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-purple-600/0 opacity-0 group-hover:opacity-100"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
