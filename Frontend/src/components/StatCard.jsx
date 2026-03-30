export default function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  accentColor, 
  T,
  trend 
}) {
  return (
    <div
      className="rounded-2xl border p-5 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] cursor-default group"
      style={{ background: T.card, borderColor: T.border, boxShadow: T.shadow }}
    >
      <div
        className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${accentColor}15`, border: `1.5px solid ${accentColor}30` }}
      >
        <Icon className="h-5 w-5" style={{ color: accentColor }} />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-3xl font-black leading-none tabular-nums"
          style={{ color: T.text, fontFamily: "'Space Mono', monospace" }}
        >
          {value}
        </p>

        <p
          className="text-[11px] mt-1 font-semibold uppercase tracking-widest truncate"
          style={{ color: T.muted }}
        >
          {label}
        </p>
      </div>

      {trend !== undefined && (
        <div className="shrink-0">
          {trend >= 0 ? (
            <TrendingUp className="h-4 w-4" style={{ color: T.green }} />
          ) : (
            <TrendingDown className="h-4 w-4" style={{ color: T.red }} />
          )}
        </div>
      )}
    </div>
  );
}