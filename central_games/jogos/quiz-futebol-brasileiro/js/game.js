(()=>{
const $=id=>document.getElementById(id);
const screens=['home','categories','game','over','result','info','recordsScreen','achievementsScreen'];
const names={SEL:'SELEÇÃO BRASILEIRA',CLU:'CLUBES E TÍTULOS',CRA:'CRAQUES E LENDAS',CUR:'CURIOSIDADES E REGRAS',ALL:'CAMPEONATO COMPLETO',DAILY:'DESAFIO DO DIA'};
const BASE=10,STREAK_BONUS=5,STREAK_MAX_BONUS=15,TIME=30,PER_GAME=10;
let cat='ALL',list=[],spare=[],idx=0,score=0,lives=3,correct=0,wrong=0,streak=0,bestStreak=0,time=TIME,clock=null,locked=false,audio=null,music=null,sound=true,deadline=0,remaining=TIME,helps={fifty:1,skip:1,time:1},lastResult='';
/* ---------- util ---------- */
function show(s){screens.forEach(x=>$(x).classList.toggle('active',x===s));window.scrollTo(0,0)}
function shuffle(a,rnd=Math.random){const o=a.slice();for(let i=o.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[o[i],o[j]]=[o[j],o[i]]}return o}
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function today(){const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function seeded(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19}let a=h>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
function lives_txt(){return lives>0?'⚽ '.repeat(lives).trim():'—'}
/* ---------- armazenamento ---------- */
const DEF={best:0,games:0,correct:0,answered:0,maxStreak:0,cats:{},daily:{last:'',streak:0,best:0}};
function store(){try{const s=JSON.parse(localStorage.getItem('fbStats')||'{}');return Object.assign({},DEF,s,{cats:s.cats||{},daily:Object.assign({},DEF.daily,s.daily||{})})}catch(e){return JSON.parse(JSON.stringify(DEF))}}
function write(s){try{localStorage.setItem('fbStats',JSON.stringify(s))}catch(e){}}
function save(){const s=store(),newRecord=score>s.best;s.best=Math.max(s.best,score);s.games++;s.correct+=correct;s.answered+=correct+wrong;s.maxStreak=Math.max(s.maxStreak,bestStreak);
const c=s.cats[cat]||(s.cats[cat]={best:0,games:0});c.best=Math.max(c.best,score);c.games++;
let dailyInfo=null;
if(cat==='DAILY'&&lives>0){const d=s.daily,t=today();if(d.last!==t){const y=new Date();y.setDate(y.getDate()-1);const ys=y.getFullYear()+'-'+String(y.getMonth()+1).padStart(2,'0')+'-'+String(y.getDate()).padStart(2,'0');d.streak=d.last===ys?d.streak+1:1;d.last=t}d.best=Math.max(d.best,score);dailyInfo=d}
write(s);return{stats:s,newRecord,dailyInfo}}
function records(){const s=store();$('best').textContent=s.best;$('games').textContent=s.games;$('correctTotal').textContent=s.correct;$('answered').textContent=s.answered;$('maxStreak').textContent=s.maxStreak;$('dailyStreak').textContent=s.daily.streak;
$('catRecords').innerHTML=Object.keys(names).map(k=>{const c=s.cats[k];return'<div><span>'+names[k]+'</span><b>'+(c?c.best:0)+'</b><small>'+(c?c.games:0)+' partidas</small></div>'}).join('')}
function achievements(){const s=store();const mk=(icon,name,desc,v,goal)=>({icon,name,desc,ok:v>=goal,progress:Math.min(v,goal),goal});
const items=[mk('🌱','Estreia em campo','Conclua sua primeira partida.',s.games,1),mk('📖','Titular','Conclua 5 partidas.',s.games,5),mk('🏆','Camisa 10','Conclua 20 partidas.',s.games,20),
mk('✨','Bom de bola','Acerte 10 perguntas ao todo.',s.correct,10),mk('💡','Cabeça de craque','Acerte 50 perguntas ao todo.',s.correct,50),mk('🔥','Artilheiro','Alcance 100 acertos acumulados.',s.correct,100),
mk('🥇','Golaço','Faça 120 pontos em uma partida.',s.best,120),mk('👑','Lenda do quiz','Faça 180 pontos em uma partida.',s.best,180),
mk('⚡','Hat-trick de acertos','Acerte 5 seguidas em uma partida.',s.maxStreak,5),mk('🌟','Jogo perfeito','Acerte 10 seguidas em uma partida.',s.maxStreak,10),mk('📅','Craque da rodada','Complete o Desafio do Dia 3 dias seguidos.',s.daily.streak,3)];
$('achievementList').innerHTML=items.map(a=>'<article class="achievement '+(a.ok?'unlocked':'')+'"><span class="achievement-icon">'+a.icon+'</span><div><b>'+a.name+'</b><small>'+a.desc+'</small><div class="achievement-track"><i style="width:'+(a.progress/a.goal*100)+'%"></i></div></div><strong>'+(a.ok?'DESBLOQUEADA':a.progress+'/'+a.goal)+'</strong></article>').join('')}
/* ---------- áudio ---------- */
function ctx(){audio=audio||new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();return audio}
function audioStart(){if(!sound||music)return;try{ctx();const seq=[196,246.94,293.66,246.94,220,261.63,329.63,261.63];let n=0;music=setInterval(()=>{if(!sound)return;[seq[n%8],seq[n%8]/2].forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type=i?'triangle':'sine';o.frequency.value=f;g.gain.setValueAtTime(i?.008:.018,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.65);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.66)});n++},450)}catch(e){}}
function audioStop(){clearInterval(music);music=null}
function beep(f,d=.2,type='triangle'){if(!sound)return;try{ctx();const t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.frequency.value=f;o.type=type;g.gain.setValueAtTime(.06,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(audio.destination);o.start();o.stop(t+d)}catch(e){}}
function chime(){beep(660,.18);setTimeout(()=>beep(880,.25),110)}
function buzz(){beep(180,.3,'sawtooth')}
function vibrate(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
/* ---------- jogo ---------- */
function pick(c){let pool=QUESTION_BANK.filter(q=>c==='ALL'||c==='DAILY'||q.category===c);
if(c==='DAILY'){const r=seeded('fb-'+today());const sh=shuffle(pool,r);return{list:sh.slice(0,PER_GAME),spare:sh.slice(PER_GAME)}}
const sh=shuffle(pool);return{list:sh.slice(0,PER_GAME),spare:sh.slice(PER_GAME)}}
function _startNow(c){cat=c;const p=pick(c);list=p.list;spare=p.spare;idx=0;score=0;lives=3;correct=0;wrong=0;streak=0;bestStreak=0;helps={fifty:1,skip:1,time:1};$('catlabel').textContent=names[c]||'CAMPEONATO COMPLETO';show('game');audioStart();render()}
function start(x){if(window.FGAds)FGAds.gate(function(){_startNow(x)});else _startNow(x)}
function updateHelps(){[['fifty','help50'],['skip','helpSkip'],['time','helpTime']].forEach(([k,id])=>{const b=$(id);b.disabled=locked||helps[k]<=0;b.querySelector('i').textContent=helps[k]})}
function updateStreak(){const el=$('streak');el.textContent=streak>=2?'🔥 '+streak+' seguidas':'';el.classList.toggle('on',streak>=2)}
function updateClock(){time=Math.max(0,Math.ceil((deadline-Date.now())/1000));$('time').textContent=time;$('time').parentElement.classList.toggle('urgent',time<=10);if(time<=0){clearInterval(clock);clock=null;timeout()}}
function render(){clearInterval(clock);time=TIME;remaining=TIME;locked=false;const q=list[idx];
$('score').textContent=score;$('lives').textContent=lives_txt();$('time').textContent=time;$('time').parentElement.classList.remove('urgent');
$('progress').style.width=((idx+1)/list.length*100)+'%';$('question').textContent=q.question;$('feedback').className='';$('feedback').innerHTML='';$('answers').innerHTML='';
$('questionCounter').textContent='PERGUNTA '+(idx+1)+' DE '+list.length;$('questionKind').textContent=q.type==='who'?'⚽ QUEM SOU EU?':'⚽ LANCE DA RODADA';
$('paper').classList.remove('shake');updateStreak();
shuffle(q.options).forEach((a,i)=>{const b=document.createElement('button');b.className='answer';b.dataset.value=a;b.innerHTML='<span class="key">'+(i+1)+'</span><span>'+escape(a)+'</span>';b.setAttribute('aria-label','Alternativa '+(i+1)+': '+a);b.onclick=()=>answer(a,q);$('answers').appendChild(b)});
updateHelps();deadline=Date.now()+TIME*1000;clock=setInterval(updateClock,200)}
function feedback(q,ok,reason){const box=$('feedback');
let head=ok?'⚽ GOOOL! +'+gained+' PONTOS'+(streak>=3?' · 🔥 '+streak+' seguidas':''):(reason==='timeout'?'⏱ TEMPO ESGOTADO':'🟨 CARTÃO AMARELO · ERROU');
box.innerHTML='<b>'+head+'</b><br>'+(ok?'':('Resposta correta: <b>'+escape(q.correct)+'</b>.<br>'))+escape(q.explanation)+'<br><small>Referência: '+escape(q.reference)+'</small>';
box.classList.add('show');const n=document.createElement('button');n.id='next';n.textContent=lives<=0?'Ver resultado':(idx===list.length-1?'Apito final':'Próxima pergunta →');n.onclick=next;box.appendChild(n);n.focus({preventScroll:true})}
function next(){if(lives<=0)finish(false);else if(++idx>=list.length)finish(true);else render()}
function reveal(q,chosen){document.querySelectorAll('.answer').forEach(x=>{x.disabled=true;const v=x.dataset.value;if(v===q.correct)x.classList.add('correct');else if(chosen!==null&&v===chosen)x.classList.add('wrong')});updateHelps()}
let gained=0;
function answer(a,q){if(locked)return;locked=true;clearInterval(clock);clock=null;const ok=a===q.correct;reveal(q,a);
if(ok){streak++;bestStreak=Math.max(bestStreak,streak);gained=BASE+Math.min(Math.max(streak-2,0)*STREAK_BONUS,STREAK_MAX_BONUS);score+=gained;correct++;chime();vibrate(30)}
else{streak=0;lives--;wrong++;buzz();vibrate([60,40,60]);$('paper').classList.add('shake')}
$('score').textContent=score;$('lives').textContent=lives_txt();updateStreak();feedback(q,ok,'wrong')}
function timeout(){if(locked)return;locked=true;streak=0;lives--;wrong++;const q=list[idx];reveal(q,null);buzz();$('lives').textContent=lives_txt();updateStreak();feedback(q,false,'timeout')}
/* ---------- ajudas ---------- */
function useFifty(){if(locked||helps.fifty<=0)return;helps.fifty--;const q=list[idx];const wr=[...document.querySelectorAll('.answer')].filter(b=>b.dataset.value!==q.correct);shuffle(wr).slice(0,2).forEach(b=>{b.disabled=true;b.classList.add('removed')});updateHelps();beep(520,.12)}
function useSkip(){if(locked||helps.skip<=0)return;helps.skip--;clearInterval(clock);if(spare.length){list[idx]=spare.shift()}else if(idx<list.length-1){list.push(list.splice(idx,1)[0])}render();beep(440,.12)}
function useTime(){if(locked||helps.time<=0)return;helps.time--;deadline+=10000;updateClock();updateHelps();beep(740,.12)}
/* ---------- fim ---------- */
function finish(completed){clearInterval(clock);clock=null;const saved=save();const total=list.length;
lastResult='⚽ Quiz do Futebol Brasileiro — '+(names[cat]||'')+'\n⭐ '+score+' pontos · '+correct+'/'+total+' acertos'+(bestStreak>=3?' · 🔥 '+bestStreak+' seguidas':'')+'\nConsegue me superar?';
if(completed){$('finalScore').textContent=score;$('finalStats').textContent=correct+' acertos • '+wrong+' erros • maior sequência '+bestStreak;
let line=saved.newRecord?'⭐ NOVO RECORDE PESSOAL!':'Continue buscando o título';if(saved.dailyInfo)line+=' · 📅 '+saved.dailyInfo.streak+' dia(s) seguidos no Desafio do Dia';$('recordLine').textContent=line;show('result');if(saved.newRecord)confetti();chime()}
else{$('overScore').textContent=score;$('overStats').textContent=correct+' acertos • '+wrong+' erros • maior sequência '+bestStreak;show('over')}}
function confetti(){const box=$('confetti');box.innerHTML='';if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;const cols=['#f1d99e','#d7b36b','#e4c98f','#c0583f','#8fb08a'];
for(let i=0;i<40;i++){const s=document.createElement('i');s.style.left=Math.random()*100+'%';s.style.background=cols[i%cols.length];s.style.animationDelay=Math.random()*.6+'s';s.style.animationDuration=1.6+Math.random()*1.4+'s';box.appendChild(s)}setTimeout(()=>box.innerHTML='',3500)}
async function share(){const text=lastResult+(location.protocol.startsWith('http')?'\n'+location.href:'');try{if(navigator.share){await navigator.share({text})}else{await navigator.clipboard.writeText(text);toast('Resultado copiado!')}}catch(e){}}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000)}
function ask(msg,yes){$('modalText').textContent=msg;$('modal').classList.add('show');$('modalYes').onclick=()=>{$('modal').classList.remove('show');yes()};$('modalNo').onclick=()=>$('modal').classList.remove('show');$('modalNo').focus()}
function home(){clearInterval(clock);clock=null;show('home');audioStart()}
function dailyLabel(){const d=store().daily;$('daily').querySelector('small').textContent=d.last===today()?'Já concluído hoje · sequência '+d.streak+' dia(s) · jogue de novo':(d.streak?'Sequência atual: '+d.streak+' dia(s)':'10 perguntas iguais para todos, hoje')}
/* ---------- eventos ---------- */
$('play').onclick=()=>{audioStart();show('categories')};
$('daily').onclick=()=>start('DAILY');
$('how').onclick=()=>show('info');
$('records').onclick=()=>{records();show('recordsScreen')};
$('achievements').onclick=()=>{achievements();show('achievementsScreen')};
$('openAchievements').onclick=()=>{achievements();show('achievementsScreen')};
document.querySelectorAll('[data-cat]').forEach(b=>b.onclick=()=>start(b.dataset.cat));
document.querySelectorAll('[data-home]').forEach(b=>b.onclick=()=>{home();dailyLabel()});
$('quit').onclick=()=>{ask('Sair desta partida? Seu progresso desta rodada não será salvo.',()=>{clearInterval(clock);clock=null;show('categories')})};
$('again').onclick=()=>show('categories');
$('retry').onclick=()=>start(cat);
$('clear').onclick=()=>ask('Apagar os recordes deste dispositivo?',()=>{try{localStorage.removeItem('fbStats')}catch(e){}records();dailyLabel()});
$('shareBtn').onclick=share;$('shareBtn2').onclick=share;
$('help50').onclick=useFifty;$('helpSkip').onclick=useSkip;$('helpTime').onclick=useTime;
$('sound').onclick=$('sound2').onclick=()=>{sound=!sound;document.querySelectorAll('#sound,#sound2').forEach(b=>{b.textContent=sound?'♫':'♪';b.setAttribute('aria-pressed',String(!sound))});if(sound)audioStart();else audioStop()};
document.addEventListener('keydown',e=>{if(!$('game').classList.contains('active')||$('modal').classList.contains('show'))return;
if(!locked&&/^[1-4]$/.test(e.key)){const b=document.querySelectorAll('.answer')[+e.key-1];if(b&&!b.disabled)b.click()}
else if(locked&&(e.key==='Enter'||e.key===' ')&&document.activeElement.id!=='next'){const n=$('next');if(n){e.preventDefault();n.click()}}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){audioStop();if(clock){remaining=Math.max(0,deadline-Date.now());clearInterval(clock);clock=null}}
else if($('game').classList.contains('active')&&!locked){deadline=Date.now()+remaining;clock=setInterval(updateClock,200);audioStart()}else if(sound)audioStart()});
dailyLabel();
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
