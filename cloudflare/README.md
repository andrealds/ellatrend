# EllaTrend API - Cloudflare Worker

API para contadores de visualizações e likes do EllaTrend, hospedada na Cloudflare Workers.

## 🚀 Deploy

### 1. Instalar Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Login na Cloudflare
```bash
wrangler login
```

### 3. Configurar KV Storage
```bash
# Criar namespace de produção
wrangler kv:namespace create "ARTIGOS_KV"

# Criar namespace de preview
wrangler kv:namespace create "ARTIGOS_KV" --preview
```

### 4. Atualizar wrangler.toml
Substitua `your-kv-namespace-id` e `your-preview-kv-namespace-id` pelos IDs retornados no passo anterior.

### 5. Deploy
```bash
wrangler deploy
```

## 📡 Endpoints

### GET /api/stats
Obtém estatísticas de um artigo.

**Request:**
```json
{
  "artigoId": "beleza-1"
}
```

**Response:**
```json
{
  "views": 1234,
  "likes": 56,
  "likedUsers": ["user_abc123", "user_def456"]
}
```

### POST /api/view
Incrementa visualização de um artigo (uma por usuário).

**Request:**
```json
{
  "artigoId": "beleza-1",
  "userId": "user_abc123"
}
```

**Response:**
```json
{
  "success": true,
  "views": 1235,
  "alreadyViewed": false
}
```

### POST /api/like
Gerencia likes de um artigo (um por usuário).

**Request:**
```json
{
  "artigoId": "beleza-1",
  "userId": "user_abc123",
  "action": "like"
}
```

**Response:**
```json
{
  "count": 57,
  "users": ["user_abc123", "user_def456"],
  "success": true
}
```

## 🔒 Segurança

- **Rate Limiting**: 5 views/min, 10 likes/min por IP
- **Validação de Dados**: Sanitização de inputs
- **Controle de Duplicatas**: Uma visualização/like por usuário
- **Detecção de Bots**: Bloqueio de crawlers conhecidos
- **CORS**: Configurado para domínios permitidos

## 📊 Monitoramento

Logs são salvos automaticamente no Cloudflare Dashboard:
- Rate limiting excedido
- Bots detectados
- Erros de API
- Estatísticas de uso

