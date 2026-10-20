(function(){
'use strict';
var app=document.getElementById('rf-app');if(!app)return;
function $(s,r){return (r||document).querySelector(s)}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
if(!window.RF_RECIPES||!window.RF_ING){app.innerHTML='<div class="rf-state rf-err" role="alert"><b>Recipes could not be loaded.</b><p>Please refresh the page. If the problem continues, contact the clinic.</p></div>';return}
var I=window.RF_ING,RECIPES=window.RF_RECIPES,PICK=window.RF_PICK;
var REG={maha:'Maharashtrian',guj:'Gujarati',south:'South Indian',north:'North Indian',punjabi:'Punjabi',raj:'Rajasthani',beng:'Bengali',other:'Other Indian regional',mixed:'Mixed Indian'};
var REGORDER=['maha','guj','south','north','punjabi','raj','beng','other','mixed'];
var TASTE={savoury:'Savoury',spicy:'Spicy','non-spicy':'Non-spicy',sweetish:'Sweetish',tangy:'Tangy'};
var SPICE={mild:'Mild',medium:'Medium',hot:'Hot'};
var METHOD={pressure:'Pressure-cooked',steamed:'Steamed',roasted:'Roasted',grilled:'Grilled',sauteed:'Sautéed',airfried:'Air-fried',nocook:'No-cook / fresh'};
var NUT={hp:'High protein per serving',plc:'Higher protein, lower calories',bal:'Balanced everyday nutrition',lowoil:'Lower oil',fibre:'Higher fibre',diab:'Diabetic-friendly options'};
var NUTHELP={hp:'15 g or more protein per serving',plc:'10 g or more protein, 300 kcal or fewer, and at least 20% of calories from protein',bal:'150 to 320 kcal, 8 to 25 g protein, 4 g or more fibre, fat under 35% of calories',lowoil:'5 g or less added oil or ghee per serving',fibre:'6 g or more fibre per serving',diab:'38 g or less carbohydrate and 4 g or more fibre per serving, with no jaggery or dates; general guidance only'};
var MEALS={breakfast:'Breakfast',lunch:'Lunch',dinner:'Dinner',snack:'Snack'};
/* ---------- storage ---------- */
function ld(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}}
function sv(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var FAV=ld('rf_fav',[]),PLAN=ld('rf_plan',{breakfast:[],lunch:[],dinner:[],snack:[]});
/* ---------- nutrition engine ---------- */
function calc(r){
 var t={k:0,p:0,c:0,f:0,fi:0,fat:0},rows=[],hasSweet=false,vegbad=false;
 r.ing.forEach(function(row){var x=I[row[0]];if(!x){return}
  var g=row[1],m=g/100,k=x[2]*m,p=x[3]*m,c=x[4]*m,f=x[5]*m,fi=x[6]*m;
  t.k+=k;t.p+=p;t.c+=c;t.f+=f;t.fi+=fi;if(x[9]==='f')t.fat+=g;if(row[0]==='jaggery'||row[0]==='dates')hasSweet=true;
  rows.push({id:row[0],name:x[0],state:x[1],g:g,hh:hh(row[0],g),sp:row[3]==='s',p:p/r.sv,k:k/r.sv})});
 var s=r.sv;
 r.n={k:Math.round(t.k/s),p:t.p/s,c:t.c/s,f:t.f/s,fi:t.fi/s,fat:t.fat/s,total:t,rows:rows,sweet:hasSweet};
 var n=r.n;
 r.flag={hp:n.p>=15,plc:n.p>=10&&n.k<=300&&(n.p*4/n.k)>=0.2,bal:n.k>=150&&n.k<=320&&n.p>=8&&n.p<=25&&n.fi>=4&&(n.f*9/n.k)<0.35,lowoil:n.fat<=5,fibre:n.fi>=6,diab:n.c<=38&&n.fi>=4&&!n.sweet&&n.p>=8};
}
RECIPES.forEach(calc);
function fr(q){var w=Math.floor(q+1e-9),f=q-w,s='';
 if(f<0.125){s=''}else if(f<0.29){s='¼'}else if(f<0.42){s='⅓'}else if(f<0.62){s='½'}else if(f<0.88){s='¾'}else{w+=1}
 return (w?w:'')+s||'¼'}
function hh(id,g){var x=I[id],u=x[7],w=x[8],q=g/u;if(x[9]==='f'||id==='spice'||id==='sesame'||id==='chia'||id==='pumpkinseed'||true){}
 var qq=Math.round(q*4)/4;if(qq<0.25)qq=0.25;var words=w.split(' '),plural=qq>1;
 if(plural){var i=(words[0]==='medium'||words[0]==='small'||w==='inch piece')?words.length-1:0;var a=words[i];if(!/(s|tsp|tbsp)$/.test(a)){if(!(a==='tsp'||a==='tbsp'))words[i]=a+'s'}}
 return fr(qq)+' '+words.join(' ')}
function gstr(n){return n>=10?Math.round(n):n.toFixed(1)}
/* ---------- illustration ---------- */
var COL={paneer:'#f3e6c4',lfpaneer:'#f3e6c4',tofu:'#f1e7cf',curd:'#f6f2e6',moongdal:'#e8c940',moongw:'#9bbf5b',masoor:'#d9772b',toor:'#e3b53a',chanadal:'#d9a42f',urad:'#e8dcc0',rajma:'#8e2f2a',chickpea:'#d9b36a',kchana:'#4a3426',matki:'#8c6a3b',soybean:'#d8c58a',soyachunk:'#b88a4a',peanut:'#c98f55',oats:'#d8c9a6',ragi:'#7a4d3a',jowar:'#d9c08a',bajra:'#a0987c',besan:'#e6c15a',spinach:'#2f7d3c',sweetpotato:'#d9792e',methi:'#4f8f3e',lauki:'#b8d68a',chia:'#8b8b8b'};
function art(r){var order=r.ing.slice().sort(function(a,b){return b[1]-a[1]}),c1='#d9a42f',c2='#7aa65a';
 for(var i=0;i<order.length;i++){if(COL[order[i][0]]){c1=COL[order[i][0]];break}}
 var vi=order.filter(function(o){return ['spinach','methi','lauki','peas','capsicum','cucumber','carrot','tomato','cabbage','beans','cauli'].indexOf(o[0])>-1})[0];
 if(vi)c2={spinach:'#2f7d3c',methi:'#4f8f3e',lauki:'#b8d68a',peas:'#6fae4a',capsicum:'#5a9a3a',cucumber:'#8fc27a',carrot:'#e07b2a',tomato:'#d8442f',cabbage:'#9bc98a',beans:'#6aa84f',cauli:'#eee8d4'}[vi[0]];
 var h=0,i2;for(i2=0;i2<r.id.length;i2++)h=(h*31+r.id.charCodeAt(i2))>>>0;var d='',k;
 for(k=0;k<9;k++){var a=((h>>(k*3))&7)/7*6.28+k,rad=14+((h>>(k+4))&15)*1.7;d+='<circle cx="'+(100+Math.cos(a)*rad).toFixed(1)+'" cy="'+(100+Math.sin(a)*rad*0.8).toFixed(1)+'" r="'+(5+(k%3)*2)+'" fill="'+(k%2?c2:c1)+'" opacity=".9"/>'}
 return '<svg viewBox="0 0 200 200" role="img" aria-label="Illustration of '+esc(r.name)+'"><rect width="200" height="200" fill="#eaf5f4"/><ellipse cx="100" cy="112" rx="78" ry="62" fill="#fff" stroke="#c4dcda" stroke-width="3"/><ellipse cx="100" cy="106" rx="62" ry="46" fill="'+c1+'"/>'+d+'<path d="M66 60c6-14-6-14 0-28M100 54c6-14-6-14 0-28M134 60c6-14-6-14 0-28" stroke="#9bb9b6" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/></svg>'}
/* ---------- state ---------- */
var S={ing:{},reg:{},taste:'',spice:'',nut:{},time:0,method:'',sort:'match',q:''};
function nsel(o){return Object.keys(o).length}
function pickMatch(r,p){var m=p[3];
 if(m==='MIX')return r.ing.filter(function(x){return x[3]==='s'}).length>=2;
 if(typeof m==='string'&&m.indexOf('SPR:')===0){var id=m.slice(4);return r.ing.some(function(x){return x[0]===id&&x[3]==='s'})}
 return r.ing.some(function(x){return m.indexOf(x[0])>-1})}
function evalR(r){var sc=0,un=[],ok=0,tot=0,hit=[];
 PICK.forEach(function(p){if(!S.ing[p[0]])return;tot++;if(pickMatch(r,p)){ok++;sc+=10;hit.push(p[1])}else un.push('does not contain '+p[1].toLowerCase())});
 var regs=Object.keys(S.reg);if(regs.length){if(regs.some(function(g){return r.r.indexOf(g)>-1}))sc+=8;else un.push('is not tagged '+regs.map(function(g){return REG[g]}).join(' or ')+' cuisine')}
 if(S.taste){if(r.t.indexOf(S.taste)>-1)sc+=5;else un.push('taste is not '+TASTE[S.taste].toLowerCase())}
 if(S.spice){if(r.sp===S.spice)sc+=3;else un.push('spice level is '+r.sp+', not '+S.spice)}
 Object.keys(S.nut).forEach(function(k){if(r.flag[k])sc+=5;else un.push('does not meet "'+NUT[k].toLowerCase()+'"')});
 if(S.time){if(r.tm<=S.time)sc+=3;else un.push('takes '+r.tm+' min (you chose up to '+S.time+')')}
 if(S.method){if(r.m.indexOf(S.method)>-1)sc+=3;else un.push('is not '+METHOD[S.method].toLowerCase())}
 sc+=r.n.p/100;return {r:r,score:sc,un:un,ok:ok,tot:tot,hit:hit}}
function sorter(a,b){var k=S.sort;
 if(k==='protein')return b.r.n.p-a.r.n.p;if(k==='kcal')return a.r.n.k-b.r.n.k;if(k==='time')return a.r.tm-b.r.tm||b.score-a.score;
 return b.score-a.score}
function anyFilter(){return nsel(S.ing)||nsel(S.reg)||S.taste||S.spice||nsel(S.nut)||S.time||S.method}
function results(){var all=RECIPES.map(evalR),exact=[],near=[];
 all.forEach(function(e){if(!e.un.length)exact.push(e);else{var some=e.score-e.r.n.p/100>0;if(S.ing&&nsel(S.ing)&&e.ok===0)some=false;if(some)near.push(e)}});
 exact.sort(sorter);near.sort(function(a,b){return a.un.length-b.un.length||sorter(a,b)});return {exact:exact,near:near}}
/* ---------- views ---------- */
function chips(r){return '<span class="rf-chip">'+esc(r.r.map(function(g){return REG[g]}).join(' / '))+'</span><span class="rf-chip">'+esc(r.t.map(function(t){return TASTE[t]}).join(', '))+'</span><span class="rf-chip">'+esc(SPICE[r.sp])+' spice</span>'+(r.mod?'<span class="rf-chip rf-mod">Modern adaptation</span>':'')}
function card(e,relaxed){var r=e.r,n=r.n,fav=FAV.indexOf(r.id)>-1;
 return '<article class="rf-card"><a class="rf-img" href="/recipes/'+r.id+'/" aria-label="Open '+esc(r.name)+'">'+art(r)+'</a><div class="rf-cb"><h3><a href="/recipes/'+r.id+'/">'+esc(r.name)+'</a></h3><div class="rf-chips">'+chips(r)+'</div>'+
 '<dl class="rf-nut"><div><dt>Protein</dt><dd>'+gstr(n.p)+' g</dd></div><div><dt>Calories</dt><dd>'+n.k+'</dd></div><div><dt>Carbs</dt><dd>'+gstr(n.c)+' g</dd></div><div><dt>Fat</dt><dd>'+gstr(n.f)+' g</dd></div><div><dt>Fibre</dt><dd>'+gstr(n.fi)+' g</dd></div></dl>'+
 '<p class="rf-meta">'+r.tm+' min &middot; '+esc(r.df)+' &middot; per serving (serves '+r.sv+')</p>'+
 (e.tot?'<p class="rf-match">Matches '+e.ok+' of '+e.tot+' selected ingredient'+(e.tot>1?'s':'')+'</p>':'')+
 (relaxed&&e.un.length?'<p class="rf-relax"><b>Relaxed:</b> this recipe '+esc(e.un.join('; '))+'.</p>':'')+
 '<div class="rf-acts"><a class="btn s" href="/recipes/'+r.id+'/">View recipe</a><button type="button" class="btn o s rf-fav'+(fav?' on':'')+'" data-fav="'+r.id+'" aria-pressed="'+fav+'">'+(fav?'Saved':'Save')+'</button></div></div></article>'}
function homeV(){
 return '<div class="rf-hero"><h1 class="h2">Healthy Protein Recipe Finder</h1><p class="diet-intro">Discover healthy vegetarian recipes using ingredients you love.</p>'+
 '<div class="rf-hbtn"><a class="btn" href="#/find">Find Recipes</a><a class="btn o" href="#/find/region">Browse by Region</a><a class="btn o" href="#/find/protein">Browse by Protein</a><a class="btn o" href="#/saved">Saved Recipes'+(FAV.length?' ('+FAV.length+')':'')+'</a></div>'+
 '<ul class="rf-pts"><li><b>'+RECIPES.length+'</b> vegetarian recipes (no egg, no meat)</li><li>Nutrition <b>calculated</b> from every ingredient, per serving</li><li>Filter by protein source, region, taste, spice, time and diet goals</li></ul></div>'+
 '<h2 class="rf-h2">Popular starting points</h2><div class="rf-grid">'+RECIPES.filter(function(r){return r.n.p>=15||r.flag.plc}).slice(0,6).map(function(r){return card({r:r,un:[],ok:0,tot:0})}).join('')+'</div>'+disc()}
function disc(){return '<p class="rf-disc"><b>Please note:</b> Nutrition values are estimates calculated from typical ingredient data ('+esc(window.RF_SRC)+') and vary with brands, varieties and how you cook. The filters (including &ldquo;diabetic-friendly&rdquo;) are general guidance, not medical advice. People with diabetes, kidney disease, allergies or other medical needs should follow their own doctor&rsquo;s or dietitian&rsquo;s advice.</p>'}
function pickHtml(){var g='',out='';
 PICK.forEach(function(p){if(p[2]!==g){if(g)out+='</div></fieldset>';g=p[2];out+='<fieldset class="rf-grp" data-grp="'+esc(g)+'"><legend>'+esc(g)+'</legend><div class="rf-pills">'}
  var hide=S.q&&p[1].toLowerCase().indexOf(S.q.toLowerCase())<0;
  out+='<label class="rf-pill'+(S.ing[p[0]]?' on':'')+'"'+(hide?' hidden':'')+'><input type="checkbox" data-ing="'+p[0]+'"'+(S.ing[p[0]]?' checked':'')+'>'+esc(p[1])+'</label>'});
 return out+'</div></fieldset>'}
function sel(id,label,opts,val){return '<div class="diet-field"><label for="'+id+'">'+label+'</label><select id="'+id+'">'+opts.map(function(o){return '<option value="'+o[0]+'"'+(String(val)===String(o[0])?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></div>'}
function findV(focus){
 var regs=REGORDER.map(function(k){return '<label class="rf-pill'+(S.reg[k]?' on':'')+'"><input type="checkbox" data-reg="'+k+'"'+(S.reg[k]?' checked':'')+'>'+REG[k]+'</label>'}).join('');
 var nuts=Object.keys(NUT).map(function(k){return '<label class="rf-pill rf-nutp'+(S.nut[k]?' on':'')+'" title="'+esc(NUTHELP[k])+'"><input type="checkbox" data-nut="'+k+'"'+(S.nut[k]?' checked':'')+'>'+NUT[k]+'</label>'}).join('');
 var h='<p class="rf-back"><a href="#/">&larr; Recipe Finder home</a></p><h1 class="h2">Find Recipes</h1><div class="rf-filters">'+
 '<div id="rf-protein" class="rf-sec"><h2 class="rf-h3">1. Protein ingredients</h2><div class="rf-srow"><input id="rf-q" type="search" placeholder="Search ingredients (e.g. moong, paneer)" value="'+esc(S.q)+'" aria-label="Search ingredients"><button class="btn o s" type="button" id="rf-clear">Clear all</button></div><p class="rf-hint">Select one or several. Each selected ingredient must actually be in the recipe to count as a match.</p>'+pickHtml()+'</div>'+
 '<div id="rf-region" class="rf-sec"><h2 class="rf-h3">2. Regional cuisine</h2><div class="rf-pills">'+regs+'</div></div>'+
 '<div class="rf-sec"><h2 class="rf-h3">3. Taste and spice</h2><div class="diet-grid">'+sel('rf-taste','Taste profile',[['','Any taste']].concat(Object.keys(TASTE).map(function(k){return [k,TASTE[k]]})),S.taste)+sel('rf-spice','Spice intensity',[['','Any spice level']].concat(Object.keys(SPICE).map(function(k){return [k,SPICE[k]]})),S.spice)+'</div></div>'+
 '<div class="rf-sec"><h2 class="rf-h3">4. Nutrition and cooking</h2><div class="rf-pills">'+nuts+'</div><div class="diet-grid">'+sel('rf-time','Total time',[[0,'Any time'],[15,'Up to 15 minutes'],[30,'Up to 30 minutes'],[45,'Up to 45 minutes']],S.time)+sel('rf-method','Cooking method',[['','Any method']].concat(Object.keys(METHOD).map(function(k){return [k,METHOD[k]]})),S.method)+'</div></div></div>'+
 '<div id="rf-res" aria-live="polite"></div>';
 return h}
function resHtml(){var R=results(),h='',ex=R.exact,nr=R.near;
 var ssel='<div class="diet-field rf-sort"><label for="rf-sort">Sort by</label><select id="rf-sort">'+[['match','Best match'],['protein','Protein (high to low)'],['kcal','Calories (low to high)'],['time','Preparation time (shortest)']].map(function(o){return '<option value="'+o[0]+'"'+(S.sort===o[0]?' selected':'')+'>'+o[1]+'</option>'}).join('')+'</select></div>';
 h+='<div class="rf-rh"><h2 class="rf-h2">'+(anyFilter()?(ex.length?ex.length+' matching recipe'+(ex.length>1?'s':''):'No exact match'):'All '+RECIPES.length+' recipes')+'</h2>'+ssel+'</div>';
 if(ex.length)h+='<div class="rf-grid">'+ex.map(function(e){return card(e)}).join('')+'</div>';
 if(!ex.length){h+='<div class="rf-state"><b>No recipe matches every choice.</b><p>'+(nr.length?'Here are the closest recipes. Each card says which of your choices was relaxed.':'Try removing one or two filters, or clear all and start again.')+'</p></div>'}
 if(nr.length&&(ex.length<6)){var lim=nr.slice(0,ex.length?6:12);h+='<h2 class="rf-h2">'+(ex.length?'Near matches':'Closest recipes')+'</h2><div class="rf-grid">'+lim.map(function(e){return card(e,true)}).join('')+'</div>'}
 if(S.reg.other&&!RECIPES.some(function(r){return r.r.indexOf('other')>-1}))h+='<p class="rf-hint">No recipes are tagged &ldquo;Other Indian regional cuisines&rdquo; yet; more regions will be added.</p>';
 return h+disc()}
function detailV(id){var r=RECIPES.filter(function(x){return x.id===id})[0];
 if(!r)return '<div class="rf-state rf-err" role="alert"><b>Recipe not found.</b><p><a href="#/find">Back to all recipes</a></p></div>';
 var n=r.n,fav=FAV.indexOf(r.id)>-1,t=n.total;
 var rows=n.rows.map(function(x){return '<tr><td>'+esc(x.name)+(x.sp?' <small>(dry weight, sprouted before cooking)</small>':'')+'<small class="rf-st"> '+esc(x.state)+'</small></td><td>'+gstr(x.g)+' g</td><td>'+esc(x.hh)+'</td><td>'+(x.p>=0.05?x.p.toFixed(1)+' g':'&lt; 0.1 g')+'</td></tr>'}).join('');
 var meals=Object.keys(MEALS).map(function(k){var on=PLAN[k].indexOf(r.id)>-1;return '<button type="button" class="btn o s rf-meal'+(on?' on':'')+'" data-meal="'+k+'" data-id="'+r.id+'" aria-pressed="'+on+'">'+(on?'&#10003; ':'+ ')+MEALS[k]+'</button>'}).join('');
 var pct=function(x,k){return Math.round(x*k/n.k*100)};
 return '<article class="rf-det" id="rf-print"><p class="rf-back rf-np"><a href="#/find">&larr; Back to recipes</a></p>'+
 '<div class="rf-dh"><div class="rf-dimg">'+art(r)+'<small class="rf-np">Original illustration, not a photograph</small></div><div><h1 class="h2">'+esc(r.name)+'</h1><div class="rf-chips">'+chips(r)+'</div><p>'+esc(r.d)+'</p><p class="rf-bg"><b>Regional background:</b> '+esc(r.bg)+'</p>'+
 '<p class="rf-meta">Serves '+r.sv+' &middot; Total time '+r.tm+' min &middot; '+esc(r.df)+' &middot; Method: '+r.m.map(function(m){return METHOD[m]}).join(', ')+(r.soak?'<br>Advance preparation: '+esc(r.soak):'')+'<br>Equipment: '+(r.m.indexOf('pressure')>-1?'pressure cooker, ':'')+(r.m.indexOf('steamed')>-1?'steamer, ':'')+(r.m.indexOf('grilled')>-1||r.m.indexOf('airfried')>-1?'grill or air fryer, ':'')+'kadhai or non-stick pan, knife and chopping board</p>'+
 '<div class="rf-acts rf-np"><button type="button" class="btn s rf-fav'+(fav?' on':'')+'" data-fav="'+r.id+'" aria-pressed="'+fav+'">'+(fav?'&#9829; Saved to favourites':'&#9825; Add to favourites')+'</button><button type="button" class="btn o s" id="rf-printbtn">Print / Save as PDF</button></div>'+
 '<p class="rf-np rf-hint" style="margin-top:.8rem">Add to a meal:</p><div class="rf-acts rf-np">'+meals+'</div></div></div>'+
 '<h2 class="rf-h3">Nutrition per serving (estimated)</h2><dl class="rf-nut rf-nutbig"><div><dt>Calories</dt><dd>'+n.k+' kcal</dd></div><div><dt>Protein</dt><dd>'+gstr(n.p)+' g</dd></div><div><dt>Carbohydrate</dt><dd>'+gstr(n.c)+' g</dd></div><div><dt>Fat</dt><dd>'+gstr(n.f)+' g</dd></div><div><dt>Fibre</dt><dd>'+gstr(n.fi)+' g</dd></div></dl>'+
 '<p class="rf-hint">Calories from protein '+pct(n.p,4)+'%, carbohydrate '+pct(n.c,4)+'%, fat '+pct(n.f,9)+'% (approx.). Totals for the whole recipe: '+Math.round(t.k)+' kcal, '+Math.round(t.p)+' g protein, divided by '+r.sv+' servings.</p>'+
 '<h2 class="rf-h3">Ingredients (for '+r.sv+' servings)</h2><div class="rf-tw"><table class="rf-table"><thead><tr><th>Ingredient</th><th>Quantity</th><th>Household measure</th><th>Protein per serving</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
 '<p class="rf-hint">Quantities are in the raw or dry state shown, so water absorbed during cooking is not counted twice. Also used, not counted in nutrition (negligible): '+esc((r.free||[]).join(', '))+'.</p>'+
 '<h2 class="rf-h3">Method</h2><ol class="rf-steps">'+r.st.map(function(s){return '<li>'+esc(s)+'</li>'}).join('')+'</ol>'+
 '<div class="rf-two"><div><h2 class="rf-h3">Substitutions</h2><ul>'+r.sub.map(function(s){return '<li>'+esc(s)+'</li>'}).join('')+'</ul></div><div><h2 class="rf-h3">Tips</h2><ul>'+r.tip.map(function(s){return '<li>'+esc(s)+'</li>'}).join('')+(n.fat>5?'<li>To reduce oil, cook in a non-stick pan and measure the oil with a teaspoon.</li>':'')+(n.p<12?'<li>To raise protein, serve with curd, a small portion of paneer or tofu, or a bowl of dal or sprouts.</li>':'')+'</ul></div></div>'+
 '<h2 class="rf-h3">Storage and reheating</h2><p>'+esc(r.sto)+'</p>'+
 '<p class="rf-disc">Nutrition values are estimates calculated from typical ingredient data ('+esc(window.RF_SRC)+') and vary with brands and cooking. For general information only. Dr. Shantanu Deshpande &middot; drshantanudeshpande.com</p></article>'}
function savedV(){
 var fav=FAV.map(function(id){return RECIPES.filter(function(r){return r.id===id})[0]}).filter(Boolean);
 var h='<p class="rf-back"><a href="#/">&larr; Recipe Finder home</a></p><h1 class="h2">Saved Recipes</h1>';
 h+='<p class="rf-hint">Saved only in this browser on this device. Nothing is sent anywhere.</p><h2 class="rf-h2">Favourites</h2>';
 h+=fav.length?'<div class="rf-grid">'+fav.map(function(r){return card({r:r,un:[],ok:0,tot:0})}).join('')+'</div>':'<div class="rf-state"><b>No favourites yet.</b><p>Tap Save on any recipe to keep it here.</p><a class="btn s" href="#/find">Find Recipes</a></div>';
 h+='<h2 class="rf-h2">My meals</h2><div class="rf-meals">';
 Object.keys(MEALS).forEach(function(k){var rs=PLAN[k].map(function(id){return RECIPES.filter(function(r){return r.id===id})[0]}).filter(Boolean),p=0,c=0;rs.forEach(function(r){p+=r.n.p;c+=r.n.k});
  h+='<div class="rf-mb"><h3>'+MEALS[k]+'</h3>'+(rs.length?'<ul>'+rs.map(function(r){return '<li><a href="/recipes/'+r.id+'/">'+esc(r.name)+'</a> <button type="button" class="rf-x" data-unmeal="'+k+'" data-id="'+r.id+'" aria-label="Remove '+esc(r.name)+'">&times;</button></li>'}).join('')+'</ul><p class="rf-hint"><b>'+gstr(p)+' g protein, '+Math.round(c)+' kcal</b> (one serving of each)</p>':'<p class="rf-hint">Nothing added yet.</p>')+'</div>'});
 return h+'</div>'+disc()}
/* ---------- render + events ---------- */
function setRes(){var el=$('#rf-res');if(el)el.innerHTML=resHtml()}
function render(){var hash=location.hash||'#/',m;app.setAttribute('aria-busy','false');var focus='';
 if((m=hash.match(/^#\/recipe\/([\w-]+)/))){if(RECIPES.some(function(r){return r.id===m[1]})){location.replace('/recipes/'+m[1]+'/');return}app.innerHTML=detailV(m[1]);document.title=(RECIPES.filter(function(r){return r.id===m[1]})[0]||{name:'Recipe'}).name+' | Healthy Protein Recipe Finder';window.scrollTo(0,0)}
 else if(hash.indexOf('#/find')===0){focus=hash.split('/')[2]||'';app.innerHTML=findV();setRes();document.title='Find Recipes | Healthy Protein Recipe Finder';if(focus==='region'||focus==='protein'){var t=$('#rf-'+focus);if(t)t.scrollIntoView({block:'start'})}else window.scrollTo(0,0)}
 else if(hash==='#/saved'){app.innerHTML=savedV();document.title='Saved Recipes | Healthy Protein Recipe Finder';window.scrollTo(0,0)}
 else{app.innerHTML=homeV();document.title='Healthy Protein Recipe Finder | Dr. Shantanu Deshpande';window.scrollTo(0,0)}}
function refreshFavButtons(id){document.querySelectorAll('[data-fav="'+id+'"]').forEach(function(b){var on=FAV.indexOf(id)>-1,big=!!b.closest('.rf-det');b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);b.innerHTML=big?(on?'&#9829; Saved to favourites':'&#9825; Add to favourites'):(on?'Saved':'Save')})}
app.addEventListener('change',function(e){var t=e.target,k;
 if(t.dataset.ing){if(t.checked)S.ing[t.dataset.ing]=1;else delete S.ing[t.dataset.ing];t.closest('.rf-pill').classList.toggle('on',t.checked);setRes()}
 else if(t.dataset.reg){if(t.checked)S.reg[t.dataset.reg]=1;else delete S.reg[t.dataset.reg];t.closest('.rf-pill').classList.toggle('on',t.checked);setRes()}
 else if(t.dataset.nut){if(t.checked)S.nut[t.dataset.nut]=1;else delete S.nut[t.dataset.nut];t.closest('.rf-pill').classList.toggle('on',t.checked);setRes()}
 else if(t.id==='rf-taste'){S.taste=t.value;setRes()}else if(t.id==='rf-spice'){S.spice=t.value;setRes()}
 else if(t.id==='rf-time'){S.time=+t.value;setRes()}else if(t.id==='rf-method'){S.method=t.value;setRes()}
 else if(t.id==='rf-sort'){S.sort=t.value;setRes()}});
app.addEventListener('input',function(e){if(e.target.id==='rf-q'){S.q=e.target.value;var q=S.q.toLowerCase();app.querySelectorAll('[data-ing]').forEach(function(c){var l=c.closest('.rf-pill');l.hidden=!!q&&l.textContent.toLowerCase().indexOf(q)<0});app.querySelectorAll('.rf-grp').forEach(function(g){g.hidden=!g.querySelector('.rf-pill:not([hidden])')})}});
app.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
 if(b.id==='rf-clear'){S={ing:{},reg:{},taste:'',spice:'',nut:{},time:0,method:'',sort:'match',q:''};var y=window.scrollY;app.innerHTML=findV();setRes();window.scrollTo(0,y)}
 else if(b.dataset.fav){var id=b.dataset.fav,i=FAV.indexOf(id);if(i>-1)FAV.splice(i,1);else FAV.push(id);sv('rf_fav',FAV);refreshFavButtons(id)}
 else if(b.dataset.meal){var k=b.dataset.meal,id2=b.dataset.id,j=PLAN[k].indexOf(id2);if(j>-1)PLAN[k].splice(j,1);else PLAN[k].push(id2);sv('rf_plan',PLAN);b.classList.toggle('on',j<0);b.setAttribute('aria-pressed',j<0);b.innerHTML=(j<0?'&#10003; ':'+ ')+MEALS[k]}
 else if(b.dataset.unmeal){var k2=b.dataset.unmeal,j2=PLAN[k2].indexOf(b.dataset.id);if(j2>-1)PLAN[k2].splice(j2,1);sv('rf_plan',PLAN);app.innerHTML=savedV()}
 else if(b.id==='rf-printbtn'){window.print()}});
window.addEventListener('hashchange',render);
render();
})();
