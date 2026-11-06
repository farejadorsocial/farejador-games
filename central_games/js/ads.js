/* Anúncios do Farejador Games — Google AdSense H5 Games Ads (Ad Placement API).
   Fica DESLIGADO enquanto FG_CONFIG.adsEnabled for false ou não houver adsenseClient.

   Regras seguidas (políticas do Google para anúncios de tela cheia):
   - só aparece como "intervalo" ao INICIAR uma nova partida (transição entre telas);
   - nunca na primeira partida da visita, nunca durante uma pergunta, nunca ao abrir ou fechar o site;
   - respeita um intervalo mínimo entre anúncios (adMinGapSeconds);
   - só carrega depois que a pessoa escolhe no aviso de cookies. */
(function () {
  var C = window.FG_CONFIG || {};
  var enabled = !!(C.adsEnabled && C.adsenseClient);
  var gapMs = (C.adMinGapSeconds || 120) * 1000;
  var loaded = false, starts = 0, lastAd = 0;

  function load() {
    if (!enabled || loaded) return;
    loaded = true;
    var npa = (window.FGConsent && FGConsent.get() === "granted") ? 0 : 1;
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.requestNonPersonalizedAds = npa;
    window.adBreak = window.adConfig = function (o) { window.adsbygoogle.push(o); };
    window.adConfig({ preloadAdBreaks: "on", sound: "on" });
    var s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(C.adsenseClient);
    s.setAttribute("data-ad-frequency-hint", Math.round(gapMs / 1000) + "s");
    if (C.testMode) s.setAttribute("data-adbreak-test", "on");
    document.head.appendChild(s);
  }

  if (enabled && window.FGConsent) {
    if (FGConsent.get()) load(); else FGConsent.onChange(load);
  }

  /* Chamado pelo jogo antes de começar uma partida. Sempre acaba chamando proceed(). */
  function gate(proceed) {
    starts++;
    var due = enabled && loaded && typeof window.adBreak === "function" && starts > 1 && (Date.now() - lastAd) > gapMs;
    if (!due) { proceed(); return; }
    var finished = false, shown = false;
    function go() { if (finished) return; finished = true; proceed(); }
    var safety = setTimeout(function () { if (!shown) go(); }, 5000);
    window.adBreak({
      type: "next",
      name: "nova-partida",
      beforeAd: function () { shown = true; clearTimeout(safety); },
      afterAd: function () { lastAd = Date.now(); },
      adBreakDone: function () { clearTimeout(safety); go(); }
    });
  }

  window.FGAds = { gate: gate, enabled: enabled };
})();
