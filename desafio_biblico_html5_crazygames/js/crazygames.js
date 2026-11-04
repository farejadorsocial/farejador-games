/* CrazyGames HTML5 SDK v3 — Desafio Bíblico */
(function(){
  async function initializeCrazyGames(){
    try{
      if(!window.CrazyGames||!window.CrazyGames.SDK)return;
      const sdk=window.CrazyGames.SDK;
      try{sdk.game.loadingStart()}catch(e){}
      await sdk.init();
      const environment=sdk.environment;
      window.CrazyGamesEnvironment=environment;
      window.CrazyGamesReady=(environment==="local"||environment==="crazygames");
      try{sdk.game.loadingStop()}catch(e){}
      if(window.CrazyGamesReady){
        try{sdk.game.gameplayStop()}catch(e){}
      }
      console.info("CrazyGames SDK v3:",environment);
    }catch(error){
      window.CrazyGamesReady=false;
      console.warn("CrazyGames SDK initialization failed:",error);
    }
  }
  initializeCrazyGames();
})();