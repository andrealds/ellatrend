import { useState, useEffect } from 'react';
import { getUserId } from '@/utils/userId';
import { hasUserLiked, setArticleLiked } from '@/utils/articleLikes';

interface ArticleStats {
  views: number;
  likes: number;
  userLiked: boolean;
}

interface ArticleStatsData {
  [artigoId: string]: {
    views: number;
    likes: number;
    viewedUsers: string[]; // Removido likedUsers - agora usa utilitário dedicado
  };
}


// Função para obter dados do localStorage
const getStoredStats = (): ArticleStatsData => {
  try {
    const stored = localStorage.getItem('article_stats');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Função para salvar dados no localStorage
const saveStoredStats = (stats: ArticleStatsData): void => {
  try {
    localStorage.setItem('article_stats', JSON.stringify(stats));
  } catch (error) {
    console.error('Erro ao salvar estatísticas:', error);
  }
};

export const useArticleStats = (artigoId: string) => {
  const [stats, setStats] = useState<ArticleStats>({
    views: 0,
    likes: 0,
    userLiked: false
  });
  const [loading, setLoading] = useState(true);

  // Carregar estatísticas iniciais
  useEffect(() => {
    const loadStats = () => {
      try {
        const storedStats = getStoredStats();
        const articleStats = storedStats[artigoId] || { views: 0, likes: 0, viewedUsers: [] };
        // userLiked agora vem do utilitário dedicado
        const userLiked = hasUserLiked(artigoId);
        
        setStats({
          views: articleStats.views,
          likes: articleStats.likes,
          userLiked
        });
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [artigoId]);

  // Incrementar visualizações (apenas uma vez por usuário)
  const incrementViews = () => {
    try {
      const storedStats = getStoredStats();
      const articleStats = storedStats[artigoId] || { views: 0, likes: 0, viewedUsers: [] };
      const userId = getUserId();
      
      // Verificar se o usuário já visualizou este artigo
      if (!articleStats.viewedUsers.includes(userId)) {
        articleStats.views += 1;
        articleStats.viewedUsers.push(userId);
        storedStats[artigoId] = articleStats;
        
        saveStoredStats(storedStats);
        
        setStats(prev => ({ ...prev, views: articleStats.views }));
      }
    } catch (error) {
      console.error('Erro ao incrementar visualizações:', error);
    }
  };

  // Toggle like
  const toggleLike = () => {
    try {
      // Atualizar localStorage usando utilitário dedicado
      const newLikedState = !stats.userLiked;
      setArticleLiked(artigoId, newLikedState);
      
      // Atualizar count localmente
      const storedStats = getStoredStats();
      const articleStats = storedStats[artigoId] || { views: 0, likes: 0, viewedUsers: [] };
      
      if (newLikedState) {
        // Adicionar like
        articleStats.likes += 1;
      } else {
        // Remover like
        articleStats.likes = Math.max(0, articleStats.likes - 1);
      }
      
      storedStats[artigoId] = articleStats;
      saveStoredStats(storedStats);
      
      setStats(prev => ({
        ...prev,
        likes: articleStats.likes,
        userLiked: newLikedState
      }));
    } catch (error) {
      console.error('Erro ao atualizar like:', error);
    }
  };

  // Verificar se o usuário já visualizou o artigo
  const hasUserViewed = () => {
    try {
      const storedStats = getStoredStats();
      const articleStats = storedStats[artigoId] || { viewedUsers: [] };
      const userId = getUserId();
      return articleStats.viewedUsers.includes(userId);
    } catch {
      return false;
    }
  };

  return { 
    stats, 
    loading, 
    incrementViews, 
    toggleLike,
    hasUserViewed
  };
};
