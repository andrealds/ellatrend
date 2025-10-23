export interface Noticia {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  conteudo: string; // Conteúdo completo em Markdown
  imagem: string;
  autor: string;
  tempo: string;
  tag: string;
  slug: string;
  destaque: boolean;
  dataPublicacao: string;
  visualizacoes: number;
  curtidas: number;
  metaTitulo: string;
  metaDescricao: string;
  noticiasRelacionadas?: string[]; // IDs de notícias relacionadas
}

export interface NoticiasData {
  noticias: Noticia[];
}


