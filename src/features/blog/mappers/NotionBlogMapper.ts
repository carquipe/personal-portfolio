import type { NotionBlogPost } from "../models/NotionBlogPost";

/**
 * Maps a raw Notion page and its Markdown content
 * to a clean NotionBlogPost domain model.
 */
export function mapPageToBlogPost(page: any, contentString: string): NotionBlogPost {
  const props = page.properties;

  const title =
    props.Titulo?.title?.[0]?.plain_text ??
    props.Name?.title?.[0]?.plain_text ??
    "(Sin título)";

  const slug =
    props.Slug?.rich_text?.[0]?.plain_text ??
    title.toLowerCase().replace(/\s+/g, "-");

  const description =
    props.Description?.rich_text?.[0]?.plain_text ??
    props.Resumen?.rich_text?.[0]?.plain_text ??
    "";

  const date =
    props["Published Date"]?.date?.start ??
    props.Fecha?.date?.start ??
    new Date().toISOString();

  const coverImage = getCoverImage(page);
  const tags = props.Tags?.multi_select?.map((t: any) => t.name) ?? [];

  const content = contentString;

  return {
    id: page.id,
    title,
    slug,
    description,
    date,
    coverImage,
    tags,
    content,
    published: true,
  };
}

/**
 * Extracts a usable cover image URL from the Notion page.
 */
function getCoverImage(page: any): string {
  const cover = page.cover;
  if (!cover) return "";
  if (cover.type === "external") return cover.external.url;
  if (cover.type === "file") return cover.file.url;
  return "";
}
