/* Aviso de cookies do Farejador Games.
   - Mostra o aviso na primeira visita e guarda a escolha em localStorage ("granted" ou "denied").
   - Qualquer link com o atributo data-fg-cookies reabre o aviso (Preferências de cookies).
   - Os anúncios (js/ads.js) só carregam depois que a pessoa escolhe. */
(function () {
  var KEY = "fg_consent_v2";
  var script = document.currentScript;
  var base = script && script.src ? script.src.replace(/js\/consent\.js.*$/, "") : "";
  var listeners = [];

  function get() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function set(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function fire() { listeners.forEach(function (f) { try { f(get()); } catch (e) {} }); }

  var bannerCss = ":host{all:initial}.fg-cookie{position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:760px;margin:0 auto;" +
    "background:#14213d;color:#fff;border-radius:16px;padding:16px 18px;box-shadow:0 18px 40px -12px #000a;box-sizing:border-box;" +
    "font:14px/1.5 Inter,'Segoe UI',system-ui,Arial,sans-serif;display:flex;gap:14px;align-items:center;flex-wrap:wrap}" +
    "p{margin:0;flex:1 1 320px;color:#e9edf7}a{color:#e4b94e;text-decoration:underline}" +
    ".b{display:flex;gap:8px;flex:0 0 auto}" +
    "button{border:0;border-radius:999px;padding:11px 18px;font:700 13px/1 Inter,'Segoe UI',system-ui,Arial,sans-serif;cursor:pointer}" +
    ".ok{background:#e4b94e;color:#14213d}.no{background:transparent;color:#fff;box-shadow:inset 0 0 0 1px #ffffff66}" +
    "button:focus-visible{outline:3px solid #fff;outline-offset:2px}";
  var pageCss = ".fg-legal{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 14px;margin:10px 0 0;font:600 12px/1.4 Inter,'Segoe UI',system-ui,Arial,sans-serif;letter-spacing:0;text-transform:none}" +
    ".fg-legal a{color:inherit;opacity:.8;text-decoration:underline}.fg-legal a:hover{opacity:1}";
  var st = document.createElement("style"); st.textContent = pageCss; document.head.appendChild(st);

  var box = null;
  function close() { if (box && box.parentNode) box.parentNode.removeChild(box); box = null; }
  function loadAnalytics() {
    var C = window.FG_CONFIG || {};
    var id = C.analyticsId;
    if (!id) return;

    // Sem consentimento, não inicia a tag. Se a pessoa revogar depois de aceitar,
    // envia a atualização para interromper o armazenamento de Analytics.
    if (get() !== "granted") {
      if (window.__fgAnalyticsLoaded && window.gtag) {
        window.gtag("consent", "update", { analytics_storage: "denied" });
      }
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

    if (!window.__fgAnalyticsLoaded) {
      window.__fgAnalyticsLoaded = true;
      window.gtag("js", new Date());
      window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
      var s = document.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
      document.head.appendChild(s);
      window.gtag("config", id, { send_page_view: true });
    }

    window.gtag("consent", "update", {
      analytics_storage: get() === "granted" ? "granted" : "denied"
    });
  }

  function choose(v) {
    set(v);
    close();
    loadAnalytics();
    fire();
  }

  function open() {
    if (box) return;
    box = document.createElement("div");
    var root = box.attachShadow ? box.attachShadow({ mode: "open" }) : box;
    root.innerHTML = "<style>" + bannerCss + "</style>" +
      "<div class=\"fg-cookie\" role=\"dialog\" aria-label=\"Aviso de cookies\">" +
      "<p>Usamos armazenamento no seu aparelho para salvar seus recordes. Com sua autorização, o Google Analytics mede as páginas visitadas e o uso do site. " +
      "Se a publicidade estiver ativa, o Google e seus parceiros também poderão usar cookies para anúncios. Ao recusar, o Analytics não será ativado e os anúncios serão não personalizados. " +
      "Saiba mais na <a href=\"" + base + "privacidade.html\">Política de Privacidade</a>.</p>" +
      "<div class=\"b\"><button type=\"button\" class=\"no\">Recusar</button><button type=\"button\" class=\"ok\">Aceitar</button></div></div>";
    root.querySelector(".ok").addEventListener("click", function () { choose("granted"); });
    root.querySelector(".no").addEventListener("click", function () { choose("denied"); });
    document.body.appendChild(box);
  }

  function ready(f) { if (document.body) f(); else document.addEventListener("DOMContentLoaded", f); }

  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("[data-fg-cookies]");
    if (a) { e.preventDefault(); open(); }
  });

  window.FGConsent = { get: get, open: open, onChange: function (f) { listeners.push(f); } };
  if (get() === "granted") loadAnalytics();
  if (!get()) ready(open);
})();
