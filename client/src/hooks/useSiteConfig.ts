import { useState, useEffect } from 'react';
import { ConfiguracoesSite, ConfiguracoesFormData, LinkAfiliado, LojaAfiliado } from '@/types/configuracoes';

interface UseSiteConfigReturn {
  configuracoes: ConfiguracoesSite | null;
  loading: boolean;
  error: string | null;
  saveConfiguracoes: (config: Partial<ConfiguracoesFormData>) => Promise<boolean>;
  generateAffiliateLink: (originalUrl: string, loja: string, produtoInfo?: any) => string;
  getLojasAtivas: () => LojaAfiliado[];
  validateConfig: (config: Partial<ConfiguracoesFormData>) => string[];
}

// Configuração padrão do sistema
const defaultConfig: ConfiguracoesSite = {
  gerais: {
    nomeSite: 'EllaTrend',
    descricao: 'Blog de beleza, bem-estar e desenvolvimento pessoal',
    emailContato: 'contato@itechblog.com.br'
  },
  seo: {
    metaTitle: 'EllaTrend - Dicas de Beleza, Bem-estar e Desenvolvimento Pessoal',
    metaDescription: 'Descubra as melhores dicas de beleza, bem-estar e desenvolvimento pessoal',
    keywords: ['beleza', 'bem-estar', 'desenvolvimento pessoal', 'dicas', 'lifestyle']
  },
  afiliados: {
    lojas: {
      amazon: { associateId: '', ativo: false },
      magalu: { partnerId: '', ativo: false },
      kabum: { affiliateId: '', ativo: false },
      americanas: { affiliateId: '', ativo: false },
      mercadolivre: { affiliateId: '', ativo: false },
      shopee: { affiliateId: '', ativo: false },
      shein: { affiliateId: '', ativo: false },
      aliexpress: { affiliateId: '', ativo: false },
      ponto: { affiliateId: '', ativo: false },
      extra: { affiliateId: '', ativo: false }
    },
    configuracoes: {
      abrirNovaAba: true,
      usarNofollow: true,
      usarUtmTracking: true,
      campaignSource: 'itechblog',
      campaignMedium: 'artigo'
    },
  },
  redesSociais: {},
  newsletter: {
    ativo: false,
    serviceProvider: 'mailchimp',
    doubleOptIn: true
  },
  analytics: {},
  performance: {
    cacheTtl: 3600,
    compressImages: true,
    lazyLoadImages: true,
    preloadCriticalResources: true
  },
  seguranca: {
    sslRedirect: true,
    cspEnabled: false,
    rateLimitRequests: 100,
    backupAutomatico: false
  }
};

// Padrões de URLs de afiliado para cada loja
const affiliatePatterns = {
  amazon: 'https://amazon.com.br{productPath}?tag={associateId}&linkCode=ur2&camp=1789&creative=9325',
  magalu: 'https://magazineluiza.com.br{productPath}?partner={partnerId}&campaign={campaignId}',
  kabum: 'https://kabum.com.br{productPath}?afiliado={affiliateId}',
  americanas: 'https://americanas.com.br{productPath}?afiliado={affiliateId}',
  mercadolivre: 'https://mercadolivre.com.br{productPath}?matt_tool={affiliateId}',
  shopee: 'https://shopee.com.br{productPath}?affiliate_id={affiliateId}',
  shein: 'https://br.shein.com{productPath}?affiliate_id={affiliateId}',
  aliexpress: 'https://pt.aliexpress.com{productPath}?affiliate_id={affiliateId}',
  ponto: 'https://pontofrio.com.br{productPath}?afiliado={affiliateId}',
  extra: 'https://extra.com.br{productPath}?afiliado={affiliateId}'
};

export function useSiteConfig(): UseSiteConfigReturn {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar configurações
  useEffect(() => {
    loadConfiguracoes();
  }, []);

  const loadConfiguracoes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simular carregamento de configurações
      // Em produção, isso viria de uma API ou localStorage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const savedConfig = localStorage.getItem('site-config');
      if (savedConfig) {
        setConfiguracoes(JSON.parse(savedConfig));
      } else {
        setConfiguracoes(defaultConfig);
      }
    } catch (err) {
      setError('Erro ao carregar configurações');
      console.error('Erro ao carregar configurações:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveConfiguracoes = async (newConfig: Partial<ConfiguracoesFormData>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Validar configurações
      const validationErrors = validateConfig(newConfig);
      if (validationErrors.length > 0) {
        setError(`Erro de validação: ${validationErrors.join(', ')}`);
        return false;
      }

      // Mesclar com configurações existentes
      const updatedConfig = {
        ...configuracoes,
        ...newConfig,
        afiliados: {
          ...configuracoes?.afiliados,
          ...newConfig.afiliados,
          lojas: {
            ...configuracoes?.afiliados?.lojas,
            ...newConfig.afiliados?.lojas
          }
        }
      };

      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Salvar no localStorage (em produção, seria uma API)
      localStorage.setItem('site-config', JSON.stringify(updatedConfig));
      setConfiguracoes(updatedConfig);

      return true;
    } catch (err) {
      setError('Erro ao salvar configurações');
      console.error('Erro ao salvar configurações:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateAffiliateLink = (originalUrl: string, loja: string, produtoInfo?: any): string => {
    if (!configuracoes?.afiliados?.lojas) {
      return originalUrl;
    }

    const lojaConfig = configuracoes.afiliados.lojas[loja as keyof typeof configuracoes.afiliados.lojas];
    
    if (!lojaConfig?.ativo || (!lojaConfig.associateId && !lojaConfig.partnerId && !lojaConfig.affiliateId)) {
      return originalUrl;
    }

    try {
      const url = new URL(originalUrl);
      const productPath = url.pathname + url.search;
      
      let affiliateUrl = affiliatePatterns[loja as keyof typeof affiliatePatterns];
      
      if (!affiliateUrl) {
        return originalUrl;
      }

      // Substituir placeholders
      affiliateUrl = affiliateUrl
        .replace('{productPath}', productPath)
        .replace('{associateId}', lojaConfig.associateId || '')
        .replace('{partnerId}', lojaConfig.partnerId || '')
        .replace('{affiliateId}', lojaConfig.affiliateId || '')
        .replace('{campaignId}', lojaConfig.campaignId || configuracoes.afiliados.configuracoes.campaignMedium);

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
  };

  const getLojasAtivas = (): LojaAfiliado[] => {
    if (!configuracoes?.afiliados?.lojas) {
      return [];
    }

    const lojas: LojaAfiliado[] = [];
    
    Object.entries(configuracoes.afiliados.lojas).forEach(([slug, config]) => {
      if (config.ativo && (config.associateId || config.partnerId || config.affiliateId)) {
        lojas.push({
          nome: slug.charAt(0).toUpperCase() + slug.slice(1),
          slug,
          ativo: config.ativo,
          config,
          pattern: affiliatePatterns[slug as keyof typeof affiliatePatterns] || ''
        });
      }
    });

    return lojas;
  };

  const validateConfig = (config: Partial<ConfiguracoesFormData>): string[] => {
    const errors: string[] = [];

    // Validar configurações gerais
    if (config.gerais?.nomeSite && config.gerais.nomeSite.length < 2) {
      errors.push('Nome do site deve ter pelo menos 2 caracteres');
    }

    if (config.gerais?.emailContato && !/\S+@\S+\.\S+/.test(config.gerais.emailContato)) {
      errors.push('Email de contato inválido');
    }

    // Validar configurações de afiliados
    if (config.afiliados?.lojas) {
      Object.entries(config.afiliados.lojas).forEach(([loja, lojaConfig]) => {
        if (lojaConfig.ativo) {
          if (!lojaConfig.associateId && !lojaConfig.partnerId && !lojaConfig.affiliateId) {
            errors.push(`ID de afiliado obrigatório para ${loja}`);
          }
        }
      });
    }


    return errors;
  };

  return {
    configuracoes,
    loading,
    error,
    saveConfiguracoes,
    generateAffiliateLink,
    getLojasAtivas,
    validateConfig
  };
}
