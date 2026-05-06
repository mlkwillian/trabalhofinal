"use client";

import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useState } from "react";

export default function SupportContactModal({ open, setOpen }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ validação
  const validate = (data) => {
    const newErrors = {};

    if (!data.name) newErrors.name = "Digite seu nome";
    if (!data.email) newErrors.email = "Digite seu email";
    if (!data.message) newErrors.message = "Digite sua mensagem";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData(e.target);

    const data = {
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message"),
      company: form.get("company"),
      phone: form.get("phone"),
      type: form.get("type"),
    };

    const validation = validate(data);

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setErrors({});
    setLoading(true);

    await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    });

    setLoading(false);
    setSuccess(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-purple-500/30 rounded-3xl p-8 w-full max-w-md relative shadow-[0_0_60px_rgba(168,85,247,0.2)]"
          >
            {/* FECHAR */}
            <button
              onClick={() => {
                setOpen(false);
                setSuccess(false);
                setErrors({});
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {!success ? (
              <>
                <h2 className="text-2xl font-semibold text-purple-300 mb-1">
                  Fale com nossa equipe
                </h2>

                <p className="text-zinc-400 text-sm mb-6">
                  Vamos te responder o mais rápido possível.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* GRID */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* NOME */}
                    <div>
                      <input
                        name="name"
                        placeholder="Nome"
                        className={`w-full p-3 rounded-xl bg-zinc-900 border ${
                          errors.name
                            ? "border-red-500"
                            : "border-zinc-700 focus:border-purple-500"
                        } text-white outline-none`}
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* EMPRESA */}
                    <div>
                      <input
                        name="company"
                        placeholder="Empresa"
                        className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <input
                      name="email"
                      type="email"
                      placeholder="Email"
                      className={`w-full p-3 rounded-xl bg-zinc-900 border ${
                        errors.email
                          ? "border-red-500"
                          : "border-zinc-700 focus:border-purple-500"
                      } text-white outline-none`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* TELEFONE */}
                  <div>
                    <input
                      name="phone"
                      placeholder="Telefone (opcional)"
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white outline-none focus:border-purple-500"
                    />
                  </div>

                  {/* SELECT */}
                  <div>
                    <select
                      name="type"
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white outline-none focus:border-purple-500"
                    >
                      <option value="">Tipo de contato</option>
                      <option>Suporte</option>
                      <option>Comercial</option>
                      <option>Dúvida</option>
                    </select>
                  </div>

                  {/* MENSAGEM */}
                  <div>
                    <textarea
                      name="message"
                      placeholder="Como podemos te ajudar?"
                      rows="4"
                      className={`w-full p-3 rounded-xl bg-zinc-900 border ${
                        errors.message
                          ? "border-red-500"
                          : "border-zinc-700 focus:border-purple-500"
                      } text-white outline-none`}
                    />
                    {errors.message && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* BOTÃO */}
                  <button
                    disabled={loading}
                    className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-medium transition disabled:opacity-50"
                  >
                    {loading ? "Enviando..." : "Enviar mensagem"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-10">
                <h2 className="text-2xl text-green-400 mb-2">
                  ✔ Mensagem enviada
                </h2>
                <p className="text-zinc-400 text-sm">
                  Nossa equipe vai entrar em contato com você.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}