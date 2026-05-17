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

// Scroll reveal with stagger
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

// Mouse-tracking blob
const blob = document.getElementById('mouseBlob');
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  blob.classList.add('active');
  blob.style.left = mouseX + 'px';
  blob.style.top = mouseY + 'px';
});
document.addEventListener('mouseleave', () => {
  blob.classList.remove('active');
});

// Interactive canvas background
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let cW, cH;

function resizeCanvas() {
  cW = canvas.width = window.innerWidth;
  cH = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * cW;
    this.y = Math.random() * cH;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.3 + 0.05;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    // Mouse interaction
    const dx = this.x - mouseX;
    const dy = this.y - (mouseY + window.scrollY);
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      const force = (150 - dist) / 150;
      this.x += dx * force * 0.02;
      this.y += dy * force * 0.02;
    }

    if (this.x < 0 || this.x > cW || this.y < 0 || this.y > cH) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0, 214, 143, ${this.opacity})`;
    ctx.fill();
  }
}

// Create particles
for (let i = 0; i < 80; i++) {
  particles.push(new Particle());
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0, 184, 118, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, cW, cH);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  drawLines();
  requestAnimationFrame(animateCanvas);
}
animateCanvas();

// Counter animation for stats
let statsAnimated = false;
const statsBar = document.getElementById('statsBar');

function animateCounters() {
  if (statsAnimated) return;
  const rect = statsBar.getBoundingClientRect();
  if (rect.top < window.innerHeight - 100) {
    statsAnimated = true;

    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target);
      const suffix = el.textContent.replace(/[0-9]/g, '');
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current + suffix;
      }, 40);
    });

    // Animate stat bars
    document.querySelectorAll('.stat-bar-fill').forEach(bar => {
      setTimeout(() => bar.classList.add('animate'), 300);
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
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Parallax on scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.shape').forEach((shape, i) => {
    const speed = 0.02 + i * 0.01;
    shape.style.transform = `translateY(${scrollY * speed}px) rotate(${scrollY * 0.02}deg)`;
  });
});

// Active nav link highlight
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 200;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`nav ul a[href="#${id}"]`);
    if (link) {
      if (scrollPos >= top && scrollPos < top + height) {
        link.style.color = 'var(--accent)';
        link.style.background = 'rgba(0,184,118,0.1)';
      } else {
        link.style.color = '';
        link.style.background = '';
      }
    }
  });
});
