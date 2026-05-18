// DOM References
const scrollProgress = document.getElementById('scrollProgress');
const nav = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const sections = document.querySelectorAll('section[id]');
const pillTabs = document.querySelectorAll('.pill-tab');
const statsBar = document.getElementById('stats-bar');

// Hamburger menu
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('active'));
});

// Single scroll listener with rAF throttle
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
    ticking = true;
  }
});

function onScroll() {
  const scrollY = window.scrollY;

  // 1. Scroll progress bar
  const winH = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = (scrollY / winH) * 100 + '%';

  // 2. Navbar scroll effect
  nav.classList.toggle('scrolled', scrollY > 50);

  // 3. Active nav link highlight
  const scrollPos = scrollY + 200;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    pillTabs.forEach(tab => {
      if (tab.getAttribute('href') === `#${id}`) {
        tab.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
      }
    });
  });
}

// Run once on load for initial state
window.addEventListener('load', onScroll);

// IntersectionObserver for scroll reveal
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // Stop observing once revealed
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// IntersectionObserver for counter animation
let statsAnimated = false;

if (statsBar) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          document.querySelectorAll('.stat-number[data-target]').forEach(el => {
            const target = parseInt(el.dataset.target);
            let current = 0;
            const step = Math.max(1, Math.floor(target / 40));
            const timer = setInterval(() => {
              current += step;
              if (current >= target) {
                current = target;
                clearInterval(timer);
              }
              el.textContent = current;
            }, 40);
          });
          statsObserver.unobserve(entry.target); // Only animate once
        }
      });
    },
    { threshold: 0.3 }
  );

  statsObserver.observe(statsBar);
}

// Tilt effect on cards
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
