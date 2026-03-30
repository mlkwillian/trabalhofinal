"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    label: "Ambientes",
    href: "/dashboard/ambientes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Alertas",
    href: "/dashboard/alertas",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    badge: 2,
  },
  {
    label: "Histórico",
    href: "/dashboard/historico",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    label: "Relatórios",
    href: "/dashboard/relatorios",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "Configurações",
    href: "/dashboard/configuracoes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Mock user — substitua por dados reais (session, context, etc.)
  const user = {
    name: "Admin ThermoGuard",
    email: "admin@thermoguard.com",
    initials: "AT",
  };

  function handleLogout() {
    // Substitua pela sua lógica de logout (signOut do NextAuth, etc.)
    router.push("/login");
  }

  return (
    <>
      <aside
        style={{
          width: collapsed ? "64px" : "220px",
          minHeight: "100vh",
          background: "#0f0e1a",
          borderRight: "1px solid rgba(139, 92, 246, 0.15)",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
          zIndex: 40,
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: collapsed ? "20px 0" : "20px 16px",
            justifyContent: collapsed ? "center" : "flex-start",
            borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
            minHeight: "64px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 2.74 1.54 5.12 3.81 6.38L9 20h6l.19-4.62C17.46 14.12 19 11.74 19 9c0-3.87-3.13-7-7-7z" />
            </svg>
          </div>
          {!collapsed && (
            <div>
              <p style={{ color: "#e2d9f3", fontWeight: 600, fontSize: "14px", margin: 0, letterSpacing: "0.02em" }}>
                ThermoGuard
              </p>
              <p style={{ color: "#6b5fa0", fontSize: "10px", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Controle de Temp.
              </p>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "absolute",
            top: "20px",
            right: "-12px",
            width: "24px",
            height: "24px",
            borderRadius: "50%",
            background: "#1a1730",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 50,
            color: "#a78bfa",
            transition: "background 0.2s",
          }}
          aria-label="Recolher sidebar"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            style={{ transform: collapsed ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: collapsed ? "10px 0" : "10px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: "8px",
                  textDecoration: "none",
                  color: isActive ? "#c4b5fd" : "#6b5fa0",
                  background: isActive ? "rgba(139, 92, 246, 0.12)" : "transparent",
                  borderLeft: isActive ? "2px solid #7c3aed" : "2px solid transparent",
                  transition: "all 0.18s",
                  position: "relative",
                  fontSize: "13.5px",
                  fontWeight: isActive ? 500 : 400,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "rgba(139, 92, 246, 0.07)";
                  if (!isActive) e.currentTarget.style.color = "#a78bfa";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                  if (!isActive) e.currentTarget.style.color = "#6b5fa0";
                }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge ? (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "#7c3aed",
                      color: "#e9d5ff",
                      fontSize: "10px",
                      fontWeight: 600,
                      borderRadius: "10px",
                      padding: "1px 7px",
                      flexShrink: 0,
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
                {collapsed && item.badge ? (
                  <span
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#a855f7",
                    }}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div
          style={{
            padding: "8px",
            borderTop: "1px solid rgba(139, 92, 246, 0.1)",
            position: "relative",
          }}
        >
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: collapsed ? "10px 0" : "10px 12px",
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: "8px",
              background: showUserMenu ? "rgba(139, 92, 246, 0.1)" : "transparent",
              border: "none",
              cursor: "pointer",
              transition: "background 0.18s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139, 92, 246, 0.07)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = showUserMenu ? "rgba(139, 92, 246, 0.1)" : "transparent"; }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #4c1d95, #7c3aed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: 600,
                color: "#e9d5ff",
                flexShrink: 0,
                border: "1.5px solid rgba(167, 139, 250, 0.3)",
              }}
            >
              {user.initials}
            </div>
            {!collapsed && (
              <>
                <div style={{ flex: 1, textAlign: "left", overflow: "hidden" }}>
                  <p style={{ color: "#c4b5fd", fontSize: "12.5px", fontWeight: 500, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.name}
                  </p>
                  <p style={{ color: "#4c3a7a", fontSize: "11px", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email}
                  </p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b5fa0" strokeWidth="2" style={{ flexShrink: 0, transform: showUserMenu ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </>
            )}
          </button>

          {/* User dropdown */}
          {showUserMenu && (
            <div
              style={{
                position: "absolute",
                bottom: collapsed ? "60px" : "80px",
                left: collapsed ? "72px" : "8px",
                right: collapsed ? "auto" : "8px",
                width: collapsed ? "180px" : "auto",
                background: "#13112b",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                zIndex: 100,
              }}
            >
              <Link
                href="/dashboard/perfil"
                onClick={() => setShowUserMenu(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  color: "#a78bfa",
                  textDecoration: "none",
                  fontSize: "13px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Meu Perfil
              </Link>
              <Link
                href="/dashboard/configuracoes"
                onClick={() => setShowUserMenu(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  color: "#a78bfa",
                  textDecoration: "none",
                  fontSize: "13px",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139, 92, 246, 0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Configurações
              </Link>
              <div style={{ height: "1px", background: "rgba(139, 92, 246, 0.1)", margin: "2px 0" }} />
              <button
                onClick={handleLogout}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  color: "#f87171",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sair
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}