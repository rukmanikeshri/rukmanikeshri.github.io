/* =========================================================
   Rukmani Keshri — Supply Chain Portfolio · interactions
   ========================================================= */
(function () {
  "use strict";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Theme toggle ---------- */
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById("burger");
  const links = document.querySelector(".nav__links");
  if (burger && links) {
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      links.classList.remove("open"); burger.setAttribute("aria-expanded", "false");
    }));
  }

  /* ---------- Nav shadow ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 8);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Typed role ---------- */
  const typed = document.getElementById("typed");
  if (typed) {
    const phrases = ["Supply Chain Executive", "Logistics & Transport Ops", "Customer Assurance", "Inventory & Forecasting"];
    if (prefersReduced) { typed.textContent = phrases[0]; }
    else {
      let pi = 0, ci = 0, del = false;
      const tick = () => {
        const w = phrases[pi]; ci += del ? -1 : 1; typed.textContent = w.slice(0, ci);
        let d = del ? 45 : 80;
        if (!del && ci === w.length) { d = 1500; del = true; }
        else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; d = 350; }
        setTimeout(tick, d);
      };
      setTimeout(tick, 500);
    }
  }

  /* ---------- Skills data ---------- */
  const skills = [
    ["Customer Order Management (O2C)", 95],
    ["Oracle EBS Order Management", 90],
    ["Supply Chain Operations & Coordination", 100],
    ["Inventory & Material Planning", 97],
    ["Transport Operations & Logistics", 100],
    ["Export Documentation", 92],
    ["Advanced Excel", 95],
    ["Salesforce CRM", 90],
    ["SOP Development & Process Improvement", 90],
  ];
  const barsEl = document.getElementById("skillBars");
  if (barsEl) {
    barsEl.innerHTML = skills.map(s => `
      <div class="sk"><div class="sk__top"><b>${s[0]}</b><span>${s[1]}%</span></div>
      <div class="sk__track"><div class="sk__fill" data-w="${s[1]}"></div></div></div>`).join("");
  }

  /* ---------- Certifications data ---------- */
  const certs = [
    ["International Logistics & Transportation in Supply Chain", "Udemy · 2023", "assets/img/certs/intl-logistics.png", "https://www.udemy.com/certificate/UC-6b713e86-5aa2-40cf-83f5-eb535fb9c776/"],
    ["SAP MM (Materials Management) — Configuration & End User", "Udemy · 2022", "assets/img/certs/sap-mm.png", "https://www.udemy.com/certificate/UC-6f680b34-231a-4206-9e6c-09dc34809719/"],
    ["Microsoft Excel — Beginner to Advanced", "Udemy", "assets/img/certs/excel.png", "https://www.udemy.com/certificate/UC-8f3e5f1d-73da-482f-bca0-ad0e1e2ebf1b/"],
    ["Financial Accounting with Tally Prime & GST", "Rourkela Institute of Computer Education · 2020", "assets/img/certs/tally.jpg", ""],
    ["Post Graduate Diploma in Computer Application", "Vedanta Foundation · 2019", "assets/img/certs/pg-diploma.jpg", ""],
  ];
  const gallery = document.getElementById("certGallery");
  if (gallery) {
    gallery.innerHTML = certs.map(c => {
      const linkHtml = c[3]
        ? `<a class="cert-card__link" href="${c[3]}" target="_blank" rel="noopener">Verify credential →</a>`
        : `<a class="cert-card__link" data-preview="${c[2]}" data-title="${c[0]}" href="${c[2]}">Preview →</a>`;
      return `<article class="cert-card reveal">
        <a class="cert-card__media" data-preview="${c[2]}" data-title="${c[0]}" href="${c[2]}">
          <img src="${c[2]}" alt="${c[0]} certificate" loading="lazy" />
          <span class="cert-card__view">Preview certificate ↗</span>
        </a>
        <div class="cert-card__body"><h3>${c[0]}</h3><p class="cert-card__org">${c[1]}</p>${linkHtml}</div>
      </article>`;
    }).join("");
  }

  /* ---------- Reveal + counters + bars (IO with fallback) ---------- */
  function whenVisible(el, cb, once) {
    let done = false;
    const run = () => { if (done) return; done = true; cb(); };
    if ("IntersectionObserver" in window && !prefersReduced) {
      const o = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { run(); if (once !== false) o.disconnect(); }
      }), { threshold: 0.18 });
      o.observe(el);
    }
    setTimeout(run, 1500);
  }

  document.querySelectorAll(".reveal").forEach((el) => whenVisible(el, () => el.classList.add("in")));

  const barsSection = document.getElementById("skills");
  if (barsSection) whenVisible(barsSection, () => {
    document.querySelectorAll(".sk__fill").forEach((f) => f.style.width = f.dataset.w + "%");
  });

  const statsSection = document.querySelector(".stats");
  if (statsSection) whenVisible(statsSection, () => {
    document.querySelectorAll(".stat__num").forEach((el) => {
      const t = +el.dataset.count;
      if (prefersReduced) { el.textContent = t; return; }
      const s = performance.now();
      (function f(n) { const p = Math.min((n - s) / 1200, 1); el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * t); if (p < 1) requestAnimationFrame(f); })(s);
    });
  });

  /* ---------- Active nav (center-line trigger) ---------- */
  const navLinks = document.querySelectorAll(".nav__links a");
  const sections = [...navLinks].map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
      }
    }), { threshold: 0, rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Certificate lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    const stage = document.getElementById("lightboxStage");
    const titleEl = document.getElementById("lightboxTitle");
    const openLink = document.getElementById("lightboxOpen");
    let lastFocused = null;

    const open = (href, title) => {
      stage.innerHTML = "";
      const img = document.createElement("img");
      img.src = href; img.alt = title || "Certificate";
      stage.appendChild(img);
      titleEl.textContent = title || "";
      openLink.href = href;
      lastFocused = document.activeElement;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      setTimeout(() => { stage.innerHTML = ""; }, 300);
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    };

    // delegate clicks on any element with data-preview
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-preview]");
      if (!t) return;
      e.preventDefault();
      open(t.getAttribute("data-preview"), t.getAttribute("data-title") || "");
    });
    lightbox.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && lightbox.classList.contains("open")) close(); });
  }

  /* =========================================================
     Supply-chain network canvas (hero)
     nodes = hubs, edges = routes, packages travel along routes
     ========================================================= */
  const canvas = document.getElementById("netCanvas");
  if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext("2d");
  let W, H, dpr, raf, nodes = [], edges = [], packages = [];
  let lineRGB = "14,116,144", nodeRGB = "245,158,11";

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    lineRGB = (cs.getPropertyValue("--net-line") || lineRGB).trim();
    nodeRGB = (cs.getPropertyValue("--net-node") || nodeRGB).trim();
  }
  readColors();
  new MutationObserver(readColors).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  function build() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const N = Math.max(9, Math.round((W * H) / 90000));
    nodes = [];
    for (let i = 0; i < N; i++) {
      nodes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
        r: 2 + Math.random() * 2.4, pulse: Math.random() * Math.PI * 2,
      });
    }
    // connect nearest neighbours into routes
    edges = [];
    for (let i = 0; i < nodes.length; i++) {
      const dists = nodes.map((n, j) => ({ j, d: Math.hypot(nodes[i].x - n.x, nodes[i].y - n.y) }))
        .filter((o) => o.j !== i).sort((a, b) => a.d - b.d).slice(0, 2);
      dists.forEach((o) => { if (!edges.some((e) => (e.a === o.j && e.b === i))) edges.push({ a: i, b: o.j }); });
    }
    // packages travelling on random edges
    packages = [];
    const pc = Math.min(edges.length, Math.max(5, Math.round(edges.length * .4)));
    for (let i = 0; i < pc; i++) packages.push({ e: Math.floor(Math.random() * edges.length), t: Math.random(), s: .0016 + Math.random() * .0024 });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // routes
    edges.forEach((e) => {
      const a = nodes[e.a], b = nodes[e.b];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const alpha = Math.max(0, 1 - d / 340) * 0.25;
      ctx.strokeStyle = `rgba(${lineRGB},${alpha})`;
      ctx.lineWidth = 1; ctx.setLineDash([5, 6]);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    });
    ctx.setLineDash([]);

    // nodes
    const t = performance.now() / 900;
    nodes.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const glow = 0.55 + 0.45 * Math.sin(t + p.pulse);
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${lineRGB},${0.35 + glow * 0.3})`;
      ctx.fill();
    });

    // packages (little squares moving along routes)
    packages.forEach((pk) => {
      const e = edges[pk.e]; if (!e) return;
      const a = nodes[e.a], b = nodes[e.b];
      pk.t += pk.s; if (pk.t > 1) { pk.t = 0; pk.e = Math.floor(Math.random() * edges.length); }
      const x = a.x + (b.x - a.x) * pk.t, y = a.y + (b.y - a.y) * pk.t;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(${nodeRGB},.95)`;
      ctx.shadowColor = `rgba(${nodeRGB},.7)`; ctx.shadowBlur = 8;
      ctx.fillRect(-3, -3, 6, 6);
      ctx.restore();
    });
    ctx.shadowBlur = 0;

    raf = requestAnimationFrame(draw);
  }

  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 180); });

  const heroEl = document.getElementById("hero");
  if (heroEl && "IntersectionObserver" in window) {
    new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { if (!raf) draw(); } else { cancelAnimationFrame(raf); raf = null; }
    }), { threshold: 0.02 }).observe(heroEl);
  }

  build(); draw();
})();
