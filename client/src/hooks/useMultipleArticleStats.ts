import { useCachedArticleStats } from './useCachedArticleStats';

// Re-exportar o hook de cache como useMultipleArticleStats
// para manter compatibilidade com o código existente
export const useMultipleArticleStats = useCachedArticleStats;