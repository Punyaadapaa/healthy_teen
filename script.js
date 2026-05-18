// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const winH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / winH) * 100;
  scrollProgress.style.width = pct + '%';
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navMenu.classList.remove('active'));
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
  revealEls.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
};
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Counter animation for stats
let statsAnimated = false;
const statsBar = document.getElementById('statsBar');

function animateCounters() {
  if (statsAnimated || !statsBar) return;
  const rect = statsBar.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
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
  }
}
window.addEventListener('scroll', animateCounters);
window.addEventListener('load', animateCounters);

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

// Active nav link highlight
const sections = document.querySelectorAll('section[id]');
const pillTabs = document.querySelectorAll('.pill-tab');
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 200;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    pillTabs.forEach(tab => {
      if (tab.getAttribute('href') === `#${id}`) {
        if (scrollPos >= top && scrollPos < top + height) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      }
    });
  });
});
