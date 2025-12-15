import { getAllPosts } from "@content/blog";
import type { NotionBlogPost } from '@features/blog/models/NotionBlogPost';

/**
 * Genera sitemap.xml dinámicamente con todas las páginas del sitio
 * Sigue las mejores prácticas SEO y Clean Code
 */

interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

/**
 * Formatea fecha a ISO string para sitemap
 * @param date - Fecha a formatear
 * @returns Fecha en formato ISO
 */
const formatDate = (date: string | Date): string => {
  return new Date(date).toISOString();
};

/**
 * Genera entrada XML para una URL
 * @param entry - Datos de la entrada
 * @returns XML formateado
 */
const generateUrlEntry = (entry: SitemapEntry): string => {
  const { url, lastmod, changefreq = 'weekly', priority = 0.7 } = entry;
  
  let xml = `  <url>\n`;
  xml += `    <loc>${url}</loc>\n`;
  
  if (lastmod) {
    xml += `    <lastmod>${formatDate(lastmod)}</lastmod>\n`;
  }
  
  xml += `    <changefreq>${changefreq}</changefreq>\n`;
  xml += `    <priority>${priority.toFixed(1)}</priority>\n`;
  xml += `  </url>\n`;
  
  return xml;
};

/**
 * Obtiene todas las URLs estáticas del sitio
 * @param siteUrl - URL base del sitio
 * @returns Array de entradas del sitemap
 */
const getStaticPages = (siteUrl: string): SitemapEntry[] => {
  return [
    {
      url: siteUrl,
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 1.0
    },
    {
      url: `${siteUrl}/blog`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.9
    }
  ];
};

/**
 * Obtiene todos los posts del blog para el sitemap
 * @param siteUrl - URL base del sitio
 * @returns Array de entradas del blog
 */
const getBlogPosts = async (siteUrl: string): Promise<SitemapEntry[]> => {
  try {
    const posts: NotionBlogPost[] = await getAllPosts();
    
    return posts.map((post: NotionBlogPost) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastmod: post.date,
      changefreq: 'monthly' as const,
      priority: 0.8
    }));
  } catch (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
};

/**
 * Genera el sitemap XML completo
 * @returns String con el XML del sitemap
 */
export async function GET() {
  const siteUrl = 'https://carlosquinza.es';
  
  // Generar sitemap completo
  const staticPages = getStaticPages(siteUrl);
  const blogPosts = await getBlogPosts(siteUrl);
  const allEntries = [...staticPages, ...blogPosts];

  // Generar XML
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemapXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  allEntries.forEach(entry => {
    sitemapXml += generateUrlEntry(entry);
  });

  sitemapXml += `</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400'
    }
  });
}