// src/core/notion/converters/NotionHtml.ts
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/**
 * Accepts either a plain markdown string or a `MdStringObject`
 * returned by notion-to-md's `toMarkdownString()`.
 */
export async function markdownToHtml(
  markdownInput: string
): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .process(markdownInput);

  return result.toString();
}
