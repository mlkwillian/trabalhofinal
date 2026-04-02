"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Plus } from "lucide-react";

export default function Navbar() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setDark(saved === "dark");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");

    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <header className="w-full h-16 flex items-center justify-between px-6 border-b border-purple-900/20 bg-[#0b0a14]">
      {/* Logo + Nome */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400" />
        <h1 className="text-white font-bold text-lg">ThermoGuard</h1>
      </div>

      {/* Ações */}
      <div className="flex items-center gap-3">
        {/* Tema */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 transition"
        >
          {dark ? <Sun size={18} className="text-purple-300" /> : <Moon size={18} className="text-purple-300" />}
        </button>

        {/* Novo Ambiente */}
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white font-medium"
        >
          <Plus size={16} />
          Novo Ambiente
        </button>
      </div>
    </header>
  );
}
