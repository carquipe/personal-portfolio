// src/features/blog/repositories/BlogRepository.ts
import { queryDatabase } from "@core/notion/services/NotionDatabaseService";
import { pageToMarkdown } from "@core/notion/converters/NotionMarkdown";

import type { NotionBlogPost } from "../models/NotionBlogPost";
import { mapPageToBlogPost } from "../mappers/NotionBlogMapper";
import { markdownToHtml } from "@core/notion/converters/NotionMarkdownHtml";
import { normalizeNotionMarkdown } from "@core/notion/converters/NormalizeNotionMarkdown";

const databaseId = import.meta.env.NOTION_DATABASE_ID!;

export class BlogRepository {

  static async getPublishedPosts(): Promise<NotionBlogPost[]> {
    const response = await queryDatabase(
      databaseId,
      {
        and: [
          { property: "Estado", status: { equals: "Publicado" } },
          { property: "Titulo", title: { is_not_empty: true } },
        ],
      },
      [{ property: "Published Date", direction: "descending" }]
    );

    if (!response.results?.length) return [];

    const posts = await Promise.all(
      response.results.map(async (page: any) => {
        const markdown = await pageToMarkdown(page.id);

        const cleanedMd = normalizeNotionMarkdown(markdown);

        const contentString = await markdownToHtml(cleanedMd);
        return mapPageToBlogPost(page, contentString);
      })
    );

    return posts;
  }
}
