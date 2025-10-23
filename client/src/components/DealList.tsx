import { useStaticData } from "@/hooks/useStaticData";
import { Oferta } from "@/types/ofertas";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, TrendingDown, AlertCircle } from "lucide-react";

interface DealListProps {
  destaque?: boolean;
  limite?: number;
}

export default function DealList({ destaque, limite = 6 }: DealListProps) {
  const { data, loading, error } = useStaticData<{ ofertas: Oferta[] }>("ofertas");

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">Erro ao carregar ofertas. Por favor, tente novamente mais tarde.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-wrap justify-center gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="w-80 animate-pulse">
            <div className="h-40 bg-gray-200 rounded-t-lg"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const ofertas = data?.ofertas
    .filter(oferta => !destaque || oferta.destaque)
    .slice(0, limite);

  if (!ofertas || ofertas.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Nenhuma oferta disponível no momento.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
      {ofertas.map((oferta) => (
        <Card key={oferta.id} className="w-80 card-hover shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="relative">
            {oferta.imagem && (
              <img
                src={oferta.imagem}
                alt={oferta.titulo}
                className="w-full h-40 object-cover rounded-t-lg"
              />
            )}
            <div className="absolute top-3 left-3">
              <Badge className="deal-badge text-white">
                -{oferta.desconto}% de desconto
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
                  R$ {Number(oferta.precoDesconto).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  R$ {Number(oferta.precoOriginal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                <span>{oferta.loja}</span> • 
                <span className="text-green-600 ml-1">Em Estoque</span>
              </div>
            </div>
            <Button
              className="w-full bg-gray-800/20 backdrop-blur-md hover:bg-gray-800/30 transition-colors text-gray-800"
              onClick={() => window.open(oferta.link, "_blank")}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Comprar na {oferta.loja}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}