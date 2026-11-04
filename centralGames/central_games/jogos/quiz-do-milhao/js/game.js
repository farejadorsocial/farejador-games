(()=>{
const $=id=>document.getElementById(id);
const screens=['home','game','end','info','recordsScreen','achievementsScreen'];
const PRIZES=[1000,2000,3000,4000,5000,10000,20000,30000,40000,50000,100000,200000,300000,400000,500000,1000000];
const CHECK=[4,9,14];
const TIERS=[{n:5,label:'NÍVEL FÁCIL'},{n:5,label:'NÍVEL MÉDIO'},{n:6,label:'NÍVEL DIFÍCIL'}];
const L='ABCD';
let mode='NORMAL',qs=[],spare={1:[],2:[],3:[]},i=0,sel=-1,locked=false,done=false,removed=new Set(),helps={skip:3,cards:1,uni:1,crowd:1},audio=null,music=null,sound=true,lastResult='';
/* ---------- util ---------- */
const money=n=>'R$ '+n.toLocaleString('pt-BR');
const tierOf=k=>k<5?1:k<10?2:3;
const safeAt=k=>{let s=0;CHECK.forEach(c=>{if(c<k)s=PRIZES[c]});return s};
const wonAt=k=>k>0?PRIZES[k-1]:0;
function show(s){screens.forEach(x=>$(x).classList.toggle('active',x===s));window.scrollTo(0,0)}
function shuffle(a,rnd=Math.random){const o=a.slice();for(let j=o.length-1;j>0;j--){const m=Math.floor(rnd()*(j+1));[o[j],o[m]]=[o[m],o[j]]}return o}
function escape(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function dstr(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
function today(){return dstr(new Date())}
function seeded(str){let h=1779033703^str.length;for(let k=0;k<str.length;k++){h=Math.imul(h^str.charCodeAt(k),3432918353);h=h<<13|h>>>19}let a=h>>>0;return()=>{a+=0x6D2B79F5;let t=a;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
/* ---------- armazenamento ---------- */
const DEF={best:0,games:0,millions:0,correct:0,maxStreak:0,wise:0,daily:{last:'',streak:0,best:0}};
function store(){try{const s=JSON.parse(localStorage.getItem('qmStats')||'{}');return Object.assign({},DEF,s,{daily:Object.assign({},DEF.daily,s.daily||{})})}catch(e){return JSON.parse(JSON.stringify(DEF))}}
function write(s){try{localStorage.setItem('qmStats',JSON.stringify(s))}catch(e){}}
function save(prize,kind,answered){const s=store(),newRecord=prize>s.best;s.best=Math.max(s.best,prize);s.games++;s.correct+=answered;s.maxStreak=Math.max(s.maxStreak,answered);if(kind==='win')s.millions++;if(kind==='stop'&&prize>=100000)s.wise++;
let dailyInfo=null;if(mode==='DAILY'){const d=s.daily,t=today();if(d.last!==t){const y=new Date();y.setDate(y.getDate()-1);d.streak=d.last===dstr(y)?d.streak+1:1;d.last=t}d.best=Math.max(d.best,prize);dailyInfo=d}
write(s);return{newRecord,dailyInfo}}
function records(){const s=store();$('best').textContent=money(s.best);$('games').textContent=s.games;$('millions').textContent=s.millions;$('correctTotal').textContent=s.correct;$('maxStreak').textContent=s.maxStreak;$('dailyStreak').textContent=s.daily.streak}
function achievements(){const s=store();const mk=(icon,name,desc,v,goal,fmt)=>({icon,name,desc,ok:v>=goal,progress:Math.min(v,goal),goal,fmt});
const items=[mk('🎬','Primeira rodada','Conclua sua primeira partida.',s.games,1),mk('🎓','Candidato','Conclua 10 partidas.',s.games,10),
mk('🥉','Primeiro marco','Chegue a R$ 5.000.',s.best,5000,money),mk('🥈','Meio caminho','Chegue a R$ 50.000.',s.best,50000,money),mk('🥇','Quase lá','Chegue a R$ 500.000.',s.best,500000,money),
mk('👑','Milionário','Responda as 16 perguntas e leve R$ 1.000.000.',s.millions,1),
mk('🧠','Cabeça boa','Acerte 50 perguntas ao todo.',s.correct,50),mk('📚','Sabe-tudo','Acerte 150 perguntas ao todo.',s.correct,150),
mk('🔥','Em alta','Acerte 10 perguntas seguidas em uma partida.',s.maxStreak,10),mk('✋','Parou na hora certa','Pare com R$ 100.000 ou mais, 1 vez.',s.wise,1),mk('📅','Fiel ao dia','Complete o Desafio do Dia 3 dias seguidos.',s.daily.streak,3)];
$('achievementList').innerHTML=items.map(a=>'<article class="achievement '+(a.ok?'unlocked':'')+'"><span class="achievement-icon">'+a.icon+'</span><div><b>'+a.name+'</b><small>'+a.desc+'</small><div class="achievement-track"><i style="width:'+(a.progress/a.goal*100)+'%"></i></div></div><strong>'+(a.ok?'CONQUISTADA':(a.fmt?a.fmt(a.progress):a.progress)+'/'+(a.fmt?a.fmt(a.goal):a.goal))+'</strong></article>').join('')}
/* ---------- áudio ---------- */
function ctx(){audio=audio||new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();return audio}
function audioStart(){if(!sound||music)return;try{ctx();const seq=[196,246.94,293.66,246.94,220,277.18,329.63,277.18];let n=0;music=setInterval(()=>{if(!sound)return;[seq[n%8],seq[n%8]/2].forEach((f,k)=>{const o=audio.createOscillator(),g=audio.createGain();o.type=k?'triangle':'sine';o.frequency.value=f;g.gain.setValueAtTime(k?.008:.016,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.5);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+.52)});n++},520)}catch(e){}}
function audioStop(){clearInterval(music);music=null}
function beep(f,d=.2,type='triangle',v=.06){if(!sound)return;try{ctx();const t=audio.currentTime,o=audio.createOscillator(),g=audio.createGain();o.frequency.value=f;o.type=type;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(audio.destination);o.start();o.stop(t+d)}catch(e){}}
const win=()=>[523,659,784,1047].forEach((f,k)=>setTimeout(()=>beep(f,.25),k*110));
const lose=()=>[220,185,155].forEach((f,k)=>setTimeout(()=>beep(f,.35,'sawtooth'),k*220));
const tick=()=>beep(300,.08,'square',.025);
function vibrate(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
/* ---------- partida ---------- */
function pick(m){const rnd=m==='DAILY'?seeded('qm-'+today()):Math.random;const out=[],sp={};
[1,2,3].forEach(t=>{const pool=shuffle(QUESTION_BANK.filter(q=>q.tier===t).map(q=>({...q,shown:null})),rnd);const n=TIERS[t-1].n;out.push(...pool.slice(0,n));sp[t]=pool.slice(n)});return{qs:out,spare:sp}}
function start(m){mode=m;const p=pick(m);qs=p.qs;spare=p.spare;i=0;helps={skip:3,cards:1,uni:1,crowd:1};done=false;$('catlabel').textContent=m==='DAILY'?'DESAFIO DO DIA':TIERS[0].label;show('game');audioStart();buildDots();render()}
function buildDots(){$('dots').innerHTML=PRIZES.map((p,k)=>'<i class="'+(CHECK.includes(k)?'check':'')+'"></i>').join('')}
function updatePrizes(){$('pNow').textContent=money(PRIZES[i]);$('pLose').textContent=money(safeAt(i));$('pStop').textContent=money(wonAt(i));
[...$('dots').children].forEach((d,k)=>{d.className=(CHECK.includes(k)?'check ':'')+(k<i?'done':k===i?'now':'')})}
function updateHelps(){const dis=locked||done;[['hSkip','skip'],['hCards','cards'],['hUni','uni'],['hCrowd','crowd']].forEach(([id,k])=>{const b=$(id);b.querySelector('i').textContent=helps[k];b.disabled=dis||helps[k]<=0})}
function render(){const q=qs[i];locked=false;sel=-1;removed=new Set();
$('qNum').textContent='PERGUNTA '+(i+1)+' DE 16 · '+money(PRIZES[i]);$('qCat').textContent=q.category;$('question').textContent=q.question;
$('catlabel').textContent=mode==='DAILY'?'DESAFIO DO DIA · '+['FÁCIL','MÉDIO','DIFÍCIL'][tierOf(i)-1]:TIERS[tierOf(i)-1].label;
$('paper').classList.remove('shake');$('helpbox').innerHTML='';$('helpbox').className='';$('feedback').className='';$('feedback').innerHTML='';
const c=$('confirm');c.disabled=true;c.textContent='ESCOLHA UMA ALTERNATIVA';c.style.display='';
$('answers').innerHTML='';
q.shown=q.shown||shuffle(q.options);
q.shown.forEach((a,k)=>{const b=document.createElement('button');b.className='answer';b.dataset.value=a;b.dataset.idx=k;b.innerHTML='<span class="key">'+L[k]+'</span><span>'+escape(a)+'</span>';b.setAttribute('aria-label','Alternativa '+L[k]+': '+a);b.onclick=()=>choose(k);$('answers').appendChild(b)});
updatePrizes();updateHelps()}
function choose(k){if(locked||removed.has(k))return;sel=k;document.querySelectorAll('.answer').forEach((b,n)=>b.classList.toggle('selected',n===k));const c=$('confirm');c.disabled=false;c.textContent='CONFIRMAR: '+L[k]+' · '+qs[i].shown[k];beep(500,.06,'triangle',.03)}
function confirmAnswer(){if(locked||sel<0||done)return;locked=true;updateHelps();$('confirm').disabled=true;$('confirm').textContent='VERIFICANDO…';
let n=0;const iv=setInterval(()=>{tick();if(++n>=3){clearInterval(iv);resolve()}},330)}
function resolve(){const q=qs[i],chosen=qs[i].shown[sel];const ok=chosen===q.correct;
document.querySelectorAll('.answer').forEach(b=>{b.disabled=true;b.classList.remove('selected');if(b.dataset.value===q.correct)b.classList.add('correct');else if(b.dataset.value===chosen)b.classList.add('wrong')});
$('confirm').style.display='none';const box=$('feedback');box.classList.add('show');
if(ok){win();vibrate(40);const last=i===15;
box.innerHTML='<b>✅ RESPOSTA CERTA! Você tem '+money(PRIZES[i])+'.</b>'+(CHECK.includes(i)?'<br>🔒 Marco garantido: '+money(PRIZES[i])+'.':'')+'<br>'+escape(q.explanation);
addNext(last?'Ver meu prêmio →':'Próxima pergunta →',()=>{if(last)finish('win');else{i++;render()}})}
else{lose();vibrate([80,40,80]);$('paper').classList.add('shake');
box.innerHTML='<b>❌ RESPOSTA ERRADA</b><br>A resposta certa era: <b>'+escape(q.correct)+'</b>.<br>'+escape(q.explanation)+'<br>Você leva '+money(safeAt(i))+'.';
addNext('Ver resultado →',()=>finish('wrong'))}}
function addNext(txt,fn){const n=document.createElement('button');n.id='next';n.textContent=txt;n.onclick=fn;$('feedback').appendChild(n);n.focus({preventScroll:true})}
/* ---------- ajudas ---------- */
function avail(){return[...document.querySelectorAll('.answer')].map((b,k)=>k).filter(k=>!removed.has(k))}
function note(html){$('helpbox').className='show';$('helpbox').innerHTML=html}
function helpSkip(){if(locked||done||helps.skip<=0)return;const t=tierOf(i),n=spare[t].shift();if(!n){toast('Sem perguntas reservas neste nível');return}helps.skip--;qs[i]=n;render();note('⤼ Pergunta pulada. Restam '+helps.skip+' pulos.');beep(440,.12)}
function helpCards(){if(locked||done||helps.cards<=0)return;helps.cards--;const q=qs[i];const wrong=avail().filter(k=>q.shown[k]!==q.correct);const n=Math.min(ri(1,3),wrong.length);shuffle(wrong).slice(0,n).forEach(k=>{removed.add(k);const b=document.querySelectorAll('.answer')[k];b.disabled=true;b.classList.add('removed');if(sel===k){sel=-1;$('confirm').disabled=true;$('confirm').textContent='ESCOLHA UMA ALTERNATIVA'}});
note('🃏 Carta sorteada: <b>'+n+'</b> '+(n===1?'alternativa errada eliminada':'alternativas erradas eliminadas')+'.');updateHelps();beep(620,.15)}
function helpUni(){if(locked||done||helps.uni<=0)return;helps.uni--;const q=qs[i],t=tierOf(i),p=[.92,.78,.62][t-1];const av=avail();const wrong=av.filter(k=>q.shown[k]!==q.correct),right=av.find(k=>q.shown[k]===q.correct);
const lines=[1,2,3].map(n=>{const sure=Math.random()<p;const k=sure||!wrong.length?right:wrong[ri(0,wrong.length-1)];const c=sure?ri(60,95):ri(35,60);return'Universitário '+n+': "Acho que é a <b>'+L[k]+'</b> ('+c+'% de certeza)"'});
note('🎓 '+lines.join('<br>🎓 '));updateHelps();beep(600,.15)}
function helpCrowd(){if(locked||done||helps.crowd<=0)return;helps.crowd--;const q=qs[i],t=tierOf(i);const av=avail();const w={};
const base=[72,52,38][t-1]+ri(-8,8);av.forEach(k=>{w[k]=q.shown[k]===q.correct?base:ri(6,30)});
if(Math.random()<[0,.08,.2][t-1]){const wr=av.filter(k=>q.shown[k]!==q.correct);if(wr.length){const k=wr[ri(0,wr.length-1)];w[k]=base+ri(5,15)}}
const sum=av.reduce((a,k)=>a+w[k],0);let tot=0;const pc={};av.forEach((k,n)=>{pc[k]=n===av.length-1?100-tot:Math.round(w[k]/sum*100);tot+=pc[k]});
note('👥 Votação da plateia:'+[0,1,2,3].map(k=>removed.has(k)?'':'<div class="bar"><span>'+L[k]+'</span><i style="width:'+pc[k]+'%"></i><em>'+pc[k]+'%</em></div>').join(''));updateHelps();beep(560,.15)}
/* ---------- fim ---------- */
function stopGame(){if(locked||done)return;const v=wonAt(i);ask(i===0?'Sair sem nenhum prêmio?':'Parar agora e levar '+money(v)+'?',()=>finish('stop'))}
function finish(kind){done=true;const answered=kind==='win'?16:i;const prize=kind==='win'?PRIZES[15]:kind==='stop'?wonAt(i):safeAt(i);
const saved=save(prize,kind,answered);
const T={win:['👑','PARABÉNS, MILIONÁRIO!','Você <em>zerou</em><br>o jogo!','SEU PRÊMIO'],stop:['✋','VOCÊ PAROU A TEMPO','Você levou<br><em>para casa</em>','SEU PRÊMIO'],wrong:['😬','FIM DE JOGO','Não foi<br><em>desta vez</em>','VOCÊ LEVA']}[kind];
$('endIcon').textContent=T[0];$('endLabel').textContent=T[1];$('endTitle').innerHTML=T[2];$('endCaption').textContent=T[3];$('endPrize').textContent=money(prize);
$('endStats').textContent=answered+' acerto(s) em 16 perguntas';let line=saved.newRecord&&prize>0?'⭐ NOVO RECORDE PESSOAL!':'Tente chegar mais longe!';if(saved.dailyInfo)line+=' · 📅 '+saved.dailyInfo.streak+' dia(s) seguidos';$('recordLine').textContent=line;
lastResult='💰 Quiz do Milhão — '+(kind==='win'?'Levei R$ 1.000.000!':'Levei '+money(prize))+'\n✅ '+answered+' de 16 perguntas\nConsegue chegar mais longe?';
show('end');if(kind==='win'||(saved.newRecord&&prize>=5000))confetti()}
function confetti(){const box=$('confetti');box.innerHTML='';if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;const cols=['#ffd23a','#fff3a8','#ffffff','#3d7bff','#41c36b'];
for(let k=0;k<44;k++){const s=document.createElement('i');s.style.left=Math.random()*100+'%';s.style.background=cols[k%cols.length];s.style.animationDelay=Math.random()*.6+'s';s.style.animationDuration=1.6+Math.random()*1.4+'s';box.appendChild(s)}setTimeout(()=>box.innerHTML='',3500)}
async function share(){const text=lastResult+(location.protocol.startsWith('http')?'\n'+location.href:'');try{if(navigator.share){await navigator.share({text})}else{await navigator.clipboard.writeText(text);toast('Resultado copiado!')}}catch(e){}}
function toast(m){const t=$('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000)}
function ask(msg,yes){$('modalText').textContent=msg;$('modal').classList.add('show');$('modalYes').onclick=()=>{$('modal').classList.remove('show');yes()};$('modalNo').onclick=()=>$('modal').classList.remove('show');$('modalNo').focus()}
function showLadder(){$('ladderList').innerHTML=PRIZES.map((p,k)=>'<li class="'+(CHECK.includes(k)?'check ':'')+(k<i?'done ':'')+(k===i&&!done?'now':'')+'"><span>'+(k+1)+'</span><b>'+money(p)+'</b>'+(CHECK.includes(k)?'<em>🔒 marco</em>':'')+'</li>').reverse().join('');$('ladderModal').classList.add('show');$('ladderClose').focus()}
function home(){show('home');audioStart();dailyLabel()}
function dailyLabel(){const d=store().daily;$('daily').querySelector('small').textContent=d.last===today()?'Já feito hoje · sequência '+d.streak+' dia(s) · jogue de novo':(d.streak?'Sequência atual: '+d.streak+' dia(s)':'As mesmas perguntas para todos, hoje')}
/* ---------- eventos ---------- */
$('play').onclick=()=>start('NORMAL');$('again').onclick=()=>start(mode);$('daily').onclick=()=>start('DAILY');
$('how').onclick=()=>show('info');
$('records').onclick=()=>{records();show('recordsScreen')};
$('achievements').onclick=$('openAchievements').onclick=()=>{achievements();show('achievementsScreen')};
document.querySelectorAll('[data-home]').forEach(b=>b.onclick=home);
$('stop').onclick=stopGame;$('confirm').onclick=confirmAnswer;
$('ladderBtn').onclick=showLadder;$('ladderClose').onclick=()=>$('ladderModal').classList.remove('show');
$('hSkip').onclick=helpSkip;$('hCards').onclick=helpCards;$('hUni').onclick=helpUni;$('hCrowd').onclick=helpCrowd;
$('clear').onclick=()=>ask('Apagar os recordes deste dispositivo?',()=>{try{localStorage.removeItem('qmStats')}catch(e){}records();dailyLabel()});
$('shareBtn').onclick=share;
$('sound').onclick=()=>{sound=!sound;$('sound').textContent=sound?'♫':'♪';$('sound').setAttribute('aria-pressed',String(!sound));if(sound)audioStart();else audioStop()};
document.addEventListener('keydown',e=>{if(!$('game').classList.contains('active')||document.querySelector('.modal.show'))return;
const k='abcd'.indexOf(e.key.toLowerCase());
if(!locked&&!done&&(k>-1||/^[1-4]$/.test(e.key))){choose(k>-1?k:+e.key-1)}
else if(e.key==='Enter'){const n=$('next');if(n&&document.activeElement!==n){e.preventDefault();n.click()}else if(!n&&!locked&&sel>-1&&document.activeElement!==$('confirm')){e.preventDefault();confirmAnswer()}}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)audioStop();else if(sound)audioStart()});
dailyLabel();
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
