import { useState, useEffect } from 'react';

type DataType = 'comparativos' | 'ofertas' | 'categorias';

type JsonData = {
  comparativos?: any[];
  ofertas?: any[];
  categorias?: any[];
};

const dataMap: Record<DataType, string[]> = {
  comparativos: ['/data/comparativos/smartphones.json', '/data/comparativos/notebooks.json'],
  ofertas: ['/data/ofertas/ofertas.json'],
  categorias: ['/data/categorias/categorias.json']
};

export function useStaticData<T>(type: DataType) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allData = { [type]: [] } as JsonData;

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
          if (fileData && fileData[type]) {
            allData[type] = [...(allData[type] || []), ...fileData[type]];
          }
        });

        if (!allData[type] || allData[type].length === 0) {
          throw new Error(`Nenhum dado encontrado para ${type}`);
        }

        setData(allData as T);
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