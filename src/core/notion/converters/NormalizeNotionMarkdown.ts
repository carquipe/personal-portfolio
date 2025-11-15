// src/core/notion/converters/normalizeNotionMarkdown.ts

/**
 * Permite pasar string o MdStringObject de notion-to-md.
 */
type MdInput =
  | string
  | {
      parent: string;
      children?: string[];
    };

/**
 * Normaliza el Markdown generado desde Notion para que:
 * - No se rompan las tablas si hay saltos de línea en celdas (convierte \n a <br> dentro de filas).
 * - Se unifique \r\n → \n y se eliminen espacios invisibles.
 * - Se reduzcan saltos en blanco redundantes fuera de tablas/código.
 * - No altera contenido dentro de fences de código ```...```.
 *
 * Este patrón (aplanar MD → limpiar invisibles → normalizar tablas → compactar) es el más usado
 * en integraciones Notion-to-MD/Remark.
 */
export function normalizeNotionMarkdown(input: MdInput): string {
  const md = flattenMdInput(input);

  // 1) Normaliza finales de línea y caracteres invisibles
  let out = md
    .replaceAll(/\r\n?/g, "\n") // CRLF/CR -> LF
    .replaceAll("\u00A0", " ") // NBSP -> espacio normal
    .replaceAll(/[\u200B-\u200D\uFEFF]/g, ""); // zero-width chars

  // 2) Normaliza bloques de tabla sin tocar bloques de código
  out = normalizeTables(out);

  // 3) Reduce líneas en blanco repetidas fuera de código (máx 2 seguidas)
  out = collapseBlankLines(out);

  return out.trim();
}

/** Une parent + children de notion-to-md si hace falta */
function flattenMdInput(input: MdInput): string {
  if (typeof input === "string") return input;
  const parts = [input.parent, ...(input.children ?? [])];
  return parts.join("\n\n");
}

/**
 * Detecta bloques de tabla (líneas consecutivas que empiezan con '|')
 * y dentro de ellos:
 *  - Une líneas “descolgadas” (que Notion suele soltar en la siguiente línea) a la fila anterior con <br>
 *  - Compacta <br> repetidos
 *  - Limpia espacios sobrantes en celdas
 *
 * Mantiene intactos los bloques de código triple fence.
 */
function normalizeTables(src: string): string {
  const lines = src.split("\n");
  const out: string[] = [];

  let inCodeFence = false;
  let tableBuffer: string[] = [];

  const flushTable = () => {
    if (tableBuffer.length === 0) return;
    // Recompone el bloque de tabla:
    const normalized = normalizeTableBlock(tableBuffer.join("\n"));
    out.push(normalized);
    tableBuffer = [];
  };

  for (const element of lines) {
    const line = element;

    // Control de bloques de código ```
    if (line.startsWith("```")) {
      inCodeFence = !inCodeFence;
      // Si hay una tabla pendiente, la volcamos antes de entrar/salir del código
      flushTable();
      out.push(line);
      continue;
    }

    if (inCodeFence) {
      // Dentro de código: no tocamos nada
      out.push(line);
      continue;
    }

    const isTableRow = /^\s*\|.*\|\s*$/.test(line);
    if (isTableRow) {
      tableBuffer.push(line);
    } else {
      // Línea que no es tabla
      // Caso especial: Notion a veces suelta una continuación de celda sin '|'
      if (tableBuffer.length > 0 && line.trim() !== "") {
        // Adjuntar como continuación de la última fila con <br>
        const last = tableBuffer.pop()!;
        tableBuffer.push(appendContinuationToRow(last, line));
      } else {
        // No hay tabla en curso: volcamos si había y añadimos línea normal
        flushTable();
        out.push(line);
      }
    }
  }

  // Volcar tabla pendiente al final
  flushTable();

  return out.join("\n");
}

/**
 * Normaliza un bloque ENTERO de tabla:
 * - Asegura que las continuaciones queden en la misma línea de fila (ya vienen unidas)
 * - Compacta <br> duplicados
 * - Limpia espacios alrededor de celdas
 * - Si falta la línea de separadores tras el header, la intenta añadir (opcional)
 */
function normalizeTableBlock(block: string): string {
  const rows = block.split("\n").filter((l) => l.trim() !== "");
  if (rows.length === 0) return block;

  // Opcional: si no detecta separador tras primera fila y parece header, lo añade.
  if (
    rows.length >= 2 &&
    !/^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(rows[1]) &&
    rows[0].includes("|")
  ) {
    const colCount = rows[0].split("|").length - 2; // ignora bordes
    if (colCount > 0) {
      const sep = "|" + new Array(colCount).fill(" --- ").join("|") + "|";
      rows.splice(1, 0, sep);
    }
  }

  // Limpieza de cada fila: trim de celdas y compactar <br>
  const cleaned = rows.map((row) => {
    if (!/^\s*\|.*\|\s*$/.test(row)) return row;
    const cells = row
      .trim()
      // elimina borde inicial/final y vuelve a ponerlos al final
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) =>
        c
          .replaceAll(/\s+/g, " ")
          .replaceAll(/(<br\s*\/?>\s*){2,}/gi, "<br>")
          .trim()
      );
    return `| ${cells.join(" | ")} |`;
  });

  return cleaned.join("\n");
}

/**
 * Adjunta una línea “sueltA” a la fila de tabla anterior como <br>continuación de la celda.
 * Estrategia simple: añade al ÚLTIMO campo (celda de la derecha), que es lo habitual con Notion.
 */
function appendContinuationToRow(prevRow: string, continuation: string): string {
  if (!/^\s*\|.*\|\s*$/.test(prevRow)) return prevRow;
  const parts = prevRow
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((s) => s.trim());

  const lastIdx = parts.length - 1;
  parts[lastIdx] = `${parts[lastIdx]}<br>${continuation.trim()}`.replaceAll(
    /(<br\s*\/?>\s*){2,}/gi,
    "<br>"
  );

  return `| ${parts.join(" | ")} |`;
}

/**
 * Reduce líneas en blanco excesivas fuera de fences de código (máximo 2).
 */
function collapseBlankLines(src: string): string {
  const lines = src.split("\n");
  const out: string[] = [];
  let inCode = false;
  let blankRun = 0;

  for (const line of lines) {
    if (line.startsWith("```")) {
      inCode = !inCode;
      blankRun = 0;
      out.push(line);
      continue;
    }
    if (inCode) {
      out.push(line);
      continue;
    }
    if (line.trim() === "") {
      blankRun++;
      if (blankRun <= 2) out.push("");
    } else {
      blankRun = 0;
      out.push(line);
    }
  }
  return out.join("\n");
}
