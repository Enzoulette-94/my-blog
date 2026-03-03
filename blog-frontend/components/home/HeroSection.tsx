export function HeroSection() {
  return (
    <div className="relative text-center py-20 px-4 rounded-2xl overflow-hidden mb-10"
      style={{ background: "linear-gradient(135deg, #009C3B 0%, #00b844 50%, #FFDF00 100%)" }}
    >
      {/* Cercles décoratifs inspirés du drapeau brésilien */}
      <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-4 border-white/20 pointer-events-none" />
      <div className="absolute top-8 right-8 w-20 h-20 rounded-full border-2 border-white/15 pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border-4 border-white/20 pointer-events-none" />

      <h1 className="relative text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-white drop-shadow-md">
        Bienvenue sur EnzouletteBlog
      </h1>
      <p className="relative text-lg max-w-xl mx-auto text-white/90 font-medium">
        Explorez les articles et photos partagés par notre communauté.
      </p>
    </div>
  )
}
