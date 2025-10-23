import { useState, useEffect } from 'react';
import { useStaticData } from './useStaticData';
import { ArtigoUniversal, ArtigoResponse, CategoriaArtigo } from '@/types/artigos';

export function useArtigos(categoria?: CategoriaArtigo) {
  const [artigos, setArtigos] = useState<ArtigoUniversal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determinar qual arquivo carregar baseado na categoria
  const getDataFile = (categoria?: CategoriaArtigo): string => {
    switch (categoria) {
      case 'Beleza':
        return 'artigos-beleza';
      case 'Saude':
        return 'artigos-saude';
      case 'Moda':
        return 'artigos-moda';
      case 'Desenvolvimento':
        return 'artigos-desenvolvimento';
      default:
        return 'artigos-beleza'; // Default para beleza
    }
  };

  const { data, loading: dataLoading, error: dataError } = useStaticData<ArtigoResponse>(
    getDataFile(categoria)
  );

  useEffect(() => {
    setLoading(dataLoading);
    setError(dataError);

    if (data?.artigos) {
      setArtigos(data.artigos);
    }
  }, [data, dataLoading, dataError]);

  const saveArtigo = async (artigo: ArtigoUniversal) => {
    try {
      setLoading(true);
      
      // Determinar arquivo de destino baseado na categoria
      const targetFile = getDataFile(artigo.categoria);
      
      // TODO: Implementar salvamento real no arquivo JSON
      console.log('Salvando artigo no arquivo:', targetFile, artigo);
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar lista local
      setArtigos(prev => {
        const existingIndex = prev.findIndex(a => a.id === artigo.id);
        if (existingIndex >= 0) {
          const newArtigos = [...prev];
          newArtigos[existingIndex] = artigo;
          return newArtigos;
        } else {
          return [...prev, artigo];
        }
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar artigo:', error);
      setError('Erro ao salvar artigo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteArtigo = async (id: string) => {
    try {
      setLoading(true);
      
      // TODO: Implementar exclusão real do arquivo JSON
      console.log('Excluindo artigo:', id);
      
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Atualizar lista local
      setArtigos(prev => prev.filter(a => a.id !== id));
      
      return true;
    } catch (error) {
      console.error('Erro ao excluir artigo:', error);
      setError('Erro ao excluir artigo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getArtigoById = (id: string): ArtigoUniversal | undefined => {
    return artigos.find(a => a.id === id);
  };

  const getArtigosByCategoria = (categoria: CategoriaArtigo): ArtigoUniversal[] => {
    return artigos.filter(a => a.categoria === categoria);
  };

  const getArtigosBySubcategoria = (subcategoria: string): ArtigoUniversal[] => {
    return artigos.filter(a => a.subcategoria === subcategoria);
  };

  const searchArtigos = (query: string): ArtigoUniversal[] => {
    const lowerQuery = query.toLowerCase();
    return artigos.filter(a => 
      a.titulo.toLowerCase().includes(lowerQuery) ||
      a.descricao.toLowerCase().includes(lowerQuery) ||
      a.conteudo.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    artigos,
    loading,
    error,
    saveArtigo,
    deleteArtigo,
    getArtigoById,
    getArtigosByCategoria,
    getArtigosBySubcategoria,
    searchArtigos
  };
}
