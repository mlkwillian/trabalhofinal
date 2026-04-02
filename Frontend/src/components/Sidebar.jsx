"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  User,
  Settings,
  LogOut,
  Menu,
  Database,
  ShieldCheck,
} from "lucide-react";
import { useLayout } from "@/components/LayoutClient";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "grid", category: "Principal" },
  { label: "Ambientes", href: "/ambientes", icon: "home", category: "Principal" },
  { label: "Alertas", href: "/alertas", icon: "bell", badge: 2, category: "Monitoramento" },
  { label: "Histórico", href: "/historico", icon: "activity", category: "Monitoramento" },
  { label: "Relatórios", href: "/dashboard/relatorios", icon: "file", category: "Dados" },
  { label: "Configurações", href: "/configuracoes", icon: "settings", category: "Sistema" },
];

function Icon({ type }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
  };

  const icons = {
    grid: <rect x="3" y="3" width="7" height="7" />,
    home: <path d="M3 9l9-7 9 7v11H3z" />,
    bell: <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18" />,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />,
    file: <path d="M14 2H6v20h12" />,
    settings: <circle cx="12" cy="12" r="3" />,
  };

  return <svg {...common}>{icons[type]}</svg>;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, setCollapsed } = useLayout();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  const isActive = (href) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const SidebarContent = (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      className="fixed left-0 top-0 h-screen bg-[#0f0e1a] border-r border-purple-900/20 flex flex-col z-40"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 mb-2">
        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-white font-bold leading-none">ThermoGuard</span>
            <span className="text-[10px] text-purple-500 font-medium uppercase tracking-wider">Enterprise</span>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-5 -right-3 bg-[#1a1825] p-1 rounded-full border border-purple-900/30 text-purple-400 z-50"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          const active = isActive(item.href);
          const showCategory = !collapsed && (index === 0 || navItems[index - 1].category !== item.category);

          return (
            <div key={item.href}>
              {showCategory && (
                <p className="text-[10px] uppercase text-purple-600 font-semibold px-3 mt-4 mb-1 tracking-widest">
                  {item.category}
                </p>
              )}
              <Link href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all
                    ${active ? "bg-purple-600/20 text-purple-300" : "text-purple-400 hover:bg-purple-600/10"}`}
                >
                  <Icon type={item.icon} />
                  {!collapsed && <span className="text-sm">{item.label}</span>}

                  {!collapsed && item.badge && (
                    <span className="ml-auto text-[10px] bg-purple-600 text-white font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* System Status (New Info) */}
      {!collapsed && (
        <div className="mx-4 p-3 mb-4 rounded-xl bg-purple-950/20 border border-purple-900/10">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
                <Database size={14} />
                <span className="text-xs font-medium">Status Sensores</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 bg-purple-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[85%]" />
                </div>
                <span className="text-[10px] text-purple-300">12/14</span>
            </div>
        </div>
      )}

      {/* Theme */}
      <button
        onClick={() => setDark(!dark)}
        className="flex items-center gap-3 px-5 py-3 text-purple-400 hover:bg-purple-600/10 transition-colors border-t border-purple-900/10"
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
        {!collapsed && <span className="text-sm">{dark ? "Modo Claro" : "Modo Escuro"}</span>}
      </button>

      {/* User */}
      <div className="p-2 border-t border-purple-900/10">
        <button
          onClick={() => {
            if (collapsed) setCollapsed(false);
            setShowUserMenu((prev) => !prev);
          }}
          className={`flex items-center gap-2 w-full p-2 rounded-lg transition-colors ${showUserMenu ? 'bg-purple-600/10' : 'hover:bg-purple-600/10'}`}
        >
          <div className="w-8 h-8 flex-shrink-0 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold border border-purple-400/30">
            AT
          </div>
          {!collapsed && (
            <div className="flex flex-col items-start overflow-hidden">
              <span className="text-purple-200 text-sm font-medium truncate w-full text-left">Admin Thermo</span>
              <span className="text-purple-500 text-[10px] truncate">admin@guard.com</span>
            </div>
          )}
        </button>

        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 bg-[#1a1825] border border-purple-900/30 rounded-lg p-2 space-y-1 shadow-xl"
          >
            <button onClick={() => router.push("/perfil")} className="flex items-center gap-2 p-2 hover:bg-purple-600/10 w-full text-sm text-purple-300 rounded-md">
              <User size={14} /> Perfil
            </button>
            <button onClick={() => router.push("/dashboard/configuracoes")} className="flex items-center gap-2 p-2 hover:bg-purple-600/10 w-full text-sm text-purple-300 rounded-md">
              <Settings size={14} /> Preferências
            </button>
            <button onClick={() => router.push("/login")} className="flex items-center gap-2 p-2 hover:bg-red-500/10 text-red-400 w-full text-sm rounded-md border-t border-purple-900/20 pt-2">
              <LogOut size={14} /> Sair
            </button>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-lg shadow-lg"
      >
        <Menu size={20} />
      </button>

      <div className="hidden md:block">{SidebarContent}</div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50">{SidebarContent}</div>
        </div>
      )}
    </>
  );
}