/* Menu compacto do cabeçalho (celular). Sem JavaScript, os links continuam visíveis em uma segunda linha. */
(function () {
  var bar = document.querySelector(".topbar");
  var nav = bar && bar.querySelector("nav");
  if (!nav) return;
  nav.id = nav.id || "menu-principal";

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "menu-btn";
  btn.setAttribute("aria-label", "Abrir menu");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-controls", nav.id);
  btn.innerHTML = "<span></span><span></span><span></span>";
  bar.appendChild(btn);
  bar.classList.add("js-nav");

  function set(open) {
    bar.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  }
  btn.addEventListener("click", function () { set(!bar.classList.contains("open")); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
  document.addEventListener("click", function (e) { if (!bar.contains(e.target)) set(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
})();
