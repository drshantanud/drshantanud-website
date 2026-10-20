(function(){
function ld(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var FAV=ld('rf_fav',[]),PLAN=ld('rf_plan',{breakfast:[],lunch:[],dinner:[],snack:[]});
var L={breakfast:'Breakfast',lunch:'Lunch',dinner:'Dinner',snack:'Snack'};
function favUI(b){var on=FAV.indexOf(b.dataset.fav)>-1;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);b.innerHTML=on?'&#9829; Saved to favourites':'&#9825; Add to favourites'}
function mealUI(b){var on=(PLAN[b.dataset.meal]||[]).indexOf(b.dataset.id)>-1;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);b.innerHTML=(on?'&#10003; ':'+ ')+L[b.dataset.meal]}
document.querySelectorAll('[data-fav]').forEach(favUI);document.querySelectorAll('[data-meal]').forEach(mealUI);
document.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
 if(b.dataset.fav){var i=FAV.indexOf(b.dataset.fav);if(i>-1)FAV.splice(i,1);else FAV.push(b.dataset.fav);sv('rf_fav',FAV);favUI(b)}
 else if(b.dataset.meal){var a=PLAN[b.dataset.meal]=PLAN[b.dataset.meal]||[],j=a.indexOf(b.dataset.id);if(j>-1)a.splice(j,1);else a.push(b.dataset.id);sv('rf_plan',PLAN);mealUI(b)}
 else if(b.id==='rf-printbtn')window.print()});
})();
