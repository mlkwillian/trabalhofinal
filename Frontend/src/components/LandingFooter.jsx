"use client";

import { motion } from "motion/react";
import { Thermometer, Mail, Phone, MapPin } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="relative border-t border-purple-500/30 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/30 to-violet-500/30">
                <Thermometer className="h-6 w-6 text-purple-400" />
              </div>
              <span className="text-xl text-purple-100">TempControl</span>
            </motion.div>
            <p className="text-purple-300 text-sm leading-relaxed">
              Soluções inteligentes para monitoramento de temperatura industrial e corporativa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-purple-100 mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {["Início", "Funcionalidades", "Planos", "Contato"].map((link) => (
                <li key={link}>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-purple-300 hover:text-purple-200 text-sm transition-colors"
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-purple-100 mb-4">Recursos</h4>
            <ul className="space-y-2">
              {["Documentação", "API", "Suporte", "Blog"].map((link) => (
                <li key={link}>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-purple-300 hover:text-purple-200 text-sm transition-colors"
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-purple-100 mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-purple-300 text-sm">
                <Mail className="h-4 w-4" />
                <span>contato@tempcontrol.com</span>
              </li>
              <li className="flex items-center gap-2 text-purple-300 text-sm">
                <Phone className="h-4 w-4" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-center gap-2 text-purple-300 text-sm">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-purple-500/30 text-center"
        >
          <p className="text-purple-400 text-sm">
            © 2026 TempControl. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          className="absolute -bottom-1/2 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>
    </footer>
  );
}
