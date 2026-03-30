export default function AddEnvironmentDialog({ T }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl font-black transition-all duration-200 hover:scale-105"
          style={{ background: `${T.purple}20`, color: T.purpleL, border: `1.5px solid ${T.purpleDim}` }}>
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Novo Ambiente</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm border" style={{ background: T.card, borderColor: T.border }}>
        <DialogHeader>
          <DialogTitle className="text-sm font-black" style={{ color: T.text }}>Adicionar Ambiente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-3">
          {[["Nome", "ex: Câmara Fria C"], ["Temp. Mínima (°C)", "-22"], ["Temp. Máxima (°C)", "-15"]].map(([label, placeholder]) => (
            <div key={label} className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider" style={{ color: T.muted }}>{label}</label>
              <input placeholder={placeholder} className="w-full h-9 px-3 rounded-xl text-xs outline-none transition-all"
                style={{ background: T.surface, border: `1.5px solid ${T.border}`, color: T.text, fontFamily: "'Space Mono', monospace" }} />
            </div>
          ))}
          <button className="w-full h-10 rounded-xl text-xs font-black transition-all hover:scale-[1.02] mt-2"
            style={{ background: T.purple, color: "#fff" }} onClick={() => setOpen(false)}>
            Adicionar Ambiente
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
