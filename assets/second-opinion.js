(function(){
// Paste the Google Apps Script web-app URL for tools/second-opinion-apps-script.gs here.
// While it is empty, the form asks patients to send reports on WhatsApp instead.
var ENDPOINT='';
var MAX_FILES=5,MAX_BYTES=10*1024*1024,TYPES={'application/pdf':1,'image/jpeg':1,'image/png':1,'application/vnd.openxmlformats-officedocument.wordprocessingml.document':1};
var $=function(i){return document.getElementById(i)},f=$('so-form');if(!f)return;
var st=$('so-status'),btn=$('so-btn'),fi=$('so-files'),fl=$('so-fl');
function say(t,c){st.textContent=t;st.className='so-status '+(c||'')}
fi.addEventListener('change',function(){var n=fi.files.length;fl.textContent=n?(n===1?fi.files[0].name:n+' files selected'):'Click to upload reports'});
function b64(file){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(String(r.result).split(',')[1])};r.onerror=rej;r.readAsDataURL(file)})}
f.addEventListener('submit',async function(e){e.preventDefault();
 if($('so-hp').value)return;
 var name=$('so-name').value.trim(),phone=$('so-phone').value.replace(/[\s\-]/g,'').replace(/^(\+91|91|0)(?=\d{10}$)/,''),email=$('so-email').value.trim();
 if(name.length<2)return say('Please enter your name.','err');
 if(!/^\+?\d{10,14}$/.test(phone))return say('Please enter a valid mobile number.','err');
 if(email&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return say('Please check your email address.','err');
 var files=[].slice.call(fi.files);
 if(files.length>MAX_FILES)return say('Please upload at most '+MAX_FILES+' files.','err');
 for(var i=0;i<files.length;i++){if(!TYPES[files[i].type])return say(files[i].name+': only PDF, JPG, PNG or DOCX files.','err');if(files[i].size>MAX_BYTES)return say(files[i].name+' is larger than 10 MB.','err')}
 if(!$('so-consent').checked)return say('Please tick the consent box to continue.','err');
 if(!ENDPOINT)return say('Online upload is not available yet. Please send your reports on WhatsApp to +91 88509 74864.','err');
 btn.disabled=true;say('Uploading, please wait. This can take a minute for large files.');
 try{
  var payload={name:name,phone:phone,email:email,city:$('so-city').value.trim(),message:$('so-msg').value.trim(),consent:true,page:location.pathname,files:[]};
  for(var j=0;j<files.length;j++)payload.files.push({name:files[j].name,type:files[j].type,data:await b64(files[j])});
  var r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
  var out=await r.json();if(!out.ok)throw new Error(out.error||'Upload failed');
  f.reset();fl.textContent='Click to upload reports';
  say('Thank you. Your request '+out.id+' has been received. The clinic will contact you soon.','ok');
 }catch(err){say('Sorry, the upload did not go through. Please try again, or send your reports on WhatsApp to +91 88509 74864.','err')}
 btn.disabled=false});
})();
