import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Star, LayoutGrid } from "lucide-react";
import { Link } from "wouter";
import { useStaticData } from "@/hooks/useStaticData";
import { Comparativo } from "@/types/comparativos";

export default function LatestComparisons() {
  const { data, loading, error } = useStaticData<{ comparativos: Comparativo[] }>("comparativos");

  // Filtrar apenas os comparativos e limitar a 6
  const posts = data?.comparativos.slice(0, 6) || [];

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erro ao carregar os comparativos.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Nenhum comparativo disponível ainda.</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Últimos Comparativos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Análises detalhadas dos produtos mais populares, com testes práticos e recomendações baseadas em dados reais.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
          {posts.map((post) => (
            <Card key={post.id} className="card-hover overflow-hidden">
              <div className="relative aspect-video">
                {post.imagemDestaque ? (
                  <img
                    src={post.imagemDestaque}
                    alt={post.titulo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 z-10">
                  <Badge variant="default" className="bg-primary">
                    Comparativo
                  </Badge>
                </div>
                {post.destaque && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge variant="destructive">Destaque</Badge>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                  8 min leitura
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.titulo}
                </h3>
                {post.resumo && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.resumo}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(post.dataPublicacao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
                <Link to={`/post/${post.slug}`}>
                  <Button className="w-full">Ler Comparativo</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/comparativos">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              <LayoutGrid className="h-5 w-5 mr-2" />
              Ver Todos os Comparativos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
