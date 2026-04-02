"use client";

import { createContext, useContext, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const LayoutContext = createContext();

export function useLayout() {
  return useContext(LayoutContext);
}

export default function LayoutClient({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <LayoutContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="h-screen w-full bg-[#0b0a14] text-white overflow-hidden flex">
        
        {/* Sidebar */}
        <div
          className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 ${
            collapsed ? "w-[64px]" : "w-[240px]"
          }`}
        >
          <Sidebar />
        </div>

        {/* Conteúdo */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            collapsed ? "ml-[64px]" : "ml-[240px]"
          }`}
        >
          {/* Navbar */}
          <div
            className={`fixed top-0 right-0 z-30 ${
              collapsed ? "left-[64px]" : "left-[240px]"
            }`}
          >
            <div className="backdrop-blur-xl bg-white/5 border-b border-white/10">
              <Navbar />
            </div>
          </div>

          {/* Conteúdo */}
          <main className="mt-[70px] h-full overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </LayoutContext.Provider>
  );
}