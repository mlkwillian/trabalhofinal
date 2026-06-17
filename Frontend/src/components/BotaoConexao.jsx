import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { useState } from "react";

export default function BotaoConexao() {
  const [status, setStatus] = useState("desconectado");

  const conectar = () => {
    if (status !== "desconectado") return;

    setStatus("conectando");

    // Simula conexão
    setTimeout(() => {
      setStatus("conectado");
    }, 3000);
  };

  return (
    <button
      onClick={conectar}
      disabled={status !== "desconectado"}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all
        ${
          status === "desconectado"
            ? "bg-red-500 hover:bg-red-600"
            : status === "conectando"
            ? "bg-yellow-500 cursor-wait"
            : "bg-green-500"
        }`}
    >
      {status === "desconectado" && <WifiOff size={18} />}
      {status === "conectando" && (
        <Loader2 size={18} className="animate-spin" />
      )}
      {status === "conectado" && <Wifi size={18} />}

      {status === "desconectado" && "Conectar Wi-Fi"}
      {status === "conectando" && "Conectando..."}
      {status === "conectado" && "Conectado"}
    </button>
  );
}