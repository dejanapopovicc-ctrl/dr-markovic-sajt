(function(){
  var html=document.documentElement;
  var MSG={sr:'Zdravo, zanima me predlog sajta za moj biznis. Bavim se: ',en:'Hi, I would like a website proposal for my business. What I do: '};
  function setMsg(l){var m=encodeURIComponent(MSG[l]||MSG.sr);
    document.querySelectorAll('a.msg.wa').forEach(function(a){a.href=a.href.split('?')[0]+'?text='+m});
    document.querySelectorAll('a.msg.vb').forEach(function(a){a.href=a.href.split('&draft=')[0]+'&draft='+m})}
  function setLang(l){html.setAttribute('lang',l);try{localStorage.setItem('lang',l)}catch(e){}
    document.querySelectorAll('[data-sr]').forEach(function(el){var v=el.getAttribute('data-'+l);if(v!==null)el.textContent=v});
    var tt=document.body.getAttribute('data-title-'+l);if(tt)document.title=tt;setMsg(l)}
  document.querySelectorAll('.lang button').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.l)})});
  setLang(html.getAttribute('lang')||'sr');
  var bg=document.querySelector('.burger'),links=document.getElementById('links');
  if(bg)bg.addEventListener('click',function(){links.classList.toggle('open')});
  var nl=document.querySelectorAll('#links a');
  nl.forEach(function(a){a.addEventListener('click',function(){links.classList.remove('open')})});
  if('IntersectionObserver' in window){var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)nl.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-40% 0px -55% 0px'});document.querySelectorAll('section[id]').forEach(function(s){so.observe(s)})}
  // cursor readout
  var xy=document.getElementById('xy');
  function pad(n){n=Math.round(n);return ('000'+n).slice(-3)}
  window.addEventListener('mousemove',function(e){if(xy)xy.textContent='x '+pad(e.clientX)+' y '+pad(e.clientY)},{passive:true});
  // desk: drag, scatter, tidy
  var board=document.getElementById('board');if(!board)return;
  var wins=[].slice.call(board.querySelectorAll('.win')),z=10;
  var mq=window.matchMedia('(max-width:768px)');
  function px(w){var b=board.getBoundingClientRect();return {l:w.offsetLeft,t:w.offsetTop,bw:b.width,bh:b.height}}
  wins.forEach(function(w){
    var bar=w.querySelector('.bar'),sx,sy,ol,ot,on=false;
    bar.addEventListener('pointerdown',function(e){if(mq.matches)return;on=true;w.classList.remove('anim');w.classList.add('drag');w.style.zIndex=++z;
      var p=px(w);w.style.left=p.l+'px';w.style.top=p.t+'px';sx=e.clientX;sy=e.clientY;ol=p.l;ot=p.t;bar.setPointerCapture(e.pointerId)});
    bar.addEventListener('pointermove',function(e){if(!on)return;var bw=board.clientWidth,bh=board.clientHeight;
      var nl=Math.max(0,Math.min(bw-w.offsetWidth,ol+e.clientX-sx)),nt=Math.max(0,Math.min(bh-w.offsetHeight,ot+e.clientY-sy));
      w.style.left=nl+'px';w.style.top=nt+'px'});
    function up(){on=false;w.classList.remove('drag')}
    bar.addEventListener('pointerup',up);bar.addEventListener('pointercancel',up);
  });
  function place(fn){if(mq.matches)return;wins.forEach(function(w,i){w.classList.add('anim');var r=fn(w,i);w.style.left=r.l+'px';w.style.top=r.t+'px';w.style.setProperty('--r',r.r+'deg')})}
  var sc=document.getElementById('scatter'),td=document.getElementById('tidy');
  if(sc)sc.addEventListener('click',function(){var bw=board.clientWidth,bh=board.clientHeight;
    place(function(w){return {l:Math.random()*(bw-w.offsetWidth),t:Math.random()*(bh-w.offsetHeight),r:(Math.random()*12-6).toFixed(1)}})});
  if(td)td.addEventListener('click',function(){var bw=board.clientWidth,cw=wins[0].offsetWidth,gap=(bw-3*cw)/2;
    place(function(w,i){return {l:(i%3)*(cw+gap),t:Math.floor(i/3)*(w.offsetHeight+50)+10,r:0}})});
})();
