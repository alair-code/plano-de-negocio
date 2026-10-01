const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const demoButton = document.getElementById("demoButton");
const toast = document.getElementById("toast");

menuButton?.addEventListener("click", () => {
  sidebar?.classList.toggle("open");
});

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => sidebar?.classList.remove("open"));
});

demoButton?.addEventListener("click", () => {
  toast?.classList.add("show");
  window.setTimeout(() => toast?.classList.remove("show"), 3200);
});

const navItems = document.querySelectorAll(".nav-item");
window.addEventListener("hashchange", () => {
  const hash = window.location.hash;
  navItems.forEach((item) => item.classList.toggle("active", item.getAttribute("href") === hash));
});