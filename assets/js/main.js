const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const COLORS = ["#ff5a36", "#2f4bff", "#ffc23d", "#2fb985", "#a98bff"];
const rand = (min, max) => min + Math.random() * (max - min);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.textContent = open ? "Close" : "Menu";
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.textContent = "Menu";
    });
  });
}

// Highlight the nav link for the section in view
const navAnchors = [...document.querySelectorAll(".nav-links a")];
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === `#${entry.target.id}`));
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("section[id]").forEach((s) => sectionObserver.observe(s));
}

// Scroll progress bar
const progress = document.querySelector(".scroll-progress");
if (progress) {
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();
}

// Reveal-on-scroll
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in-view"));
}

// Hero title: split into letters that bounce when touched or hovered
document.querySelectorAll(".hero-title .split").forEach((word) => {
  const text = word.textContent;
  word.textContent = "";
  [...text].forEach((ch) => {
    const span = document.createElement("span");
    span.className = "char";
    span.setAttribute("aria-hidden", "true");
    span.textContent = ch === " " ? "\u00a0" : ch;
    word.appendChild(span);
  });
});

const bump = (el) => {
  if (!el || !el.classList.contains("char") || reduceMotion) return;
  el.classList.add("bump");
  setTimeout(() => el.classList.remove("bump"), 220);
};
const heroTitle = document.querySelector(".hero-title");
if (heroTitle) {
  heroTitle.addEventListener("pointerover", (e) => bump(e.target));
  // Dragging a finger across the title bounces each letter it passes
  heroTitle.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    bump(document.elementFromPoint(t.clientX, t.clientY));
  }, { passive: true });
}

// Playground: tap or click anywhere in the hero to spawn a burst of shapes
const hero = document.querySelector(".hero");
const playground = document.querySelector(".playground");
const hint = document.querySelector(".hint");
const WORDS = ["hello!", "ship it", "O(1)", "p99 < 600ns", "RAG", "fit()", "✦", "ok!", "async", "nice"];
let taps = 0;

function spawnBurst(x, y) {
  const count = reduceMotion ? 1 : 9;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    const kind = i === 0 ? "word" : pick(["circle", "ring", "square", "star", "circle"]);
    const color = pick(COLORS);
    const size = rand(10, 34);
    el.className = `shape ${kind}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.color = color;
    if (kind === "word") {
      el.textContent = pick(WORDS);
      el.style.fontSize = `${rand(1.6, 2.6)}rem`;
    } else if (kind === "star") {
      el.textContent = "✦";
      el.style.fontSize = `${size * 1.4}px`;
    } else {
      el.style.width = el.style.height = `${size}px`;
      el.style.background = color;
    }
    playground.appendChild(el);

    if (reduceMotion) {
      el.style.transform = "translate(-50%, -50%)";
      setTimeout(() => el.remove(), 900);
      continue;
    }
    const angle = kind === "word" ? -Math.PI / 2 : rand(0, Math.PI * 2);
    const dist = kind === "word" ? 70 : rand(60, 180);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const spin = kind === "word" ? rand(-12, 12) : rand(-240, 240);
    el.animate(
      [
        { transform: "translate(-50%, -50%) scale(0) rotate(0deg)", opacity: 1 },
        { transform: `translate(calc(-50% + ${dx * 0.8}px), calc(-50% + ${dy * 0.8}px)) scale(1) rotate(${spin * 0.6}deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 60}px)) scale(0.7) rotate(${spin}deg)`, opacity: 0 },
      ],
      { duration: rand(1100, 1700), easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
    ).onfinish = () => el.remove();
  }
}

if (hero && playground) {
  hero.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button")) return;
    const rect = hero.getBoundingClientRect();
    spawnBurst(e.clientX - rect.left, e.clientY - rect.top);
    taps += 1;
    if (hint && taps === 1) hint.querySelector(".hint-text").textContent = "Again!";
    if (hint && taps === 4) hint.querySelector(".hint-text").textContent = "Okay, you get it — scroll down ↓";
    if (hint && taps === 8) hint.classList.add("gone");
  });
}

// Sticker: spins faster while touched or hovered, flips the message on tap
const sticker = document.querySelector(".sticker");
if (sticker) {
  sticker.addEventListener("click", () => {
    sticker.classList.toggle("flipped");
    if (!reduceMotion) {
      const r = sticker.getBoundingClientRect();
      const h = hero.getBoundingClientRect();
      spawnBurst(r.left + r.width / 2 - h.left, r.top + r.height / 2 - h.top);
    }
  });
}

// Custom cursor dot (mouse only)
const cursor = document.querySelector(".cursor");
if (cursor && finePointer && !reduceMotion) {
  document.documentElement.classList.add("has-cursor");
  let cx = -100, cy = -100, tx = -100, ty = -100;
  window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  const loop = () => {
    cx += (tx - cx) * 0.25;
    cy += (ty - cy) * 0.25;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  };
  loop();
  document.addEventListener("pointerover", (e) => {
    cursor.classList.toggle("is-big", !!e.target.closest("a, button, .project-card, .skill-card"));
  });
}

// Magnetic buttons: they lean toward the pointer
if (finePointer && !reduceMotion) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
}

// Skill cards: color floods in from wherever you touch or hover
document.querySelectorAll(".skill-card").forEach((card) => {
  const setOrigin = (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - r.left}px`);
    card.style.setProperty("--y", `${e.clientY - r.top}px`);
  };
  card.addEventListener("pointerenter", setOrigin);
  card.addEventListener("pointerdown", (e) => {
    setOrigin(e);
    if (e.pointerType !== "mouse") card.classList.toggle("is-lit");
  });
});

// Project cards: tilt toward the pointer, tap to expand details
const projectCards = document.querySelectorAll(".project-card");
projectCards.forEach((card) => {
  const items = card.querySelectorAll("li");
  if (items.length > 1) {
    const more = document.createElement("p");
    more.className = "more";
    more.textContent = `+ ${items.length - 1} more — tap to expand`;
    card.querySelector("ul").after(more);
  }
  card.tabIndex = 0;
  card.setAttribute("aria-expanded", "false");

  const toggle = () => {
    const open = card.classList.toggle("is-open");
    card.setAttribute("aria-expanded", String(open));
    const more = card.querySelector(".more");
    if (more) more.textContent = open ? "− show less" : `+ ${items.length - 1} more — tap to expand`;
  };
  card.addEventListener("click", (e) => {
    if (e.target.closest("a")) return;
    toggle();
  });
  card.addEventListener("keydown", (e) => {
    if (e.target !== card || (e.key !== "Enter" && e.key !== " ")) return;
    e.preventDefault();
    toggle();
  });

  if (finePointer && !reduceMotion) {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--ry", `${px * 6}deg`);
      card.style.setProperty("--rx", `${-py * 6}deg`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--rx", "0deg");
    });
  }
});

// Project category filter
const filterBtns = document.querySelectorAll(".filter-btn");

// Show how many projects each filter matches
filterBtns.forEach((btn) => {
  const filter = btn.dataset.filter;
  const n = [...projectCards].filter((c) => filter === "all" || c.dataset.category === filter).length;
  const count = document.createElement("span");
  count.className = "count";
  count.textContent = n;
  btn.appendChild(count);
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");

    projectCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.hidden = !show;
      card.classList.remove("pop");
      if (show && !reduceMotion) {
        void card.offsetWidth; // restart the animation
        card.classList.add("pop");
      }
    });
  });
});

// Copy email on click (the mailto link still opens as usual)
const toast = document.querySelector(".toast");
let toastTimer;
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
document.querySelectorAll("[data-copy]").forEach((el) => {
  el.addEventListener("click", () => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(el.dataset.copy).then(
      () => showToast(`Copied ${el.dataset.copy} ✓`),
      () => {}
    );
  });
});

// Footer year
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
