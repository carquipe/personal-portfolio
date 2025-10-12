import { notionClient } from "../client/NotionClient";

export async function getAllBlocks(blockId: string) {
  const blocks: any[] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notionClient.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
    });

    for (const block of response.results) {
      if ("has_children" in block && block.has_children) {
        const children = await getAllBlocks(block.id);
        block.children = children;
      }
      blocks.push(block);
    }

    cursor = response.next_cursor ?? undefined;
  } while (cursor);

  return blocks;
}