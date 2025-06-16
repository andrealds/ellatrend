export interface Comparativo {
  id: string;
  titulo: string;
  slug: string;
  resumo: string;
  conteudo: {
    introducao: string;
    secoes: Array<{
      titulo: string;
      produtos: Array<{
        nome: string;
        caracteristicas: string[];
      }>;
    }>;
    veredito: {
      conclusao: string;
      recomendacoes: Array<{
        perfil: string;
        produto: string;
      }>;
    };
  };
  imagemDestaque: string;
  metaTitulo: string;
  metaDescricao: string;
  status: 'PUBLISHED' | 'DRAFT';
  visualizacoes: number;
  curtidas: number;
  destaque: boolean;
  dataPublicacao: string;
  categoria: string;
  produtos: Array<{
    id: string;
    nome: string;
    preco: string;
    precoOriginal: string;
    linksAfiliados: {
      [key: string]: string;
    };
  }>;
}

export interface ComparativosResponse {
  comparativos: Comparativo[];
} 