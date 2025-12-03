// utils/articleLikes.ts
// Gerencia likes dos artigos no localStorage do usuário

const LIKED_ARTICLES_KEY = 'ellatrend_liked_articles';

interface LikedArticles {
  [artigoId: string]: boolean;
}

/**
 * Retorna todos os artigos curtidos pelo usuário
 */
export function getLikedArticles(): LikedArticles {
  try {
    const stored = localStorage.getItem(LIKED_ARTICLES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Erro ao ler likes do localStorage:', error);
    return {};
  }
}

/**
 * Verifica se o usuário curtiu um artigo específico
 */
export function hasUserLiked(artigoId: string): boolean {
  const likedArticles = getLikedArticles();
  return likedArticles[artigoId] === true;
}

/**
 * Marca um artigo como curtido no localStorage
 */
export function setArticleLiked(artigoId: string, liked: boolean): void {
  try {
    const likedArticles = getLikedArticles();
    
    if (liked) {
      likedArticles[artigoId] = true;
    } else {
      // Remove o artigo ou marca como false
      delete likedArticles[artigoId];
    }
    
    localStorage.setItem(LIKED_ARTICLES_KEY, JSON.stringify(likedArticles));
  } catch (error) {
    console.error('Erro ao salvar like no localStorage:', error);
  }
}

/**
 * Toggle like (curtir ou descurtir)
 */
export function toggleArticleLike(artigoId: string): boolean {
  const currentLiked = hasUserLiked(artigoId);
  setArticleLiked(artigoId, !currentLiked);
  return !currentLiked; // Retorna novo estado
}

/**
 * Remove todos os likes (útil para limpeza/debug)
 */
export function clearAllLikes(): void {
  try {
    localStorage.removeItem(LIKED_ARTICLES_KEY);
  } catch (error) {
    console.error('Erro ao limpar likes:', error);
  }
}








