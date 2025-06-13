import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { DealWithDetails } from "@/types";

export default function Deals() {
  const { data: deals, isLoading } = useQuery<DealWithDetails[]>({
    queryKey: ["/api/deals?active=true"],
  });

  const trackAffiliateClick = async (dealId: string, store: string, affiliateLink: string) => {
    try {
      await fetch("/api/affiliate/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealId,
          store,
        }),
      });
      
      // Open affiliate link in new tab
      window.open(affiliateLink, "_blank");
    } catch (error) {
      console.error("Failed to track click:", error);
      // Still open the link even if tracking fails
      window.open(affiliateLink, "_blank");
    }
  };

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

        {isLoading ? (
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
        ) : deals && deals.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <Card key={deal.id} className="card-hover">
                <div className="relative">
                  {deal.product?.images && deal.product.images.length > 0 && (
                    <img
                      src={deal.product.images[0]}
                      alt={deal.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="deal-badge text-white">
                      -{deal.discountPercent}% de desconto
                    </Badge>
                  </div>
                  {deal.isFeatured && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="destructive">DESTAQUE</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                    {deal.title}
                  </h3>
                  <div className="mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        R$ {parseFloat(deal.dealPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        R$ {parseFloat(deal.originalPrice).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      <span>{deal.store}</span> • 
                      <span className="text-green-600 ml-1">Em Estoque</span>
                    </div>
                  </div>
                  {deal.couponCode && (
                    <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-xs text-yellow-800">
                        Código: <span className="font-mono font-bold">{deal.couponCode}</span>
                      </p>
                    </div>
                  )}
                  <Button
                    className="affiliate-btn w-full text-white"
                    onClick={() => trackAffiliateClick(deal.id, deal.store, deal.affiliateLink)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Comprar na {deal.store}
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
