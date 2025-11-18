import React, { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  count: number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  count,
  label,
  icon,
  className = ''
}) => {
  const [displayCount, setDisplayCount] = useState(count);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [previousCount, setPreviousCount] = useState(count);

  useEffect(() => {
    if (count > previousCount) {
      // Houve incremento, mostrar animação +1
      setShowPlusOne(true);
      setAnimationKey(prev => prev + 1);
      
      // Atualizar contador com animação
      setTimeout(() => {
        setDisplayCount(count);
        setPreviousCount(count);
      }, 100);
      
      // Esconder +1 após animação
      setTimeout(() => {
        setShowPlusOne(false);
      }, 800);
    } else if (count < previousCount) {
      // Houve decremento, atualizar sem animação
      setDisplayCount(count);
      setPreviousCount(count);
    }
  }, [count, previousCount]);

  return (
    <div className={`flex items-center space-x-2 relative ${className}`}>
      {icon}
      <div className="relative">
        <span className="transition-all duration-300">
          {displayCount.toLocaleString()} {label}
        </span>
        
        {/* Animação +1 na contagem */}
        {showPlusOne && (
          <div 
            key={`counter-plus-one-${animationKey}`}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 pointer-events-none z-10"
            style={{
              animation: 'counterPlusOne 0.8s ease-out forwards'
            }}
          >
            <span className="text-pink-500 font-bold text-base bg-white px-1 rounded shadow-sm">+1</span>
          </div>
        )}
      </div>
      
      {/* CSS para animação +1 da contagem */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes counterPlusOne {
            0% {
              opacity: 1;
              transform: translate(-50%, 0) scale(0.8);
            }
            20% {
              opacity: 1;
              transform: translate(-50%, -5px) scale(1.2);
            }
            50% {
              opacity: 1;
              transform: translate(-50%, -10px) scale(1.1);
            }
            80% {
              opacity: 0.7;
              transform: translate(-50%, -15px) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, -20px) scale(0.8);
            }
          }
        `
      }} />
    </div>
  );
};
