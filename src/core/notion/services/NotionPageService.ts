import { notionClient } from "../client/NotionClient";
import { getAllBlocks } from "./NotionBlockService";

export async function getPageWithBlocks(pageId: string) {
  const page = await notionClient.pages.retrieve({ page_id: pageId });
  const blocks = await getAllBlocks(pageId);
  return { page, blocks };
}