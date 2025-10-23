import React from 'react';

interface AdSpaceProps {
  type: 'banner' | 'card' | 'sidebar';
  position: 'top' | 'middle' | 'bottom' | 'sidebar';
  size: 'small' | 'medium' | 'large';
  title?: string;
  description?: string;
  imageUrl?: string;
  ctaText?: string;
  ctaUrl?: string;
  sponsored?: boolean;
}

export default function AdSpace({ 
  type, 
  position, 
  size, 
  title = "Espaço Publicitário",
  description = "Anúncio patrocinado",
  imageUrl,
  ctaText = "Saiba Mais",
  ctaUrl = "#",
  sponsored = true
}: AdSpaceProps) {
  
  // Configurações de tamanho
  const sizeClasses = {
    small: 'h-24 md:h-32',
    medium: 'h-32 md:h-48',
    large: 'h-48 md:h-64'
  };

  // Configurações de tipo
  const typeClasses = {
    banner: 'w-full',
    card: 'w-full max-w-sm mx-auto',
    sidebar: 'w-full max-w-xs'
  };

  // Configurações de posição
  const positionClasses = {
    top: 'mb-8',
    middle: 'my-8',
    bottom: 'mt-8',
    sidebar: 'ml-4'
  };

  return (
    <div className={`${typeClasses[type]} ${positionClasses[position]} ${sponsored ? 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200' : 'bg-gray-100 border border-gray-200'} rounded-lg shadow-sm overflow-hidden`}>
      {/* Conteúdo do Banner */}
      {type === 'banner' && (
        <div className={`${sizeClasses[size]} flex items-center justify-center relative`}>
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 pr-20">{title}</h3>
              <p className="text-sm text-gray-600 mb-4">{description}</p>
              <a 
                href={ctaUrl}
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors w-full sm:w-auto"
              >
                {ctaText}
              </a>
            </div>
          )}
          
          {/* Badge Patrocinado */}
          {sponsored && (
            <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Patrocinado
            </div>
          )}
        </div>
      )}

      {/* Conteúdo do Card */}
      {type === 'card' && (
        <div className="p-6">
          <div className="flex items-start space-x-4">
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt={title}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 flex-1 mr-3">{title}</h3>
                {sponsored && (
                  <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium flex-shrink-0">
                    Patrocinado
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{description}</p>
              <a 
                href={ctaUrl}
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors w-full sm:w-auto text-center"
              >
                {ctaText}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo da Sidebar */}
      {type === 'sidebar' && (
        <div className="p-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h4 className="text-sm font-semibold text-gray-800 mb-1">{title}</h4>
            <p className="text-xs text-gray-600 mb-3">{description}</p>
            {sponsored && (
              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                Patrocinado
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


