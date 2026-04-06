"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function PublicNavbar() {
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
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-purple-400" />
        <h1 className="text-white font-bold text-lg">ThermoGuard</h1>
      </div>

      {/* Navegação */}
      <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
        <Link href="#features" className="hover:text-white transition">
          Recursos
        </Link>
        <Link href="#about" className="hover:text-white transition">
          Sobre
        </Link>
        <Link href="#contact" className="hover:text-white transition">
          Contato
        </Link>
      </nav>

      {/* Ações */}
      <div className="flex items-center gap-3">
        
        {/* Tema */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg bg-purple-600/10 hover:bg-purple-600/20 transition"
        >
          {dark ? (
            <Sun size={18} className="text-purple-300" />
          ) : (
            <Moon size={18} className="text-purple-300" />
          )}
        </button>

        {/* Login */}
        <Link
          href="/login"
          className="px-4 py-2 rounded-lg text-sm text-purple-300 hover:text-white transition"
        >
          Entrar
        </Link>

        {/* CTA */}
        <Link
          href="/register"
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-medium"
        >
          Criar conta
        </Link>
      </div>
    </header>
  );
}