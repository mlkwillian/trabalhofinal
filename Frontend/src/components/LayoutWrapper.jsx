"use client";

import { usePathname } from "next/navigation";
import LayoutClient from "@/components/LayoutClient";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Se for a página inicial, NÃO usa o layout
  if (pathname === "/" || pathname === "/login" || pathname === "/planos" || pathname === "/login/esqueci" || pathname === "/login/criar") {
    return children;
  } else if (pathname === "/login") {
    return children;
  }

  return <LayoutClient>{children}</LayoutClient>;
}