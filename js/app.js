
const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const demoButton = document.getElementById("demoButton");
const toast = document.getElementById("toast");

menuButton?.addEventListener("click", () => sidebar?.classList.toggle("open"));
document.querySelectorAll(".nav-item").forEach((item) => item.addEventListener("click", () => sidebar?.classList.remove("open")));

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3200);
}
demoButton?.addEventListener("click", () => showToast("A demonstração será ampliada conforme os módulos forem construídos."));

const navItems = document.querySelectorAll(".nav-item");
function updateActiveNav() {
  const hash = window.location.hash || "#dashboard";
  navItems.forEach((item) => item.classList.toggle("active", item.getAttribute("href") === hash));
}
window.addEventListener("hashchange", updateActiveNav);
updateActiveNav();

document.querySelectorAll(".nav-item[href^='#']").forEach((item) => {
  item.addEventListener("click", (event) => {
    const target = item.getAttribute("href");
    const guards = {"#ambientes": () => getOpportunityProgress() === 100, "#plano": () => getEnvironmentProgress() === 100};
    const guard = guards[target];
    if (guard && !guard()) {
      event.preventDefault();
      showToast(target === "#ambientes" ? "Conclua o módulo 1 para acessar o módulo 2." : "Conclua o módulo 2 para acessar o módulo 3.");
    }
  });
});

const form = document.getElementById("opportunityForm");
const saveStatus = document.getElementById("saveStatus");
const storageKey = "business-plan-builder:opportunity:v2";
const rangeIds = ["scoreNeed", "scoreSolution", "scoreDifferentiation", "scoreCommercial"];

function updateCompletion() {
  if (!form) return;
  const required = ["businessName", "problem", "solution", "audience"];
  const complete = required.filter((name) => String(form.elements.namedItem(name)?.value || "").trim().length > 0).length;
  const percent = Math.round((complete / required.length) * 100);
  const label = document.getElementById("completionPercent");
  const fill = document.getElementById("completionFill");
  if (label) label.textContent = percent + "%";
  if (fill) fill.style.width = percent + "%";
}

function updateCounters() {
  if (!form) return;
  document.querySelectorAll("[data-count-for]").forEach((counter) => {
    const field = form.elements.namedItem(counter.dataset.countFor);
    if (field && field.maxLength > 0) counter.textContent = field.value.length + "/" + field.maxLength;
  });
}

function validateOpportunity() {
  if (!form) return false;
  let valid = true;
  ["businessName", "problem", "solution", "audience"].forEach((name) => {
    const field = form.elements.namedItem(name);
    const wrapper = field?.closest(".field");
    if (!field || !wrapper) return;
    const ok = field.value.trim().length > 0;
    wrapper.classList.toggle("invalid", !ok);
    if (!ok) {
      valid = false;
      if (!wrapper.querySelector(".field-error")) {
        const error = document.createElement("small");
        error.className = "field-error";
        error.textContent = "Preencha este campo para continuar.";
        wrapper.appendChild(error);
      }
    }
  });
  return valid;
}

function updateScore() {
  const values = rangeIds.map((id) => Number(document.getElementById(id)?.value || 0));
  values.forEach((value, index) => {
    const output = document.getElementById(rangeIds[index] + "Value");
    if (output) output.textContent = value + "/5";
  });
  const total = values.reduce((sum, value) => sum + value, 0);
  const totalScore = document.getElementById("totalScore");
  const scoreLabel = document.getElementById("scoreLabel");
  if (totalScore) totalScore.textContent = total + "/20";
  if (scoreLabel) scoreLabel.textContent = total <= 8 ? "Precisa de validação" : total <= 14 ? "Em construção" : "Boa base inicial";
}

function formDataObject() {
  if (!form) return {};
  return Object.fromEntries(new FormData(form).entries());
}

function saveDraft() {
  if (!form) return;
  localStorage.setItem(storageKey, JSON.stringify(formDataObject()));
  if (saveStatus) saveStatus.textContent = "Rascunho salvo automaticamente.";
}

function loadDraft() {
  if (!form) return;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (!saved) return;
    Object.entries(saved).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (field) field.value = value;
    });
    updateScore();
    if (saveStatus) saveStatus.textContent = "Rascunho recuperado deste navegador.";
  } catch {
    localStorage.removeItem(storageKey);
  }
}

if (form) {
  form.addEventListener("input", () => {
    updateScore();
    updateCompletion();
    updateDashboardState();
    window.clearTimeout(form._saveTimer);
    form._saveTimer = window.setTimeout(saveDraft, 250);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateOpportunity()) {
      showToast("Preencha os campos obrigatórios para continuar.");
      return;
    }
    saveDraft();
    showToast("Oportunidade salva. O próximo passo será a análise de ambientes.");
  });
  document.getElementById("clearOpportunity")?.addEventListener("click", () => {
    if (!window.confirm("Limpar todo o preenchimento deste módulo?")) return;
    form.reset();
    localStorage.removeItem(storageKey);
    updateScore();
    updateCompletion();
    updateDashboardState();
    if (saveStatus) saveStatus.textContent = "Módulo limpo. Nenhum dado foi enviado para servidor.";
  });
  loadDraft();
  updateScore();
  updateCompletion();
  updateDashboardState();
}


const environmentForm = document.getElementById("ambientes");
const environmentStorageKey = "business-plan-builder:environments:v1";
const environmentFieldIds = [
  "swotStrengths","swotWeaknesses","swotOpportunities","swotThreats",
  "pestelPolitical","pestelEconomic","pestelSocial","pestelTechnological","pestelEnvironmental","pestelLegal",
  "porterRivalry","porterRivalryNote","porterEntrants","porterEntrantsNote","porterSuppliers","porterSuppliersNote",
  "porterCustomers","porterCustomersNote","porterSubstitutes","porterSubstitutesNote"
];

function updatePorterReading() {
  const ids = ["porterRivalry", "porterEntrants", "porterSuppliers", "porterCustomers", "porterSubstitutes"];
  const values = ids.map((id) => document.getElementById(id)?.value || "");
  const numeric = values.map((value) => value === "Alta" || value === "Alto" ? 3 : value === "Média" || value === "Médio" ? 2 : value === "Baixa" || value === "Baixo" ? 1 : 0);
  const answered = numeric.filter(Boolean);
  const title = document.getElementById("porterReading");
  const text = document.getElementById("porterReadingText");
  if (!title || !text) return;
  if (!answered.length) {
    title.textContent = "Aguardando avaliação";
    text.textContent = "Preencha as cinco forças para receber uma leitura consolidada.";
    return;
  }
  const average = answered.reduce((a, b) => a + b, 0) / answered.length;
  title.textContent = average >= 2.35 ? "Pressão competitiva alta" : average >= 1.55 ? "Pressão competitiva moderada" : "Pressão competitiva baixa";
  text.textContent = answered.length + " de 5 forças avaliadas. Use as evidências registradas ao lado para justificar a análise.";
}

function environmentFields() {
  return environmentFieldIds.map((id) => document.getElementById(id)).filter(Boolean);
}
function getOpportunityProgress() {
  const required = ["businessName", "problem", "solution", "audience"];
  if (!form) return 0;
  return Math.round((required.filter((name) => String(form.elements.namedItem(name)?.value || "").trim()).length / required.length) * 100);
}

function getEnvironmentProgress() {
  const coreIds = [
    "swotStrengths","swotWeaknesses","swotOpportunities","swotThreats",
    "pestelPolitical","pestelEconomic","pestelSocial","pestelTechnological","pestelEnvironmental","pestelLegal",
    "porterRivalry","porterEntrants","porterSuppliers","porterCustomers","porterSubstitutes"
  ];
  const filled = coreIds.filter((id) => String(document.getElementById(id)?.value || "").trim()).length;
  return Math.round((filled / coreIds.length) * 100);
}

function updateEnvironmentProgress() {
  const percent = getEnvironmentProgress();
  const label = document.getElementById("environmentProgressPercent");
  const fill = document.getElementById("environmentProgressFill");
  if (label) label.textContent = percent + "%";
  if (fill) fill.style.width = percent + "%";
  updateSwotReading();
  updatePestelReading();
  updateDashboardState();
}

function updateSwotReading() {
  const ids = ["swotStrengths","swotWeaknesses","swotOpportunities","swotThreats"];
  const names = ["Forças","Fraquezas","Oportunidades","Ameaças"];
  const values = ids.map((id) => String(document.getElementById(id)?.value || "").trim());
  const answered = values.filter(Boolean).length;
  const title = document.getElementById("swotReading");
  const text = document.getElementById("swotReadingText");
  if (!title || !text) return;
  if (!answered) {
    title.textContent = "Matriz ainda sem dados";
    text.textContent = "Preencha os quatro quadrantes para gerar um resumo da análise.";
    return;
  }
  const missing = names.filter((_, index) => !values[index]);
  title.textContent = answered === 4 ? "Matriz SWOT preenchida" : "Matriz SWOT em construção";
  text.textContent = answered === 4 ? "Os quatro quadrantes já têm conteúdo. Revise se os itens são específicos e verificáveis." : "Faltam: " + missing.join(", ") + ".";
}

function updatePestelReading() {
  const ids = ["pestelPolitical","pestelEconomic","pestelSocial","pestelTechnological","pestelEnvironmental","pestelLegal"];
  const names = ["Político","Econômico","Social","Tecnológico","Ambiental","Legal"];
  const values = ids.map((id) => String(document.getElementById(id)?.value || "").trim());
  const answered = values.filter(Boolean).length;
  const title = document.getElementById("pestelReading");
  const text = document.getElementById("pestelReadingText");
  if (!title || !text) return;
  if (!answered) {
    title.textContent = "PESTEL em aberto";
    text.textContent = "Registre os seis fatores para concluir esta análise.";
    return;
  }
  const missing = names.filter((_, index) => !values[index]);
  title.textContent = answered === 6 ? "PESTEL preenchido" : "PESTEL em construção";
  text.textContent = answered === 6 ? "Os seis fatores foram registrados. Revise impactos, evidências e hipóteses antes de avançar." : "Faltam: " + missing.join(", ") + ".";
}

function updateDashboardState() {
  const opportunity = getOpportunityProgress();
  const environment = getEnvironmentProgress();
  const modules = [opportunity, environment, 0, 0, 0, 0, 0];
  const overall = Math.round(modules.reduce((sum, value) => sum + value, 0) / modules.length);
  const progressLabel = document.querySelector(".progress-mini .progress-label strong");
  const progressFill = document.querySelector(".progress-mini .progress-track span");
  const heroPercent = document.getElementById("heroProgressPercent");
  const heroFill = document.getElementById("heroProgressFill");
  if (progressLabel) progressLabel.textContent = overall + "%";
  if (progressFill) progressFill.style.width = overall + "%";
  if (heroPercent) heroPercent.textContent = overall + "%";
  if (heroFill) heroFill.style.width = overall + "%";

  const completed = modules.filter((value) => value === 100).length;
  const started = modules.filter((value) => value > 0).length;
  const status = document.getElementById("dashboardStatus");
  if (status) status.textContent = completed + " de 7 módulos concluídos · " + started + " em andamento/iniciados";

  document.querySelectorAll("[data-dashboard-module]").forEach((card) => {
    const module = Number(card.dataset.dashboardModule);
    const value = modules[module - 1] || 0;
    const previous = module > 1 ? modules[module - 2] || 0 : 100;
    const unlocked = module === 1 || previous === 100;
    const statusEl = card.querySelector(".module-status");
    const lockedEl = card.querySelector(".locked");
    let action = card.querySelector("a.module-action");

    card.classList.toggle("completed", value === 100);
    card.classList.toggle("current", unlocked && value > 0 && value < 100);

    if (statusEl) {
      statusEl.classList.toggle("muted", !unlocked && value === 0);
      statusEl.textContent = value === 100 ? "Concluído" : value > 0 ? "Em andamento" : module === 1 ? "Próximo" : unlocked ? "Disponível" : "Bloqueado";
    }

    if (lockedEl && module > 1) {
      lockedEl.textContent = unlocked ? "Pronto para começar" : "Disponível após concluir o módulo " + (module - 1);
    }

    if (module > 1 && module < 4) {
      if (unlocked && !action) {
        action = document.createElement("a");
        action.className = "module-action";
        card.appendChild(action);
      }
      if (action) {
        action.href = module === 2 ? "#ambientes" : "#plano";
        action.textContent = value === 100 ? "Revisar →" : module === 3 ? "Começar quando liberado →" : "Continuar →";
        action.setAttribute("aria-disabled", String(!unlocked));
        action.classList.toggle("disabled", !unlocked);
      }
    }
  });
}

function saveEnvironmentDraft() {
  if (!environmentForm) return;
  const data = {};
  environmentFields().forEach((field) => { data[field.id] = field.value; });
  localStorage.setItem(environmentStorageKey, JSON.stringify(data));
  const status = document.getElementById("environmentSaveStatus");
  if (status) status.textContent = "Rascunho salvo automaticamente.";
}
function loadEnvironmentDraft() {
  try {
    const saved = JSON.parse(localStorage.getItem(environmentStorageKey) || "null");
    if (!saved) return;
    environmentFields().forEach((field) => { if (saved[field.id] !== undefined) field.value = saved[field.id]; });
    const status = document.getElementById("environmentSaveStatus");
    if (status) status.textContent = "Rascunho recuperado deste navegador.";
  } catch {
    localStorage.removeItem(environmentStorageKey);
  }
}
if (environmentForm) {
  document.querySelectorAll("[data-environment-tab]").forEach((tab) => {
    tab.addEventListener("keydown", (event) => {
      const tabs = [...document.querySelectorAll("[data-environment-tab]")];
      const current = tabs.indexOf(tab);
      const next = event.key === "ArrowRight" ? (current + 1) % tabs.length : event.key === "ArrowLeft" ? (current - 1 + tabs.length) % tabs.length : -1;
      if (next >= 0) {
        event.preventDefault();
        tabs[next].focus();
        tabs[next].click();
      }
    });
    tab.addEventListener("click", () => {
      const target = tab.dataset.environmentTab;
      document.querySelectorAll("[data-environment-tab]").forEach((item) => {
        const active = item === tab;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });
      document.querySelectorAll("[data-environment-panel]").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.environmentPanel === target);
      });
    });
  });
  environmentFields().forEach((field) => {
    field.addEventListener("input", () => {
      updatePorterReading();
      updateEnvironmentProgress();
      window.clearTimeout(environmentForm._saveTimer);
      environmentForm._saveTimer = window.setTimeout(saveEnvironmentDraft, 250);
    });
  });
  document.getElementById("saveEnvironment")?.addEventListener("click", () => {
    saveEnvironmentDraft();
    showToast("Análise de ambientes salva com sucesso.");
  });
  document.getElementById("clearEnvironment")?.addEventListener("click", () => {
    if (!window.confirm("Limpar todo o preenchimento da análise de ambientes?")) return;
    environmentFields().forEach((field) => { field.value = ""; });
    localStorage.removeItem(environmentStorageKey);
    updatePorterReading();
    updateEnvironmentProgress();
    const status = document.getElementById("environmentSaveStatus");
    if (status) status.textContent = "Módulo limpo. Nenhum dado foi enviado para servidor.";
  });
  loadEnvironmentDraft();
  updatePorterReading();
  updateSwotReading();
  updatePestelReading();
  updateEnvironmentProgress();

  document.querySelectorAll("#opportunityForm .field input, #opportunityForm .field textarea").forEach((field) => {
    field.addEventListener("blur", () => {
      if (["businessName", "problem", "solution", "audience"].includes(field.id)) validateOpportunity();
    });
  });

  document.getElementById("suggestSwot")?.addEventListener("click", () => {
    const examples = {
      swotStrengths: "Atendimento próximo e conhecimento do mercado local.",
      swotWeaknesses: "Marca ainda pouco conhecida e recursos iniciais limitados.",
      swotOpportunities: "Crescimento da demanda e novos canais digitais.",
      swotThreats: "Entrada de concorrentes e aumento de custos."
    };
    const firstEmpty = environmentFieldIds.slice(0, 4).find((id) => {
      const field = document.getElementById(id);
      return field && !String(field.value || "").trim();
    });
    if (!firstEmpty) {
      showToast("Os quatro campos da SWOT já possuem conteúdo.");
      return;
    }
    document.getElementById(firstEmpty).value = examples[firstEmpty];
    updateEnvironmentProgress();
    saveEnvironmentDraft();
    showToast("Exemplo adicionado. Edite o conteúdo para refletir seu negócio.");
  });
}
