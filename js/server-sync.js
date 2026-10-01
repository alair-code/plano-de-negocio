/* Persistência centralizada e gestão de planos — Neon Data API */
(() => {
  const CLIENT_WAIT_MS = 100;
  const PLAN_KEY = "business-plan-builder:server-plan:v1";
  const VERSION_KEY = "business-plan-builder:versions:v1";
  const DRAFT_KEYS = [
    "business-plan-builder:opportunity:v2",
    "business-plan-builder:environments:v1",
    "business-plan-builder:plan:v1",
    "business-plan-builder:financial:v1",
    "business-plan-builder:complementary:v1"
  ];

  function hasLocalDrafts() {
    return DRAFT_KEYS.some(key => { try { return !!localStorage.getItem(key); } catch { return false; } });
  }
  const FACTOR_MAP = {
    pestelPolitical: "politico", pestelEconomic: "economico", pestelSocial: "social",
    pestelTechnological: "tecnologico", pestelEnvironmental: "ambiental", pestelLegal: "legal"
  };
  const PORTER_MAP = {
    porterEntrants: ["novos_entrantes","porterEntrantsNote"],
    porterSuppliers: ["fornecedores","porterSuppliersNote"],
    porterCustomers: ["clientes","porterCustomersNote"],
    porterSubstitutes: ["substitutos","porterSubstitutesNote"],
    porterRivalry: ["rivalidade_competitiva","porterRivalryNote"]
  };
  const PLAN_SECTIONS = [
    "executiveSummary","companyDescription","productsServices","marketCompetition",
    "marketingSales","operationalPlan","peopleManagement","financialPlan",
    "strategicAnalysis","appendices"
  ];

  let client = null;
  let syncing = false;
  let currentPlanId = null;

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  async function waitForClient() {
    for (let i = 0; i < 80; i++) {
      if (window.neonClient) { client = window.neonClient; return client; }
      await sleep(CLIENT_WAIT_MS);
    }
    return null;
  }

  async function currentUser() {
    if (!client) await waitForClient();
    if (!client) return null;
    try {
      const result = await client.auth.getSession();
      return result?.data?.session?.user || result?.session?.user || result?.data?.user || null;
    } catch { return null; }
  }

  function readStoredPlanId() {
    try { return JSON.parse(localStorage.getItem(PLAN_KEY) || "null")?.planId || null; }
    catch { return null; }
  }

  function storePlanId(id) {
    currentPlanId = id || null;
    if (id) localStorage.setItem(PLAN_KEY, JSON.stringify({ planId:id }));
  }

  function val(id) {
    return document.getElementById(id)?.value?.trim?.() || "";
  }

  function planFieldState() {
    const state = {};
    document.querySelectorAll("[data-plan-field]").forEach(el => state[el.dataset.planField] = el.value);
    return state;
  }

  function complementaryState() {
    const state = {};
    document.querySelectorAll("[data-complementary-field]").forEach(el => state[el.dataset.complementaryField] = el.value);
    return state;
  }

  function financialInputs() {
    const n = id => Number(document.getElementById(id)?.value || 0);
    return {
      investimento_inicial:n("financialInvestment"),
      custos_fixos:n("financialFixedCosts"),
      custo_variavel_unitario:n("financialVariableCost"),
      preco_unitario:n("financialUnitPrice"),
      demanda_inicial:n("financialInitialDemand"),
      taxa_crescimento:n("financialGrowthRate"),
      horizonte_meses:Math.max(1,Math.min(60,n("financialHorizon") || 12)),
      taxa_desconto:n("financialDiscountRate")
    };
  }

  async function ensurePlan() {
    const user = await currentUser();
    if (!user) return null;

    const stored = readStoredPlanId();
    if (stored) {
      const {data,error} = await client.from("planos_negocio").select("id,espaco_trabalho_id,nome,status").eq("id",stored).limit(1);
      if (!error && data?.[0]) { storePlanId(data[0].id); return data[0]; }
    }

    const {data:plans,error:plansError} = await client.from("planos_negocio")
      .select("id,espaco_trabalho_id,nome,status").order("criado_em",{ascending:true}).limit(1);
    if (plansError) throw plansError;
    if (plans?.[0]) { storePlanId(plans[0].id); return plans[0]; }

    const name = val("businessName") || "Meu Plano de Negócio";
    const {data:spaces,error:spaceError} = await client.from("espacos_trabalho").insert({nome:name}).select("id");
    if (spaceError) throw spaceError;
    const space = spaces?.[0];
    if (!space?.id) throw new Error("Não foi possível criar o espaço de trabalho.");
    const {data:created,error:planError} = await client.from("planos_negocio")
      .insert({espaco_trabalho_id:space.id,nome:name}).select("id,espaco_trabalho_id,nome,status");
    if (planError) throw planError;
    if (!created?.[0]) throw new Error("Não foi possível criar o plano.");
    storePlanId(created[0].id);
    return created[0];
  }

  async function listPlans() {
    const user = await currentUser();
    if (!user) return [];
    const {data,error} = await client.from("planos_negocio")
      .select("id,nome,status,percentual_conclusao,modulo_atual,criado_em,atualizado_em")
      .order("criado_em",{ascending:false});
    if (error) throw error;
    return data || [];
  }

  function ensureManagerUI() {
    if (document.getElementById("serverPlanManager")) return;
    const actions = document.querySelector(".topbar-actions");
    if (!actions) return;
    if (!document.getElementById("serverPlanManagerStyles")) {
      const style=document.createElement("style"); style.id="serverPlanManagerStyles";
      style.textContent=".server-plan-manager{display:flex;align-items:center;gap:6px}.server-plan-label{font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:#6c7585}.server-plan-select{min-width:180px;max-width:260px;height:36px;border:1px solid rgba(20,32,55,.14);border-radius:10px;padding:0 10px;background:#fff;color:#202532}.server-plan-button{height:36px;border:1px solid rgba(20,32,55,.14);border-radius:10px;background:#fff;padding:0 10px;cursor:pointer;color:#202532}.server-plan-button:hover{background:#f5f7fa}@media(max-width:900px){.server-plan-manager{max-width:calc(100vw - 110px);flex-wrap:wrap}.server-plan-select{min-width:130px;max-width:180px}.server-plan-label{display:none}}";
      document.head.appendChild(style);
    }
    const wrap = document.createElement("div");
    wrap.id = "serverPlanManager";
    wrap.className = "server-plan-manager";
    wrap.innerHTML = '<label class="server-plan-label" for="serverPlanSelect">Plano</label>' +
      '<select id="serverPlanSelect" class="server-plan-select" aria-label="Plano de negócio atual"></select>' +
      '<button type="button" class="server-plan-button" id="newServerPlan">Novo</button>' +
      '<button type="button" class="server-plan-button" id="archiveServerPlan">Arquivar</button>';
    actions.insertBefore(wrap, actions.firstChild);
    document.getElementById("serverPlanSelect")?.addEventListener("change", async e => {
      try { await switchPlan(e.target.value); } catch (err) { console.error(err); showToastSafe("Não foi possível trocar de plano."); }
    });
    document.getElementById("newServerPlan")?.addEventListener("click", createPlan);
    document.getElementById("archiveServerPlan")?.addEventListener("click", archiveCurrentPlan);
  }

  function showToastSafe(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message; toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3200);
  }

  async function refreshPlanSelector() {
    ensureManagerUI();
    const select = document.getElementById("serverPlanSelect");
    if (!select) return;
    const plans = await listPlans();
    if (!plans.length) { select.innerHTML = '<option value="">Nenhum plano</option>'; return; }
    if (!plans.some(p => p.id === currentPlanId)) currentPlanId = plans[0].id;
    select.innerHTML = plans.map(p => '<option value="'+p.id+'">'+escapeHtml(p.nome || "Plano sem nome")+(p.status==="arquivado"?" · arquivado":"")+'</option>').join("");
    select.value = currentPlanId;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  }

  async function createPlan() {
    const user = await currentUser();
    if (!user) { document.getElementById("authButton")?.click(); return; }
    const name = prompt("Nome do novo plano de negócio:", "Novo Plano de Negócio");
    if (!name?.trim()) return;
    try {
      const {data:spaces,error:spaceError} = await client.from("espacos_trabalho").insert({nome:name.trim()}).select("id");
      if (spaceError) throw spaceError;
      const {data:plans,error:planError} = await client.from("planos_negocio")
        .insert({espaco_trabalho_id:spaces[0].id,nome:name.trim()}).select("id");
      if (planError) throw planError;
      storePlanId(plans[0].id);
      clearUI();
      dispatchModuleInputs();
      await refreshPlanSelector();
      showToastSafe("Novo plano criado.");
    } catch (err) {
      console.error("Neon: criação de plano",err);
      showToastSafe("Não foi possível criar o novo plano.");
    }
  }

  async function archiveCurrentPlan() {
    if (!currentPlanId || !confirm("Arquivar o plano atual? Ele continuará salvo no banco, mas deixará de ser o plano ativo.")) return;
    const {error} = await client.from("planos_negocio").update({status:"arquivado"}).eq("id",currentPlanId);
    if (error) { console.error(error); showToastSafe("Não foi possível arquivar o plano."); return; }
    await refreshPlanSelector();
    showToastSafe("Plano arquivado.");
  }

  function clearUI() {
    const form = document.getElementById("opportunityForm");
    form?.reset();
    document.querySelectorAll("[data-complementary-field],[data-plan-field]").forEach(el=>el.value="");
    ["pestelPolitical","pestelEconomic","pestelSocial","pestelTechnological","pestelEnvironmental","pestelLegal","porterRivalry","porterRivalryNote","porterEntrants","porterEntrantsNote","porterSuppliers","porterSuppliersNote","porterCustomers","porterCustomersNote","porterSubstitutes","porterSubstitutesNote"].forEach(id=>{const el=document.getElementById(id);if(el)el.value="";});
    document.querySelectorAll("[data-swot-list]").forEach(list=>list.innerHTML="");
    try {
      DRAFT_KEYS.forEach(key => localStorage.removeItem(key));
    } catch {}
    document.getElementById("financialInvestment") && (document.getElementById("financialInvestment").value="");
    document.getElementById("financialFixedCosts") && (document.getElementById("financialFixedCosts").value="");
    document.getElementById("financialVariableCost") && (document.getElementById("financialVariableCost").value="");
    document.getElementById("financialUnitPrice") && (document.getElementById("financialUnitPrice").value="");
    document.getElementById("financialInitialDemand") && (document.getElementById("financialInitialDemand").value="");
    window.updateDashboardState?.();
  }

  function getSwot() {
    if (typeof window.getSwotState === "function") return window.getSwotState();
    const result = {strengths:[],weaknesses:[],opportunities:[],threats:[]};
    document.querySelectorAll("[data-swot-list]").forEach(list => {
      const key=list.dataset.swotList;
      result[key]=[...list.querySelectorAll("input,textarea")].map(el=>el.value.trim()).filter(Boolean);
    });
    return result;
  }

  async function syncEnvironment(planId) {
    const environment=await client.from("analises_ambientais").upsert({plano_negocio_id:planId},{onConflict:"plano_negocio_id"});
    if(environment.error)throw environment.error;
    const swot=getSwot();
    await client.from("itens_swot").delete().eq("plano_negocio_id",planId);
    const swotRows=[];
    const map={strengths:"forca",weaknesses:"fraqueza",opportunities:"oportunidade",threats:"ameaca"};
    Object.entries(map).forEach(([key,category])=>(swot[key]||[]).forEach((content,posicao)=>swotRows.push({plano_negocio_id:planId,categoria:category,conteudo,posicao})));
    if(swotRows.length){const r=await client.from("itens_swot").insert(swotRows);if(r.error)throw r.error;}

    for (const [id,fator] of Object.entries(FACTOR_MAP)) {
      const value=val(id);
      const r=await client.from("itens_pestel").upsert({plano_negocio_id:planId,fator,analise:value||null},{onConflict:"plano_negocio_id,fator"});
      if(r.error)throw r.error;
    }
    for (const [id,[tipo,noteId]] of Object.entries(PORTER_MAP)) {
      const raw=val(id);
      const intensity=raw ? (raw==="Baixa"||raw==="Baixo"?1:raw==="Média"||raw==="Médio"?3:5) : null;
      const r=await client.from("forcas_porter").upsert({plano_negocio_id:planId,tipo_forca:tipo,analise:val(noteId)||null,intensidade:intensity},{onConflict:"plano_negocio_id,tipo_forca"});
      if(r.error)throw r.error;
    }
  }

  async function syncPlanSections(planId) {
    for(let index=0;index<PLAN_SECTIONS.length;index++){
      const key=PLAN_SECTIONS[index];
      const section=document.querySelector('[data-plan-section="'+key+'"]');
      if(!section)continue;
      const fields=[...section.querySelectorAll("[data-plan-field]")];
      const content={};
      fields.forEach(f=>content[f.dataset.planField]=f.value);
      const filled=fields.filter(f=>f.value.trim()).length;
      const percent=fields.length?Math.round(filled/fields.length*100):0;
      const title=section.querySelector("h3")?.textContent?.trim() || key;
      const r=await client.from("secoes_plano").upsert({
        plano_negocio_id:planId,numero_secao:index+1,tipo_secao:key,titulo:title,
        conteudo:JSON.stringify(content),percentual_conclusao:percent,posicao:index
      },{onConflict:"plano_negocio_id,numero_secao"});
      if(r.error)throw r.error;
    }
  }

  function scenarioData(params, scenario) {
    const factor = scenario==="pessimistic" ? {demand:.8,variable:1.1} : scenario==="optimistic" ? {demand:1.2,variable:.9} : {demand:1,variable:1};
    const investment=params.investimento_inicial, fixed=params.custos_fixos, variable=params.custo_variavel_unitario*factor.variable;
    const price=params.preco_unitario, growth=params.taxa_crescimento/100, horizon=params.horizonte_meses, demand0=params.demanda_inicial*factor.demand;
    let cumulative=-investment,revenue=0,profit=0,payback=null; const rows=[];
    const discount=params.taxa_desconto/100; const monthlyDiscount=discount>0?Math.pow(1+discount,1/12)-1:0;
    for(let month=1;month<=horizon;month++){
      const demand=Math.max(0,demand0*Math.pow(1+growth,month-1));
      const rev=demand*price, costs=fixed+demand*variable, net=rev-costs; cumulative+=net; revenue+=rev; profit+=net;
      if(payback===null&&cumulative>=0)payback=month-1+(net>0?Math.abs(cumulative-net)/net:0);
      rows.push({month,demand,revenue:rev,custos_fixos:fixed,custos_variaveis:demand*variable,lucro_operacional:net,fluxo_caixa:net});
    }
    const margin=revenue?profit/revenue:null, contribution=price-variable, breakEven=contribution>0?fixed/contribution:null;
    let npv=-investment; rows.forEach(r=>npv+=r.fluxo_caixa/Math.pow(1+monthlyDiscount,r.month));
    const roi=investment>0?((profit-investment)/investment)*100:null;
    return {factor,revenue,profit,margin,breakEven,npv,roi,payback,rows};
  }

  async function syncFinancial(planId) {
    const p=financialInputs();
    const r=await client.from("planos_financeiros").upsert({plano_negocio_id:planId,...p},{onConflict:"plano_negocio_id"}).select("id");
    if(r.error)throw r.error;
    const pf=r.data?.[0]; if(!pf?.id)throw new Error("Plano financeiro não retornou ID.");
    const labels={pessimistic:"pessimista",realistic:"realista",optimistic:"otimista"};
    for(const scenario of Object.keys(labels)){
      const d=scenarioData(p,scenario);
      const sr=await client.from("cenarios_financeiros").upsert({
        plano_financeiro_id:pf.id,tipo_cenario:labels[scenario],
        ajuste_demanda:d.factor.demand-1,ajuste_custo:d.factor.variable-1,
        receita:d.revenue,lucro_operacional:d.profit,ponto_equilibrio:d.breakEven,
        margem:d.margin,valor_presente_liquido:d.npv,taxa_interna_retorno:null,
        payback_meses:d.payback,roi:d.roi
      },{onConflict:"plano_financeiro_id,tipo_cenario"}).select("id");
      if(sr.error)throw sr.error;
      const scenarioId=sr.data?.[0]?.id;
      if(!scenarioId)continue;
      const deleted=await client.from("projecoes_financeiras").delete().eq("cenario_financeiro_id",scenarioId);
      if(deleted.error)throw deleted.error;
      if(d.rows.length){
        const rows=d.rows.map(row=>({cenario_financeiro_id:scenarioId,periodo:row.month,demanda:row.demand,receita:row.revenue,custos_fixos:row.custos_fixos,custos_variaveis:row.custos_variaveis,lucro_operacional:row.lucro_operacional,fluxo_caixa:row.fluxo_caixa}));
        const pr=await client.from("projecoes_financeiras").insert(rows); if(pr.error)throw pr.error;
      }
    }
  }

  async function syncComplementary(planId) {
    const c=complementaryState();
    const data={
      marketing:{objective:c.marketingObjective||"",audience:c.marketingAudience||"",channels:c.marketingChannels||"",offer:c.marketingOffer||"",metrics:c.marketingMetrics||""},
      operacoes:{processo:c.operationsProcess||"",recursos:c.operationsResources||"",fornecedores:c.operationsSuppliers||"",capacidade:c.operationsCapacity||"",indicadores:c.operationsMetrics||""},
      pessoas:{estrutura:c.peopleStructure||"",competencias:c.peopleSkills||"",contratacao:c.peopleHiring||"",cultura:c.peopleCulture||""},
      juridico:{societario:c.legalEntity||"",licencas:c.legalLicenses||"",contratos:c.legalContracts||"",privacidade:c.legalPrivacy||""},
      tecnologia_informacao:{sistemas:c.itSystems||"",dados:c.itData||"",seguranca:c.itSecurity||"",roadmap:c.itRoadmap||""}
    };
    const r=await client.from("planos_complementares").upsert({plano_negocio_id:planId,...data},{onConflict:"plano_negocio_id"});
    if(r.error)throw r.error;
  }

  function snapshot() {
    const swot=getSwot();
    return {
      v:3,createdAt:new Date().toISOString(),
      opportunity:Object.fromEntries(new FormData(document.getElementById("opportunityForm")||document.createElement("form")).entries()),
      environment:{swot,pestel:Object.fromEntries(Object.keys(FACTOR_MAP).map(id=>[id,val(id)])),porter:Object.fromEntries(Object.keys(PORTER_MAP).map(id=>[id,val(id),val(PORTER_MAP[id][1])]))},
      plan:planFieldState(),financial:financialInputs(),complementary:complementaryState()
    };
  }

  async function syncManagement(planId) {
    if(typeof window.getProgress!=="function")return;
    const modules=window.getProgress();
    const overall=Math.round(modules.reduce((a,b)=>a+b,0)/modules.length);
    const alerts=typeof window.getAlerts==="function"?window.getAlerts():[];
    const p=await client.from("painel_gestao").upsert({plano_negocio_id:planId,ultima_revisao_em:new Date().toISOString(),pontuacao_geral:overall},{onConflict:"plano_negocio_id"});
    if(p.error)throw p.error;
    const clearedAlerts=await client.from("alertas_plano").delete().eq("plano_negocio_id",planId);
    if(clearedAlerts.error)throw clearedAlerts.error;
    if(alerts.length){
      const rows=alerts.map(a=>({plano_negocio_id:planId,tipo_alerta:a[0]==="critical"?"inconsistencia":"revisao",severidade:a[0]==="critical"?"critico":"aviso",mensagem:a[1],resolvido:false}));
      const ar=await client.from("alertas_plano").insert(rows);if(ar.error)throw ar.error;
    }
    const checks=typeof window.getChecklist==="function"?window.getChecklist(modules):[];
    const updatedPlan=await client.from("planos_negocio").update({percentual_conclusao:overall,modulo_atual:Math.min(7,modules.findIndex(v=>v<100)+1||7)}).eq("id",planId);
    if(updatedPlan.error)throw updatedPlan.error;
    const activity=await client.from("registros_atividade").insert({plano_negocio_id:planId,usuario_id:(await currentUser())?.id||null,acao:"sincronizar_plano",tipo_entidade:"plano_negocio",entidade_id:planId,metadados:{overall,alerts:alerts.length,pending:checks.filter(c=>!c.ok).length}});
    if(activity.error)throw activity.error;
  }

  async function syncAll(reason="manual") {
    if(syncing)return;
    const user=await currentUser(); if(!user)return;
    syncing=true;
    try {
      const plan=await ensurePlan(); if(!plan)return;
      await syncEnvironment(plan.id);
      await syncPlanSections(plan.id);
      await syncFinancial(plan.id);
      await syncComplementary(plan.id);
      // O Módulo 7 é persistido em best-effort: uma falha aqui não invalida
      // a sincronização dos Módulos 1 a 6 já concluída.
      try { await syncManagement(plan.id); }
      catch (managementError) { console.warn("Neon: persistência do Módulo 7", managementError); }
      if(reason==="manual")showToastSafe("Plano sincronizado com o banco.");
    } catch(err) {
      console.error("Neon: sincronização completa",err);
      if(reason==="manual")showToastSafe("Não foi possível sincronizar todos os módulos. Os dados locais foram preservados.");
    } finally { syncing=false; }
  }

  async function loadEnvironment(planId) {
    const [swot,pestel,porter]=await Promise.all([
      client.from("itens_swot").select("categoria,conteudo,posicao").eq("plano_negocio_id",planId).order("posicao"),
      client.from("itens_pestel").select("fator,analise").eq("plano_negocio_id",planId),
      client.from("forcas_porter").select("tipo_forca,analise,intensidade").eq("plano_negocio_id",planId)
    ]);
    if(swot.error||pestel.error||porter.error)throw(swot.error||pestel.error||porter.error);
    const lists={forca:"strengths",fraqueza:"weaknesses",oportunidade:"opportunities",ameaca:"threats"};
    for(const key of Object.values(lists)){const list=document.querySelector('[data-swot-list="'+key+'"]');if(list)list.innerHTML="";}
    (swot.data||[]).forEach(row=>{ const key=lists[row.categoria]; if(!key||typeof window.addSwotItem!=="function")return; window.addSwotItem(key,row.conteudo||"",false); });
    (pestel.data||[]).forEach(row=>{const id=Object.keys(FACTOR_MAP).find(k=>FACTOR_MAP[k]===row.fator);const el=document.getElementById(id);if(el)el.value=row.analise||"";});
    const porterReverse=Object.entries(PORTER_MAP);
    (porter.data||[]).forEach(row=>{
      const pair=porterReverse.find(([,v])=>v[0]===row.tipo_forca); if(!pair)return;
      const id=pair[0], note=pair[1][1], intensity=Number(row.intensidade||0);
      const el=document.getElementById(id), noteEl=document.getElementById(note);
      if(el)el.value=(id==="porterSuppliers"||id==="porterCustomers")?(intensity>=5?"Alto":intensity>=3?"Médio":intensity>=1?"Baixo":""):(intensity>=5?"Alta":intensity>=3?"Média":intensity>=1?"Baixa":"");
      if(noteEl)noteEl.value=row.analise||"";
    });
  }

  async function loadPlanSections(planId) {
    const r=await client.from("secoes_plano").select("numero_secao,tipo_secao,conteudo").eq("plano_negocio_id",planId).order("numero_secao");
    if(r.error)throw r.error;
    (r.data||[]).forEach(row=>{
      let data={};try{data=JSON.parse(row.conteudo||"{}");}catch{}
      Object.entries(data).forEach(([key,value])=>{const el=document.querySelector('[data-plan-field="'+key+'"]');if(el)el.value=value??"";});
    });
  }

  async function loadFinancial(planId) {
    const pf=await client.from("planos_financeiros").select("*").eq("plano_negocio_id",planId).limit(1);
    if(pf.error)throw pf.error;
    const row=pf.data?.[0]; if(!row)return;
    const map={investimento_inicial:"financialInvestment",custos_fixos:"financialFixedCosts",custo_variavel_unitario:"financialVariableCost",preco_unitario:"financialUnitPrice",demanda_inicial:"financialInitialDemand",taxa_crescimento:"financialGrowthRate",horizonte_meses:"financialHorizon",taxa_desconto:"financialDiscountRate"};
    Object.entries(map).forEach(([key,id])=>{const el=document.getElementById(id);if(el&&row[key]!==null&&row[key]!==undefined)el.value=row[key];});
    window.renderFinancial?.(); window.updateDashboardState?.();
  }

  async function loadComplementary(planId) {
    const r=await client.from("planos_complementares").select("*").eq("plano_negocio_id",planId).limit(1);
    if(r.error)throw r.error; const row=r.data?.[0];if(!row)return;
    const map={marketing:{marketingObjective:"objective",marketingAudience:"audience",marketingChannels:"channels",marketingOffer:"offer",marketingMetrics:"metrics"},operacoes:{operationsProcess:"processo",operationsResources:"recursos",operationsSuppliers:"fornecedores",operationsCapacity:"capacidade",operationsMetrics:"indicadores"},pessoas:{peopleStructure:"estrutura",peopleSkills:"competencias",peopleHiring:"contratacao",peopleCulture:"cultura"},juridico:{legalEntity:"societario",legalLicenses:"licencas",legalContracts:"contratos",legalPrivacy:"privacidade"},tecnologia_informacao:{itSystems:"sistemas",itData:"dados",itSecurity:"seguranca",itRoadmap:"roadmap"}};
    Object.entries(map).forEach(([group,fields])=>Object.entries(fields).forEach(([id,key])=>{const el=document.querySelector('[data-complementary-field="'+id+'"]');if(el)el.value=row[group]?.[key]||"";}));
    window.updateComplementaryProgress?.();window.updateDashboardState?.();
  }

  async function loadPlan(planId) {
    const user=await currentUser();if(!user)return;
    try {
      storePlanId(planId);
      const p=await client.from("planos_negocio").select("id,nome").eq("id",planId).limit(1);
      if(p.error)throw p.error;
      clearUI();
      if(p.data?.[0] && document.getElementById("businessName"))document.getElementById("businessName").value=p.data[0].nome||"";
      const [op,valRows]=await Promise.all([
        client.from("analises_oportunidade").select("*").eq("plano_negocio_id",planId).limit(1),
        client.from("propostas_valor").select("*").eq("plano_negocio_id",planId).limit(1)
      ]);
      if(op.error||valRows.error)throw(op.error||valRows.error);
      const o=op.data?.[0],v=valRows.data?.[0];
      const fields={problem:o?.problema,solution:o?.solucao,audience:o?.publico_alvo,marketLocation:o?.localizacao,differentials:o?.diferenciais,customerJobs:v?.trabalhos_clientes,customerPains:v?.dores,customerGains:v?.ganhos,products:v?.produtos_servicos,painRelievers:v?.alivios_dores,gainCreators:v?.criadores_ganhos};
      Object.entries(fields).forEach(([id,value])=>{const el=document.getElementById(id);if(el&&value!==undefined)el.value=value||"";});
      await loadEnvironment(planId); await loadPlanSections(planId); await loadFinancial(planId); await loadComplementary(planId);
      dispatchModuleInputs();
      showToastSafe("Plano carregado do banco.");
    } catch(err) { console.error("Neon: carregamento do plano",err); showToastSafe("Não foi possível carregar o plano selecionado."); }
  }

  async function switchPlan(id) { if(id) await loadPlan(id); }

  async function persistVersion() {
    const user=await currentUser();if(!user)return;
    const plan=await ensurePlan();if(!plan)return;
    const s=snapshot();
    const latest=await client.from("versoes_plano").select("numero_versao").eq("plano_negocio_id",plan.id).order("numero_versao",{ascending:false}).limit(1);
    if(latest.error)throw latest.error;
    const next=(latest.data?.[0]?.numero_versao||0)+1;
    const r=await client.from("versoes_plano").insert({plano_negocio_id:plan.id,numero_versao:next,retrato_plano:s,criado_por_usuario_id:user.id});
    if(r.error)throw r.error;
    return {plan,next};
  }

  async function persistShareLink() {
    const user=await currentUser();if(!user){showToastSafe("Entre para criar um compartilhamento persistente.");return;}
    const saved=await persistVersion(); if(!saved)return;
    const token=(crypto.randomUUID?crypto.randomUUID():Date.now()+"-"+Math.random().toString(36).slice(2));
    const r=await client.from("links_compartilhamento").insert({plano_negocio_id:saved.plan.id,token,permissao:"visualizar",criado_por_usuario_id:user.id});
    if(r.error)throw r.error;
    const url=new URL(location.href);url.search="";url.searchParams.set("share",token);url.hash="exportacao";
    const output=document.getElementById("shareLinkOutput");if(output)output.value=url.toString();
    document.getElementById("copyShareLink")?.removeAttribute("disabled");
    document.getElementById("shareLinkOutput")?.classList.toggle("share-link-long",url.toString().length>1800);
    setExportStatusSafe("Link persistente criado no banco. O acesso compartilhado exige autenticação.");
  }

  function setExportStatusSafe(message){const el=document.getElementById("exportStatus");if(el)el.textContent=message;}

  async function logExport(format) {
    const user=await currentUser();if(!user)return;
    const plan=await ensurePlan();if(!plan)return;
    const r=await client.from("exportacoes").insert({plano_negocio_id:plan.id,formato:format,status:"concluido",criado_por_usuario_id:user.id,concluido_em:new Date().toISOString()});
    if(r.error)console.warn("Neon: log de exportação",r.error);
  }

  async function loadSharedToken() {
    const token=new URLSearchParams(location.search).get("share");if(!token)return;
    const user=await currentUser();if(!user){showToastSafe("Entre na conta para abrir o compartilhamento.");return;}
    const link=await client.from("links_compartilhamento").select("id,plano_negocio_id,expira_em,revogado_em").eq("token",token).limit(1);
    if(link.error||!link.data?.[0]){showToastSafe("Link de compartilhamento inválido ou inexistente.");return;}
    const l=link.data[0];
    if(l.revogado_em||(l.expira_em&&new Date(l.expira_em)<new Date())){showToastSafe("Este link de compartilhamento expirou ou foi revogado.");return;}
    await loadPlan(l.plano_negocio_id);
  }

  function debounceSync() {
    clearTimeout(window.__neonSyncTimer);
    window.__neonSyncTimer=setTimeout(()=>syncAll("auto"),1200);
  }

  function dispatchModuleInputs() {
    document.querySelectorAll("#opportunityForm input,#opportunityForm textarea,#ambientes input,#ambientes textarea,#ambientes select,#plano input,#plano textarea,#financeiro input,#financeiro select,#complementares input,#complementares textarea").forEach(el=>el.dispatchEvent(new Event("input",{bubbles:true})));
  }

  function bindSyncEvents() {
    // Delegação no document: um listener por tipo de evento cobre também campos
    // criados dinamicamente (ex.: itens do SWOT), em vez de um listener por campo.
    const scope="#opportunityForm, #ambientes, #plano, #financeiro, #complementares";
    const inScope=target=>target instanceof Element && target.closest(scope);
    document.addEventListener("input",event=>{ if(inScope(event.target)) debounceSync(); });
    document.addEventListener("change",event=>{ if(inScope(event.target)) debounceSync(); });
    ["saveEnvironment","savePlan","saveFinancial","saveComplementary"].forEach(id=>document.getElementById(id)?.addEventListener("click",()=>syncAll("manual")));
    document.getElementById("savePlanVersion")?.addEventListener("click",()=>setTimeout(()=>persistVersion().catch(console.error),250));
    document.getElementById("createShareLink")?.addEventListener("click",()=>setTimeout(()=>persistShareLink().catch(console.error),250));
    document.getElementById("exportPdf")?.addEventListener("click",()=>logExport("pdf"));
    document.getElementById("exportWord")?.addEventListener("click",()=>logExport("doc"));
    document.getElementById("exportExcel")?.addEventListener("click",()=>logExport("csv"));
  }

  async function init() {
    await waitForClient();
    if(!client)return;
    ensureManagerUI();
    bindSyncEvents();
    const user=await currentUser();
    if(!user){refreshPlanSelector().catch(()=>{});return;}
    try {
      const shareToken=new URLSearchParams(location.search).get("share");
      if(shareToken){
        await loadSharedToken();
        await refreshPlanSelector().catch(()=>{});
        return;
      }
      const plan=await ensurePlan();
      if(plan)await refreshPlanSelector();
      // Preservação do rascunho local: se há trabalho não sincronizado neste
      // navegador, o carregamento automático não sobrescreve o que já foi digitado.
      if(plan && !hasLocalDrafts()) await loadPlan(plan.id);
    } catch(err){console.error("Neon: inicialização",err);}
    window.addEventListener("hashchange",()=>{if(window.getProgress)syncAll("auto");});
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();