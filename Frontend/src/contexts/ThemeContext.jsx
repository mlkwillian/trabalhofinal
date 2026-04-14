"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { themes } from "@/theme/theme"; // ajuste o path se necessário

const ThemeContext = createContext({
  dark: true,
  toggleDark: () => {},
});

function applyTheme(theme) {
  const t = themes[theme];
  const root = document.documentElement;

  root.style.setProperty("--bg", t.bg);
  root.style.setProperty("--bg-grad", t.bgGrad);
  root.style.setProperty("--surface", t.surface);
  root.style.setProperty("--card", t.card);
  root.style.setProperty("--card-hover", t.cardHover);
  root.style.setProperty("--border", t.border);
  root.style.setProperty("--border-soft", t.borderSoft);
  root.style.setProperty("--purple", t.purple);
  root.style.setProperty("--purple-l", t.purpleL);
  root.style.setProperty("--purple-dim", t.purpleDim);
  root.style.setProperty("--accent", t.accent);
  root.style.setProperty("--accent-dim", t.accentDim);
  root.style.setProperty("--accent-soft", t.accentSoft);
  root.style.setProperty("--blue", t.blue);
  root.style.setProperty("--green", t.green);
  root.style.setProperty("--red", t.red);
  root.style.setProperty("--text", t.text);
  root.style.setProperty("--text-sub", t.textSub);
  root.style.setProperty("--muted", t.muted);
  root.style.setProperty("--faint", t.faint);
  root.style.setProperty("--glass", t.glass);
  root.style.setProperty("--shadow", t.shadow);
  root.style.setProperty("--sidebar", t.sidebar);
  root.style.setProperty("--sidebar-border", t.sidebarBorder);

  // Objeto aninhado: cold
  root.style.setProperty("--cold-bg", t.cold.bg);
  root.style.setProperty("--cold-border", t.cold.border);
  root.style.setProperty("--cold-text", t.cold.text);
  root.style.setProperty("--cold-overlay", t.cold.overlay);
}

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const initial = saved ?? "dark";
    setDark(initial === "dark");
    applyTheme(initial);
  }, []);

  useEffect(() => {
    const theme = dark ? "dark" : "light";
    localStorage.setItem("theme", theme);
    applyTheme(theme);
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, toggleDark: () => setDark((d) => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);