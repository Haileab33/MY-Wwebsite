// script.js - simplified: no server-side functions; send to Formspree only
(function () {
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzdbvrow';

  document.addEventListener('DOMContentLoaded', () => {

    // Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href && href.length > 1) {
          e.preventDefault();
          const el = document.querySelector(href);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          const nav = document.getElementById('primary-nav');
          if (window.innerWidth <= 900 && nav) nav.style.display = 'none';
          const menuToggle = document.getElementById('menu-toggle');
          if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('primary-nav');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!expanded));
        if (nav) nav.style.display = expanded ? 'none' : 'block';
      });
    }

    // Dark mode
    const root = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function applyTheme(theme) {
      if (theme === 'dark') {
        root.classList.add('dark');
        themeToggle?.setAttribute('aria-pressed', 'true');
      } else {
        root.classList.remove('dark');
        themeToggle?.setAttribute('aria-pressed', 'false');
      }
    }

    applyTheme(storedTheme || (prefersDark ? 'dark' : 'light'));
    themeToggle?.addEventListener('click', () => {
      const next = root.classList.contains('dark') ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
    const slidesContainer = document.getElementById('slides');
    const prevBtn = document.querySelector('.slide-btn.prev');
    const nextBtn = document.querySelector('.slide-btn.next');
    let slideIndex = 0;
    function getSlideWidth() {
  if (!slidesContainer || slidesContainer.children.length === 0) return 0;
  const first = slidesContainer.children[0];
  const rect = first.getBoundingClientRect();
  const style = getComputedStyle(first);
  const marginRight = parseFloat(style.marginRight || '0');
  return rect.width + marginRight;
}

function updateSlide() {
  if (!slidesContainer || slidesContainer.children.length === 0) return;
  const slideWidth = getSlideWidth();
  slidesContainer.style.transform =
    `translateX(${-slideIndex * slideWidth}px)`;
}

/* NEXT BUTTON */
nextBtn?.addEventListener('click', () => {
  if (!slidesContainer) return;
  slideIndex = Math.min(slideIndex + 1, slidesContainer.children.length - 1);
  updateSlide();
});

/* PREVIOUS BUTTON */
prevBtn?.addEventListener('click', () => {
  if (!slidesContainer) return;
  slideIndex = Math.max(slideIndex - 1, 0);
  updateSlide();
});

/* UPDATE ON RESIZE */
window.addEventListener('resize', updateSlide);

    // Modal
    const modalOverlay = document.getElementById('modal-overlay');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    async function openThankYouModal(successText = 'Successfully sent') {
      try {
        const res = await fetch('thank-you.html');
        if (res.ok) {
          modalBody.innerHTML = await res.text();
          const msg = modalBody.querySelector('.thank-you-message');
          if (msg) msg.textContent = successText;
        }
      } catch {
        modalBody.innerHTML = `<p class="thank-you-message">${successText}</p>`;
      }
      modalOverlay.hidden = false;
      modalOverlay.setAttribute('aria-hidden', 'false');
      modalClose?.focus();
    }

    function closeModal() {
      modalOverlay.hidden = true;
      modalOverlay.setAttribute('aria-hidden', 'true');
    }

    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', e => e.target === modalOverlay && closeModal());
    document.addEventListener('keydown', e => e.key === 'Escape' && !modalOverlay.hidden && closeModal());
    const skillElements = document.querySelectorAll('.skill'); if ('IntersectionObserver' in window && skillElements.length) { const obs = new IntersectionObserver((entries, o) => { entries.forEach(entry => { if (entry.isIntersecting) { const el = entry.target; const percent = el.getAttribute('data-percent') || '0'; const fill = el.querySelector('.progress-fill'); if (fill) fill.style.width = percent + '%'; o.unobserve(el); } }); }, { threshold: 0.3 }); skillElements.forEach(s => obs.observe(s)); } else { skillElements.forEach(skill => { const percent = skill.getAttribute('data-percent') || '0'; const fill = skill.querySelector('.progress-fill'); if (fill) fill.style.width = percent + '%'; }); }
    // Contact form -> Formspree only
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitBtn = form?.querySelector('button[type="submit"]');
    const replyToHidden = document.getElementById('_replyto');

    if (form) {
      form.addEventListener('submit', async (ev) => {
        ev.preventDefault();

        const name = form.name?.value.trim();
        const email = form.email?.value.trim();
        const message = form.message?.value.trim();
        const projectType = form.projectType?.value.trim();
        const phone = form.phone?.value.trim();

        // Validation (moved here – no function changed)
        if (!name || !email || !message || !projectType) {
          status.textContent = 'Please fill in name, email, project type, and message.';
          status.style.color = '#ff6b6b';
          return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
          status.textContent = 'Please enter a valid email address.';
          status.style.color = '#ff6b6b';
          return;
        }
        const namePattern = /^[A-Za-z\s]+$/;
if (!namePattern.test(name)) {
  status.textContent = 'Name must contain letters only.';
  status.style.color = '#ff6b6b';
  return;
}

        if (phone) {
          const phonePattern = /^\+?[0-9\s\-()]{7,}$/;
          if (!phonePattern.test(phone)) {
            status.textContent = 'Please enter a valid phone number.';
            status.style.color = '#ff6b6b';
            return;
          }
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
        status.textContent = '';

        const data = Object.fromEntries(new FormData(form));
        if (replyToHidden) replyToHidden.value = email;

        try {
          const resp = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });

          if (resp.ok) {
            form.reset();
            await openThankYouModal('Successfully sent');
          } else {
            status.textContent = 'Submission failed.';
            status.style.color = '#b91c1c';
          }
        } catch {
          status.textContent = 'Successfully sent.';
          status.style.color = '#16a34a';
        }

        submitBtn.disabled = false;
        submitBtn.textContent = 'Send';
      });
    }
  });
})();
