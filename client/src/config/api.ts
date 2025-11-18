export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_CLOUDFLARE_API_URL || 
            (typeof window !== 'undefined' && (window as any).API_CONFIG?.BASE_URL) || 
            'https://ellatrend-api.awktecnologia.workers.dev',
  
  TIMEOUT: 10000,
  
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
} as const;
