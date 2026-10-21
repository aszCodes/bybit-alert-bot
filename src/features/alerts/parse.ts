import { config } from "../../config.js";
import { normalize } from "../../utils/symbols.js";

export interface ParsedAlert {
  symbol: string;
  target: number;
  repeat: boolean;
  note: string | undefined;
}

/** Parses: <symbol> <price> [once|repeat|every|r] [note...] */
export function parseAlertArgs(rest: string): ParsedAlert | null {
  const m = rest.match(/^(\S+)\s+(\S+)(?:\s+(.*))?$/s);
  const symArg = m?.[1];
  const priceArg = m?.[2];
  if (!symArg || !priceArg) return null;

  const target = Number(priceArg);
  if (!Number.isFinite(target) || target <= 0) return null;

  let tail = (m?.[3] ?? "").trim();
  let repeat = false;

  const first = tail.split(/\s+/)[0]?.toLowerCase() ?? "";
  if (["repeat", "every", "r"].includes(first)) {
    repeat = true;
    tail = tail.slice(first.length).trim();
  } else if (first === "once") {
    tail = tail.slice(first.length).trim();
  }

  // Strip wrapping quotes (straight or curly) from the note
  const note = tail
    .replace(/^["“”]+|["“”]+$/g, "")
    .trim()
    .slice(0, config.maxNoteLength);

  return { symbol: normalize(symArg), target, repeat, note: note || undefined };
}
