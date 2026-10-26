const opening=document.getElementById('opening');
const invitation=document.getElementById('invitation');
const openButton=document.getElementById('openInvitation');
const openText=document.getElementById('openText');
let invitationOpened=false;
function openInvite(){if(invitationOpened)return;invitationOpened=true;openButton.classList.add('open');openText.textContent='OPENING WITH LOVE…';setTimeout(()=>{opening.classList.add('opening-away');opening.style.transition='opacity .8s ease, transform .9s ease';opening.style.opacity='0';opening.style.transform='scale(1.025)';setTimeout(()=>{opening.style.display='none';invitation.classList.remove('is-hidden');window.scrollTo({top:0,behavior:'instant'});initReveal();},760);},750)}
openButton.addEventListener('click',openInvite);openText.addEventListener('click',openInvite);
// The envelope is the only first-screen control; tapping the wax seal opens the invitation.
openButton.setAttribute('aria-label','Tap the wax seal to open the wedding invitation');
const weddingDate=new Date('2026-11-23T10:30:00+05:30').getTime();
function countdown(){let d=Math.max(0,weddingDate-Date.now());const vals=[Math.floor(d/86400000),Math.floor(d%86400000/3600000),Math.floor(d%3600000/60000),Math.floor(d%60000/1000)];['days','hours','minutes','seconds'].forEach((id,i)=>document.getElementById(id).textContent=String(vals[i]).padStart(2,'0'));}
countdown();setInterval(countdown,1000);
function showerRosePetals(count=20){const layer=document.querySelector('.ambient-petals');for(let i=0;i<count;i++){const p=document.createElement('span');p.className='rose-petal';p.style.left=Math.random()*100+'%';p.style.setProperty('--duration',(3.3+Math.random()*2.4)+'s');p.style.setProperty('--drift',Math.round(Math.random()*220-110)+'px');p.style.setProperty('--rotation',Math.round(Math.random()*360)+'deg');p.style.width=(10+Math.random()*10)+'px';p.style.height=(16+Math.random()*13)+'px';p.style.animationDelay=(Math.random()*.8)+'s';layer.appendChild(p);setTimeout(()=>p.remove(),6500)} }
document.getElementById('yesBtn').addEventListener('click',()=>{const el=document.getElementById('rsvpResponse');el.textContent='In shaa Allah, your presence will make our day more beautiful. ♡';el.classList.add('show');showerRosePetals(12)});
document.getElementById('noBtn').addEventListener('click',()=>{const el=document.getElementById('rsvpResponse');el.textContent='You will be missed. Keep us in your duas. ♡';el.classList.add('show');showerRosePetals(10)});
const music=document.getElementById('weddingMusic'),musicToggle=document.getElementById('musicToggle');musicToggle.addEventListener('click',async()=>{if(music.paused){try{await music.play();musicToggle.textContent='♫';musicToggle.classList.add('playing')}catch(e){musicToggle.textContent='♪'}}else{music.pause();musicToggle.classList.remove('playing')}});
function initReveal(){const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce||!('IntersectionObserver'in window))return;const sections=document.querySelectorAll('.page-section');sections.forEach(s=>Array.from(s.children).forEach(c=>{if(!c.classList.contains('reveal-item')&&c.tagName!=='CANVAS')c.classList.add('reveal-item')}));const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -30px 0px'});document.querySelectorAll('.reveal-item').forEach(el=>{if(el.getBoundingClientRect().top<innerHeight*.9)el.classList.add('visible');else observer.observe(el)});}
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=document.querySelector(a.getAttribute('href'));if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'})}}));

// Scratch-to-reveal wedding date card (mouse + touch supported)
function setupScratchCard(){
  const wrap=document.getElementById('scratchWrap');
  const canvas=document.getElementById('scratchCanvas');
  if(!wrap||!canvas)return;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});
  let drawing=false, cleared=false, lastCheck=0;
  function paintCover(){
    const rect=wrap.getBoundingClientRect();
    const dpr=Math.max(1,Math.min(window.devicePixelRatio||1,2));
    canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);
    canvas.style.width=rect.width+'px';canvas.style.height=rect.height+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const w=rect.width,h=rect.height;
    const grad=ctx.createLinearGradient(0,0,w,h);
    grad.addColorStop(0,'#8b3448');grad.addColorStop(.45,'#6b1b31');grad.addColorStop(1,'#4a1022');
    ctx.globalCompositeOperation='source-over';ctx.fillStyle=grad;ctx.fillRect(0,0,w,h);
    ctx.strokeStyle='#d7b879';ctx.lineWidth=1;ctx.strokeRect(10,10,w-20,h-20);
    ctx.strokeStyle='rgba(255,235,196,.5)';ctx.strokeRect(15,15,w-30,h-30);
    ctx.fillStyle='#f3dfb9';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.font='24px Georgia,serif';ctx.fillText('✧',w/2,h*.43);
    ctx.font='10px sans-serif';ctx.letterSpacing='2px';ctx.fillText('SCRATCH TO REVEAL',w/2,h*.55);
    ctx.globalCompositeOperation='destination-out';
  }
  function point(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
  function scratch(e){if(!drawing||cleared)return;const p=point(e);ctx.beginPath();ctx.arc(p.x,p.y,22,0,Math.PI*2);ctx.fill();if(e.cancelable)e.preventDefault();const now=Date.now();if(now-lastCheck>250){lastCheck=now;checkProgress()}}
  function checkProgress(){try{const pixels=ctx.getImageData(0,0,canvas.width,canvas.height).data;let clear=0;for(let i=3;i<pixels.length;i+=32)if(pixels[i]<30)clear++;if(clear/(pixels.length/32)>.43){cleared=true;wrap.classList.add('revealed')}}catch(e){}}
  canvas.addEventListener('pointerdown',e=>{drawing=true;canvas.setPointerCapture?.(e.pointerId);scratch(e)});
  canvas.addEventListener('pointermove',scratch);
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>canvas.addEventListener(ev,()=>{drawing=false;checkProgress()}));
  paintCover();window.addEventListener('resize',()=>{if(!cleared)paintCover()},{passive:true});
}
setupScratchCard();
