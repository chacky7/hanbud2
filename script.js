/* ── HERO SLIDER ── */
const heroImgs = [
  { src: 'images/hero_vena.jpg',    name: 'Vena Modular',  sub: 'PolarMat RAL 9005' },
  { src: 'images/hero_claro.jpg',   name: 'Claro Modular', sub: 'PolarMat RAL 9005' },
  { src: 'images/hero_moderno.jpg', name: 'Moderno',       sub: 'PolarMat RAL 9005' },
  { src: 'images/hero_retto.jpg',   name: 'Retto',         sub: 'PolarMat RAL 9005' },
];

let cur = 0, autoTimer;
const hImg  = document.getElementById('heroImg');
const hName = document.getElementById('heroName');
const hSub  = document.getElementById('heroSub');
const dots  = document.querySelectorAll('.hero-dot');

hImg.style.transition = 'opacity .4s ease';

function switchHero(i) {
  cur = (i + heroImgs.length) % heroImgs.length;
  hImg.style.opacity = '0';
  setTimeout(() => {
    hImg.src          = heroImgs[cur].src;
    hName.textContent = heroImgs[cur].name;
    hSub.textContent  = heroImgs[cur].sub;
    hImg.style.opacity = '1';
  }, 320);
  dots.forEach((d, j) => d.classList.toggle('active', j === cur));
  clearInterval(autoTimer);
  autoTimer = setInterval(() => switchHero(cur + 1), 4500);
}

autoTimer = setInterval(() => switchHero(cur + 1), 4500);

/* swipe support */
let touchStartX = 0;
const imgArea = document.getElementById('heroImgArea');
imgArea.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
imgArea.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) switchHero(dx < 0 ? cur + 1 : cur - 1);
});

/* ── GALLERY LIGHTBOX ── */
const galleryData = [
  { src: 'images/gallery_retto.jpg',   cap: 'Retto' },
  { src: 'images/gallery_vena.jpg',    cap: 'Vena Modular' },
  { src: 'images/gallery_moderno.jpg', cap: 'Moderno' },
  { src: 'images/gallery_vena2.jpg',   cap: 'Vena Modular' },
  { src: 'images/gallery_claro.jpg',   cap: 'Claro Modular' },
];

let lbCur = 0;
const lb     = document.getElementById('lightbox');
const lbImg  = document.getElementById('lbImg');
const lbCap  = document.getElementById('lbCaption');

function openLightbox(i) {
  lbCur = i;
  lbImg.src = galleryData[i].src;
  lbCap.textContent = galleryData[i].cap;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightboxDirect() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function closeLightbox(e) {
  if (e.target === lb) closeLightboxDirect();
}

function lbNav(dir) {
  lbCur = (lbCur + dir + galleryData.length) % galleryData.length;
  lbImg.src = galleryData[lbCur].src;
  lbCap.textContent = galleryData[lbCur].cap;
}

document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightboxDirect();
  if (e.key === 'ArrowLeft')  lbNav(-1);
  if (e.key === 'ArrowRight') lbNav(1);
});

/* ── FORM ── */
function scrollToForm() {
  document.getElementById('formularz').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function handleSubmit(e) {
  e.preventDefault();
  const formEl = document.getElementById('leadForm');
  const btn    = document.querySelector('.form-submit');

  const firstName = formEl.querySelector('[name="first_name"]').value.trim();
  const lastName  = formEl.querySelector('[name="last_name"]').value.trim();
  const name      = [firstName, lastName].filter(Boolean).join(' ');
  const email     = formEl.querySelector('[name="email"]').value.trim();
  const phone     = formEl.querySelector('[name="phone"]').value.trim();
  const city      = formEl.querySelector('[name="city"]').value.trim();
  const comment   = formEl.querySelector('[name="comment"]').value.trim();

  btn.textContent = 'Nosūta...';
  btn.disabled = true;

  try {
    const res = await fetch('/.netlify/functions/submit', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, email, phone, city, comment }),
    });
    if (!res.ok) throw new Error('server error');
    formEl.reset();
    document.getElementById('successOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  } catch {
    alert('Kļūda nosūtot pieprasījumu. Lūdzu mēģiniet vēlreiz vai sazinieties pa tālruni.');
  } finally {
    btn.textContent = 'Nosūtīt pieprasījumu →';
    btn.disabled = false;
  }
}

function closeSuccess() {
  document.getElementById('successOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

/* ── SCROLL ANIMATIONS ── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(x => {
    if (x.isIntersecting) {
      x.target.style.opacity = '1';
      x.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: .08 });

document.querySelectorAll('.product-card, .coating-card, .an-box, .fg, .af, .dealer-card, .gallery-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});
