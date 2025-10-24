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
  redesSociais?: Partial<ConfigRedesSociais>;
  newsletter?: Partial<ConfigNewsletter>;
  analytics?: Partial<ConfigAnalytics>;
  performance?: Partial<ConfigPerformance>;
  seguranca?: Partial<ConfigSeguranca>;
}
