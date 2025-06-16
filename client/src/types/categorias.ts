export interface Subcategoria {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  icone: string;
  cor: string;
  ativo: boolean;
  ordem: number;
}

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  descricao: string;
  icone: string;
  cor: string;
  ativo: boolean;
  ordem: number;
  subcategorias: Subcategoria[];
}

export interface CategoriasResponse {
  categorias: Categoria[];
} 