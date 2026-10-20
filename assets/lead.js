(function(){
// Paste your Google Apps Script web-app URL here (see lead-capture-setup.txt). Leave empty to disable saving.
var ENDPOINT='https://script.google.com/macros/s/AKfycbxjasmmwfBDCS3nCrvB9ArMEoaCKMJTFUvhBP7e7ezU-9rYfkv6y9m-bVkIp1RdRtO-PQ/exec';
var KEY='dsd_lead',$=function(i){return document.getElementById(i)};
function get(){try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}}
function put(v){try{localStorage.setItem(KEY,JSON.stringify(v))}catch(e){}}
function send(o){if(!ENDPOINT)return;o.page=location.pathname;o.time=new Date().toISOString();
 try{fetch(ENDPOINT,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(o),keepalive:true}).catch(function(){})}catch(e){}}
var g=$('dp-gate');if(!g)return;
var gb=$('dp-generate');
if(gb)gb.addEventListener('click',function(e){if(get())return;e.stopImmediatePropagation();e.preventDefault();window.__dgDone=function(){gb.click()};g.hidden=false;g.scrollIntoView({behavior:'smooth',block:'center'});$('dg-name').focus()},true);
window.DietGate=function(done){
 if(get()){done();return}
 g.hidden=false;g.scrollIntoView({behavior:'smooth',block:'center'});$('dg-name').focus();window.__dgDone=done};
$('dg-form').addEventListener('submit',function(e){e.preventDefault();
 var n=$('dg-name').value.trim(),m=$('dg-mob').value.replace(/[\s\-]/g,'').replace(/^(\+91|91|0)(?=\d{10}$)/,''),em=$('dg-email').value.trim(),er=$('dg-err');
 if($('dg-hp').value)return;
 if(n.length<2)return er.textContent='Please enter your name.';
 if(!/^[6-9]\d{9}$/.test(m))return er.textContent='Please enter a valid 10-digit mobile number.';
 if(em&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em))return er.textContent='Please check your email address.';
 if(!$('dg-ok').checked)return er.textContent='Please tick the consent box to continue.';
 er.textContent='';var rec={name:n,mobile:m,email:em,event:'plan_created',consent:true};put({n:n,m:m,e:em});send(rec);
 g.hidden=true;var d=window.__dgDone;window.__dgDone=null;if(d)d()});
$('dg-skip').addEventListener('click',function(){g.hidden=true});
var pb=$('dp-print');if(pb)pb.addEventListener('click',function(){var l=get();if(l)send({name:l.n,mobile:l.m,email:l.e,event:'print_or_pdf',consent:true})});
})();
