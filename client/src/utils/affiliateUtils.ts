import React from 'react';
import { ConfiguracoesSite, LojaConfig } from '@/types/configuracoes';

interface ProdutoInfo {
  id?: string;
  nome?: string;
  categoria?: string;
  preco?: number;
}

/**
 * Detecta automaticamente a loja baseado na URL usando configurações dinâmicas
 */
export function detectLojaByUrl(url: string, lojas: LojaConfig[]): LojaConfig | null {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    
    // Buscar por domínio principal
    let loja = lojas.find(l => 
      l.ativo && l.dominio.toLowerCase() === domain
    );
    
    // Se não encontrou, buscar por domínios alternativos
    if (!loja) {
      loja = lojas.find(l => 
        l.ativo && l.dominiosAlternativos?.some(d => 
          d.toLowerCase() === domain
        )
      );
    }
    
    return loja || null;
  } catch (error) {
    return null;
  }
}

/**
 * Gera um link de afiliado baseado na URL original e configurações dinâmicas
 * Detecta automaticamente a loja pela URL se não for especificada
 */
export function generateAffiliateLink(
  originalUrl: string,
  lojaId?: string,
  configuracoes?: ConfiguracoesSite,
  produtoInfo?: ProdutoInfo
): string {
  if (!configuracoes?.afiliados?.lojas) {
    return originalUrl;
  }

  const lojas = configuracoes.afiliados.lojas;
  let lojaConfig: LojaConfig | null = null;

  // Se a loja foi especificada, buscar por ID
  if (lojaId) {
    lojaConfig = lojas.find(l => l.id === lojaId) || null;
  } else {
    // Se não foi especificada, detectar automaticamente
    lojaConfig = detectLojaByUrl(originalUrl, lojas);
  }
  
  if (!lojaConfig || !lojaConfig.ativo) {
    return originalUrl; // Loja não encontrada ou inativa
  }

  try {
    const url = new URL(originalUrl);
    const productPath = url.pathname + url.search;
    
    // Usar o padrão de URL da loja
    let affiliateUrl = lojaConfig.padraoUrl;
    
    if (!affiliateUrl) {
      return originalUrl;
    }

    // Substituir placeholders pelos IDs reais
    // Nota: Os IDs reais devem ser armazenados separadamente nas configurações
    affiliateUrl = affiliateUrl
      .replace('{productPath}', productPath)
      .replace('{affiliateId}', 'SEU-AFFILIATE-ID') // Será substituído pelos IDs reais
      .replace('{partnerId}', 'SEU-PARTNER-ID')
      .replace('{campaignId}', 'SEU-CAMPAIGN-ID');

    // Adicionar UTM parameters se habilitado
    if (configuracoes.afiliados.configuracoes.usarUtmTracking && produtoInfo) {
      const utmParams = new URLSearchParams({
        utm_source: configuracoes.afiliados.configuracoes.campaignSource,
        utm_medium: configuracoes.afiliados.configuracoes.campaignMedium,
        utm_campaign: produtoInfo.categoria || 'geral',
        utm_content: produtoInfo.id || '',
        utm_term: produtoInfo.nome || ''
      });
      
      affiliateUrl += `&${utmParams.toString()}`;
    }

    return affiliateUrl;
  } catch (error) {
    console.error('Erro ao gerar link de afiliado:', error);
    return originalUrl;
  }
}

/**
 * Gera múltiplos links de afiliado para um produto usando sistema dinâmico
 */
export function generateMultipleAffiliateLinks(
  urls: Record<string, string>,
  configuracoes: ConfiguracoesSite,
  produtoInfo?: ProdutoInfo
): Record<string, string> {
  const result: Record<string, string> = {};
  
  if (!configuracoes?.afiliados?.lojas) {
    return urls; // Retorna URLs originais se não houver configurações
  }

  Object.entries(urls).forEach(([lojaId, url]) => {
    if (url) {
      result[lojaId] = generateAffiliateLink(url, lojaId, configuracoes, produtoInfo);
    }
  });
  
  return result;
}

/**
 * Cria um botão de compra com link de afiliado usando sistema dinâmico
 */
export function createBuyButton(
  lojaId: string,
  url: string,
  configuracoes: ConfiguracoesSite,
  produtoInfo?: ProdutoInfo,
  options?: {
    className?: string;
    children?: React.ReactNode;
    onClick?: (url: string) => void;
  }
): React.ReactElement {
  const affiliateUrl = generateAffiliateLink(url, lojaId, configuracoes, produtoInfo);
  const loja = configuracoes?.afiliados?.lojas?.find(l => l.id === lojaId);
  
  const handleClick = () => {
    if (options?.onClick) {
      options.onClick(affiliateUrl);
    }
    
    // Tracking de clique (se implementado)
    trackAffiliateClick(loja?.nome || lojaId, produtoInfo);
  };

  return React.createElement('a', {
    href: affiliateUrl,
    target: loja?.configuracoes?.abrirNovaAba ? "_blank" : "_self",
    rel: loja?.configuracoes?.relAttributes || "nofollow sponsored",
    className: options?.className,
    onClick: handleClick
  }, options?.children || `Comprar no ${loja?.nome || lojaId}`);
}

/**
 * Verifica se uma loja está configurada e ativa
 */
export function isLojaAtiva(lojaId: string, configuracoes: ConfiguracoesSite): boolean {
  const loja = configuracoes?.afiliados?.lojas?.find(l => l.id === lojaId);
  return !!(loja?.ativo);
}

/**
 * Obtém lista de lojas ativas
 */
export function getLojasAtivas(configuracoes: ConfiguracoesSite): LojaConfig[] {
  if (!configuracoes?.afiliados?.lojas) {
    return [];
  }

  return configuracoes.afiliados.lojas.filter(loja => loja.ativo);
}

/**
 * Track de clique em link de afiliado (placeholder para implementação futura)
 */
function trackAffiliateClick(lojaNome: string, produtoInfo?: ProdutoInfo): void {
  // Implementar tracking de cliques
  console.log('Affiliate click tracked:', { lojaNome, produtoInfo, timestamp: new Date() });
  
  // Exemplo de implementação com Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'affiliate_click', {
      event_category: 'Affiliate',
      event_label: lojaNome,
      value: produtoInfo?.preco || 0
    });
  }
}

/**
 * Valida se um ID de afiliado está no formato correto usando regex da loja
 */
export function validateAffiliateId(loja: LojaConfig, campo: string, id: string): boolean {
  const campoConfig = loja.campos[campo as keyof typeof loja.campos];
  
  if (!campoConfig || !campoConfig.regex) {
    return true; // Se não há regex definido, aceita qualquer valor
  }

  try {
    const regex = new RegExp(campoConfig.regex);
    return regex.test(id);
  } catch (error) {
    console.error('Erro na validação regex:', error);
    return true; // Em caso de erro, aceita o valor
  }
}

/**
 * Formata um ID de afiliado para exibição
 */
export function formatAffiliateId(loja: LojaConfig, campo: string, id: string): string {
  const campoConfig = loja.campos[campo as keyof typeof loja.campos];
  const nome = campoConfig?.nome || campo;
  return `${nome}: ${id}`;
}

/**
 * Obtém loja por slug
 */
export function getLojaBySlug(slug: string, configuracoes: ConfiguracoesSite): LojaConfig | null {
  if (!configuracoes?.afiliados?.lojas) {
    return null;
  }

  return configuracoes.afiliados.lojas.find(loja => loja.slug === slug) || null;
}

/**
 * Obtém loja por ID
 */
export function getLojaById(id: string, configuracoes: ConfiguracoesSite): LojaConfig | null {
  if (!configuracoes?.afiliados?.lojas) {
    return null;
  }

  return configuracoes.afiliados.lojas.find(loja => loja.id === id) || null;
}

/**
 * Testa se uma URL é válida para uma loja específica
 */
export function testUrlForLoja(url: string, loja: LojaConfig): boolean {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    
    return domain === loja.dominio.toLowerCase() ||
           loja.dominiosAlternativos?.some(d => d.toLowerCase() === domain) ||
           false;
  } catch (error) {
    return false;
  }
}

/**
 * Gera link de teste para uma loja
 */
export function generateTestLink(loja: LojaConfig, testUrl: string): string {
  try {
    const url = new URL(testUrl);
    const productPath = url.pathname + url.search;
    
    return loja.padraoUrl
      .replace('{productPath}', productPath)
      .replace('{affiliateId}', 'TEST-AFFILIATE-ID')
      .replace('{partnerId}', 'TEST-PARTNER-ID')
      .replace('{campaignId}', 'TEST-CAMPAIGN-ID');
  } catch (error) {
    return 'URL inválida';
  }
}