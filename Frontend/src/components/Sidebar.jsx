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
import { useTheme } from "@/contexts/ThemeContext";

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
  const { dark, toggleDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
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
      className="fixed left-0 top-0 h-screen flex flex-col z-40"
      style={{
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 mb-2">
        <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
          <ShieldCheck size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold leading-none" style={{ color: "var(--text)" }}>
              ThermoGuard
            </span>
            <span
              className="text-[10px] font-medium uppercase tracking-wider"
              style={{ color: "var(--purple)" }}
            >
              Enterprise
            </span>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-5 -right-3 p-1 rounded-full z-50"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          color: "var(--purple-l)",
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item, index) => {
          const active = isActive(item.href);
          const showCategory =
            !collapsed &&
            (index === 0 || navItems[index - 1].category !== item.category);

          return (
            <div key={item.href}>
              {showCategory && (
                <p
                  className="text-[10px] uppercase font-semibold px-3 mt-4 mb-1 tracking-widest"
                  style={{ color: "var(--muted)" }}
                >
                  {item.category}
                </p>
              )}
              <Link href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all"
                  style={{
                    background: active ? "color-mix(in srgb, var(--purple) 15%, transparent)" : "transparent",
                    color: active ? "var(--purple-l)" : "var(--text-sub)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.background = "color-mix(in srgb, var(--purple) 8%, transparent)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.background = "transparent";
                  }}
                >
                  <Icon type={item.icon} />
                  {!collapsed && <span className="text-sm">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span
                      className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ background: "var(--purple)" }}
                    >
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            </div>
          );
        })}
      </nav>

      {/* System Status */}
      {!collapsed && (
        <div
          className="mx-4 p-3 mb-4 rounded-xl"
          style={{
            background: "var(--faint)",
            border: "1px solid var(--border-soft)",
          }}
        >
          <div className="flex items-center gap-2 mb-2" style={{ color: "var(--text-sub)" }}>
            <Database size={14} />
            <span className="text-xs font-medium">Status Sensores</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-1.5 flex-1 rounded-full overflow-hidden"
              style={{ background: "var(--border)" }}
            >
              <div
                className="h-full w-[85%] rounded-full"
                style={{ background: "var(--purple)" }}
              />
            </div>
            <span className="text-[10px]" style={{ color: "var(--purple-l)" }}>
              12/14
            </span>
          </div>
        </div>
      )}

      {/* Theme Toggle */}
      <button
        onClick={toggleDark}
        className="flex items-center gap-3 px-5 py-3 transition-colors"
        style={{
          color: "var(--text-sub)",
          borderTop: "1px solid var(--border-soft)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "color-mix(in srgb, var(--purple) 8%, transparent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        {dark ? <Sun size={16} /> : <Moon size={16} />}
        {!collapsed && (
          <span className="text-sm">{dark ? "Modo Claro" : "Modo Escuro"}</span>
        )}
      </button>

      {/* User */}
      <div className="p-2" style={{ borderTop: "1px solid var(--border-soft)" }}>
        <button
          onClick={() => {
            if (collapsed) setCollapsed(false);
            setShowUserMenu((prev) => !prev);
          }}
          className="flex items-center gap-2 w-full p-2 rounded-lg transition-colors"
          style={{
            background: showUserMenu
              ? "color-mix(in srgb, var(--purple) 10%, transparent)"
              : "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "color-mix(in srgb, var(--purple) 8%, transparent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = showUserMenu
              ? "color-mix(in srgb, var(--purple) 10%, transparent)"
              : "transparent";
          }}
        >
          <div
            className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{
              background: "var(--purple)",
              border: "1px solid var(--purple-l)",
            }}
          >
            AT
          </div>
          {!collapsed && (
            <div className="flex flex-col items-start overflow-hidden">
              <span
                className="text-sm font-medium truncate w-full text-left"
                style={{ color: "var(--text)" }}
              >
                Admin Thermo
              </span>
              <span className="text-[10px] truncate" style={{ color: "var(--muted)" }}>
                admin@guard.com
              </span>
            </div>
          )}
        </button>

        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-lg p-2 space-y-1 shadow-xl"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
            }}
          >
            <button
              onClick={() => router.push("/perfil")}
              className="flex items-center gap-2 p-2 w-full text-sm rounded-md transition-colors"
              style={{ color: "var(--text-sub)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "color-mix(in srgb, var(--purple) 8%, transparent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <User size={14} /> Perfil
            </button>
            <button
              onClick={() => router.push("/dashboard/configuracoes")}
              className="flex items-center gap-2 p-2 w-full text-sm rounded-md transition-colors"
              style={{ color: "var(--text-sub)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "color-mix(in srgb, var(--purple) 8%, transparent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Settings size={14} /> Preferências
            </button>
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 p-2 w-full text-sm rounded-md transition-colors pt-2"
              style={{
                color: "var(--red)",
                borderTop: "1px solid var(--border-soft)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "color-mix(in srgb, var(--red) 8%, transparent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
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
        className="md:hidden fixed top-4 left-4 z-50 text-white p-2 rounded-lg shadow-lg"
        style={{ background: "var(--purple)" }}
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