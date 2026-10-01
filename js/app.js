
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
    window.clearTimeout(form._saveTimer);
    form._saveTimer = window.setTimeout(saveDraft, 250);
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    saveDraft();
    showToast("Oportunidade salva. O próximo passo será a análise de ambientes.");
  });
  document.getElementById("clearOpportunity")?.addEventListener("click", () => {
    if (!window.confirm("Limpar todo o preenchimento deste módulo?")) return;
    form.reset();
    localStorage.removeItem(storageKey);
    updateScore();
    if (saveStatus) saveStatus.textContent = "Módulo limpo. Nenhum dado foi enviado para servidor.";
  });
  loadDraft();
  updateScore();
}
