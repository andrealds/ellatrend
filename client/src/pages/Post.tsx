import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Heart, Share2, ExternalLink } from "lucide-react";
import { PostWithDetails } from "@/types";
import { marked } from "marked";

export default function Post() {
  const { slug } = useParams();

  const { data: post, isLoading, error } = useQuery<PostWithDetails>({
    queryKey: [`/api/posts/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
  const contentHtml = marked(post.content);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article>
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary">{post.type}</Badge>
              {post.isFeatured && <Badge variant="default">Destaque</Badge>}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {post.publishedAt 
                      ? new Date(post.publishedAt).toLocaleDateString('pt-BR')
                      : new Date(post.createdAt).toLocaleDateString('pt-BR')
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>{post.viewCount.toLocaleString()} visualizações</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4" />
                  <span>{post.likeCount} curtidas</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
          </div>

          {/* Call to Action */}
          <Card className="bg-primary text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Achou útil?</h3>
                  <p className="text-blue-100">Confira nossas últimas ofertas e comparações</p>
                </div>
                <Button variant="outline" className="text-primary border-white hover:bg-white">
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
