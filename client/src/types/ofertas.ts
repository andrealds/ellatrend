export interface Especificacoes {
  [key: string]: string;
}

export interface LinksAfiliados {
  [key: string]: string;
}

export interface Produto {
  id: string;
  nome: string;
  slug: string;
  modelo: string;
  sku: string;
  imagens: string[];
  especificacoes: Especificacoes;
  linksAfiliados: LinksAfiliados;
}

export interface Oferta {
  id: string;
  titulo: string;
  descricao: string;
  produtoId: string;
  precoOriginal: number;
  precoOferta: number;
  descontoPercentual: number;
  linkAfiliado: string;
  loja: string;
  dataInicio: string;
  dataFim: string;
  destaque: boolean;
  produto: Produto;
}

export interface OfertasResponse {
  ofertas: Oferta[];
} 