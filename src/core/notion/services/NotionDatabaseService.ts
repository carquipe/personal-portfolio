import { notionClient } from "../client/NotionClient";

export async function queryDatabase(databaseId: string, filter?: any, sorts?: any) {
  return notionClient.databases.query({ database_id: databaseId, filter, sorts });
}
