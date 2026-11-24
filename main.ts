// main.ts — entrypoint for the make.fun bounty
// "The agent builds a game from one prompt".
// Copies POST.json from the repository root to the output directory.
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outDir, { recursive: true });
try {
  // Fail loudly on a broken POST.json instead of copying garbage through.
  const raw = readFileSync(join(botDir, "POST.json"), "utf8");
  const parsed = JSON.parse(raw) as { url?: unknown };
  if (typeof parsed.url !== "string" || !parsed.url.startsWith("https://")) {
    throw new Error("POST.json has no https url");
  }
  copyFileSync(join(botDir, "POST.json"), join(outDir, "POST.json"));
} catch (err) {
  console.error("failed to copy POST.json:", err);
  process.exit(1);
}
