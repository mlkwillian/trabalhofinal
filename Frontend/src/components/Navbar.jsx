"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Sun, Moon, Plus, X, Thermometer, Building2, CheckCircle, AlertCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

// ─── MODAL em Portal (renderiza direto no <body>, fora de qualquer overflow) ───
function NovoAmbienteModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [form, setForm] = useState({ nome_sala: "", temperatura_min: "", temperatura_max: "" });
  const [errors, setErrors] = useState({});

  // Bloqueia scroll do body enquanto modal está aberto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Fecha com ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.nome_sala.trim()) e.nome_sala = "Nome da sala é obrigatório";
    if (form.temperatura_min === "") e.temperatura_min = "Obrigatório";
    if (form.temperatura_max === "") e.temperatura_max = "Obrigatório";
    if (
      form.temperatura_min !== "" &&
      form.temperatura_max !== "" &&
      parseFloat(form.temperatura_min) >= parseFloat(form.temperatura_max)
    ) {
      e.temperatura_max = "Máxima deve ser maior que a mínima";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setFeedback(null);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/api/salas",
        {
          nome_sala: form.nome_sala.trim(),
          temperatura_min: parseFloat(form.temperatura_min),
          temperatura_max: parseFloat(form.temperatura_max),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedback({ type: "success", message: "Ambiente criado com sucesso!" });
      setTimeout(() => onSuccess(), 1200);
    } catch (err) {
      const msg = err?.response?.data?.erro || "Erro ao criar ambiente. Tente novamente.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (key) => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    background: "#1a1825",
    border: `1px solid ${errors[key] ? "rgba(239,68,68,0.6)" : "rgba(109,40,217,0.3)"}`,
    color: "#fff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  });

  return createPortal(
    /* Overlay — clique fora fecha */
    <div
      onClick={(e) => { if (e.target === e.currentTarget && !loading) onClose(); }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(5px)",
      }}
    >
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);      }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Caixa do modal */}
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "16px",
          border: "1px solid rgba(109,40,217,0.35)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          background: "#12101e",
          animation: "modalIn 0.18s ease",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px 16px",
          borderBottom: "1px solid rgba(109,40,217,0.2)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "8px", borderRadius: "8px", background: "rgba(109,40,217,0.2)", display: "flex" }}>
              <Building2 size={18} color="#a78bfa" />
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 600, fontSize: "15px", margin: 0 }}>Novo Ambiente</p>
              <p style={{ color: "#7c3aed", fontSize: "12px", margin: 0 }}>Preencha os dados do ambiente</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: "6px", borderRadius: "8px", background: "transparent",
              border: "none", cursor: "pointer", color: "#a78bfa", display: "flex",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Nome da sala */}
          <div>
            <label style={{ color: "#c4b5fd", fontSize: "12px", fontWeight: 500, display: "block", marginBottom: "6px" }}>
              Nome do Ambiente
            </label>
            <input
              type="text"
              placeholder="Ex: Almoxarifado Principal"
              value={form.nome_sala}
              onChange={(e) => setForm((f) => ({ ...f, nome_sala: e.target.value }))}
              style={inputStyle("nome_sala")}
            />
            {errors.nome_sala && (
              <p style={{ color: "#f87171", fontSize: "12px", marginTop: "4px" }}>{errors.nome_sala}</p>
            )}
          </div>

          {/* Temperaturas */}
          <div>
            <label style={{
              color: "#c4b5fd", fontSize: "12px", fontWeight: 500,
              display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px",
            }}>
              <Thermometer size={13} color="#a78bfa" />
              Faixa de Temperatura (°C)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <input
                  type="number"
                  placeholder="Mín (°C)"
                  value={form.temperatura_min}
                  onChange={(e) => setForm((f) => ({ ...f, temperatura_min: e.target.value }))}
                  style={inputStyle("temperatura_min")}
                />
                {errors.temperatura_min && (
                  <p style={{ color: "#f87171", fontSize: "12px", marginTop: "4px" }}>{errors.temperatura_min}</p>
                )}
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Máx (°C)"
                  value={form.temperatura_max}
                  onChange={(e) => setForm((f) => ({ ...f, temperatura_max: e.target.value }))}
                  style={inputStyle("temperatura_max")}
                />
                {errors.temperatura_max && (
                  <p style={{ color: "#f87171", fontSize: "12px", marginTop: "4px" }}>{errors.temperatura_max}</p>
                )}
              </div>
            </div>
          </div>

          {/* Feedback sucesso / erro */}
          {feedback && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "10px 12px", borderRadius: "8px", fontSize: "13px",
              background: feedback.type === "success" ? "rgba(21,128,61,0.2)" : "rgba(185,28,28,0.2)",
              border: `1px solid ${feedback.type === "success" ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
              color: feedback.type === "success" ? "#4ade80" : "#f87171",
            }}>
              {feedback.type === "success" ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
              {feedback.message}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: "0 24px 24px", display: "flex", gap: "12px" }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              flex: 1, padding: "10px", borderRadius: "8px",
              border: "1px solid rgba(109,40,217,0.35)", background: "transparent",
              color: "#c4b5fd", fontSize: "14px", fontWeight: 500,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.5 : 1,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || feedback?.type === "success"}
            style={{
              flex: 1, padding: "10px", borderRadius: "8px",
              background: "#7c3aed", border: "none",
              color: "#fff", fontSize: "14px", fontWeight: 500,
              cursor: (loading || feedback?.type === "success") ? "not-allowed" : "pointer",
              opacity: (loading || feedback?.type === "success") ? 0.65 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
          >
            {loading ? (
              <>
                <span style={{
                  width: "14px", height: "14px",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTop: "2px solid #fff",
                  borderRadius: "50%",
                  animation: "spin 0.7s linear infinite",
                  display: "inline-block",
                }} />
                Salvando...
              </>
            ) : (
              <><Plus size={15} /> Criar Ambiente</>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ─── NAVBAR PRINCIPAL ───
export default function Navbar() {
  const { dark, toggleDark } = useTheme();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleSuccess = () => {
    setModalOpen(false);
    router.push("/ambientes");
    router.refresh();
  };

  return (
    <>
      <header
        className="w-full h-16 flex items-center justify-between px-6 border-b border-purple-900/20"
        style={{ background: "var(--bg)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400" />
          <h1 className="text-white font-bold text-lg">TermoGuard</h1>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 transition"
          >
            {dark ? (
              <Sun size={18} className="text-purple-300" />
            ) : (
              <Moon size={18} className="text-purple-300" />
            )}
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white font-medium"
          >
            <Plus size={16} />
            Novo Ambiente
          </button>
        </div>
      </header>

      {/* Modal renderizado direto no <body> via Portal — sem interferência do header */}
      {modalOpen && (
        <NovoAmbienteModal
          onClose={() => setModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}