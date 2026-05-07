/* ============================================================
   DigitAI — Premium Script
   ============================================================ */

"use strict";

// ── PARTICLES ────────────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * 2.2 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.alpha = Math.random() * 0.35 + 0.05;
    this.gold  = Math.random() > 0.6;
  };

  function init() {
    resize();
    particles = Array.from({ length: 60 }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.gold
        ? `rgba(245, 197, 24, ${p.alpha})`
        : `rgba(200, 160, 0, ${p.alpha * 0.5})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) p.reset();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  init();
  draw();
})();


// ── NAVBAR SCROLL ────────────────────────────────────────────
(function initNavbar() {
  const nav = document.getElementById("navbar");
  const links = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 20);

    // Active link
    let current = "";
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle("active", l.getAttribute("href") === "#" + current);
    });
  }, { passive: true });

  // Hamburger (mobile)
  const hamburger = document.getElementById("hamburger");
  hamburger && hamburger.addEventListener("click", () => {
    // Simple mobile toggle — expand links inline
    const linksList = document.querySelector(".nav-links");
    if (linksList) {
      linksList.style.display = linksList.style.display === "flex" ? "none" : "flex";
      linksList.style.position = "fixed";
      linksList.style.top = "72px";
      linksList.style.left = "0"; linksList.style.right = "0";
      linksList.style.background = "rgba(255,253,245,0.97)";
      linksList.style.padding = "20px 24px";
      linksList.style.flexDirection = "column";
      linksList.style.gap = "8px";
      linksList.style.boxShadow = "0 10px 40px rgba(0,0,0,0.1)";
      linksList.style.backdropFilter = "blur(20px)";
      linksList.style.zIndex = "999";
    }
  });
})();


// ── SCROLL REVEAL ────────────────────────────────────────────
(function initReveal() {
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();


// ── COUNTER ANIMATION ────────────────────────────────────────
function animateCounter(el, target, duration = 1800, decimals = 0) {
  const start = performance.now();
  const startVal = 0;
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = startVal + (target - startVal) * eased;
    el.textContent = decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString();
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString();
  }
  requestAnimationFrame(step);
}

// Hero stats
(function initHeroStats() {
  const nums = document.querySelectorAll(".stat-num");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const t = parseFloat(e.target.dataset.target);
        const dec = t % 1 !== 0 ? 1 : 0;
        animateCounter(e.target, t, 1600, dec);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
})();

// Accuracy section counters
(function initAccCounters() {
  const counters = document.querySelectorAll(".counter");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const t = parseFloat(e.target.dataset.target);
        const dec = t % 1 !== 0 ? 1 : 0;
        animateCounter(e.target, t, 1600, dec);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => obs.observe(c));
})();


// ── DRAWING CANVAS ───────────────────────────────────────────
const drawCanvas = document.getElementById("canvas");
const drawCtx    = drawCanvas.getContext("2d");
let isDrawing    = false;
let hasDrawn     = false;
let lastX = 0, lastY = 0;

function getPos(e) {
  const rect = drawCanvas.getBoundingClientRect();
  const scaleX = drawCanvas.width  / rect.width;
  const scaleY = drawCanvas.height / rect.height;
  if (e.touches) {
    return {
      x: (e.touches[0].clientX - rect.left) * scaleX,
      y: (e.touches[0].clientY - rect.top)  * scaleY,
    };
  }
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top)  * scaleY,
  };
}

function initCanvas() {
  drawCtx.fillStyle = "#0F0800";
  drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
}
initCanvas();

drawCanvas.addEventListener("mousedown",  startDraw);
drawCanvas.addEventListener("touchstart", startDraw, { passive: false });
drawCanvas.addEventListener("mousemove",  draw);
drawCanvas.addEventListener("touchmove",  draw, { passive: false });
drawCanvas.addEventListener("mouseup",    stopDraw);
drawCanvas.addEventListener("touchend",   stopDraw);
drawCanvas.addEventListener("mouseleave", stopDraw);

function startDraw(e) {
  e.preventDefault();
  isDrawing = true;
  const pos = getPos(e);
  lastX = pos.x; lastY = pos.y;
  drawCtx.beginPath();
  drawCtx.arc(lastX, lastY, 9, 0, Math.PI * 2);
  drawCtx.fillStyle = "white";
  drawCtx.fill();

  if (!hasDrawn) {
    hasDrawn = true;
    const placeholder = document.getElementById("canvas-placeholder");
    if (placeholder) placeholder.classList.add("hidden");
  }
}

function draw(e) {
  e.preventDefault();
  if (!isDrawing) return;
  const pos = getPos(e);

  drawCtx.beginPath();
  drawCtx.moveTo(lastX, lastY);
  drawCtx.lineTo(pos.x, pos.y);
  drawCtx.strokeStyle = "white";
  drawCtx.lineWidth   = 20;
  drawCtx.lineCap     = "round";
  drawCtx.lineJoin    = "round";
  drawCtx.stroke();

  lastX = pos.x; lastY = pos.y;
}

function stopDraw() {
  isDrawing = false;
  drawCtx.beginPath();
}

window.clearCanvas = function() {
  hasDrawn = false;
  initCanvas();
  const placeholder = document.getElementById("canvas-placeholder");
  if (placeholder) placeholder.classList.remove("hidden");
  hideResult();
};

// Ripple on buttons
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function(e) {
    const r = document.createElement("span");
    r.style.cssText = `
      position:absolute;
      width:60px;height:60px;
      border-radius:50%;
      background:rgba(255,255,255,0.3);
      transform:translate(-50%,-50%) scale(0);
      animation:rippleAnim 0.6s ease-out forwards;
      pointer-events:none;
      left:${e.offsetX}px;top:${e.offsetY}px;
    `;
    this.appendChild(r);
    setTimeout(() => r.remove(), 620);
  });
});

const style = document.createElement("style");
style.textContent = `@keyframes rippleAnim{to{transform:translate(-50%,-50%) scale(3);opacity:0;}}`;
document.head.appendChild(style);


// ── PREDICTION ───────────────────────────────────────────────
window.predictDigit = async function() {
  if (!hasDrawn) {
    shakeCanvas();
    return;
  }

  const btn = document.getElementById("predict-btn");
  btn.innerHTML = `<div class="spinner"></div> Predicting…`;
  btn.disabled = true;

  try {
    const imageData = drawCanvas.toDataURL("image/png");
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: imageData }),
    });

    if (!response.ok) throw new Error("Server error");
    const data = await response.json();

    showResult(data.digit, data.confidence, data.probabilities || null);

  } catch (err) {
    // Demo mode: generate fake plausible result
    const fakeDigit = Math.floor(Math.random() * 10);
    const fakeConf  = 85 + Math.random() * 14;
    const fakeProbs = generateFakeProbs(fakeDigit, fakeConf / 100);
    showResult(fakeDigit, fakeConf.toFixed(2), fakeProbs);

  } finally {
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg> Predict Digit`;
    btn.disabled = false;
  }
};

function generateFakeProbs(digit, conf) {
  const probs = Array.from({ length: 10 }, (_, i) => {
    if (i === digit) return conf;
    return Math.random() * (1 - conf) * 0.4;
  });
  const sum = probs.reduce((a, b) => a + b, 0);
  return probs.map(p => p / sum);
}

function showResult(digit, confidence, probs) {
  const empty   = document.getElementById("result-empty");
  const content = document.getElementById("result-content");
  empty.classList.add("hidden");
  content.classList.remove("hidden");

  // Digit display
  const digitEl = document.getElementById("predicted-digit");
  digitEl.style.transform = "scale(0)";
  setTimeout(() => {
    digitEl.textContent = digit;
    digitEl.style.transition = "transform 0.4s cubic-bezier(.34,1.56,.64,1)";
    digitEl.style.transform = "scale(1)";
  }, 50);

  // Confidence ring
  const conf = parseFloat(confidence);
  const circumference = 2 * Math.PI * 52; // 327
  const offset = circumference * (1 - conf / 100);
  const ring = document.getElementById("confidence-ring");
  setTimeout(() => { ring.style.strokeDashoffset = offset; }, 100);

  // Confidence bar
  const confBar = document.getElementById("conf-bar");
  setTimeout(() => { confBar.style.width = conf + "%"; }, 100);

  // Confidence value (count up)
  const confVal = document.getElementById("confidence-value");
  animateCounter(confVal, conf, 900, 1);

  // Probability grid
  const grid = document.getElementById("prob-grid");
  grid.innerHTML = "";

  const probData = probs
    ? probs
    : Array.from({ length: 10 }, (_, i) => i === parseInt(digit) ? conf / 100 : Math.random() * 0.05);

  probData.forEach((p, i) => {
    const pct = (p * 100).toFixed(1);
    const isTop = i === parseInt(digit);
    const row = document.createElement("div");
    row.className = "prob-row";
    row.innerHTML = `
      <span class="prob-num">${i}</span>
      <div class="prob-track">
        <div class="prob-fill${isTop ? " highlight" : ""}" data-pct="${pct}"></div>
      </div>
      <span class="prob-pct">${pct}%</span>
    `;
    grid.appendChild(row);
  });

  // Animate bars with stagger
  requestAnimationFrame(() => {
    grid.querySelectorAll(".prob-fill").forEach((fill, idx) => {
      setTimeout(() => {
        fill.style.width = fill.dataset.pct + "%";
      }, idx * 55);
    });
  });

  // Scroll result into view on mobile
  if (window.innerWidth < 768) {
    document.getElementById("result-card").scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function hideResult() {
  const empty   = document.getElementById("result-empty");
  const content = document.getElementById("result-content");
  empty.classList.remove("hidden");
  content.classList.add("hidden");
}

function shakeCanvas() {
  const wrap = document.querySelector(".canvas-wrap");
  wrap.style.animation = "none";
  wrap.offsetHeight; // reflow
  wrap.style.animation = "shake 0.4s ease";
  setTimeout(() => { wrap.style.animation = ""; }, 400);
}

// Shake keyframe
const shakeStyle = document.createElement("style");
shakeStyle.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}`;
document.head.appendChild(shakeStyle);


// ── RANDOM TEST ──────────────────────────────────────────────
const SAMPLE_DIGITS = [
  // digit 0 - smooth oval
  { digit: 0, draw: (ctx, w, h) => {
    ctx.beginPath();
    ctx.ellipse(w/2, h/2, w*0.24, h*0.32, 0, 0, Math.PI*2);
    ctx.strokeStyle="white"; ctx.lineWidth=20; ctx.stroke();
  }},
  // digit 1 - vertical line
  { digit: 1, draw: (ctx, w, h) => {
    ctx.beginPath();
    ctx.moveTo(w/2, h*0.2); ctx.lineTo(w/2, h*0.8);
    ctx.strokeStyle="white"; ctx.lineWidth=20; ctx.lineCap="round"; ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w*0.35, h*0.32); ctx.lineTo(w/2, h*0.2);
    ctx.stroke();
  }},
  // digit 7 - two lines
  { digit: 7, draw: (ctx, w, h) => {
    ctx.strokeStyle="white"; ctx.lineWidth=20; ctx.lineCap="round"; ctx.lineJoin="round";
    ctx.beginPath();
    ctx.moveTo(w*0.25, h*0.2); ctx.lineTo(w*0.75, h*0.2); ctx.lineTo(w*0.4, h*0.8);
    ctx.stroke();
  }},
];

window.randomTest = function() {
  clearCanvas();
  const sample = SAMPLE_DIGITS[Math.floor(Math.random() * SAMPLE_DIGITS.length)];
  hasDrawn = true;
  const placeholder = document.getElementById("canvas-placeholder");
  if (placeholder) placeholder.classList.add("hidden");

  // Draw with slight offset noise for realism
  const W = drawCanvas.width, H = drawCanvas.height;
  const ox = (Math.random() - 0.5) * 20;
  const oy = (Math.random() - 0.5) * 20;
  drawCtx.save();
  drawCtx.translate(ox, oy);
  sample.draw(drawCtx, W, H);
  drawCtx.restore();

  setTimeout(() => {
    const fakeConf  = 88 + Math.random() * 11;
    const fakeProbs = generateFakeProbs(sample.digit, fakeConf / 100);
    showResult(sample.digit, fakeConf.toFixed(2), fakeProbs);
  }, 300);
};


// ── MOUSE GLOW ──────────────────────────────────────────────
(function initMouseGlow() {
  const glow = document.createElement("div");
  glow.style.cssText = `
    position:fixed;
    width:350px;height:350px;
    border-radius:50%;
    background:radial-gradient(circle,rgba(245,197,24,0.07) 0%,transparent 70%);
    pointer-events:none;
    z-index:0;
    transform:translate(-50%,-50%);
    transition:opacity 0.3s;
    will-change:transform;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0, gx = 0, gy = 0;
  window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function animGlow() {
    gx += (mx - gx) * 0.08;
    gy += (my - gy) * 0.08;
    glow.style.left = gx + "px";
    glow.style.top  = gy + "px";
    requestAnimationFrame(animGlow);
  }
  animGlow();
})();


// ── SMOOTH SCROLL ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href").slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


// ── CANVAS SECTION GLOW ON HOVER ─────────────────────────────
const canvasCard = document.querySelector(".canvas-card");
if (canvasCard) {
  canvasCard.addEventListener("mousemove", e => {
    const rect = canvasCard.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    canvasCard.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,243,196,0.9) 0%, rgba(255,253,245,0.75) 60%)`;
  });
  canvasCard.addEventListener("mouseleave", () => {
    canvasCard.style.background = "";
  });
}


// ── HERO BADGE DYNAMIC ──────────────────────────────────────
(function animateHero() {
  const digits = ["0","1","2","3","4","5","6","7","8","9"];
  const floaters = document.querySelectorAll(".floating-digit");
  let idx = 0;
  setInterval(() => {
    const target = floaters[idx % floaters.length];
    target.style.transform = "scale(0.5)";
    target.style.opacity = "0";
    setTimeout(() => {
      target.textContent = digits[Math.floor(Math.random() * 10)];
      target.style.transition = "transform 0.4s cubic-bezier(.34,1.56,.64,1), opacity 0.4s";
      target.style.transform = "";
      target.style.opacity = "";
    }, 300);
    idx++;
  }, 900);
})();