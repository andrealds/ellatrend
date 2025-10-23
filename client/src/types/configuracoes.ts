// Configurações Gerais do Site
export interface ConfigGerais {
  nomeSite: string;
  descricao: string;
  emailContato: string;
}

// Configurações de SEO
export interface ConfigSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

// Configurações de Loja de Afiliado
export interface LojaAfiliadoConfig {
  associateId?: string;
  partnerId?: string;
  affiliateId?: string;
  campaignId?: string;
  ativo: boolean;
}

// Configurações de Afiliados
export interface ConfigAfiliados {
  lojas: {
    amazon: LojaAfiliadoConfig;
    magalu: LojaAfiliadoConfig;
    kabum: LojaAfiliadoConfig;
    americanas: LojaAfiliadoConfig;
    mercadolivre: LojaAfiliadoConfig;
    shopee: LojaAfiliadoConfig;
    shein: LojaAfiliadoConfig;
    aliexpress: LojaAfiliadoConfig;
    ponto: LojaAfiliadoConfig;
    extra: LojaAfiliadoConfig;
  };
  configuracoes: {
    abrirNovaAba: boolean;
    usarNofollow: boolean;
    usarUtmTracking: boolean;
    campaignSource: string;
    campaignMedium: string;
  };
}

// Configurações de Redes Sociais
export interface ConfigRedesSociais {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
}

// Configurações de Newsletter
export interface ConfigNewsletter {
  ativo: boolean;
  serviceProvider: 'mailchimp' | 'convertkit' | 'sendgrid';
  doubleOptIn: boolean;
}

// Configurações de Analytics
export interface ConfigAnalytics {
  googleAnalytics?: string;
  googleTagManager?: string;
  facebookPixel?: string;
}

// Configurações de Performance
export interface ConfigPerformance {
  cacheTtl: number;
  compressImages: boolean;
  lazyLoadImages: boolean;
  preloadCriticalResources: boolean;
}

// Configurações de Segurança
export interface ConfigSeguranca {
  sslRedirect: boolean;
  cspEnabled: boolean;
  rateLimitRequests: number;
  backupAutomatico: boolean;
}

// Interface principal das configurações do site
export interface ConfiguracoesSite {
  // Configurações Gerais
  gerais: ConfigGerais;
  
  // SEO
  seo: ConfigSEO;
  
  // Afiliados
  afiliados: ConfigAfiliados;
  
  // Redes Sociais
  redesSociais: ConfigRedesSociais;
  
  // Newsletter
  newsletter: ConfigNewsletter;
  
  // Analytics
  analytics: ConfigAnalytics;
  
  // Performance
  performance: ConfigPerformance;
  
  // Segurança
  seguranca: ConfigSeguranca;
}

// Interface para formulários de configuração
export interface ConfiguracoesFormData {
  gerais?: Partial<ConfigGerais>;
  seo?: Partial<ConfigSEO>;
  afiliados?: Partial<ConfigAfiliados>;
  redesSociais?: Partial<ConfigRedesSociais>;
  newsletter?: Partial<ConfigNewsletter>;
  analytics?: Partial<ConfigAnalytics>;
  performance?: Partial<ConfigPerformance>;
  seguranca?: Partial<ConfigSeguranca>;
}

// Interface para lojas de afiliado (usado em componentes)
export interface LojaAfiliado {
  nome: string;
  slug: string;
  ativo: boolean;
  config: {
    associateId?: string;
    partnerId?: string;
    affiliateId?: string;
    trackingId?: string;
    campaignId?: string;
  };
  pattern: string;
}

// Interface para links de afiliado gerados
export interface LinkAfiliado {
  originalUrl: string;
  affiliateUrl: string;
  loja: string;
  produtoId?: string;
  categoria?: string;
  timestamp: Date;
  cliques?: number;
}