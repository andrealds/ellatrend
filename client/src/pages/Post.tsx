import { useParams, Link } from "wouter";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedLikeButton } from "@/components/ui/animated-like-button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Calendar, Eye, Heart, Share2 } from "lucide-react";
import { marked } from "marked";
import { useStaticData } from "@/hooks/useStaticData";
import { useCachedSingleArticleStats } from "@/hooks/useCachedSingleArticleStats";

export default function Post() {
  const { slug } = useParams();

  const { data: artigosDataBeleza, loading: loadingArtigosBeleza, error: errorArtigosBeleza } = useStaticData<{ artigos: any[] }>('artigos-beleza');
  const { data: artigosDataSaude, loading: loadingArtigosSaude, error: errorArtigosSaude } = useStaticData<{ artigos: any[] }>('artigos-saude-mental');
  const { data: artigosDataAlimentacao, loading: loadingArtigosAlimentacao, error: errorArtigosAlimentacao } = useStaticData<{ artigos: any[] }>('artigos-alimentacao');

  // Garantir que a página sempre carregue do topo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Combinar artigos de beleza, saúde mental e alimentação
  const allArtigos = [
    ...(artigosDataBeleza?.artigos || []),
    ...(artigosDataSaude?.artigos || []),
    ...(artigosDataAlimentacao?.artigos || [])
  ];

  // Encontrar o post pelo slug
  const post = allArtigos.find(p => p.slug === slug);
  
  const loading = loadingArtigosBeleza || loadingArtigosSaude || loadingArtigosAlimentacao;
  const error = errorArtigosBeleza || errorArtigosSaude || errorArtigosAlimentacao;

  // Hook para gerenciar estatísticas do artigo (com cache)
  const { stats, loading: statsLoading, incrementViews, toggleLike } = useCachedSingleArticleStats(post?.id || slug || '');

  // Incrementar visualizações quando o post for carregado (apenas uma vez por usuário)
  useEffect(() => {
    if (post && !statsLoading) {
      incrementViews();
    }
  }, [post, statsLoading, incrementViews]);

  // Função para misturar artigos de forma aleatória baseada na data
  const shuffleArray = <T,>(array: T[], seed?: number): T[] => {
    const shuffled = [...array];
    const randomSeed = seed || Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // Muda a cada dia
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor((randomSeed + i) % (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Gerar recomendações dinâmicas baseadas na categoria
  const getRecomendacoes = () => {
    if (!post) return [];

    const categoriaAtual = post.categoria;
    
    // Filtrar artigos da mesma categoria, excluindo o artigo atual
    const artigosCategoria = allArtigos.filter(artigo => 
      artigo.categoria === categoriaAtual && 
      artigo.slug !== post.slug
    );

    // Se não houver artigos da categoria, pegar de outras categorias
    const artigosParaRecomendar = artigosCategoria.length > 0 
      ? artigosCategoria 
      : allArtigos.filter(artigo => artigo.slug !== post.slug);

    // Criar seed baseado na data atual
    const today = new Date().toDateString();
    const dataHash = today.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);

    // Selecionar 3 artigos aleatórios baseados na data
    return shuffleArray(artigosParaRecomendar, dataHash).slice(0, 3);
  };

  const artigosRecomendados = getRecomendacoes();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-300 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Não Encontrado</h1>
              <p className="text-gray-600">O post que você está procurando não existe ou foi removido.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Converter o conteúdo Markdown para HTML
  const contentHtml = marked(post.conteudo?.introducao || post.conteudo || '');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <style>{`
        /* Animação de Fade In e Subida */
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

        /* Classe para aplicar a animação */
        .fade-in-up {
          animation: fadeInUp 0.7s ease-out forwards;
          opacity: 0; /* Começa invisível */
        }

        /* Atrasos para os elementos */
        .header-animate { animation-delay: 0s; }
        .image-animate { animation-delay: 0.2s; }
        .content-animate { animation-delay: 0.4s; }
        .related-card-1 { animation-delay: 0.6s; }
        .related-card-2 { animation-delay: 0.8s; }
        .related-card-3 { animation-delay: 1.0s; }
      `}</style>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-8 pt-8 sm:pt-20 relative">
        <article>
          {/* Header - FORA do card */}
          <header className="mb-8 fade-in-up header-animate">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary" className="text-sm px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200">{post.categoria || 'Artigo'}</Badge>
              {post.tag && (
                <Badge variant="outline" className="text-sm px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200">{post.tag}</Badge>
              )}
              {post.destaque && <Badge variant="default" className="text-sm px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white">Destaque</Badge>}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.titulo}
            </h1>
            
            {(post.resumo || post.descricao) && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.resumo || post.descricao}
              </p>
            )}
            
            <div className="border-b border-gray-200 pb-6">
              {/* Layout flexível para desktop e mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Primeira linha - Data, Visualizações, Curtidas */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post.dataPublicacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>{stats.views.toLocaleString()} visualizações</span>
                  </div>
                  <AnimatedCounter
                    count={stats.likes}
                    label="curtidas"
                    icon={<Heart className="h-4 w-4" />}
                  />
                  {post.autor && (
                    <div className="flex items-center space-x-2 text-sm sm:text-base text-gray-500">
                      <span className="text-gray-500">Por:</span>
                      <span className="font-medium text-gray-700">{post.autor}</span>
                    </div>
                  )}
                </div>
                
                {/* Segunda linha - Botão de Like Animado */}
                <div className="flex items-center gap-4">
                  <AnimatedLikeButton
                    isLiked={stats.userLiked}
                    likes={stats.likes}
                    onClick={toggleLike}
                    disabled={statsLoading}
                  />
                </div>
                
                {/* Botão Compartilhar */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="self-start sm:self-auto"
                  onClick={() => {
                    if (navigator.share) {
                      // Usar Web Share API se disponível (mobile)
                      navigator.share({
                        title: post.titulo,
                        text: post.descricao || post.resumo || '',
                        url: window.location.href
                      }).catch(console.error);
                    } else {
                      // Fallback para desktop - copiar URL
                      navigator.clipboard.writeText(window.location.href).then(() => {
                        // Mostrar feedback visual temporário
                        const button = document.querySelector('[data-share-button]') as HTMLButtonElement;
                        if (button) {
                          const originalText = button.innerHTML;
                          button.innerHTML = '<svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Copiado!';
                          button.classList.add('bg-green-50', 'text-green-700', 'border-green-200');
                          setTimeout(() => {
                            button.innerHTML = originalText;
                            button.classList.remove('bg-green-50', 'text-green-700', 'border-green-200');
                          }, 2000);
                        }
                      }).catch(() => {
                        // Fallback final - mostrar URL em alert
                        alert(`Compartilhe este artigo:\n${window.location.href}`);
                      });
                    }
                  }}
                  data-share-button
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {(post.imagemDestaque || post.imagem) && (
            <div className="mb-8 fade-in-up image-animate">
              <img
                src={post.imagemDestaque || post.imagem}
                alt={post.titulo}
                className="w-full h-96 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          )}

          {/* Card com conteúdo do artigo - APENAS o texto */}
          <Card className="bg-white p-6 sm:p-10 rounded-2xl shadow-lg mb-12 fade-in-up content-animate">
            <CardContent className="p-0">
              {/* Content */}
              <div 
                className="text-lg text-gray-800 leading-relaxed space-y-6 max-w-none
                  [&>p]:mb-6 [&>p]:leading-relaxed
                  [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4
                  [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mt-8 [&>h3]:mb-4
                  [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-600 [&>blockquote]:my-8 [&>blockquote]:border-l-4 [&>blockquote]:border-pink-500
                  [&>ul]:list-disc [&>ul]:list-inside [&>ul]:space-y-3 [&>ul]:pl-2 [&>ul]:mb-6 [&>ul]:text-black [&>ul>li]:text-black [&>ul>li]:!text-black
                  [&>li]:mb-2 [&>strong]:font-semibold [&>strong]:text-gray-900"
                dangerouslySetInnerHTML={{ __html: contentHtml }} 
              />
            </CardContent>
          </Card>

          {/* Artigos Relacionados */}
          {artigosRecomendados.length > 0 && (
            <section className="max-w-5xl mx-auto mt-16 px-4">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                Você também pode gostar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {artigosRecomendados.map((artigo, index) => (
                  <Link 
                    key={artigo.slug} 
                    to={`/artigo/${artigo.slug}`} 
                    className={`group bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 fade-in-up related-card-${index + 1}`}
                  >
                    <img 
                      src={artigo.imagemDestaque || artigo.imagem || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"} 
                      alt={artigo.titulo} 
                      className="w-full h-48 object-cover" 
                    />
                    <div className="p-5">
                      <span className="text-sm font-semibold text-pink-600">
                        {artigo.categoria}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-800 mt-1 group-hover:text-pink-500 transition-colors line-clamp-2">
                        {artigo.titulo}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
