export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;


    // 🔒 Domínios permitidos
    const origin = request.headers.get('Origin');
    const allowedOrigins = [
      'http://localhost:3000',      // Desenvolvimento local
      'https://ellatrend.com.br',      // Produção
      'https://www.ellatrend.com.br',  // Produção com www
      'https://ellatrend.pages.dev',   // Cloudflare Pages
      'https://ellatrend.awktecnologia.workers.dev' // Alias do site
    ];

    // 🔐 Configuração de CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With, X-API-Key',
      'Access-Control-Allow-Credentials': 'false' // Mudado para false por segurança
    };

    // 🛡️ Headers de Segurança ESSENCIAIS
    const securityHeaders = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://replit.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://ellatrend-api.awktecnologia.workers.dev;",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    };

    // Permitir pré-flight requests (CORS)
    if (request.method === 'OPTIONS') {
      return new Response(null, { 
        headers: { ...corsHeaders, ...securityHeaders }
      });
    }

    // 🚫 Bloquear origens não autorizadas
    if (!allowedOrigins.includes(origin)) {
      return new Response(JSON.stringify({
        error: 'Forbidden',
        message: 'Origem não autorizada'
      }), {
        status: 403,
        headers: { 
          ...corsHeaders, 
          ...securityHeaders,
          'Content-Type': 'application/json' 
        }
      });
    }

    try {
      switch (path) {
        case '/api/stats':
          return await handleStats(request, env, corsHeaders, securityHeaders);
        case '/api/view':
          return await handleView(request, env, corsHeaders, securityHeaders);
        case '/api/like':
          return await handleLike(request, env, corsHeaders, securityHeaders);
        default:
          return new Response('Not Found', { 
            status: 404, 
            headers: { ...corsHeaders, ...securityHeaders }
          });
      }
    } catch (error) {
      // Log apenas em desenvolvimento
      if (env.ENVIRONMENT === 'development') {
        console.error('API Error:', error);
      }
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 
          ...corsHeaders, 
          ...securityHeaders,
          'Content-Type': 'application/json' 
        }
      });
    }
  }
};

// Validação de dados
function validateRequest(body) {
  const { artigoId, userId, action } = body;
  
  if (!artigoId || typeof artigoId !== 'string' || artigoId.length > 100) {
    throw new Error('Artigo ID inválido');
  }
  
  if (!userId || typeof userId !== 'string' || userId.length < 3) {
    throw new Error('User ID inválido');
  }
  
  if (action && !['like', 'unlike'].includes(action)) {
    throw new Error('Ação inválida');
  }
  
  return { 
    artigoId: artigoId.trim(), 
    userId: userId.trim(), 
    action 
  };
}

// Rate limiting com Cloudflare KV (persistente e escalável)
async function checkRateLimit(ip, action, env) {
  const key = `rate_limit:${ip}:${action}`;
  const now = Date.now();
  const windowMs = parseInt(env.RATE_LIMIT_WINDOW) || 60000; // 1 minuto
  const maxRequests = action === 'view' 
    ? parseInt(env.RATE_LIMIT_VIEWS) || 5 
    : parseInt(env.RATE_LIMIT_LIKES) || 10;
  
  try {
    // Buscar dados atuais do KV
    const existingData = await env.RATE_LIMIT_KV.get(key, 'json');
    
    if (!existingData) {
      // Primeira requisição - criar entrada
      const newData = { 
        count: 1, 
        resetTime: now + windowMs,
        firstRequest: now
      };
      await env.RATE_LIMIT_KV.put(key, JSON.stringify(newData), {
        expirationTtl: Math.ceil(windowMs / 1000) // TTL em segundos
      });
      return true;
    }
    
    // Verificar se a janela expirou
    if (now > existingData.resetTime) {
      // Janela expirou - resetar contador
      const newData = { 
        count: 1, 
        resetTime: now + windowMs,
        firstRequest: now
      };
      await env.RATE_LIMIT_KV.put(key, JSON.stringify(newData), {
        expirationTtl: Math.ceil(windowMs / 1000)
      });
      return true;
    }
    
    // Verificar se excedeu o limite
    if (existingData.count >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    // Incrementar contador
    existingData.count++;
    await env.RATE_LIMIT_KV.put(key, JSON.stringify(existingData), {
      expirationTtl: Math.ceil((existingData.resetTime - now) / 1000)
    });
    
    return true;
  } catch (error) {
    // Em caso de erro no KV, permitir a requisição (fail-open)
    if (env.ENVIRONMENT === 'development') {
      console.error('Rate limit KV error:', error);
    }
    return true;
  }
}

// 🔒 Verificação de bots (sem API_KEY)
function checkBot(userAgent) {
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python/i, /java/i
  ];
  
  return botPatterns.some(pattern => pattern.test(userAgent));
}

// Obter estatísticas
async function handleStats(request, env, corsHeaders, securityHeaders) {
  const userAgent = request.headers.get('User-Agent') || '';
  
  // 🔒 Bloquear bots (exceto se tiver API key válida)
  if (checkBot(userAgent)) {
    return new Response('Forbidden', { 
      status: 403, 
      headers: { ...corsHeaders, ...securityHeaders }
    });
  }
  
  const body = await request.json();
  const { artigoId } = body;
  
  if (!artigoId || typeof artigoId !== 'string' || artigoId.length > 100) {
    throw new Error('Artigo ID inválido');
  }
  
  const [viewsData, likesData] = await Promise.all([
    env.ARTIGOS_KV.get(`article:${artigoId}:views`, 'json'),
    env.ARTIGOS_KV.get(`article:${artigoId}:likes`, 'json')
  ]);
  
  // Retornar apenas count (não mais lista de usuários - isso fica no localStorage do frontend)
  // Suportar formato antigo (com users) e novo (apenas count) para compatibilidade
  const likesCount = likesData?.count || (likesData?.users ? likesData.users.length : 0);
  
  return new Response(JSON.stringify({
    views: viewsData?.count || 0,
    likes: likesCount
  }), {
    headers: { 
      ...corsHeaders, 
      ...securityHeaders,
      'Content-Type': 'application/json' 
    }
  });
}

// Incrementar visualização (UMA POR USUÁRIO + RATE LIMITING TRANSPARENTE)
async function handleView(request, env, corsHeaders, securityHeaders) {
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  const { artigoId, userId } = validateRequest(await request.json());
  
  // Verificar se usuário já visualizou
  const userViewedKey = `user:${userId}:viewed`;
  const userViewed = await env.ARTIGOS_KV.get(userViewedKey, 'json') || [];
  
  if (userViewed.includes(artigoId)) {
    // Já visualizou - retornar stats atuais
    const viewsData = await env.ARTIGOS_KV.get(`article:${artigoId}:views`, 'json') || { count: 0 };
    return new Response(JSON.stringify({ 
      success: true, 
      views: viewsData.count,
      alreadyViewed: true
    }), {
      headers: { 
        ...corsHeaders, 
        ...securityHeaders,
        'Content-Type': 'application/json' 
      }
    });
  }
  
  // Rate limiting transparente
  if (!(await checkRateLimit(clientIP, 'view', env))) {
    // Retorna sucesso sem incrementar (proteção contra spam)
    const viewsData = await env.ARTIGOS_KV.get(`article:${artigoId}:views`, 'json') || { count: 0 };
    
    
    return new Response(JSON.stringify({ 
      success: true, 
      views: viewsData.count,
      rateLimited: true
    }), {
      headers: { 
        ...corsHeaders, 
        ...securityHeaders,
        'Content-Type': 'application/json' 
      }
    });
  }
  
  // Primeira visualização válida - incrementar
  const viewsData = await env.ARTIGOS_KV.get(`article:${artigoId}:views`, 'json') || { count: 0 };
  viewsData.count += 1;
  viewsData.lastUpdated = new Date().toISOString();
  
  await Promise.all([
    env.ARTIGOS_KV.put(`article:${artigoId}:views`, JSON.stringify(viewsData)),
    env.ARTIGOS_KV.put(userViewedKey, JSON.stringify([...userViewed, artigoId]))
  ]);
  
  return new Response(JSON.stringify({ 
    success: true, 
    views: viewsData.count,
    rateLimited: false
  }), {
    headers: { 
      ...corsHeaders, 
      ...securityHeaders,
      'Content-Type': 'application/json' 
    }
  });
}

// Gerenciar likes (RATE LIMITING TRANSPARENTE)
// NOTA: Controle de "usuário já curtiu" é feito no localStorage do frontend
// Backend apenas gerencia o count total e valida rate limiting
async function handleLike(request, env, corsHeaders, securityHeaders) {
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  const { artigoId, userId, action } = validateRequest(await request.json());
  
  // Buscar dados atuais (suportar formato antigo e novo para compatibilidade)
  const likesDataOld = await env.ARTIGOS_KV.get(`article:${artigoId}:likes`, 'json') || { count: 0 };
  
  // Migrar formato antigo (com users[]) para novo (apenas count) se necessário
  let likesData;
  if (likesDataOld.users && Array.isArray(likesDataOld.users)) {
    // Formato antigo: usar tamanho do array como count
    likesData = {
      count: likesDataOld.users.length,
      lastUpdated: likesDataOld.lastUpdated || new Date().toISOString()
    };
    // Salvar no formato novo (apenas count)
    await env.ARTIGOS_KV.put(`article:${artigoId}:likes`, JSON.stringify(likesData));
  } else {
    // Formato novo: apenas count
    likesData = {
      count: likesDataOld.count || 0,
      lastUpdated: likesDataOld.lastUpdated || new Date().toISOString()
    };
  }
  
  // Rate limiting transparente
  if (!(await checkRateLimit(clientIP, 'like', env))) {
    // Retorna sucesso sem incrementar (proteção contra spam)
    return new Response(JSON.stringify({
      count: likesData.count,
      rateLimited: true,
      success: true
    }), {
      headers: { 
        ...corsHeaders, 
        ...securityHeaders,
        'Content-Type': 'application/json' 
      }
    });
  }
  
  // Aplicar ação (like ou unlike)
  if (action === 'like') {
    likesData.count += 1;
  } else if (action === 'unlike') {
    likesData.count = Math.max(0, likesData.count - 1);
  }
  
  likesData.lastUpdated = new Date().toISOString();
  
  // Salvar apenas count (sem lista de usuários)
  await env.ARTIGOS_KV.put(`article:${artigoId}:likes`, JSON.stringify(likesData));
  
  return new Response(JSON.stringify({
    count: likesData.count,
    success: true
  }), {
    headers: { 
      ...corsHeaders, 
      ...securityHeaders,
      'Content-Type': 'application/json' 
    }
  });
}
