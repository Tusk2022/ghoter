/* ================================================================
   GHOTER — Portfolio
   Vanilla JS. Progressive enhancement: GSAP + ScrollTrigger + Lenis
   (loaded via CDN in index.html) are optional — every core interaction
   (loader, menu, video playback, reveals) works without them.
   ================================================================ */

/* ----------------------------------------------------------------
   0. CENTRAL CONFIG — edit links here, nothing else
   ---------------------------------------------------------------- */
const SITE_CONFIG = {
  instagram: "https://www.instagram.com/ghoterfx/",
  reels: "https://www.instagram.com/ghoterfx/reels/",
  // TODO: paste the real Discord invite link here when available.
  discord: "#",
  developer: "https://www.tusk-dev.com.br/"
};

/* Optional secondary software — remove any entry to drop it from the
   TOOLS section, or add a new one following the same shape. */
const TOOLS = [
  "PREMIERE PRO",
  "PHOTOSHOP",
  "DAVINCI RESOLVE"
];

/* Selected work + reels source of truth.
   To add a project: push a new object here with a unique id.
   `video` / `poster` paths point to ./assets — drop the matching file
   in place and it replaces the placeholder automatically.
   `instagram` should be the direct reel permalink once known; falls
   back to the general reels page otherwise.
   `vertical: false` marks a landscape (16:9) source — it still shows
   in Selected Work, but is skipped by the Reels grid, which is 9:16
   only. Object-fit:cover crops a landscape clip into a 9:16 card down
   to a thin sliver of its center, which reads as broken rather than
   a deliberate crop, so it's left out instead. Omit the flag (or set
   it true) for a vertical source. */
const projects = [
  {
    id: "01",
    title: "KINETIC FORM",
    category: "3D / VFX",
    software: "Blender + After Effects",
    year: "2026",
    video: "./assets/videos/project-01.mp4",
    poster: "./assets/posters/project-01.webp",
    instagram: SITE_CONFIG.reels
  },
  {
    id: "02",
    title: "GLASS FRACTURE",
    category: "VFX / COMPOSITING",
    software: "Blender + After Effects",
    year: "2026",
    video: "./assets/videos/project-02.mp4",
    poster: "./assets/posters/project-02.webp",
    instagram: SITE_CONFIG.reels
  },
  {
    id: "03",
    title: "LIQUID METAL",
    category: "3D / MOTION",
    software: "Blender + After Effects",
    year: "2026",
    video: "./assets/videos/project-03.mp4",
    poster: "./assets/posters/project-03.webp",
    instagram: SITE_CONFIG.reels,
    vertical: false
  },
  {
    id: "04",
    title: "SIGNAL NOISE",
    category: "MOTION DESIGN",
    software: "After Effects",
    year: "2026",
    video: "./assets/videos/project-04.mp4",
    poster: "./assets/posters/project-04.webp",
    instagram: SITE_CONFIG.reels
  },
  {
    id: "05",
    title: "CHROME DRIFT",
    category: "3D / VFX",
    software: "Blender + After Effects",
    year: "2026",
    video: "./assets/videos/project-05.mp4",
    poster: "./assets/posters/project-05.webp",
    instagram: SITE_CONFIG.reels
  },
  {
    id: "06",
    title: "PARTICLE FIELD",
    category: "VFX / MOTION",
    software: "Blender + After Effects",
    year: "2026",
    video: "./assets/videos/project-06.mp4",
    poster: "./assets/posters/project-06.webp",
    instagram: SITE_CONFIG.reels
  }
];

/* ----------------------------------------------------------------
   1. UTIL
   ---------------------------------------------------------------- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

function qs(sel, ctx = document) { return ctx.querySelector(sel); }
function qsa(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

/* Wires the is-ready class that reveals a <video> over its placeholder.
   A video with autoplay/preload can finish loading its first frame before
   this script (loaded at the end of <body>) ever attaches a listener, so
   the loadeddata event would be missed — readyState is checked as a
   synchronous fallback for that race. */
function markVideoReady(video) {
  const markReady = () => video.classList.add("is-ready");
  video.addEventListener("loadeddata", markReady);
  video.addEventListener("error", () => video.classList.remove("is-ready"));
  if (video.readyState >= 2) markReady(); // HAVE_CURRENT_DATA or further along
}

/* Keeps the "current year" branding (header status, hero meta, footer
   copyright) correct without a yearly edit — reads the visitor's clock,
   so it rolls over to 2027 on its own. The featured project's YEAR spec
   is deliberately NOT included here: that one records when that specific
   piece was made, not "now". */
function updateYearBadges() {
  const year = String(new Date().getFullYear());
  ["yearHeader", "yearHero", "yearFooter"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = year;
  });
}

/* ----------------------------------------------------------------
   2. DISCORD / DYNAMIC LINKS
   Every element that should point to Discord shares this id list —
   they all read from SITE_CONFIG.discord, so it only needs editing once.
   ---------------------------------------------------------------- */
function wireDynamicLinks() {
  ["mobileDiscordLink", "contactDiscord", "footerDiscordLink"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = SITE_CONFIG.discord;
  });
}

/* ----------------------------------------------------------------
   3. LOADER
   Simulated progress so the bar always feels alive, resolved once the
   window has actually finished loading (capped so it never stalls).
   ---------------------------------------------------------------- */
function initLoader() {
  const loader = qs("#loader");
  const fill = qs("#loaderFill");
  const count = qs("#loaderCount");
  if (!loader) return Promise.resolve();

  return new Promise((resolve) => {
    let progress = 0;
    let done = false;

    const tick = () => {
      if (done) return;
      const target = document.readyState === "complete" ? 100 : 88;
      progress += (target - progress) * 0.12 + 0.4;
      progress = Math.min(progress, 99);
      fill.style.width = progress + "%";
      count.textContent = String(Math.floor(progress)).padStart(2, "0");
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const finish = () => {
      if (done) return;
      done = true;
      fill.style.width = "100%";
      count.textContent = "100";
      setTimeout(() => {
        loader.classList.add("is-hidden");
        document.body.classList.remove("is-loading");
        resolve();
      }, 260);
    };

    if (document.readyState === "complete") {
      setTimeout(finish, 400);
    } else {
      window.addEventListener("load", () => setTimeout(finish, 300), { once: true });
    }
    // Hard cap so a slow asset never traps the visitor on the loader.
    setTimeout(finish, 2600);
  });
}

/* ----------------------------------------------------------------
   4. HEADER — blur/background once the page has scrolled
   ---------------------------------------------------------------- */
function initHeader() {
  const header = qs("#header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ----------------------------------------------------------------
   5. MOBILE MENU
   ---------------------------------------------------------------- */
function initMobileMenu() {
  const burger = qs("#burgerBtn");
  const menu = qs("#mobileMenu");
  if (!burger || !menu) return;

  const close = () => {
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  const open = () => {
    menu.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.contains("is-open");
    isOpen ? close() : open();
  });

  qsa(".mobile-menu__link, .mobile-menu__social", menu).forEach((link) => {
    link.addEventListener("click", () => close());
  });
}

/* ----------------------------------------------------------------
   6. SMOOTH SCROLL (Lenis, optional) + in-page anchor navigation
   ---------------------------------------------------------------- */
function initSmoothScroll() {
  let lenis = null;

  if (!prefersReducedMotion && typeof window.Lenis !== "undefined") {
    lenis = new window.Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    if (hasGSAP) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add((time) => lenis.raf(time * 1000));
      window.gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  const headerH = 88;
  qsa('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -headerH + 1 });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    });
  });

  return lenis;
}

/* ----------------------------------------------------------------
   7. TEXT REVEAL — wraps [data-reveal] content in an inner span and
   toggles it in once the element enters the viewport (CSS does the rest).
   ---------------------------------------------------------------- */
function initRevealText() {
  const els = qsa("[data-reveal]");
  els.forEach((el, i) => {
    el.style.setProperty("--i", i % 6);
    el.innerHTML = `<span>${el.textContent}</span>`;
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  els.forEach((el) => io.observe(el));
}

/* ----------------------------------------------------------------
   8. LAZY / VIEWPORT-DRIVEN VIDEO PLAYBACK
   Applies to every <video> tagged data-lazy-video: source is only
   requested once the element nears the viewport, playback pauses
   when it leaves. A missing file simply leaves the placeholder
   underneath visible — never a broken box.
   ---------------------------------------------------------------- */
function initLazyVideos(root = document) {
  const videos = qsa("video[data-lazy-video]", root);
  if (!videos.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        if (!video.dataset.loaded) {
          video.load();
          video.dataset.loaded = "1";
        }
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { rootMargin: "200px 0px", threshold: 0.15 });

  videos.forEach((video) => {
    markVideoReady(video);
    io.observe(video);
  });
}

/* ----------------------------------------------------------------
   9. HERO VIDEO — always-on showreel background
   ---------------------------------------------------------------- */
function initHeroVideo() {
  const video = qs("#heroVideo");
  if (!video) return;
  markVideoReady(video);

  // Many showreel exports open on a slow, dark establishing beat. Skipping
  // a couple of seconds in means visitors land on a livelier frame instead
  // of a near-black one. Adjust/remove once the final hero cut is in.
  const skipIntro = () => {
    if (video.duration > 6) video.currentTime = Math.min(2.5, video.duration * 0.15);
  };
  if (video.readyState >= 1) skipIntro();
  else video.addEventListener("loadedmetadata", skipIntro, { once: true });

  video.play().catch(() => {});
}

/* ----------------------------------------------------------------
   10. SELECTED WORK — editorial gallery built from `projects`
   Layout alternates every 3 items: media-left / media-right / full-bleed.
   ---------------------------------------------------------------- */
function renderWorkList() {
  const list = qs("#workList");
  if (!list) return;

  const layouts = ["a", "b", "c"];

  list.innerHTML = projects.map((p, i) => {
    const layout = layouts[i % layouts.length];
    return `
      <article class="work-item work-item--${layout}">
        <div class="work-item__media">
          <div class="work-item__placeholder"><span>ADD VIDEO — ${p.video}</span></div>
          <video class="work-item__video" data-lazy-video muted loop playsinline preload="none" poster="${p.poster}" aria-hidden="true">
            <source src="${p.video}" type="video/mp4">
          </video>
          <span class="work-item__num">/ ${p.id}</span>
        </div>
        <div class="work-item__text">
          <h3 class="work-item__title">${p.title}</h3>
          <div class="work-item__meta">
            <span>${p.category}</span>
            <span>${p.software}</span>
            <span>${p.year}</span>
          </div>
          <span class="work-item__line" aria-hidden="true"></span>
          <a class="work-item__link" href="${p.instagram}" target="_blank" rel="noopener noreferrer">
            <span>VIEW ON INSTAGRAM</span><span class="arrow">&nearr;</span>
          </a>
        </div>
      </article>`;
  }).join("");

  initLazyVideos(list);
}

/* ----------------------------------------------------------------
   11. REELS GALLERY — scattered 9:16 grid, same source data
   ---------------------------------------------------------------- */
function renderReelsGrid() {
  const grid = qs("#reelsGrid");
  if (!grid) return;

  const verticalProjects = projects.filter((p) => p.vertical !== false);

  grid.innerHTML = verticalProjects.map((p, i) => `
    <div class="reel-card">
      <span class="reel-card__num">/ ${String(i + 1).padStart(2, "0")}</span>
      <div class="reel-card__placeholder"><span>ADD REEL — ${p.video}</span></div>
      <video class="reel-card__video" data-lazy-video muted loop playsinline preload="none" poster="${p.poster}" aria-hidden="true">
        <source src="${p.video}" type="video/mp4">
      </video>
      <div class="reel-card__overlay">
        <p>${p.title}</p>
        <p>${p.category}</p>
      </div>
    </div>`).join("");

  initLazyVideos(grid);
}

/* ----------------------------------------------------------------
   12. TOOLS LIST — optional software, driven by the TOOLS array
   ---------------------------------------------------------------- */
function renderTools() {
  const list = qs("#toolsList");
  if (!list) return;
  list.innerHTML = TOOLS.map((t) => `<li>${t}</li>`).join("");
}

/* ----------------------------------------------------------------
   13. FEATURED PROJECT — play/pause + REC timecode readout
   ---------------------------------------------------------------- */
function initFeatured() {
  const video = qs("#featuredVideo");
  const btn = qs("#featuredPlay");
  const media = qs(".featured__media");
  if (!video || !btn || !media) return;

  markVideoReady(video);

  const rec = document.createElement("span");
  rec.className = "mono-label";
  rec.style.cssText = "position:absolute;top:16px;left:16px;z-index:2;color:#F4F4F2;display:none;align-items:center;gap:6px;";
  rec.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:#C1401F;display:inline-block;"></span><span id="featuredRecTime">REC 00:00</span>';
  media.appendChild(rec);
  const recTime = () => qs("#featuredRecTime", rec);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `REC ${m}:${sec}`;
  };

  btn.addEventListener("click", () => {
    if (video.paused) {
      video.play().catch(() => {});
      btn.classList.add("is-playing");
      rec.style.display = "flex";
    } else {
      video.pause();
      btn.classList.remove("is-playing");
    }
  });

  video.addEventListener("timeupdate", () => {
    if (recTime()) recTime().textContent = formatTime(video.currentTime);
  });
  video.addEventListener("ended", () => {
    btn.classList.remove("is-playing");
    rec.style.display = "none";
  });

  // Auto-play once it scrolls into view, pause once it scrolls out.
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (video.paused) {
          video.play().catch(() => {});
          btn.classList.add("is-playing");
          rec.style.display = "flex";
        }
      } else if (!video.paused) {
        video.pause();
        btn.classList.remove("is-playing");
      }
    });
  }, { threshold: 0.3 });
  io.observe(media);
}

/* ----------------------------------------------------------------
   14. PROCESS — steps fade in + connecting line fills on entry
   ---------------------------------------------------------------- */
function initProcess() {
  const section = qs("#process");
  const list = qs(".process__list");
  const steps = qsa(".process__step");
  if (!section || !steps.length) return;

  const stepIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        stepIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  steps.forEach((step) => stepIO.observe(step));

  const lineIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        list.classList.add("is-active");
        lineIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  lineIO.observe(section);
}

/* ----------------------------------------------------------------
   15. MAGNETIC BUTTONS — subtle pull toward the cursor
   ---------------------------------------------------------------- */
function initMagnetic() {
  if (isTouch || prefersReducedMotion) return;
  qsa("[data-magnetic]").forEach((el) => {
    const strength = 0.35;
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener("mouseleave", () => { el.style.transform = ""; });
  });
}

/* ----------------------------------------------------------------
   16. SUBTLE PARALLAX (GSAP + ScrollTrigger, optional enhancement)
   ---------------------------------------------------------------- */
function initParallax() {
  if (!hasGSAP || prefersReducedMotion) return;
  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  const heroVideo = qs("#heroVideo");
  if (heroVideo) {
    gsap.to(heroVideo, {
      scale: 1.32,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });
  }

  // Animates the --py custom property (consumed by the transform in
  // style.css) rather than `transform` itself, so the CSS :hover scale
  // on these same elements never gets clobbered by GSAP's inline style.
  gsap.utils.toArray(".pipeline__frame-media").forEach((el) => {
    gsap.fromTo(el, { "--py": "30px" }, {
      "--py": "-30px",
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }
    });
  });
}

/* ----------------------------------------------------------------
   17. INIT
   ---------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-loading");

  wireDynamicLinks();
  updateYearBadges();
  renderWorkList();
  renderReelsGrid();
  renderTools();
  initHeroVideo();
  initFeatured();
  initHeader();
  initMobileMenu();
  initRevealText();
  initProcess();
  initMagnetic();

  const lenis = initSmoothScroll();
  initParallax();

  initLoader().then(() => {
    if (hasGSAP) window.ScrollTrigger.refresh();
    if (lenis) lenis.resize();
  });
});
