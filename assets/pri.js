(function(){
var tabs=document.querySelectorAll('.pri-tab'),secs=document.querySelectorAll('.pri-sec');
if(!tabs.length)return;
var $=function(i){return document.getElementById(i)},q=$('pri-q'),hi=$('pri-h'),out=$('pri-n'),reg=$('pri-r'),mp=$('pri-mp'),mk=$('pri-mk'),ord=$('pri-o');
var lists=[].slice.call(document.querySelectorAll('.pri-grid'));
function cur(){var h=(location.hash||'').replace('#','');return h&&document.querySelector('.pri-tab[data-t="'+h+'"]')?h:'all'}
function sortAll(){var o=ord.value;lists.forEach(function(ul){
 var a=[].slice.call(ul.children);
 a.sort(function(x,y){if(o==='p')return (+y.dataset.p)-(+x.dataset.p)||(+x.dataset.i)-(+y.dataset.i);
  if(o==='k')return (+x.dataset.k)-(+y.dataset.k)||(+x.dataset.i)-(+y.dataset.i);return (+x.dataset.i)-(+y.dataset.i)});
 a.forEach(function(li){ul.appendChild(li)})})}
function apply(){
 var t=cur(),term=(q.value||'').trim().toLowerCase(),d=(document.querySelector('input[name=pri-d]:checked')||{}).value||'all',n=0,
  src=[].slice.call(document.querySelectorAll('input[name=pri-src]:checked')).map(function(c){return c.value}),
  r=reg.value,minp=+mp.value,maxk=+mk.value;
 tabs.forEach(function(a){if(a.dataset.t===t)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
 sortAll();
 secs.forEach(function(s){
  var show=t==='all'||s.dataset.t===t,c=0;
  s.querySelectorAll('.pri-card').forEach(function(li){
   var have=' '+li.dataset.src+' ';
   var ok=(d==='all'||li.dataset.diet===d)&&(!hi.checked||li.dataset.hi==='1')&&(!term||li.dataset.s.indexOf(term)>-1)
    &&(!r||li.dataset.reg===r)&&(!minp||+li.dataset.p>=minp)&&(!maxk||+li.dataset.k<=maxk)
    &&src.every(function(x){return have.indexOf(' '+x+' ')>-1});
   li.hidden=!ok;if(ok)c++});
  s.hidden=!show||!c;if(show)n+=c});
 out.textContent=n?n+' recipe'+(n===1?'':'s')+' shown.':'No recipes match. Try clearing the search or filters.';
}
window.addEventListener('hashchange',function(){apply();var s=document.querySelector('.pri-tabs');if(s&&s.scrollIntoView)s.scrollIntoView({block:'start'})});
[q,hi,reg,mp,mk,ord].forEach(function(e){e.addEventListener(e===q?'input':'change',apply)});
document.querySelectorAll('input[name=pri-d],input[name=pri-src]').forEach(function(r){r.addEventListener('change',apply)});
apply();
})();
