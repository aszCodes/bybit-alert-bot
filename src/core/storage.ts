import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "../config.js";

const pathFor = (file: string) => join(config.dataDir, file);

export function loadJson<T>(file: string, fallback: T): T {
  const path = pathFor(file);
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as T;
  } catch (err) {
    console.error(`Could not read ${path}, using defaults`, err);
    return fallback;
  }
}

export function saveJson(file: string, data: unknown): void {
  mkdirSync(config.dataDir, { recursive: true });
  writeFileSync(pathFor(file), JSON.stringify(data, null, 2));
}
