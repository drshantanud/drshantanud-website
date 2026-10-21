(function(){
var links=[].slice.call(document.querySelectorAll('.gi'));if(!links.length)return;
var doc=document,box,img,cap,ct,cur=0,last=null;
function mk(){
 box=doc.createElement('div');box.className='lb';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Photo viewer');
 box.innerHTML='<span class="ct" aria-live="polite"></span><button type="button" class="x" aria-label="Close">&times;</button><button type="button" class="p" aria-label="Previous photo">&#8249;</button><button type="button" class="n" aria-label="Next photo">&#8250;</button><figure><img alt=""><figcaption></figcaption></figure>';
 doc.body.appendChild(box);img=box.querySelector('img');cap=box.querySelector('figcaption');ct=box.querySelector('.ct');
 box.querySelector('.x').onclick=close;box.querySelector('.p').onclick=function(){show(cur-1)};box.querySelector('.n').onclick=function(){show(cur+1)};
 box.addEventListener('click',function(e){if(e.target===box)close()});
 var sx=null;box.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
 box.addEventListener('touchend',function(e){if(sx==null)return;var dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1))},{passive:true});
 doc.addEventListener('keydown',function(e){if(box.hidden)return;if(e.key==='Escape')close();else if(e.key==='ArrowLeft')show(cur-1);else if(e.key==='ArrowRight')show(cur+1);else if(e.key==='Tab'){var f=box.querySelectorAll('button');var i=[].indexOf.call(f,doc.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus()}});
}
function show(i){cur=(i+links.length)%links.length;var a=links[cur];img.src=a.href;img.alt=a.querySelector('img').alt;cap.textContent=a.dataset.cap||'';ct.textContent=(cur+1)+' / '+links.length}
function open(i){if(!box)mk();last=doc.activeElement;show(i);box.hidden=false;doc.documentElement.classList.add('lb-open');box.querySelector('.x').focus()}
function close(){box.hidden=true;doc.documentElement.classList.remove('lb-open');img.removeAttribute('src');if(last&&last.focus)last.focus()}
links.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();open(i)})});
})();
