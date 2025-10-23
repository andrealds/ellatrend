import WellnessCarousel from "./NewsCarousel";

export default function HeroSection() {
  return (
    <section className="gradient-bg text-white relative overflow-hidden">
      {/* Bolas decorativas */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Bolas grandes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200/30 rounded-full blur-sm"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-purple-200/25 rounded-full blur-sm"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-blue-200/20 rounded-full blur-sm"></div>
        <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-yellow-200/25 rounded-full blur-sm"></div>
        <div className="absolute bottom-32 right-10 w-36 h-36 bg-green-200/20 rounded-full blur-sm"></div>
        
        {/* Bolas médias */}
        <div className="absolute top-32 left-1/3 w-20 h-20 bg-pink-300/20 rounded-full blur-sm"></div>
        <div className="absolute bottom-40 right-1/4 w-16 h-16 bg-purple-300/25 rounded-full blur-sm"></div>
        <div className="absolute top-2/3 left-10 w-22 h-22 bg-blue-300/15 rounded-full blur-sm"></div>
        <div className="absolute bottom-10 right-1/2 w-18 h-18 bg-yellow-300/20 rounded-full blur-sm"></div>
        
        {/* Bolas pequenas */}
        <div className="absolute top-16 right-1/2 w-12 h-12 bg-pink-400/30 rounded-full blur-sm"></div>
        <div className="absolute bottom-16 left-1/2 w-14 h-14 bg-purple-400/25 rounded-full blur-sm"></div>
        <div className="absolute top-1/3 left-1/2 w-10 h-10 bg-blue-400/20 rounded-full blur-sm"></div>
        <div className="absolute bottom-1/3 right-1/2 w-16 h-16 bg-green-400/15 rounded-full blur-sm"></div>
      </div>
      
      {/* Carrossel de Dicas */}
      <div className="relative z-10">
        <WellnessCarousel />
      </div>
    </section>
  );
}
