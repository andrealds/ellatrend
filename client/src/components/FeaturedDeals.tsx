import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Flame } from "lucide-react";
import { DealWithDetails } from "@/types";
import { Link } from "wouter";

export default function FeaturedDeals() {
  const { data: deals, isLoading } = useQuery<DealWithDetails[]>({
    queryKey: ["/api/deals?featured=true&active=true&limit=8"],
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
      
      window.open(affiliateLink, "_blank");
    } catch (error) {
      console.error("Failed to track click:", error);
      window.open(affiliateLink, "_blank");
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Ofertas em Destaque
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            As melhores ofertas de tecnologia, cuidadosamente selecionadas e atualizadas diariamente.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="w-80 animate-pulse">
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
        ) : deals && deals.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-6">
            {deals.map((deal) => (
              <Card key={deal.id} className="w-80 card-hover">
                <div className="relative">
                  {deal.product?.images && deal.product.images.length > 0 ? (
                    <img
                      src={deal.product.images[0]}
                      alt={deal.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = "https://via.placeholder.com/400x300?text=Sem+Imagem";
                      }}
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 rounded-t-lg flex items-center justify-center">
                      <ShoppingCart className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <Badge className="deal-badge text-white">
                      -{deal.discountPercent}% de desconto
                    </Badge>
                  </div>
                  {deal.isFeatured && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="destructive">OFERTA LIMITADA</Badge>
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
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhuma oferta disponível ainda.</p>
          </div>
        )}
      </div>
    </section>
  );
}
