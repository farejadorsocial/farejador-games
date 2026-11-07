const games=[
{id:"desafio-biblico",title:"Desafio Bíblico",category:"Bíblia",emoji:"📖",theme:"bib",label:"Fé e conhecimento",
 description:"Histórias, personagens e versículos das Escrituras, com versículo do dia e explicações em cada resposta.",
 meta:["216 perguntas","4 categorias","Versículo do dia"],url:"jogos/quiz-desafio-biblico/index.html",guide:"quizzes/desafio-biblico.html",key:"dbStats",fmt:s=>s.best+" pts"},
{id:"bandeiras-capitais",title:"Bandeiras e Capitais",category:"Geografia",emoji:"🌍",theme:"geo",label:"Volta ao mundo",
 description:"Descubra de qual país é cada bandeira e qual é a capital. Perguntas geradas na hora, para jogar sem repetir.",
 meta:["123 países","Bandeiras e capitais","Por continente"],url:"jogos/quiz-bandeiras-capitais/index.html",guide:"quizzes/bandeiras-capitais.html",key:"bcStats",fmt:s=>s.best+" pts"},
{id:"quiz-milhao",title:"Quiz do Milhão",category:"Conhecimentos",emoji:"💰",theme:"mil",label:"Suba a escada",
 description:"16 perguntas de conhecimentos gerais, marcos de segurança e ajudas. Você para ou arrisca tudo?",
 meta:["16 degraus","Ajudas","Até R$ 1.000.000"],url:"jogos/quiz-do-milhao/index.html",guide:"quizzes/quiz-do-milhao.html",key:"qmStats",fmt:s=>"R$ "+Number(s.best).toLocaleString("pt-BR")},
{id:"futebol-brasileiro",title:"Futebol Brasileiro",category:"Esportes",emoji:"⚽",theme:"fut",label:"Paixão nacional",
 description:"Seleção, clubes, craques e curiosidades. Inclui o modo “Quem sou eu?” e muita rivalidade saudável.",
 meta:["158 perguntas","4 categorias","Quem sou eu?"],url:"jogos/quiz-futebol-brasileiro/index.html",guide:"quizzes/futebol-brasileiro.html",key:"fbStats",fmt:s=>s.best+" pts"},
{id:"historia-do-brasil",title:"História do Brasil",category:"História",emoji:"📜",theme:"his",label:"Viagem no tempo",
 description:"Colônia, Império, República e o Brasil de hoje. Datas, personagens e fatos que fizeram o país, com explicação em cada resposta.",
 meta:["204 perguntas", "4 épocas", "Linha do tempo"],url:"jogos/quiz-historia-do-brasil/index.html",guide:"quizzes/historia-do-brasil.html",key:"hbStats",fmt:s=>s.best+" pts"},
{id:"geografia-do-brasil",title:"Geografia do Brasil",category:"Geografia",emoji:"🗺️",theme:"gbr",label:"Do Oiapoque ao Chuí",
 description:"Estados e capitais, regiões, rios, biomas, cidades e comidas típicas. Uma viagem por todo o país em perguntas.",
 meta:["201 perguntas", "27 unidades", "4 temas"],url:"jogos/quiz-geografia-do-brasil/index.html",guide:"quizzes/geografia-do-brasil.html",key:"gbStats",fmt:s=>s.best+" pts"},
{id:"ciencias-corpo-humano",title:"Ciências e Corpo Humano",category:"Ciências",emoji:"🔬",theme:"cie",label:"Laboratório",
 description:"Corpo humano, animais e plantas, espaço e química do dia a dia. Perguntas curiosas com explicação para aprender de verdade.",
 meta:["205 perguntas", "4 áreas", "Corpo humano"],url:"jogos/quiz-ciencias-corpo-humano/index.html",guide:"quizzes/ciencias-corpo-humano.html",key:"ccStats",fmt:s=>s.best+" pts"},
{id:"cultura-pop-br",title:"Novelas e Cultura Pop BR",category:"Cultura Pop",emoji:"📺",theme:"pop",label:"Tá no ar",
 description:"Novelas, música brasileira, programas de TV, cinema, livros e folclore. Vilãs famosas, bordões e clássicos que marcaram o Brasil.",
 meta:["201 perguntas", "4 temas", "Novelas e música"],url:"jogos/quiz-cultura-pop-br/index.html",guide:"quizzes/cultura-pop-br.html",key:"cpStats",fmt:s=>s.best+" pts"}
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
   <a class="guide" href="${g.guide}">Guia e regras do quiz</a>
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
