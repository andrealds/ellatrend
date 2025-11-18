import { useState, useEffect } from 'react';

interface CacheStats {
  totalEntries: number;
  validEntries: number;
  expiredEntries: number;
  cacheSize: string;
  hitRate: number;
}

export const CacheMonitor = () => {
  const [stats, setStats] = useState<CacheStats>({
    totalEntries: 0,
    validEntries: 0,
    expiredEntries: 0,
    cacheSize: '0 KB',
    cacheHitRate: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  const updateStats = () => {
    try {
      const cached = localStorage.getItem('article_stats_cache');
      if (!cached) {
        setStats({
          totalEntries: 0,
          validEntries: 0,
          expiredEntries: 0,
          cacheSize: '0 KB',
          hitRate: 0
        });
        return;
      }

      const cacheData: { [key: string]: any } = JSON.parse(cached);
      const now = Date.now();
      let validEntries = 0;
      let expiredEntries = 0;

      Object.values(cacheData).forEach((entry: any) => {
        if (entry.expiresAt && now < entry.expiresAt) {
          validEntries++;
        } else {
          expiredEntries++;
        }
      });

      const totalEntries = Object.keys(cacheData).length;
      const cacheSize = (cached.length / 1024).toFixed(2) + ' KB';

      setStats({
        totalEntries,
        validEntries,
        expiredEntries,
        cacheSize,
        hitRate: totalEntries > 0 ? (validEntries / totalEntries) * 100 : 0
      });
    } catch (error) {
      console.error('Erro ao calcular estatísticas do cache:', error);
    }
  };

  const clearCache = () => {
    localStorage.removeItem('article_stats_cache');
    updateStats();
  };

  useEffect(() => {
    updateStats();
    const interval = setInterval(updateStats, 5000); // Atualizar a cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-blue-700 transition-colors"
      >
        Cache Stats
      </button>
      
      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[250px]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Cache Monitor</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Entries:</span>
              <span className="font-medium">{stats.totalEntries}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Valid:</span>
              <span className="font-medium text-green-600">{stats.validEntries}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Expired:</span>
              <span className="font-medium text-red-600">{stats.expiredEntries}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Hit Rate:</span>
              <span className="font-medium">{stats.hitRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Size:</span>
              <span className="font-medium">{stats.cacheSize}</span>
            </div>
          </div>
          
          <button
            onClick={clearCache}
            className="w-full mt-3 bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition-colors"
          >
            Clear Cache
          </button>
        </div>
      )}
    </div>
  );
};

