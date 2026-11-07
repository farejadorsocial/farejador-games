/* Farejador Games — cartão de resultado para compartilhar (WhatsApp, Instagram etc.)
   Uso nos jogos:
     FGShare.prepare({score:'120', label:'MINHA PONTUAÇÃO', unit:'pts', cat:'Seleção', ok:8, total:10, streak:4, stars:4})
     FGShare.share(texto)   // no clique do botão "Compartilhar resultado"
   O tema do cartão é escolhido pela pasta do jogo (jogos/<pasta>/). */
(function(){
'use strict';
var W=1080,H=1350;

/* ---------- utilidades de desenho ---------- */
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function lin(c,x0,y0,x1,y1,stops){var g=c.createLinearGradient(x0,y0,x1,y1);stops.forEach(function(s){g.addColorStop(s[0],s[1])});return g}
function rad(c,x,y,r0,r1,stops){var g=c.createRadialGradient(x,y,r0,x,y,r1);stops.forEach(function(s){g.addColorStop(s[0],s[1])});return g}
function rays(c,cx,cy,n,color,len){c.save();c.fillStyle=color;for(var i=0;i<n;i++){var a=i*2*Math.PI/n,b=a+Math.PI/n*.55;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*len,cy+Math.sin(a)*len);c.lineTo(cx+Math.cos(b)*len,cy+Math.sin(b)*len);c.closePath();c.fill()}c.restore()}
function lines(c,cx,cy,n,color,len,wid){c.save();c.strokeStyle=color;c.lineWidth=wid;for(var i=0;i<n;i++){var a=i*2*Math.PI/n;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*len,cy+Math.sin(a)*len);c.stroke()}c.restore()}
function grid(c,step,color,wid){c.save();c.strokeStyle=color;c.lineWidth=wid;c.beginPath();for(var x=0;x<=W;x+=step){c.moveTo(x+.5,0);c.lineTo(x+.5,H)}for(var y=0;y<=H;y+=step){c.moveTo(0,y+.5);c.lineTo(W,y+.5)}c.stroke();c.restore()}
function rings(c,cx,cy,rx,ry,gap,n,color,wid){c.save();c.strokeStyle=color;c.lineWidth=wid;for(var i=1;i<=n;i++){c.beginPath();c.ellipse(cx,cy,rx*i*gap/100,ry*i*gap/100,-.25,0,2*Math.PI);c.stroke()}c.restore()}
function fit(c,text,font,size,max,weight){var s=size;do{c.font=(weight||'700')+' '+s+'px '+font;if(c.measureText(text).width<=max)break;s-=2}while(s>14);return s}
function spaced(c,v){try{c.letterSpacing=v}catch(e){}}
function star(c,cx,cy,r,fill,stroke){c.save();c.beginPath();for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rad=i%2?r*.45:r;c.lineTo(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad)}c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.lineWidth=3;c.strokeStyle=stroke;c.stroke()}c.restore()}

/* ---------- temas ---------- */
var T={
 bib:{emoji:'📖',kicker:'UMA JORNADA PELAS ESCRITURAS',title:'Desafio Bíblico',fh:"'Cinzel',serif",fb:"'DM Sans',sans-serif",fn:"'Playfair Display',serif",fc:"'Playfair Display',serif",ctaStyle:'italic 600',
  ink:'#1d2f6e',soft:'#5a6a9a',num:'#b8860b',cta:'#1d2f6e',top:'#1d2f6e',chipBg:'#1d2f6e',chipTxt:'#ffe9a8',pill:'#d9b45a',starOff:'#e6dcc0',
  bg:function(c){c.fillStyle=lin(c,0,0,0,H,[[0,'#8fc6ff'],[.55,'#dcefff'],[1,'#fff8e6']]);c.fillRect(0,0,W,H);rays(c,W/2,-60,28,'#ffffff40',1700);c.fillStyle=rad(c,W/2,-40,0,700,[[0,'#ffffffcc'],[1,'#ffffff00']]);c.fillRect(0,0,W,H)},
  card:function(c,x,y,w,h){c.save();c.shadowColor='#1d2f6e33';c.shadowBlur=40;c.shadowOffsetY=14;rr(c,x,y,w,h,30);c.fillStyle=lin(c,0,y,0,y+h,[[0,'#fffdf6'],[1,'#fff4d6']]);c.fill();c.restore();rr(c,x,y,w,h,30);c.lineWidth=5;c.strokeStyle='#e0b23a';c.stroke();rr(c,x+16,y+16,w-32,h-32,20);c.lineWidth=1.5;c.strokeStyle='#e0b23a99';c.stroke()}},
 bc:{emoji:'🌍',kicker:'DÊ A VOLTA AO MUNDO',title:'Bandeiras e Capitais',fh:"'Oswald',sans-serif",fb:"'DM Sans',sans-serif",fn:"'Oswald',sans-serif",fc:"'Oswald',sans-serif",ctaStyle:'600',
  ink:'#0b3d4f',soft:'#4a7584',num:'#0f8fb0',cta:'#0f8fb0',top:'#ffffff',chipBg:'#0b3d4f',chipTxt:'#ffe066',pill:'#9fd9e8',starOff:'#d5ecf3',
  bg:function(c){c.fillStyle=lin(c,0,0,W,H,[[0,'#5fd0e8'],[.6,'#139ac0'],[1,'#0b5f78']]);c.fillRect(0,0,W,H);grid(c,54,'#ffffff1f',2)},
  card:function(c,x,y,w,h){c.save();c.shadowColor='#0b3d4f55';c.shadowBlur=0;c.shadowOffsetY=12;rr(c,x,y,w,h,36);c.fillStyle='#ffffff';c.fill();c.restore();rr(c,x,y,w,h,36);c.lineWidth=7;c.strokeStyle='#ffd23a';c.stroke()}},
 qm:{emoji:'💰',kicker:'CONHECIMENTOS GERAIS',title:'Quiz do Milhão',fh:"'Oswald',sans-serif",fb:"'DM Sans',sans-serif",fn:"'Oswald',sans-serif",fc:"'Oswald',sans-serif",ctaStyle:'600',
  ink:'#ffffff',soft:'#b9cbff',num:'#ffd23a',cta:'#ffd23a',top:'#ffffff',chipBg:'#ffd23a',chipTxt:'#16358f',pill:'#ffd23a88',starOff:'#ffffff30',
  bg:function(c){c.fillStyle=lin(c,0,0,0,H,[[0,'#3d7bff'],[1,'#16358f']]);c.fillRect(0,0,W,H);rays(c,W/2,H*.42,24,'#ffffff12',1600)},
  card:function(c,x,y,w,h){c.save();c.shadowColor='#0008';c.shadowBlur=40;c.shadowOffsetY=16;rr(c,x,y,w,h,40);c.fillStyle=rad(c,x+w/2,y+h*.35,40,w*.8,[[0,'#2452c9'],[1,'#0f2463']]);c.fill();c.restore();rr(c,x,y,w,h,40);c.lineWidth=9;c.strokeStyle='#ffd23a';c.stroke();rr(c,x+20,y+20,w-40,h-40,26);c.lineWidth=2;c.strokeStyle='#ffd23a55';c.stroke()}},
 fb:{emoji:'⚽',kicker:'O JOGO DA PAIXÃO NACIONAL',title:'Quiz do Futebol',fh:"'Oswald',sans-serif",fb:"'DM Sans',sans-serif",fn:"'Oswald',sans-serif",fc:"'Oswald',sans-serif",ctaStyle:'600',
  ink:'#0f3a1f',soft:'#3b6b48',num:'#1e8a42',cta:'#1e8a42',top:'#ffffff',chipBg:'#0f5c2a',chipTxt:'#ffe14d',pill:'#b8d9bf',starOff:'#dcefe0',
  bg:function(c){for(var y=0;y<H;y+=90){c.fillStyle=(y/90)%2?'#4fbd70':'#5ecb7e';c.fillRect(0,y,W,90)}c.strokeStyle='#ffffff66';c.lineWidth=5;c.beginPath();c.arc(W/2,H/2,260,0,2*Math.PI);c.moveTo(0,H/2);c.lineTo(W,H/2);c.stroke();c.fillStyle='#009739';c.fillRect(0,0,W/3,14);c.fillStyle='#ffdf00';c.fillRect(W/3,0,W/3,14);c.fillStyle='#002776';c.fillRect(2*W/3,0,W/3,14)},
  card:function(c,x,y,w,h){c.save();c.shadowColor='#0a3d1c66';c.shadowOffsetY=14;rr(c,x,y,w,h,34);c.fillStyle='#ffffff';c.fill();c.restore();c.save();rr(c,x,y,w,h,34);c.clip();c.fillStyle='#ffdf00';c.fillRect(x,y,w,22);c.restore()}},
 hb:{emoji:'📜',kicker:'A NOSSA HISTÓRIA',title:'Quiz de História do Brasil',fh:"'Cinzel',serif",fb:"'EB Garamond',serif",fn:"'Cinzel',serif",fc:"'EB Garamond',serif",ctaStyle:'italic 600',
  ink:'#3b2412',soft:'#6e5a43',num:'#93201a',cta:'#93201a',top:'#e9c77a',chipBg:'#2a170a',chipTxt:'#e9c77a',pill:'#c9a865',starOff:'#e0cfa4',
  bg:function(c){c.fillStyle=rad(c,W/2,H*.2,0,H,[[0,'#6e4422'],[.5,'#3e2511'],[1,'#1c0f06']]);c.fillRect(0,0,W,H);lines(c,W*.88,H*.1,32,'#e8c77a1c',2000,2);lines(c,W*.06,H*.9,32,'#e8c77a14',2000,2)},
  card:function(c,x,y,w,h){c.save();c.shadowColor='#000a';c.shadowBlur=40;c.shadowOffsetY=16;rr(c,x,y,w,h,6);c.fillStyle=rad(c,x+w*.25,y+h*.15,20,w*1.1,[[0,'#fdf5df'],[.55,'#f2e2b9'],[1,'#dfc48a']]);c.fill();c.restore();c.lineWidth=2;c.strokeStyle='#a07a3a';rr(c,x,y,w,h,6);c.stroke();c.strokeStyle='#a07a3a99';c.lineWidth=2;rr(c,x+18,y+18,w-36,h-36,2);c.stroke();rr(c,x+26,y+26,w-52,h-52,2);c.stroke()}},
 gb:{emoji:'🗺️',kicker:'DO OIAPOQUE AO CHUÍ',title:'Geografia do Brasil',fh:"'Josefin Sans',sans-serif",fb:"'Nunito',sans-serif",fn:"'Josefin Sans',sans-serif",fc:"'Nunito',sans-serif",ctaStyle:'800',
  ink:'#123a40',soft:'#4f6b6d',num:'#e8693c',cta:'#e8693c',top:'#ffffff',chipBg:'#123a40',chipTxt:'#ffe7a6',pill:'#e8693c66',starOff:'#ecdfc0',
  bg:function(c){c.fillStyle=lin(c,0,0,W*.3,H,[[0,'#7fd6d2'],[.55,'#35a9b3'],[1,'#1b7f8f']]);c.fillRect(0,0,W,H);rings(c,W*.12,H*.2,100,75,46,30,'#ffffff30',3);rings(c,W*.92,H*.82,95,70,52,26,'#ffffff26',3);grid(c,144,'#ffffff18',2)},
  card:function(c,x,y,w,h){c.save();c.shadowColor='#0b4f5855';c.shadowOffsetY=16;c.fillStyle='#fffaf0';c.fillRect(x,y,w,h);c.restore();c.save();c.beginPath();c.rect(x,y,w,h);c.rect(x+18,y+18,w-36,h-36);c.clip('evenodd');var cols=['#e8693c','#fffaf0','#0e7c86','#fffaf0'],s=22;for(var i=-h;i<w+h;i+=s){c.fillStyle=cols[Math.floor((i+h)/s)%4];c.beginPath();c.moveTo(x+i,y);c.lineTo(x+i+s,y);c.lineTo(x+i+s-h,y+h);c.lineTo(x+i-h,y+h);c.closePath();c.fill()}c.restore()}},
 cc:{emoji:'🔬',kicker:'LABORATÓRIO DE PERGUNTAS',title:'Ciências e Corpo Humano',fh:"'Space Grotesk',sans-serif",fb:"'Space Grotesk',sans-serif",fn:"'Space Grotesk',sans-serif",fc:"'Space Grotesk',sans-serif",ctaStyle:'600',
  ink:'#e8f4ff',soft:'#9bb3d6',num:'#a6ff4d',cta:'#3ee0ff',top:'#3ee0ff',chipBg:'#0a1a40',chipTxt:'#3ee0ff',chipBorder:'#3ee0ff',pill:'#3ee0ff66',starOff:'#ffffff22',
  bg:function(c){c.fillStyle=rad(c,W/2,0,0,H*1.1,[[0,'#183c8f'],[.58,'#081634'],[1,'#040a1c']]);c.fillRect(0,0,W,H);grid(c,44,'#3e7bff1c',2);grid(c,220,'#3e7bff38',2);[[.15,.3,'#3ee0ff'],[.85,.2,'#a6ff4d'],[.7,.66,'#8c7bff'],[.1,.78,'#3ee0ff']].forEach(function(p){c.fillStyle=p[2];c.beginPath();c.arc(W*p[0],H*p[1],4,0,7);c.fill()})},
  card:function(c,x,y,w,h){c.save();c.shadowColor='#3ee0ff44';c.shadowBlur=50;rr(c,x,y,w,h,32);c.fillStyle=lin(c,x,y,x+w,y+h,[[0,'#10275a'],[1,'#0a1838']]);c.fill();c.restore();rr(c,x,y,w,h,32);c.lineWidth=2;c.strokeStyle='#3ee0ff77';c.stroke();c.strokeStyle='#3ee0ff';c.lineWidth=4;var L=34,o=18;[[x+o,y+o,1,1],[x+w-o,y+o,-1,1],[x+o,y+h-o,1,-1],[x+w-o,y+h-o,-1,-1]].forEach(function(p){c.beginPath();c.moveTo(p[0]+p[2]*L,p[1]);c.lineTo(p[0],p[1]);c.lineTo(p[0],p[1]+p[3]*L);c.stroke()})}},
 cp:{emoji:'📺',kicker:'NOVELAS • MÚSICA • TV',title:'Novelas e Cultura Pop BR',fh:"'Bungee',sans-serif",fb:"'Poppins',sans-serif",fn:"'Bungee',sans-serif",fc:"'Pacifico',cursive",ctaStyle:'400',titleW:'400',numW:'400',
  ink:'#fff1fb',soft:'#d6b3dd',num:'#ffd23f',cta:'#ff7cc4',top:'#2ef2ff',chipBg:'#ff3fa4',chipTxt:'#ffffff',pill:'#ff3fa477',starOff:'#ffffff22',
  bg:function(c){c.fillStyle='#15051d';c.fillRect(0,0,W,H);[[.12,-.05,'#ff3fa466'],[.88,-.05,'#2ef2ff4d'],[.5,1.1,'#7b2cff88']].forEach(function(p){c.fillStyle=rad(c,W*p[0],H*p[1],0,800,[[0,p[2]],[1,'#15051d00']]);c.fillRect(0,0,W,H)});var bars=['#c9c9c9','#e8d000','#00c8d6','#00c040','#d000c8','#e02020','#2030e0'];bars.forEach(function(b,i){c.fillStyle=b;c.fillRect(i*W/7,0,W/7+1,14)})},
  card:function(c,x,y,w,h){c.save();c.shadowColor='#ff3fa4';c.shadowBlur=50;rr(c,x,y,w,h,56);c.fillStyle='#2b0f36';c.fill();c.restore();rr(c,x,y,w,h,56);c.lineWidth=4;c.strokeStyle='#ff3fa4';c.stroke();rr(c,x+22,y+22,w-44,h-44,40);c.fillStyle=rad(c,x+w/2,y+h*.3,20,w*.8,[[0,'#3a1048'],[1,'#1a0622']]);c.fill();c.save();rr(c,x+22,y+22,w-44,h-44,40);c.clip();c.fillStyle='#ffffff0a';for(var yy=y+22;yy<y+h;yy+=6)c.fillRect(x,yy,w,2);c.restore()}}
};
var MAP={'quiz-desafio-biblico':'bib','quiz-bandeiras-capitais':'bc','quiz-do-milhao':'qm','quiz-futebol-brasileiro':'fb','quiz-historia-do-brasil':'hb','quiz-geografia-do-brasil':'gb','quiz-ciencias-corpo-humano':'cc','quiz-cultura-pop-br':'cp'};
function theme(){var m=location.pathname.match(/jogos\/([^\/]+)/);return T[MAP[m&&m[1]]]||T.fb}
function siteLabel(){if(!/^https?:/.test(location.protocol))return 'Farejador Games';var seg=location.pathname.split('/').filter(Boolean)[0];return location.host+(seg&&seg!=='central_games'&&!/\.html$/.test(seg)?'/'+seg:'')}
function loadImg(src){return new Promise(function(ok){var i=new Image();i.onload=function(){ok(i)};i.onerror=function(){ok(null)};i.src=src})}
function fontsReady(t){if(!document.fonts||!document.fonts.load)return Promise.resolve();var fams=[t.fh,t.fb,t.fn,t.fc];var p=fams.map(function(f){return document.fonts.load('700 40px '+f).catch(function(){})});p.push(document.fonts.load('italic 600 40px '+t.fc).catch(function(){}));return Promise.race([Promise.all(p),new Promise(function(r){setTimeout(r,1500)})])}

/* ---------- desenho do cartão ---------- */
function draw(r,t,mascot){
 var cv=document.createElement('canvas');cv.width=W;cv.height=H;var c=cv.getContext('2d');c.textAlign='center';c.textBaseline='alphabetic';
 t.bg(c);
 // topo: mascote + marca
 if(mascot){c.save();c.beginPath();c.arc(108,104,40,0,7);c.fillStyle='#fff';c.fill();c.clip();c.drawImage(mascot,68,64,80,80);c.restore()}
 c.textAlign='left';c.fillStyle=t.top;c.font="700 32px 'Poppins','DM Sans',sans-serif";c.fillText('Farejador Games',166,115);
 c.textAlign='right';c.font="600 24px 'Poppins','DM Sans',sans-serif";c.globalAlpha=.85;c.fillText('quizzes grátis',1012,113);c.globalAlpha=1;c.textAlign='center';
 // cartão
 var x=68,y=196,w=944,h=930,cx=W/2;t.card(c,x,y,w,h);
 c.fillStyle=t.ink;c.font="120px 'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif";c.fillText(t.emoji,cx,y+190);
 spaced(c,'7px');c.fillStyle=t.soft;c.font="600 22px "+t.fh;c.fillText(t.kicker,cx,y+252);spaced(c,'0px');
 c.fillStyle=t.ink;var ts=fit(c,t.title,t.fh,52,820,t.titleW||'700');c.font=(t.titleW||'700')+' '+ts+'px '+t.fh;c.fillText(t.title,cx,y+318);
 // etiqueta da categoria
 if(r.cat){var label=String(r.cat).toUpperCase();spaced(c,'4px');c.font="700 22px 'Poppins','DM Sans',sans-serif";var cw=Math.min(c.measureText(label).width+60,820);rr(c,cx-cw/2,y+350,cw,52,26);c.fillStyle=t.chipBg;c.fill();if(t.chipBorder){c.lineWidth=2;c.strokeStyle=t.chipBorder;c.stroke()}c.fillStyle=t.chipTxt;c.fillText(label,cx+2,y+384);spaced(c,'0px')}
 spaced(c,'7px');c.fillStyle=t.soft;c.font="600 24px 'Poppins','DM Sans',sans-serif";c.fillText(r.label||'MINHA PONTUAÇÃO',cx+3,y+478);spaced(c,'0px');
 // número grande
 var num=String(r.score),unit=r.unit||'';var ns=fit(c,num,t.fn,190,unit?700:820,t.numW||'700');c.font=(t.numW||'700')+' '+ns+'px '+t.fn;var nw=c.measureText(num).width;c.font=(t.numW||'700')+' '+Math.round(ns*.3)+'px '+t.fn;var uw=unit?c.measureText(' '+unit).width:0;
 c.textAlign='left';c.fillStyle=t.num;c.font=(t.numW||'700')+' '+ns+'px '+t.fn;c.fillText(num,cx-(nw+uw)/2,y+650);if(unit){c.font=(t.numW||'700')+' '+Math.round(ns*.3)+'px '+t.fn;c.fillText(' '+unit,cx-(nw+uw)/2+nw,y+650)}c.textAlign='center';
 // estrelas
 var n=Math.max(0,Math.min(5,r.stars|0));for(var i=0;i<5;i++)star(c,cx+(i-2)*82,y+722,34,i<n?'#ffcc2e':t.starOff,i<n?'#e0a000':null);
 // pílulas
 var pills=[];if(r.total)pills.push('✔ '+r.ok+' de '+r.total+(r.total>10?' perguntas':''));if(r.streak>=2)pills.push('🔥 '+r.streak+' seguidas');
 c.font="700 28px 'Poppins','DM Sans',sans-serif";var ws=pills.map(function(p){return c.measureText(p).width+56}),tot=ws.reduce(function(a,b){return a+b},0)+(pills.length-1)*20,px=cx-tot/2;
 pills.forEach(function(p,k){rr(c,px,y+780,ws[k],72,24);c.lineWidth=3;c.strokeStyle=t.pill;c.stroke();c.fillStyle=t.ink;c.fillText(p,px+ws[k]/2,y+827);px+=ws[k]+20});
 // chamada
 c.fillStyle=t.cta;c.font=t.ctaStyle+' 40px '+t.fc;c.fillText(r.cta||'Consegue me superar?',cx,y+900-(pills.length?0:60));
 // rodapé
 c.fillStyle=t.top;c.font="800 34px 'Poppins','DM Sans',sans-serif";c.fillText('Jogue grátis',cx,1216);c.font="600 27px 'Poppins','DM Sans',sans-serif";c.fillText(siteLabel(),cx,1262);
 return cv;
}

var pending=null,ready=null,result=null;
function prepare(r){result=r;ready=null;var t=theme();pending=Promise.all([fontsReady(t),loadImg('../../assets/mascote-192.png')]).then(function(a){var cv=draw(r,t,a[1]);return new Promise(function(ok){cv.toBlob(function(b){ready=b;ok(b)},'image/png')})}).catch(function(){return null});return pending}

/* ---------- janela alternativa (computador) ---------- */
function css(){if(document.getElementById('fgs-css'))return;var s=document.createElement('style');s.id='fgs-css';s.textContent=
'.fgs-bg{position:fixed;inset:0;z-index:9999;background:#000b;display:flex;align-items:center;justify-content:center;padding:18px;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}'+
'.fgs-box{background:#fff;color:#1b1b1b;border-radius:18px;max-width:380px;width:100%;max-height:96vh;overflow:auto;padding:16px;text-align:center;box-shadow:0 20px 60px #0008}'+
'.fgs-box img{width:100%;border-radius:12px;display:block;margin-bottom:12px;background:#eee}'+
'.fgs-box b{display:block;font-size:15px;margin-bottom:10px}'+
'.fgs-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;min-height:46px;margin-top:8px;border-radius:12px;border:0;font:700 14px system-ui,sans-serif;cursor:pointer;text-decoration:none}'+
'.fgs-wa{background:#25d366;color:#fff}.fgs-dl{background:#1b2a4a;color:#fff}.fgs-cp{background:#eef1f6;color:#1b2a4a}.fgs-x{background:none;color:#666;min-height:38px}';document.head.appendChild(s)}
function modal(blob,text){css();var url=blob?URL.createObjectURL(blob):'';var bg=document.createElement('div');bg.className='fgs-bg';bg.setAttribute('role','dialog');bg.setAttribute('aria-modal','true');
 bg.innerHTML='<div class="fgs-box">'+(url?'<img alt="Cartão com o seu resultado">':'')+'<b>Compartilhe seu resultado</b>'+
 '<a class="fgs-btn fgs-wa" target="_blank" rel="noopener">Enviar no WhatsApp</a>'+(url?'<a class="fgs-btn fgs-dl">Baixar imagem</a>':'')+
 '<button class="fgs-btn fgs-cp" type="button">Copiar texto</button><button class="fgs-btn fgs-x" type="button">Fechar</button></div>';
 if(url){bg.querySelector('img').src=url;var dl=bg.querySelector('.fgs-dl');dl.href=url;dl.download='resultado-farejador-games.png'}
 bg.querySelector('.fgs-wa').href='https://wa.me/?text='+encodeURIComponent(text);
 var close=function(){bg.remove();if(url)setTimeout(function(){URL.revokeObjectURL(url)},1000);document.removeEventListener('keydown',esc)};
 var esc=function(e){if(e.key==='Escape')close()};document.addEventListener('keydown',esc);
 bg.addEventListener('click',function(e){if(e.target===bg)close()});bg.querySelector('.fgs-x').onclick=close;
 bg.querySelector('.fgs-cp').onclick=function(){var b=this;(navigator.clipboard?navigator.clipboard.writeText(text):Promise.reject()).then(function(){b.textContent='Texto copiado!'},function(){b.textContent='Não foi possível copiar'})};
 document.body.appendChild(bg);bg.querySelector('.fgs-wa').focus()}

/* ---------- compartilhar ---------- */
function share(text){
 var link=/^https?:/.test(location.protocol)?location.href.split('#')[0]:'';var full=text+(link?'\n'+link:'');
 var go=function(blob){
  var file=null;try{if(blob)file=new File([blob],'resultado-farejador-games.png',{type:'image/png'})}catch(e){}
  if(file&&navigator.canShare&&navigator.canShare({files:[file]})&&navigator.share){
   return navigator.share({files:[file],text:full}).catch(function(e){if(e&&e.name==='AbortError')return;modal(blob,full)})}
  modal(blob,full)};
 if(ready)return go(ready); // imagem já pronta: abre na hora (o celular exige que seja logo após o toque)
 if(!pending&&result)prepare(result);
 return (pending||Promise.resolve(null)).then(go);
}
window.FGShare={prepare:prepare,share:share,themes:T};
})();
