(function(){
// Pointer-driven 3D tilt for the home portrait and media cards. Desktop pointers only; touch devices get a CSS sway.
if(!window.matchMedia||!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var ph=document.querySelector('.hero .ph'),hero=document.querySelector('.hero');
if(ph&&hero&&hero.querySelector('.hs')){var raf=0;
 hero.addEventListener('pointermove',function(e){if(raf)return;raf=requestAnimationFrame(function(){raf=0;var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;ph.style.setProperty('--ry',(x*22-4).toFixed(2)+'deg');ph.style.setProperty('--rx',(-y*14).toFixed(2)+'deg')})});
 hero.addEventListener('pointerleave',function(){ph.style.removeProperty('--ry');ph.style.removeProperty('--rx')})}
[].forEach.call(document.querySelectorAll('.vc,.gg .gi'),function(el){el.classList.add('tilt');
 el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.setProperty('--ty',(x*9).toFixed(2)+'deg');el.style.setProperty('--tx',(-y*9).toFixed(2)+'deg')});
 el.addEventListener('pointerleave',function(){el.style.removeProperty('--tx');el.style.removeProperty('--ty')})});
})();
