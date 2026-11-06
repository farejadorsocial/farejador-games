/* Configuração central do Farejador Games.
   Edite aqui (ou rode PERSONALIZAR.py, que preenche tudo de uma vez). */
window.FG_CONFIG = {
  siteUrl: "https://farejadorsocial.github.io/farejador-games/central_games",   // endereço público do site, sem barra no final
  email: "orgfarejador@gmail.com",        // e-mail de contato mostrado ao público
  responsavel: "Farejador Games",         // nome do responsável mostrado ao público

  // Google Analytics 4 — coleta somente após consentimento no aviso de cookies.
  analyticsId: "G-5PQC7TLG07",

  // ---- Anúncios (Google AdSense / H5 Games Ads) ----
  // Mantenha adsEnabled=false até o AdSense aprovar o site E o H5 Games Ads liberar sua conta.
  adsEnabled: false,
  adsenseClient: "",        // ex.: "ca-pub-1234567890123456"
  testMode: true,           // true = anúncios de teste (data-adbreak-test). Mude para false só ao publicar de verdade.
  adMinGapSeconds: 120      // intervalo mínimo entre dois anúncios de tela cheia
};
