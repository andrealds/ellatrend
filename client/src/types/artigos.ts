export type CategoriaArtigo = 'Beleza' | 'Saúde Mental' | 'Alimentação';

export type StatusArtigo = 'DRAFT' | 'PUBLISHED';

export interface ArtigoUniversal {
  id: string;
  titulo: string;
  descricao: string;
  conteudo: string;
  imagemDestaque: string;
  tempoLeitura: string;
  
  // Categorização
  categoria: CategoriaArtigo;
  tag: string;
  
  // SEO
  slug: string;
  metaTitulo: string;
  metaDescricao: string;
  
  // Configurações
  destaque: boolean;
  dataPublicacao: string;
  
  // Métricas
  visualizacoes: number;
  curtidas: number;
  
  // Relacionamentos
  artigosRelacionados: string[];
  
  // Campos opcionais (não presentes em todos os dados)
  autor?: string;
  subcategoria?: string;
  status?: StatusArtigo;
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
  'Saúde Mental': {
    label: 'Saúde Mental',
    subcategorias: ['Ansiedade', 'Depressão', 'Meditação', 'Bem-estar', 'Terapia']
  },
  'Alimentação': {
    label: 'Alimentação',
    subcategorias: ['Nutrição', 'Receitas', 'Dietas', 'Suplementos', 'Saúde']
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
