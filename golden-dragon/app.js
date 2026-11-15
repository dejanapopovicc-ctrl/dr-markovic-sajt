(function(){
  var html=document.documentElement;
  function setLang(l){
    html.setAttribute('lang',l);
    try{localStorage.setItem('lang',l)}catch(e){}
    document.querySelectorAll('.lang button').forEach(function(b){b.classList.toggle('on',b.dataset.l===l)});
    document.querySelectorAll('[data-sr]').forEach(function(el){
      var v=el.getAttribute('data-'+l);if(v===null)return;
      if(el.tagName==='IMG')el.setAttribute('alt',v);
      else if(el.tagName==='OPTION')el.textContent=v;
      else if(el.tagName==='INPUT'||el.tagName==='TEXTAREA')el.setAttribute('placeholder',v);
      else el.textContent=v;
    });
    var tt=document.body.getAttribute('data-title-'+l);if(tt)document.title=tt;
  }
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.l)})});
  setLang(html.getAttribute('lang')||'sr');

  var bg=document.querySelector('.burger'),links=document.getElementById('links');
  if(bg)bg.addEventListener('click',function(){links.classList.toggle('open')});

  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:0,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
  setTimeout(function(){document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})},2500);
  }else{document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})}



  try{var fm=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Belgrade',weekday:'short',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(new Date());
    var dn=fm.find(function(x){return x.type==='weekday'}).value,hh=parseInt(fm.find(function(x){return x.type==='hour'}).value,10)%24;
    var di={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[dn];
    var li=document.querySelector('.week li[data-d="'+di+'"]');if(li)li.classList.add('today');
    var oh=11,ch=19,open=hh>=oh&&hh<ch,st=document.getElementById('status');
    if(st){var lg=document.documentElement.lang==='en'?'en':'sr';
      function txt(l){var nx=11;return open?st.dataset[l+'Open']+' '+ch+':00':st.dataset[l+'Closed']+' '+nx+':00'}
      function setSt(){var l=document.documentElement.lang==='en'?'en':'sr';st.classList.toggle('closed',!open);st.textContent=txt(l);st.dataset.txtSr=txt('sr');st.dataset.txtEn=txt('en')}
      setSt();document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setTimeout(setSt,0)})});}
  }catch(e){}
  var hd=document.getElementById('hdr');function sc(){if(hd)hd.classList.toggle('solid',window.scrollY>40)}sc();window.addEventListener('scroll',sc,{passive:true});
  var secs=document.querySelectorAll('section[id]'),nl=document.querySelectorAll('nav a');
  if('IntersectionObserver' in window){var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){nl.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});secs.forEach(function(s){so.observe(s)})}
  nl.forEach(function(a){a.addEventListener('click',function(){var l=document.getElementById('links');if(l)l.classList.remove('open')})});

  /* idea builder */
  var T={sr:{z:{vrat:'vrat',rame:'rame',nadlaktica:'nadlaktica',podlaktica:'podlaktica',grudi:'grudi',rebra:'rebra',butina:'butina',list:'list',ledja:'leđa',drugo:'još ne znam'},s:{mala:'mala',srednja:'srednja',velika:'velika'},st:{linije:'linije',senke:'senčenje',boja:'u boji',nezna:'još ne znam'},tpl:'Zdravo, zanima me tetovaža. Mesto: {z}. Veličina: {s}. Stil: {st}. Kada mogu da svratim?',copied:'Poruka je kopirana. Nalepi je u Instagram poruku.',fail:'Označi tekst i kopiraj ga ručno.'},
    en:{z:{vrat:'neck',rame:'shoulder',nadlaktica:'upper arm',podlaktica:'forearm',grudi:'chest',rebra:'ribs',butina:'thigh',list:'calf',ledja:'back',drugo:'not sure yet'},s:{mala:'small',srednja:'medium',velika:'large'},st:{linije:'linework',senke:'shading',boja:'colour',nezna:'not sure yet'},tpl:'Hi, I am interested in a tattoo. Placement: {z}. Size: {s}. Style: {st}. When can I drop by?',copied:'Message copied. Paste it into an Instagram message.',fail:'Select the text and copy it by hand.'}};
  var S={z:'drugo',s:'mala',st:'linije'},ta=document.getElementById('msg'),hint=document.getElementById('hint');
  function L(){return document.documentElement.lang==='en'?'en':'sr'}
  function render(){if(!ta)return;var l=L(),d=T[l];ta.value=d.tpl.replace('{z}',d.z[S.z]).replace('{s}',d.s[S.s]).replace('{st}',d.st[S.st]);
    document.querySelectorAll('.chip').forEach(function(c){c.classList.toggle('on',S[c.dataset.g]===c.dataset.v)});
    document.querySelectorAll('.body .z').forEach(function(z){z.classList.toggle('on',z.dataset.v===S.z)})}
  document.querySelectorAll('.chip').forEach(function(c){c.addEventListener('click',function(){S[c.dataset.g]=c.dataset.v;render()})});
  document.querySelectorAll('.body .z').forEach(function(z){z.addEventListener('click',function(){S.z=z.dataset.v;render()})});
  var cp=document.getElementById('copy');
  if(cp)cp.addEventListener('click',function(){var d=T[L()];
    function ok(){hint.textContent=d.copied}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(ta.value).then(ok,function(){ta.select();hint.textContent=d.fail})}
    else{ta.select();try{document.execCommand('copy');ok()}catch(e){hint.textContent=d.fail}}});
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setTimeout(render,0)})});
  render();
})();
