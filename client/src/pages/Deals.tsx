import { useStaticData } from "@/hooks/useStaticData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingDown, AlertCircle } from "lucide-react";
import { Oferta } from "@/types/ofertas";

export default function Deals() {
  const { data, loading, error } = useStaticData<{ ofertas: Oferta[] }>("ofertas");

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Erro ao carregar ofertas. Por favor, tente novamente mais tarde.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Melhores Ofertas de Tecnologia
          </h1>
          <p className="text-xl text-gray-600">
            Descubra as melhores ofertas em produtos de tecnologia, cuidadosamente selecionadas e atualizadas diariamente.
          </p>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-40 bg-gray-300 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-300 rounded mb-2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : data?.ofertas && data.ofertas.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.ofertas.map((oferta) => (
              <Card key={oferta.id} className="card-hover">
                <div className="relative">
                  {oferta.produto.imagens && oferta.produto.imagens.length > 0 && (
                    <img
                      src={oferta.produto.imagens[0]}
                      alt={oferta.titulo}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="deal-badge text-white">
                      -{oferta.descontoPercentual}% de desconto
                    </Badge>
                  </div>
                  {oferta.destaque && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="destructive">DESTAQUE</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {oferta.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {oferta.descricao}
                  </p>
                  <div className="mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        R$ {Number(oferta.precoOferta).toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        R$ {Number(oferta.precoOriginal).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span>{oferta.loja}</span> • 
                      <span className="text-green-600 ml-1">Em Estoque</span>
                    </div>
                  </div>
                  <Button
                    className="affiliate-btn w-full text-white"
                    onClick={() => window.open(oferta.linkAfiliado, "_blank")}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar na {oferta.loja}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma oferta disponível
              </h2>
              <p className="text-gray-600">
                Volte em breve para ver as últimas ofertas de tecnologia.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
