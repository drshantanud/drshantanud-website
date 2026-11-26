(function(){
// Nutrition estimates for the Diet Planner.
// Cooked-dish values per 100 g: Indian Nutrient Databank (INDB, Anuvaad), release 2024.11 (food codes kept below).
// Basic foods INDB does not list on their own (paneer, curd, tofu, fruit, nuts, roasted chana, whey, millet flours, oil) and a few
// regional dishes it lacks (oats upma, thalipeeth, adai, ragi dosa, muthia, usal, plain kadhi, generic sabzi) use typical reference values (src "REF").
// Each entry: [kcal, protein g, carb g, fat g, fibre g] per 100 g, grams per usual portion, source code.
var T={"banana milkshake":[65.3, 1.84, 9.15, 2.37, 0.26, 250, "ASC016"],"peanut chikki":[320.5, 6.94, 47.46, 11.13, 2.63, 25, "ASC382"],"moong chilla":[154.9,6.97,19.42,5.11,4.25,60,"BFP046"],"stuffed moong chilla":[154.9,6.97,19.42,5.11,4.25,75,"BFP046"],"besan chilla":[135.9,7.8,21.03,2.85,4.25,60,"OSR100"],"stuffed besan chilla":[135.9,7.8,21.03,2.85,4.25,75,"OSR100"],"vegetable poha":[180.5,4.89,21.52,8.07,3.76,180,"BFP045"],"vegetable upma":[146.5,4.73,16.46,6.63,4.19,180,"BFP043"],"vegetable dalia":[167.5,7.56,22.35,5.52,3.74,180,"ASC490"],"pesarattu":[286.0,12.32,31.91,11.67,6.04,80,"OSR103"],"dosa":[380.9,10.34,64.08,8.43,5.23,40,"BFP148"],"idli":[137.5,4.64,28.18,0.33,2.31,40,"ASC144"],"handvo":[207.1,8.24,31.86,4.8,4.95,100,"OSR146"],"dhokla":[216.5,13.45,30.68,5.28,4.95,40,"ASC474"],"besan dhokla":[216.5,13.45,30.68,5.28,4.95,40,"ASC474"],"thepla":[346.2,8.98,41.34,15.95,7.56,40,"OSR104"],"methi thepla":[346.2,8.98,41.34,15.95,7.56,40,"OSR104"],"vegetable paratha":[178.1,3.73,18.84,9.47,4.68,100,"ASC100"],"sprouts chaat":[83.1,4.74,13.96,0.84,2.96,150,"ASC258"],"egg bhurji":[156.0,10.29,1.35,12.21,0.24,60,"ASC059"],"boiled eggs":[45.4,4.43,0.12,3.04,0.11,151,"ASC056"],"egg omelette":[272.4,9.66,0.64,25.74,0.12,55,"ASC061"],"egg curry":[117.5,5.38,4.03,8.81,2.09,200,"BFP240"],"chicken curry":[129.2,11.79,3.38,7.57,1.41,1,"ASC240"],"fish curry":[111.1,8.76,3.77,6.69,1.89,1,"ASC246"],"soya sabzi":[163.3,10.43,6.76,10.19,7.34,150,"ASC164"],"phulka":[202.3,5.88,35.65,3.56,6.31,36,"ASC096"],"chapati":[202.3,5.88,35.65,3.56,6.31,36,"ASC096"],"rotli":[202.3,5.88,35.65,3.56,6.31,36,"ASC096"],"varan":[52.8,2.05,4.77,2.76,1.3,150,"BFP172"],"tuvar dal":[52.8,2.05,4.77,2.76,1.3,150,"BFP172"],"moong dal":[50.0,2.68,5.91,1.68,1.17,150,"ASC151"],"chana dal":[73.3,2.79,7.1,3.6,2.72,150,"ASC153"],"masoor dal":[54.1,2.28,5.37,2.52,1.98,150,"ASC157"],"rajma":[143.7,5.95,16.38,5.77,5.83,150,"ASC165"],"sambar":[96.9,3.35,10.57,4.38,3.52,150,"ASC167"],"dal":[61.9,2.51,5.79,3.1,1.62,150,"ASC155"],"chole":[163.4,6.1,19.98,6.84,4.73,150,"ASC162"],"chana sundal":[140.7,5.67,14.11,6.61,7.99,120,"ASC161"],"kootu":[73.3,2.79,7.1,3.6,2.72,150,"ASC153"],"rasam":[26.7,1.13,3.37,0.88,1.6,150,"BFP176"],"bhindi":[110.8,1.83,4.5,9.27,3.57,120,"BFP269"],"methi":[61.9,2.1,4.17,3.81,4.43,120,"ASC174"],"gobi":[106.2,1.9,5.99,8.13,3.02,120,"ASC171"],"beans":[131.6,2.62,4.39,11.39,5.59,120,"ASC179"],"mixed vegetable":[63.9,3.24,6.24,2.64,3.99,150,"ASC173"],"salad":[49.9,1.33,3.82,3.24,1.33,100,"BFP301"],"vegetable soup":[55.2,2.22,7.6,1.55,3.01,200,"ASC480"],"buttermilk":[18.8,1.35,1.86,0.72,0.02,200,"ASC022"],"sprouts salad":[37.8,2.29,5.48,0.74,0.95,150,"ASC259"],"paneer":[258,18.3,1.2,20.8,0,0,"REF"],"curd":[60,3.1,4.0,3.4,0,150,"REF"],"greek yogurt":[73,10,4,2,0,100,"REF"],"tofu":[110,12,2,6,0.5,0,"REF"],"oil":[900,0,0,100,0,0,"REF"],"fruit":[55,0.8,13,0.3,2.5,150,"REF"],"nuts":[580,20,20,50,11,8,"REF"],"roasted chana":[369,22.5,58,5.2,17,30,"REF"],"whey protein":[400,78,9,5,0,30,"REF"],"brown rice":[112,2.6,23.5,0.9,1.8,100,"REF"],"jowar bhakri":[334,10,67.7,1.7,10,40,"REF"],"bajra bhakri":[348,11,61.8,5.4,11.5,40,"REF"],"ragi roti":[321,7.2,66.8,1.9,11.2,35,"REF"],"oats upma":[120,4,17,4,3,180,"REF"],"sprouts usal":[105,6.5,13,3,4,150,"REF"],"thalipeeth":[230,7,32,8,5,70,"REF"],"adai":[220,9,30,7,5,80,"REF"],"ragi dosa":[185,4.5,30,5,4.5,70,"REF"],"muthia":[185,6,26,6,4,30,"REF"],"kadhi":[60,2,6,3,0.3,200,"REF"],"sabzi":[60,1.7,6,3.3,2.5,120,"REF"],"matki usal":[105,6.5,13,3,4,150,"REF"]};
var ALIAS={'jowar roti':'ragi roti*jowar','bajra roti':'ragi roti*bajra','bajra rotla':'bajra bhakri','jowar rotla':'jowar bhakri','jowar thalipeeth':'thalipeeth','methi thalipeeth':'thalipeeth','vegetable oats upma':'oats upma','sprouts sundal':'sprouts usal','lauki':'sabzi','palak':'sabzi','5–6 nuts':'nuts','seasonal fruit':'fruit','greek yogurt':'greek yogurt'};
function add(t,k,g){var e=T[k];if(!e||!g)return;if(t.used.indexOf(k)<0)t.used.push(k);var f=g/100;t.k+=e[0]*f;t.p+=e[1]*f;t.c+=e[2]*f;t.f+=e[3]*f;t.fb+=e[4]*f}
function flour(t,k,n){var g=(k==='ragi roti'?35:40)*n;add(t,k,g)}
function part(t,s){
 s=s.trim().toLowerCase().replace(/^small portion\s+/,function(){t._s=.67;return ''});var sm=t._s||1;t._s=0;
 var m,g=0,n=1;
 if((m=s.match(/^(\d+)\s*g\s+(.+)$/))){g=+m[1];s=m[2]}else if((m=s.match(/^(\d+)\s+(.+)$/))){n=+m[1];s=m[2]}
 if(s==='5–6 nuts'||s==='nuts'){add(t,'nuts',8);return}
 if(/^(egg|boiled eggs?)$/.test(s)){add(t,'boiled eggs',151*n);return}
 if(s==='egg bhurji'||s==='egg omelette'){add(t,s,T[s][5]*n);return}
 if(/^(paneer|tofu)( bhurji| sabzi)?$/.test(s)){var b=s.split(' ')[0],w=g||(b==='paneer'?50:80);add(t,b,w);add(t,'oil',s.indexOf(' ')>0?5:3);if(/sabzi$/.test(s))add(t,'sabzi',100);return}
 var a=ALIAS[s];if(a){if(a.indexOf('*')>0){flour(t,'ragi roti',n);return}s=a}
 if(/^(jowar|bajra) bhakri$|^ragi roti$/.test(s)){flour(t,s,n);return}
 var v=s.match(/^(.+) (sabzi|poriyal|shaak)$/);if(v){var vk=ALIAS[v[1]]||v[1];if(!T[vk])vk='sabzi';add(t,vk,g||T[vk][5]);return}
 var e=T[s];if(!e){t.miss.push(s);return}
 add(t,s,(g||e[5]*n)*sm)}
function meal(str){var t={k:0,p:0,c:0,f:0,fb:0,miss:[],used:[]};str.split(' + ').forEach(function(x){part(t,x)});return t}

// Portion sizes behind the numbers. 1 katori = 150 ml bowl. Diameters are for a medium, home-style piece.
var SZ={
 'phulka':['g','phulka / chapati / rotli','1 piece ≈ 36 g cooked, from about 25 g atta (2 level tbsp), 15 cm (6 in) across, thin, no ghee'],
 'jowar bhakri':['g','jowar bhakri / rotla','1 piece from 40 g jowar flour (about 4 level tbsp), 18 cm (7 in) across'],
 'bajra bhakri':['g','bajra bhakri / rotla','1 piece from 40 g bajra flour (about 4 level tbsp), 18 cm (7 in) across'],
 'ragi roti':['g','ragi / jowar / bajra roti','1 piece from 35 g flour (about 3½ level tbsp), 15 cm (6 in) across'],
 'brown rice':['g','brown rice, small portion','about 65 g cooked (⅓ cup / ½ katori)'],
 'vegetable paratha':['g','vegetable paratha','1 piece ≈ 100 g, 18 cm (7 in) across, ½ tsp oil'],
 'thepla':['g','thepla','1 piece ≈ 40 g, 15 cm (6 in) across'],
 'idli':['b','idli','1 piece ≈ 40 g, 8 cm (3 in) across'],
 'dosa':['b','dosa','1 thin dosa ≈ 40 g, 20 cm (8 in) across'],
 'pesarattu':['b','pesarattu','1 piece ≈ 80 g, 20 cm (8 in) across'],
 'adai':['b','adai','1 piece ≈ 80 g, 18 cm (7 in) across'],
 'ragi dosa':['b','ragi dosa','1 piece ≈ 70 g, 18 cm (7 in) across'],
 'besan chilla':['b','besan / moong chilla','1 piece ≈ 60 g (75 g if stuffed), 15 cm (6 in) across'],
 'moong chilla':['b','besan / moong chilla','1 piece ≈ 60 g (75 g if stuffed), 15 cm (6 in) across'],
 'thalipeeth':['b','thalipeeth','1 piece ≈ 70 g, 15 cm (6 in) across'],
 'dhokla':['b','dhokla','1 piece ≈ 40 g, about 5 cm (2 in) square'],
 'muthia':['b','muthia','1 piece ≈ 30 g'],
 'handvo':['b','handvo','1 slice ≈ 100 g'],
 'vegetable poha':['b','poha / upma / dalia / oats upma','1 bowl ≈ 180 g cooked (1¼ cups)'],
 'dal':['k','dal, varan, sambar, rajma, chole, usal','1 katori ≈ 150 g'],
 'sabzi':['k','sabzi / poriyal / shaak','1 katori ≈ 120 g'],
 'curd':['k','curd','1 katori ≈ 150 g, unless grams are given'],
 'kadhi':['k','kadhi','1 katori ≈ 200 g'],
 'vegetable soup':['k','vegetable soup','1 bowl ≈ 200 ml'],
 'buttermilk':['s','buttermilk','1 glass ≈ 200 ml'],
 'fruit':['s','seasonal fruit','1 medium fruit ≈ 150 g (small portion ≈ 100 g)'],
 'nuts':['s','5–6 nuts','about 8 g (5–6 almonds or 2–3 walnut halves)'],
 'roasted chana':['s','roasted chana','30 g (about ¼ cup)'],
 'whey protein':['s','whey protein','1 scoop ≈ 30 g in water'],
 'greek yogurt':['s','Greek yogurt','100 g'],
 'salad':['k','salad','1 quarter plate ≈ 100 g'],
 'boiled eggs':['s','egg','1 large egg'],
 'paneer':['s','paneer / tofu / chicken / fish','weights shown are raw weight; cook with about 1 tsp oil'],
 'tofu':['s','paneer / tofu / chicken / fish','weights shown are raw weight; cook with about 1 tsp oil']
};
var MAP={'phulka':'phulka','chapati':'phulka','rotli':'phulka','stuffed besan chilla':'besan chilla','stuffed moong chilla':'moong chilla','besan dhokla':'dhokla','methi thepla':'thepla','vegetable upma':'vegetable poha','vegetable dalia':'vegetable poha','oats upma':'vegetable poha',
 'varan':'dal','tuvar dal':'dal','moong dal':'dal','chana dal':'dal','masoor dal':'dal','rajma':'dal','sambar':'dal','chole':'dal','chana sundal':'dal','kootu':'dal','rasam':'dal','sprouts usal':'dal','matki usal':'dal','soya sabzi':'dal','egg curry':'dal',
 'bhindi':'sabzi','methi':'sabzi','gobi':'sabzi','beans':'sabzi','mixed vegetable':'sabzi','sprouts salad':'salad','sprouts chaat':'salad','chicken curry':'paneer','fish curry':'paneer','egg bhurji':'boiled eggs','egg omelette':'boiled eggs'};
function guide(keys){var seen={},out=[],ord='gbkso';keys.forEach(function(k){var m=MAP[k]||k,e=SZ[m];if(e&&!seen[e[1]]){seen[e[1]]=1;out.push(e)}});
 out.sort(function(a,b){return ord.indexOf(a[0])-ord.indexOf(b[0])});return out}
window.DIET_NUT={meal:meal,T:T,guide:guide};
})();
