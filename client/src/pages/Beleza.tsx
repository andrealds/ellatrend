import { useState, useMemo, useEffect } from "react";
import { useStaticData } from "@/hooks/useStaticData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Clock, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import Pagination from "@/components/beleza/Pagination";
import FilterBar from "@/components/beleza/FilterBar";
import AdSpace from "@/components/beleza/AdSpace";

interface Artigo {
  id: string;
  titulo: string;
  descricao: string;
  conteudo: string;
  imagemDestaque: string;
  autor: string;
  tempoLeitura: string;
  categoria: string;
  tag: string;
  slug: string;
  destaque: boolean;
  dataPublicacao: string;
  visualizacoes: number;
  curtidas: number;
  metaTitulo: string;
  metaDescricao: string;
  artigosRelacionados: string[];
}

export default function Beleza() {
  const { data, loading, error } = useStaticData<{ artigos: Artigo[] }>("artigos-beleza");

  // Garantir que a página sempre carregue do topo
  useEffect(() => {
    window.scrollTo(0, 0);
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
  
  // Estados para paginação e filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState('todos');
  const articlesPerPage = 9; // 3x3 grid

  // Lógica de filtros e paginação
  const paginationData = useMemo(() => {
    if (!data?.artigos) {
      return {
        paginatedArticles: [],
        totalPages: 0,
        totalArticles: 0
      };
    }

    // Aplicar filtros
    let filteredArticles = [...data.artigos];
    
    switch (activeFilter) {
      case 'todos':
        // Mostrar todos os artigos sem filtro
        filteredArticles = filteredArticles;
        break;
      case 'tendencias':
        // Filtrar apenas artigos em destaque
        filteredArticles = filteredArticles.filter(artigo => artigo.destaque === true);
        break;
      case 'mais-curtidos':
        // Ordenar por número de curtidas (decrescente)
        filteredArticles = filteredArticles.sort((a, b) => (b.curtidas || 0) - (a.curtidas || 0));
        break;
    }

    const totalArticles = filteredArticles.length;
    const totalPages = Math.ceil(totalArticles / articlesPerPage);
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);

    return {
      paginatedArticles,
      totalPages,
      totalArticles
    };
  }, [data?.artigos, currentPage, articlesPerPage, activeFilter]);

  // Função para mudar de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para mudar de filtro
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset para primeira página
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Erro ao carregar artigos de beleza. Por favor, tente novamente mais tarde.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{animationStyles}</style>
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0 pt-6 sm:py-2 sm:pt-12">
        <div className="mb-6">
          <div className="flex items-center justify-center mb-2 sm:mb-4">
            <span className="text-3xl lg:text-4xl font-serif font-light text-gray-900">Ella</span>
            <span className="text-3xl lg:text-4xl font-bold text-purple-600 ml-2">Trend</span>
            <span className="text-3xl lg:text-4xl font-bold text-gray-900 ml-2">Beleza</span>
          </div>
          <p className="text-xl text-gray-600 text-center">
            Dicas, tutoriais e produtos de beleza para realçar sua beleza natural.
          </p>
        </div>

        {/* Filtros */}
        <FilterBar 
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        {/* Banner Top */}
        <AdSpace 
          type="banner"
          position="top"
          size="medium"
          title="Descubra os Melhores Produtos de Beleza"
          description="Encontre ofertas exclusivas e produtos recomendados por especialistas"
          ctaText="Ver Ofertas"
          ctaUrl="/ofertas"
          sponsored={true}
        />

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : paginationData.paginatedArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in-0 duration-300">
            {paginationData.paginatedArticles.map((artigo, index) => (
              <Card 
                key={artigo.id} 
                className="shadow-lg hover:shadow-xl transition-all duration-500 ease-in-out opacity-0 translate-y-4 animate-fade-in-up"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="relative">
                  {artigo.imagemDestaque && (
                    <img
                      src={artigo.imagemDestaque}
                      alt={artigo.titulo}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-pink-500 text-white">
                      {artigo.categoria}
                    </Badge>
                  </div>
                  {artigo.destaque && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="destructive">Destaque</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {artigo.titulo}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {artigo.descricao}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(artigo.dataPublicacao).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{artigo.visualizacoes.toLocaleString()} visualizações</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{artigo.tempoLeitura}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Link to={`/artigo/${artigo.slug}`}>
                      <button className="px-4 py-2 rounded-lg bg-gray-800/20 backdrop-blur-md hover:bg-gray-800/30 transition-colors text-sm font-medium text-gray-800 flex items-center gap-2">
                        Ler artigo
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum artigo encontrado
              </h2>
              <p className="text-gray-600">
                Volte em breve para ver os últimos artigos de beleza.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Card Patrocinado */}
        {paginationData.paginatedArticles.length > 0 && (
          <AdSpace 
            type="card"
            position="middle"
            size="medium"
            title="Produtos Recomendados"
            description="Descubra os produtos de beleza mais populares e bem avaliados"
            imageUrl="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80"
            ctaText="Ver Produtos"
            ctaUrl="/produtos"
            sponsored={true}
          />
        )}

        {/* Paginação */}
        <div className="mb-8">
          <Pagination
            currentPage={currentPage}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
