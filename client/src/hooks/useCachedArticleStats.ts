import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';
import { getUserId } from '@/utils/userId';
import { hasUserLiked } from '@/utils/articleLikes';

interface ArticleStats {
  views: number;
  likes: number;
  userLiked: boolean;
}

interface CacheEntry {
  data: ArticleStats;
  timestamp: number;
  expiresAt: number;
}

interface MultipleArticleStats {
  [artigoId: string]: ArticleStats;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const CACHE_MAX_AGE = 10 * 60 * 1000; // 10 minutos
const CACHE_KEY = 'article_stats_cache';

export const useCachedArticleStats = (artigoIds: string[]) => {
  const [stats, setStats] = useState<MultipleArticleStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Função para obter dados do cache
  const getCachedData = (): MultipleArticleStats => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return {};

      const cacheData: { [key: string]: CacheEntry } = JSON.parse(cached);
      const now = Date.now();
      const result: MultipleArticleStats = {};

      // Verificar quais dados ainda são válidos
      Object.entries(cacheData).forEach(([artigoId, entry]) => {
        if (now < entry.expiresAt) {
          result[artigoId] = entry.data;
        }
      });

      return result;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao ler cache:', error);
      }
      return {};
    }
  };

  // Função para salvar dados no cache
  const setCachedData = (artigoId: string, data: ArticleStats) => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const cacheData: { [key: string]: CacheEntry } = cached ? JSON.parse(cached) : {};
      
      cacheData[artigoId] = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + CACHE_TTL
      };

      // Limpar entradas expiradas
      const now = Date.now();
      Object.keys(cacheData).forEach(key => {
        if (now > cacheData[key].expiresAt + CACHE_MAX_AGE) {
          delete cacheData[key];
        }
      });

      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao salvar cache:', error);
      }
    }
  };

  // Função para buscar dados da API
  const fetchStatsFromAPI = async (artigoIds: string[]): Promise<MultipleArticleStats> => {
    const statsObject: MultipleArticleStats = {};
    
    // Processar artigos em lotes para evitar sobrecarga
    const batchSize = 5;
    for (let i = 0; i < artigoIds.length; i += batchSize) {
      const batch = artigoIds.slice(i, i + batchSize);
      
      const promises = batch.map(async (artigoId) => {
        try {
          const response = await fetch(`${API_CONFIG.BASE_URL}/api/stats`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ artigoId }),
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          // userLiked agora vem do localStorage, não da API
          const userLiked = hasUserLiked(artigoId);
          const stats = {
            views: data.views || 0,
            likes: data.likes || 0,
            userLiked
          };
          
          // Salvar no cache
          setCachedData(artigoId, stats);
          
          return { artigoId, stats };
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error(`Erro ao carregar stats para ${artigoId}:`, err);
          }
          
          // Retornar dados padrão em caso de erro
          const defaultStats = {
            views: 0,
            likes: 0,
            userLiked: false
          };
          
          return { artigoId, stats: defaultStats };
        }
      });

      try {
        const results = await Promise.all(promises);
        results.forEach(({ artigoId, stats }) => {
          statsObject[artigoId] = stats;
        });
      } catch (batchError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Erro no lote de artigos:', batchError);
        }
        // Continuar com o próximo lote mesmo se um falhar
      }
    }

    return statsObject;
  };

  // Função principal para carregar dados
  const loadStats = async () => {
    if (artigoIds.length === 0) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // 1. Carregar dados do cache primeiro
      const cachedData = getCachedData();
      const cachedStats: MultipleArticleStats = {};
      const missingIds: string[] = [];

      // Separar dados válidos do cache e IDs que precisam ser buscados
      artigoIds.forEach(artigoId => {
        if (cachedData[artigoId]) {
          cachedStats[artigoId] = cachedData[artigoId];
        } else {
          missingIds.push(artigoId);
        }
      });

      // 2. Inicializar com dados padrão para todos os artigos
      const defaultStats: MultipleArticleStats = {};
      artigoIds.forEach(artigoId => {
        defaultStats[artigoId] = {
          views: 0,
          likes: 0,
          userLiked: false
        };
      });

      // 3. Se temos dados do cache, mostrar imediatamente
      if (Object.keys(cachedStats).length > 0) {
        setStats({ ...defaultStats, ...cachedStats });
        setLoading(false);
      } else {
        // Se não há cache, mostrar dados padrão imediatamente
        setStats(defaultStats);
        setLoading(false);
      }

      // 4. Buscar dados faltantes da API em background
      if (missingIds.length > 0) {
        try {
          const apiStats = await fetchStatsFromAPI(missingIds);
          
          // 5. Atualizar com dados da API
          setStats(prevStats => ({
            ...prevStats,
            ...apiStats
          }));
        } catch (apiError) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Erro ao carregar stats da API:', apiError);
          }
          // Manter dados padrão se API falhar
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao carregar estatísticas:', err);
      }
      setError('Erro ao carregar estatísticas');
      
      // Fallback: dados padrão para todos os artigos
      const defaultStats: MultipleArticleStats = {};
      artigoIds.forEach(artigoId => {
        defaultStats[artigoId] = {
          views: 0,
          likes: 0,
          userLiked: false
        };
      });
      setStats(defaultStats);
    } finally {
      setLoading(false);
    }
  };

  // Função para invalidar cache de um artigo específico
  const invalidateCache = (artigoId: string) => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const cacheData: { [key: string]: CacheEntry } = JSON.parse(cached);
        delete cacheData[artigoId];
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao invalidar cache:', error);
      }
    }
  };

  // Função para limpar todo o cache
  const clearCache = () => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao limpar cache:', error);
      }
    }
  };

  useEffect(() => {
    if (artigoIds.length > 0) {
      loadStats();
    }
  }, [artigoIds.join(',')]);

  return {
    stats,
    loading,
    error,
    refreshStats: loadStats,
    invalidateCache,
    clearCache
  };
};

