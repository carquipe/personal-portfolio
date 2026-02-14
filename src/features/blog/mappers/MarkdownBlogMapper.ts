import type { MarkdownFile } from "@core/markdown/services/MarkdownReader";
import type { NotionBlogPost } from "../models/NotionBlogPost";
import { markdownToHtml } from "@core/markdown/converters/MarkdownToHtml";
import { generateSlug } from "../utils/generateSlug";

/**
 * Maps a markdown file with frontmatter to a NotionBlogPost domain model.
 * Maintains backwards compatibility with existing blog post interface.
 */
export async function mapMarkdownToBlogPost(
  markdown: MarkdownFile
): Promise<NotionBlogPost> {
  const fm = markdown.frontmatter;

  const title = fm.title || "(Sin título)";
  const slug = fm.slug || generateSlug(title);
  const description = fm.description || "";
  const date = fm.date || new Date().toISOString().split('T')[0];
  const coverImage = fm.coverImage || "";
  const tags = Array.isArray(fm.tags) ? fm.tags : [];

  // Convert markdown content to HTML
  const content = await markdownToHtml(markdown.content);

  return {
    id: slug,
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
