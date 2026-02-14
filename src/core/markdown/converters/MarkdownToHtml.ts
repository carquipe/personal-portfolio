import { remark } from "remark";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/**
 * Converts markdown string to HTML with GitHub Flavored Markdown support
 */
export async function markdownToHtml(markdownInput: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: true })
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .process(markdownInput);

  return result.toString();
}
