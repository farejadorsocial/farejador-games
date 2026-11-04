/* GameMonetize HTML5 SDK — Desafio Bíblico */
(function(){
  window.SDK_OPTIONS={
    gameId:"uwpsh6tnrvu2id1m2y6zj7hpm6n99xnq",
    onEvent:function(event){
      if(!event||!event.name)return;
      if(event.name==="SDK_GAME_PAUSE"&&typeof window.GameMonetizePause==="function")window.GameMonetizePause();
      if(event.name==="SDK_GAME_START"&&typeof window.GameMonetizeResume==="function")window.GameMonetizeResume();
    }
  };
  var first=document.getElementsByTagName("script")[0];
  if(!document.getElementById("gamemonetize-sdk")){
    var script=document.createElement("script");
    script.id="gamemonetize-sdk";
    script.src="https://api.gamemonetize.com/sdk.js";
    first.parentNode.insertBefore(script,first);
  }
})();