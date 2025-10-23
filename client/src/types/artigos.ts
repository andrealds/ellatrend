export type CategoriaArtigo = 'Beleza' | 'Saude' | 'Moda' | 'Desenvolvimento';

export type StatusArtigo = 'DRAFT' | 'PUBLISHED';

export interface ArtigoUniversal {
  id: string;
  titulo: string;
  descricao: string;
  conteudo: string;
  imagemDestaque: string;
  autor: string;
  tempoLeitura: string;
  
  // Categorização
  categoria: CategoriaArtigo;
  subcategoria: string;
  tag: string;
  
  // SEO
  slug: string;
  metaTitulo: string;
  metaDescricao: string;
  
  // Configurações
  destaque: boolean;
  status: StatusArtigo;
  dataPublicacao: string;
  
  // Métricas
  visualizacoes: number;
  curtidas: number;
  
  // Relacionamentos
  artigosRelacionados: string[];
}

export interface ArtigoResponse {
  artigos: ArtigoUniversal[];
}

export interface ArtigoFormData {
  titulo: string;
  descricao: string;
  conteudo: string;
  imagemDestaque: string;
  autor: string;
  tempoLeitura: string;
  categoria: CategoriaArtigo;
  subcategoria: string;
  tag: string;
  metaTitulo: string;
  metaDescricao: string;
  destaque: boolean;
  status: StatusArtigo;
}

export interface ArtigoFilters {
  categoria?: CategoriaArtigo;
  subcategoria?: string;
  status?: StatusArtigo;
  destaque?: boolean;
  busca?: string;
  dataInicio?: string;
  dataFim?: string;
}

export const CATEGORIAS_ARTIGO: Record<CategoriaArtigo, { label: string; subcategorias: string[] }> = {
  Beleza: {
    label: 'Beleza',
    subcategorias: ['Skincare', 'Maquiagem', 'Cabelo', 'Unhas', 'Perfumes']
  },
  Saude: {
    label: 'Saúde',
    subcategorias: ['Saúde Mental', 'Nutrição', 'Exercícios', 'Bem-estar', 'Prevenção']
  },
  Moda: {
    label: 'Moda',
    subcategorias: ['Looks', 'Tendências', 'Estilo', 'Acessórios', 'Sapatos']
  },
  Desenvolvimento: {
    label: 'Desenvolvimento Pessoal',
    subcategorias: ['Produtividade', 'Carreira', 'Relacionamentos', 'Liderança', 'Crescimento']
  }
};

export const STATUS_ARTIGO: Record<StatusArtigo, { label: string; color: string }> = {
  DRAFT: {
    label: 'Rascunho',
    color: 'bg-gray-100 text-gray-800'
  },
  PUBLISHED: {
    label: 'Publicado',
    color: 'bg-green-100 text-green-800'
  }
};
