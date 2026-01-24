// src/features/blog/repositories/BlogRepository.ts
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { queryDatabase } from "@core/notion/services/NotionDatabaseService";
import { pageToMarkdown } from "@core/notion/converters/NotionMarkdown";

import type { NotionBlogPost } from "../models/NotionBlogPost";
import { mapPageToBlogPost } from "../mappers/NotionBlogMapper";
import { markdownToHtml } from "@core/notion/converters/NotionMarkdownHtml";
import { normalizeNotionMarkdown } from "@core/notion/converters/NormalizeNotionMarkdown";

function getDatabaseId(): string {
  const id = import.meta.env.NOTION_DATABASE_ID;
  if (!id) {
    throw new Error("NOTION_DATABASE_ID environment variable is required");
  }
  return id;
}

export class BlogRepository {
  static async getPublishedPosts(): Promise<NotionBlogPost[]> {
    const databaseId = getDatabaseId();
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
      response.results.map(async (page) => {
        const pageObj = page as PageObjectResponse;
        const markdown = await pageToMarkdown(pageObj.id);

        const cleanedMd = normalizeNotionMarkdown(
          [markdown.parent, ...(markdown.children || [])].join("\n\n")
        );

        const contentString = await markdownToHtml(cleanedMd);
        return mapPageToBlogPost(pageObj, contentString);
      })
    );

    return posts;
  }
}
