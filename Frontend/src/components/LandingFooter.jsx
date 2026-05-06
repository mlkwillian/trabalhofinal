"use client";

import { motion } from "motion/react";
import { Thermometer, Mail, Phone, MapPin } from "lucide-react";

export function LandingFooter({ onSupportClick }) {
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
              <span className="text-xl text-purple-100">TermoGuard</span>
            </motion.div>

            <p className="text-purple-300 text-sm">
              Soluções inteligentes para monitoramento de temperatura industrial.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-purple-100 mb-4">Links Rápidos</h4>
            <ul className="space-y-2">
              {["Início", "Funcionalidades", "Planos", "Contato"].map((link) => (
                <li key={link}>
                  <motion.a
                    whileHover={{ x: 5 }}
                    href="#"
                    className="text-purple-300 hover:text-purple-200 text-sm"
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
                  {link === "Suporte" ? (
                    <button
                      onClick={onSupportClick}
                      className="text-purple-300 hover:text-purple-200 text-sm"
                    >
                      {link}
                    </button>
                  ) : (
                    <motion.a
                      whileHover={{ x: 5 }}
                      href="#"
                      className="text-purple-300 hover:text-purple-200 text-sm"
                    >
                      {link}
                    </motion.a>
                  )}
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
                contato@termoguard.com
              </li>
              <li className="flex items-center gap-2 text-purple-300 text-sm">
                <Phone className="h-4 w-4" />
                (11) 9999-9999
              </li>
              <li className="flex items-center gap-2 text-purple-300 text-sm">
                <MapPin className="h-4 w-4" />
                São Paulo, SP
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-purple-500/30 text-center">
          <p className="text-purple-400 text-sm">
            © 2026 TermoGuard. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}