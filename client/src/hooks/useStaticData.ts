import { useState, useEffect } from 'react';

type DataType = 'ofertas' | 'categorias' | 'artigos-beleza' | 'artigos-saude-mental' | 'artigos-alimentacao' | 'todos-os-artigos' | 'stories-moda' | 'stories-beleza' | 'stories-alimentacao' | 'stories-saude-mental';

type JsonData = {
  ofertas?: any[];
  categorias?: any[];
  artigos?: any[];
  stories?: any[];
};

  const dataMap: Record<DataType, string[]> = {
    ofertas: ['/data/ofertas/ofertas-ellatrend.json'],
    categorias: ['/data/categorias/categorias.json'],
    'artigos-beleza': ['/data/artigos/artigos-beleza.json'],
    'artigos-saude-mental': ['/data/artigos/artigos-saude-mental.json'],
    'artigos-alimentacao': ['/data/artigos/artigos-alimentacao.json'],
    'todos-os-artigos': ['/data/artigos/artigos-beleza.json', '/data/artigos/artigos-saude-mental.json', '/data/artigos/artigos-alimentacao.json'],
    'stories-moda': ['/data/stories/stories-moda.json'],
    'stories-beleza': ['/data/stories/stories-beleza.json'],
    'stories-alimentacao': ['/data/stories/stories-alimentacao.json'],
    'stories-saude-mental': ['/data/stories/stories-saude-mental.json']
  };

export function useStaticData<T>(type: DataType) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allData: JsonData = {};

        // Buscar dados de todos os arquivos do tipo
        const files = dataMap[type];
        const fetchPromises = files.map(file => 
          fetch(file)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Erro ao carregar ${file}`);
              }
              return response.json();
            })
        );

        const results = await Promise.all(fetchPromises);
        
        // Combinar dados de todos os arquivos
        results.forEach(fileData => {
          if (fileData) {
        // Para artigos-beleza, artigos-saude-mental, artigos-alimentacao e todos-os-artigos, procurar por 'artigos' no JSON
        if (type === 'artigos-beleza' || type === 'artigos-saude-mental' || type === 'artigos-alimentacao' || type === 'todos-os-artigos') {
          if (fileData['artigos']) {
            allData.artigos = [...(allData.artigos || []), ...fileData['artigos']];
          }
        } 
        // Para stories, procurar por 'stories' no JSON
        else if (type.startsWith('stories-')) {
          if (fileData['stories']) {
            allData.stories = [...(allData.stories || []), ...fileData['stories']];
          }
        } else {
          if (fileData[type]) {
            allData[type] = [...(allData[type] || []), ...fileData[type]];
          }
        }
          }
        });


        if (type === 'artigos-beleza' || type === 'artigos-saude-mental' || type === 'artigos-alimentacao' || type === 'todos-os-artigos') {
          if (!allData.artigos || allData.artigos.length === 0) {
            throw new Error(`Nenhum dado encontrado para ${type}`);
          }
        } else if (type.startsWith('stories-')) {
          if (!allData.stories || allData.stories.length === 0) {
            throw new Error(`Nenhum dado encontrado para ${type}`);
          }
        } else {
          if (!allData[type] || allData[type].length === 0) {
            throw new Error(`Nenhum dado encontrado para ${type}`);
          }
        }

        // Para artigos-beleza, artigos-saude-mental, artigos-alimentacao e todos-os-artigos, retornar com a chave 'artigos'
        if (type === 'artigos-beleza' || type === 'artigos-saude-mental' || type === 'artigos-alimentacao' || type === 'todos-os-artigos') {
          const result = { artigos: allData.artigos } as T;
          setData(result);
        } else if (type.startsWith('stories-')) {
          const result = { stories: allData.stories } as T;
          setData(result);
        } else {
          setData(allData as T);
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError(err instanceof Error ? err : new Error('Erro desconhecido'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  return { data, loading, error };
} 