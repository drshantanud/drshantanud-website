
(function(){
var F={s:.988876402378082,c:[.053274843841791,4.332503318786621,.154946178197861,.144462317228317,3.47632646560669,123.13001251220703,9.002537727355957,.392308831214905],
eth:[0,0,.28040314332995425,.56298994142075398,.29590000851116516,.072785379877982545,-.17072135508857317,-.39371043314874971,-.32632495283530272,-.17127056883241784],
smk:[0,.13386833786546262,.56200858012438537,.66749593377502547,.84948177644830847],
m:[-8.1388109247726188,.79733376689699098,.29236092275460052,-4.1513300213837665,.15338035820802554,.013131488407103424,.0078894541014586095,.077223790588590108],
b:{af:1.5923354969269663,ap:.25237642070115557,st:.59520725304601851,mg:.301267260870345,ra:.21364803435181942,ck:.65194569493845833,sm:.12555308058820178,sl:.75880938654267693,ht:.50931593683423004,t1:1.7267977510537347,t2:1.0688773244615468,fh:.45445319020896213,ed:0},
i1:{s1:-4.7057161785851891,s2:-2.7430383403573337,s3:-.86608088829392182,s4:.90241562369710648,af:19.938034889546561,st:-.98408045235936281,mg:1.7634979587872999,ck:-3.5874047731694114,sl:19.690303738638292,ht:11.872809733921812,t1:-1.2444332714320747,t2:6.8652342000009599,b1:23.802623412141742,b2:-71.184947692087007,fh:.99467807940435127,sbp:.034131842338615485,tn:-1.0301180802035639},
i2:{s1:-.075589244643193026,s2:-.11951192874867074,s3:-.10366306397571923,s4:-.13991853591718389,af:-.076182651011162505,st:-.12005364946742472,mg:-.065586917898699859,ck:-.22688873086442507,sl:.077347949679016273,ht:.00096857823588174436,t1:-.28724064624488949,t2:-.097112252590695489,b1:.52369958933664429,b2:.045744190122323759,fh:-.076885051698423038,sbp:-.0015082501423272358,tn:-.031593414674962329}};
var M={s:.977268040180206,c:[.234766781330109,77.284080505371094,.149176135659218,.141913309693336,4.300998687744141,128.57157897949219,8.756621360778809,.52630490064621],
eth:[0,0,.27719248760308279,.47446360714931268,.52961729919689371,.035100159186299017,-.35807899669327919,-.4005648523216514,-.41522792889830173,-.26321348134749967],
smk:[0,.19128222863388983,.55241588192645552,.63835053027506072,.78983819881858019],
m:[-17.839781666005575,.0022964880605765492,2.4562776660536358,-8.3011122314711354,.17340196856327111,.012910126542553305,.010251914291290456,.033268201277287295],
b:{af:.88209236928054657,ap:.13046879855173513,st:.45485399750445543,mg:.25584178074159913,ra:.20970658013956567,ck:.71853261288274384,sm:.12133039882047164,sl:.4401572174457522,ht:.51659871082695474,t1:1.2343425521675175,t2:.85942071430932221,fh:.54055469009390156,ed:.22251859086705383},
i1:{s1:-.21011133933516346,s2:.75268676447503191,s3:.99315887556405791,s4:2.1331163414389076,af:3.4896675530623207,st:1.1708133653489108,ed:-1.506400985745431,mg:2.3491159871402441,ck:-.50656716327223694,ht:6.5114581098532671,t1:5.3379864878006531,t2:3.6461817406221311,b1:31.004952956033886,b2:-111.29157184391643,fh:2.7808628508531887,sbp:.018858524469865853,tn:-.1007554870063731},
i2:{s1:-.00049854870275326121,s2:-.00079875633317385414,s3:-.00083706184266251296,s4:-.00078400319155637289,af:-.00034995608340636049,st:-.0002496045095297166,ed:-.0011058218441227373,mg:.00019896446041478631,ck:-.0018325930166498813,ht:.00063838053104165013,t1:.0006409780808752897,t2:-.00024695695588868315,b1:.0050380102356322029,b2:-.013074483002524319,fh:-.00024791809907396037,sbp:-.00001271874191588457,tn:-.000093299642323272888}};
function qrisk(x){var m=x.sex==='m',C=m?M:F,dage=x.age/10,db=x.bmi/10,c=C.c;
var a1=m?1/dage:Math.pow(dage,-2),a2=m?Math.pow(dage,3):dage,b1=Math.pow(db,-2),b2=Math.pow(db,-2)*Math.log(db);
a1-=c[0];a2-=c[1];b1-=c[2];b2-=c[3];
var v={b1:b1,b2:b2,sbp:x.sbp-c[5],tn:x.town===undefined?0:x.town-c[7],s1:+(x.smoke==1),s2:+(x.smoke==2),s3:+(x.smoke==3),s4:+(x.smoke==4)};
['af','ap','st','mg','ra','ck','sm','sl','ht','t1','t2','fh'].forEach(function(k){v[k]=x[k]?1:0});v.ed=(m&&x.ed)?1:0;
var a=C.eth[x.eth]+C.smk[x.smoke],k;
a+=a1*C.m[0]+a2*C.m[1]+b1*C.m[2]+b2*C.m[3]+(x.ratio-c[4])*C.m[4]+v.sbp*C.m[5]+(x.sd===undefined?0:x.sd-c[6])*C.m[6]+v.tn*C.m[7];
for(k in C.b)a+=v[k]*C.b[k];
for(k in C.i1)a+=a1*v[k]*C.i1[k];
for(k in C.i2)a+=a2*v[k]*C.i2[k];
return 100*(1-Math.pow(C.s,Math.exp(a)))}
window.QRISK3_calc=qrisk;
var $=function(i){return document.getElementById(i)};
function chk(i){return $(i).checked}
$('rk-sex').addEventListener('change',function(){$('rk-edl').style.display=$('rk-sex').value==='m'?'':'none'});
$('rk-edl').style.display=$('rk-sex').value==='m'?'':'none';
function err(s){$('rk-err').textContent=s;$('rk-res').hidden=true}
$('rk-go').addEventListener('click',function(){
 var age=parseFloat($('rk-age').value),sbp=parseFloat($('rk-sbp').value),h=parseFloat($('rk-h').value)/100,w=parseFloat($('rk-w').value),tc=parseFloat($('rk-tc').value),hdl=parseFloat($('rk-hdl').value);
 if(!chk('rk-ok'))return err('This tool is not for people who already have heart disease or have had a stroke. Please speak to your doctor.');
 if(!(age>=25&&age<=84))return err('Age must be between 25 and 84 years.');
 if(!(sbp>=70&&sbp<=210))return err('Systolic blood pressure must be between 70 and 210 mmHg.');
 if(!(h>1.2&&h<2.3&&w>30&&w<250))return err('Please check your height and weight.');
 var ratio=tc/hdl;if(!(isFinite(ratio)&&ratio>=1&&ratio<=12))return err('Please check your cholesterol values. The total/HDL ratio must be between 1 and 12.');
 var bmi=w/(h*h),clamped=bmi<20||bmi>40;bmi=Math.min(40,Math.max(20,bmi));
 var x={age:age,sex:$('rk-sex').value,eth:+$('rk-eth').value,smoke:+$('rk-smk').value,bmi:bmi,sbp:sbp,ratio:ratio,t1:$('rk-dia').value==='1',t2:$('rk-dia').value==='2'};
 ['ht','fh','af','ck','ra','sl','mg','sm','st','ap','ed'].forEach(function(k){x[k]=chk('rk-'+k)});
 var r=Math.round(qrisk(x)*10)/10;$('rk-err').textContent='';
 $('rk-pct').textContent=r.toFixed(1)+'%';
 $('rk-band').textContent=r<10?'Lower estimated risk (below 10%)':r<20?'Moderate estimated risk (10% to under 20%)':'Higher estimated risk (20% or more)';
 $('rk-100').textContent='This means that, out of 100 people with the same risk factors as you, about '+(Math.round(r*10)/10)+' are expected to have a heart attack or stroke within 10 years.';
 $('rk-note').textContent=(r>=10?'A risk of 10% or more is usually worth discussing with your doctor. ':'')+(clamped?'Your BMI is outside 20 to 40, so the nearest limit was used. ':'')+'Blood pressure variability and area deprivation were not included.';

 var en=[],lp=parseFloat($('rk-lpa').value),crp=parseFloat($('rk-crp').value),ab=parseFloat($('rk-apob').value);
 if(isFinite(lp)&&lp>=0){var lm=$('rk-lpau').value==='nmol'?lp*0.4:lp,lt=lp+($('rk-lpau').value==='nmol'?' nmol/L':' mg/dL');
  if(lm>=50)en.push(['Lp(a) '+lt+': high. A genetically inherited risk enhancer (50 mg/dL or 125 nmol/L and above) that diet and exercise do not change; discuss with your doctor, and consider testing close relatives.',1]);
  else if(lm>=30)en.push(['Lp(a) '+lt+': borderline raised (30 to 49 mg/dL). Some Indian guidance treats 30 mg/dL and above as raised.',1]);
  else en.push(['Lp(a) '+lt+': not raised.',0])}
 if(isFinite(crp)&&crp>=0){if(crp>10)en.push(['hsCRP '+crp+' mg/L: very high, often due to a recent infection or inflammation. Repeat the test after 2 to 3 weeks before reading it as a risk marker.',0]);
  else if(crp>=2)en.push(['hsCRP '+crp+' mg/L: raised (2 mg/L and above). A marker of inflammation and a risk enhancer, particularly when risk is borderline.',1]);
  else en.push(['hsCRP '+crp+' mg/L: not raised.',0])}
 if(isFinite(ab)&&ab>=0){if(ab>=130)en.push(['ApoB '+ab+' mg/dL: high (130 mg/dL and above). A risk enhancer; it counts the number of cholesterol-carrying particles, which LDL alone can miss.',1]);
  else if(ab>=100)en.push(['ApoB '+ab+' mg/dL: above 100 mg/dL, which is higher than desirable for people at moderate or higher risk.',1]);
  else en.push(['ApoB '+ab+' mg/dL: not raised.',0])}
 var hit=en.filter(function(e){return e[1]}).length,E=$('rk-enh-res');E.innerHTML='';
 if(en.length){var h=document.createElement('p');h.className='rk-band';h.textContent=hit?'Risk enhancers found: '+hit+'. Your real risk may be higher than the percentage above.':'None of the extra tests entered shows a raised risk.';E.appendChild(h);
  var u=document.createElement('ul');en.forEach(function(e){var l=document.createElement('li');l.textContent=e[0];u.appendChild(l)});E.appendChild(u);
  var n=document.createElement('p');n.className='diet-note';n.textContent='These values were not used in the QRISK3 calculation. Lp(a) needs to be tested only once in a lifetime unless your doctor advises otherwise.';E.appendChild(n)}
 $('rk-res').hidden=false;$('rk-res').scrollIntoView({behavior:'smooth',block:'nearest'})});
$('rk-reset').addEventListener('click',function(){var d={age:55,sbp:130,h:168,w:72,tc:190,hdl:45};['rk-lpa','rk-crp','rk-apob'].forEach(function(i){$(i).value=''});$('rk-lpau').value='mg';for(var k in d)$('rk-'+k).value=d[k];$('rk-sex').value='m';$('rk-eth').value='2';$('rk-smk').value='0';$('rk-dia').value='0';document.querySelectorAll('.rk-chk input,#rk-ok').forEach(function(c){c.checked=false});$('rk-sex').dispatchEvent(new Event('change'));$('rk-err').textContent='';$('rk-res').hidden=true});
})();
