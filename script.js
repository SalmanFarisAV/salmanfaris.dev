// Smooth scroll
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
}

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
});

// Custom cursor
const cursorOuter = document.getElementById('cursorOuter');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let outerX = 0, outerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top = mouseY + 'px';
});

function animateCursor() {
  outerX += (mouseX - outerX) * 0.12;
  outerY += (mouseY - outerY) * 0.12;
  cursorOuter.style.left = outerX + 'px';
  cursorOuter.style.top = outerY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

const hoverTargets = document.querySelectorAll('a, button, .btn, .project-card, .stat-item, .link-item');
hoverTargets.forEach((el) => {
  el.addEventListener('mouseenter', () => cursorOuter.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorOuter.classList.remove('hover'));
});

// Scroll reveal with varied directions
const revealConfig = [
  { selector: '.hero .content-wrap', direction: 'reveal-up' },
  { selector: '.value-content', direction: 'reveal-left' },
  { selector: '.stats-grid', direction: 'reveal-right' },
  { selector: '.section-header', direction: 'reveal-up' },
  { selector: '.project-card', direction: 'reveal-scale' },
  { selector: '.cta-section .content-wrap', direction: 'reveal-up' },
  { selector: '.experience-section .content-wrap > h2', direction: 'reveal-left' },
  { selector: '.timeline-item', direction: 'reveal-left' },
  { selector: '.contact-cta', direction: 'reveal-left' },
  { selector: '.contact-form', direction: 'reveal-right' },
  { selector: '.links-section .content-wrap > h2', direction: 'reveal-up' },
  { selector: '.link-item', direction: 'reveal-scale' },
];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.06, rootMargin: '0px 0px -60px 0px' }
);

revealConfig.forEach(({ selector, direction }) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.setAttribute('data-reveal', '');
    el.classList.add(direction);
    observer.observe(el);
  });
});

// Stagger children
const staggerGroups = document.querySelectorAll('.stagger-children');
staggerGroups.forEach((group) => {
  Array.from(group.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 120}ms`;
  });
});

// Nav active state
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: '-30% 0px -60% 0px' }
);

sections.forEach((section) => navObserver.observe(section));

// Smooth parallax for bg text
const bgTexts = document.querySelectorAll('.bg-text, .hero-bg-text');

function updateParallax() {
  bgTexts.forEach((el) => {
    const rect = el.parentElement.getBoundingClientRect();
    const speed = 0.04;
    const offset = (rect.top + rect.height / 2) * speed;
    el.style.transform = `translateY(${offset}px)`;
  });
  requestAnimationFrame(updateParallax);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  requestAnimationFrame(updateParallax);
}


// Contact form submission via Web3Forms
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.success) {
        formStatus.textContent = 'Message sent successfully!';
        formStatus.className = 'form-status success';
        contactForm.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Try again.';
        formStatus.className = 'form-status error';
      }
    } catch {
      formStatus.textContent = 'Network error. Please try again.';
      formStatus.className = 'form-status error';
    }

    btn.disabled = false;
    btn.innerHTML = 'Send Message &rarr;';
  });
}
