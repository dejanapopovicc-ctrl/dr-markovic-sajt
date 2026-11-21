(function(){
"use strict";
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
var SESS={intro:{n:"Intro call",d:"20 min",w:["online"],t:["10:00","10:30","11:00","11:30","13:00","13:30","15:00","15:30","17:00","17:30"]},
somatic:{n:"Somatic session",d:"60 min",w:["studio","online"],t:["10:00","11:30","13:00","14:30","16:00","17:30"]},
breath:{n:"Breathwork session",d:"75 min",w:["studio"],t:["10:00","12:00","14:00","16:00"]}};
var WHERE={studio:["Studio","Kreuzberg"],online:["Online","Video call"]};

/* header */
var hdr=$("#hdr");function sc(){hdr.classList.toggle("sc",window.scrollY>40)}sc();window.addEventListener("scroll",sc,{passive:true});

/* hero breath label, synced to the 10 s cycle */
var bl=$("#bl");if(bl){(function loop(){bl.textContent="Breathe in";setTimeout(function(){bl.textContent="Breathe out"},4000);setTimeout(loop,10000)})()}

/* pause hero animation off screen */
if("IntersectionObserver" in window){
var anim=$$("#h1,.hbg img,.r,.bline b,#big");
var po=new IntersectionObserver(function(es){es.forEach(function(e){var st=e.isIntersecting?"running":"paused";var t=e.target;
(t.id==="top"?$$("#h1,.hbg img,.r,.bline b",t):[]).forEach(function(a){a.style.animationPlayState=st});
if(t.id==="end"){var b=$("#big");if(b)b.style.animationPlayState=st}})},{threshold:0});
["#top","#end"].forEach(function(s){var el=$(s);if(el)po.observe(el)});

/* theme switching */
var secs=$$("[data-theme]").filter(function(e){return e.tagName==="SECTION"});
var to=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)document.body.setAttribute("data-theme",e.target.getAttribute("data-theme"))})},{rootMargin:"-50% 0px -50% 0px"});
secs.forEach(function(s){to.observe(s)})}

/* parallax */
var par=$$("[data-par]"),tick=false;
function pr(){tick=false;if(reduce||innerWidth<700)return;var h=innerHeight;par.forEach(function(el){var r=el.getBoundingClientRect();if(r.bottom<-200||r.top>h+200)return;var c=r.top+r.height/2-h/2;el.style.transform="translate3d(0,"+(-c*parseFloat(el.getAttribute("data-par"))).toFixed(1)+"px,0)"})}
function rq(){if(!tick){tick=true;requestAnimationFrame(pr)}}
window.addEventListener("scroll",rq,{passive:true});window.addEventListener("resize",rq);pr();

/* ambient sound */
var snd=$("#snd"),sl=$(".sl",snd),ac=null,master=null,on=false,stopT=null;
function build(){
var C=window.AudioContext||window.webkitAudioContext;if(!C)return false;ac=new C();
master=ac.createGain();master.gain.value=0;master.connect(ac.destination);
var len=ac.sampleRate*4,buf=ac.createBuffer(1,len,ac.sampleRate),d=buf.getChannelData(0),last=0;
for(var i=0;i<len;i++){var wn=Math.random()*2-1;last=(last+.02*wn)/1.02;d[i]=last*3.5}
var src=ac.createBufferSource();src.buffer=buf;src.loop=true;
var lp=ac.createBiquadFilter();lp.type="lowpass";lp.frequency.value=520;lp.Q.value=.4;
var ng=ac.createGain();ng.gain.value=.9;src.connect(lp);lp.connect(ng);ng.connect(master);
var lfo=ac.createOscillator();lfo.frequency.value=.1;var lg=ac.createGain();lg.gain.value=260;lfo.connect(lg);lg.connect(lp.frequency);
var lg2=ac.createGain();lg2.gain.value=.25;lfo.connect(lg2);lg2.connect(ng.gain);
[[98,.05],[146.8,.03],[196,.015]].forEach(function(p){var o=ac.createOscillator();o.type="sine";o.frequency.value=p[0];var g=ac.createGain();g.gain.value=p[1];o.connect(g);g.connect(master);o.start()});
src.start();lfo.start();return true}
function setSnd(v){on=v;snd.setAttribute("aria-pressed",v?"true":"false");sl.textContent=v?"Sound on":"Sound off";
if(v){if(!ac&&!build()){on=false;snd.setAttribute("aria-pressed","false");sl.textContent="Sound off";return}
clearTimeout(stopT);if(ac.resume)ac.resume();var t=ac.currentTime;master.gain.cancelScheduledValues(t);master.gain.setValueAtTime(master.gain.value,t);master.gain.linearRampToValueAtTime(.5,t+2.5)}
else if(ac){var t2=ac.currentTime;master.gain.cancelScheduledValues(t2);master.gain.setValueAtTime(master.gain.value,t2);master.gain.linearRampToValueAtTime(0,t2+1.4);stopT=setTimeout(function(){if(!on&&ac.suspend)ac.suspend()},1600)}}
snd.addEventListener("click",function(){setSnd(!on)});

/* check-in */
var ck=$("#ck"),run=0;
var Q=[{q:"How does your body feel right now?",o:["Tense and wound up","Tired and flat","Restless, hard to switch off","Fine, I want to go deeper"]},
{q:"What would help most today?",o:["Talk it through first","Quiet, guided work","Something longer and deeper","I am not sure"]}];
var ans=[];
function pickSess(a){var b=a[1];if(b===0)return"intro";if(b===1)return"somatic";if(b===2)return"breath";var f=a[0];return f===3?"breath":(f===1?"intro":"somatic")}
var RES={intro:"A short call first. We talk about what is going on and decide together what comes next.",somatic:"Slow, guided work with breath and posture. Good if you carry tension and want to feel it ease.",breath:"A longer session of guided breathing, lying down. It can be intense and it goes at your pace."};
function ckQ(i){run++;var q=Q[i];ck.innerHTML='<div class="step">Question '+(i+1)+' of 2</div><p class="q"></p><div class="copts"></div>';
$(".q",ck).textContent=q.q;var box=$(".copts",ck);
q.o.forEach(function(t,k){var b=document.createElement("button");b.type="button";b.textContent=t;b.addEventListener("click",function(){ans[i]=k;i<1?ckQ(i+1):ckBreath()});box.appendChild(b)})}
function ckBreath(){var my=++run,n=0;ck.innerHTML='<div class="res"><div class="gring" id="gr"><i></i><span id="gt">Breathe in</span></div><div><div class="step">Three slow breaths</div><h3>Follow the circle.</h3><p>In for four. Out for six. You can close your eyes.</p><button class="ghost" id="skip" type="button">Skip</button></div></div>';
var gr=$("#gr"),gt=$("#gt");$("#skip").addEventListener("click",function(){if(my===run){run++;ckRes()}});
function cyc(){if(my!==run)return;if(n>=3){ckRes();return}gt.textContent="Breathe in";gr.classList.add("in");
setTimeout(function(){if(my!==run)return;gt.textContent="Breathe out";gr.classList.remove("in");
setTimeout(function(){n++;cyc()},reduce?1200:6000)},reduce?1200:4000)}
setTimeout(cyc,400)}
function ckRes(){var s=pickSess(ans),S=SESS[s];run++;
ck.innerHTML='<div class="res"><div class="gring"><i style="transform:scale(1)"></i><span>Well done</span></div><div><div class="step">Suggested for you</div><h3></h3><p></p><div class="row"><a class="btn" href="#book" id="rb">Book this</a><button class="ghost" id="ra" type="button">Start again</button></div></div></div>';
$("h3",ck).textContent=S.n+", "+S.d;$("p",ck).textContent=RES[s];
$("#rb").addEventListener("click",function(){choose(s)});$("#ra").addEventListener("click",function(){ans=[];ckQ(0)})}
if(ck)ckQ(0);

/* sessions hover */
var sl2=$(".slist"),simg=$(".simg");
if(sl2&&simg){simg.dataset.a="0";var rows=$$(".srow",sl2);
rows.forEach(function(r,i){function a(){sl2.dataset.a=i;simg.dataset.a=i;rows.forEach(function(x){x.classList.toggle("on",x===r)})}
r.addEventListener("mouseenter",a);r.addEventListener("focus",a)});
sl2.addEventListener("mouseleave",function(){delete sl2.dataset.a;rows.forEach(function(x){x.classList.remove("on")})});
sl2.addEventListener("focusout",function(e){if(!sl2.contains(e.relatedTarget)){delete sl2.dataset.a;rows.forEach(function(x){x.classList.remove("on")})}});
$$("[data-pick]").forEach(function(a){a.addEventListener("click",function(){choose(a.getAttribute("data-pick"))})})}

/* booking */
var st={s:null,w:null,d:null,t:null},days=[],booked={};
var oS=$("#o-s"),oW=$("#o-w"),oD=$("#o-d"),oT=$("#o-t"),go=$("#go"),why=$("#why"),form=$("#bf"),done=$("#done");
function hash(n){n=(n^61)^(n>>>16);n=n+(n<<3);n=n^(n>>>4);n=Math.imul(n,0x27d4eb2d);n=n^(n>>>15);return Math.abs(n)}
function key(d){return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate()}
function slotsFor(d,s){var base=SESS[s].t;if(d.getDay()===6)base=base.filter(function(t){return parseInt(t,10)<14});return base}
function taken(d,s,t){var k=key(d)+":"+t;if(booked[k])return true;return hash(key(d)*31+parseInt(t,10)*7+t.length)%100<38}
function dayFree(d,s){return slotsFor(d,s).some(function(t){return!taken(d,s,t)})}
(function mk(){var d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+1);while(days.length<12){var g=d.getDay();if(g>=2&&g<=6)days.push(new Date(d));d.setDate(d.getDate()+1)}})();
function fmt(d,o){return d.toLocaleDateString("en-GB",o)}
function radio(box,name,val,label,small,checked,dis){var w=document.createElement("div");w.className="opt";var id=name+"-"+val;
w.innerHTML='<input type="radio" name="'+name+'" id="'+id+'" value="'+val+'"><label for="'+id+'"><span></span><small></small></label>';
$("span",w).textContent=label;$("small",w).textContent=small;var i=$("input",w);i.checked=!!checked;i.disabled=!!dis;
i.addEventListener("change",function(){name==="s"?pickS(val):pickW(val)});box.appendChild(w)}
function drawS(){oS.innerHTML="";Object.keys(SESS).forEach(function(k){radio(oS,"s",k,SESS[k].n,SESS[k].d,st.s===k)})}
function drawW(){oW.innerHTML="";if(!st.s){oW.innerHTML='<p class="hint">Choose a session first.</p>';return}
SESS[st.s].w.forEach(function(k){radio(oW,"w",k,WHERE[k][0],WHERE[k][1],st.w===k)})}
function drawD(){oD.innerHTML="";days.forEach(function(d,i){var b=document.createElement("button");b.type="button";b.className="day";
var free=st.s?dayFree(d,st.s):true;b.disabled=!free;b.setAttribute("aria-pressed",st.d===i?"true":"false");
b.innerHTML=fmt(d,{weekday:"short"})+"<b>"+d.getDate()+"</b>"+(free?fmt(d,{month:"short"}):"Full");
b.addEventListener("click",function(){st.d=i;st.t=null;drawD();drawT();upd()});oD.appendChild(b)})}
function drawT(){oT.innerHTML="";if(st.d===null){oT.innerHTML='<p class="hint">Choose a day first.</p>';return}
var d=days[st.d],s=st.s||"somatic";slotsFor(d,s).forEach(function(t){var b=document.createElement("button");b.type="button";b.className="slot";b.textContent=t;
b.disabled=taken(d,s,t);b.setAttribute("aria-pressed",st.t===t?"true":"false");
b.addEventListener("click",function(){st.t=t;drawT();upd()});oT.appendChild(b)})}
function pickS(k){st.s=k;var w=SESS[k].w;st.w=w.length===1?w[0]:(w.indexOf(st.w)>-1?st.w:null);
if(st.d!==null&&!dayFree(days[st.d],k)){st.d=null}
if(st.d!==null&&st.t&&(slotsFor(days[st.d],k).indexOf(st.t)<0||taken(days[st.d],k,st.t)))st.t=null;
drawS();drawW();drawD();drawT();upd()}
function pickW(k){st.w=k;drawW();upd()}
function choose(k){pickS(k)}
function valid(){var nm=$("#nm").value.trim(),em=$("#em").value.trim();var miss=[];
if(!st.s)miss.push("a session");else if(!st.w)miss.push("where");if(st.d===null)miss.push("a day");else if(!st.t)miss.push("a time");
if(!nm)miss.push("your name");if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))miss.push("a valid email");return miss}
function upd(){var m=valid();go.disabled=m.length>0;why.textContent=m.length?"Still needed: "+m.join(", ")+".":"Mara will confirm by email. Nothing is charged now."}
["#nm","#em"].forEach(function(s){$(s).addEventListener("input",upd)});

/* therapist phone */
var plist=$("#plist"),pb=$("#pb"),pc=$("#pcount"),cnt=0,seed=[["Tue","10:00","Somatic session","Jonas K."],["Wed","14:00","Breathwork session","Ines P."],["Thu","11:30","Intro call","Luca M."]];
function item(day,t,n,who,cls){var li=document.createElement("li");li.className="pi"+(cls?" "+cls:"");li.innerHTML='<div class="tm"></div><b></b><span></span>';
$(".tm",li).textContent=day+" "+t;$("b",li).textContent=n;$("span",li).textContent=who;return li}
seed.forEach(function(x){plist.appendChild(item(x[0],x[1],x[2],x[3]));cnt++});
function cnt_(){pc.textContent=cnt+" booked"}cnt_();
function pushPhone(){var d=days[st.d],nm=$("#nm").value.trim();
var li=item(fmt(d,{weekday:"short"}),st.t,SESS[st.s].n,nm+(st.w==="online"?", online":", studio"),"new");plist.insertBefore(li,plist.firstChild);cnt++;cnt_();
pb.innerHTML="<b>New booking request</b>";pb.appendChild(document.createTextNode(nm+", "+SESS[st.s].n+", "+fmt(d,{weekday:"short",day:"numeric",month:"short"})+" at "+st.t));
pb.classList.add("on");setTimeout(function(){pb.classList.remove("on")},4500)}

/* ics */
function pad(n){return(n<10?"0":"")+n}
function ics(){var d=days[st.d],p=st.t.split(":"),h=+p[0],m=+p[1],mins=parseInt(SESS[st.s].d,10);
var s=new Date(d.getFullYear(),d.getMonth(),d.getDate(),h,m),e=new Date(s.getTime()+mins*60000);
function f(x){return x.getFullYear()+pad(x.getMonth()+1)+pad(x.getDate())+"T"+pad(x.getHours())+pad(x.getMinutes())+"00"}
var loc=st.w==="online"?"Online (link sent by email)":"Studio, Kreuzberg, Berlin";
var t=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Mara Linden//Booking//EN","BEGIN:VEVENT","UID:"+Date.now()+"@mara-linden.example","DTSTAMP:"+f(new Date())+"Z","DTSTART;TZID=Europe/Berlin:"+f(s),"DTEND;TZID=Europe/Berlin:"+f(e),"SUMMARY:"+SESS[st.s].n+" with Mara Linden","LOCATION:"+loc,"END:VEVENT","END:VCALENDAR"].join("\r\n");
var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:"text/calendar"}));a.download="session-mara-linden.ics";document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}

/* submit */
form.addEventListener("submit",function(e){e.preventDefault();if(valid().length)return;
var d=days[st.d];booked[key(d)+":"+st.t]=1;pushPhone();
var nm=$("#nm").value.trim().split(" ")[0];
done.innerHTML='<h3></h3><p></p><div class="row"><button class="btn" id="ics" type="button">Add to calendar</button><button class="ghost" id="again" type="button">Book another</button></div>';
$("h3",done).textContent="Thank you, "+nm+".";
$("p",done).textContent=SESS[st.s].n+", "+fmt(d,{weekday:"long",day:"numeric",month:"long"})+" at "+st.t+", "+(st.w==="online"?"online":"in the studio")+". Mara will confirm by email within a day.";
form.hidden=true;done.hidden=false;var g=$(".bgrid");g.insertBefore(done,g.firstChild);
$("#ics").addEventListener("click",ics);
$("#again").addEventListener("click",function(){done.hidden=true;form.hidden=false;st={s:null,w:null,d:null,t:null};form.reset();drawS();drawW();drawD();drawT();upd();form.scrollIntoView({behavior:reduce?"auto":"smooth",block:"start"})});
$(".ph").scrollIntoView({behavior:reduce?"auto":"smooth",block:"center"})});

drawS();drawW();drawD();drawT();upd();
})();
