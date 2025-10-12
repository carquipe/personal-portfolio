export interface NotionBlock {
  id: string;
  type: string;
  children?: NotionBlock[];
}