import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Play, Pause } from 'lucide-react';
import StoriesBackground from './StoriesBackground';
import { useStaticData } from '@/hooks/useStaticData';
import { StoriesData } from '@/types/stories';

const WellnessStories = () => {
  // Carregar dados dos stories dos arquivos JSON
  const { data: storiesModa } = useStaticData<StoriesData>('stories-moda');
  const { data: storiesBeleza } = useStaticData<StoriesData>('stories-beleza');
  const { data: storiesAlimentacao } = useStaticData<StoriesData>('stories-alimentacao');
  const { data: storiesSaudeMental } = useStaticData<StoriesData>('stories-saude-mental');
  

  // Combinar todos os stories em uma estrutura unificada
  const stories = [
    {
      id: 1,
      category: 'Moda',
      title: 'Moda',
      stories: storiesModa?.stories || [],
      color: 'from-pink-400 to-rose-500',
      backgroundImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop'
    },
    {
      id: 2,
      category: 'Beleza',
      title: 'Maquiagem',
      stories: storiesBeleza?.stories || [],
      color: 'from-purple-400 to-indigo-500',
      backgroundImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop'
    },
    {
      id: 3,
      category: 'Alimentação',
      title: 'Alimentação',
      stories: storiesAlimentacao?.stories || [],
      color: 'from-green-400 to-emerald-500',
      backgroundImage: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop'
    },
    {
      id: 4,
      category: 'Saúde Mental',
      title: 'Saúde Mental',
      stories: storiesSaudeMental?.stories || [],
      color: 'from-green-400 to-teal-500',
      backgroundImage: 'https://images.unsplash.com/photo-1502285396443-fa7ddf155eda?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1374'
    }
  ];

  const [activeCategory, setActiveCategory] = useState(0);
  const [activeStory, setActiveStory] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showStories, setShowStories] = useState(false);

  const STORY_DURATION = 5000;

  useEffect(() => {
    if (!showStories || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [showStories, activeStory, activeCategory, isPaused]);

  const nextStory = () => {
    const currentCategory = stories[activeCategory];
    if (activeStory < currentCategory.stories.length - 1) {
      setActiveStory(activeStory + 1);
      setProgress(0);
    } else if (activeCategory < stories.length - 1) {
      setActiveCategory(activeCategory + 1);
      setActiveStory(0);
      setProgress(0);
    } else {
      setShowStories(false);
      setProgress(0);
    }
  };

  const prevStory = () => {
    if (activeStory > 0) {
      setActiveStory(activeStory - 1);
      setProgress(0);
    } else if (activeCategory > 0) {
      setActiveCategory(activeCategory - 1);
      const prevCategory = stories[activeCategory - 1];
      setActiveStory(prevCategory.stories.length - 1);
      setProgress(0);
    }
  };

  const openStories = (index: number) => {
    setActiveCategory(index);
    setActiveStory(0);
    setProgress(0);
    setShowStories(true);
  };

  // Função para controle por toque nas bordas
  const handleTouch = (e: React.TouchEvent) => {
    const touchX = e.targetTouches[0].clientX;
    const screenWidth = window.innerWidth;
    const leftZone = screenWidth * 0.3; // 30% da tela para a esquerda
    const rightZone = screenWidth * 0.7; // 70% da tela para a direita

    if (touchX < leftZone) {
      prevStory();
    } else if (touchX > rightZone) {
      nextStory();
    }
  };


  const getStoryLabel = (title: string) => {
    if (title.includes('Como Combinar')) return 'Dica Express';
    if (title.includes('Proporção')) return 'Truque Infalível';
    if (title.includes('Guarda-Roupa de Gustão')) return 'Mudança de Estação';
    if (title.includes('Acessórios')) return 'Investimento Certo';
    if (title.includes('Erro que')) return 'Atenção!';
    if (title.includes('Arrume Seu')) return 'Organização';
    if (title.includes('Silhueta Ideal')) return 'Dica de Estilo';
    if (title.includes('Tecidos por Estação')) return 'Guia de Tecidos';
    if (title.includes('Investimento Inteligente')) return 'Smart Shopping';
    if (title.includes('Look Corporativo')) return 'Estilo Profissional';
    if (title.includes('Café da Manhã')) return 'Começo do Dia';
    if (title.includes('Hidratação')) return 'Bem-Estar';
    if (title.includes('Almoço')) return 'Refeição Principal';
    if (title.includes('Lanches')) return 'Snack Saudável';
    if (title.includes('Jantar')) return 'Final do Dia';
    if (title.includes('Planejamento')) return 'Organização';
    if (title.includes('Cozinha')) return 'Dicas Práticas';
    if (title.includes('Porções')) return 'Controle Alimentar';
    if (title.includes('Vegetais Coloridos')) return 'Variedade Nutritiva';
    if (title.includes('Proteínas Magras')) return 'Escolhas Saudáveis';
    if (title.includes('Grãos Integrais')) return 'Carboidratos Inteligentes';
    if (title.includes('Gorduras Saudáveis')) return 'Gorduras Boas';
    if (title.includes('Comer Consciente')) return 'Mindfulness';
    
    // Labels para artigos baseados no horário
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'Dica Matinal';
    } else if (hour >= 12 && hour < 18) {
      return 'Dica da Tarde';
    } else {
      return 'Dica Noturna';
    }
  };

  const renderStoryContent = (story: any) => {
    const content = story.content.replace('DICA: ', '');
    
    // Se tem imagem, usar layout original (texto na parte inferior sem card)
    if (story.image) {
      return null; // Não renderizar conteúdo aqui, será renderizado na parte inferior
    }
    
    // Se tem backgroundColor, usar layouts específicos do TechStories
    if (story.backgroundColor) {
      // Story 1: Como Combinar Estampas - Grid de dicas
      if (story.title.includes('Como Combinar')) {
      const tips = content.split('. ').filter((tip: string) => tip.trim());
      return (
        <div className="flex flex-col gap-3">
          {tips.map((tip: string, index: number) => (
            <div key={index} className="bg-white/15 backdrop-blur-xl border-2 border-white/25 rounded-2xl p-3 sm:p-5 flex items-center gap-3 sm:gap-4 hover:bg-white/20 transition-all duration-300">
              <div className="bg-white/25 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                {index === 0 ? '🎨' : index === 1 ? '📏' : index === 2 ? '⚖️' : '✨'}
              </div>
              <div className="text-white text-sm sm:text-base leading-relaxed">
                {tip.trim()}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Story 2: Proporção Perfeita - Dica grande centralizada
    if (story.title.includes('Proporção')) {
      return (
        <div className="flex flex-col justify-center">
          <div className="bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-6 sm:p-10 text-center">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-5">👔👖</div>
            <h3 className="text-white text-lg sm:text-2xl font-bold mb-3 sm:mb-4 uppercase tracking-wide">Regra de Ouro</h3>
            <p className="text-white/95 text-sm sm:text-base leading-relaxed mb-4 sm:mb-5">{content}</p>
            <div className="bg-white/25 backdrop-blur-md rounded-2xl p-3 sm:p-5 border border-white/40">
              <p className="text-white text-base sm:text-lg font-bold text-center">Oversized + Slim = Look Equilibrado</p>
            </div>
          </div>
        </div>
      );
    }

    // Story 3: Guarda-Roupa de Transição - Lista numerada
    if (story.title.includes('Guarda-Roupa de Transição')) {
      const steps = content.split('), ').filter((step: string) => step.trim());
      return (
        <div className="flex flex-col gap-3">
          {steps.map((step: string, index: number) => (
            <div key={index} className="bg-white/20 backdrop-blur-xl border-2 border-white/35 rounded-2xl p-4 hover:bg-white/25 transition-all duration-300">
              <div className="pt-1">
                <strong className="text-white text-base block mb-1 font-bold">
                  {step.split(' (')[0].replace(/^\d+/, '').trim()}
                </strong>
                <span className="text-white/90 text-sm leading-relaxed">
                  {step.split(' (')[1]?.replace(')', '') || ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Story 4: Acessórios Versáteis - Grid 2x2
    if (story.title.includes('Acessórios')) {
      const accessories = [
        { emoji: '👜', name: 'Bolsa Neutra', desc: 'Combina com tudo, todo dia' },
        { emoji: '👟', name: 'Tênis Branco', desc: 'Do casual ao elegante' },
        { emoji: '⌚', name: 'Relógio Clássico', desc: 'Atemporal e sofisticado' },
        { emoji: '🕶️', name: 'Óculos Aviador', desc: 'Nunca sai de moda' }
      ];
      return (
        <div className="grid grid-cols-2 gap-3">
          {accessories.map((item, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-6 text-center hover:bg-white/25 transition-all duration-300">
              <div className="text-4xl mb-3">{item.emoji}</div>
              <h3 className="text-white text-base font-bold mb-2">{item.name}</h3>
              <p className="text-white/90 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      );
    }

    // Story 5: Erro Comum - Alerta
    if (story.title.includes('Erro que')) {
      return (
        <div className="flex flex-col justify-center px-2">
          <div className="bg-white/15 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-4 sm:p-6 text-center max-w-full">
            <div className="text-5xl sm:text-7xl mb-3 sm:mb-5 animate-pulse">⚠️</div>
            <h3 className="text-white text-lg sm:text-2xl font-bold mb-3 sm:mb-5 uppercase tracking-wide">Evite Isso</h3>
            
            <div className="bg-black/20 rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
              <h4 className="text-white text-sm sm:text-base font-bold mb-2 flex items-center justify-center gap-2">
                ❌ NÃO FAÇA
              </h4>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                Usar calça de cintura baixa com top curto cria uma linha que corta sua silhueta
              </p>
            </div>

            <div className="bg-white/30 rounded-2xl p-3 sm:p-4">
              <h4 className="text-white text-sm sm:text-base font-bold mb-2 flex items-center justify-center gap-2">
                ✅ FAÇA ISSO
              </h4>
              <p className="text-white text-sm sm:text-base leading-relaxed font-semibold">
                Prefira cintura alta ou média para alongar as pernas e criar proporção
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Story 6: Organização - Checklist
    if (story.title.includes('Arrume Seu')) {
      const items = [
        'Separe por categoria (blusas, calças, vestidos)',
        'Use cabides iguais para visual limpo',
        'Organize por cores dentro de cada categoria',
        'Deixe peças mais usadas em fácil acesso',
        'Dobre malhas para não deformarem'
      ];
      return (
        <div className="flex flex-col gap-3">
          {items.map((item, index) => (
            <div key={index} className="bg-white/50 backdrop-blur-md border-2 border-white/60 rounded-2xl p-4 flex items-center gap-4 hover:bg-white/65 transition-all duration-300">
              <div className="w-7 h-7 rounded-lg bg-green-300/80 flex items-center justify-center text-lg flex-shrink-0 shadow-md">
                ✓
              </div>
              <div className="text-gray-800 text-base font-semibold leading-relaxed">
                {item}
              </div>
            </div>
          ))}
        </div>
      );
    }


    // Story 8: Silhueta Ideal - Dica grande centralizada
    if (story.title.includes('Silhueta Ideal')) {
      return (
        <div className="flex flex-col justify-center">
          <div className="bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-3xl p-6 sm:p-10 text-center">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-5">👗</div>
            <h3 className="text-white text-lg sm:text-2xl font-bold mb-3 sm:mb-4 uppercase tracking-wide">Dicas de Silhueta</h3>
            <p className="text-white/95 text-base sm:text-lg leading-relaxed mb-4 sm:mb-5">{content.replace('DICA: ', '')}</p>
          </div>
        </div>
      );
    }

    // Story 9: Tecidos por Estação - Grid de estações
    if (story.title.includes('Tecidos por Estação')) {
      const seasons = [
        { emoji: '🌸', name: 'Primavera', desc: 'Algodão, linho, seda leve' },
        { emoji: '☀️', name: 'Verão', desc: 'Viscose, modal, respiráveis' },
        { emoji: '🍂', name: 'Outono', desc: 'Lã, cashmere, veludo' },
        { emoji: '❄️', name: 'Inverno', desc: 'Lã pesada, alpaca, térmicos' }
      ];
      return (
        <div className="grid grid-cols-2 gap-3">
          {seasons.map((season, index) => (
            <div key={index} className="bg-white/20 backdrop-blur-xl border-2 border-white/30 rounded-2xl p-4 sm:p-6 text-center hover:bg-white/25 transition-all duration-300">
              <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{season.emoji}</div>
              <h3 className="text-white text-sm sm:text-base font-bold mb-2">{season.name}</h3>
              <p className="text-white/90 text-sm sm:text-base leading-relaxed">{season.desc}</p>
            </div>
          ))}
        </div>
      );
    }

    // Story 10: Investimento Inteligente - Lista numerada
    if (story.title.includes('Investimento Inteligente')) {
      const tips = content.split('. ').filter((tip: string) => tip.trim());
      return (
        <div className="flex flex-col gap-3">
          {tips.map((tip: string, index: number) => (
            <div key={index} className="bg-white/20 backdrop-blur-xl border-2 border-white/35 rounded-2xl p-3 sm:p-4 hover:bg-white/25 transition-all duration-300">
              <div className="pt-1">
                <strong className="text-white text-sm sm:text-base block mb-1 font-bold">
                  {tip.split(':')[0]}
                </strong>
                <span className="text-white/90 text-base leading-relaxed">
                  {tip.split(':')[1]?.trim() || tip.trim()}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Story 11: Look Corporativo - Lista de dicas
    if (story.title.includes('Look Corporativo')) {
      const tips = content.split(', ').filter((tip: string) => tip.trim());
      return (
        <div className="flex flex-col gap-3">
          {tips.map((tip: string, index: number) => (
            <div key={index} className="bg-white/20 backdrop-blur-xl border-2 border-white/35 rounded-2xl p-3 sm:p-4 hover:bg-white/25 transition-all duration-300">
              <div className="pt-1">
                <span className="text-white text-base sm:text-lg leading-relaxed">
                  {tip.trim()}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

      // Layout padrão para outros stories com backgroundColor
      return (
        <div className="text-center">
          <div className="bg-white/15 backdrop-blur-xl border-2 border-white/25 rounded-2xl p-5">
            <p className="text-white text-base leading-relaxed">{content}</p>
          </div>
        </div>
      );
    }

    // Layout padrão para stories sem backgroundColor nem imagem
    return (
      <div className="text-center">
        <div className="bg-white/15 backdrop-blur-xl border-2 border-white/25 rounded-2xl p-5">
          <p className="text-white text-base leading-relaxed">{content}</p>
        </div>
      </div>
    );
  };

  if (!showStories) {
    return (
      <div className="pt-4 pb-8 sm:py-8 relative" style={{ background: 'linear-gradient(135deg, hsl(200, 50%, 85%) 0%, hsl(280, 40%, 90%) 25%, hsl(330, 30%, 92%) 50%, hsl(280, 40%, 90%) 75%, hsl(200, 50%, 85%) 100%)' }}>
        {/* Fundo decorativo */}
        <StoriesBackground />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-2 sm:mb-4">
              <span className="text-4xl lg:text-5xl" style={{ fontFamily: 'Dancing Script, cursive', color: '#581C87' }}>Ella</span>
              <span className="text-3xl lg:text-4xl font-bold text-purple-600 ml-2">Stories</span>
            </div>
            <p className="text-lg text-gray-600">Dicas de Beleza, Bem-estar e Desenvolvimento Pessoal</p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {stories.map((category, index) => (
              <button
                key={category.id}
                onClick={() => openStories(index)}
                className="flex-shrink-0 group cursor-pointer"
              >
                <div className={`w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${category.color} p-[2.5px] mb-3 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl`}>
                  <div className="bg-white p-[2px] rounded-full w-full h-full flex items-center justify-center">
                    {category.category === 'Beleza' && category.title === 'Maquiagem' ? (
                      <img 
                        src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80" 
                        alt="Produtos de Maquiagem" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : category.backgroundImage ? (
                      <img 
                        src={category.backgroundImage} 
                        alt={category.title} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-lg md:text-2xl">
                          {category.category === 'Beleza' ? '💄' : category.category === 'Saúde Mental' ? '🧠' : category.category === 'Alimentação' ? '🥗' : category.category === 'Desenvolvimento' ? '🌟' : '💋'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-center text-gray-800 text-sm md:text-base font-medium max-w-[80px] md:max-w-[140px] truncate">
                  {category.title}
                </p>
                <p className="text-center text-gray-600 text-xs md:text-sm">
                  {category.stories.length} {category.stories.length === 1 ? 'story' : 'stories'}
                </p>
              </button>
            ))}
          </div>

        </div>
      </div>
    );
  }

  const currentCategory = stories[activeCategory];
  const currentStory = currentCategory?.stories?.[activeStory];

  // Verificar se currentStory existe antes de renderizar
  if (!currentStory) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="text-white text-center">
          <p>Carregando stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div 
        className="relative w-full h-full max-w-md mx-auto"
        onTouchStart={handleTouch}
      >
        <div 
          key={`${activeCategory}-${activeStory}`}
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            background: currentStory.image ? `url(${currentStory.image})` : ((currentStory as any).backgroundColor || 'transparent'),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
        </div>

        {/* Progress Bar */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="flex gap-1">
            {currentCategory.stories.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: idx < activeStory ? '100%' : idx === activeStory ? `${progress}%` : '0%'
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Header com controles */}
        <div className="absolute top-16 right-4 z-10">
          <div className="flex gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="text-white/90 hover:text-white transition-colors"
            >
              {isPaused ? <Play size={24} /> : <Pause size={24} />}
            </button>
            <button
              onClick={() => setShowStories(false)}
              className="text-white/90 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Conteúdo com layouts específicos */}
        <div className="relative h-full flex flex-col px-4 sm:px-8 py-8 sm:py-16 overflow-y-auto">
          {/* Header com label e balão da categoria */}
          <div className="mb-4 sm:mb-8">
            {/* Balão com emoji da categoria - alinhado à esquerda */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${currentCategory.color} flex items-center justify-center`}>
                <span className="text-lg sm:text-xl">
                  {currentCategory.category === 'Beleza' ? '💄' : 
                   currentCategory.category === 'Saúde Mental' ? '🧠' : 
                   currentCategory.category === 'Alimentação' ? '🥗' : 
                   currentCategory.category === 'Desenvolvimento' ? '🌟' : '💋'}
                </span>
              </div>
              <div className="text-white">
                <p className="font-bold text-sm sm:text-base">{currentCategory.title}</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-block bg-white/20 backdrop-blur-md text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs font-bold uppercase tracking-wider border border-white/30 mb-3 sm:mb-4">
                {getStoryLabel(currentStory.title)}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                {currentStory.title}
              </h2>
            </div>
          </div>
          
          {/* Layout baseado no tipo de story */}
          <div className="flex-1 flex flex-col justify-center min-h-0">
            {renderStoryContent(currentStory)}
          </div>

          {/* Para stories com imagem, texto centralizado no meio da tela */}
          {currentStory.image && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <p className="text-lg sm:text-xl text-white leading-relaxed font-medium">
                  {currentStory.content.replace('DICA: ', '')}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Navegação - Ocultar no mobile */}
        <button
          onClick={prevStory}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 hidden sm:block"
          disabled={activeCategory === 0 && activeStory === 0}
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextStory}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 hidden sm:block"
        >
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  );
};

export default WellnessStories;
