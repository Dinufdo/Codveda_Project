/* ===== Main JS (profile modal + all features) ===== */

/* ---------- Toast utility ---------- */
const toastContainer = document.getElementById('toast-container');
function showToast(msg, type = 'info', duration = 3000) {
  const t = document.createElement('div');
  t.className = `toast ${type} show`;
  t.textContent = msg;
  toastContainer.appendChild(t);
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 300);
  }, duration);
}

/* ---------- Modal utilities ---------- */
/* Info modal */
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalOk = document.getElementById('modalOk');
const infoModalOpen = document.getElementById('infoModalOpen');

function openModal() { if (modal) modal.setAttribute('aria-hidden', 'false'); }
function closeModal() { if (modal) modal.setAttribute('aria-hidden', 'true'); }

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOk) modalOk.addEventListener('click', closeModal);
if (infoModalOpen) infoModalOpen.addEventListener('click', openModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

/* Profile modal */
const profileModal = document.getElementById('profileModal');
const profileClose = document.getElementById('profileClose');
const profileEdit = document.getElementById('profileEdit');
const profileDelete = document.getElementById('profileDelete');
const profileCardContainer = document.getElementById('profileCardContainer');

function openProfileModal() { profileModal.setAttribute('aria-hidden', 'false'); }
function closeProfileModal() { profileModal.setAttribute('aria-hidden', 'true'); }

profileClose.addEventListener('click', closeProfileModal);
profileModal.addEventListener('click', (e) => { if (e.target === profileModal) closeProfileModal(); });

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal && modal.getAttribute('aria-hidden') === 'false') closeModal();
    if (profileModal && profileModal.getAttribute('aria-hidden') === 'false') closeProfileModal();
  }
});

/* ---------- Smooth scrolling ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = this.getAttribute('href');
    if (target && target.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile nav if open
      navLinks.classList.remove('show');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
});

/* ---------- Mobile nav toggle ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const active = hamburger.classList.toggle('active');
  navLinks.classList.toggle('show');
  hamburger.setAttribute('aria-expanded', active ? 'true' : 'false');
});

/* ---------- Hero + features animations ---------- */
window.addEventListener('load', () => {
  const heroText = document.querySelector('.hero-text');
  const heroImg = document.querySelector('.hero-image');
  if (heroText) heroText.classList.add('visible');
  if (heroImg) heroImg.classList.add('visible');
  showToast('Welcome to Lingo Français! ✨', 'success', 3200);
});

const features = document.querySelectorAll('.feature');
if ('IntersectionObserver' in window && features.length) {
  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });
  features.forEach(f => obs.observe(f));
} else {
  features.forEach(f => f.classList.add('visible'));
}

/* ---------- Form validation & profile creation ---------- */
const form = document.getElementById('signupForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const passwordInput = document.getElementById('password');
const successMessage = document.getElementById('successMessage');

let currentProfile = null; // will hold profile object

function setError(input, msg) {
  const el = input.parentElement.querySelector('.error');
  if (el) el.textContent = msg;
}
function clearError(input) {
  const el = input.parentElement.querySelector('.error');
  if (el) el.textContent = '';
}
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
function validatePhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

function createAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const h = Math.abs(hash) % 360;
  return `linear-gradient(135deg,hsl(${h} 70% 60%), hsl(${(h+40)%360} 80% 70%))`;
}

function getInitials(name) {
  if (!name) return 'LF';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
  return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
}

function buildProfileCard(profile) {
  const card = document.createElement('div');
  card.className = 'profile-card';
  
  // avatar
  const avatar = document.createElement('div');
  avatar.className = 'profile-avatar';
  avatar.style.background = profile.avatarColor;
  avatar.textContent = profile.initials;
  
  // info
  const info = document.createElement('div');
  info.className = 'profile-info';
  const h3 = document.createElement('h3'); h3.textContent = profile.name;
  const pEmail = document.createElement('p'); pEmail.textContent = `📧 ${profile.email}`;
  const pPhone = document.createElement('p'); pPhone.textContent = `📱 ${profile.phone}`;
  
  const meta = document.createElement('div'); meta.className = 'profile-meta';
  const badge1 = document.createElement('span'); badge1.textContent = 'Beginner';
  const badge2 = document.createElement('span'); badge2.textContent = '0 trophies';
  meta.appendChild(badge1); meta.appendChild(badge2);

  info.appendChild(h3);
  info.appendChild(pEmail);
  info.appendChild(pPhone);
  info.appendChild(meta);

  card.appendChild(avatar);
  card.appendChild(info);
  return card;
}

form.addEventListener('submit', function(e) {
  e.preventDefault();
  let valid = true;

  if (!nameInput.value.trim()) { setError(nameInput, 'Name is required'); valid = false; } else clearError(nameInput);
  if (!validateEmail(emailInput.value.trim())) { setError(emailInput, 'Enter a valid email'); valid = false; } else clearError(emailInput);
  if (!validatePhone(phoneInput.value.trim())) { setError(phoneInput, 'Enter a 10-digit phone number'); valid = false; } else clearError(phoneInput);
  if (passwordInput.value.length < 6) { setError(passwordInput, 'Password must be at least 6 characters'); valid = false; } else clearError(passwordInput);

  if (!valid) { successMessage.textContent=''; return; }

  const profile = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    password: passwordInput.value
  };
  profile.initials = getInitials(profile.name);
  profile.avatarColor = createAvatarColor(profile.name);

  currentProfile = profile;
  profileCardContainer.innerHTML = '';
  profileCardContainer.appendChild(buildProfileCard(profile));

  document.getElementById('profileModal').setAttribute('aria-hidden','false');
  successMessage.textContent = 'Registration successful! Bienvenue 🎉';
  form.reset();
});

/* ---------- Edit & Delete ---------- */
profileEdit.addEventListener('click', () => {
  if (!currentProfile) return;
  nameInput.value = currentProfile.name;
  emailInput.value = currentProfile.email;
  phoneInput.value = currentProfile.phone;
  passwordInput.value = currentProfile.password;
  document.getElementById('profileModal').setAttribute('aria-hidden','true');
  document.getElementById('form').scrollIntoView({behavior:'smooth'});
  nameInput.focus();
});

profileDelete.addEventListener('click', () => {
  if (!currentProfile) return;
  const ok = confirm('Delete profile permanently?');
  if (!ok) return;
  currentProfile = null;
  profileCardContainer.innerHTML = '';
  document.getElementById('profileModal').setAttribute('aria-hidden','true');
});

/* ---------- Other JS (counter, modals, toast, etc.) remains same as before ---------- */


/* ---------- Counter & threshold ---------- */
let count = 0;
const countEl = document.getElementById('count');
const incrementBtn = document.getElementById('increment');
const decrementBtn = document.getElementById('decrement');
const resetBtn = document.getElementById('reset');

const THRESHOLD = 10;

function updateCount() { countEl.textContent = String(count); }

incrementBtn.addEventListener('click', () => {
  count++;
  updateCount();
  showToast('Counter incremented! ✅', 'info', 2000);
  if (count === THRESHOLD) {
    showToast(`Nice! You reached ${THRESHOLD} lessons.`, 'success', 2800);
    openModal(); // show informative modal as milestone
  }
});

decrementBtn.addEventListener('click', () => {
  if (count > 0) { count--; updateCount(); showToast('Counter decremented ⬇️', 'info', 1800); }
  else showToast('Counter is already 0 ⚠️', 'info', 1400);
});

resetBtn.addEventListener('click', () => {
  count = 0; updateCount(); showToast('Counter reset 🔄', 'info', 1600);
});

updateCount();
