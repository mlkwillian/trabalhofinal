"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "grid" },
  { label: "Ambientes", href: "/dashboard/ambientes", icon: "home" },
  { label: "Alertas", href: "/dashboard/alertas", icon: "bell", badge: 2 },
  { label: "Histórico", href: "/dashboard/historico", icon: "activity" },
  { label: "Relatórios", href: "/dashboard/relatorios", icon: "file" },
  { label: "Configurações", href: "/dashboard/configuracoes", icon: "settings" },
];

// Ícones simplificados
function Icon({ type }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (type) {
    case "grid":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );
    case "home":
      return (
        <svg {...common}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      );
    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        </svg>
      );
    case "activity":
      return (
        <svg {...common}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "file":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12" />
        </svg>
      );
    case "settings":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = {
    name: "Admin ThermoGuard",
    email: "admin@thermoguard.com",
    initials: "AT",
  };

  function isActiveRoute(href) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  function handleLogout() {
    router.push("/login");
  }

  return (
    <aside
      style={{
        width: collapsed ? 64 : 220,
        minHeight: "100vh",
        background: "#0f0e1a",
        borderRight: "1px solid rgba(139,92,246,0.15)",
        display: "flex",
        flexDirection: "column",
        transition: "width .25s",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "20px 0" : "20px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: collapsed ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "linear-gradient(135deg,#7c3aed,#a855f7)",
          }}
        />
        {!collapsed && <span style={{ color: "#e2d9f3" }}>ThermoGuard</span>}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: 8 }}>
        {navItems.map((item) => {
          const active = isActiveRoute(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: collapsed ? "10px 0" : "10px 12px",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 8,
                color: active ? "#c4b5fd" : "#6b5fa0",
                background: active ? "rgba(139,92,246,0.12)" : "transparent",
                textDecoration: "none",
                position: "relative",
              }}
            >
              <Icon type={item.icon} />

              {!collapsed && <span>{item.label}</span>}

              {!collapsed && item.badge && (
                <span
                  style={{
                    marginLeft: "auto",
                    background: "#7c3aed",
                    padding: "2px 6px",
                    borderRadius: 10,
                    fontSize: 10,
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: 8 }}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: 10,
            borderRadius: 8,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "#7c3aed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 12,
            }}
          >
            {user.initials}
          </div>

          {!collapsed && <span style={{ color: "#c4b5fd" }}>{user.name}</span>}
        </button>

        {showUserMenu && (
          <div style={{ marginTop: 8 }}>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 8,
                background: "transparent",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
                cursor: "pointer",
              }}
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}