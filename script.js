const revealElements = document.querySelectorAll(
  '.hero .content-wrap, .value-content, .stats-grid, .section-header, .project-card, .cta-section .content-wrap, .experience-section .content-wrap > h2, .timeline-item, .contact-cta, .contact-form, .links-section .content-wrap > h2, .link-item'
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-reveal', '');
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el, i) => {
  el.setAttribute('data-reveal', '');
  observer.observe(el);
});

// Stagger timeline items and link items
const staggerGroups = document.querySelectorAll('.stagger-children');
staggerGroups.forEach((group) => {
  const children = group.children;
  Array.from(children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 100}ms`;
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
  const scrollY = window.scrollY;
  bgTexts.forEach((el) => {
    const rect = el.parentElement.getBoundingClientRect();
    const speed = 0.05;
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
