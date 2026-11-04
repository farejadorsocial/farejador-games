/* CrazyGames HTML5 SDK v3 — Desafio Bíblico */
(function(){
  async function initializeCrazyGames(){
    try{
      if(!window.CrazyGames||!window.CrazyGames.SDK)return;
      await window.CrazyGames.SDK.init();
      window.CrazyGamesReady=true;
      try{window.CrazyGames.SDK.game.gameplayStop()}catch(e){}
      console.info("CrazyGames SDK v3 initialized");
    }catch(error){
      console.warn("CrazyGames SDK initialization failed:",error);
    }
  }
  window.addEventListener("wheel",event=>event.preventDefault(),{passive:false});
  window.addEventListener("keydown",event=>{
    if(["ArrowUp","ArrowDown"," "].includes(event.key))event.preventDefault();
  });
  initializeCrazyGames();
})();