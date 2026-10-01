import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const app=readFileSync("js/app.js","utf8");
const management=readFileSync("js/management.js","utf8");
const rls=readFileSync("database/migrations/2026-10-01-rls-completo.sql","utf8");

const sections=[
  "executiveSummary","companyDescription","productsServices","marketCompetition",
  "marketingSales","operationalPlan","peopleManagement","financialPlan",
  "strategicAnalysis","appendices"
];
for (const key of sections) {
  assert.match(app,new RegExp('data-plan-section="'+key+'"'),"Seção ausente no HTML/JS: "+key);
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

console.log("Regression test do Business Plan Builder: OK");
