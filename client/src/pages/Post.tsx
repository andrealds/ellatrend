import { useParams } from "wouter";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Heart, Share2, ExternalLink, ChevronRight, Star } from "lucide-react";
import { marked } from "marked";
import { useStaticData } from "@/hooks/useStaticData";

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
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20 relative">
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
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-6 text-base text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(post.dataPublicacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.visualizacoes?.toLocaleString() || '0'} visualizações</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>{post.curtidas || '0'} curtidas</span>
                </div>
                {post.autor && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">Por:</span>
                    <span className="font-medium text-gray-700">{post.autor}</span>
                  </div>
                )}
              </div>
              
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
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

          {/* Banner Google Ads */}
          <div className="mb-12 flex justify-center">
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-md text-center">
              <div className="text-gray-500 text-sm mb-2">Publicidade</div>
              <div className="bg-white border border-gray-200 rounded p-4 h-32 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Google Ads Banner<br/>300x250</span>
              </div>
            </div>
          </div>

          {/* Preços e Ofertas */}
          {post.produtos && post.produtos.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Preços e Ofertas</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {post.produtos.map((produto: any) => (
                <Card key={produto.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{produto.nome}</h3>
                    <div className="flex items-baseline space-x-2 mb-6">
                      <span className="text-2xl font-bold text-primary">
                        R$ {parseFloat(produto.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        R$ {parseFloat(produto.precoOriginal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(produto.linksAfiliados).map(([loja, link]: [string, any]) => (
                        <a
                          key={loja}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <span className="font-medium capitalize">{loja}</span>
                          <ExternalLink className="h-4 w-4 text-gray-500" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          )}

          {/* Seções de Produtos */}
          {post.conteudo?.secoes && post.conteudo.secoes.length > 0 && (
            <>
              {post.conteudo.secoes.map((secao: any, index: number) => (
            <div key={index} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{secao.titulo}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {secao.produtos.map((produto: any, prodIndex: number) => (
                  <Card key={prodIndex} className="p-6 hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{produto.nome}</h3>
                    <ul className="space-y-2">
                      {produto.caracteristicas.map((caracteristica: any, charIndex: number) => (
                        <li key={charIndex} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span className="text-gray-600">{caracteristica}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>
          ))}
            </>
          )}

          {/* Veredito */}
          {post.conteudo?.veredito && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Veredito</h2>
              <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none shadow-lg">
                <CardContent className="p-8">
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">{post.conteudo.veredito.conclusao}</p>
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Recomendações</h3>
                    <div className="grid gap-4">
                      {post.conteudo.veredito.recomendacoes.map((recomendacao: any, index: number) => (
                      <div 
                        key={index} 
                        className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Star className="h-5 w-5 text-primary" />
                            <p className="font-medium text-gray-900">{recomendacao.perfil}</p>
                          </div>
                          <p className="text-gray-600 pl-7">{recomendacao.produto}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Artigos Relacionados */}
          <section className="max-w-5xl mx-auto mt-16 px-4">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Você também pode gostar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card de Artigo Relacionado 1 */}
              <a href="#" className="group bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 fade-in-up related-card-1">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" alt="Artigo 1" className="w-full h-48 object-cover" />
                <div className="p-5">
                  <span className="text-sm font-semibold text-pink-600">Alimentação</span>
                  <h3 className="text-lg font-semibold text-gray-800 mt-1 group-hover:text-pink-500 transition-colors">
                    Smoothie Verde Energético: Receita que Acelera o Metabolismo
                  </h3>
                </div>
              </a>

              {/* Card de Artigo Relacionado 2 */}
              <a href="#" className="group bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 fade-in-up related-card-2">
                <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80" alt="Artigo 2" className="w-full h-48 object-cover" />
                <div className="p-5">
                  <span className="text-sm font-semibold text-pink-600">Beleza</span>
                  <h3 className="text-lg font-semibold text-gray-800 mt-1 group-hover:text-pink-500 transition-colors">
                    5 Dicas para Cabelos Mais Saudáveis e Brilhantes
                  </h3>
                </div>
              </a>

              {/* Card de Artigo Relacionado 3 */}
              <a href="#" className="group bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 fade-in-up related-card-3">
                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&q=80" alt="Artigo 3" className="w-full h-48 object-cover" />
                <div className="p-5">
                  <span className="text-sm font-semibold text-pink-600">Desenvolvimento</span>
                  <h3 className="text-lg font-semibold text-gray-800 mt-1 group-hover:text-pink-500 transition-colors">
                    Rotina Matinal para Mulheres Produtivas: 7 Hábitos que Transformam o Dia
                  </h3>
                </div>
              </a>

            </div>
          </section>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
