#!/bin/bash

echo "🚀 Deploying EllaTrend to Cloudflare..."

# Verificar se wrangler está instalado
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI não encontrado. Instalando..."
    npm install -g wrangler
fi

# Login na Cloudflare (se necessário)
echo "🔐 Verificando login na Cloudflare..."
wrangler whoami

# Deploy da API
echo "📡 Deploying API Worker..."
cd cloudflare
wrangler deploy

# Deploy do Frontend
echo "🌐 Deploying Frontend..."
cd ../client
npm run build

echo "✅ Deploy concluído!"
echo "📋 Próximos passos:"
echo "1. Configure o domínio na Cloudflare Pages"
echo "2. Atualize a URL da API no arquivo .env"
echo "3. Teste os contadores"

