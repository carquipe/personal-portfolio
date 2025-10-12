import type { NotionPage } from "@notion/models/NotionPage";

export interface NotionBlogPost extends NotionPage {
  description: string;
  coverImage: string;
  tags: string[];
  content: string;
}