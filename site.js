(function(){
  var T=window.ZT;
  var racine=document.documentElement;
  var mouvement=window.matchMedia?matchMedia('(prefers-reduced-motion: no-preference)'):{matches:false};
  function borne(v,a,b){return v<a?a:v>b?b:v;}
  function hhmm(m){m=Math.round(m);var h=Math.floor(m/60),n=m%60;return (h<10?'0':'')+h+':'+(n<10?'0':'')+n;}
  function interpole(x,pts){for(var i=1;i<pts.length;i++){if(x<=pts[i][0]){var a=pts[i-1],b=pts[i];return a[1]+(b[1]-a[1])*((x-a[0])/((b[0]-a[0])||1));}}return pts[pts.length-1][1];}

  /* En-tête : avancée de la page et section courante */
  var entete=document.getElementById('entete');
  var liens=[].slice.call(document.querySelectorAll('.nav a'));
  function majEntete(){
    var h=document.documentElement.scrollHeight-innerHeight;
    entete.style.setProperty('--avance',h>0?(scrollY/h).toFixed(4):0);
    var courant=null;
    liens.forEach(function(a){var s=document.querySelector(a.getAttribute('href'));if(s&&s.getBoundingClientRect().top<innerHeight*.4)courant=a;});
    liens.forEach(function(a){if(a===courant)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
  }

  /* Héros : l'horloge suit la ligne de tournée */
  var horlogeHeros=document.getElementById('horloge-heros');
  if(racine.classList.contains('anim')&&horlogeHeros){
    var t0=performance.now(), etapesH=[[0,525],[.4,532],[1.38,630],[2.21,760],[3.13,910],[4.4,1080]];
    (function tic(t){var s=(t-t0)/1000;horlogeHeros.textContent=hhmm(interpole(s,etapesH));if(s<4.5)requestAnimationFrame(tic);})(t0);
  }

  /* La journée qui défile */
  var jr=document.getElementById('journee');
  var chapitres=[].slice.call(jr.querySelectorAll('.jr-ch'));
  var heureJr=document.getElementById('jr-heure'), evtJr=document.getElementById('jr-evenement');
  var crans=[].slice.call(jr.querySelectorAll('.cran')), heures=[].slice.call(jr.querySelectorAll('[data-heure]'));
  var carte=document.getElementById('carte-checkin');
  var evenements=[[532,'08:52',T.evt[0]],[630,'10:30',T.evt[1]],[760,'12:40',T.evt[2]],[910,'15:10',T.evt[3]],[1080,'18:00',T.evt[4]]];
  var grand=window.matchMedia?matchMedia('(min-width: 900px) and (min-height: 600px)'):{matches:false};
  var dernier=-1;
  function majJournee(){
    if(!jr.classList.contains('defile'))return;
    var r=jr.getBoundingClientRect(), haut=parseFloat(getComputedStyle(racine).getPropertyValue('--entete'))||72;
    var course=r.height-(innerHeight-haut);
    var p=borne((haut-r.top)/course,0,1);
    var m=interpole(p,[[0,525],[.05,525],[.30,629],[.36,630],[.61,959],[.67,960],[.9,1080],[1,1080]]);
    var mm=Math.floor(m); if(mm===dernier)return; dernier=mm;
    heureJr.textContent=hhmm(mm);
    var actif=mm<630?0:mm<960?1:2;
    chapitres.forEach(function(c,i){c.classList.toggle('actif',i===actif);c.classList.toggle('passe',i<actif);});
    jr.style.setProperty('--jour',((mm-525)/555).toFixed(4));
    crans.forEach(function(c,i){c.classList.toggle('passe',mm>=evenements[i][0]);});
    var e=null; evenements.forEach(function(v){if(mm>=v[0])e=v;});
    evtJr.innerHTML=e?'<b>'+e[1]+'</b>'+e[2]:'<b>08:45</b>'+T.ouvert;
    heures[0].textContent=hhmm(Math.min(mm,629)); heures[1].textContent=hhmm(Math.max(mm,960));
    carte.classList.toggle('fait',mm>=532);
  }
  function modeJournee(){
    var oui=grand.matches&&mouvement.matches;
    jr.classList.toggle('defile',oui);
    if(!oui){chapitres.forEach(function(c){c.classList.remove('actif','passe');});carte.classList.remove('fait');heures[0].textContent='08:50';heures[1].textContent='18:00';}
    dernier=-1; majJournee();
  }
  [grand,mouvement].forEach(function(mq){if(mq.addEventListener)mq.addEventListener('change',modeJournee);});
  modeJournee();

  var attente=false;
  function auDefilement(){if(attente)return;attente=true;requestAnimationFrame(function(){attente=false;majEntete();majJournee();});}
  addEventListener('scroll',auDefilement,{passive:true});
  addEventListener('resize',function(){dernier=-1;auDefilement();});
  majEntete();

  /* Aujourd'hui / Avec Zinova */
  var bascule=document.getElementById('bascule'), registre=document.getElementById('registre');
  bascule.hidden=false;
  bascule.addEventListener('change',function(e){var v=e.target.value;bascule.setAttribute('data-vue',v);registre.setAttribute('data-vue',v);});

  /* Un écran par métier : onglets */
  var liste=document.querySelector('.onglets'), onglets=[].slice.call(liste.querySelectorAll('[role="tab"]'));
  liste.hidden=false;
  function choisir(o,focus){
    onglets.forEach(function(x){var oui=x===o,p=document.getElementById(x.getAttribute('aria-controls'));x.setAttribute('aria-selected',oui?'true':'false');x.tabIndex=oui?0:-1;p.hidden=!oui;if(oui){p.classList.remove('entre');void p.offsetWidth;p.classList.add('entre');}});
    if(focus)o.focus();
  }
  onglets.forEach(function(o,i){
    var p=document.getElementById(o.getAttribute('aria-controls'));p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby',o.id);p.tabIndex=0;
    o.addEventListener('click',function(){choisir(o,false);});
    o.addEventListener('keydown',function(e){var n=null;if(e.key==='ArrowRight')n=onglets[(i+1)%onglets.length];else if(e.key==='ArrowLeft')n=onglets[(i-1+onglets.length)%onglets.length];else if(e.key==='Home')n=onglets[0];else if(e.key==='End')n=onglets[onglets.length-1];if(n){e.preventDefault();choisir(n,true);}});
  });
  choisir(onglets[0],false); document.getElementById('m-directeur').classList.remove('entre');

  /* Mise en place : la tournée se trace à l'arrivée */
  var etapes=document.getElementById('etapes');
  if('IntersectionObserver' in window&&racine.classList.contains('anim')){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){etapes.classList.add('vu');io.disconnect();}});},{threshold:.3});
    io.observe(etapes);
  } else etapes.classList.add('vu');

  /* Contact */
  var bouton=document.getElementById('copier'), etat=document.getElementById('copie-etat');
  bouton.addEventListener('click',function(){
    var texte=document.getElementById('adresse').textContent;
    function selectionner(){var s=window.getSelection(),r=document.createRange();r.selectNodeContents(document.getElementById('adresse'));s.removeAllRanges();s.addRange(r);etat.textContent=T.selectionnee;}
    try{navigator.clipboard.writeText(texte).then(function(){etat.textContent=T.copiee;},selectionner);}catch(e){selectionner();}
  });
  var f=document.getElementById('formulaire');
  var msg=document.getElementById('f-message'), cpt=document.getElementById('c-message');
  msg.addEventListener('input',function(){cpt.textContent=msg.value.length+' / 1500';});
  function erreur(id,texte){var c=document.getElementById('f-'+id),e=document.getElementById('e-'+id);e.textContent=texte||'';if(c)c.setAttribute('aria-invalid',texte?'true':'false');return !texte;}
  function telephone(v){var d=v.replace(/[\s.\-]/g,'').replace(/^(\+216|00216)/,'');return d===''||/^[234579]\d{7}$/.test(d);}
  ['nom','societe','fonction','effectif','email','tel','accord'].forEach(function(id){var c=document.getElementById('f-'+id);c.addEventListener(c.type==='checkbox'||c.tagName==='SELECT'?'change':'input',function(){erreur(id,'');});});
  f.addEventListener('submit',function(ev){
    ev.preventDefault();
    var v=function(id){return document.getElementById('f-'+id).value.trim();};
    var ok=true;
    ok=erreur('nom',v('nom')?'':T.e.nom)&&ok;
    ok=erreur('societe',v('societe')?'':T.e.societe)&&ok;
    ok=erreur('fonction',v('fonction')?'':T.e.fonction)&&ok;
    ok=erreur('effectif',v('effectif')?'':T.e.effectif)&&ok;
    ok=erreur('email',/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email'))?'':T.e.email)&&ok;
    ok=erreur('tel',telephone(v('tel'))?'':T.e.tel)&&ok;
    ok=erreur('accord',document.getElementById('f-accord').checked?'':T.e.accord)&&ok;
    var res=document.getElementById('resultat');
    if(!ok){res.hidden=true;var premier=f.querySelector('[aria-invalid="true"]');if(premier)premier.focus();return;}
    var prenom=v('nom').split(/\s+/)[0];
    res.textContent=T.merci(prenom);
    res.hidden=false;
  });
})();
