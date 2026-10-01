import { readFileSync } from "node:fs";

for (const path of ["js/app.js","js/management.js","js/server-sync.js"]) {
  let source = readFileSync(path, "utf8");
  if (path === "js/app.js") source = source.replace(/^import[^\n]+\n/, "");
  try {
    new Function(source);
  } catch (error) {
    console.error("Falha de sintaxe em "+path);
    console.error(error);
    process.exit(1);
  }
  console.log("Syntax OK: "+path);
}
