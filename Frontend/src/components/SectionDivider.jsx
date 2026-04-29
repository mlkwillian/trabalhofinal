"use client";

export function SectionDivider() {
  return (
    <div className="relative py-16">
      <div className="max-w-7xl mx-auto px-8 text-center">
        <div className="flex items-center gap-4">
          
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-purple-500/30" />

          <span className="text-xs uppercase tracking-widest text-purple-400 bg-[#0e0c1e] px-4 py-1 rounded-full border border-purple-500/20">
            Monitoramento em tempo real
          </span>

          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-purple-500/30" />

        </div>
      </div>
    </div>
  );
}