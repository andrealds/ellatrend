import React, { useState, useRef } from 'react';
import { Heart } from 'lucide-react';
import { Button } from './button';

interface AnimatedLikeButtonProps {
  isLiked: boolean;
  likes: number;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export const AnimatedLikeButton: React.FC<AnimatedLikeButtonProps> = ({
  isLiked,
  likes,
  onClick,
  disabled = false,
  className = ''
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    if (!disabled && !isAnimating) {
      setIsAnimating(true);
      setShowPlusOne(true);
      onClick();
      
      // Reset animation after duration
      setTimeout(() => {
        setIsAnimating(false);
        setShowPlusOne(false);
      }, 600);
    }
  };

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant={isLiked ? "default" : "outline"}
        size="sm"
        onClick={handleClick}
        disabled={disabled || isAnimating}
        className={`transition-all duration-200 relative overflow-hidden ${
          isLiked 
            ? 'bg-pink-500 hover:bg-pink-600 text-white border-pink-500' 
            : 'bg-gray-800/20 backdrop-blur-md hover:bg-gray-800/30 text-gray-800 border-gray-300'
        } ${isAnimating ? 'scale-105' : ''} ${className}`}
      >
        <Heart 
          className={`h-4 w-4 mr-2 transition-all duration-200 ${
            isLiked ? 'fill-current' : ''
          } ${isAnimating ? 'scale-125' : ''}`} 
        />
        {disabled ? 'Carregando...' : (isLiked ? 'Curtido' : 'Curtir')}
        
        {/* Animação +1 */}
        {showPlusOne && (
          <div 
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 pointer-events-none"
            style={{
              animation: 'plusOneAnimation 0.6s ease-out forwards'
            }}
          >
            <span className="text-blue-500 font-bold text-sm">+1</span>
          </div>
        )}
      </Button>
      
      {/* CSS para animação +1 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes plusOneAnimation {
            0% {
              opacity: 1;
              transform: translate(-50%, 0) scale(1);
            }
            50% {
              opacity: 1;
              transform: translate(-50%, -10px) scale(1.1);
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
