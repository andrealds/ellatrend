import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";
import { PostWithDetails } from "@/types";
import { Category } from "@shared/schema";
import { Link } from "wouter";

export default function CategoryPage() {
  const { slug } = useParams();

  // Buscar detalhes da categoria
  const { data: categories } = useQuery<Category[]>({
    queryKey: [`/api/categories`],
    enabled: !!slug,
  });

  const category = categories?.find((cat: Category) => cat.slug === slug);

  let postsQueryKey: string[] = [];
  let postsEnabled: boolean = false;

  if (slug === 'comparatives') {
    postsQueryKey = [`/api/posts?status=PUBLISHED&type=COMPARISON`];
    postsEnabled = true;
  } else if (category) {
    postsQueryKey = [`/api/posts?status=PUBLISHED&categoryId=${category.id}`];
    postsEnabled = true;
  }

  const { data: posts, isLoading } = useQuery<PostWithDetails[]>({
    queryKey: postsQueryKey,
    enabled: postsEnabled,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {category?.icon && (
              <span className="text-4xl" style={{ color: category.color || '#000' }}>{category.icon}</span>
            )}
            <h1 className="text-3xl font-bold" style={{ color: category?.color || '#000' }}>
              {category?.name || (slug === 'comparatives' ? 'Todos os Comparativos' : slug)}
            </h1>
          </div>
          {category?.description && (
            <p className="text-xl text-gray-600">
              {category.description}
            </p>
          )}
        </div>

        {isLoading ? (
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
        ) : posts && posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="card-hover">
                <div className="relative">
                  {post.featuredImage && (
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">{post.type}</Badge>
                  </div>
                  {post.isFeatured && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="default">Destaque</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {post.publishedAt 
                            ? new Date(post.publishedAt).toLocaleDateString('pt-BR')
                            : new Date(post.createdAt).toLocaleDateString('pt-BR')
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.viewCount.toLocaleString()} visualizações</span>
                      </div>
                    </div>
                  </div>
                  <Link to={`/post/${post.slug}`}>
                    <Button className="w-full">Ler Mais</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum post encontrado
              </h2>
              <p className="text-gray-600">
                Ainda não há posts nesta categoria.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
