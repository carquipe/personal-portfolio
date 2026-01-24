import type { BlockObjectResponse, PartialBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { notionClient } from "../client/NotionClient";

type BlockWithChildren = (BlockObjectResponse | PartialBlockObjectResponse) & {
  children?: BlockWithChildren[];
};

export async function getAllBlocks(blockId: string): Promise<BlockWithChildren[]> {
  const blocks: BlockWithChildren[] = [];
  let cursor: string | undefined = undefined;

  try {
    do {
      const response = await notionClient.blocks.children.list({
        block_id: blockId,
        start_cursor: cursor,
      });

      for (const block of response.results) {
        const blockWithChildren = block as BlockWithChildren;
        if ("has_children" in block && block.has_children) {
          blockWithChildren.children = await getAllBlocks(block.id);
        }
        blocks.push(blockWithChildren);
      }

      cursor = response.next_cursor ?? undefined;
    } while (cursor);

    return blocks;
  } catch (error) {
    console.error(`Failed to fetch blocks for ${blockId}:`, error);
    return [];
  }
}