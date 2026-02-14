// src/features/blog/repositories/BlogRepository.ts
import { MarkdownReader } from "@core/markdown/services/MarkdownReader";
import type { NotionBlogPost } from "../models/NotionBlogPost";
import { mapMarkdownToBlogPost } from "../mappers/MarkdownBlogMapper";

export class BlogRepository {
  static async getPublishedPosts(): Promise<NotionBlogPost[]> {
    try {
      // Read all markdown files
      const markdownFiles = await MarkdownReader.readAllPosts();

      // Filter published posts and map to BlogPost model
      const posts = await Promise.all(
        markdownFiles
          .filter(file => file.frontmatter.published !== false)
          .map(async (file) => {
            return mapMarkdownToBlogPost(file);
          })
      );

      // Sort by date descending
      return posts.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }
}
