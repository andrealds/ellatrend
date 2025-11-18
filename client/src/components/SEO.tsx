import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function SEO({
  title = 'EllaTrend - Dicas de Beleza, Bem-estar e Desenvolvimento Pessoal',
  description = 'Dicas de beleza, receitas saudáveis, bem-estar mental e desenvolvimento pessoal. Tudo para você se sentir bem e confiante.',
  keywords = 'beleza, bem-estar, desenvolvimento pessoal, receitas saudáveis, moda, alimentação, saúde mental',
  image = 'https://ellatrend.com/og-image.jpg',
  url = 'https://ellatrend.com',
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'EllaTrend',
  section,
  tags = []
}: SEOProps) {
  const fullTitle = title.includes('EllaTrend') ? title : `${title} | EllaTrend`;
  const fullDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  const fullKeywords = tags.length > 0 ? `${keywords}, ${tags.join(', ')}` : keywords;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={fullKeywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="EllaTrend" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={image} />

      {/* Article specific meta tags */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": type === 'article' ? 'Article' : 'WebPage',
          "headline": fullTitle,
          "description": fullDescription,
          "url": url,
          "image": image,
          "inLanguage": "pt-BR",
          "publisher": {
            "@type": "Organization",
            "name": "EllaTrend",
            "url": "https://ellatrend.com"
          },
          ...(type === 'article' && {
            "author": {
              "@type": "Person",
              "name": author
            },
            "datePublished": publishedTime,
            "dateModified": modifiedTime || publishedTime,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": url
            }
          })
        })}
      </script>
    </Helmet>
  );
}










