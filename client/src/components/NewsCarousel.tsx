import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, TrendingUp, Play, Pause } from 'lucide-react';
import { useStaticData } from '@/hooks/useStaticData';
import { Artigo } from '@/types/artigos';
import { Link } from 'wouter';

const WellnessCarousel = () => {
  const { data: artigosData, loading } = useStaticData<{ artigosCarrossel: Artigo[] }>('artigos-por-horario');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Usar artigos específicos do carrossel
  const artigosDestaque = artigosData?.artigosCarrossel || [];

  useEffect(() => {
    if (!isAutoPlay || artigosDestaque.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % artigosDestaque.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, artigosDestaque.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % artigosDestaque.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + artigosDestaque.length) % artigosDestaque.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Funções para controle por gestos (apenas mobile)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrev();
    }
  };

  if (loading) {
    return (
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (artigosDestaque.length === 0) {
    return null;
  }

  const currentArtigo = artigosDestaque[currentIndex];

  return (
    <div className="w-full py-2 sm:py-6 lg:py-8 relative">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Dicas em Destaque
            </h2>
            <p className="text-gray-600 flex items-center gap-2 hidden sm:flex">
              <TrendingUp size={18} />
              Dicas de beleza, bem-estar e alimentação
            </p>
          </div>
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="px-4 py-2 rounded-lg bg-gray-800/20 backdrop-blur-md hover:bg-gray-800/30 transition-colors text-sm font-medium text-gray-800 flex items-center gap-2"
          >
            {isAutoPlay ? <Pause size={16} /> : <Play size={16} />}
            {isAutoPlay ? 'Pausar' : 'Reproduzir'}
          </button>
        </div>

        {/* Main Carousel */}
        <div className="relative">
          <div 
            className="relative h-[395px] sm:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Artigo Item */}
            <div className="absolute inset-0">
              <img
                src={currentArtigo.imagemDestaque}
                alt={currentArtigo.titulo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1553530666-ba11a7ef3b44?w=1200&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              
              {/* Content */}
              <Link to={`/artigo/${currentArtigo.slug}`} className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 md:pr-20 md:pl-20 text-white cursor-pointer">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary rounded-full text-xs font-semibold">
                      {currentArtigo.tag}
                    </span>
                    <span className="text-sm opacity-90">{currentArtigo.categoria}</span>
                    <span className="flex items-center gap-1 text-sm opacity-90">
                      <Clock size={14} />
                      {currentArtigo.tempoLeitura}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl sm:text-4xl font-bold mb-4 leading-tight">
                    {currentArtigo.titulo}
                  </h3>
                  
                  <p className="text-lg mb-6 opacity-90 leading-relaxed">
                    {currentArtigo.descricao}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-3 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hidden sm:block">
                      Ler artigo completo
                    </button>
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md hidden md:flex items-center justify-center hover:bg-white/30 transition-colors z-20"
            >
              <ChevronLeft className="text-white" size={20} />
            </button>
            
            <button
              onClick={goToNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-md hidden md:flex items-center justify-center hover:bg-white/30 transition-colors z-20"
            >
              <ChevronRight className="text-white" size={20} />
            </button>

            {/* Progress Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {artigosDestaque.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-1 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'w-8 bg-white' 
                      : 'w-1 bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
            {artigosDestaque.map((item, index) => (
              <Link
                key={item.id}
                to={`/artigo/${item.slug}`}
                className={`relative group overflow-hidden rounded-xl transition-all cursor-pointer ${
                  index === currentIndex 
                    ? 'ring-4 ring-pink-500 scale-105' 
                    : 'hover:scale-105'
                }`}
                onClick={() => {
                  // Scroll para o topo apenas no mobile
                  if (window.innerWidth <= 768) {
                    setTimeout(() => {
                      window.scrollTo(0, 0);
                      document.documentElement.scrollTop = 0;
                      document.body.scrollTop = 0;
                    }, 100);
                  }
                }}
              >
                <div className="aspect-video">
                  <img
                    src={item.imagemDestaque}
                    alt={item.titulo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1553530666-ba11a7ef3b44?w=1200&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-white text-xs font-bold line-clamp-2 drop-shadow-lg">
                        {item.titulo}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessCarousel;
