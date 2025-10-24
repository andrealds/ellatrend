import { useState, useEffect } from 'react';
import { ConfiguracoesSite, ConfiguracoesFormData } from '@/types/configuracoes';

interface UseSiteConfigReturn {
  configuracoes: ConfiguracoesSite | null;
  loading: boolean;
  error: string | null;
  saveConfiguracoes: (config: Partial<ConfiguracoesFormData>) => Promise<boolean>;
  validateConfig: (config: Partial<ConfiguracoesFormData>) => string[];
}

// Configuração padrão do sistema
const defaultConfig: ConfiguracoesSite = {
  gerais: {
    nomeSite: 'EllaTrend',
    descricao: 'Blog de beleza, bem-estar e dicas para mulheres',
    emailContato: 'contato@ellatrend.com.br'
  },
  seo: {
    metaTitle: 'EllaTrend - Dicas de Beleza, Bem-estar e Moda para Mulheres',
    metaDescription: 'Descubra as melhores dicas de beleza, bem-estar e moda para mulheres',
    keywords: ['beleza', 'bem-estar', 'dicas', 'lifestyle', 'moda', 'saúde mental', 'alimentação', 'mulheres']
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
        ...newConfig
      } as ConfiguracoesSite;

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



  const validateConfig = (config: Partial<ConfiguracoesFormData>): string[] => {
    const errors: string[] = [];

    // Validar configurações gerais
    if (config.gerais?.nomeSite && config.gerais.nomeSite.length < 2) {
      errors.push('Nome do site deve ter pelo menos 2 caracteres');
    }

    if (config.gerais?.emailContato && !/\S+@\S+\.\S+/.test(config.gerais.emailContato)) {
      errors.push('Email de contato inválido');
    }



    return errors;
  };

  return {
    configuracoes,
    loading,
    error,
    saveConfiguracoes,
    validateConfig
  };
}
