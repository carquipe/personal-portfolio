import { Client, isFullPage } from "@notionhq/client";
import { NotionRenderer } from "@notion-render/client";
import type {
  BlockObjectResponse,
  PartialBlockObjectResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});

const DATABASE_ID = import.meta.env.NOTION_DATABASE_ID;
const renderer = new NotionRenderer({ client: notion });
const DEFAULT_COVER_IMAGE = "/src/assets/first_img.png";

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
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type NotionPage = PageObjectResponse | PartialPageObjectResponse;

type NotionFile =
  | { type: "external"; external: { url: string }; name?: string }
  | { type: "file"; file: { url: string }; name?: string };

function getFileUrl(file?: NotionFile | null): string | null {
  if (!file) return null;
  if (file.type === "external") {
    return file.external.url;
  }
  return file.file.url;
}

async function resolveFullPage(page: NotionPage): Promise<PageObjectResponse | null> {
  if (isFullPage(page)) {
    return page;
  }

  const fullPage = await notion.pages.retrieve({ page_id: page.id });
  return isFullPage(fullPage) ? fullPage : null;
}

function findCoverInProperties(page: PageObjectResponse): string | null {
  const preferredFields = ["CoverImage", "Cover", "Cover Image", "Imagen"] as const;

  for (const field of preferredFields) {
    const property = page.properties?.[field];
    if (property?.type === "files" && property.files?.length) {
      const firstFile = property.files[0] as NotionFile | undefined;
      const url = getFileUrl(firstFile ?? null);
      if (url) return url;
    }
  }

  // Buscar la primera propiedad de tipo files con contenido
  const fallbackProperty = Object.values(page.properties ?? {}).find(
    (prop): prop is { type: "files"; files: NotionFile[] } =>
      prop?.type === "files" && Boolean(prop.files?.length),
  );

  if (fallbackProperty) {
    return getFileUrl(fallbackProperty.files[0]);
  }

  return null;
}

function getCoverFromPage(page: PageObjectResponse): string | null {
  const propertyCover = findCoverInProperties(page);
  if (propertyCover) return propertyCover;

  if (page.cover) {
    return getFileUrl(page.cover as NotionFile);
  }

  return null;
}

async function getCoverImage(page: NotionPage): Promise<string> {
  const fullPage = await resolveFullPage(page);
  if (!fullPage) {
    return DEFAULT_COVER_IMAGE;
  }

  const coverUrl = getCoverFromPage(fullPage);
  return coverUrl ?? DEFAULT_COVER_IMAGE;
}

type NotionBlock = BlockObjectResponse | PartialBlockObjectResponse;

function isFullBlock(block: NotionBlock): block is BlockObjectResponse {
  return "type" in block;
}

async function getAllBlocks(pageId: string): Promise<BlockObjectResponse[]> {
  const blocks: BlockObjectResponse[] = [];
  let cursor: string | undefined = undefined;

  try {
    do {
      const response = await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
      });

      blocks.push(
        ...response.results.filter(isFullBlock),
      );

      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);
  } catch (error) {
    console.error("Error retrieving Notion blocks:", error);
  }

  return blocks;
}

async function getPageContent(pageId: string): Promise<string> {
  try {
    const blocks = await getAllBlocks(pageId);

    if (blocks.length === 0) {
      return "";
    }

    const html = await renderer.render(...blocks);
    return html.trim();
  } catch (error) {
    console.error("Error fetching page content:", error);
    return "";
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    if (!DATABASE_ID) {
      console.error("NOTION_DATABASE_ID is not defined");
      return [];
    }

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: "Estado",
            status: {
              equals: "Publicado",
            },
          },
          {
            property: "Titulo",
            title: {
              is_not_empty: true,
            },
          },
        ],
      },
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
    });

    if (!response.results || response.results.length === 0) {
      console.log("No published posts found in Notion database");
      return [];
    }

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        try {
          const properties = page.properties;

          // Solo validamos el título
          const title = properties.Titulo?.title?.[0]?.plain_text;

          if (!title) {
            console.warn("Post missing title:", { id: page.id });
            return null;
          }

          // Generamos el slug a partir del título
          const slug = generateSlug(title);

          // Obtener el contenido del post
          const [content, coverImage] = await Promise.all([
            getPageContent(page.id),
            getCoverImage(page),
          ]);

          return {
            id: page.id,
            title,
            description:
              properties.Description?.rich_text?.[0]?.plain_text || "",
            coverImage,
            date:
              properties["Published Date"]?.date?.start ||
              new Date().toISOString(),
            slug,
            tags:
              properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
            content,
          };
        } catch (error) {
          console.error("Error processing post:", page.id, error);
          return null;
        }
      }),
    );

    return posts.filter(Boolean); // Remove any null entries
  } catch (error) {
    console.error("Error fetching blog posts from Notion:", error);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Titulo",
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
    const [content, coverImage] = await Promise.all([
      getPageContent(page.id),
      getCoverImage(page),
    ]);

    return {
      id: page.id,
      title: properties.Titulo.title[0]?.plain_text || "",
      description: properties.Description?.rich_text?.[0]?.plain_text || "",
      coverImage,
      date: properties["Published Date"]?.date?.start || "",
      slug,
      tags: properties.Tags?.multi_select?.map((tag: any) => tag.name) || [],
      content,
    };
  } catch (error) {
    console.error("Error fetching blog post from Notion:", error);
    return null;
  }
}
