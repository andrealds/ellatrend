# Vitrine Unificada - Planejamento de Implementação

## 📋 Visão Geral

Sistema de vitrine unificada para exibir os conteúdos mais recentes e populares de todas as categorias (beleza, saúde, receitas, etc.) sem duplicação de conteúdo, seguindo o padrão dos principais portais de conteúdo.

## 🎯 Objetivos

- **Vitrine Centralizada**: Exibir conteúdos de todas as categorias em um só lugar
- **Sem Duplicação**: Evitar conteúdo repetido entre seções
- **Priorização Inteligente**: Mostrar conteúdos mais relevantes primeiro
- **Performance**: Cache otimizado para carregamento rápido
- **Escalabilidade**: Fácil adição de novas categorias

## 🏗️ Arquitetura Proposta

### 1. Estrutura de Dados

#### Opção A - Arquivo Master (Recomendada)
```json
// client/public/data/vitrine.json
{
  "destaques": [
    {
      "id": "1",
      "tipo": "artigo",
      "categoria": "beleza",
      "titulo": "Rotina de Skincare Matinal: 5 Passos para uma Pele Perfeita",
      "slug": "rotina-skincare-matinal-5-passos",
      "fonte": "artigos-beleza",
      "prioridade": 1,
      "dataPublicacao": "2024-01-15T09:00:00Z",
      "visualizacoes": 2500,
      "curtidas": 150,
      "destaque": true
    },
    {
      "id": "2",
      "tipo": "receita",
      "categoria": "saude",
      "titulo": "Smoothie Verde Energético: Receita que Acelera o Metabolismo",
      "slug": "smoothie-verde-energetico",
      "fonte": "receitas-saude",
      "prioridade": 2,
      "dataPublicacao": "2024-01-14T10:00:00Z",
      "visualizacoes": 1800,
      "curtidas": 95,
      "destaque": false
    }
  ]
}
```

#### Opção B - API Unificada
```typescript
// hooks/useVitrine.ts
export const useVitrine = () => {
  const { data: beleza } = useStaticData("artigos-beleza");
  const { data: saude } = useStaticData("artigos-saude");
  const { data: receitas } = useStaticData("receitas");
  
  const vitrine = useMemo(() => {
    const todos = [
      ...beleza?.artigos?.map(item => ({...item, fonte: 'beleza'})),
      ...saude?.artigos?.map(item => ({...item, fonte: 'saude'})),
      ...receitas?.receitas?.map(item => ({...item, fonte: 'receitas'}))
    ];
    
    return todos
      .sort((a, b) => calcularPrioridade(b) - calcularPrioridade(a))
      .slice(0, 12);
  }, [beleza, saude, receitas]);
  
  return { vitrine, loading: !beleza || !saude || !receitas };
};
```

### 2. Sistema de Priorização

```typescript
// utils/vitrineUtils.ts
export const calcularPrioridade = (item) => {
  let score = 0;
  
  // Destaque = +100 pontos
  if (item.destaque) score += 100;
  
  // Visualizações = +1 ponto por 100 views
  score += Math.floor((item.visualizacoes || 0) / 100);
  
  // Curtidas = +2 pontos por curtida
  score += (item.curtidas || 0) * 2;
  
  // Recência = +10 pontos por dia desde publicação (máximo 30 dias)
  const diasDesdePublicacao = Math.floor(
    (Date.now() - new Date(item.dataPublicacao).getTime()) / (1000 * 60 * 60 * 24)
  );
  score += Math.max(0, 30 - diasDesdePublicacao) * 2;
  
  // Categoria específica = bônus
  const bonusCategoria = {
    'beleza': 5,
    'saude': 3,
    'receitas': 2
  };
  score += bonusCategoria[item.categoria] || 0;
  
  return score;
};
```

### 3. Componente Vitrine

```typescript
// components/VitrineUnificada.tsx
interface VitrineItem {
  id: string;
  tipo: 'artigo' | 'receita' | 'video';
  categoria: string;
  titulo: string;
  slug: string;
  fonte: string;
  imagemDestaque: string;
  descricao: string;
  dataPublicacao: string;
  visualizacoes: number;
  curtidas: number;
  destaque: boolean;
}

export default function VitrineUnificada({ limite = 12, categoria = null }) {
  const { vitrine, loading } = useVitrine();
  
  const getRota = (item: VitrineItem) => {
    switch(item.fonte) {
      case 'beleza': return `/artigo/${item.slug}`;
      case 'saude': return `/artigo/${item.slug}`;
      case 'receitas': return `/receita/${item.slug}`;
      default: return `/artigo/${item.slug}`;
    }
  };
  
  const getCategoria = (item: VitrineItem) => {
    return item.categoria || item.fonte;
  };
  
  const getCategoriaColor = (categoria: string) => {
    const cores = {
      'beleza': 'bg-pink-100 text-pink-800',
      'saude': 'bg-green-100 text-green-800',
      'receitas': 'bg-orange-100 text-orange-800',
      'desenvolvimento': 'bg-purple-100 text-purple-800'
    };
    return cores[categoria] || 'bg-gray-100 text-gray-800';
  };
  
  const itensFiltrados = categoria 
    ? vitrine.filter(item => item.categoria === categoria)
    : vitrine;
  
  if (loading) {
    return <VitrineSkeleton limite={limite} />;
  }
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {itensFiltrados.slice(0, limite).map((item) => (
        <Card key={`${item.fonte}-${item.id}`} className="group hover:shadow-xl transition-all duration-300">
          <Link to={getRota(item)}>
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={item.imagemDestaque} 
                alt={item.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <Badge className={getCategoriaColor(getCategoria(item))}>
                  {getCategoria(item)}
                </Badge>
              </div>
              {item.destaque && (
                <div className="absolute top-3 right-3">
                  <Badge variant="destructive">Destaque</Badge>
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                {item.titulo}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {item.descricao}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(item.dataPublicacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{item.visualizacoes?.toLocaleString() || '0'}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>{item.curtidas || '0'}</span>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
```

### 4. Cache Inteligente

```typescript
// hooks/useVitrineCache.ts
export const useVitrineCache = () => {
  const [cache, setCache] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
  
  const shouldRefresh = () => {
    if (!lastUpdate) return true;
    const now = Date.now();
    return (now - lastUpdate) > CACHE_DURATION;
  };
  
  const refreshCache = async () => {
    if (shouldRefresh()) {
      const vitrine = await fetchVitrineData();
      setCache(vitrine);
      setLastUpdate(Date.now());
    }
  };
  
  const getVitrine = () => {
    refreshCache();
    return cache;
  };
  
  return { getVitrine, refreshCache };
};
```

### 5. Filtros e Ordenação

```typescript
// components/VitrineFilters.tsx
export default function VitrineFilters({ onFilterChange, activeFilter }) {
  const filters = [
    { id: 'todos', label: 'Todos', icon: Grid3X3 },
    { id: 'beleza', label: 'Beleza', icon: Sparkles },
    { id: 'saude', label: 'Saúde', icon: Heart },
    { id: 'receitas', label: 'Receitas', icon: ChefHat },
    { id: 'desenvolvimento', label: 'Desenvolvimento', icon: TrendingUp }
  ];
  
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            activeFilter === filter.id
              ? 'bg-primary text-white shadow-lg'
              : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
          }`}
        >
          <filter.icon className="h-4 w-4 mr-2 inline" />
          {filter.label}
        </button>
      ))}
    </div>
  );
}
```

## 📁 Estrutura de Arquivos

```
client/src/
├── components/
│   ├── VitrineUnificada.tsx
│   ├── VitrineFilters.tsx
│   └── VitrineSkeleton.tsx
├── hooks/
│   ├── useVitrine.ts
│   └── useVitrineCache.ts
├── utils/
│   └── vitrineUtils.ts
└── types/
    └── vitrine.ts
```

## 🚀 Implementação em Etapas

### Fase 1: Estrutura Base
1. Criar arquivo `vitrine.json` com dados unificados
2. Implementar hook `useVitrine`
3. Criar componente `VitrineUnificada`

### Fase 2: Sistema de Priorização
1. Implementar `calcularPrioridade`
2. Adicionar sistema de cache
3. Testar performance

### Fase 3: Filtros e UX
1. Implementar filtros por categoria
2. Adicionar ordenação (data, popularidade, etc.)
3. Implementar skeleton loading

### Fase 4: Otimizações
1. Implementar cache inteligente
2. Adicionar paginação
3. Otimizar para mobile

## 🔧 Configurações

### Variáveis de Ambiente
```env
VITRINE_CACHE_DURATION=300000  # 5 minutos
VITRINE_MAX_ITEMS=12
VITRINE_REFRESH_INTERVAL=60000  # 1 minuto
```

### Configurações do Sistema
```typescript
// config/vitrine.ts
export const VITRINE_CONFIG = {
  maxItems: 12,
  cacheDuration: 5 * 60 * 1000,
  refreshInterval: 60 * 1000,
  categories: ['beleza', 'saude', 'receitas', 'desenvolvimento'],
  priorityWeights: {
    destaque: 100,
    visualizacoes: 1,
    curtidas: 2,
    recencia: 2
  }
};
```

## 📊 Métricas e Analytics

### Eventos a Rastrear
- `vitrine_item_click`: Clique em item da vitrine
- `vitrine_filter_use`: Uso de filtros
- `vitrine_load_time`: Tempo de carregamento
- `vitrine_cache_hit`: Cache hit rate

### KPIs Importantes
- **Engagement Rate**: Clicks / Impressions
- **Cache Hit Rate**: Performance
- **Filter Usage**: Popularidade de categorias
- **Load Time**: Performance geral

## 🎯 Benefícios Esperados

1. **UX Melhorada**: Conteúdo relevante em destaque
2. **Performance**: Cache otimizado
3. **Escalabilidade**: Fácil adição de categorias
4. **Manutenibilidade**: Código organizado e modular
5. **Analytics**: Dados precisos de engajamento

## 📝 Próximos Passos

1. **Aprovação do Planejamento**: Revisar e aprovar esta arquitetura
2. **Criação dos Arquivos**: Implementar estrutura base
3. **Testes**: Validar com dados reais
4. **Deploy**: Implementar em produção
5. **Monitoramento**: Acompanhar métricas e otimizar

---

**Data de Criação**: Janeiro 2024  
**Versão**: 1.0  
**Status**: Planejamento  
**Próxima Revisão**: Após implementação da Fase 1
