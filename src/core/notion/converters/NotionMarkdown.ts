import { NotionToMarkdown } from "notion-to-md";
import { notionClient } from "../client/NotionClient";

const n2m = new NotionToMarkdown({ notionClient });

export async function pageToMarkdown(pageId: string) {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  return n2m.toMarkdownString(mdBlocks);
}