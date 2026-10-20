(function(){
var tabs=document.querySelectorAll('.pri-tab'),secs=document.querySelectorAll('.pri-sec'),q=document.getElementById('pri-q'),hi=document.getElementById('pri-h'),out=document.getElementById('pri-n');
if(!tabs.length)return;
function cur(){var h=(location.hash||'').replace('#','');return h&&document.querySelector('.pri-tab[data-t="'+h+'"]')?h:'all'}
function apply(){
 var t=cur(),term=(q.value||'').trim().toLowerCase(),d=(document.querySelector('input[name=pri-d]:checked')||{}).value||'all',n=0;
 tabs.forEach(function(a){if(a.dataset.t===t)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')});
 secs.forEach(function(s){
  var show=t==='all'||s.dataset.t===t,c=0;
  s.querySelectorAll('.pri-card').forEach(function(li){
   var ok=(d==='all'||li.dataset.diet===d)&&(!hi.checked||li.dataset.hi==='1')&&(!term||li.dataset.s.indexOf(term)>-1);
   li.hidden=!ok;if(ok)c++});
  s.hidden=!show||!c;if(show)n+=c});
 out.textContent=n?n+' recipe'+(n===1?'':'s')+' shown.':'No recipes match. Try clearing the search or filters.';
}
window.addEventListener('hashchange',function(){apply();var s=document.querySelector('.pri-tabs');if(s&&s.scrollIntoView)s.scrollIntoView({block:'start'})});
q.addEventListener('input',apply);hi.addEventListener('change',apply);
document.querySelectorAll('input[name=pri-d]').forEach(function(r){r.addEventListener('change',apply)});
apply();
})();
