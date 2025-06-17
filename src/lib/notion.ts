import { Client } from '@notionhq/client';
import { NotionRenderer } from '@notion-render/client';

const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});

const DATABASE_ID = import.meta.env.NOTION_DATABASE_ID;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  coverImage: string;
  tags: string[];
  content: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getCoverImage(page: any): string {
  // Primero intentar obtener la imagen de la propiedad CoverImage
  const coverImage = page.properties.CoverImage?.files?.[0];
  if (coverImage) {
    if (coverImage.type === 'external') {
      return coverImage.external.url;
    }
    if (coverImage.type === 'file') {
      return coverImage.file.url;
    }
  }

  // Si no hay imagen en CoverImage, intentar obtener la imagen de portada de la página
  if (page.cover) {
    if (page.cover.type === 'external') {
      return page.cover.external.url;
    }
    if (page.cover.type === 'file') {
      return page.cover.file.url;
    }
  }

  // Si no hay imagen, devolver una imagen por defecto
  return '/src/assets/first_img.png';
}

async function getPageContent(pageId: string): Promise<string> {
  try {
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    let content = '';
    for (const block of blocks.results) {
      if (!block || !block.type) continue;

      try {
        switch (block.type) {
          case 'paragraph':
            if (block.paragraph?.rich_text) {
              content += `<p>${block.paragraph.rich_text.map((text: any) => text.plain_text || '').join('')}</p>`;
            }
            break;

          case 'heading_1':
            if (block.heading_1?.rich_text) {
              content += `<h1>${block.heading_1.rich_text.map((text: any) => text.plain_text || '').join('')}</h1>`;
            }
            break;

          case 'heading_2':
            if (block.heading_2?.rich_text) {
              content += `<h2>${block.heading_2.rich_text.map((text: any) => text.plain_text || '').join('')}</h2>`;
            }
            break;

          case 'heading_3':
            if (block.heading_3?.rich_text) {
              content += `<h3>${block.heading_3.rich_text.map((text: any) => text.plain_text || '').join('')}</h3>`;
            }
            break;

          case 'bulleted_list_item':
            if (block.bulleted_list_item?.rich_text) {
              content += `<li>${block.bulleted_list_item.rich_text.map((text: any) => text.plain_text || '').join('')}</li>`;
            }
            break;

          case 'numbered_list_item':
            if (block.numbered_list_item?.rich_text) {
              content += `<li>${block.numbered_list_item.rich_text.map((text: any) => text.plain_text || '').join('')}</li>`;
            }
            break;

          case 'image':
            if (block.image) {
              const imageUrl = block.image.type === 'external' 
                ? block.image.external?.url 
                : block.image.file?.url;
              if (imageUrl) {
                content += `<img src="${imageUrl}" alt="Imagen del post" />`;
              }
            }
            break;

          case 'code':
            if (block.code?.rich_text) {
              content += `<pre><code>${block.code.rich_text.map((text: any) => text.plain_text || '').join('')}</code></pre>`;
            }
            break;

          case 'quote':
            if (block.quote?.rich_text) {
              content += `<blockquote>${block.quote.rich_text.map((text: any) => text.plain_text || '').join('')}</blockquote>`;
            }
            break;

          case 'callout':
            if (block.callout?.rich_text) {
              content += `<div class="callout">${block.callout.rich_text.map((text: any) => text.plain_text || '').join('')}</div>`;
            }
            break;

          case 'divider':
            content += '<hr />';
            break;

          case 'table':
            if (block.table?.rows) {
              const rows = block.table.rows.map((row: any) => {
                if (!row.cells) return '';
                const cells = row.cells.map((cell: any) => {
                  const cellText = cell.rich_text?.map((text: any) => text.plain_text || '').join('') || '';
                  return `<td>${cellText}</td>`;
                }).join('');
                return `<tr>${cells}</tr>`;
              }).join('');
              content += `<table>${rows}</table>`;
            }
            break;
        }
      } catch (error) {
        console.warn(`Error processing block of type ${block.type}:`, error);
        continue;
      }
    }
    return content;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return '';
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    if (!DATABASE_ID) {
      console.error('NOTION_DATABASE_ID is not defined');
      return [];
    }

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: 'Estado',
            status: {
              equals: 'Publicado'
            }
          },
          {
            property: 'Titulo',
            title: {
              is_not_empty: true
            }
          }
        ]
      },
      sorts: [
        {
          property: 'Published Date',
          direction: 'descending',
        },
      ],
    });

    if (!response.results || response.results.length === 0) {
      console.log('No published posts found in Notion database');
      return [];
    }

    const posts = await Promise.all(response.results.map(async (page: any) => {
      try {
        const properties = page.properties;
        
        // Solo validamos el título
        const title = properties.Titulo?.title?.[0]?.plain_text;

        if (!title) {
          console.warn('Post missing title:', { id: page.id });
          return null;
        }

        // Generamos el slug a partir del título
        const slug = generateSlug(title);

        // Obtener el contenido del post
        const content = await getPageContent(page.id);

        return {
          id: page.id,
          title,
          description: properties.Description?.rich_text?.[0]?.plain_text || '',
          coverImage: getCoverImage(page),
          date: properties['Published Date']?.date?.start || new Date().toISOString(),
          slug,
          tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
          content,
        };
      } catch (error) {
        console.error('Error processing post:', page.id, error);
        return null;
      }
    }));

    return posts.filter(Boolean); // Remove any null entries
  } catch (error) {
    console.error('Error fetching blog posts from Notion:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Titulo',
        title: {
          contains: slug,
        },
      },
    });

    if (response.results.length === 0) {
      return null;
    }

    const page = response.results[0];
    const properties = page.properties;
    const content = await getPageContent(page.id);

    return {
      id: page.id,
      title: properties.Titulo.title[0]?.plain_text || '',
      description: properties.Description?.rich_text?.[0]?.plain_text || '',
      coverImage: getCoverImage(page),
      date: properties['Published Date']?.date?.start || '',
      slug,
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      content,
    };
  } catch (error) {
    console.error('Error fetching blog post from Notion:', error);
    return null;
  }
} 