// CURSOR
const cur=document.getElementById('cur'),ring=document.getElementById('ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function a(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(a);})();
document.querySelectorAll('a,button,.svc-row,.exp-card,.testi-card,.client-card,.proj-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.transform='scale(2.5) translate(-20%,-20%)';ring.style.width='48px';ring.style.height='48px';});
  el.addEventListener('mouseleave',()=>{cur.style.transform='scale(1) translate(-50%,-50%)';ring.style.width='32px';ring.style.height='32px';});
});

// NAV SCROLL
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',window.scrollY>40));

// REVEAL
const obs=new IntersectionObserver(entries=>{entries.forEach((e,i)=>{if(e.isIntersecting)setTimeout(()=>e.target.classList.add('vis'),i*60);});},{threshold:.1});
document.querySelectorAll('.rv,.rv-l,.rv-r').forEach(el=>obs.observe(el));

// FILTER
function filterProj(btn,cat){
  document.querySelectorAll('.filt-btn').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.proj-card').forEach(c=>{
    const cats=c.getAttribute('data-cat')||'';
    c.style.display=(cat==='all'||cats.includes(cat))?'':'none';
  });
}

// FAQ ACCORDION
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const body = item.querySelector('.faq-body');
  const arrow = item.querySelector('.faq-arrow');
  const isOpen = body.style.display === 'block';
  document.querySelectorAll('.faq-body').forEach(b=>b.style.display='none');
  document.querySelectorAll('.faq-arrow').forEach(a=>{a.textContent='+';a.style.transform='rotate(0deg)';});
  if(!isOpen){
    body.style.display='block';
    arrow.textContent='−';
    arrow.style.transform='rotate(0deg)';
  }
}

// LANG
function setLang(lang){
  document.documentElement.setAttribute('lang', lang);
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.lang-btn').forEach(b=>{
    if(b.getAttribute('onclick')==="setLang('"+lang+"')") b.classList.add('active');
  });
  document.querySelectorAll('[data-'+lang+']').forEach(el=>{
    const val=el.getAttribute('data-'+lang);
    if(!val) return;
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA') el.placeholder=val;
    else el.innerHTML=val;
  });
  // Hero lines
  if(!document.getElementById('hl1')) return;
  if(lang==='fr'){
    document.getElementById('hl1').innerHTML=`JE CONSTRUIS`;
    document.getElementById('hl2').innerHTML=`DES <span class="word-em">SYSTÈMES</span>`;
    document.getElementById('hl3').innerHTML=`QUI PERFORMENT.`;
  } else {
    document.getElementById('hl1').innerHTML=`I BUILD`;
    document.getElementById('hl2').innerHTML=`HIGH-PERFORMANCE <span class="word-em">SYSTEMS</span>`;
    document.getElementById('hl3').innerHTML=`THAT SCALE.`;
  }
  // Contact title
  const ct=document.getElementById('contact-title');
  if(!ct) return;
  if(lang==='fr') ct.innerHTML=`CONSTRUISONS<br><span class="em">VOTRE SYST\u00c8ME.</span>`;
  else ct.innerHTML=`LET'S BUILD<br><span class="em">YOUR SYSTEM.</span>`;
}

// MOBILE MENU
function toggleMenu(){
  const links=document.querySelector('.nav-links');
  const open=links.classList.toggle('open');
  document.getElementById('nav-burger').setAttribute('aria-expanded', open);
}
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{
  document.querySelector('.nav-links').classList.remove('open');
}));

// CONTACT FORM
async function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  const label = document.getElementById('submit-label');
  const success = document.getElementById('form-success');
  const error = document.getElementById('form-error');
  const form = document.getElementById('contact-form');

  btn.style.opacity = '.7';
  btn.disabled = true;
  label.textContent = '...';

  try {
    const formData = new FormData(form);
    const res = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      success.style.display = 'block';
      error.style.display = 'none';
      if (typeof gtag === 'function') gtag('event', 'generate_lead', { event_category: 'contact', event_label: formData.get('project_type') || 'non précisé' });
      form.reset();
      label.textContent = '✓';
    } else {
      throw new Error('Server error');
    }
  } catch(err) {
    error.style.display = 'block';
    success.style.display = 'none';
    label.textContent = label.getAttribute('data-'+(document.documentElement.lang||'fr')) || 'Envoyer mon message →';
  }
  btn.style.opacity = '1';
  btn.disabled = false;
}


// PRESELECTION DU TYPE DE PROJET (?service=)
(function(){
  var p = new URLSearchParams(location.search).get('service');
  var sel = document.querySelector('select[name="project_type"]');
  if (p && sel) { sel.value = p; if (sel.value !== p) sel.value = 'other'; }
})();
