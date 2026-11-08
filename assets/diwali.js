(function(){
// Diwali greeting: fireworks + "Happy Diwali" splash on the home page. Shows once per visit, auto-expires after END.
var END=new Date(2026,10,16),de=document.documentElement,force=/[?&]diwali=1/.test(location.search)||window.DW_FORCE;
if(!force){
 if(location.pathname!=='/'&&location.pathname!=='/index.html')return;
 if(new Date()>=END)return;
 try{if(sessionStorage.getItem('dw'))return}catch(e){}
}
de.classList.add('dw-on');
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches,raf,over,done=false;
function close(){if(done)return;done=true;try{sessionStorage.setItem('dw','1')}catch(e){}
 if(over){over.classList.add('out')}cancelAnimationFrame(raf);
 setTimeout(function(){de.classList.remove('dw-on');if(over&&over.parentNode)over.parentNode.removeChild(over)},900)}
function build(){
 over=document.createElement('div');over.className='dw';over.setAttribute('role','dialog');over.setAttribute('aria-label','Happy Diwali');
 over.innerHTML='<canvas aria-hidden="true"></canvas><div class="dw-card"><p class="dw-om" aria-hidden="true">&#x1FA94; &#x2728; &#x1FA94;</p><h1 class="dw-h">Happy Diwali</h1><p class="dw-hi" lang="hi">&#x0936;&#x0941;&#x092D; &#x0926;&#x0940;&#x092A;&#x093E;&#x0935;&#x0932;&#x0940;</p><p class="dw-p">Wishing you and your family good health, light and happiness this Diwali and always.</p><p class="dw-by">DR. SHANTANU DESHPANDE</p><button type="button" class="dw-go">Enter website &rarr;</button></div><div class="dw-diyas" aria-hidden="true"><span class="dw-diya"><b></b><i></i></span><span class="dw-diya"><b></b><i></i></span><span class="dw-diya"><b></b><i></i></span></div>';
 document.body.appendChild(over);
 over.querySelector('.dw-go').addEventListener('click',close);over.querySelector('.dw-go').focus({preventScroll:true});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
 setTimeout(close,8000);
 if(!reduce)fire(over.querySelector('canvas'))}
function fire(cv){
 var c=cv.getContext('2d'),W,H,dpr=Math.min(window.devicePixelRatio||1,2),small=Math.min(innerWidth,innerHeight)<600;
 function size(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;c.setTransform(dpr,0,0,dpr,0,0)}size();addEventListener('resize',size);
 var cols=['#ffd36b','#ff8a3d','#ff4d6d','#ffffff','#ffb3c1','#7fe0ff','#b8ff8a','#f6a0ff'],rk=[],pt=[],stars=[],t0=performance.now(),last=t0,next=0;
 for(var i=0;i<60;i++)stars.push({x:Math.random(),y:Math.random()*.8,r:Math.random()*1.2+.3,p:Math.random()*6});
 function launch(){var x=W*(.12+Math.random()*.76);rk.push({x:x,y:H,vx:(Math.random()-.5)*1.2,vy:-(H*.0105+Math.random()*H*.004),ty:H*(.14+Math.random()*.34),col:cols[(Math.random()*cols.length)|0],trail:[]})}
 function burst(x,y,col){var n=small?46:80,kind=Math.random(),mix=Math.random()<.45;
  for(var i=0;i<n;i++){var a=Math.PI*2*i/n+Math.random()*.1,s=(kind<.3?(i%2?2.2:4.4):1.4+Math.random()*3.8)*(small?.8:1);
   pt.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,dec:.009+Math.random()*.012,col:mix&&i%3===0?cols[(Math.random()*cols.length)|0]:col,sz:small?1.6:2})}
  if(Math.random()<.5)for(var j=0;j<14;j++)pt.push({x:x,y:y,vx:(Math.random()-.5)*1.2,vy:(Math.random()-.5)*1.2,life:1,dec:.006,col:'#fff',sz:1.2,tw:1})}
 function frame(now){raf=requestAnimationFrame(frame);var dt=Math.min((now-last)/16.67,3);last=now;
  c.globalCompositeOperation='source-over';c.fillStyle='rgba(8,6,24,'+(.2*Math.min(dt,1.6))+')';c.fillRect(0,0,W,H);
  c.globalCompositeOperation='lighter';
  for(var s=0;s<stars.length;s++){var st=stars[s];c.globalAlpha=.25+.25*Math.sin(now/500+st.p);c.fillStyle='#fff';c.fillRect(st.x*W,st.y*H,st.r,st.r)}
  c.globalAlpha=1;
  if(now>=next){launch();if(Math.random()<.4)setTimeout(launch,180);next=now+(small?650:480)+Math.random()*500}
  for(var i=rk.length-1;i>=0;i--){var r=rk[i];r.x+=r.vx*dt;r.y+=r.vy*dt;r.vy*=.992;r.trail.push([r.x,r.y]);if(r.trail.length>9)r.trail.shift();
   for(var k=0;k<r.trail.length;k++){c.globalAlpha=k/r.trail.length*.8;c.fillStyle=r.col;c.fillRect(r.trail[k][0],r.trail[k][1],2,2)}c.globalAlpha=1;
   if(r.y<=r.ty||r.vy>-1.2){burst(r.x,r.y,r.col);rk.splice(i,1)}}
  for(var p=pt.length-1;p>=0;p--){var q=pt[p];q.vx*=.985;q.vy=q.vy*.985+.035*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=q.dec*dt;
   if(q.life<=0){pt.splice(p,1);continue}
   c.globalAlpha=q.tw?q.life*(.5+.5*Math.sin(now/40+p)):q.life;c.fillStyle=q.col;c.beginPath();c.arc(q.x,q.y,q.sz*(.5+q.life*.6),0,6.283);c.fill()}
  c.globalAlpha=1}
 launch();setTimeout(launch,250);raf=requestAnimationFrame(frame)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();
