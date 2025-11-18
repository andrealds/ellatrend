import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, LayoutGrid } from "lucide-react";
import { Link } from "wouter";
import { useStaticData } from "@/hooks/useStaticData";
import { useMultipleArticleStats } from "@/hooks/useMultipleArticleStats";
import { ArtigoUniversal } from "@/types";

export default function LatestArticles() {
  const { data, loading, error } = useStaticData<{ artigosConteudo: ArtigoUniversal[] }>("artigos-por-horario");

  // Filtrar apenas os artigos e limitar a 10
  const posts = data?.artigosConteudo.slice(0, 10) || [];
  
  // Buscar estatísticas reais dos artigos
  const artigoIds = posts.map(post => post.id);
  const { stats: articleStats, loading: statsLoading } = useMultipleArticleStats(artigoIds);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(10)].map((_, i) => (
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
        <p className="text-red-600">Erro ao carregar os artigos.</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Nenhum artigo disponível ainda.</p>
      </div>
    );
  }

  return (
    <section className="pt-4 pb-8 sm:py-8 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-2 sm:mb-4">
            <span className="text-4xl lg:text-5xl" style={{ fontFamily: 'Dancing Script, cursive', color: '#581C87' }}>Ella</span>
            <span className="text-3xl lg:text-4xl font-bold text-gray-900 ml-2">Conteúdo</span>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dicas exclusivas de beleza, bem-estar e alimentação.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              to={`/artigo/${post.slug}`} 
              className="block sm:block"
              onClick={() => {
                // Scroll para o topo apenas no mobile
                if (window.innerWidth <= 768) {
                  setTimeout(() => {
                    window.scrollTo(0, 0);
                    document.documentElement.scrollTop = 0;
                    document.body.scrollTop = 0;
                  }, 100);
                }
              }}
            >
              <Card className="card-hover overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
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
                    {post.categoria || 'Dica'}
                  </Badge>
                </div>
                {post.destaque && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge variant="destructive">Destaque</Badge>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm">
                  {post.tempoLeitura || '5 min leitura'}
                </div>
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>
                    {statsLoading 
                      ? '...' 
                      : (articleStats[post.id]?.views || 0).toLocaleString()
                    }
                  </span>
                </div>
              </div>
              <CardContent className="p-6 bg-white">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.titulo}
                </h3>
                {post.descricao && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.descricao}
                  </p>
                )}
                
                {/* Likes */}
                <div className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span className="font-medium">
                    {statsLoading 
                      ? '...' 
                      : (articleStats[post.id]?.likes || 0).toLocaleString()
                    }
                  </span>
                </div>
                
                <div className="hidden sm:block">
                  <Button className="w-full bg-gray-800/20 backdrop-blur-md hover:bg-gray-800/30 transition-colors text-gray-800">
                    Ler Artigo
                  </Button>
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/artigos">
            <Button size="lg" className="bg-gray-800/20 backdrop-blur-md hover:bg-gray-800/30 transition-colors text-gray-800">
              <LayoutGrid className="h-5 w-5 mr-2" />
              Ver Todos os Artigos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
