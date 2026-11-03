(function(){
// Paste the Google Apps Script web-app URL (see second-opinion-setup.txt) between the quotes.
var ENDPOINT='https://script.google.com/macros/s/AKfycbzL35BF0cUZz62uTteWcMU-stJE6IddT2Dc_lemBPXE9gyKcuGuTZ4OZp4CXT-JK_9C_g/exec';
var MAXF=10,MAXB=25*1024*1024,OK=/\.(pdf|jpe?g|png|heic|webp|docx?|zip)$/i;
var $=function(i){return document.getElementById(i)},form=$('so-form');if(!form)return;
var files=[],inp=$('so-files'),list=$('so-list'),msg=$('so-msg'),btn=$('so-send'),bar=$('so-bar'),drop=$('so-drop');
function say(t,c){msg.textContent=t;msg.className='so-msg '+(c||'')}
function mb(n){return (n/1048576).toFixed(1)+' MB'}
function render(){list.innerHTML='';files.forEach(function(f,i){var li=document.createElement('li'),sp=document.createElement('span'),b=document.createElement('button');sp.textContent=f.name+' ('+mb(f.size)+')';b.type='button';b.setAttribute('aria-label','Remove '+f.name);b.innerHTML='&times;';b.onclick=function(){files.splice(i,1);render()};li.appendChild(sp);li.appendChild(b);list.appendChild(li)})}
function add(fl){var bad=[];[].slice.call(fl).forEach(function(f){if(!OK.test(f.name))bad.push(f.name+' (type not allowed)');else if(f.size>MAXB)bad.push(f.name+' (over 25 MB)');else if(files.length>=MAXF)bad.push(f.name+' (max '+MAXF+' files)');else files.push(f)});render();say(bad.length?'Not added: '+bad.join(', '):'',bad.length?'err':'')}
inp.addEventListener('change',function(){add(inp.files);inp.value=''});
['dragenter','dragover'].forEach(function(e){drop.addEventListener(e,function(){drop.classList.add('on')})});
['dragleave','drop'].forEach(function(e){drop.addEventListener(e,function(){drop.classList.remove('on')})});
function b64(f){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(String(r.result).split(',')[1]||'')};r.onerror=rej;r.readAsDataURL(f)})}
function post(o){return fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(o)}).then(function(r){return r.json()}).then(function(j){if(!j||!j.ok)throw new Error((j&&j.error)||'failed');return j})}
form.addEventListener('submit',function(e){e.preventDefault();
 if(form.website.value)return;
 if(!form.name.value.trim()||!form.age.value||!form.phone.value.trim()||!form.question.value.trim()){say('Please fill in the fields marked *.','err');return}
 if(!form.consent.checked){say('Please tick the consent box to continue.','err');return}
 if(!files.length&&!form.link.value.trim()){say('Please add at least one file or a link to your records.','err');return}
 if(!ENDPOINT){say('Online upload is being set up. Please send your reports on WhatsApp +91 88509 74864 for now.','err');return}
 btn.disabled=true;bar.hidden=false;bar.firstChild.style.width='5%';say('Sending your details...');
 var d={action:'create'};['name','age','phone','email','city','contact','diagnosis','question','link'].forEach(function(k){d[k]=form[k].value.trim()});d.fileCount=files.length;
 post(d).then(function(j){var i=0,tot=files.length;
  function next(){if(i>=tot)return;var f=files[i];say('Uploading file '+(i+1)+' of '+tot+'...');
   return b64(f).then(function(x){return post({action:'file',folderId:j.folderId,token:j.token,name:f.name,mime:f.type||'application/octet-stream',data:x})}).then(function(){i++;bar.firstChild.style.width=(5+90*i/tot)+'%';return next()})}
  return next()}).then(function(){bar.firstChild.style.width='100%';say('Thank you. Your records have been received. You will hear from the clinic soon.','ok');form.reset();files=[];render();btn.textContent='SUBMITTED'})
 .catch(function(){say('Upload could not be completed. Please try again, or send your reports on WhatsApp +91 88509 74864.','err');btn.disabled=false;bar.hidden=true});
});
})();
