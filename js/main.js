(function () {
  "use strict";

  /* ==========================================================
     1. FLOATING MATH CANVAS
     ========================================================== */
  const canvas = document.getElementById("math-canvas");
  const ctx = canvas.getContext("2d");
  const symbols = "∫ ∑ ∇ ∂ π Δ λ θ σ ε ∞ √ ≈ ≠ ≤ ≥ ∈ ⊂ ∀ ∃ α β γ ω φ".split(" ");

  let particles = [];
  let animFrameId;

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      speed: 0.3 + Math.random() * 0.6,
      drift: (Math.random() - 0.5) * 0.3,
      size: 14 + Math.random() * 16,
      opacity: 0.08 + Math.random() * 0.14,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.005,
    };
  }

  function initParticles() {
    const count = Math.floor((canvas.width * canvas.height) / 18000);
    particles = [];
    for (let i = 0; i < count; i++) {
      const p = createParticle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }
  }

  function isDark() {
    return document.documentElement.getAttribute("data-theme") !== "light";
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = isDark() ? "rgba(0,224,208," : "rgba(0,137,123,";

    for (const p of particles) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.font = `${p.size}px "Segoe UI", system-ui, sans-serif`;
      ctx.fillStyle = color + p.opacity + ")";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.symbol, 0, 0);
      ctx.restore();

      p.y -= p.speed;
      p.x += p.drift;
      p.rotation += p.rotSpeed;

      if (p.y < -30) {
        Object.assign(p, createParticle());
      }
    }

    animFrameId = requestAnimationFrame(drawParticles);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  resizeCanvas();
  initParticles();
  drawParticles();

  /* ==========================================================
     2. TYPEWRITER EFFECT
     ========================================================== */
  const phrases = [
    "Physical Model Developer",
    "Mathematician",
    "Problem Solver",
    "Simulation Engineer",
    "Data-Driven Thinker",
  ];

  const typewriterEl = document.getElementById("typewriter");
  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  const cursorSpan = document.createElement("span");
  cursorSpan.className = "cursor";
  cursorSpan.textContent = "";

  function type() {
    const current = phrases[phraseIdx];
    let displayText;

    if (!isDeleting) {
      charIdx++;
      displayText = current.slice(0, charIdx);
    } else {
      charIdx--;
      displayText = current.slice(0, charIdx);
    }

    typewriterEl.textContent = displayText;
    typewriterEl.appendChild(cursorSpan);

    let delay;
    if (!isDeleting && charIdx === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      delay = 400;
    } else {
      delay = isDeleting ? 35 : 65;
    }

    setTimeout(type, delay);
  }

  type();

  /* ==========================================================
     3. SCROLL-TRIGGERED REVEAL (IntersectionObserver)
     ========================================================== */
  const reveals = document.querySelectorAll(".reveal");

  // Assign stagger index to skill tags
  document.querySelectorAll(".skill-tag.reveal").forEach((tag, i) => {
    tag.style.setProperty("--i", i);
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  /* ==========================================================
     4. ACTIVE NAV HIGHLIGHT ON SCROLL
     ========================================================== */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");
  const navbar = document.getElementById("navbar");

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("active");
          }
        });
      }
    });

    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

  /* ==========================================================
     5. DARK / LIGHT MODE TOGGLE
     ========================================================== */
  const themeBtn = document.getElementById("theme-toggle");
  const stored = localStorage.getItem("theme");
  if (stored) {
    document.documentElement.setAttribute("data-theme", stored);
  }

  themeBtn.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  /* ==========================================================
     6. MOBILE HAMBURGER MENU
     ========================================================== */
  const hamburger = document.getElementById("nav-hamburger");
  const navLinksContainer = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinksContainer.classList.toggle("open");
  });

  navLinksContainer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinksContainer.classList.remove("open");
    });
  });
})();
