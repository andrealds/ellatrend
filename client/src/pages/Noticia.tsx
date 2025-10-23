import { useParams } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Heart, Share2, ExternalLink, ChevronRight, Clock, Tag } from "lucide-react";
import { marked } from "marked";
import { useStaticData } from "@/hooks/useStaticData";
import { Noticia } from "@/types/noticias";
import { Link } from "wouter";

export default function NoticiaPage() {
  const { slug } = useParams();

  const { data, loading, error } = useStaticData<{ noticias: Noticia[] }>('noticias');

  // Encontrar a notícia pelo slug
  const noticia = data?.noticias.find(n => n.slug === slug);

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

  if (error || !noticia) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <Card>
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Notícia Não Encontrada</h1>
              <p className="text-gray-600">A notícia que você está procurando não existe ou foi removida.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  // Converter o conteúdo Markdown para HTML
  const contentHtml = marked(noticia.conteudo);

  // Buscar notícias relacionadas (mesma categoria, excluindo a atual)
  const noticiasRelacionadas = data?.noticias
    .filter(n => n.categoria === noticia.categoria && n.id !== noticia.id)
    .slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <article>
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary">{noticia.categoria}</Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {noticia.tag}
              </Badge>
              {noticia.destaque && <Badge variant="default">Destaque</Badge>}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {noticia.titulo}
            </h1>
            
            {noticia.descricao && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {noticia.descricao}
              </p>
            )}
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(noticia.dataPublicacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>{noticia.visualizacoes.toLocaleString()} visualizações</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>{noticia.curtidas} curtidas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{noticia.tempo}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Por {noticia.autor}</span>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {noticia.imagem && (
            <div className="mb-8">
              <img
                src={noticia.imagem}
                alt={noticia.titulo}
                className="w-full h-96 object-cover rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>

          {/* Notícias Relacionadas */}
          {noticiasRelacionadas.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Notícias Relacionadas</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {noticiasRelacionadas.map((relacionada) => (
                  <Card key={relacionada.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="aspect-video">
                      <img
                        src={relacionada.imagem}
                        alt={relacionada.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">{relacionada.categoria}</Badge>
                        <span className="text-xs text-gray-500">{relacionada.tempo}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relacionada.titulo}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {relacionada.descricao}
                      </p>
                      <Link to={`/noticia/${relacionada.slug}`}>
                        <Button variant="outline" size="sm" className="w-full">
                          Ler mais
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Gostou da notícia?</h3>
                  <p className="text-blue-100">Fique por dentro das últimas novidades em tecnologia</p>
                </div>
                <Button variant="outline" className="text-primary border-white hover:bg-white transition-colors duration-300">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver Mais Notícias
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
