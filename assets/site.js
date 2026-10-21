(function(){
var h=document.documentElement,$=function(i){return document.getElementById(i)},b=$('menu-btn'),d=$('drawer'),inertEls=document.querySelectorAll('main,footer,.dock,header');
function setOpen(o){h.classList.toggle('nav-open',o);b.setAttribute('aria-expanded',String(o));d.setAttribute('aria-hidden',String(!o));inertEls.forEach(function(e){if(o)e.setAttribute('inert','');else e.removeAttribute('inert')});if(o)$('drawer-close').focus();else if(document.activeElement&&d.contains(document.activeElement))b.focus()}
b.addEventListener('click',function(){setOpen(!h.classList.contains('nav-open'))});
$('drawer-close').addEventListener('click',function(){setOpen(false)});
$('scrim').addEventListener('click',function(){setOpen(false)});
d.addEventListener('click',function(e){if(e.target.closest('a'))setOpen(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false)});
window.addEventListener('pageshow',function(){setOpen(false)});
window.addEventListener('resize',function(){if(window.innerWidth>1408)setOpen(false)});
var C={naupada:{t:'tel:+919619612887',m:'https://maps.app.goo.gl/V5tXpymTnpMW95KN8?g_st=ic'},godbole:{t:'tel:+912241116789',m:'https://www.google.com/maps/search/?api=1&query=Dr+Godbole+Heart+Care+Hospital+Thane'},justcare:{t:'tel:+918879758831',m:'https://www.google.com/maps/search/?api=1&query=Just+Care+Heart+and+Eye+Clinic+Shubham+Flora+Chembur+Mumbai'}};
function bind(sel,call,dir){var s=$(sel);if(!s)return;function u(){var c=C[s.value];if(!c)return;$(call).href=c.t;$(dir).href=c.m;$(dir).target='_blank';$(dir).rel='noopener'}s.addEventListener('change',u);u()}
bind('clinic-top','top-call','top-dir');bind('clinic','cc','cd');
document.querySelectorAll('[data-vid]').forEach(function(x){fetch('https://www.youtube.com/oembed?format=json&url='+encodeURIComponent('https://www.youtube.com/watch?v='+x.dataset.vid)).then(function(r){return r.json()}).then(function(j){if(j.title&&x.dataset.vid!=='tOe0ZpFg874')x.textContent=j.title}).catch(function(){})});
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});document.querySelectorAll('.rv').forEach(function(el){io.observe(el)})}else{document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})}
})();
