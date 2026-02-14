/**
 * Blog post model - represents a blog post from markdown files
 *
 * Note: Name kept as "NotionBlogPost" for backwards compatibility
 * but now sources from local markdown files instead of Notion API
 */
export interface NotionBlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  coverImage: string;
  tags: string[];
  content: string;
  published: boolean;
}