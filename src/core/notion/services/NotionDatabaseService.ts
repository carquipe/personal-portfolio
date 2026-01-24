import type { QueryDatabaseParameters, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { notionClient } from "../client/NotionClient";

export async function queryDatabase(
  databaseId: string,
  filter?: QueryDatabaseParameters["filter"],
  sorts?: QueryDatabaseParameters["sorts"]
): Promise<QueryDatabaseResponse> {
  return notionClient.databases.query({ database_id: databaseId, filter, sorts });
}
