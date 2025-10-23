import React from 'react';

const StoriesBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Círculos flutuantes suaves */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full animate-float opacity-60"></div>
      <div className="absolute top-32 right-20 w-24 h-24 bg-gradient-to-br from-purple-200/25 to-pink-200/25 rounded-full animate-wave opacity-50"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-br from-green-200/15 to-teal-200/15 rounded-full animate-float opacity-40"></div>
      <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full animate-twinkle opacity-45"></div>
      <div className="absolute bottom-32 right-10 w-36 h-36 bg-gradient-to-br from-indigo-200/18 to-purple-200/18 rounded-full animate-wave opacity-35"></div>
      
      {/* Flores delicadas */}
      <div className="absolute top-20 right-1/4 opacity-30">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-300/40 to-rose-300/40 rounded-full animate-twinkle"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full animate-float"></div>
          <div className="absolute inset-4 bg-gradient-to-br from-pink-100/20 to-rose-100/20 rounded-full animate-wave"></div>
        </div>
      </div>
      
      <div className="absolute bottom-40 left-1/3 opacity-25">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300/35 to-cyan-300/35 rounded-full animate-float"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-blue-200/25 to-cyan-200/25 rounded-full animate-wave"></div>
          <div className="absolute inset-4 bg-gradient-to-br from-blue-100/15 to-cyan-100/15 rounded-full animate-twinkle"></div>
        </div>
      </div>
      
      <div className="absolute top-1/3 left-10 opacity-20">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 bg-gradient-to-br from-green-300/30 to-emerald-300/30 rounded-full animate-wave"></div>
          <div className="absolute inset-2 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full animate-float"></div>
        </div>
      </div>
      
      {/* Linhas orgânicas suaves */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800">
        <defs>
          <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#F0F9FF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3E8FF" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#FAF5FF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#F3E8FF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Linha curva 1 */}
        <path
          d="M 50 200 Q 300 100 600 150 T 1150 200"
          stroke="url(#lineGradient1)"
          strokeWidth="1.5"
          fill="none"
          className="animate-wave"
        />
        
        {/* Linha curva 2 */}
        <path
          d="M 100 400 Q 400 350 700 400 T 1100 450"
          stroke="url(#lineGradient2)"
          strokeWidth="1"
          fill="none"
          className="animate-float"
        />
        
        {/* Linha curva 3 */}
        <path
          d="M 0 600 Q 250 550 500 600 T 1000 650"
          stroke="url(#lineGradient1)"
          strokeWidth="0.8"
          fill="none"
          className="animate-twinkle"
        />
      </svg>
      
      {/* Pontos de luz delicados */}
      <div className="absolute top-16 left-1/2 w-2 h-2 bg-blue-300/40 rounded-full animate-twinkle"></div>
      <div className="absolute top-40 right-1/3 w-1.5 h-1.5 bg-purple-300/50 rounded-full animate-float"></div>
      <div className="absolute bottom-24 left-1/4 w-2.5 h-2.5 bg-green-300/35 rounded-full animate-wave"></div>
      <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-yellow-300/60 rounded-full animate-twinkle"></div>
      <div className="absolute bottom-40 right-1/2 w-1.5 h-1.5 bg-pink-300/45 rounded-full animate-float"></div>
    </div>
  );
};

export default StoriesBackground;
