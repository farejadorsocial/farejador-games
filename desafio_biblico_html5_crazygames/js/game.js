(()=>{
const $=id=>document.getElementById(id);
const screens=['home','categories','game','over','result','info','recordsScreen','achievementsScreen'];
let crazyReady=()=>!!(window.CrazyGamesReady&&window.CrazyGames&&window.CrazyGames.SDK),cat='ALL',list=[],idx=0,score=0,lives=3,correct=0,wrong=0,time=30,clock=null,locked=false,audio=null,music=null,sound=true,deadline=0,remaining=30,adPaused=false;
const names={AT:'ANTIGO TESTAMENTO',NT:'NOVO TESTAMENTO',PERS:'PERSONAGENS BÍBLICOS',HIST:'HISTÓRIAS BÍBLICAS',ALL:'JORNADA COMPLETA'};
function show(s){screens.forEach(x=>$(x).classList.toggle('active',x===s));window.scrollTo(0,0)}
function store(){try{return JSON.parse(localStorage.getItem('dbStats')||'{"best":0,"games":0,"correct":0,"answered":0}')}catch(e){return {best:0,games:0,correct:0,answered:0}}}
function save(){const s=store(),newRecord=score>s.best;s.best=Math.max(s.best,score);s.games++;s.correct+=correct;s.answered+=correct+wrong;try{localStorage.setItem('dbStats',JSON.stringify(s))}catch(e){}return {stats:s,newRecord}}
function records(){const s=store();$('best').textContent=s.best;$('games').textContent=s.games;$('correctTotal').textContent=s.correct;$('answered').textContent=s.answered}
function achievements(){const s=store();const items=[
{icon:'🌱',name:'Primeiros passos',desc:'Conclua sua primeira partida.',ok:s.games>=1,progress:Math.min(s.games,1),goal:1},
{icon:'📖',name:'Estudioso',desc:'Conclua 5 partidas.',ok:s.games>=5,progress:Math.min(s.games,5),goal:5},
{icon:'🏆',name:'Veterano',desc:'Conclua 20 partidas.',ok:s.games>=20,progress:Math.min(s.games,20),goal:20},
{icon:'✨',name:'Boa memória',desc:'Acerte 10 perguntas ao todo.',ok:s.correct>=10,progress:Math.min(s.correct,10),goal:10},
{icon:'💡',name:'Mente brilhante',desc:'Acerte 50 perguntas ao todo.',ok:s.correct>=50,progress:Math.min(s.correct,50),goal:50},
{icon:'🔥',name:'Sequência de estudos',desc:'Alcance 100 acertos acumulados.',ok:s.correct>=100,progress:Math.min(s.correct,100),goal:100},
{icon:'🥇',name:'Grande pontuação',desc:'Faça 70 pontos em uma partida.',ok:s.best>=70,progress:Math.min(s.best,70),goal:70},
{icon:'👑',name:'Mestre bíblico',desc:'Faça 100 pontos em uma partida.',ok:s.best>=100,progress:Math.min(s.best,100),goal:100}
];$('achievementList').innerHTML=items.map(a=>'<article class="achievement '+(a.ok?'unlocked':'')+'"><span class="achievement-icon">'+a.icon+'</span><div><b>'+a.name+'</b><small>'+a.desc+'</small><div class="achievement-track"><i style="width:'+(a.progress/a.goal*100)+'%"></i></div></div><strong>'+(a.ok?'DESBLOQUEADA':a.progress+'/'+a.goal)+'</strong></article>').join('')}
function shuffle(a){const out=a.slice();for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]]}return out}
function audioStart(){if(!sound||adPaused)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();clearInterval(music);const seq=[146.83,174.61,220,174.61,130.81,164.81,196,164.81];let n=0;music=setInterval(()=>{if(!sound)return;[seq[n%8],seq[n%8]/2].forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type=i?'triangle':'sine';o.frequency.value=f;g.gain.setValueAtTime(i?.008:.018,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.65);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.66)});n++},700)}catch(e){}}
function beep(f){if(!sound||adPaused)return;try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=f;o.type='triangle';g.gain.value=.06;g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.2);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.2)}catch(e){}}
function start(c){if(crazyReady()){try{window.CrazyGames.SDK.game.gameplayStart()}catch(e){}}cat=c;const pool=QUESTION_BANK.filter(q=>c==='ALL'||q.category===c);list=shuffle(pool).slice(0,10);idx=0;score=0;lives=3;correct=0;wrong=0;$('catlabel').textContent=names[c]||'JORNADA COMPLETA';show('game');audioStart();render()}
function pauseForAd(){
 if(adPaused)return;
 adPaused=true;
 clearInterval(music);
 if(clock){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));clearInterval(clock);clock=null}
}
function resumeFromAd(){
 if(!adPaused)return;
 adPaused=false;
 if($('game').classList.contains('active')&&!locked){
  deadline=Date.now()+Math.max(0,remaining)*1000;
  clock=setInterval(updateClock,200);
 }
 audioStart();
}
function requestAd(){
 if(!crazyReady())return;
 try{
  window.CrazyGames.SDK.ad.requestAd("midgame",{
   adStarted:()=>{pauseForAd();},
   adFinished:()=>{resumeFromAd();},
   adError:()=>{resumeFromAd();}
  });
 }catch(e){resumeFromAd();}
}
function updateClock(){time=Math.max(0,Math.ceil((deadline-Date.now())/1000));$('time').textContent=time;const t=$('time').parentElement;if(t)t.classList.toggle('urgent',time<=10);if(time<=0){clearInterval(clock);timeout()}}
function render(){clearInterval(clock);time=30;remaining=30;locked=false;const q=list[idx];$('score').textContent=score;$('lives').textContent='♥ '.repeat(lives).trim();$('time').textContent=time;$('progress').style.width=((idx+1)/list.length*100)+'%';$('question').textContent=q.question;$('feedback').className='';$('feedback').innerHTML='';$('answers').innerHTML='';const counter=document.getElementById('questionCounter');if(counter)counter.textContent='PERGUNTA '+(idx+1)+' DE '+list.length;shuffle(q.options).forEach((a,i)=>{const b=document.createElement('button');b.className='answer';b.textContent=String.fromCharCode(65+i)+'　'+a;b.setAttribute('aria-label','Alternativa '+String.fromCharCode(65+i)+': '+a);b.onclick=()=>answer(a,q,b);$('answers').appendChild(b)});deadline=Date.now()+30000;clock=setInterval(updateClock,200)}
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function feedback(q,ok,reason){const box=$('feedback');box.innerHTML='<b>'+(ok?'✦ RESPOSTA CORRETA · +10 PONTOS':'✧ '+(reason==='timeout'?'TEMPO ESGOTADO':'RESPOSTA INCORRETA'))+'</b><br>'+(ok?'':('Resposta correta: <b>'+escape(q.correct)+'</b>.<br>'))+escape(q.explanation)+'<br><small>Referência: '+escape(q.reference)+'</small>';box.classList.add('show');const n=document.createElement('button');n.textContent=lives<=0?'Ver resultado':(idx===list.length-1?'Concluir jornada':'Próxima pergunta →');n.onclick=()=>{if(lives<=0)finish(false);else if(++idx>=list.length)finish(true);else render()};box.appendChild(n)}
function reveal(q,chosen){document.querySelectorAll('.answer').forEach(x=>{x.disabled=true;const value=x.textContent.slice(3);if(value===q.correct)x.classList.add('correct');else if(chosen&&value===chosen)x.classList.add('wrong')})}
function answer(a,q,b){if(locked)return;locked=true;clearInterval(clock);const ok=a===q.correct;reveal(q,a);if(ok){score+=10;correct++;beep(660)}else{lives--;wrong++;beep(180)}$('score').textContent=score;$('lives').textContent='♥ '.repeat(lives).trim()||'—';feedback(q,ok,'wrong')}
function timeout(){if(locked)return;locked=true;lives--;wrong++;const q=list[idx];reveal(q,null);$('lives').textContent='♥ '.repeat(lives).trim()||'—';feedback(q,false,'timeout')}
function finish(completed){clearInterval(clock);if(crazyReady()){try{window.CrazyGames.SDK.game.gameplayStop()}catch(e){}}const saved=save();if(completed){$('finalScore').textContent=score;$('finalStats').textContent=correct+' acertos • '+wrong+' erros';$('recordLine').textContent=saved.newRecord?'✧ NOVO RECORDE PESSOAL!':'Continue avançando em sua jornada';show('result')}else{$('overScore').textContent=score;$('overStats').textContent=correct+' acertos • '+wrong+' erros';show('over')}requestAd();}
$('play').onclick=()=>{if(crazyReady()){try{window.CrazyGames.SDK.game.gameplayStop()}catch(e){}}audioStart();show('categories')};
$('how').onclick=()=>show('info');
$('records').onclick=()=>{records();show('recordsScreen')};
$('achievements').onclick=()=>{achievements();show('achievementsScreen')};
$('openAchievements').onclick=()=>{achievements();show('achievementsScreen')};
document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>start(b.dataset.cat));
document.querySelectorAll('[data-home]').forEach(b=>b.onclick=()=>{clearInterval(clock);if(crazyReady()){try{window.CrazyGames.SDK.game.gameplayStop()}catch(e){}}show('home');audioStart()});
$('quit').onclick=()=>{if(confirm('Sair desta partida? Seu progresso desta rodada não será salvo.')){clearInterval(clock);if(crazyReady()){try{window.CrazyGames.SDK.game.gameplayStop()}catch(e){}}show('categories')}};
$('again').onclick=()=>show('categories');
$('retry').onclick=()=>start(cat);
$('clear').onclick=()=>{if(confirm('Apagar os recordes deste dispositivo?')){localStorage.removeItem('dbStats');records()}};
$('sound').onclick=$('sound2').onclick=()=>{sound=!sound;document.querySelectorAll('#sound,#sound2').forEach(b=>b.textContent=sound?'♫':'♪');if(sound)audioStart();else clearInterval(music)};
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInterval(music);if(clock){remaining=Math.max(0,Math.ceil((deadline-Date.now())/1000));clearInterval(clock);clock=null}}else if($('game').classList.contains('active')&&!locked&&!adPaused){deadline=Date.now()+remaining*1000;clock=setInterval(updateClock,200);audioStart()}});
})();
