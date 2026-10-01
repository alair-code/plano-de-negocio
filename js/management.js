(() => {
  "use strict";

  const STORAGE_KEY = "business-plan-builder:management:v1";
  const moduleNames = [
    "Identificação da Oportunidade",
    "Análise de Ambientes",
    "Plano de Negócios",
    "Viabilidade Financeira",
    "Planos Complementares",
    "Exportação e Compartilhamento",
    "Painel e Gestão"
  ];

  const getValue = (id) => String(document.getElementById(id)?.value || "").trim();
  const filled = (id) => Boolean(getValue(id));

  function getProgress() {
    const opportunity = typeof getOpportunityProgress === "function" ? getOpportunityProgress() : 0;
    const environment = typeof getEnvironmentProgress === "function" ? getEnvironmentProgress() : 0;
    const plan = typeof getPlanProgress === "function" ? getPlanProgress() : 0;
    const financial = typeof getFinancialProgress === "function" ? getFinancialProgress() : 0;
    const complementary = typeof getComplementaryProgress === "function" ? getComplementaryProgress() : 0;
    const exportProgress = complementary === 100 ? 100 : 0;
    const firstSixComplete = [opportunity, environment, plan, financial, complementary, exportProgress].every(value => value === 100);
    const criticalAlerts = getAlerts().filter(alert => alert[0] === "critical").length;
    const reviewed = localStorage.getItem("business-plan-builder:management:final-review") === "true";
    const managementComplete = firstSixComplete && criticalAlerts === 0 && reviewed;
    return [opportunity, environment, plan, financial, complementary, exportProgress, managementComplete ? 100 : 0];
  }

  function getChecklist(modules) {
    const swot = typeof getSwotState === "function" ? getSwotState() : {strengths:[],weaknesses:[],opportunities:[],threats:[]};
    const pestelIds = ["pestelPolitical","pestelEconomic","pestelSocial","pestelTechnological","pestelEnvironmental","pestelLegal"];
    const porterIds = ["porterRivalry","porterEntrants","porterSuppliers","porterCustomers","porterSubstitutes"];
    const planValues = typeof getPlanSectionProgress === "function" ? getPlanSectionProgress() : [];
    const checks = [
      {label:"Oportunidade: campos essenciais preenchidos", ok:modules[0]===100, target:"#oportunidade"},
      {label:"SWOT: os quatro quadrantes possuem conteúdo", ok:["strengths","weaknesses","opportunities","threats"].every(k=>swot[k]?.length), target:"#ambientes"},
      {label:"PESTEL: os seis fatores foram registrados", ok:pestelIds.every(filled), target:"#ambientes"},
      {label:"Porter: as cinco forças foram avaliadas", ok:porterIds.every(filled), target:"#ambientes"},
      ...[
        ["Resumo Executivo","executiveSummary"],
        ["Descrição da Empresa","companyDescription"],
        ["Produtos e Serviços","productsServices"],
        ["Mercado e Concorrência","marketCompetition"],
        ["Marketing e Vendas","marketingSales"],
        ["Plano Operacional","operationalPlan"],
        ["Gestão de Pessoas","peopleManagement"],
        ["Plano Financeiro","financialPlan"],
        ["Análise Estratégica","strategicAnalysis"],
        ["Anexos","appendices"]
      ].map(([label,key],index)=>({
        label:"Plano · "+String(index+1).padStart(2,"0")+" — "+label,
        ok:planValues[index]===100,
        target:"#plano"
      })),
      {label:"Financeiro: premissas essenciais preenchidas", ok:modules[3]===100, target:"#financeiro"},
      {label:"Planos complementares: campos preenchidos", ok:modules[4]===100, target:"#complementares"},
      {label:"Exportação: plano consolidado disponível", ok:modules[5]===100, target:"#exportacao"}
    ];
    return checks;
  }

  function getAlerts() {
    const alerts=[];
    const price=Number(document.getElementById("financialUnitPrice")?.value);
    const variable=Number(document.getElementById("financialVariableCost")?.value);
    const demand=Number(document.getElementById("financialInitialDemand")?.value);
    const investment=Number(document.getElementById("financialInvestment")?.value);
    const fixed=Number(document.getElementById("financialFixedCosts")?.value);

    if (filled("businessName") && !filled("audience")) alerts.push(["warning","O público principal ainda não foi definido.","#oportunidade"]);
    if (Number.isFinite(price) && Number.isFinite(variable) && price > 0 && variable > price)
      alerts.push(["critical","O custo variável por unidade está acima do preço informado.","#financeiro"]);
    if (Number.isFinite(price) && Number.isFinite(variable) && price > 0 && variable === price)
      alerts.push(["warning","O preço informado é igual ao custo variável por unidade; não há margem de contribuição.","#financeiro"]);
    if (Number.isFinite(demand) && demand === 0) alerts.push(["warning","A demanda inicial está zerada; revise a premissa financeira.","#financeiro"]);
    if (Number.isFinite(investment) && investment < 0) alerts.push(["critical","O investimento inicial não pode ser negativo.","#financeiro"]);
    if (Number.isFinite(fixed) && fixed < 0) alerts.push(["critical","Os custos fixos não podem ser negativos.","#financeiro"]);

    const financialProfit=document.getElementById("financialProfit")?.textContent || "";
    if (financialProfit.includes("-")) alerts.push(["warning","A projeção atual apresenta lucro operacional negativo. Revise preço, demanda e custos.","#financeiro"]);

    return alerts;
  }

  function ensureStyles() {
    if (document.getElementById("managementStyles")) return;
    const style=document.createElement("style");
    style.id="managementStyles";
    style.textContent=`
      #gestao .management-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin:24px 0}
      #gestao .management-metric{padding:20px;border:1px solid rgba(20,32,55,.1);border-radius:18px;background:#fff;box-shadow:0 8px 24px rgba(20,32,55,.06)}
      #gestao .management-metric span{display:block;font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;color:#6c7585}
      #gestao .management-metric strong{display:block;font-size:2rem;margin-top:8px}
      #gestao .management-columns{display:grid;grid-template-columns:1.1fr .9fr;gap:20px}
      #gestao .management-card{padding:24px;border-radius:20px;background:#fff;border:1px solid rgba(20,32,55,.1);box-shadow:0 8px 24px rgba(20,32,55,.05)}
      #gestao .management-card h3{margin:0 0 8px}
      #gestao .management-card>p{margin:0 0 18px;color:#697386}
      #gestao .management-list{display:grid;gap:10px}
      #gestao .management-check,.management-alert{display:flex;align-items:flex-start;gap:12px;padding:14px;border-radius:14px;background:#f7f8fa}
      #gestao .management-check button{margin-left:auto;border:0;background:none;text-decoration:underline;cursor:pointer;color:inherit}
      #gestao .management-check.ok{opacity:.72}
      #gestao .management-check .check-icon{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#e9edf2;flex:0 0 auto}
      #gestao .management-check.ok .check-icon{background:#dff5e7}
      #gestao .management-alert{border-left:4px solid #d6a62c}
      #gestao .management-alert.critical{border-left-color:#c94b4b}
      #gestao .management-alert .alert-icon{font-weight:800}
      #gestao .management-empty{padding:18px;border-radius:14px;background:#f7f8fa;color:#697386}
      #gestao .management-footer{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-top:20px;flex-wrap:wrap}
      #gestao .management-status{color:#697386;font-size:.9rem}
      @media(max-width:900px){#gestao .management-grid{grid-template-columns:repeat(2,minmax(0,1fr))}#gestao .management-columns{grid-template-columns:1fr}}
      @media(max-width:560px){#gestao .management-grid{grid-template-columns:1fr}#gestao .management-card{padding:18px}#gestao .management-metric strong{font-size:1.6rem}}
    `;
    document.head.appendChild(style);
  }

  function ensureMarkup() {
    if (document.getElementById("gestao")) return document.getElementById("gestao");
    const section=document.createElement("section");
    section.className="module-section management-section";
    section.id="gestao";
    section.innerHTML=`
      <div class="module-header">
        <div>
          <p class="eyebrow">MÓDULO 07 · PAINEL E GESTÃO</p>
          <h2>Veja o que está pronto, o que falta e o que precisa de revisão.</h2>
          <p>Este painel consolida os dados já preenchidos, aponta pendências e ajuda a fazer a revisão final antes de considerar o plano concluído.</p>
        </div>
        <a class="button secondary-light" href="#exportacao">← Módulo 6</a>
      </div>
      <div class="management-grid">
        <article class="management-metric"><span>Progresso geral</span><strong id="managementOverall">0%</strong></article>
        <article class="management-metric"><span>Módulos concluídos</span><strong id="managementCompleted">0/7</strong></article>
        <article class="management-metric"><span>Pendências</span><strong id="managementPending">0</strong></article>
        <article class="management-metric"><span>Alertas</span><strong id="managementAlerts">0</strong></article>
      </div>
      <div class="management-columns">
        <section class="management-card">
          <h3>Checklist de conclusão</h3>
          <p>Use esta lista para identificar o que ainda precisa ser preenchido.</p>
          <div id="managementChecklist" class="management-list"></div>
        </section>
        <section class="management-card">
          <h3>Alertas de consistência</h3>
          <p>O painel sinaliza situações que merecem revisão antes de considerar o plano pronto.</p>
          <div id="managementAlertList" class="management-list"></div>
        </section>
      </div>
      <div class="management-card" style="margin-top:20px">
        <h3>Próximo passo</h3>
        <p id="managementNextStep">Complete os módulos na sequência para avançar.</p>
        <div class="management-footer">
          <span id="managementStatus" class="management-status">Painel atualizado.</span>
          <div>
            <button type="button" class="button secondary-light" id="refreshManagement">Atualizar painel</button>
            <button type="button" class="button primary" id="finalReviewButton">Marcar revisão final</button>
          </div>
        </div>
      </div>`;
    document.querySelector(".main-content")?.appendChild(section);
    return section;
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY,JSON.stringify({updatedAt:new Date().toISOString()}));
  }

  function render() {
    ensureStyles();
    ensureMarkup();
    const modules=getProgress();
    const overall=Math.round(modules.reduce((a,b)=>a+b,0)/modules.length);
    const checks=getChecklist(modules);
    const alerts=getAlerts();
    const completed=modules.filter(v=>v===100).length;
    const pending=checks.filter(c=>!c.ok).length;

    document.getElementById("managementOverall").textContent=overall+"%";
    document.getElementById("managementCompleted").textContent=completed+"/7";
    document.getElementById("managementPending").textContent=pending;
    document.getElementById("managementAlerts").textContent=alerts.length;

    const checklist=document.getElementById("managementChecklist");
    checklist.innerHTML=checks.map(c=>`<div class="management-check ${c.ok?"ok":""}"><span class="check-icon">${c.ok?"✓":"!"}</span><span>${c.label}</span><button type="button" data-management-target="${c.target}">Ir →</button></div>`).join("");
    checklist.querySelectorAll("[data-management-target]").forEach(btn=>btn.addEventListener("click",()=>location.hash=btn.dataset.managementTarget));

    const alertList=document.getElementById("managementAlertList");
    alertList.innerHTML=alerts.length ? alerts.map(a=>`<div class="management-alert ${a[0]}"><span class="alert-icon">${a[0]==="critical"?"!":"i"}</span><div><strong>${a[1]}</strong><br><button type="button" class="text-button" data-management-target="${a[2]}">Revisar</button></div></div>`).join("") : '<div class="management-empty">Nenhuma inconsistência identificada neste momento.</div>';
    alertList.querySelectorAll("[data-management-target]").forEach(btn=>btn.addEventListener("click",()=>location.hash=btn.dataset.managementTarget));

    const nextIndex=modules.findIndex(v=>v<100);
    const finalReviewButton=document.getElementById("finalReviewButton");
    const firstSixComplete=modules.slice(0,6).every(value=>value===100);
    const criticalAlerts=alerts.filter(alert=>alert[0]==="critical").length;
    const reviewed=localStorage.getItem("business-plan-builder:management:final-review")==="true";
    if(finalReviewButton){
      finalReviewButton.textContent=reviewed ? "Revisão final registrada" : "Marcar revisão final";
      finalReviewButton.disabled=!firstSixComplete || criticalAlerts>0;
      finalReviewButton.title=!firstSixComplete
        ?"Conclua os módulos 1 a 6 antes da revisão final."
        :criticalAlerts>0
          ?"Resolva os alertas críticos antes da revisão final."
          :"Registre que você revisou o plano.";
    }
    document.getElementById("managementNextStep").textContent=nextIndex===-1
      ?"Plano concluído. A revisão final foi registrada e não há alertas críticos."
      :firstSixComplete
        ?criticalAlerts>0
          ?"Resolva os alertas críticos antes de registrar a revisão final."
          :reviewed
            ?"A revisão final foi registrada. Você pode continuar refinando o plano."
            :"Faça a revisão final para concluir o plano."
        :"Próximo passo: concluir o Módulo "+(nextIndex+1)+" — "+moduleNames[nextIndex]+".";
    document.getElementById("managementStatus").textContent="Painel atualizado às "+new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"});
    saveState();

    // O M7 passa a ser a etapa final do dashboard.
    const original=window.__managementPreviousDashboard || window.updateDashboardState;
    if (typeof original==="function" && !window.__managementWrapped) {
      window.__managementPreviousDashboard=original;
      window.updateDashboardState=function(){
        original();
        const values=getProgress();
        const cards=document.querySelectorAll("[data-dashboard-module]");
        const card=cards[6];
        if(!card)return;
        const unlocked=values[5]===100;
        card.classList.toggle("completed",values[6]===100);
        card.classList.toggle("current",unlocked && values[6]<100);
        const status=card.querySelector(".module-status");
        const locked=card.querySelector(".locked");
        if(status){status.classList.toggle("muted",!unlocked);status.textContent=values[6]===100?"Concluído":unlocked?"Disponível":"Bloqueado";}
        if(locked)locked.textContent=unlocked?"Pronto para a revisão final":"Disponível após concluir o módulo 6";
        let action=card.querySelector(".module-action");
        if(unlocked){
          if(!action){action=document.createElement("a");action.className="module-action";card.appendChild(action);}
          action.href="#gestao";action.textContent=values[6]===100?"Revisar →":"Fazer revisão →";action.classList.remove("disabled");action.removeAttribute("aria-disabled");
        } else if(action){action.classList.add("disabled");action.setAttribute("aria-disabled","true");}
        const overall=Math.round(values.reduce((sum,value)=>sum+value,0)/values.length);
        const progressLabel=document.querySelector(".progress-mini .progress-label strong");
        const progressFill=document.querySelector(".progress-mini .progress-track span");
        const heroPercent=document.getElementById("heroProgressPercent");
        const heroFill=document.getElementById("heroProgressFill");
        if(progressLabel)progressLabel.textContent=overall+"%";
        if(progressFill)progressFill.style.width=overall+"%";
        if(heroPercent)heroPercent.textContent=overall+"%";
        if(heroFill)heroFill.style.width=overall+"%";
        const completed=values.filter(value=>value===100).length;
        const started=values.filter(value=>value>0).length;
        const dashboardStatus=document.getElementById("dashboardStatus");
        if(dashboardStatus)dashboardStatus.textContent=completed+" de 7 módulos concluídos · "+started+" em andamento/iniciados";
      };
      window.__managementWrapped=true;
    }
    if(typeof window.updateDashboardState==="function") window.updateDashboardState();
  }

  document.addEventListener("DOMContentLoaded",render);
  function showToastSafe(message){
    if(typeof window.showToast==="function")window.showToast(message);
  }

  window.addEventListener("hashchange",()=>{
    if(location.hash!=="#gestao")return;
    const values=getProgress();
    if(values[5]!==100){
      history.replaceState(null,"","#exportacao");
      if(typeof window.showToast==="function") window.showToast("Conclua o Módulo 6 antes de acessar o Painel e Gestão.");
      return;
    }
    render();
  });
  function invalidateFinalReview(){
    if(localStorage.getItem("business-plan-builder:management:final-review")==="true"){
      localStorage.removeItem("business-plan-builder:management:final-review");
    }
  }

  document.addEventListener("input",()=>{
    invalidateFinalReview();
    window.clearTimeout(window.__managementTimer);
    window.__managementTimer=window.setTimeout(render,250);
  });
  document.addEventListener("change",()=>{
    invalidateFinalReview();
    window.setTimeout(render,0);
  });
  document.addEventListener("click",(event)=>{
    const target=event.target.closest?.("#refreshManagement");
    if(target)render();
    if(event.target.closest?.("#finalReviewButton")){
      const modules=getProgress();
      const alerts=getAlerts();
      if(!modules.slice(0,6).every(value=>value===100)){
        showToastSafe("Conclua os módulos 1 a 6 antes da revisão final.");
        return;
      }
      if(alerts.some(alert=>alert[0]==="critical")){
        showToastSafe("Resolva os alertas críticos antes da revisão final.");
        return;
      }
      localStorage.setItem("business-plan-builder:management:final-review","true");
      render();
      if(typeof window.updateDashboardState==="function")window.updateDashboardState();
      if(typeof window.showToast==="function")window.showToast("Revisão final registrada. O plano foi marcado como concluído.");
    }
  });

  // APIs consumidas por js/server-sync.js para persistir o Módulo 7
  // (painel_gestao, alertas_plano e registros_atividade).
  window.getProgress = getProgress;
  window.getChecklist = getChecklist;
  window.getAlerts = getAlerts;
})();