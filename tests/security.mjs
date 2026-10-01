import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const ignored = new Set([".git", ".github", "node_modules"]);

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    if (ignored.has(name)) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

const suspiciousPatterns = [
  /(?:postgres(?:ql)?|mysql):\/\/[^\s"']+:[^\s"']+@/i,
  /(?:api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"']{12,}["']/i,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i
];

for (const file of walk(".")) {
  const normalized = file.replaceAll("\\", "/");
  if (normalized === ".env.example" || normalized.endsWith(".lock")) continue;
  const content = readFileSync(file, "utf8");
  for (const pattern of suspiciousPatterns) {
    assert.doesNotMatch(content, pattern, "Possível segredo/credencial encontrado em: " + normalized);
  }
}

const trackedEnv = walk(".").filter((file) => /(^|\/)\.env(\.|$)/.test(file.replaceAll("\\", "/")));
assert.deepEqual(
  trackedEnv.map((file) => file.replaceAll("\\", "/")).filter((file) => !file.endsWith(".env.example")),
  [],
  "Arquivos .env reais não devem fazer parte do projeto"
);

console.log("Security smoke test do Business Plan Builder: OK");
