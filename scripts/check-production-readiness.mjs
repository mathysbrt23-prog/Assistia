import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "app/privacy/page.tsx",
  "app/terms/page.tsx",
  "supabase/schema.sql",
  "dist/assistia-reply-chrome-v0.3.7.zip",
  "docs/chrome-store-v1.md"
];

const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
  "APP_URL"
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

const failures = [];

for (const file of requiredFiles) {
  if (!exists(file)) failures.push(`Fichier manquant: ${file}`);
}

const manifest = readJson("extension/manifest.json");
if (manifest.manifest_version !== 3) failures.push("Le manifest Chrome doit rester en Manifest V3.");
if (manifest.version !== "0.3.7") failures.push("La version extension attendue est 0.3.7.");
const matches = manifest.content_scripts?.flatMap((script) => script.matches || []) || [];
if (matches.length !== 1 || matches[0] !== "https://mail.google.com/*") {
  failures.push("La v1 Chrome Store doit être limitée à Gmail uniquement.");
}

const envExample = fs.readFileSync(path.join(root, ".env.example"), "utf8");
for (const key of requiredEnv) {
  if (!envExample.includes(`${key}=`)) failures.push(`Variable absente de .env.example: ${key}`);
}

if (failures.length) {
  console.error("Production readiness: FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Production readiness: OK");
console.log("- Pages légales présentes");
console.log("- Schéma Supabase présent");
console.log("- Extension Gmail-only");
console.log("- ZIP Chrome présent");
console.log("- Variables essentielles documentées");
