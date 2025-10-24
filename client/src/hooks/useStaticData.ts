import { useState, useEffect } from 'react';

type DataType = 'ofertas' | 'categorias' | 'artigos-beleza' | 'artigos-saude-mental' | 'artigos-alimentacao' | 'todos-os-artigos' | 'stories-moda' | 'stories-beleza' | 'stories-alimentacao' | 'stories-saude-mental' | 'artigos-por-horario';

type JsonData = {
  ofertas?: any[];
  categorias?: any[];
  artigos?: any[];
  stories?: any[];
};

// Função para misturar artigos de forma aleatória baseada no horário
const shuffleArray = <T>(array: T[], seed?: number): T[] => {
  const shuffled = [...array];
  // Usar seed para garantir que a mesma ordem seja mantida durante o mesmo horário
  const randomSeed = seed || Math.floor(Date.now() / (1000 * 60 * 60)); // Muda a cada hora
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor((randomSeed + i) % (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
    'stories-saude-mental': ['/data/stories/stories-saude-mental.json'],
    'artigos-por-horario': ['/data/artigos/artigos-beleza.json', '/data/artigos/artigos-saude-mental.json', '/data/artigos/artigos-alimentacao.json']
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

        // Para artigos-por-horario, carregar todos os arquivos de artigos
        let filesToLoad = dataMap[type];
        if (type === 'artigos-por-horario') {
          filesToLoad = ['/data/artigos/artigos-beleza.json', '/data/artigos/artigos-saude-mental.json', '/data/artigos/artigos-alimentacao.json'];
        }

        // Buscar dados de todos os arquivos do tipo
        const fetchPromises = filesToLoad.map(file => 
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
        // Para artigos-beleza, artigos-saude-mental, artigos-alimentacao, todos-os-artigos e artigos-por-horario, procurar por 'artigos' no JSON
        if (type === 'artigos-beleza' || type === 'artigos-saude-mental' || type === 'artigos-alimentacao' || type === 'todos-os-artigos' || type === 'artigos-por-horario') {
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
          if (fileData[type as keyof typeof fileData]) {
            (allData as any)[type] = [...((allData as any)[type] || []), ...fileData[type as keyof typeof fileData]];
          }
        }
          }
        });


        if (type === 'artigos-beleza' || type === 'artigos-saude-mental' || type === 'artigos-alimentacao' || type === 'todos-os-artigos' || type === 'artigos-por-horario') {
          if (!allData.artigos || allData.artigos.length === 0) {
            throw new Error(`Nenhum dado encontrado para ${type}`);
          }
        } else if (type.startsWith('stories-')) {
          if (!allData.stories || allData.stories.length === 0) {
            throw new Error(`Nenhum dado encontrado para ${type}`);
          }
        } else {
          if (!(allData as any)[type] || (allData as any)[type].length === 0) {
            throw new Error(`Nenhum dado encontrado para ${type}`);
          }
        }

        // Para artigos-beleza, artigos-saude-mental, artigos-alimentacao e todos-os-artigos, retornar com a chave 'artigos'
        if (type === 'artigos-beleza' || type === 'artigos-saude-mental' || type === 'artigos-alimentacao' || type === 'todos-os-artigos') {
          const result = { artigos: allData.artigos } as T;
          setData(result);
        } else if (type === 'artigos-por-horario') {
          // Para artigos-por-horario, gerar dois conjuntos diferentes de artigos baseados no horário e data
          const now = new Date();
          const hour = now.getHours(); // Usar hora real do sistema
          
          // Determinar o período do dia para usar como seed
          let periodoBase = 0;
          if (hour >= 6 && hour < 12) {
            periodoBase = 1; // Manhã
          } else if (hour >= 12 && hour < 18) {
            periodoBase = 2; // Tarde
          } else {
            periodoBase = 3; // Noite
          }
          
          // Combinar data + horário para criar seed único diário
          const today = now.toDateString(); // "Mon Jan 15 2024"
          const dataHash = today.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
          }, 0);
          
          // Seed base: combina período + data
          const seedBase = periodoBase + Math.abs(dataHash);
          
          const artigosBeleza = (allData.artigos || []).filter(artigo => artigo.categoria === 'Beleza');
          const artigosSaude = (allData.artigos || []).filter(artigo => artigo.categoria === 'Saúde Mental');
          const artigosAlimentacao = (allData.artigos || []).filter(artigo => artigo.categoria === 'Alimentação');
          
          // Gerar primeiro conjunto (Carrossel) - seed base
          const selecionadosBeleza1 = shuffleArray(artigosBeleza, seedBase).slice(0, 4);
          const selecionadosSaude1 = shuffleArray(artigosSaude, seedBase).slice(0, 4);
          const selecionadosAlimentacao1 = shuffleArray(artigosAlimentacao, seedBase).slice(0, 4);
          const artigosSelecionados1 = [...selecionadosBeleza1, ...selecionadosSaude1, ...selecionadosAlimentacao1];
          const artigosCarrossel = shuffleArray(artigosSelecionados1, seedBase);
          
          // Gerar segundo conjunto (Ella Conteúdo) - seed base + 1000 para garantir diferença
          const seedConteudo = seedBase + 1000;
          const selecionadosBeleza2 = shuffleArray(artigosBeleza, seedConteudo).slice(0, 4);
          const selecionadosSaude2 = shuffleArray(artigosSaude, seedConteudo).slice(0, 4);
          const selecionadosAlimentacao2 = shuffleArray(artigosAlimentacao, seedConteudo).slice(0, 4);
          const artigosSelecionados2 = [...selecionadosBeleza2, ...selecionadosSaude2, ...selecionadosAlimentacao2];
          const artigosConteudo = shuffleArray(artigosSelecionados2, seedConteudo);
          
          const result = { 
            artigosCarrossel: artigosCarrossel,
            artigosConteudo: artigosConteudo,
            artigos: artigosCarrossel // Manter compatibilidade com código existente
          } as T;
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