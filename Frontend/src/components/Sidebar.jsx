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
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Ambientes", href: "/dashboard/ambientes", icon: "home" },
  { label: "Alertas", href: "/dashboard/alertas", icon: "bell", badge: 2 },
  { label: "Histórico", href: "/dashboard/historico", icon: "activity" },
  { label: "Relatórios", href: "/dashboard/relatorios", icon: "file" },
  { label: "Configurações", href: "/dashboard/configuracoes", icon: "settings" },
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

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setCollapsed(saved === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", collapsed);
  }, [collapsed]);

  const isActive = (href) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const SidebarContent = (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      className="h-screen bg-[#0f0e1a] border-r border-purple-900/20 flex flex-col relative"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400" />
        {!collapsed && <span className="text-white font-bold">ThermoGuard</span>}
      </div>

      {/* Collapse */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-5 -right-3 bg-[#1a1825] p-1 rounded-full border border-purple-900/30"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all
                  ${active ? "bg-purple-600/20 text-purple-300" : "text-purple-400 hover:bg-purple-600/10"}`}
              >
                <Icon type={item.icon} />
                {!collapsed && <span>{item.label}</span>}

                {!collapsed && item.badge && (
                  <span className="ml-auto text-xs bg-purple-600 px-2 rounded-full">
                    {item.badge}
                  </span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Theme */}
      <button
        onClick={() => setDark(!dark)}
        className="flex items-center gap-2 p-3 text-purple-400 hover:bg-purple-600/10"
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
        {!collapsed && (dark ? "Modo Claro" : "Modo Escuro")}
      </button>

      {/* User */}
      <div className="p-2">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-purple-600/10"
        >
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs">
            AT
          </div>
          {!collapsed && <span className="text-purple-200">Admin</span>}
        </button>

        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 bg-[#1a1825] rounded-lg p-2 space-y-1"
          >
            <button onClick={() => router.push("/perfil")} className="flex gap-2 p-2 hover:bg-purple-600/10 w-full">
              <User size={14} /> Perfil
            </button>
            <button onClick={() => router.push("/dashboard/configuracoes")} className="flex gap-2 p-2 hover:bg-purple-600/10 w-full">
              <Settings size={14} /> Configurações
            </button>
            <button onClick={() => router.push("/login")} className="flex gap-2 p-2 hover:bg-red-500/10 text-red-400 w-full">
              <LogOut size={14} /> Sair
            </button>
          </motion.div>
        )}
      </div>
    </motion.aside>
  );

  return (
    <>
      {/* Mobile Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-purple-600 p-2 rounded-lg"
      >
        <Menu />
      </button>

      {/* Desktop */}
      <div className="hidden md:block">{SidebarContent}</div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-50">{SidebarContent}</div>
        </div>
      )}
    </>
  );
}
