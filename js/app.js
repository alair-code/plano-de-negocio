import { createClient, BetterAuthVanillaAdapter } from "https://esm.sh/@neondatabase/neon-js@0.7.0-beta";

const NEON_AUTH_URL = "https://ep-late-violet-b6sxri3o.neonauth.c-2.sa-east-1.aws.neon.tech/neondb/auth";
const NEON_DATA_API_URL = "https://ep-late-violet-b6sxri3o.apirest.c-2.sa-east-1.aws.neon.tech/neondb/rest/v1";

const neonClient = createClient({
  auth: {
    adapter: BetterAuthVanillaAdapter(),
    url: NEON_AUTH_URL
  },
  dataApi: {
    url: NEON_DATA_API_URL
  }
});
window.neonClient = neonClient;



// Microinterações: feedback visual de navegação sem duplicar a lógica de estado ativo.
document.querySelectorAll(".module-card a").forEach((link) => {
  link.addEventListener("click", () => {
    const card = link.closest(".module-card");
    if (card) {
      card.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(-3px)" }, { transform: "translateY(0)" }],
        { duration: 260, easing: "ease-out" }
      );
    }
  });
});

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
demoButton?.addEventListener("click", () => openTutorial("#dashboard"));

const tutorialButton = document.getElementById("tutorialButton");
const tutorialModal = document.getElementById("tutorialModal");
const tutorialClose = document.getElementById("tutorialClose");
const tutorialTitle = document.getElementById("tutorialTitle");
const tutorialIntro = document.getElementById("tutorialIntro");
const tutorialSteps = document.getElementById("tutorialSteps");
const tutorialTip = document.getElementById("tutorialTip");
const tutorialStart = document.getElementById("tutorialStart");

const tutorials = {
  "#dashboard": {
    title: "Como usar o Dashboard",
    intro: "O Dashboard é o ponto de partida. Ele mostra sua jornada, o progresso e quais módulos estão disponíveis.",
    steps: [
      ["1","Comece pelo módulo 01","Clique em Oportunidade e responda as perguntas sobre sua ideia, problema, solução e público."],
      ["2","Avance na ordem","Os próximos módulos são liberados conforme você conclui as etapas anteriores."],
      ["3","Acompanhe o progresso","Use os indicadores do Dashboard para saber o que já foi preenchido e o que falta."]
    ],
    tip: "<strong>Dica:</strong> não tente preencher tudo de uma vez. O sistema foi pensado para construir o plano passo a passo."
  },
  "#oportunidade": {
    title: "Como usar Oportunidade",
    intro: "Aqui você transforma uma ideia inicial em uma oportunidade de negócio clara e estruturada.",
    steps: [
      ["1","Descreva a ideia","Informe o nome provisório, o problema identificado, a solução e o público principal."],
      ["2","Explique o valor","Use os campos seguintes para mostrar por que sua solução é relevante e quais são seus diferenciais."],
      ["3","Conclua o módulo","Revise as respostas e complete os campos obrigatórios para liberar o próximo módulo."]
    ],
    tip: "<strong>Dica:</strong> escreva com exemplos reais e evite respostas genéricas. Quanto mais concreta a informação, melhor será a análise."
  },
  "#ambientes": {
    title: "Como usar Ambientes",
    intro: "Este módulo ajuda você a analisar o contexto interno e externo do negócio antes de montar o plano.",
    steps: [
      ["1","Analise o ambiente","Preencha os fatores relevantes do ambiente e observe como eles podem afetar o negócio."],
      ["2","Use PESTEL e Porter","Avalie fatores políticos, econômicos, sociais, tecnológicos, ambientais e legais, além das forças competitivas."],
      ["3","Monte a SWOT","Registre forças, fraquezas, oportunidades e ameaças para transformar a análise em decisões práticas."]
    ],
    tip: "<strong>Dica:</strong> diferencie fatos de suposições. Quando possível, use dados ou evidências para justificar suas análises."
  },
  "#plano": {
    title: "Como usar Plano de Negócios",
    intro: "Aqui você transforma as análises anteriores em um plano estruturado para o negócio.",
    steps: [
      ["1","Preencha cada seção","Avance pelas seções do plano e responda aos campos com base no que você já analisou."],
      ["2","Use as sugestões","Quando houver sugestões ou exemplos, use-os como orientação e adapte ao seu negócio."],
      ["3","Revise a coerência","Confira se estratégia, público, operação, marketing e demais partes estão alinhados."]
    ],
    tip: "<strong>Dica:</strong> não copie exemplos literalmente. O objetivo é construir um plano específico para o seu negócio."
  },
  "#financeiro": {
    title: "Como usar Viabilidade Financeira",
    intro: "Este módulo ajuda a transformar as hipóteses do negócio em números para avaliar sua sustentabilidade.",
    steps: [
      ["1","Informe as premissas","Preencha preços, volumes, receitas, custos e demais dados solicitados."],
      ["2","Compare cenários","Use os cenários disponíveis para entender como mudanças nas premissas afetam os resultados."],
      ["3","Leia os indicadores","Observe fluxo de caixa, resultados e indicadores antes de tirar conclusões sobre a viabilidade."]
    ],
    tip: "<strong>Dica:</strong> teste cenários conservadores e realistas. Pequenas mudanças nas premissas podem alterar bastante os resultados."
  },
  "#complementares": {
    title: "Como usar Planos Complementares",
    intro: "Aqui você detalha áreas que ajudam a transformar o plano em execução.",
    steps: [
      ["1","Escolha uma área","Navegue pelas abas de marketing, operações, pessoas, jurídico, tecnologia e outras disponíveis."],
      ["2","Detalhe a execução","Descreva ações, responsáveis, recursos e decisões necessárias para cada área."],
      ["3","Conecte com o plano","Mantenha as informações complementares coerentes com estratégia, público e capacidade financeira."]
    ],
    tip: "<strong>Dica:</strong> use esta etapa para transformar ideias estratégicas em ações concretas."
  },
  "#exportacao": {
    title: "Como usar Exportação",
    intro: "Use este menu para revisar, preparar e compartilhar o conteúdo do seu plano.",
    steps: [
      ["1","Revise o conteúdo","Confira a prévia e verifique se as informações importantes estão preenchidas."],
      ["2","Prepare a versão final","Faça os últimos ajustes antes de apresentar ou compartilhar o plano."],
      ["3","Compartilhe com segurança","Use os recursos de compartilhamento disponíveis e confira o que será enviado."]
    ],
    tip: "<strong>Dica:</strong> faça uma revisão final antes de exportar. A versão compartilhada deve representar o estado atual do seu plano."
  },
  "#gestao": {
    title: "Como usar Gestão",
    intro: "O menu Gestão serve para acompanhar a evolução do plano e manter suas informações organizadas.",
    steps: [
      ["1","Acompanhe pendências","Identifique o que ainda precisa ser preenchido ou revisado."],
      ["2","Revise versões","Quando houver histórico, use-o para comparar ou recuperar versões anteriores do plano."],
      ["3","Mantenha o plano atualizado","Volte a esta área durante a execução para acompanhar mudanças e próximos passos."]
    ],
    tip: "<strong>Dica:</strong> trate o plano como um documento vivo. Atualize as informações quando as condições do negócio mudarem."
  }
};

function getCurrentTutorialKey() {
  const hash = window.location.hash || "#dashboard";
  return tutorials[hash] ? hash : "#dashboard";
}
function openTutorial(key = getCurrentTutorialKey()) {
  const tutorial = tutorials[key] || tutorials["#dashboard"];
  if (!tutorialModal) return;
  if (tutorialTitle) tutorialTitle.textContent = tutorial.title;
  if (tutorialIntro) tutorialIntro.textContent = tutorial.intro;
  if (tutorialSteps) tutorialSteps.innerHTML = tutorial.steps.map(([n,title,text]) => `<div class="tutorial-step"><div class="tutorial-step-number">${n}</div><div><strong>${title}</strong><span>${text}</span></div></div>`).join("");
  if (tutorialTip) tutorialTip.innerHTML = tutorial.tip;
  tutorialModal.hidden = false;
}
tutorialButton?.addEventListener("click", () => openTutorial());
tutorialClose?.addEventListener("click", () => { tutorialModal.hidden = true; });
tutorialStart?.addEventListener("click", () => { tutorialModal.hidden = true; });
tutorialModal?.addEventListener("click", (event) => { if (event.target === tutorialModal) tutorialModal.hidden = true; });

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


/* Integração com Neon Auth e Neon Data API — Módulo 1 */
const authModal = document.getElementById("authModal");
const profileModal = document.getElementById("profileModal");
const profileClose = document.getElementById("profileClose");
const profileForm = document.getElementById("profileForm");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileEmailSummary = document.getElementById("profileEmailSummary");
const profileAvatar = document.getElementById("profileAvatar");
const profileFeedback = document.getElementById("profileFeedback");
const profileSave = document.getElementById("profileSave");
const profileLogout = document.getElementById("profileLogout");
const authButton = document.getElementById("authButton");
const authClose = document.getElementById("authClose");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authDescription = document.getElementById("authDescription");
const authNameField = document.getElementById("authNameField");
const authName = document.getElementById("authName");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authSubmit = document.getElementById("authSubmit");
const authSwitch = document.getElementById("authSwitch");
const authSignInTab = document.getElementById("authSignInTab");
const authSignUpTab = document.getElementById("authSignUpTab");
const authLogout = document.getElementById("authLogout");
const authFeedback = document.getElementById("authFeedback");
let authMode = "signin";

function getAuthErrorMessage(error, mode = authMode) {
  const details = error?.error || error?.data?.error || error;
  const message = details?.message || details?.error_description || details?.statusText;
  const code = String(details?.code || details?.status || "").toLowerCase();

  if (code.includes("invalid_credentials") || code.includes("invalid email or password")) {
    return mode === "signup"
      ? "O cadastro foi rejeitado pelo Neon Auth. Se este e-mail já possui uma conta, use \"Já tenho uma conta\" para entrar."
      : "E-mail ou senha incorretos.";
  }

  if (code.includes("user_already_exists") || code.includes("email_already_exists")) {
    return "Este e-mail já possui uma conta. Use \"Já tenho uma conta\" para entrar.";
  }

  if (message) return details?.code ? message + " (" + details.code + ")" : message;
  if (typeof error === "string") return error;
  return "Não foi possível concluir a autenticação. Verifique os dados e tente novamente.";
}

function normalizeAuthEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function validateAuthInput(mode) {
  const email = normalizeAuthEmail(authEmail?.value);
  const password = String(authPassword?.value || "");

  if (!email) return "Informe seu e-mail.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Informe um e-mail válido.";
  if (!password) return "Informe sua senha.";
  if (mode === "signup" && password.length < 8) return "A senha deve ter pelo menos 8 caracteres.";
  if (mode === "signup" && !authName?.value.trim()) return "Informe seu nome.";

  if (authEmail) authEmail.value = email;
  return "";
}

function setAuthMode(mode) {
  authMode = mode;
  const signup = mode === "signup";

  if (authSignInTab) {
    authSignInTab.classList.toggle("active", !signup);
    authSignInTab.setAttribute("aria-selected", String(!signup));
  }
  if (authSignUpTab) {
    authSignUpTab.classList.toggle("active", signup);
    authSignUpTab.setAttribute("aria-selected", String(signup));
  }

  if (authTitle) authTitle.textContent = signup ? "Criar minha conta" : "Entrar no Plano de Negócio";
  if (authDescription) authDescription.textContent = signup
    ? "Crie sua conta para salvar os planos no banco e continuar de qualquer dispositivo."
    : "Entre para salvar seus planos no banco de dados e acessar seus dados de qualquer dispositivo.";
  if (authNameField) authNameField.hidden = !signup;
  if (authPassword) authPassword.autocomplete = signup ? "new-password" : "current-password";
  if (authSubmit) authSubmit.textContent = signup ? "Criar conta" : "Entrar";
  if (authSwitch) authSwitch.textContent = signup ? "Já tenho uma conta" : "Ainda não tenho conta";
  if (authFeedback) authFeedback.textContent = "";
}

function openAuthModal(mode = "signin") {
  if (!authModal) return;
  authModal.hidden = false;
  setAuthMode(mode);
  authEmail?.focus();
}

function setApplicationAccess(user) {
  const locked = !user;
  document.body.classList.toggle("auth-required", locked);
  if (authModal) authModal.hidden = !locked && authModal.hidden;
  if (locked) {
    openAuthModal("signin");
    if (authFeedback) authFeedback.textContent = "Faça login ou crie uma conta para acessar o sistema.";
  }
}

function closeAuthModal() {
  if (!getCurrentUserSync()) return;
  if (authModal) authModal.hidden = true;
}

function getCurrentUserSync() {
  return window.__currentAuthUser || null;
}

function extractSession(result) {
  return result?.data?.session || result?.session || result?.data || null;
}

async function getCurrentUser() {
  // O Neon Auth mantém a sessão em cookie httpOnly no domínio do Auth.
  // Em um frontend estático hospedado em outro domínio, a primeira leitura
  // após um reload pode sofrer uma corrida de inicialização. Tentamos o SDK
  // algumas vezes e, se necessário, consultamos diretamente o endpoint de
  // sessão com credenciais explícitas.
  const attempts = 4;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const result = await neonClient.auth.getSession();
      if (!result?.error) {
        const session = extractSession(result);
        if (session?.user) return session.user;
      }
    } catch {}

    try {
      const response = await fetch(`${NEON_AUTH_URL}/get-session`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" }
      });
      if (response.ok) {
        const payload = await response.json();
        const user = payload?.user || payload?.data?.user || payload?.session?.user || payload?.data?.session?.user || null;
        if (user) return user;
      }
    } catch {}

    if (attempt < attempts - 1) {
      await new Promise(resolve => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }
  return null;
}

async function updateAuthUI(user = null) {
  if (!user) user = await getCurrentUser();
  window.__currentAuthUser = user || null;
  if (authButton) authButton.textContent = user ? "Minha conta" : "Entrar";
  const avatar = document.getElementById("userAvatar");
  if (avatar) {
    avatar.textContent = user?.name?.trim()?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "A";
    avatar.title = user ? user.email : "Usuário";
  }
  if (authLogout) authLogout.hidden = !user;
  if (authSubmit) authSubmit.hidden = Boolean(user);
  if (authSwitch) authSwitch.hidden = Boolean(user);
  if (authNameField) authNameField.hidden = Boolean(user) || authMode !== "signup";
  if (authEmail) authEmail.disabled = Boolean(user);
  if (authPassword) authPassword.disabled = Boolean(user);
  if (user && authTitle) authTitle.textContent = "Conta conectada";
  if (user && authDescription) authDescription.textContent = user.email || "Sua conta está conectada ao Neon Auth.";
  if (profileName) profileName.value = user?.name || "";
  if (profileEmail) profileEmail.value = user?.email || "";
  if (profileEmailSummary) profileEmailSummary.textContent = user?.email || "Conta conectada ao Neon Auth.";
  if (profileAvatar) profileAvatar.textContent = user?.name?.trim()?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "A";
  return user;
}

async function signUpAccount() {
  const email = normalizeAuthEmail(authEmail?.value);
  const password = String(authPassword?.value || "");
  const name = String(authName?.value || "").trim();

  // Cadastro usa exclusivamente signUp.email().
  // Não há tentativa automática de login quando o cadastro retorna erro.
  const result = await neonClient.auth.signUp.email({ email, password, name });
  if (result?.error) throw result.error;

  const resultSession = extractSession(result);
  const user = resultSession?.user || await getCurrentUser();

  if (!user) {
    throw new Error("A conta foi criada, mas o Neon Auth não devolveu uma sessão.");
  }

  return user;
}

async function signInAccount() {
  const email = normalizeAuthEmail(authEmail?.value);
  const password = String(authPassword?.value || "");

  // Login usa exclusivamente signIn.email().
  const result = await neonClient.auth.signIn.email({ email, password });
  if (result?.error) throw result.error;

  const resultSession = extractSession(result);
  const user = resultSession?.user || await getCurrentUser();

  if (!user) {
    throw new Error("Login concluído, mas a sessão não foi recuperada.");
  }

  return user;
}

async function signInOrSignUp(event) {
  event.preventDefault();

  const mode = authMode;
  const validationError = validateAuthInput(mode);
  if (validationError) {
    if (authFeedback) authFeedback.textContent = validationError;
    return;
  }

  authSubmit.disabled = true;
  if (authFeedback) authFeedback.textContent = mode === "signup" ? "Criando sua conta..." : "Entrando...";

  try {
    const user = mode === "signup"
      ? await signUpAccount()
      : await signInAccount();

    await updateAuthUI(user);
    setApplicationAccess(user);
    closeAuthModal();
    showToast(mode === "signup" ? "Conta criada e conectada ao banco." : "Login realizado com sucesso.");
    await loadOpportunityFromServer();
  } catch (error) {
    console.error("Neon Auth:", error);
    if (authFeedback) authFeedback.textContent = getAuthErrorMessage(error, mode);
  } finally {
    authSubmit.disabled = false;
  }
}

authButton?.addEventListener("click", async () => {
  const user = await getCurrentUser();
  if (user) {
    await updateAuthUI(user);
    if (profileModal) {
      profileModal.hidden = false;
      profileName?.focus();
    }
  } else {
    openAuthModal();
  }
});
document.getElementById("userAvatar")?.addEventListener("click", () => authButton?.click());
profileClose?.addEventListener("click", () => { if (profileModal) profileModal.hidden = true; });
profileModal?.addEventListener("click", (event) => { if (event.target === profileModal) profileModal.hidden = true; });

profileForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const user = await getCurrentUser();
  if (!user) {
    if (profileModal) profileModal.hidden = true;
    setApplicationAccess(null);
    return;
  }
  const name = String(profileName?.value || "").trim();
  if (!name) {
    if (profileFeedback) profileFeedback.textContent = "Informe seu nome.";
    return;
  }
  profileSave.disabled = true;
  if (profileFeedback) profileFeedback.textContent = "Salvando...";
  try {
    const result = await neonClient.auth.updateUser({ name });
    if (result?.error) throw result.error;
    const updated = result?.data?.user || result?.user || { ...user, name };
    await updateAuthUI(updated);
    if (profileFeedback) profileFeedback.textContent = "Dados atualizados com sucesso.";
    showToast("Perfil atualizado.");
  } catch (error) {
    console.error("Neon Auth perfil:", error);
    if (profileFeedback) profileFeedback.textContent = getAuthErrorMessage(error, "signin");
  } finally {
    profileSave.disabled = false;
  }
});
authClose?.addEventListener("click", closeAuthModal);
authSignInTab?.addEventListener("click", () => setAuthMode("signin"));
authSignUpTab?.addEventListener("click", () => setAuthMode("signup"));
authModal?.addEventListener("click", (event) => { if (event.target === authModal) closeAuthModal(); });
authForm?.addEventListener("submit", signInOrSignUp);
authSwitch?.addEventListener("click", () => setAuthMode(authMode === "signin" ? "signup" : "signin"));
async function performLogout() {
  try {
    await neonClient.auth.signOut();
  } finally {
    window.__currentAuthUser = null;
    await updateAuthUI(null);
    if (profileModal) profileModal.hidden = true;
    setApplicationAccess(null);
    showToast("Você saiu da conta.");
  }
}
authLogout?.addEventListener("click", performLogout);
profileLogout?.addEventListener("click", performLogout);

window.addEventListener("pageshow", async () => {
  const user = await getCurrentUser();
  if (user) {
    await updateAuthUI(user);
    setApplicationAccess(user);
  }
});
// Neon Auth Better Auth não expõe o listener Supabase-compatível neste cliente.
// A sessão é consultada diretamente após cada operação de autenticação.

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


async function ensureServerPlan() {
  const { data: plans, error: plansError } = await neonClient
    .from("planos_negocio")
    .select("id, espaco_trabalho_id, nome")
    .order("criado_em", { ascending: true })
    .limit(1);
  if (plansError) throw plansError;
  if (plans?.[0]) return plans[0];

  const businessName = String(form?.elements.namedItem("businessName")?.value || "").trim() || "Meu Plano de Negócio";
  const { data: workspaceRows, error: workspaceError } = await neonClient
    .from("espacos_trabalho")
    .insert({ nome: businessName })
    .select("id");
  if (workspaceError) throw workspaceError;
  const workspace = workspaceRows?.[0];
  if (!workspace?.id) throw new Error("Não foi possível criar o espaço de trabalho.");

  const { data: planRows, error: planError } = await neonClient
    .from("planos_negocio")
    .insert({ espaco_trabalho_id: workspace.id, nome: businessName })
    .select("id, espaco_trabalho_id, nome");
  if (planError) throw planError;
  const plan = planRows?.[0];
  if (!plan?.id) throw new Error("Não foi possível criar o plano de negócio.");
  return plan;
}

async function saveOpportunityToServer() {
  const user = await getCurrentUser();
  if (!user) return { skipped: true, reason: "auth" };
  const plan = await ensureServerPlan();
  const data = formDataObject();
  const score = rangeIds.reduce((sum, id) => sum + Number(document.getElementById(id)?.value || 0), 0);

  const { error: planError } = await neonClient
    .from("planos_negocio")
    .update({ nome: data.businessName || plan.nome, percentual_conclusao: getOpportunityProgress(), modulo_atual: 1 })
    .eq("id", plan.id);
  if (planError) throw planError;

  const opportunity = {
    plano_negocio_id: plan.id,
    problema: data.problem || null,
    solucao: data.solution || null,
    publico_alvo: data.audience || null,
    localizacao: data.marketLocation || null,
    diferenciais: data.differentials || null,
    pontuacao_atratividade: score
  };
  const { error: opportunityError } = await neonClient
    .from("analises_oportunidade")
    .upsert(opportunity, { onConflict: "plano_negocio_id" });
  if (opportunityError) throw opportunityError;

  const value = {
    plano_negocio_id: plan.id,
    trabalhos_clientes: data.customerJobs || null,
    dores: data.customerPains || null,
    ganhos: data.customerGains || null,
    produtos_servicos: data.products || null,
    alivios_dores: data.painRelievers || null,
    criadores_ganhos: data.gainCreators || null
  };
  const { error: valueError } = await neonClient
    .from("propostas_valor")
    .upsert(value, { onConflict: "plano_negocio_id" });
  if (valueError) throw valueError;

  localStorage.setItem("business-plan-builder:server-plan:v1", JSON.stringify({ planId: plan.id }));
  return { saved: true, planId: plan.id };
}

async function loadOpportunityFromServer() {
  const user = await getCurrentUser();
  if (!user || !form) return;
  try {
    const localDraft = localStorage.getItem(storageKey);
    if (localDraft) {
      if (saveStatus) saveStatus.textContent = "Rascunho local preservado. Salve a oportunidade para sincronizar com o banco.";
      return;
    }
    const { data: plans, error: plansError } = await neonClient
      .from("planos_negocio")
      .select("id, nome")
      .order("criado_em", { ascending: true })
      .limit(1);
    if (plansError) throw plansError;
    const plan = plans?.[0];
    if (!plan) return;

    const { data: opportunityRows, error: opportunityError } = await neonClient
      .from("analises_oportunidade")
      .select("*")
      .eq("plano_negocio_id", plan.id)
      .limit(1);
    if (opportunityError) throw opportunityError;
    const { data: valueRows, error: valueError } = await neonClient
      .from("propostas_valor")
      .select("*")
      .eq("plano_negocio_id", plan.id)
      .limit(1);
    if (valueError) throw valueError;

    const opportunity = opportunityRows?.[0];
    const value = valueRows?.[0];
    const values = {
      businessName: plan.nome,
      problem: opportunity?.problema || "",
      solution: opportunity?.solucao || "",
      audience: opportunity?.publico_alvo || "",
      marketLocation: opportunity?.localizacao || "",
      differentials: opportunity?.diferenciais || "",
      customerJobs: value?.trabalhos_clientes || "",
      customerPains: value?.dores || "",
      customerGains: value?.ganhos || "",
      products: value?.produtos_servicos || "",
      painRelievers: value?.alivios_dores || "",
      gainCreators: value?.criadores_ganhos || ""
    };
    Object.entries(values).forEach(([name, value]) => {
      const field = form.elements.namedItem(name);
      if (field && value !== "") field.value = value;
    });
    const score = Number(opportunity?.pontuacao_atratividade);
    if (Number.isFinite(score) && score >= 0) {
      const base = Math.max(1, Math.min(5, Math.round(score / 4)));
      rangeIds.forEach((id) => { const field = document.getElementById(id); if (field) field.value = base; });
    }
    updateScore();
    updateCompletion();
    updateCounters();
    updateDashboardState();
    if (saveStatus) saveStatus.textContent = "Dados do Módulo 1 recuperados do banco.";
  } catch (error) {
    console.warn("Neon: não foi possível carregar o Módulo 1.", error);
  }
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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validateOpportunity()) {
      showToast("Preencha os campos obrigatórios para continuar.");
      return;
    }
    saveDraft();
    const user = await getCurrentUser();
    if (!user) {
      openAuthModal();
      if (authFeedback) authFeedback.textContent = "Entre ou crie uma conta para salvar este plano no banco de dados.";
      return;
    }
    try {
      if (saveStatus) saveStatus.textContent = "Salvando no banco de dados...";
      await saveOpportunityToServer();
      if (saveStatus) saveStatus.textContent = "Oportunidade salva no banco de dados e neste navegador.";
      showToast("Oportunidade salva no banco de dados.");
    } catch (error) {
      console.error("Neon: falha ao salvar Módulo 1.", error);
      if (saveStatus) saveStatus.textContent = "Salvo neste navegador. O banco não foi atualizado.";
      showToast("Não foi possível salvar no banco. Seus dados locais foram preservados.");
    }
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
  (async () => {
    const user = await getCurrentUser();
    const currentUser = await updateAuthUI(user);
    setApplicationAccess(currentUser);
    if (currentUser) await loadOpportunityFromServer();
  })();
}


const environmentForm = document.getElementById("ambientes");
const environmentStorageKey = "business-plan-builder:environments:v1";
const environmentFieldIds = [
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

function getSwotState() {
  return {
    strengths: [...document.querySelectorAll('[data-swot-list="strengths"] .swot-item')].map((item) => item.querySelector("textarea")?.value.trim()).filter(Boolean),
    weaknesses: [...document.querySelectorAll('[data-swot-list="weaknesses"] .swot-item')].map((item) => item.querySelector("textarea")?.value.trim()).filter(Boolean),
    opportunities: [...document.querySelectorAll('[data-swot-list="opportunities"] .swot-item')].map((item) => item.querySelector("textarea")?.value.trim()).filter(Boolean),
    threats: [...document.querySelectorAll('[data-swot-list="threats"] .swot-item')].map((item) => item.querySelector("textarea")?.value.trim()).filter(Boolean)
  };
}

function getEnvironmentProgress() {
  const swot = getSwotState();
  const swotComplete = ["strengths","weaknesses","opportunities","threats"].filter((key) => swot[key].length > 0).length;
  const otherIds = ["pestelPolitical","pestelEconomic","pestelSocial","pestelTechnological","pestelEnvironmental","pestelLegal","porterRivalry","porterEntrants","porterSuppliers","porterCustomers","porterSubstitutes"];
  const otherFilled = otherIds.filter((id) => String(document.getElementById(id)?.value || "").trim()).length;
  return Math.round(((swotComplete / 4) * 40) + ((otherFilled / otherIds.length) * 60));
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
  const state = getSwotState();
  const keys = ["strengths","weaknesses","opportunities","threats"];
  const names = ["Forças","Fraquezas","Oportunidades","Ameaças"];
  const answered = keys.filter((key) => state[key].length > 0).length;
  const totalItems = keys.reduce((sum, key) => sum + state[key].length, 0);
  const title = document.getElementById("swotReading");
  const text = document.getElementById("swotReadingText");
  if (!title || !text) return;
  if (!answered) {
    title.textContent = "Matriz ainda sem dados";
    text.textContent = "Adicione itens aos quatro quadrantes para gerar um resumo da análise.";
    return;
  }
  const missing = names.filter((_, index) => state[keys[index]].length === 0);
  title.textContent = answered === 4 ? "Matriz SWOT preenchida" : "Matriz SWOT em construção";
  text.textContent = answered === 4 ? totalItems + " itens registrados. Revise se cada ponto é específico e verificável." : "Faltam: " + missing.join(", ") + ".";
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

const swotStorageVersion = 2;
const swotLabels = {strengths:"força", weaknesses:"fraqueza", opportunities:"oportunidade", threats:"ameaça"};

function renderSwot(state) {
  Object.entries(state).forEach(([key, values]) => {
    const list = document.querySelector('[data-swot-list="' + key + '"]');
    if (!list) return;
    list.innerHTML = "";
    values.forEach((value) => addSwotItem(key, value, false));
  });
}

function addSwotItem(key, value = "", persist = true) {
  const list = document.querySelector('[data-swot-list="' + key + '"]');
  if (!list) return;
  const item = document.createElement("div");
  item.className = "swot-item";
  item.draggable = true;
  item.innerHTML = '<span class="swot-drag" title="Arrastar para reordenar" aria-hidden="true">⋮⋮</span><textarea rows="2" maxlength="500" placeholder="Descreva um item específico..."></textarea><button type="button" class="swot-remove" aria-label="Remover ' + swotLabels[key] + '">×</button>';
  const textarea = item.querySelector("textarea");
  textarea.value = value;
  textarea.addEventListener("input", () => {
    updateEnvironmentProgress();
    window.clearTimeout(environmentForm._saveTimer);
    environmentForm._saveTimer = window.setTimeout(saveEnvironmentDraft, 250);
  });
  item.querySelector(".swot-remove").addEventListener("click", () => {
    item.remove();
    updateEnvironmentProgress();
    saveEnvironmentDraft();
  });
  item.addEventListener("dragstart", () => item.classList.add("dragging"));
  item.addEventListener("dragend", () => {
    item.classList.remove("dragging");
    updateEnvironmentProgress();
    saveEnvironmentDraft();
  });
  list.addEventListener("dragover", (event) => {
    event.preventDefault();
    const dragging = list.querySelector(".dragging");
    if (!dragging) return;
    const after = [...list.querySelectorAll(".swot-item:not(.dragging)")].find((el) => event.clientY <= el.getBoundingClientRect().top + el.offsetHeight / 2);
    if (after) list.insertBefore(dragging, after);
    else list.appendChild(dragging);
  }, {once:true});
  list.appendChild(item);
  if (persist) {
    updateEnvironmentProgress();
    saveEnvironmentDraft();
  }
}

function initializeSwot() {
  const empty = {strengths:[], weaknesses:[], opportunities:[], threats:[]};
  let state = {...empty};
  try {
    const saved = JSON.parse(localStorage.getItem(environmentStorageKey) || "null");
    if (saved?.swot && typeof saved.swot === "object") {
      state = {...empty, ...saved.swot};
    } else if (saved) {
      state = {
        strengths: saved.swotStrengths ? [saved.swotStrengths] : [],
        weaknesses: saved.swotWeaknesses ? [saved.swotWeaknesses] : [],
        opportunities: saved.swotOpportunities ? [saved.swotOpportunities] : [],
        threats: saved.swotThreats ? [saved.swotThreats] : []
      };
    }
  } catch {}
  renderSwot(state);
  document.querySelectorAll("[data-swot-add]").forEach((button) => {
    button.addEventListener("click", () => addSwotItem(button.dataset.swotAdd));
  });
}

function saveEnvironmentDraft() {
  if (!environmentForm) return;
  const data = {version: swotStorageVersion, swot: getSwotState()};
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
    document.querySelectorAll(".swot-items").forEach((list) => { list.innerHTML = ""; });
    localStorage.removeItem(environmentStorageKey);
    updatePorterReading();
    updateEnvironmentProgress();
    const status = document.getElementById("environmentSaveStatus");
    if (status) status.textContent = "Módulo limpo. Nenhum dado foi enviado para servidor.";
  });
  initializeSwot();
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
      strengths: "Atendimento próximo e conhecimento do mercado local.",
      weaknesses: "Marca ainda pouco conhecida e recursos iniciais limitados.",
      opportunities: "Crescimento da demanda e novos canais digitais.",
      threats: "Entrada de concorrentes e aumento de custos."
    };
    const key = Object.keys(examples).find((name) => getSwotState()[name].length === 0);
    if (!key) {
      showToast("Os quatro quadrantes já possuem itens. Você pode adicionar mais manualmente.");
      return;
    }
    addSwotItem(key, examples[key]);
    showToast("Exemplo adicionado em " + swotLabels[key] + ". Edite para refletir seu negócio.");
  });
}

/* Módulo 3 — persistência, navegação e progresso */
const planFormKey = "business-plan-builder:plan:v1";
const planSectionOrder = ["executiveSummary","companyDescription","productsServices","marketCompetition","marketingSales","operationalPlan","peopleManagement","financialPlan","strategicAnalysis","appendices"];

function getPlanFields(){
  return [...document.querySelectorAll("[data-plan-field]")];
}
function getPlanState(){
  const state={};
  getPlanFields().forEach((field)=>{ state[field.dataset.planField]=field.value; });
  return state;
}
function getPlanSectionProgress(){
  return planSectionOrder.map((key)=>{
    const fields=[...document.querySelectorAll('[data-plan-section="'+key+'"] [data-plan-field]')];
    return fields.length>0 && fields.every((field)=>field.value.trim().length>0) ? 100 : fields.some((field)=>field.value.trim().length>0) ? Math.round((fields.filter((field)=>field.value.trim()).length/fields.length)*100) : 0;
  });
}
function updatePlanCounters(){
  getPlanFields().forEach((field)=>{
    const counter=document.querySelector('[data-plan-count="'+field.dataset.planField+'"]');
    if(counter && field.maxLength) counter.textContent=field.value.length+"/"+field.maxLength;
  });
}
function updatePlanProgress(){
  const values=getPlanSectionProgress();
  const completed=values.filter((value)=>value===100).length;
  const average=Math.round(values.reduce((a,b)=>a+b,0)/values.length);
  const percent=document.getElementById("planProgressPercent");
  const fill=document.getElementById("planProgressFill");
  const text=document.getElementById("planProgressText");
  const count=document.getElementById("planSectionCount");
  if(percent) percent.textContent=average+"%";
  if(fill) fill.style.width=average+"%";
  if(text) text.textContent=completed+" de 10 seções preenchidas";
  if(count) count.textContent=completed+"/10";
  document.querySelectorAll("[data-plan-target]").forEach((button,index)=>{
    button.classList.toggle("complete",values[index]===100);
    const dot=button.querySelector("i");
    if(dot) dot.title=values[index]===100 ? "Concluída" : values[index]>0 ? "Em andamento" : "Não preenchida";
  });
}
function savePlanDraft(){
  const state=getPlanState();
  localStorage.setItem(planFormKey,JSON.stringify(state));
  const status=document.getElementById("planSaveStatus");
  if(status) status.textContent="Rascunho salvo automaticamente.";
}
function loadPlanDraft(){
  try{
    const saved=JSON.parse(localStorage.getItem(planFormKey)||"null");
    if(!saved) return;
    getPlanFields().forEach((field)=>{if(saved[field.dataset.planField]!==undefined) field.value=saved[field.dataset.planField];});
    const status=document.getElementById("planSaveStatus");
    if(status) status.textContent="Rascunho recuperado deste navegador.";
  }catch{localStorage.removeItem(planFormKey);}
}
function activatePlanSection(key){
  if(!planSectionOrder.includes(key)) return;
  document.querySelectorAll("[data-plan-section]").forEach((section)=>section.classList.toggle("active",section.dataset.planSection===key));
  document.querySelectorAll("[data-plan-target]").forEach((button)=>button.classList.toggle("active",button.dataset.planTarget===key));
  const target=document.querySelector('[data-plan-section="'+key+'"]');
  if(target) target.scrollIntoView({behavior:"smooth",block:"start"});
}
const planModule=document.getElementById("plano");
if(planModule){
  document.querySelectorAll("[data-plan-target]").forEach((button)=>button.addEventListener("click",()=>activatePlanSection(button.dataset.planTarget)));
  getPlanFields().forEach((field)=>{
    field.addEventListener("input",()=>{
      updatePlanCounters();
      updatePlanProgress();
      updateDashboardState();
      clearTimeout(planModule._saveTimer);
      planModule._saveTimer=setTimeout(savePlanDraft,250);
    });
  });
  document.getElementById("savePlan")?.addEventListener("click",()=>{savePlanDraft();showToast("Plano de negócios salvo com sucesso.");});
  document.getElementById("clearPlan")?.addEventListener("click",()=>{
    if(!confirm("Limpar todo o preenchimento do Módulo 3?")) return;
    getPlanFields().forEach((field)=>field.value="");
    localStorage.removeItem(planFormKey);
    updatePlanCounters();updatePlanProgress();updateDashboardState();
    const status=document.getElementById("planSaveStatus");
    if(status) status.textContent="Módulo limpo. Nenhum dado foi enviado para servidor.";
  });
  loadPlanDraft();updatePlanCounters();updatePlanProgress();
}

/* Atualiza o dashboard incluindo o novo módulo */


/* Proteção e desbloqueio sequencial do Módulo 3 */

window.addEventListener("hashchange",()=>{
  if(location.hash==="#plano" && getEnvironmentProgress()<100){
    history.replaceState(null,"","#ambientes");
    showToast("Conclua o Módulo 2 antes de iniciar o Plano de Negócios.");
  }
});
updateDashboardState();

/* Refinamento: aproveitamento dos dados dos módulos 1 e 2 */
function readOpportunitySource(){
  try{return JSON.parse(localStorage.getItem("business-plan-builder:opportunity:v2")||"null")||{};}catch{return {};}
}
function readEnvironmentSource(){
  try{return JSON.parse(localStorage.getItem(environmentStorageKey)||"null")||{};}catch{return {};}
}
function swotText(state,key){return Array.isArray(state?.[key]) ? state[key].filter(Boolean).join("; ") : "";}
function buildPlanSuggestions(){
  const o=readOpportunitySource(), e=readEnvironmentSource();
  const swot=e.swot||{};
  const suggestions={
    executiveSummary:[o.businessName&&("Negócio: "+o.businessName),o.problem&&("Problema: "+o.problem),o.solution&&("Solução: "+o.solution),o.audience&&("Público: "+o.audience),o.marketLocation&&("Localização: "+o.marketLocation)].filter(Boolean).join("\n\n"),
    companyMission:o.solution||"",
    companyModel:o.products||o.solution||"",
    companyLocation:o.marketLocation||"",
    productsDescription:o.products||o.solution||"",
    marketAudience:o.audience||"",
    marketTrends:swotText(swot,"opportunities"),
    competitors:swotText(swot,"threats"),
    marketPositioning:[o.differentials,swotText(swot,"strengths")].filter(Boolean).join("\n\n"),
    strategicObjectives:[swotText(swot,"opportunities"),swotText(swot,"strengths")].filter(Boolean).join("\n\n"),
    strategicActions:[swotText(swot,"weaknesses"),swotText(swot,"threats")].filter(Boolean).join("\n\n")
  };
  return {suggestions,opportunity:o,environment:e};
}
function fillPlanSuggestion(section){
  const data=buildPlanSuggestions(), map={
    executiveSummary:["executiveSummary"],
    companyDescription:["companyMission","companyModel","companyLocation"],
    productsServices:["productsDescription"],
    marketCompetition:["marketAudience","marketTrends","competitors","marketPositioning"],
    strategicAnalysis:["strategicObjectives","strategicActions"]
  };
  const fields=map[section]||[];
  let changed=0;
  fields.forEach((key)=>{
    const value=data.suggestions[key];
    const field=document.querySelector('[data-plan-field="'+key+'"]');
    if(field && value && !field.value.trim()){field.value=value;changed++;}
  });
  updatePlanCounters();updatePlanProgress();savePlanDraft();updateDashboardState();
  return changed;
}
function updatePlanSourceSummary(){
  const data=buildPlanSuggestions(), o=data.opportunity, e=data.environment;
  const sources=[];
  if(o.businessName||o.problem||o.solution||o.audience)sources.push("Módulo 1 preenchido");
  const swot=e.swot||{};
  if(Object.values(swot).some(v=>Array.isArray(v)&&v.length))sources.push("SWOT disponível");
  if(Object.values(e).some(v=>typeof v==="string"&&v.trim()))sources.push("PESTEL/Porter disponíveis");
  const el=document.getElementById("planSourceSummary");
  if(el)el.textContent=sources.length?sources.join(" · "):"Nenhum dado anterior disponível.";
}
if(planModule){
  document.querySelectorAll("[data-plan-suggest]").forEach((button)=>{
    button.addEventListener("click",()=>{
      const changed=fillPlanSuggestion(button.dataset.planSuggest);
      showToast(changed?changed+" campo(s) preenchido(s) com dados anteriores. Revise antes de salvar.":"Nenhum campo vazio pôde receber sugestão.");
    });
  });
  document.getElementById("suggestPlanContent")?.addEventListener("click",()=>{
    const order=["executiveSummary","companyDescription","productsServices","marketCompetition","strategicAnalysis"];
    const changed=order.reduce((total,key)=>total+fillPlanSuggestion(key),0);
    updatePlanSourceSummary();
    document.getElementById("planSourcePanel")?.removeAttribute("hidden");
    showToast(changed?changed+" campo(s) sugerido(s) a partir dos módulos anteriores.":"O Módulo 3 já possui conteúdo nos campos relacionados.");
  });
  document.getElementById("closePlanSource")?.addEventListener("click",()=>document.getElementById("planSourcePanel")?.setAttribute("hidden",""));
  updatePlanSourceSummary();
}


/* Módulo 4 — cálculos e persistência */
const financialStorageKey="business-plan-builder:financial:v1";
const financialFieldIds=["financialInvestment","financialFixedCosts","financialVariableCost","financialUnitPrice","financialInitialDemand","financialGrowthRate","financialHorizon","financialDiscountRate"];
let activeFinancialScenario="realistic";

function financialNumber(id,fallback=0){const el=document.getElementById(id);const value=Number(el?.value);return Number.isFinite(value)?value:fallback;}
function financialMoney(value){return Number.isFinite(value)?"R$ "+value.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}):"—";}
function financialPercent(value){return Number.isFinite(value)?value.toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})+"%":"—";}
function financialScenarioParams(scenario=activeFinancialScenario){
  return scenario==="pessimistic"?{demand:.8,variable:1.1}:scenario==="optimistic"?{demand:1.2,variable:.9}:{demand:1,variable:1};
}
function calculateFinancial(scenario=activeFinancialScenario){
  const investment=financialNumber("financialInvestment");
  const fixed=financialNumber("financialFixedCosts");
  const variable=financialNumber("financialVariableCost");
  const price=financialNumber("financialUnitPrice");
  const initialDemand=financialNumber("financialInitialDemand");
  const growth=financialNumber("financialGrowthRate")/100;
  const horizon=Math.max(1,Math.min(60,financialNumber("financialHorizon",12)));
  const annualDiscount=financialNumber("financialDiscountRate")/100;
  const params=financialScenarioParams(scenario);
  const demandBase=initialDemand*params.demand;
  const variableBase=variable*params.variable;
  const rows=[]; let cumulative=-investment, revenue=0, costs=0, profit=0, payback=null;
  for(let month=1;month<=horizon;month++){
    const demand=Math.max(0,demandBase*Math.pow(1+growth,month-1));
    const monthlyRevenue=demand*price;
    const monthlyCosts=fixed+demand*variableBase;
    const net=monthlyRevenue-monthlyCosts;
    cumulative+=net;
    revenue+=monthlyRevenue; costs+=monthlyCosts; profit+=net;
    if(payback===null && cumulative>=0) payback=month-1+(net>0?(Math.abs(cumulative-net)/net):0);
    rows.push({month,demand,revenue:monthlyRevenue,costs:monthlyCosts,net,cumulative});
  }
  const margin=revenue>0?(profit/revenue):null;
  const contribution=price-variableBase;
  const breakEven=contribution>0?fixed/contribution:null;
  const monthlyDiscount=annualDiscount>0?Math.pow(1+annualDiscount,1/12)-1:0;
  let npv=-investment;
  rows.forEach(r=>{npv+=r.net/Math.pow(1+monthlyDiscount,r.month);});
  function npvAt(rate){
    let value=-investment;
    rows.forEach(r=>{value+=r.net/Math.pow(1+rate,r.month);});
    return value;
  }
  let irr=null, low=-0.99, high=10;
  if(npvAt(low)*npvAt(high)<=0){
    for(let i=0;i<100;i++){const mid=(low+high)/2;if(npvAt(mid)>0)low=mid;else high=mid;}
    irr=(low+high)/2;
  }
  const roi=investment>0?((profit-investment)/investment)*100:null;
  const annualizedIrr=irr===null?null:(Math.pow(1+irr,12)-1);
  return {investment,fixed,variable,price,initialDemand,growth,horizon,annualDiscount,rows,revenue,costs,profit,margin,breakEven,npv,irr,annualizedIrr,roi,payback};
}
function updateFinancialProgress(){
  const required=["financialInvestment","financialFixedCosts","financialVariableCost","financialUnitPrice","financialInitialDemand"];
  const filled=required.filter(id=>{
    const el=document.getElementById(id);
    if(!el || el.value==="") return false;
    const value=Number(el.value);
    return Number.isFinite(value) && (["financialInvestment","financialUnitPrice","financialInitialDemand"].includes(id) ? value>0 : value>=0);
  }).length;
  const percent=Math.round((filled/required.length)*100);
  const el=document.getElementById("financialProgressPercent"),fill=document.getElementById("financialProgressFill"),txt=document.getElementById("financialProgressText");
  if(el)el.textContent=percent+"%"; if(fill)fill.style.width=percent+"%";
  if(txt)txt.textContent=filled===required.length?"Premissas básicas preenchidas. Revise os indicadores e cenários.":filled+" de "+required.length+" premissas obrigatórias preenchidas.";
}
function renderFinancial(){
  const data=calculateFinancial();
  const hasCore=data.investment>0&&data.fixed>=0&&data.variable>=0&&data.price>0&&data.initialDemand>0;
  updateFinancialProgress();
  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
  if(!hasCore){
    ["financialRevenue","financialProfit","financialBreakEven","financialMargin","financialNpv","financialIrr","financialPayback","financialRoi"].forEach(id=>set(id,"—"));
    set("financialReading","Preencha as premissas.");
    set("financialReadingText","Informe investimento, custos, preço e demanda para gerar os indicadores.");
    const body=document.getElementById("financialCashflowBody");if(body)body.innerHTML='<tr><td colspan="6">Preencha as premissas para gerar a projeção.</td></tr>';
    const chart=document.getElementById("financialCashflowChart");if(chart)chart.innerHTML="";
    return;
  }
  set("financialRevenue",financialMoney(data.revenue));
  set("financialProfit",financialMoney(data.profit));
  set("financialBreakEven",Number.isFinite(data.breakEven)?Math.ceil(data.breakEven).toLocaleString("pt-BR"):"—");
  set("financialMargin",financialPercent(data.margin*100));
  set("financialNpv",financialMoney(data.npv));
  set("financialIrr",data.annualizedIrr===null?"—":financialPercent(data.annualizedIrr*100));
  set("financialPayback",data.payback===null?"Não atingido":data.payback.toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})+" meses");
  set("financialRoi",financialPercent(data.roi));
  const chart=document.getElementById("financialCashflowChart");
  if(chart){
    const max=Math.max(...data.rows.map(r=>Math.abs(r.net)),1);
    chart.innerHTML=data.rows.map(r=>'<div class="cashflow-bar '+(r.net<0?"negative":"")+'" title="Mês '+r.month+': '+financialMoney(r.net)+'"><i style="height:'+Math.max(3,Math.min(100,Math.abs(r.net)/max*100))+'%"></i><span>'+r.month+'</span></div>').join("");
  }
  document.querySelectorAll("[data-financial-scenario]").forEach(button=>button.classList.toggle("active",button.dataset.financialScenario===activeFinancialScenario));
  document.querySelectorAll("[data-financial-scenario-card]").forEach(card=>card.classList.toggle("selected",card.dataset.financialScenarioCard===activeFinancialScenario));
  renderFinancialScenarioComparison();
  const positive=data.npv>=0&&data.roi>=0;
  set("financialReading",positive?"Cenário com resultado positivo":"Cenário exige atenção");
  set("financialReadingText",positive?"As premissas atuais indicam recuperação do investimento no horizonte projetado. Compare os três cenários antes de tomar decisões.":"Com estas premissas, o retorno projetado não cobre o investimento no horizonte selecionado. Revise preço, demanda, custos ou prazo.");
  const body=document.getElementById("financialCashflowBody");
  if(body)body.innerHTML=data.rows.map(r=>'<tr><td>'+r.month+'</td><td>'+Math.round(r.demand).toLocaleString("pt-BR")+'</td><td>'+financialMoney(r.revenue)+'</td><td>'+financialMoney(r.costs)+'</td><td>'+financialMoney(r.net)+'</td><td>'+financialMoney(r.cumulative)+'</td></tr>').join("");
}
function renderFinancialScenarioComparison(){
  const body=document.getElementById("financialScenarioComparisonBody");
  if(!body) return;
  const scenarios=[
    ["pessimistic","Pessimista"],
    ["realistic","Realista"],
    ["optimistic","Otimista"]
  ];
  body.innerHTML=scenarios.map(([key,label])=>{
    const data=calculateFinancial(key);
    const payback=data.payback===null?"Não atingido":data.payback.toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})+" meses";
    return '<tr class="'+(key===activeFinancialScenario?"selected":"")+'"><th scope="row">'+label+'</th><td>'+financialMoney(data.revenue)+'</td><td>'+financialMoney(data.profit)+'</td><td>'+financialPercent(data.margin*100)+'</td><td>'+financialMoney(data.npv)+'</td><td>'+(data.annualizedIrr===null?"—":financialPercent(data.annualizedIrr*100))+'</td><td>'+payback+'</td><td>'+financialPercent(data.roi)+'</td></tr>';
  }).join("");
}

function saveFinancialDraft(){
  const data={scenario:activeFinancialScenario};
  financialFieldIds.forEach(id=>{const el=document.getElementById(id);if(el)data[id]=el.value;});
  localStorage.setItem(financialStorageKey,JSON.stringify(data));
  const status=document.getElementById("financialSaveStatus");if(status)status.textContent="Rascunho salvo automaticamente.";
}
function loadFinancialDraft(){
  try{
    const saved=JSON.parse(localStorage.getItem(financialStorageKey)||"null");if(!saved)return;
    financialFieldIds.forEach(id=>{const el=document.getElementById(id);if(el&&saved[id]!==undefined)el.value=saved[id];});
    if(["realistic","pessimistic","optimistic"].includes(saved.scenario))activeFinancialScenario=saved.scenario;
    const status=document.getElementById("financialSaveStatus");if(status)status.textContent="Rascunho recuperado deste navegador.";
  }catch{localStorage.removeItem(financialStorageKey);}
}
const financialModule=document.getElementById("financeiro");
if(financialModule){
  loadFinancialDraft();
  document.querySelectorAll("[data-financial-scenario]").forEach(button=>button.addEventListener("click",()=>{
    activeFinancialScenario=button.dataset.financialScenario;
    document.querySelectorAll("[data-financial-scenario]").forEach(item=>{const active=item===button;item.classList.toggle("active",active);item.setAttribute("aria-selected",String(active));});
    renderFinancial();saveFinancialDraft();
  }));
  financialFieldIds.forEach(id=>document.getElementById(id)?.addEventListener("input",()=>{renderFinancial();updateDashboardState();clearTimeout(financialModule._saveTimer);financialModule._saveTimer=setTimeout(saveFinancialDraft,250);}));
  document.getElementById("saveFinancial")?.addEventListener("click",()=>{saveFinancialDraft();showToast("Análise financeira salva com sucesso.");});
  document.getElementById("clearFinancial")?.addEventListener("click",()=>{
    if(!confirm("Limpar todo o preenchimento do Módulo 4?"))return;
    financialFieldIds.forEach(id=>{const el=document.getElementById(id);if(el)el.value=id==="financialGrowthRate"?"2":id==="financialHorizon"?"12":id==="financialDiscountRate"?"12":"";});
    activeFinancialScenario="realistic";
    document.querySelectorAll("[data-financial-scenario]").forEach((item,index)=>{item.classList.toggle("active",index===0);item.setAttribute("aria-selected",String(index===0));});
    localStorage.removeItem(financialStorageKey);renderFinancial();
    const status=document.getElementById("financialSaveStatus");if(status)status.textContent="Módulo limpo. Nenhum dado foi enviado para servidor.";
  });
  renderFinancial();
}


// Módulo 5 — Planos Complementares
const complementaryStorageKey="business-plan-builder:complementary:v1";
const complementaryTabFields={
  marketing:["marketingObjective","marketingAudience","marketingChannels","marketingOffer","marketingMetrics"],
  operations:["operationsProcess","operationsResources","operationsSuppliers","operationsCapacity","operationsMetrics"],
  people:["peopleStructure","peopleSkills","peopleHiring","peopleCulture"],
  legal:["legalEntity","legalLicenses","legalContracts","legalPrivacy"],
  it:["itSystems","itData","itSecurity","itRoadmap"]
};
const complementaryFieldToTab={};
Object.entries(complementaryTabFields).forEach(([tab,fields])=>fields.forEach(key=>{complementaryFieldToTab[key]=tab;}));
const complementaryFields=[...document.querySelectorAll("[data-complementary-field]")].map(el=>el.dataset.complementaryField);
function getComplementaryProgress(){
  const filled=complementaryFields.filter(key=>{const el=document.querySelector('[data-complementary-field="'+key+'"]');return el&&el.value.trim().length>0;}).length;
  return complementaryFields.length?Math.round(filled/complementaryFields.length*100):0;
}
function updateComplementaryProgress(){
  const value=getComplementaryProgress();
  const percent=document.getElementById("complementaryProgressPercent"),fill=document.getElementById("complementaryProgressFill"),text=document.getElementById("complementaryProgressText");
  if(percent)percent.textContent=value+"%";
  if(fill)fill.style.width=value+"%";
  const completedTabs=[];
  Object.entries(complementaryTabFields).forEach(([tab,fields])=>{
    const filled=fields.filter(key=>document.querySelector('[data-complementary-field="'+key+'"]')?.value.trim()).length;
    const indicator=document.querySelector('[data-complementary-tab-progress="'+tab+'"]');
    if(indicator)indicator.textContent=filled+"/"+fields.length;
    const tabEl=document.querySelector('[data-complementary-tab="'+tab+'"]');
    if(tabEl)tabEl.classList.toggle("complete",filled===fields.length);
    if(filled===fields.length)completedTabs.push(tab);
  });
  if(text)text.textContent=value===100?"Todos os planos complementares estão preenchidos. Revise os pontos antes de avançar.":completedTabs.length+" de 5 planos concluídos · "+Math.round(complementaryFields.filter(key=>document.querySelector('[data-complementary-field="'+key+'"]')?.value.trim()).length)+" de "+complementaryFields.length+" campos preenchidos.";
}
function saveComplementaryDraft(){
  const data={}; complementaryFields.forEach(key=>{const el=document.querySelector('[data-complementary-field="'+key+'"]');if(el)data[key]=el.value;});
  localStorage.setItem(complementaryStorageKey,JSON.stringify(data));
  const status=document.getElementById("complementarySaveStatus");if(status)status.textContent="Rascunho salvo automaticamente.";
}
function loadComplementaryDraft(){
  try{const data=JSON.parse(localStorage.getItem(complementaryStorageKey)||"null");if(!data)return;complementaryFields.forEach(key=>{const el=document.querySelector('[data-complementary-field="'+key+'"]');if(el&&data[key]!==undefined)el.value=data[key];});const status=document.getElementById("complementarySaveStatus");if(status)status.textContent="Rascunho recuperado deste navegador.";}catch{localStorage.removeItem(complementaryStorageKey);}
}
const complementaryModule=document.getElementById("complementares");
if(complementaryModule){
  loadComplementaryDraft();
  const activateComplementaryTab=(tab,focus=true)=>{
    const key=tab.dataset.complementaryTab;
    document.querySelectorAll("[data-complementary-tab]").forEach(item=>{
      const active=item===tab;
      item.classList.toggle("active",active);
      item.setAttribute("aria-selected",String(active));
      item.tabIndex=active?0:-1;
    });
    document.querySelectorAll("[data-complementary-panel]").forEach(panel=>{
      const active=panel.dataset.complementaryPanel===key;
      panel.classList.toggle("active",active);
      panel.hidden=!active;
    });
    if(focus)tab.focus();
  };
  document.querySelectorAll("[data-complementary-tab]").forEach(tab=>tab.addEventListener("click",()=>activateComplementaryTab(tab,false)));
  document.querySelectorAll("[data-complementary-tab]").forEach(tab=>tab.addEventListener("keydown",event=>{
    if(!["ArrowRight","ArrowDown","ArrowLeft","ArrowUp","Home","End"].includes(event.key))return;
    event.preventDefault();
    const tabs=[...document.querySelectorAll("[data-complementary-tab]")];
    const index=tabs.indexOf(tab);
    const next=event.key==="Home"?0:event.key==="End"?tabs.length-1:(index+(event.key==="ArrowRight"||event.key==="ArrowDown"?1:-1)+tabs.length)%tabs.length;
    activateComplementaryTab(tabs[next]);
  }));
  complementaryModule.querySelectorAll("[data-complementary-field]").forEach(el=>el.addEventListener("input",()=>{
    updateComplementaryProgress();updateDashboardState();clearTimeout(complementaryModule._saveTimer);complementaryModule._saveTimer=setTimeout(saveComplementaryDraft,250);
  }));
  document.getElementById("suggestComplementaryContent")?.addEventListener("click",()=>{
    const source={
      marketingAudience:document.getElementById("audience")?.value,
      marketingOffer:document.getElementById("differentials")?.value,
      operationsProcess:document.getElementById("productsDescription")?.value||document.querySelector('[data-plan-field="productsDescription"]')?.value,
      operationsSuppliers:document.querySelector('[data-plan-field="operationalProcesses"]')?.value,
      itSystems:document.querySelector('[data-plan-field="companyModel"]')?.value
    };
    let filled=0;
    Object.entries(source).forEach(([key,value])=>{
      const field=document.querySelector('[data-complementary-field="'+key+'"]');
      if(field&&value?.trim()&&!field.value.trim()){field.value=value.trim();filled++;}
    });
    updateComplementaryProgress();saveComplementaryDraft();updateDashboardState();
    showToast(filled?filled+" campo(s) preenchido(s) com dados anteriores.":"Nenhum campo vazio encontrou dados anteriores.");
  });
  document.getElementById("saveComplementary")?.addEventListener("click",()=>{saveComplementaryDraft();showToast("Planos complementares salvos com sucesso.");});
  document.getElementById("clearComplementary")?.addEventListener("click",()=>{
    if(!confirm("Limpar todo o preenchimento do Módulo 5?"))return;
    complementaryModule.querySelectorAll("[data-complementary-field]").forEach(el=>el.value="");
    localStorage.removeItem(complementaryStorageKey);updateComplementaryProgress();updateDashboardState();
    const status=document.getElementById("complementarySaveStatus");if(status)status.textContent="Módulo limpo. Nenhum dado foi enviado para servidor.";
  });
  updateComplementaryProgress();
}

// Módulo 6 — Exportação e Compartilhamento
const exportVersionsKey="business-plan-builder:versions:v1";
const exportShareParam="plano";
const exportModule=document.getElementById("exportacao");
function getAllPlanData(){
  const data={};
  document.querySelectorAll("[data-field],[data-plan-field],[data-complementary-field]").forEach(el=>{
    const key=el.dataset.field||el.dataset.planField||el.dataset.complementaryField;
    if(key&&el.value!==undefined)data[key]=el.value;
  });
  return data;
}
function escapeExport(value){
  return String(value??"").replace(/[&<>"]/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[char]));
}
function getExportRows(){
  const rows=[];
  document.querySelectorAll("[data-field],[data-plan-field],[data-complementary-field]").forEach(el=>{
    const key=el.dataset.field||el.dataset.planField||el.dataset.complementaryField;
    const label=el.closest("label")?.querySelector("span")?.textContent?.trim()||key;
    const value=el.value?.trim();
    if(key&&value)rows.push([label,value]);
  });
  return rows;
}
function updateExportProgress(){
  const modules=[
    typeof getOpportunityProgress==="function"?getOpportunityProgress():0,
    typeof getEnvironmentProgress==="function"?getEnvironmentProgress():0,
    typeof getPlanProgress==="function"?getPlanProgress():0,
    typeof getFinancialProgress==="function"?getFinancialProgress():0,
    typeof getComplementaryProgress==="function"?getComplementaryProgress():0
  ];
  const value=Math.round(modules.reduce((a,b)=>a+b,0)/modules.length);
  const percent=document.getElementById("exportProgressPercent"),fill=document.getElementById("exportProgressFill"),text=document.getElementById("exportProgressText"),summary=document.getElementById("exportSummaryText");
  if(percent)percent.textContent=value+"%"; if(fill)fill.style.width=value+"%";
  if(text)text.textContent=value===100?"Plano pronto para exportação e compartilhamento.":"Complete os módulos 1 a 5 para consolidar o plano.";
  if(summary)summary.textContent=getExportRows().length+" campos preenchidos · "+modules.filter(v=>v===100).length+" de 5 módulos concluídos.";
}
function setExportStatus(message){const el=document.getElementById("exportStatus");if(el)el.textContent=message;}
function downloadBlob(content,type,filename){
  const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function updateExportPreview(){const el=document.getElementById("exportDocumentPreview");if(el)el.innerHTML=buildExportHtml().replace(/^[\s\S]*?<body>|<\/body>[\s\S]*$/g,"");}
function buildExportHtml(){
  const name=document.getElementById("businessName")?.value?.trim()||"Plano de Negócio";
  const rows=getExportRows();
  return "<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'><title>"+escapeExport(name)+"</title><style>body{font-family:Arial,sans-serif;max-width:900px;margin:40px auto;color:#202532}h1{margin-bottom:6px}p{color:#626a78}table{width:100%;border-collapse:collapse;margin-top:24px}td{border:1px solid #ddd;padding:10px;vertical-align:top}td:first-child{width:30%;font-weight:700;background:#f5f5f5}</style></head><body><h1>"+escapeExport(name)+"</h1><p>Plano de negócio — exportado em "+new Date().toLocaleString("pt-BR")+"</p><table>"+rows.map(row=>"<tr><td>"+escapeExport(row[0])+"</td><td>"+escapeExport(row[1]).replace(/\n/g,"<br>")+"</td></tr>").join("")+"</table></body></html>";
}
function createSharePayload(){
  const payload={v:2,createdAt:new Date().toISOString(),data:getAllPlanData()};
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}
function getShareUrl(){
  const url=new URL(location.href);url.searchParams.set(exportShareParam,createSharePayload());url.hash="exportacao";return url.toString();
}
function updateShareControls(){
  const output=document.getElementById("shareLinkOutput"),copy=document.getElementById("copyShareLink");
  if(!output||!copy)return;
  const hasValue=Boolean(output.value.trim());copy.disabled=!hasValue;
  const length=output.value.length;
  output.classList.toggle("share-link-long",length>1800);
}
function readSharePayload(){
  try{
    const raw=new URLSearchParams(location.search).get(exportShareParam); if(!raw)return null;
    return JSON.parse(decodeURIComponent(escape(atob(raw))));
  }catch{return null;}
}
function restoreSharePayload(){
  const payload=readSharePayload(); if(!payload?.data)return false;
  Object.entries(payload.data).forEach(([key,value])=>{
    const el=document.querySelector('[data-field="'+key+'"],[data-plan-field="'+key+'"],[data-complementary-field="'+key+'"]');
    if(el&&typeof value==="string")el.value=value;
  });
  [updateComplementaryProgress,updateExportProgress,updateDashboardState].forEach(fn=>typeof fn==="function"&&fn());
  setExportStatus("Cópia compartilhada carregada neste navegador. Revise os dados antes de continuar.");
  return true;
}
function loadPlanVersions(){
  const list=document.getElementById("planVersions");if(!list)return;
  let versions=[];try{versions=JSON.parse(localStorage.getItem(exportVersionsKey)||"[]");}catch{versions=[];}
  if(!versions.length){list.innerHTML="<p class='empty-state'>Nenhuma versão salva ainda.</p>";return;}
  list.innerHTML=versions.map((v,i)=>"<article class='plan-version'><div><strong>"+escapeExport(v.name)+"</strong><small>"+new Date(v.createdAt).toLocaleString("pt-BR")+"</small></div><div><button type='button' class='text-button' data-version-restore='"+i+"'>Restaurar</button><button type='button' class='text-button danger' data-version-delete='"+i+"'>Excluir</button></div></article>").join("");
  list.querySelectorAll("[data-version-restore]").forEach(btn=>btn.addEventListener("click",()=>restorePlanVersion(Number(btn.dataset.versionRestore))));
  list.querySelectorAll("[data-version-delete]").forEach(btn=>btn.addEventListener("click",()=>deletePlanVersion(Number(btn.dataset.versionDelete))));
}
function savePlanVersion(){
  const input=document.getElementById("versionName");const name=input?.value.trim()||"Versão "+new Date().toLocaleDateString("pt-BR");
  let versions=[];try{versions=JSON.parse(localStorage.getItem(exportVersionsKey)||"[]");}catch{}
  versions.unshift({name,createdAt:new Date().toISOString(),data:getAllPlanData()});versions=versions.slice(0,10);
  localStorage.setItem(exportVersionsKey,JSON.stringify(versions));if(input)input.value="";loadPlanVersions();setExportStatus("Versão salva com sucesso.");
}
function restorePlanVersion(index){
  let versions=[];try{versions=JSON.parse(localStorage.getItem(exportVersionsKey)||"[]");}catch{}
  const version=versions[index];if(!version)return;
  if(!confirm("Restaurar a versão \""+version.name+"\"? Os dados atuais serão substituídos."))return;
  Object.entries(version.data||{}).forEach(([key,value])=>{
    const el=document.querySelector('[data-field="'+key+'"],[data-plan-field="'+key+'"],[data-complementary-field="'+key+'"]');if(el)el.value=value;
  });
  localStorage.setItem("business-plan-builder:opportunity:v2",JSON.stringify(Object.fromEntries(Object.entries(version.data||{}).filter(([k])=>document.querySelector('[data-field="'+k+'"]')))));
  saveComplementaryDraft?.(); updateExportProgress();updateDashboardState?.();setExportStatus("Versão restaurada. Revise o plano antes de exportar.");
}
function deletePlanVersion(index){
  let versions=[];try{versions=JSON.parse(localStorage.getItem(exportVersionsKey)||"[]");}catch{}
  if(!confirm("Excluir esta versão salva?"))return;versions.splice(index,1);localStorage.setItem(exportVersionsKey,JSON.stringify(versions));loadPlanVersions();
}
if(exportModule){
  document.getElementById("exportPdf")?.addEventListener("click",()=>{setExportStatus("Abrindo impressão. Escolha \"Salvar como PDF\" no navegador.");window.print();});
  document.getElementById("exportWord")?.addEventListener("click",()=>{downloadBlob(buildExportHtml(),"application/msword","plano-de-negocio.doc");setExportStatus("Arquivo Word gerado.");});
  document.getElementById("exportExcel")?.addEventListener("click",()=>{
    const rows=getExportRows(),csv="\ufeff"+[["Campo","Conteúdo"],...rows].map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(";")).join("\r\n");
    downloadBlob(csv,"text/csv;charset=utf-8","plano-de-negocio.csv");setExportStatus("Arquivo CSV gerado e compatível com Excel.");
  });
  // O compartilhamento persistente é controlado por js/server-sync.js para evitar dois
  // handlers concorrentes no mesmo botão. O leitor de links locais antigos permanece compatível.
  document.getElementById("copyShareLink")?.addEventListener("click",async()=>{
    const output=document.getElementById("shareLinkOutput");if(!output?.value)return;
    try{await navigator.clipboard.writeText(output.value);setExportStatus("Link copiado para a área de transferência.");}catch{output.select();document.execCommand("copy");setExportStatus("Link copiado.");}
  });
  document.getElementById("savePlanVersion")?.addEventListener("click",savePlanVersion);
  updateExportProgress();loadPlanVersions();restoreSharePayload();updateExportPreview();updateShareControls(); exportModule.querySelectorAll("[data-field],[data-plan-field],[data-complementary-field]").forEach(el=>el.addEventListener("input",()=>{clearTimeout(exportModule._previewTimer);exportModule._previewTimer=setTimeout(updateExportPreview,250);}));
}
/* Integra Módulos ao dashboard e ao desbloqueio sequencial */
const previousUpdateDashboardState=updateDashboardState;
updateDashboardState=function(){
  const opportunity=getOpportunityProgress();
  const environment=getEnvironmentProgress();
  const planValues=typeof getPlanSectionProgress==="function"?getPlanSectionProgress():[];
  const plan=planValues.length?Math.round(planValues.reduce((a,b)=>a+b,0)/planValues.length):0;
  const financialRequired=["financialInvestment","financialFixedCosts","financialVariableCost","financialUnitPrice","financialInitialDemand"];
  const financialFilled=financialRequired.filter(id=>{const el=document.getElementById(id);if(!el||el.value==="")return false;const value=Number(el.value);return Number.isFinite(value)&&(["financialInvestment","financialUnitPrice","financialInitialDemand"].includes(id)?value>0:value>=0);}).length;
  const financial=financialFilled===financialRequired.length?100:financialFilled/financialRequired.length*100;
  const complementary=typeof getComplementaryProgress==="function"?getComplementaryProgress():0;
  const exportProgress=complementary===100?100:0;
  const modules=[opportunity,environment,plan,financial,complementary,exportProgress,0];
  const overall=Math.round(modules.reduce((sum,value)=>sum+value,0)/modules.length);
  const progressLabel=document.querySelector(".progress-mini .progress-label strong"),progressFill=document.querySelector(".progress-mini .progress-track span"),heroPercent=document.getElementById("heroProgressPercent"),heroFill=document.getElementById("heroProgressFill");
  if(progressLabel)progressLabel.textContent=overall+"%";if(progressFill)progressFill.style.width=overall+"%";if(heroPercent)heroPercent.textContent=overall+"%";if(heroFill)heroFill.style.width=overall+"%";
  const completed=modules.filter(v=>v===100).length,started=modules.filter(v=>v>0).length,status=document.getElementById("dashboardStatus");
  if(status)status.textContent=completed+" de 7 módulos concluídos · "+started+" em andamento/iniciados";
  document.querySelectorAll("[data-dashboard-module]").forEach(card=>{
    const module=Number(card.dataset.dashboardModule),value=modules[module-1]||0,previous=module>1?modules[module-2]||0:100,unlocked=module===1||previous===100,statusEl=card.querySelector(".module-status"),lockedEl=card.querySelector(".locked");
    let action=card.querySelector("a.module-action");
    card.classList.toggle("completed",value===100);card.classList.toggle("current",unlocked&&value>0&&value<100);
    if(statusEl){statusEl.classList.toggle("muted",!unlocked&&value===0);statusEl.textContent=value===100?"Concluído":value>0?"Em andamento":module===1?"Próximo":unlocked?"Disponível":"Bloqueado";}
    if(lockedEl&&module>1)lockedEl.textContent=unlocked?"Pronto para começar":"Disponível após concluir o módulo "+(module-1);
    if(module>=2&&module<=5&&unlocked){
      if(!action){action=document.createElement("a");action.className="module-action";card.appendChild(action);}
      action.href=module===2?"#ambientes":module===3?"#plano":module===4?"#financeiro":module===5?"#complementares":"#exportacao";action.textContent=value===100?"Revisar →":module===6?"Começar →":"Continuar →";action.removeAttribute("aria-disabled");action.classList.remove("disabled");
    }else if(action&&module>=2&&module<=5){action.setAttribute("aria-disabled","true");action.classList.add("disabled");}
  });
};
updateDashboardState();
window.addEventListener("hashchange",()=>{
  if(location.hash==="#financeiro"&&getPlanSectionProgress().some(v=>v<100)){
    history.replaceState(null,"","#plano");showToast("Conclua as 10 seções do Módulo 3 antes de iniciar a Viabilidade Financeira.");
    return;
  }
  if(location.hash==="#complementares"){
    const financialRequired=["financialInvestment","financialFixedCosts","financialVariableCost","financialUnitPrice","financialInitialDemand"];
    const financialComplete=financialRequired.every(id=>{const el=document.getElementById(id);if(!el||el.value==="")return false;const value=Number(el.value);return Number.isFinite(value)&&(["financialInvestment","financialUnitPrice","financialInitialDemand"].includes(id)?value>0:value>=0);});
    if(!financialComplete){history.replaceState(null,"","#financeiro");showToast("Conclua as premissas obrigatórias do Módulo 4 antes de iniciar os Planos Complementares.");}
  }
});

// Funções usadas pelos módulos clássicos e pela integração Neon.
// app.js é um ES module, portanto suas funções não ficam globais automaticamente.
Object.assign(window, {
  showToast,
  getOpportunityProgress,
  getSwotState,
  getEnvironmentProgress,
  updateEnvironmentProgress,
  updateDashboardState,
  getPlanSectionProgress,
  getComplementaryProgress,
  updateComplementaryProgress,
  renderFinancial
});

