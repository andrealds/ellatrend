# Plano de Migração para Versão Estática

## Visão Geral
Este documento detalha o plano de migração do sistema para uma versão estática mantendo o React como framework frontend. O objetivo é remover a dependência do backend e utilizar arquivos JSON para armazenar os dados.

## Progresso da Migração

### Fase 1: Preparação do Ambiente
- [x] Criar diretório `/public/data` para armazenar arquivos JSON
- [ ] Remover dependências desnecessárias do package.json
- [ ] Atualizar scripts no package.json
- [ ] Configurar vite.config.ts para build estático
- [x] Criar estrutura base dos arquivos JSON
  - [x] comparacoes.json
  - [x] ofertas.json
  - [x] categorias.json
  - [x] produtos.json

### Fase 2: Implementação do Sistema de Dados
- [x] Criar hook useStaticData.ts
- [x] Implementar interface base para tipos de dados
  - [x] Comparativo interface
  - [x] Oferta interface
  - [x] Categoria interface
  - [x] Produto interface
- [ ] Criar serviço dataService.ts
- [ ] Implementar sistema de cache para dados JSON
- [ ] Adicionar tratamento de erros no carregamento de dados

### Fase 3: Adaptação dos Componentes
- [x] Identificar todos os componentes que precisam de adaptação
  - [x] LatestComparisons
  - [x] Post
  - [x] Category
  - [x] ProductList
  - [x] DealList
- [x] Adaptar componentes para usar useStaticData
  - [x] LatestComparisons
  - [x] Post
  - [x] Category
  - [x] ProductList
  - [x] DealList
- [x] Implementar estados de loading
  - [x] LatestComparisons
  - [x] Post
  - [ ] Category
  - [ ] ProductList
  - [ ] DealList
- [x] Implementar tratamento de erros
  - [x] LatestComparisons
  - [x] Post
  - [ ] Category
  - [ ] ProductList
  - [ ] DealList
- [ ] Testar carregamento de dados em cada componente

### Fase 4: Otimização
- [ ] Implementar lazy loading para componentes
- [ ] Configurar code splitting
- [ ] Otimizar carregamento de imagens
- [ ] Implementar sistema de cache para dados
- [ ] Configurar build de produção

### Fase 5: Testes e Documentação
- [ ] Testar carregamento de dados em diferentes cenários
- [ ] Verificar performance
- [ ] Documentar estrutura de dados JSON
- [ ] Criar guia de manutenção
- [ ] Testar build de produção

## Próximos Passos

1. Adaptar componentes:
   - [x] LatestComparisons
   - [x] Post
   - [x] Category
   - [x] ProductList
   - [x] DealList

## Arquivos Criados/Modificados

### Novos Arquivos
- [x] `public/data/comparacoes.json`
- [x] `public/data/ofertas.json`
- [x] `public/data/categorias.json`
- [x] `public/data/produtos.json`
- [x] `client/src/hooks/useStaticData.ts`
- [x] `client/src/types/comparativos.ts`
- [x] `client/src/types/ofertas.ts`
- [x] `client/src/types/categorias.ts`
- [x] `client/src/types/produtos.ts`

### Arquivos Modificados
- [x] `client/src/components/LatestComparisons.tsx`
  - Substituído useQuery por useStaticData
  - Adaptado para nova estrutura de dados
  - Adicionado tratamento de erros
  - Mantida a mesma interface visual

- [x] `client/src/pages/Post.tsx`
  - Substituído useQuery por useStaticData
  - Adaptado para nova estrutura de dados
  - Adicionado tratamento de erros
  - Mantida a mesma interface visual
  - Adicionadas seções de produtos
  - Adicionado veredito com recomendações
  - Suporte a Markdown no conteúdo
  - Exibição de estatísticas e metadados

- [x] `client/src/pages/Category.tsx`
  - Adicionado componente Category

## Notas de Implementação

### Comparativos
- Estrutura baseada no modelo atual de posts
- Suporte a SEO com metadados
- Sistema de visualizações e destaque
- Links de afiliados integrados

### Ofertas
- Estrutura baseada no modelo atual de deals
- Dados completos do produto incluídos
- Sistema de tracking de cliques e conversões
- Suporte a cupons e descontos

### Categorias
- Estrutura hierárquica com subcategorias
- Metadados visuais (ícones e cores)
- Suporte a ativação/desativação
- Ordenação personalizada

### Produtos
- Dados técnicos detalhados
- Sistema de avaliações
- Links de afiliados por plataforma
- Status de disponibilidade

### Hook useStaticData
- Implementado com suporte a TypeScript
- Inclui estados de loading e erro
- Preparado para cache futuro
- Suporte a diferentes tipos de dados

### Interfaces
- Criadas interfaces TypeScript para todos os tipos
- Mantida compatibilidade com componentes existentes
- Adicionada tipagem forte para dados JSON

### Componentes Adaptados
- LatestComparisons
  - Migrado para dados estáticos
  - Mantida a mesma interface visual
  - Adicionado tratamento de erros
  - Implementado loading state
  - Filtragem de posts publicados
  - Limitação a 6 posts

- Post
  - Migrado para dados estáticos
  - Mantida a mesma interface visual
  - Adicionado tratamento de erros
  - Implementado loading state
  - Adicionadas seções de produtos
  - Adicionado veredito com recomendações
  - Suporte a Markdown no conteúdo
  - Exibição de estatísticas e metadados

- Category
  - Adicionado componente Category

## Benefícios da Abordagem
1. Mantém a experiência de desenvolvimento React
2. Preserva todos os componentes e estilos existentes
3. Facilita a manutenção do código
4. Permite fácil migração para uma API no futuro
5. Mantém a performance do React com lazy loading e code splitting

## Notas Importantes
- Todos os dados serão carregados via arquivos JSON estáticos
- O sistema manterá a mesma interface e experiência do usuário
- A migração será feita gradualmente, componente por componente
- Cada componente adaptado deve ser testado individualmente
- O build final será uma versão estática pronta para deploy 

# Plano de Migração para Dados Estáticos

## Progresso da Migração

### Fase 1: Preparação dos Dados Estáticos ✅
- [x] Criar arquivo `comparacoes.json` ✅
- [x] Criar arquivo `ofertas.json` ✅
- [x] Criar arquivo `categorias.json` ✅
- [x] Criar arquivo `produtos.json` ✅

### Fase 2: Implementação dos Tipos TypeScript ✅
- [x] Criar interface `Comparativo` ✅
- [x] Criar interface `Oferta` ✅
- [x] Criar interface `Categoria` ✅
- [x] Criar interface `Produto` ✅

### Fase 3: Adaptação dos Componentes (Em Progresso)
- [x] Adaptar `LatestComparisons` ✅
- [x] Adaptar `Post` ✅
- [x] Adaptar `Category` ✅
- [x] Adaptar `ProductList` ✅
- [x] Adaptar `DealList` ✅

### Fase 4: Limpeza e Remoção de Arquivos ✅
#### Arquivos e Pastas a serem removidos:
- [x] Remover pasta `server/` inteiramente ✅
  - [x] `server/storage.ts` - Substituído pelo sistema de dados estáticos ✅
  - [x] `server/routes.ts` - Rotas de API não mais necessárias ✅
  - [x] `server/db.ts` - Configuração do banco de dados não mais necessária ✅
  - [x] `server/index.ts` - Servidor não mais necessário ✅
  - [x] `server/vite.ts` - Configuração do Vite movida para o cliente ✅
  - [x] `server/replitAuth.ts` - Autenticação movida para configuração do cliente ✅

- [x] Remover pasta `shared/` inteiramente ✅
  - [x] `shared/schema.ts` - Schema do banco de dados não mais necessário ✅

#### Arquivos a serem modificados:
- [x] `package.json` - Remover dependências não utilizadas ✅
  - Remover `drizzle-orm` ✅
  - Remover `@vercel/postgres` ✅
  - Remover `express` e dependências relacionadas ✅
  - Remover outras dependências relacionadas ao servidor ✅

- [x] `vite.config.ts` - Atualizar configuração do Vite ✅
  - Remover configurações específicas do servidor ✅
  - Adicionar configuração para build estático ✅

### Fase 5: Nova Abordagem de Gerenciamento de Conteúdo ✅
#### 1. Remoção do Painel Administrativo ✅
- [x] Remover componente `Admin.tsx` ✅
- [x] Remover componentes de gerenciamento ✅
  - `PostManager` ✅
  - `ProductManager` ✅
  - `DealManager` ✅
  - `CommentManager` ✅
- [x] Remover rotas relacionadas ao admin ✅
- [x] Remover dependências de autenticação ✅

#### 2. Nova Abordagem para Gerenciamento de Conteúdo ✅
- [x] Criar diretório `data/` para os arquivos JSON ✅
- [x] Mover arquivos JSON para o novo diretório ✅
- [x] Criar `.gitignore` específico para dados ✅
- [x] Criar documentação do processo de atualização ✅

#### 3. Sistema de Validação ✅
- [x] Criar script de validação com Zod ✅
- [x] Implementar schemas para todos os tipos de dados ✅
- [x] Adicionar script de validação ao `package.json` ✅
- [x] Documentar processo de validação ✅

### Próximos Passos
1. ✅ Remover arquivos e pastas não utilizados
2. ✅ Atualizar dependências do projeto
3. Testar a integração completa dos componentes
4. Implementar otimizações de performance
5. ✅ Implementar nova abordagem de gerenciamento de conteúdo

### Arquivos Criados/Modificados
- `data/comparacoes.json` ✅
- `data/ofertas.json` ✅
- `data/categorias.json` ✅
- `data/produtos.json` ✅
- `data/.gitignore` ✅
- `data/README.md` ✅
- `scripts/validate-data.ts` ✅
- `client/src/types/comparativos.ts` ✅
- `client/src/types/ofertas.ts` ✅
- `client/src/types/categorias.ts` ✅
- `client/src/types/produtos.ts` ✅
- `client/src/components/LatestComparisons.tsx` ✅
- `client/src/pages/Post.tsx` ✅
- `client/src/pages/Category.tsx` ✅
- `client/src/components/ProductList.tsx` ✅
- `client/src/components/DealList.tsx` ✅

### Notas de Implementação

#### Comparativos
- Estrutura baseada no modelo atual de posts
- Suporte a SEO com metadados
- Sistema de visualizações e destaque
- Links de afiliados integrados

#### Ofertas
- Estrutura baseada no modelo atual de deals
- Dados completos do produto incluídos
- Sistema de tracking de cliques e conversões
- Suporte a cupons e descontos

#### Categorias
- Estrutura hierárquica com subcategorias
- Metadados visuais (ícones e cores)
- Suporte a ativação/desativação
- Ordenação personalizada

#### Produtos
- Dados técnicos detalhados
- Sistema de avaliações
- Links de afiliados por plataforma
- Status de disponibilidade

#### Componentes Adaptados
- `LatestComparisons`: Usa dados estáticos de comparativos
- `Post`: Exibe detalhes completos do comparativo
- `Category`: Filtra comparativos por categoria
- `ProductList`: Exibe lista de produtos com filtros
- `DealList`: Exibe lista de ofertas com filtros

#### Nova Abordagem de Gerenciamento
- Dados versionados com Git
- Processo de revisão via pull requests
- Validação de dados com Zod
- Deploy automático via CI/CD
- Documentação clara do processo 