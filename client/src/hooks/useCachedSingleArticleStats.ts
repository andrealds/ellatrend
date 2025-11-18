import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';
import { getUserId } from '@/utils/userId';
import { hasUserLiked, setArticleLiked } from '@/utils/articleLikes';

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

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const CACHE_MAX_AGE = 10 * 60 * 1000; // 10 minutos
const CACHE_KEY = 'article_stats_cache';

export const useCachedSingleArticleStats = (artigoId: string) => {
  const [stats, setStats] = useState<ArticleStats>({
    views: 0,
    likes: 0,
    userLiked: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasViewed, setHasViewed] = useState(false);


  // Função para obter dados do cache
  const getCachedData = (): ArticleStats | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const cacheData: { [key: string]: CacheEntry } = JSON.parse(cached);
      const entry = cacheData[artigoId];
      
      if (entry && Date.now() < entry.expiresAt) {
        return entry.data;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao ler cache:', error);
      return null;
    }
  };

  // Função para salvar dados no cache
  const setCachedData = (data: ArticleStats) => {
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
      console.error('Erro ao salvar cache:', error);
    }
  };

  // Função para carregar estatísticas
  const loadStats = async () => {
    if (!artigoId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      
      // 1. Verificar cache primeiro
      const cachedData = getCachedData();
      if (cachedData) {
        // Sempre atualizar userLiked do localStorage ao carregar do cache
        const userLiked = hasUserLiked(artigoId);
        const statsWithLiked = {
          ...cachedData,
          userLiked
        };
        setStats(statsWithLiked);
        setLoading(false);
      }

      // 2. Buscar da API (mesmo se tiver cache, para manter dados atualizados)
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/stats`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ artigoId }),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas');
      }

      const data = await response.json();
      // userLiked agora vem do localStorage, não da API
      const userLiked = hasUserLiked(artigoId);
      const newStats = {
        views: data.views,
        likes: data.likes,
        userLiked
      };

      setStats(newStats);
      setCachedData(newStats); // Salvar no cache
    } catch (err) {
      console.error('Erro ao carregar stats do Cloudflare:', err);
      
      // Se falhou e não tem cache, usar fallback
      if (!getCachedData()) {
        setError('Erro ao carregar estatísticas');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para incrementar visualizações
  const incrementViews = async () => {
    if (hasViewed) return;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/view`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({
          artigoId,
          userId: getUserId()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setHasViewed(true);
        setStats(prev => ({ ...prev, views: data.views }));
        
        // Atualizar cache
        setCachedData({ ...stats, views: data.views });
      }
    } catch (err) {
      console.error('Erro ao incrementar visualização:', err);
      setHasViewed(true); // Marcar como visualizado mesmo se falhar
    }
  };

  // Função para toggle de like
  const toggleLike = async () => {
    try {
      // 1. Atualizar localStorage primeiro (otimista)
      const newLikedState = !stats.userLiked;
      setArticleLiked(artigoId, newLikedState);
      
      // 2. Atualizar estado local imediatamente (UI responsiva)
      const action = newLikedState ? 'like' : 'unlike';
      const optimisticStats = {
        ...stats,
        likes: newLikedState ? stats.likes + 1 : Math.max(0, stats.likes - 1),
        userLiked: newLikedState
      };
      setStats(optimisticStats);
      
      // 3. Enviar para API (atualiza count no servidor)
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/like`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({
          artigoId,
          userId: getUserId(),
          action
        }),
      });

      if (!response.ok) {
        // Reverter se falhar
        setArticleLiked(artigoId, !newLikedState);
        setStats(stats);
        throw new Error('Erro ao atualizar like');
      }

      const data = await response.json();
      // Atualizar com dados reais do servidor
      const finalStats = {
        ...optimisticStats,
        likes: data.count,
        userLiked: newLikedState // Manter estado do localStorage
      };
      
      setStats(finalStats);
      setCachedData(finalStats); // Atualizar cache
    } catch (err) {
      console.error('Erro ao atualizar like:', err);
      // Reverter para estado anterior se falhar
      setArticleLiked(artigoId, stats.userLiked);
      setStats(stats);
    }
  };

  useEffect(() => {
    if (artigoId) {
      loadStats();
    }
  }, [artigoId]);

  return {
    stats,
    loading,
    error,
    incrementViews,
    toggleLike,
    refreshStats: loadStats
  };
};
