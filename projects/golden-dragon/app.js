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

/* booking mockup */
(function(){
  var root=document.getElementById('zakazi');if(!root)return;
  var D={
    sr:{wd:['Ned','Pon','Uto','Sre','Čet','Pet','Sub'],mo:['jan','feb','mar','apr','maj','jun','jul','avg','sep','okt','nov','dec'],
      art:'Tatuer',size:'Veličina',style:'Stil',cx:'Složenost',date:'Datum',time:'Vreme',
      S:{mala:'Mala',srednja:'Srednja',velika:'Velika'},St:{linije:'Linije',senke:'Senčenje',boja:'U boji'},C:{jednostavna:'Jednostavna',srednja:'Srednja',detaljna:'Detaljna'},
      cn:{jednostavna:'Čist dizajn, malo detalja, bez zahtevnih prelaza.',srednja:'Više elemenata ili finiji detalji.',detaljna:'Gust dizajn, mnogo sitnih detalja ili realizam.'},
      pick:'Izaberi datum.',none:'Nema slobodnih termina za ovu dužinu sesije. Probaj drugi dan ili tatuera.',nodate:'Nema slobodnih dana u narednih 14 dana.',
      one:'sesija',few:'sesije',many:'sesija',total:'ukupno',first:'Prva sesija',
      fine:'Demo prikaz: termin nije stvarno rezervisan. Procena je okvirna, tačno vreme dogovara tatuer.',
      fineMulti:'Prvi termin je dužine do 6 h. Ostale sesije dogovarate sa tatuerom.',
      ref:'Zahtev ',dtxt:function(a,d,t){return a+', '+d+' u '+t+'.'},dnote:'Ovo je mockup. U pravoj verziji stiže potvrda na telefon ili Instagram.'},
    en:{wd:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],mo:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
      art:'Artist',size:'Size',style:'Style',cx:'Complexity',date:'Date',time:'Time',
      S:{mala:'Small',srednja:'Medium',velika:'Large'},St:{linije:'Linework',senke:'Shading',boja:'Colour'},C:{jednostavna:'Simple',srednja:'Moderate',detaljna:'Detailed'},
      cn:{jednostavna:'Clean design, few details, no demanding gradients.',srednja:'More elements or finer detail.',detaljna:'Dense design, lots of small detail or realism.'},
      pick:'Pick a date.',none:'No free slots for this session length. Try another day or artist.',nodate:'No free days in the next 14 days.',
      one:'session',few:'sessions',many:'sessions',total:'total',first:'First session',
      fine:'Demo only: nothing is actually booked. The estimate is approximate; the artist confirms the exact time.',
      fineMulti:'The first booking is up to 6 h. Further sessions are arranged with the artist.',
      ref:'Request ',dtxt:function(a,d,t){return a+', '+d+' at '+t+'.'},dnote:'This is a mockup. In the real version a confirmation arrives by phone or Instagram.'}
  };
  var A={marko:{n:'Marko',off:2},ana:{n:'Ana',off:1},luka:{n:'Luka',off:3}};
  var BASE={mala:1,srednja:2.5,velika:5},SM={linije:1,senke:1.3,boja:1.6},CM={jednostavna:1,srednja:1.4,detaljna:1.9};
  var OPEN=660,CLOSE=1140,CAP=6,DAYS=14;
  var B={a:'marko',s:'srednja',st:'linije',c:'srednja',d:null,t:null};
  function L(){return document.documentElement.lang==='en'?'en':'sr'}
  function $(id){return document.getElementById(id)}
  function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)}
  function bookings(a,d){var k=a+'|'+d,n=hash(k)%3,o=[];for(var i=0;i<n;i++){var s=OPEN+30*(hash(k+'s'+i)%14),e=s+60+30*(hash(k+'l'+i)%5);o.push([s,e])}return o}
  function busy(a,d,m){return bookings(a,d).some(function(r){return m>=r[0]&&m<r[1]})}
  function total(){var t=BASE[B.s]*SM[B.st]*CM[B.c];return Math.ceil(t*2)/2}
  function fmtH(h,l){var s=String(h).replace('.',l==='sr'?',':'.');return s+' h'}
  function hm(m){var h=Math.floor(m/60),mm=m%60;return (h<10?'0':'')+h+':'+(mm?mm:'00')}
  function firstLen(){return Math.min(total(),CAP)}
  function belgradeToday(){
    try{var p=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Belgrade',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
      var g=function(t){return parseInt(p.find(function(x){return x.type===t}).value,10)};
      return Date.UTC(g('year'),g('month')-1,g('day'))}
    catch(e){var n=new Date();return Date.UTC(n.getFullYear(),n.getMonth(),n.getDate())}
  }
  function dayList(){var t=belgradeToday(),o=[];for(var i=1;i<=DAYS;i++){var d=new Date(t+i*864e5);
    var key=d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+('0'+d.getUTCDate()).slice(-2);
    o.push({key:key,wd:d.getUTCDay(),dn:d.getUTCDate(),mo:d.getUTCMonth()})}return o}
  var DL=dayList();
  function slotsFor(key,wd){
    if(A[B.a].off===wd)return [];
    var len=firstLen()*60,out=[];
    for(var m=OPEN;m+len<=CLOSE;m+=30){var ok=true;for(var x=m;x<m+len;x+=30){if(busy(B.a,key,x)){ok=false;break}}if(ok)out.push(m)}
    return out}
  function render(){
    var l=L(),d=D[l];
    ['bk-s','bk-st','bk-c'].forEach(function(id){var k=id==='bk-s'?'s':id==='bk-st'?'st':'c';
      document.querySelectorAll('#'+id+' .bchip').forEach(function(b){b.classList.toggle('on',B[k]===b.dataset.v)})});
    document.querySelectorAll('#bk-art .art').forEach(function(b){b.classList.toggle('on',b.dataset.v===B.a)});
    $('bk-cn').textContent=d.cn[B.c];
    var h=total(),n=Math.ceil(h/CAP);
    $('bk-dur').textContent='~'+fmtH(h,l);
    $('bk-durs').textContent=n===1?('1 '+d.one):(n+' '+(l==='sr'?(n<5?d.few:d.many):d.few));
    /* days */
    var dw=$('bk-days'),firstFree=null;dw.innerHTML='';
    DL.forEach(function(x){var free=slotsFor(x.key,x.wd).length>0;if(free&&!firstFree)firstFree=x.key;
      var b=document.createElement('button');b.type='button';b.className='day'+(B.d===x.key?' on':'');b.disabled=!free;b.dataset.k=x.key;
      b.innerHTML='<small>'+d.wd[x.wd]+'</small><b>'+x.dn+'</b><em>'+d.mo[x.mo]+'</em>';
      b.addEventListener('click',function(){B.d=x.key;B.t=null;render()});dw.appendChild(b)});
    var cur=DL.filter(function(x){return x.key===B.d})[0];
    if(cur&&slotsFor(cur.key,cur.wd).length===0){B.d=null;B.t=null;cur=null;render();return}
    /* slots */
    var sw=$('bk-slots');sw.innerHTML='';
    if(!cur){var e=document.createElement('span');e.className='empty';e.textContent=firstFree?d.pick:d.nodate;sw.appendChild(e);B.t=null}
    else{var sl=slotsFor(cur.key,cur.wd);if(sl.indexOf(B.t)<0)B.t=null;
      sl.forEach(function(m){var b=document.createElement('button');b.type='button';b.className='slot'+(B.t===m?' on':'');b.textContent=hm(m);
        b.addEventListener('click',function(){B.t=m;render()});sw.appendChild(b)})}
    /* summary */
    var rows=[[d.art,A[B.a].n],[d.size,d.S[B.s]],[d.style,d.St[B.st]],[d.cx,d.C[B.c]]];
    var len=firstLen();
    if(n>1)rows.push([d.first,fmtH(len,l)]);
    rows.push([d.date,cur?(d.wd[cur.wd]+' '+cur.dn+'. '+d.mo[cur.mo]):'–']);
    rows.push([d.time,B.t!==null?(hm(B.t)+' – '+hm(B.t+len*60)):'–']);
    $('bk-list').innerHTML=rows.map(function(r){return '<div><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>'}).join('');
    $('bk-go').disabled=B.t===null;
    $('bk-fine').textContent=d.fine+(n>1?' '+d.fineMulti:'');
    if(!$('bk-done').hidden)renderDone();
  }
  function renderDone(){var l=L(),d=D[l];if(B.t===null)return;
    var cur=DL.filter(function(x){return x.key===B.d})[0];if(!cur)return;
    $('bk-ref').textContent=d.ref+'GD-'+(hash(B.a+B.d+B.t)%9000+1000);
    $('bk-dtxt').textContent=d.dtxt(A[B.a].n,d.wd[cur.wd]+' '+cur.dn+'. '+d.mo[cur.mo],hm(B.t)+' – '+hm(B.t+firstLen()*60));
    $('bk-dnote').textContent=d.dnote}
  [['bk-s','s'],['bk-st','st'],['bk-c','c']].forEach(function(p){
    document.querySelectorAll('#'+p[0]+' .bchip').forEach(function(b){b.addEventListener('click',function(){B[p[1]]=b.dataset.v;B.t=null;render()})})});
  document.querySelectorAll('#bk-art .art').forEach(function(b){b.addEventListener('click',function(){B.a=b.dataset.v;B.t=null;render()})});
  $('bk-go').addEventListener('click',function(){if(B.t===null)return;document.querySelector('.tkt').hidden=true;$('bk-done').hidden=false;renderDone();$('bk-done').scrollIntoView({behavior:'smooth',block:'center'})});
  $('bk-reset').addEventListener('click',function(){$('bk-done').hidden=true;document.querySelector('.tkt').hidden=false;B.t=null;render()});
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setTimeout(render,0)})});
  render();
})();
