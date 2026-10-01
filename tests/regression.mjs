import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const app=readFileSync("js/app.js","utf8");
const html=readFileSync("index.html","utf8");
const management=readFileSync("js/management.js","utf8");
const rls=readFileSync("database/migrations/2026-10-01-rls-completo.sql","utf8");
const sync=readFileSync("js/server-sync.js","utf8");

const sections=[
  "executiveSummary","companyDescription","productsServices","marketCompetition",
  "marketingSales","operationalPlan","peopleManagement","financialPlan",
  "strategicAnalysis","appendices"
];
for (const key of sections) {
  assert.match(html,new RegExp('data-plan-section="'+key+'"'),"Seção ausente no HTML/JS: "+key);
}
assert.equal((management.match(/Plano · /g)||[]).length,10,"Checklist do M3 deve conter 10 seções individuais");

const protectedTables=[
  "usuarios_perfis","espacos_trabalho","membros_espaco_trabalho","planos_negocio",
  "analises_ambientais","analises_oportunidade","propostas_valor","itens_swot",
  "itens_pestel","forcas_porter","secoes_plano","planos_financeiros",
  "cenarios_financeiros","projecoes_financeiras","planos_complementares",
  "versoes_plano","links_compartilhamento","exportacoes","painel_gestao",
  "alertas_plano","registros_atividade"
];
for (const table of protectedTables) {
  assert.match(rls,new RegExp("ALTER TABLE public\\."+table+" ENABLE ROW LEVEL SECURITY"),
    "RLS ausente na migração: "+table);
}
assert.doesNotMatch(rls,/playing_with_neon/i,"A migração funcional não deve alterar playing_with_neon");
assert.match(sync,/async function persistShareLink\(\)/,"Criação de compartilhamento ausente");
assert.match(sync,/if\(!user\).*Entre para criar um compartilhamento persistente/s,"Compartilhamento deve exigir autenticação");
assert.match(sync,/async function loadSharedToken\(\)/,"Leitura de compartilhamento ausente");
assert.match(sync,/if\(!user\).*Entre na conta para abrir o compartilhamento/s,"Abertura do compartilhamento deve exigir autenticação");
assert.match(sync,/logExport\("pdf"\)/,"Registro de exportação PDF ausente");
assert.match(sync,/logExport\("doc"\)/,"Registro de exportação Word ausente");
assert.match(sync,/logExport\("csv"\)/,"Registro de exportação CSV ausente");
assert.match(app,/localStorage\.setItem\(/,"Persistência local de rascunho ausente");
assert.match(app,/localStorage\.getItem\(/,"Recuperação local de rascunho ausente");
assert.match(sync,/localStorage\.getItem\(PLAN_KEY\)/,"Recuperação do plano persistido ausente");
const css=readFileSync("css/style.css","utf8");
assert.match(css,/@media\(max-width:980px\)/,"Responsividade tablet ausente");
assert.match(css,/@media\(max-width:800px\)/,"Responsividade intermediária ausente");
assert.match(css,/@media\(max-width:700px\)/,"Responsividade mobile ausente");
assert.match(css,/@media\(max-width:560px\)/,"Responsividade mobile estreita ausente");

console.log("Regression test do Business Plan Builder: OK");
