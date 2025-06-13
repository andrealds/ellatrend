import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Bookmark } from "lucide-react";
import { PostWithDetails } from "@/types";
import { Link } from "wouter";

export default function HeroSection() {
  const { data: featuredPosts } = useQuery<PostWithDetails[]>({
    queryKey: ["/api/posts?status=PUBLISHED&featured=true&limit=1"],
  });

  const featuredPost = featuredPosts?.[0];

  if (!featuredPost) {
    return (
      <section className="gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Bem-vindo ao TecReview
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-8 max-w-2xl mx-auto">
              Sua fonte confiável para análises de tecnologia, comparativos e as melhores ofertas.
            </p>
            <Link to="/deals">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Explorar Ofertas
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="gradient-bg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="secondary" className="mb-4 text-primary">
              ARTIGO EM DESTAQUE
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {featuredPost.title}
            </h1>
            {featuredPost.excerpt && (
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                {featuredPost.excerpt}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={`/post/${featuredPost.slug}`}>
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <Play className="h-5 w-5 mr-2" />
                  Ler Artigo
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary"
              >
                <Bookmark className="h-5 w-5 mr-2" />
                Salvar
              </Button>
            </div>
          </div>
          <div className="relative">
            {featuredPost.featuredImage ? (
              <img
                src={featuredPost.featuredImage}
                alt={featuredPost.title}
                className="rounded-xl shadow-2xl w-full"
              />
            ) : (
              <div className="bg-white bg-opacity-20 rounded-xl shadow-2xl w-full h-96 flex items-center justify-center">
                <span className="text-white text-lg">Featured Article</span>
              </div>
            )}
            <div className="absolute -bottom-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
              <span className="text-sm">✓ Latest Review</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
