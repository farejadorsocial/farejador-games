const games=[
{id:"desafio-biblico",title:"Desafio Bíblico",category:"Bíblia",emoji:"📖",theme:"bib",label:"Fé e conhecimento",
 description:"Histórias, personagens e versículos das Escrituras, com versículo do dia e explicações em cada resposta.",
 meta:["216 perguntas","4 categorias","Versículo do dia"],url:"jogos/quiz-desafio-biblico/index.html",key:"dbStats",fmt:s=>s.best+" pts"},
{id:"bandeiras-capitais",title:"Bandeiras e Capitais",category:"Geografia",emoji:"🌍",theme:"geo",label:"Volta ao mundo",
 description:"Descubra de qual país é cada bandeira e qual é a capital. Perguntas geradas na hora, para jogar sem repetir.",
 meta:["123 países","Bandeiras e capitais","Por continente"],url:"jogos/quiz-bandeiras-capitais/index.html",key:"bcStats",fmt:s=>s.best+" pts"},
{id:"quiz-milhao",title:"Quiz do Milhão",category:"Conhecimentos",emoji:"💰",theme:"mil",label:"Suba a escada",
 description:"16 perguntas de conhecimentos gerais, marcos de segurança e ajudas. Você para ou arrisca tudo?",
 meta:["16 degraus","Ajudas","Até R$ 1.000.000"],url:"jogos/quiz-do-milhao/index.html",key:"qmStats",fmt:s=>"R$ "+Number(s.best).toLocaleString("pt-BR")},
{id:"futebol-brasileiro",title:"Futebol Brasileiro",category:"Esportes",emoji:"⚽",theme:"fut",label:"Paixão nacional",
 description:"Seleção, clubes, craques e curiosidades. Inclui o modo “Quem sou eu?” e muita rivalidade saudável.",
 meta:["158 perguntas","4 categorias","Quem sou eu?"],url:"jogos/quiz-futebol-brasileiro/index.html",key:"fbStats",fmt:s=>s.best+" pts"}
];
const $=s=>document.querySelector(s);
const grid=$("#gameGrid"),search=$("#search"),count=$("#gameCount");
let filter="Todos";
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function record(g){try{const s=JSON.parse(localStorage.getItem(g.key)||"null");return s&&s.best>0?g.fmt(s):null}catch(e){return null}}
const dayIndex=()=>{const d=new Date();return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/864e5)%games.length};
function render(){
 const q=search.value.trim().toLocaleLowerCase("pt-BR");
 const featured=games[dayIndex()].id;
 const list=games.filter(g=>(filter==="Todos"||g.category===filter)&&(g.title+" "+g.description+" "+g.category+" "+g.meta.join(" ")).toLocaleLowerCase("pt-BR").includes(q));
 count.textContent=list.length===1?"1 jogo":list.length+" jogos";
 grid.innerHTML=list.length?list.map(g=>{const rec=record(g);return`<article class="game-card t-${g.theme}">
  <a class="cover" href="${g.url}" aria-label="Jogar ${esc(g.title)}">
   <span class="tag">${esc(g.label)}</span>${g.id===featured?'<span class="ribbon">★ Destaque do dia</span>':''}
   <span class="emoji" aria-hidden="true">${g.emoji}</span>
  </a>
  <div class="body">
   <span class="cat">${esc(g.category)}</span>
   <h3>${esc(g.title)}</h3>
   <p>${esc(g.description)}</p>
   <ul class="meta">${g.meta.map(m=>"<li>"+esc(m)+"</li>").join("")}</ul>
   <div class="foot"><span class="rec">${rec?"🏆 Seu recorde: <b>"+esc(rec)+"</b>":"Ainda sem recorde"}</span><a class="play" href="${g.url}">Jogar <span aria-hidden="true">→</span></a></div>
  </div></article>`}).join(""):'<div class="empty">Nenhum jogo encontrado. Tente outra busca.</div>';
}
document.querySelectorAll(".chip").forEach(b=>b.addEventListener("click",()=>{
 document.querySelector(".chip.active")?.classList.remove("active");b.classList.add("active");filter=b.dataset.filter;render();
}));
search.addEventListener("input",render);
$("#statGames").textContent=games.length;
render();
window.addEventListener("pageshow",render);
