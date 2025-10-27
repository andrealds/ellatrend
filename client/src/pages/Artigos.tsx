import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Star, Filter, Apple } from "lucide-react";
import { useStaticData } from "@/hooks/useStaticData";
import { ArtigoUniversal } from "@/types/artigos";
// import FilterBar from "@/components/beleza/FilterBar";
import Pagination from "@/components/beleza/Pagination";
import AdSpace from "@/components/beleza/AdSpace";

export default function Artigos() {
  const { data, loading, error } = useStaticData<{ artigos: Artigo[] }>("todos-os-artigos");
  const [activeFilter, setActiveFilter] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 12;

  // Scroll para o topo quando a página carregar
  useEffect(() => {
    // Scroll instantâneo para garantir que funcione no mobile
    window.scrollTo(0, 0);
    // Força o scroll para o topo
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  // CSS para animações
  const animationStyles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-fade-in-up {
      animation: fadeInUp 0.6s ease-out;
    }
  `;

  // Definir filtros disponíveis
  const filters = [
    {
      id: 'todos',
      label: 'Todos',
      icon: (isActive: boolean) => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      )
    },
    {
      id: 'beleza',
      label: 'Beleza',
      icon: (isActive: boolean) => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
        </svg>
      )
    },
    {
      id: 'saude-mental',
      label: 'Saúde Mental',
      icon: (isActive: boolean) => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      )
    },
    {
      id: 'alimentacao',
      label: 'Alimentação',
      icon: (isActive: boolean) => (
        <Apple className="w-5 h-5" />
      )
    }
  ];

  // Filtrar artigos baseado no filtro ativo
  const filteredArtigos = useMemo(() => {
    if (!data?.artigos) return [];
    
    let filtered = data.artigos;
    
    switch (activeFilter) {
      case 'beleza':
        filtered = data.artigos.filter(artigo => artigo.categoria === 'Beleza');
        break;
      case 'saude-mental':
        filtered = data.artigos.filter(artigo => artigo.categoria === 'Saúde Mental');
        break;
      case 'alimentacao':
        filtered = data.artigos.filter(artigo => artigo.categoria === 'Alimentação');
        break;
      default:
        filtered = data.artigos;
    }
    
    // Ordenar por data de publicação (mais recentes primeiro)
    return filtered.sort((a, b) => new Date(b.dataPublicacao).getTime() - new Date(a.dataPublicacao).getTime());
  }, [data?.artigos, activeFilter]);

  // Calcular paginação
  const totalPages = Math.ceil(filteredArtigos.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArtigos = filteredArtigos.slice(startIndex, endIndex);

  // Resetar página quando mudar filtro
  const handleMatchChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    // Scroll instantâneo para mobile, suave para desktop
    if (window.innerWidth <= 768) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Scroll para o topo quando mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll instantâneo para mobile, suave para desktop
    if (window.innerWidth <= 768) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded mb-8"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm">
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-300 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-red-600">Erro ao carregar artigos. Por favor, tente novamente mais tarde.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{animationStyles}</style>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl lg:text-5xl font-serif font-light text-gray-900">Ella</span>
            <span className="text-4xl lg:text-5xl font-bold text-gray-900 ml-2">Trend</span>
            <span className="text-4xl lg:text-5xl font-bold text-gray-900 ml-2">Artigos</span>
          </div>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Explore todos os nossos artigos sobre beleza, saúde mental e alimentação. 
            Encontre dicas, técnicas e recursos para melhorar seu bem-estar.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center items-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleMatchChange(filter.id)}
                onTouchStart={(e) => {
                  // Prevenir evento duplo no mobile
                  if (window.innerWidth <= 768) {
                    e.preventDefault();
                    handleMatchChange(filter.id);
                  }
                }}
                className={`transition-all duration-300 ease-in-out py-3 px-6 sm:py-3 sm:px-8 rounded-full font-semibold flex items-center gap-2 text-sm sm:text-base min-h-[44px] ${
                  activeFilter === filter.id
                    ? 'bg-gray-800 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                }`}
              >
                {filter.icon(activeFilter === filter.id)}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="mb-6 text-center">
          <p className="text-gray-600">
            Mostrando {filteredArtigos.length} artigo{filteredArtigos.length !== 1 ? 's' : ''} 
            {activeFilter !== 'todos' && ` em ${filters.find(f => f.id === activeFilter)?.label}`}
          </p>
        </div>

        {/* Grid de Artigos */}
        <div key={activeFilter} className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8 animate-in fade-in-0 duration-300">
          {currentArtigos.map((artigo, index) => (
            <Card 
              key={artigo.id} 
              className="card-hover overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out opacity-0 translate-y-4 animate-fade-in-up"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <div className="relative aspect-video">
                {artigo.imagemDestaque ? (
                  <img
                    src={artigo.imagemDestaque}
                    alt={artigo.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="default" className="bg-primary">
                    {artigo.categoria || 'Artigo'}
                  </Badge>
                </div>
                {artigo.destaque && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge variant="destructive">Destaque</Badge>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                  {artigo.tempoLeitura || '5 min'}
                </div>
              </div>
              <CardContent className="p-6 bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {artigo.titulo}
                </h3>
                {artigo.descricao && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {artigo.descricao}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(artigo.dataPublicacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
                <Link to={`/artigo/${artigo.slug}`}>
                  <Button className="w-full bg-gray-800/20 backdrop-blur-md hover:bg-gray-800/30 transition-colors text-gray-800">
                    Ler Artigo
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Espaço para anúncios */}
        <div className="mb-8">
          <AdSpace />
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
