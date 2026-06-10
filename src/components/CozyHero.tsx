export function CozyHero({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/homedemoupdate.png"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-900/60 to-slate-950" />
        </div>
        <div className="absolute inset-0 backdrop-saturate-150 pointer-events-none " />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {children}
        </div>
      </section>
    </div>
  )
}
