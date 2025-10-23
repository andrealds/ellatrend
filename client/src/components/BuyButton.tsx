import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  ExternalLink, 
  DollarSign
} from 'lucide-react';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import { createBuyButton, isLojaAtiva, getLojasAtivas } from '@/utils/affiliateUtils';

interface BuyButtonProps {
  produto: {
    id: string;
    nome: string;
    categoria: string;
    preco?: number;
    urls: {
      amazon?: string;
      magalu?: string;
      kabum?: string;
      americanas?: string;
      shopee?: string;
      shein?: string;
      aliexpress?: string;
      ponto?: string;
      extra?: string;
    };
  };
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  showPrice?: boolean;
}

export function BuyButton({ 
  produto, 
  variant = 'default', 
  size = 'default',
  showPrice = true,
}: BuyButtonProps) {
  const { configuracoes } = useSiteConfig();
  
  if (!configuracoes) {
    return null;
  }

  const lojasAtivas = getLojasAtivas(configuracoes);
  const lojasComUrls = lojasAtivas.filter(loja => produto.urls[loja as keyof typeof produto.urls]);

  // Se só tem uma loja disponível, mostra botão único
  if (lojasComUrls.length === 1) {
    const loja = lojasComUrls[0];
    const url = produto.urls[loja as keyof typeof produto.urls];
    
    if (!url) return null;

    
    return (
      <div className="flex flex-col gap-2">
        <Button 
          asChild 
          variant={variant} 
          size={size}
          className="w-full"
        >
          {createBuyButton(loja, url, configuracoes, produto, {
            className: "flex items-center justify-center gap-2",
            children: (
              <>
                <ShoppingCart className="h-4 w-4" />
                Comprar no {loja.charAt(0).toUpperCase() + loja.slice(1)}
                <ExternalLink className="h-3 w-3" />
              </>
            )
          })}
        </Button>
        
      </div>
    );
  }

  // Se tem múltiplas lojas, mostra dropdown ou lista
  if (lojasComUrls.length > 1) {
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700 text-center">
          Onde comprar:
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          {lojasComUrls.map((loja) => {
            const url = produto.urls[loja as keyof typeof produto.urls];
            
            if (!url) return null;

            return (
              <Button 
                key={loja}
                asChild 
                variant="outline" 
                size="sm"
                className="justify-between"
              >
                {createBuyButton(loja, url, configuracoes, produto, {
                  className: "flex items-center justify-between w-full",
                  children: (
                    <>
                      <span>{loja.charAt(0).toUpperCase() + loja.slice(1)}</span>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-3 w-3" />
                      </div>
                    </>
                  )
                })}
              </Button>
            );
          })}
        </div>

        {showPrice && produto.preco && (
          <div className="text-center text-sm text-gray-600">
            A partir de R$ {produto.preco.toLocaleString('pt-BR')}
          </div>
        )}
      </div>
    );
  }

  return null;
}

// Componente para mostrar apenas o preço (quando não há links de afiliado)
export function PriceDisplay({ produto }: { produto: { preco?: number; nome: string } }) {
  if (!produto.preco) return null;

  return (
    <div className="flex items-center gap-2 text-lg font-semibold text-green-600">
      <DollarSign className="h-5 w-5" />
      <span>R$ {produto.preco.toLocaleString('pt-BR')}</span>
    </div>
  );
}

