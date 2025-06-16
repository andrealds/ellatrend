import { useParams } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Heart, Share2, ExternalLink, ChevronRight, Star } from "lucide-react";
import { marked } from "marked";
import { useStaticData } from "@/hooks/useStaticData";
import { Comparativo } from "@/types/comparativos";

export default function Post() {
  const { slug } = useParams();

  const { data, loading, error } = useStaticData<{ comparativos: Comparativo[] }>('comparativos');

  // Encontrar o comparativo pelo slug
  const post = data?.comparativos.find(p => p.slug === slug);

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
  const contentHtml = marked(post.conteudo.introducao);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <article>
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary">Comparativo</Badge>
              {post.destaque && <Badge variant="default">Destaque</Badge>}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.titulo}
            </h1>
            
            {post.resumo && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.resumo}
              </p>
            )}
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(post.dataPublicacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.visualizacoes.toLocaleString()} visualizações</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>{post.curtidas} curtidas</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.imagemDestaque && (
            <div className="mb-8">
              <img
                src={post.imagemDestaque}
                alt={post.titulo}
                className="w-full h-96 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>

          {/* Preços e Ofertas */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Preços e Ofertas</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {post.produtos.map((produto) => (
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
                      {Object.entries(produto.linksAfiliados).map(([loja, link]) => (
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

          {/* Seções de Produtos */}
          {post.conteudo.secoes.map((secao, index) => (
            <div key={index} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{secao.titulo}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {secao.produtos.map((produto, prodIndex) => (
                  <Card key={prodIndex} className="p-6 hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{produto.nome}</h3>
                    <ul className="space-y-2">
                      {produto.caracteristicas.map((caracteristica, charIndex) => (
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

          {/* Veredito */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Veredito</h2>
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-none shadow-lg">
              <CardContent className="p-8">
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">{post.conteudo.veredito.conclusao}</p>
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Recomendações</h3>
                  <div className="grid gap-4">
                    {post.conteudo.veredito.recomendacoes.map((recomendacao, index) => (
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

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Achou útil?</h3>
                  <p className="text-blue-100">Confira nossas últimas ofertas e comparações</p>
                </div>
                <Button variant="outline" className="text-primary border-white hover:bg-white transition-colors duration-300">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Ofertas
                </Button>
              </div>
            </CardContent>
          </Card>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
