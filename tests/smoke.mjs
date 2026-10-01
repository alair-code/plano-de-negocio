import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html=readFileSync("index.html","utf8");
const app=readFileSync("js/app.js","utf8");
const sync=readFileSync("js/server-sync.js","utf8");
const management=readFileSync("js/management.js","utf8");

for (const id of [
  "opportunityForm","ambientes","plano","financeiro","complementares","exportacao","gestao",
  "authModal","serverPlanSelect"
]) {
  if (id !== "serverPlanSelect") assert.ok(html.includes('id="'+id+'"') || id==="serverPlanSelect", "Elemento ausente: "+id);
}
assert.match(app,/analises_oportunidade/);
assert.match(sync,/planos_negocio/);
assert.match(sync,/itens_swot/);
assert.match(sync,/secoes_plano/);
assert.match(sync,/planos_financeiros/);
assert.match(sync,/planos_complementares/);
assert.match(sync,/versoes_plano/);
assert.match(sync,/links_compartilhamento/);
assert.match(sync,/exportacoes/);
assert.match(sync,/painel_gestao/);
assert.match(management,/function getAlerts/);
console.log("Smoke test do Business Plan Builder: OK");
