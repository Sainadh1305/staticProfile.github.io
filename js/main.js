// You can add JS interactivity here


// ================= Navigation =================
// Toggle mobile menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenuItems = document.querySelectorAll('.mobile-menu-item');

function openMobileMenu() {
  // Show overlay
  if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('hidden');

  // Show menu
  if (mobileMenu) mobileMenu.classList.remove('hidden');

  // Animate menu sliding in (give the browser a moment to recognize the element is visible)
  setTimeout(() => {
    if (mobileMenu) mobileMenu.classList.remove('translate-x-full');

    // Animate menu items with staggered delay
    if (mobileMenuItems) {
      mobileMenuItems.forEach((item, index) => {
        setTimeout(() => {
          item.classList.remove('translate-x-8', 'opacity-0');
        }, 100 + (index * 50));
      });
    }
  }, 10);

  // Prevent body scrolling
  document.body.classList.add('overflow-hidden');
}

function closeMobileMenu() {
  // Animate menu items out first
  if (mobileMenuItems) {
    mobileMenuItems.forEach(item => {
      item.classList.add('translate-x-8', 'opacity-0');
    });
  }

  // Animate menu sliding out
  if (mobileMenu) mobileMenu.classList.add('translate-x-full');

  // Hide overlay and menu after animation completes
  setTimeout(() => {
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('hidden');
    if (mobileMenu) mobileMenu.classList.add('hidden');

    // Allow body scrolling
    document.body.classList.remove('overflow-hidden');
  }, 300);
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', openMobileMenu);
}
if (mobileMenuClose) {
  mobileMenuClose.addEventListener('click', closeMobileMenu);
}
if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}


document.querySelectorAll('#mobile-menu a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // No closeMobileMenu() here to keep the blur + sidebar open after clicking a link
    // but we should close it if the user clicks a link
    closeMobileMenu(); 
  });
});

// Add background to navbar on scroll
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('bg-navy-900/90', 'backdrop-blur-xl', 'shadow-lg');
    } else {
      navbar.classList.remove('bg-navy-900/90', 'backdrop-blur-xl', 'shadow-lg');
    }
  });
}

// Smooth scrolling for anchor links
// smooth‐scroll for desktop nav links only
document.querySelectorAll('nav ul li a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

// ================= Stats Counter Animation =================
const counters = document.querySelectorAll('.counter');
if (counters.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.getAttribute('data-target'));
        const suffix = counter.getAttribute('data-suffix') || '';
        let current = 0;
        const increment = target / 100;
        // const duration = 2000; // Not used
        const stepTime = 20;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = current.toFixed(1).replace(/\\.0$/, '') + suffix;
            setTimeout(updateCounter, stepTime);
          } else {
            counter.textContent = target.toString() + suffix;
          }
        };

        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// ================= Skills Progress Animation =================
const skillBars = document.querySelectorAll('.skill-progress');
if (skillBars.length > 0) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBar = entry.target;
        const targetWidth = skillBar.getAttribute('data-width');

        setTimeout(() => {
          if (skillBar) skillBar.style.width = targetWidth;
        }, 200);

        skillObserver.unobserve(skillBar);
      }
    });
  }, { threshold: 0.5 });

  skillBars.forEach(skillBar => {
    skillObserver.observe(skillBar);
  });
}

// ================= Canvas Wave Animation =================
const waveCanvas = document.getElementById('wave-canvas');
if (waveCanvas) {
  const ctx = waveCanvas.getContext('2d');

  function resizeCanvas() {
    waveCanvas.width = window.innerWidth;
    waveCanvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const wave = {
    y: waveCanvas.height / 2,
    length: 0.01, // Not used
    amplitude: 100,
    frequency: 0.01
  };

  const colors = ['rgba(0, 201, 255, 0.2)', 'rgba(146, 254, 157, 0.2)', 'rgba(110, 69, 226, 0.2)'];

  function drawWave(color, frequency, amplitude, offset) {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(0, waveCanvas.height);

    for (let i = 0; i < waveCanvas.width; i++) {
      const x = i;
      const y = waveCanvas.height / 2 + Math.sin(x * frequency + offset) * amplitude;
      ctx.lineTo(x, y);
    }

    ctx.lineTo(waveCanvas.width, waveCanvas.height);
    ctx.lineTo(0, waveCanvas.height);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
  }

  let offset1 = 0;
  let offset2 = 3;
  let offset3 = 6;

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);

    offset1 += 0.01;
    offset2 += 0.015;
    offset3 += 0.02;

    drawWave(colors[0], wave.frequency, wave.amplitude * 0.7, offset1);
    drawWave(colors[1], wave.frequency * 1.5, wave.amplitude * 0.5, offset2);
    drawWave(colors[2], wave.frequency * 2, wave.amplitude * 0.3, offset3);

    requestAnimationFrame(animate);
  }

  animate();
}

// ================= Contact Form =================
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Show success message (in a real application, you would send the data to a server)
    const successToast = document.createElement('div');
    successToast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-primary to-lime-primary text-navy-900 px-6 py-3 rounded-lg shadow-xl z-50 toast-notification';
    successToast.innerHTML = `
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <span class="font-medium">Message sent successfully!</span>
      </div>
    `;

    document.body.appendChild(successToast);

    // Remove toast after animation completes
    setTimeout(() => {
      if (document.body.contains(successToast)) {
        document.body.removeChild(successToast);
      }
    }, 3000);

    // Reset form
    contactForm.reset();
  });
}
// ================= Floating Contact Card =================
const contactBtn = document.getElementById('contact-btn');
const contactCard = document.getElementById('contact-card');
const closeCardBtn = document.getElementById('close-card');

if (contactBtn && contactCard) {
  contactBtn.addEventListener('click', () => {
    // Show the contact card
    contactCard.classList.remove('hidden');

    // Navigate to the contact section
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
}

if (closeCardBtn && contactCard) {
  closeCardBtn.addEventListener('click', () => {
    contactCard.classList.add('hidden');
  });
}

// ================= Copy to Clipboard =================
function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-primary to-lime-primary text-navy-900 px-6 py-3 rounded-lg shadow-xl z-50 toast-notification';
    // Corrected template literal:
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
        </svg>
        <span class="font-medium">Copied: ${text}</span>
      </div>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 3000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}
