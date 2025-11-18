// Utilitário para gerar sitemap dinamicamente baseado nos artigos
export interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export interface Artigo {
  id: string;
  titulo: string;
  slug: string;
  dataPublicacao: string;
  categoria: string;
}

export function generateSitemapUrls(artigos: Artigo[]): SitemapUrl[] {
  const baseUrl = 'https://ellatrend.com';
  const currentDate = new Date().toISOString();
  
  // URLs estáticas principais
  const staticUrls: SitemapUrl[] = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/beleza`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/alimentacao`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/saude-mental`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/artigos`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/deals`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: 0.8
    }
  ];

  // URLs dinâmicas dos artigos
  const articleUrls: SitemapUrl[] = artigos.map(artigo => ({
    loc: `${baseUrl}/artigo/${artigo.slug}`,
    lastmod: new Date(artigo.dataPublicacao).toISOString(),
    changefreq: 'monthly',
    priority: 0.7
  }));

  return [...staticUrls, ...articleUrls];
}

export function generateSitemapXML(urls: SitemapUrl[]): string {
  const header = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  const footer = `</urlset>`;

  const urlEntries = urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  return `${header}\n${urlEntries}\n${footer}`;
}










