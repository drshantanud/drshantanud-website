(function(){
var D=window.CC_DATA;if(!D||/[?&]cardiocare=off\b/.test(location.search))return;
var TEL='tel:+918850974864',WA='https://wa.me/918850974864',BOOK='https://widget.eka.care?data=YmlkPTcxNzY0MTQ3NjE0NzUwOTg=';
var T={
en:{fab:'Heart FAQ',title:'Heart health FAQ',sub:'General information from Dr. Shantanu Deshpande’s clinic',
welcome:'Hello! I’m the clinic’s FAQ assistant. I share general heart-health information from a fixed set of answers. I cannot diagnose, interpret your reports or advise on medicines. In an emergency, go to the nearest heart hospital or contact your local emergency hospital number.',
ph:'Type your question…',send:'Send',topics:'Choose a topic',allTopics:'All topics',back:'Back to topics',related:'Related questions',closest:'Closest topics',
book:'Book appointment',call:'Call clinic',wa:'WhatsApp',means:'What it means',todo:'What you can do',help:'When to seek help',
close:'Close',open:'Open heart health FAQ',foot:'General education only, not medical advice. Your questions are not stored or sent anywhere.',log:'Conversation',langs:'Language'},
mr:{fab:'हृदय प्रश्नोत्तरे',title:'हृदयआरोग्य प्रश्नोत्तरे',sub:'डॉ. शंतनू देशपांडे यांच्या क्लिनिककडून सर्वसाधारण माहिती',
welcome:'नमस्कार! मी क्लिनिकचा प्रश्नोत्तर सहाय्यक आहे. मी ठरविलेल्या उत्तरांतून हृदयआरोग्याची सर्वसाधारण माहिती देतो. मी निदान करू शकत नाही, तुमच्या अहवालांचा अर्थ लावू शकत नाही किंवा औषधांबाबत सल्ला देऊ शकत नाही. आणीबाणीत जवळच्या हृदयरोग रुग्णालयात जा किंवा तुमच्या स्थानिक आपत्कालीन रुग्णालयाच्या क्रमांकावर संपर्क साधा.',
ph:'तुमचा प्रश्न लिहा…',send:'पाठवा',topics:'विषय निवडा',allTopics:'सर्व विषय',back:'विषयांकडे परत',related:'संबंधित प्रश्न',closest:'जवळचे विषय',
book:'भेटीची वेळ ठरवा',call:'क्लिनिकला फोन करा',wa:'व्हॉट्सअॅप',means:'याचा अर्थ',todo:'तुम्ही काय करू शकता',help:'मदत केव्हा घ्यावी',
close:'बंद करा',open:'हृदयआरोग्य प्रश्नोत्तरे उघडा',foot:'ही केवळ सर्वसाधारण शैक्षणिक माहिती आहे, वैद्यकीय सल्ला नाही. तुमचे प्रश्न साठवले किंवा कुठेही पाठवले जात नाहीत.',log:'संवाद',langs:'भाषा'}
};
var lang='en';
try{var sv=localStorage.getItem('cc_lang');lang=sv==='mr'||sv==='en'?sv:(/^mr/i.test(navigator.language||'')?'mr':'en')}catch(e){}

/* ---------- matching ---------- */
var STOP={what:1,is:1,are:1,the:1,an:1,of:1,do:1,does:1,my:1,me:1,to:1,how:1,can:1,why:1,should:1,and:1,in:1,for:1,with:1,or:1,it:1,on:1,be:1,after:1,about:1,from:1,have:1,has:1,need:1,long:1,people:1,common:1,tell:1,you:1,your:1};
var DEV=/[ऀ-ॿ]/;
function norm(t){return String(t).toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s]/gu,' ').replace(/\s+/g,' ').trim()}
function lev1(a,b){if(a===b)return true;if(a.length===b.length)for(var k=0;k<a.length-1;k++)if(a[k]===b[k+1]&&a[k+1]===b[k]&&a.slice(0,k)===b.slice(0,k)&&a.slice(k+2)===b.slice(k+2))return true;if(Math.abs(a.length-b.length)>1)return false;var i=0,j=0,e=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue}if(++e>1)return false;if(a.length>b.length)i++;else if(a.length<b.length)j++;else{i++;j++}}return e+(a.length-i)+(b.length-j)<=1}
function toks(s){return norm(s).split(' ').filter(function(w){return w.length>2&&!STOP[w]})}
D.faq.forEach(function(f){f.nkw=f.kw.map(function(k){return norm(k)});f.qt={en:toks(f.q.en),mr:toks(f.q.mr)}});
function score(f,q,qt){var s=0,pad=' '+q+' ';
f.nkw.forEach(function(k){var w=k.split(' ').length,hit=false;
if(DEV.test(k))hit=q.indexOf(k)>-1;else{hit=pad.indexOf(' '+k+' ')>-1;if(!hit&&w===1&&k.length>=6)hit=qt.some(function(t){return lev1(t,k)})}
if(hit)s+=1+.5*(w-1)});
['en','mr'].forEach(function(l){f.qt[l].forEach(function(t){if(DEV.test(t)?q.indexOf(t)>-1:qt.indexOf(t)>-1)s+=.5})});
return s}
function rank(text){var q=norm(text),qt=q.split(' ');return D.faq.map(function(f){return{f:f,s:score(f,q,qt)}}).filter(function(x){return x.s>0}).sort(function(a,b){return b.s-a.s})}

/* ---------- safety rules ---------- */
var SYM=[/chest (pain|pressure|tightness|heaviness|discomfort|burning)|pain in (my |the |his |her )?chest|chest (is )?(heavy|tight|paining)|heaviness in (my )?chest/,
/(severe|sudden|extreme|worst|heavy) ?(breathless\w*|shortness of breath|difficulty breathing)|(cannot|can t|cant|unable to|struggling to|difficulty in?) breathe?/,
/\b(collapsed|collapse|fainted|passed out|unconscious|blacked out|not responding)\b/,
/face (is )?drooping|face droop|slurred speech|(arm|leg|one side)\b.{0,12}\b(weak|numb)|sudden (weakness|numbness)|\bstroke\b/,
/(having|getting|got|think.{0,8}having|feel like|might be|may be).{0,12}heart attack/,
/sweat\w*.{0,25}chest|chest.{0,25}sweat\w*/,
/(chhati|chhatit|chati|chatit|chhatit)\s?\w{0,8}\s?(dukh|dukt|dabav|jad|aavalt)/,
/(khup|khoop|achanak)\s?(dam|dhap)\s?lag/,/\bbehosh\b/,
/छातीत\s*(खूप\s*)?(दुख|दाब|दडप|जड|आवळ|वेदना)|छातीदुखी/,
/(तीव्र|अचानक|खूप)\s*धाप|बेशुद्ध|भोवळ आली|चेहरा वाकडा|बोलताना अडचण|पक्षाघात/];
var NEG=/\b(no|not|without|never|free of|nahi|nasel)\b|नाही|नसते/;
var PERS=/\b(i|i m|im|i ve|ive|my|me|mine|we|mala|majha|majhya|mazya|maza|now|suddenly|just|currently|today|father|mother|husband|wife|dad|mom|brother|sister|patient)\b|मला|माझ्या|माझे|माझी|आत्ता|अचानक|बाबा|आई|वडील|पती|पत्नी/;
var EDU=/^(what|why|how|when|which|who|where|is|are|does|do|can|could|will)\b|causes?|reasons?|meaning|कारण|कोणती|कोणते|म्हणजे|काय आहे/;
function isEmergency(raw){var q=norm(raw);
for(var i=0;i<SYM.length;i++){var m=SYM[i].exec(q);if(!m)continue;
var before=q.slice(Math.max(0,m.index-25),m.index),after=q.slice(m.index+m[0].length,m.index+m[0].length+16);
if(NEG.test(before)||NEG.test(after))continue;
if(PERS.test(q)||!EDU.test(q))return true}
return false}
var ACT=/\b(stop|stopping|skip|skipping|miss|missed|missing|forgot|forget|change|changing|reduce|reducing|increase|increasing|double|start|starting|quit|discontinue|leave|dose|dosage|mg|replace|instead of|alternative)\b|बंद|थांब|सोड|डोस|बदल|चुकव|\b(bandh|band kar|thamb|sodu)\b/;
var MED=/\b(tablet|tablets|medicine|medicines|medication|drug|pill|pills|statin|statins|aspirin|ecosprin|clopidogrel|ticagrelor|prasugrel|warfarin|thinner|antiplatelet|atorvastatin|rosuvastatin|metoprolol|ramipril|telmisartan|amlodipine|sorbitrate|goli|dawa|aushadh|aushad)\b|औषध|गोळी|गोळ्या|टॅबलेट|स्टॅटिन/;
var ASKMED=/(which|what) (tablet|medicine|drug)|(can|should|may) i (take|have|use) .{0,30}(tablet|medicine|aspirin|statin|pill)|कोणती गोळी|कोणते औषध/;
function isMedication(raw){var q=norm(raw);return(ACT.test(q)&&MED.test(q)&&!/^(why|what|how does|how do)\b|नयेत|नये\b|कशासाठी/.test(q))||ASKMED.test(q)}
var DIAG=/(?<!why )\b(do i have|have i got|am i having|diagnos(e|is)|what is wrong with me|is it (a )?(heart attack|blockage|serious)|interpret|should i (have|get|undergo|go for)|do i need|am i (at risk|fit)|my (report|reports|ecg|echo|angiogram|angiography|scan|ef|ejection fraction|lipid|results?)\b)|माझा (अहवाल|रिपोर्ट|ईसीजी|इको)|माझे (अहवाल|रिपोर्ट)/;
function isDiagnosis(raw){return DIAG.test(norm(raw))}
var CAUT=/pregnan|\bchild\b|children|\bkids?\b|\bbaby\b|\binfant\b|recent(ly)? (had )?(a )?(heart attack|stent|angioplasty)|stent.{0,15}(last|recent|week|month)|गर्भ|गरोदर|मुलांमध्ये|लहान मुल/;
function detectLang(t){if(DEV.test(t))return'mr';var q=' '+norm(t)+' ';return/ (mala|majha|mazya|maza|aahe|ahe|kay|kasa|kase|kuthe|nahi|dukhte|dukhat|lagto|hoto|hotay|karu|karaycha|goli|aushad|chhati|chati|dhap|chakkar|ka|kiti|kuth) /.test(q)?'mr':'en'}

/* ---------- DOM ---------- */
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function link(cls,href,txt,ext){var a=el('a',cls,txt);a.href=href;if(ext){a.target='_blank';a.rel='noopener'}return a}
var fab=el('button','cc-fab'),panel=el('div','cc-panel'),log=el('div','cc-log'),form=el('form','cc-form'),input=el('input','cc-in'),lb={};
fab.type='button';fab.setAttribute('aria-controls','cc-panel');fab.setAttribute('aria-expanded','false');
fab.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" width="22" height="22"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 10.5h2l1-2 2 4 1-2h2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg><span></span>';
panel.id='cc-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Heart health FAQ');panel.hidden=true;
var head=el('div','cc-head'),ht=el('div','cc-ht'),title=el('strong','cc-title'),sub=el('span','cc-sub'),tools=el('div','cc-tools'),x=el('button','cc-x','×');
x.type='button';ht.appendChild(title);ht.appendChild(sub);
['en','mr'].forEach(function(l){var b=el('button','cc-lang',l==='en'?'EN':'मराठी');b.type='button';b.dataset.l=l;lb[l]=b;tools.appendChild(b)});
tools.appendChild(x);head.appendChild(ht);head.appendChild(tools);
log.setAttribute('role','log');log.setAttribute('aria-live','polite');
input.type='text';input.autocomplete='off';input.maxLength=300;input.setAttribute('enterkeyhint','send');
var sendBtn=el('button','cc-send');sendBtn.type='submit';form.appendChild(input);form.appendChild(sendBtn);
var foot=el('p','cc-foot');
panel.appendChild(head);panel.appendChild(log);panel.appendChild(form);panel.appendChild(foot);
function applyLang(){var t=T[lang];document.documentElement.classList.toggle('cc-mr',lang==='mr');
fab.lastChild.textContent=t.fab;fab.setAttribute('aria-label',t.open);title.textContent=t.title;sub.textContent=t.sub;input.placeholder=t.ph;input.setAttribute('aria-label',t.ph);
sendBtn.textContent=t.send;foot.textContent=t.foot;x.setAttribute('aria-label',t.close);log.setAttribute('aria-label',t.log);panel.setAttribute('aria-label',t.title);
for(var l in lb){lb[l].setAttribute('aria-pressed',String(l===lang))}}
function setLang(l){lang=l;try{localStorage.setItem('cc_lang',l)}catch(e){}applyLang()}
function scroll(){log.scrollTop=log.scrollHeight}
function bubble(cls){var b=el('div','cc-msg '+cls);log.appendChild(b);return b}
function user(text){bubble('cc-u').textContent=text}
function contacts(parent,l,emergency){var t=T[l],r=el('div','cc-row');
r.appendChild(link('cc-btn',BOOK,t.book,1));r.appendChild(link('cc-btn cc-o',TEL,t.call));r.appendChild(link('cc-btn cc-o',WA,t.wa,1));parent.appendChild(r)}
function chips(parent,items,l,onpick){var w=el('div','cc-chips');items.forEach(function(it){var b=el('button','cc-chip',it.t);b.type='button';b.addEventListener('click',function(){onpick(it)});w.appendChild(b)});parent.appendChild(w);return w}
function topics(parent,l,cat){var t=T[l];parent.textContent='';
if(!cat){parent.appendChild(el('p','cc-lbl',t.topics));
var cats=[];D.faq.forEach(function(f){if(cats.indexOf(f.cat)<0)cats.push(f.cat)});
chips(parent,cats.map(function(c){return{t:l==='mr'?D.cats[c]:c,c:c}}),l,function(it){topics(parent,lang,it.c)});return}
var back=el('button','cc-chip cc-back','← '+t.back);back.type='button';back.addEventListener('click',function(){topics(parent,lang)});parent.appendChild(back);
chips(parent,D.faq.filter(function(f){return f.cat===cat}).map(function(f){return{t:f.q[l],f:f}}),l,function(it){ask(it.f.q[lang],it.f,true)})}
function section(parent,label,text,cls){if(!text)return;var d=el('div','cc-sec'+(cls?' '+cls:''));d.appendChild(el('h3',null,label));d.appendChild(el('p',null,text));parent.appendChild(d)}
function related(parent,f,l){var rel=D.faq.filter(function(g){return g.cat===f.cat&&g!==f}).slice(0,3);
if(!rel.length)return;var d=el('div','cc-rel');d.appendChild(el('p','cc-lbl',T[l].related));
chips(d,rel.map(function(g){return{t:g.q[l],f:g}}),l,function(it){ask(it.f.q[lang],it.f,true)});parent.appendChild(d)}
function caution(parent,l){var c=D.safety.pregnancy&&D.safety.pregnancy[l];if(c)parent.appendChild(el('p','cc-note',c.body))}
function answer(f,l,text){var b=bubble('cc-b'),a=f.a[l];b.dataset.id=f.id;
b.appendChild(el('p','cc-short',a.short));section(b,T[l].means,a.means);section(b,T[l].todo,a.do);section(b,T[l].help,a.help,'cc-warn');
if(text&&CAUT.test(norm(text)))caution(b,l);
contacts(b,l);related(b,f,l);scroll()}
function safety(kind,l,text){var s=D.safety[kind]&&D.safety[kind][l],b=bubble(kind==='emergency'?'cc-b cc-em':'cc-b');
b.setAttribute('role',kind==='emergency'?'alert':'group');
if(s.title)b.appendChild(el('strong','cc-st',s.title));b.appendChild(el('p',null,s.body));
if(s.steps.length){var ul=el('ul','cc-steps');s.steps.forEach(function(x){ul.appendChild(el('li',null,x))});b.appendChild(ul)}
contacts(b,l,kind==='emergency');return b}
function welcome(){var b=bubble('cc-b');b.appendChild(el('p',null,T[lang].welcome));var w=el('div','cc-topics');b.appendChild(w);topics(w,lang)}
function ask(text,entry,fromChip){text=text.trim();if(!text)return;
var l=fromChip?lang:detectLang(text);if(l!==lang)setLang(l);
user(text);scroll();
setTimeout(function(){
if(!entry){
if(isEmergency(text)){safety('emergency',l);scroll();return}
if(isMedication(text)){safety('medication',l);scroll();return}
if(isDiagnosis(text)){safety('diagnosis',l);scroll();return}
var r=rank(text);if(r.length&&r[0].s>=1)entry=r[0].f;
else{var b=safety('unknown',l);var near=r.slice(0,3).map(function(x){return x.f});
if(!near.length)near=D.faq.filter(function(f){return['ldl-cholesterol','ecg','what-is-angioplasty'].indexOf(f.id)>-1});
var d=el('div','cc-rel');d.appendChild(el('p','cc-lbl',T[l].closest));chips(d,near.map(function(g){return{t:g.q[l],f:g}}),l,function(it){ask(it.f.q[lang],it.f,true)});b.appendChild(d);scroll();return}}
answer(entry,l,fromChip?'':text)},fromChip?0:250)}

form.addEventListener('submit',function(e){e.preventDefault();var v=input.value;input.value='';ask(v)});
tools.addEventListener('click',function(e){var b=e.target.closest('.cc-lang');if(!b)return;setLang(b.dataset.l);if(log.children.length===1){log.textContent='';welcome()}});
function open(o){panel.hidden=!o;fab.setAttribute('aria-expanded',String(o));document.documentElement.classList.toggle('cc-open',o);
if(o){if(!log.firstChild)welcome();setTimeout(function(){input.focus()},30);scroll()}else fab.focus()}
fab.addEventListener('click',function(){open(panel.hidden)});
x.addEventListener('click',function(){open(false)});
panel.addEventListener('keydown',function(e){if(e.key==='Escape'){open(false);return}
if(e.key==='Tab'){var f=panel.querySelectorAll('button,a[href],input');if(!f.length)return;var a=f[0],z=f[f.length-1];
if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
applyLang();document.body.appendChild(panel);document.body.appendChild(fab);
})();
