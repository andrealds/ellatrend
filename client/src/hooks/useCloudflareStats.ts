import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config/api';
import { getUserId } from '@/utils/userId';
import { hasUserLiked, setArticleLiked } from '@/utils/articleLikes';

interface CloudflareStats {
  views: number;
  likes: number;
  userLiked: boolean;
}

export const useCloudflareStats = (artigoId: string) => {
  const [stats, setStats] = useState<CloudflareStats>({
    views: 0,
    likes: 0,
    userLiked: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasViewed, setHasViewed] = useState(false);
  const [useCloudflare, setUseCloudflare] = useState(true);


  const loadStats = async () => {
    if (!useCloudflare) {
      // Fallback para localStorage
      const localStats = getLocalStats(artigoId);
      setStats(localStats);
      setLoading(false);
      return;
    }

    try {
      setError(null);
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/stats`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify({ artigoId })
    });

      if (!response.ok) {
        throw new Error('Erro ao carregar estatísticas');
      }

      const data = await response.json();
      // userLiked agora vem do localStorage
      const userLiked = hasUserLiked(artigoId);
      setStats({
        views: data.views,
        likes: data.likes,
        userLiked
      });
    } catch (err) {
      console.error('Erro ao carregar stats do Cloudflare:', err);
      // Fallback para localStorage
      setUseCloudflare(false);
      const localStats = getLocalStats(artigoId);
      setStats(localStats);
    } finally {
      setLoading(false);
    }
  };

  const getLocalStats = (artigoId: string): CloudflareStats => {
    try {
      // Buscar likes do novo utilitário (localStorage dedicado)
      const userLiked = hasUserLiked(artigoId);
      
      // Buscar stats de cache se existir
      const stored = localStorage.getItem('article_stats');
      const data = stored ? JSON.parse(stored) : {};
      const articleStats = data[artigoId] || { views: 0, likes: 0 };
      
      return {
        views: articleStats.views || 0,
        likes: articleStats.likes || 0,
        userLiked
      };
    } catch {
      return { views: 0, likes: 0, userLiked: false };
    }
  };

  const incrementViews = async () => {
    if (hasViewed) return;
    
    if (!useCloudflare) {
      // Fallback para localStorage
      const localStats = getLocalStats(artigoId);
      if (!localStats.userLiked) {
        // Implementar lógica local aqui se necessário
        setHasViewed(true);
      }
      return;
    }

    try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/view`, {
      method: 'POST',
      headers: API_CONFIG.DEFAULT_HEADERS,
      body: JSON.stringify({
        artigoId,
        userId: getUserId()
      })
    });

      const data = await response.json();
      
      if (data.success) {
        setHasViewed(true);
        setStats(prev => ({ ...prev, views: data.views }));
      }
    } catch (err) {
      console.error('Erro ao incrementar visualização:', err);
      // Fallback silencioso
      setHasViewed(true);
    }
  };

  const toggleLike = async () => {
    if (!useCloudflare) {
      // Fallback para localStorage
      const localStats = getLocalStats(artigoId);
      // Implementar lógica local aqui
      return;
    }

    try {
      const action = stats.userLiked ? 'unlike' : 'like';
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/like`, {
        method: 'POST',
        headers: API_CONFIG.DEFAULT_HEADERS,
        body: JSON.stringify({ 
          artigoId, 
          userId: getUserId(), 
          action 
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar like');
      }

      const data = await response.json();
      // Atualizar localStorage e estado
      const newLikedState = action === 'like';
      setArticleLiked(artigoId, newLikedState);
      
      setStats(prev => ({
        ...prev,
        likes: data.count,
        userLiked: newLikedState
      }));
    } catch (err) {
      console.error('Erro ao atualizar like:', err);
      // Fallback silencioso - não quebra a UI
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
