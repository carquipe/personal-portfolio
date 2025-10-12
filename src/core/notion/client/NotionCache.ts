// src/core/notion/client/NotionCache.ts
import NodeCache from "node-cache";

export const notionCache = new NodeCache({
  stdTTL: 3600, // Tiempo de vida en segundos (1h)
  checkperiod: 120, // Limpieza cada 2 minutos
});
