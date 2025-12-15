/**
 * Genera robots.txt con directrices para crawlers
 * Sigue las mejores prácticas SEO y Clean Code
 */

/**
 * Genera el contenido del robots.txt
 * @param siteUrl - URL base del sitio
 * @returns String con el contenido de robots.txt
 */
const generateRobotsTxt = (siteUrl: string): string => {
  const robotsTxt = `# Robots.txt para carlosquinza.es
# Generado automáticamente - ${new Date().toISOString()}

# Permitir a todos los crawlers
User-agent: *
Allow: /

# Bloquear acceso a directorios privados
Disallow: /_astro/
Disallow: /api/
Disallow: /.well-known/

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml

# Crawl-delay para reducir carga del servidor
Crawl-delay: 1

# Instrucciones específicas para bots importantes
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

# Bloquear bots no deseados
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /
`;

  return robotsTxt;
};

/**
 * Endpoint para servir robots.txt
 */
export function GET() {
  const siteUrl = 'https://carlosquinza.es';
  const robotsContent = generateRobotsTxt(siteUrl);

  return new Response(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800'
    }
  });
}