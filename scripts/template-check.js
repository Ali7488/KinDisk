// Lists every leftover template marker so nothing from the starter ships by accident.
//   yarn template:check     list all markers; exits 1 while any remain
//   --remind                one-line reminder, always exits 0 (runs before `yarn dev`)
// Once the repo is clean this prints nothing, so it can stay in place.
import { readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { styleText } from "node:util";

const root = process.cwd();
const remindOnly = process.argv.includes("--remind");
const skipDirs = new Set([".git", ".yarn", "node_modules", "dist", "coverage"]);
const extensions = new Set([".js", ".jsx", ".css", ".html", ".md", ".json", ".svg", ".yml"]);
const self = relative(root, new URL(import.meta.url).pathname);
// Built from parts so this file never matches its own pattern.
const marker = new RegExp(["TEMPLATE", "( CHECKLIST)?:"].join(""));

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) yield* walk(join(dir, entry.name));
    } else if (extensions.has(extname(entry.name))) {
      yield join(dir, entry.name);
    }
  }
}

const hits = [];
for (const file of walk(root)) {
  const path = relative(root, file);
  if (path === self) continue;
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      if (marker.test(line)) hits.push({ path, line: index + 1, text: line.trim() });
    });
}

const paint = (format, text) => styleText(format, text, { stream: process.stdout });

if (hits.length === 0) {
  if (!remindOnly) console.log(paint("green", "No template leftovers. This project is all yours."));
  process.exit(0);
}

const files = new Set(hits.map((hit) => hit.path)).size;
const summary = `${hits.length} template marker(s) in ${files} file(s)`;

if (remindOnly) {
  console.log(
    paint(["bold", "yellow"], `Reminder: ${summary} still need replacing.`) +
      paint("dim", " Run `yarn template:check` for the list."),
  );
  process.exit(0);
}

console.log(paint(["bold", "yellow"], `${summary}. Replace or delete each one:\n`));
for (const hit of hits) {
  console.log(`  ${paint("cyan", `${hit.path}:${hit.line}`)}  ${paint("dim", hit.text)}`);
}
console.log(
  paint("dim", "\nReview the flagged KinDisk starter files and replace the placeholders with project features."),
);
process.exit(1);
