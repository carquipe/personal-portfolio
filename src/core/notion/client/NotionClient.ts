import { Client } from "@notionhq/client";

export const notionClient = new Client({
  auth: import.meta.env.NOTION_API_KEY,
});