/* =========================================================
   Muhammad Sibtain Javed — portfolio script
   Renders js/data.js and runs: menu, scroll spy, typewriter,
   counters, video filters, video modal, tabs, FAQ, form,
   back-to-top and scroll reveal. No libraries.
   ========================================================= */
(function () {
  "use strict";
  const S = window.SITE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const icon = (id, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js");

  /* ---------- Images ----------
   * Thumbnails live in assets/images/thumbs/<prefix>_<id>.jpg.
   * window.EMBEDDED_IMAGES (optional) maps those paths to data: URIs
   * for single-file previews. */
  const thumbPath = (prefix, id) => `assets/images/thumbs/${prefix}_${id}.jpg`;
  const src = (path) => (window.EMBEDDED_IMAGES && window.EMBEDDED_IMAGES[path]) || path;
  const thumbFor = (key) => { const [p, ...rest] = key.split("_"); return thumbPath(p, rest.join("_")); };

  /* ---------- Platform helpers ---------- */
  const P = {
    youtube:   { label: "YouTube",   icon: "play",     open: "Watch on YouTube",   url: (v) => `https://www.youtube.com/watch?v=${v.id}`, embed: (v) => `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`, thumb: (v) => thumbPath("yt", v.id), tall: false },
    short:     { label: "Short",     icon: "phone",    open: "Watch on YouTube",   url: (v) => `https://www.youtube.com/shorts/${v.id}`, embed: (v) => `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`, thumb: (v) => thumbPath("short", v.id), tall: true },
    tiktok:    { label: "TikTok",    icon: "tiktok",   open: "Watch on TikTok",    url: (v) => `https://www.tiktok.com/@sjrajpout14/video/${v.id}`, embed: (v) => `https://www.tiktok.com/player/v1/${v.id}?autoplay=1`, thumb: (v) => thumbPath("tiktok", v.id), tall: true },
    facebook:  { label: "Facebook",  icon: "facebook", open: "Watch on Facebook",  url: (v) => `https://www.facebook.com/reel/${v.id}/`, embed: (v) => `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(`https://www.facebook.com/reel/${v.id}/`)}&show_text=false&autoplay=true`, thumb: (v) => thumbPath("facebook", v.id), tall: true },
    instagram: { label: "Instagram", icon: "camera",   open: "Watch on Instagram", url: (v) => `https://www.instagram.com/reel/${v.id}/`, embed: (v) => `https://www.instagram.com/reel/${v.id}/embed`, thumb: (v) => thumbPath("instagram", v.id), tall: true },
  };
  const titleOf = (v) => v.title || `${P[v.platform].label} Reel`;
  const viewsOf = (v) => (v.views ? `${v.views} views` : v.date ? `Posted ${v.date}` : "");

  // Remote images and embeds are used only when the browser can load them.
  let remoteOK = false;

  /* ---------- Simple bindings ---------- */
  function bindBasics() {
    const p = S.person;
    const binds = { name: p.name, shortName: p.shortName, role: p.role };
    $$("[data-bind]").forEach((el) => { el.textContent = binds[el.dataset.bind] ?? ""; });
    $$("[data-link]").forEach((a) => { a.href = S.links[a.dataset.link]; });
    $$("[data-chip]").forEach((el) => { el.textContent = S.hero.chips[+el.dataset.chip] || ""; });
    $("#hero-lead").innerHTML = S.hero.lead; // trusted copy from data.js
    $("#topics-lead").textContent = S.topics.lead;
    $("#services-lead").textContent = S.services.lead;
    $("#videos-lead").textContent = `${S.videos.length} clips from YouTube, TikTok, Facebook and Instagram. View counts as of ${S.checkedOn}.`;
    $("#journey-lead").textContent = S.journey.lead;
    $("#themes-lead").textContent = S.themes.lead;
    $("#contact-lead").textContent = S.contact.lead;
    $("#footer-about").textContent = S.footer.about;
    $("#year").textContent = new Date().getFullYear();
    $("#stats-note").textContent = `Public counts as of ${S.checkedOn}.`;
    $("#mail-btn").href = `mailto:${p.email}?subject=${encodeURIComponent("Salam Sibtain")}`;

    const socials = [
      ["youtube", "play", "YouTube channel"], ["tiktok", "tiktok", "TikTok profile"], ["facebook", "facebook", "Facebook page"],
      ["instagram", "camera", "Instagram profile"], ["whatsapp", "whatsapp", "WhatsApp channel"],
    ];
    $$("[data-socials]").forEach((ul) => {
      ul.innerHTML = socials.map(([k, ic, label]) => `<li><a class="social" href="${S.links[k]}" target="_blank" rel="noopener" aria-label="${label}">${icon(ic)}</a></li>`).join("");
    });

    $("#stats").innerHTML = S.stats.map((s) => `
      <div class="stat"><dt class="stat__label">${esc(s.label)}</dt>
      <dd class="stat__value"><span data-count="${s.value}" data-dec="${s.decimals || 0}" data-suffix="${esc(s.suffix || "")}">${fmt(s.value, s.decimals || 0)}${esc(s.suffix || "")}</span></dd></div>`).join("");

    $("#topics-list").innerHTML = S.topics.items.map((t) => `<li class="core-skill"><span class="core-skill__icon">${icon(t.icon)}</span><span>${esc(t.name)}</span></li>`).join("");
    $("#services-list").innerHTML = S.services.items.map((s) => `
      <article class="card service reveal"><span class="service__icon">${icon(s.icon)}</span>
      <h3 class="service__title">${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`).join("");

    $("#contact-list").innerHTML = [
      ["pin", "Location", esc(p.location)],
      ["mail", "Email", `<a href="mailto:${esc(p.email)}">${esc(p.email)}</a>`],
      ["play", "YouTube", `<a href="${S.links.youtube}" target="_blank" rel="noopener">${esc(p.handle)}</a>`],
      ["tiktok", "TikTok", `<a href="${S.links.tiktok}" target="_blank" rel="noopener">${esc(p.handle)}</a>`],
      ["whatsapp", "WhatsApp Channel", `<a href="${S.links.whatsapp}" target="_blank" rel="noopener">${esc(p.name)}</a>`],
    ].map(([ic, k, v]) => `<li>${icon(ic)}<span><small>${k}</small>${v}</span></li>`).join("");

    $("#footer-content").innerHTML = S.footer.content.map((c) => `<li>${esc(c)}</li>`).join("");
    $("#footer-follow").innerHTML = [["YouTube", "youtube"], ["TikTok", "tiktok"], ["Facebook", "facebook"], ["Instagram", "instagram"], ["WhatsApp Channel", "whatsapp"]]
      .map(([l, k]) => `<li><a href="${S.links[k]}" target="_blank" rel="noopener">${l}</a></li>`).join("");
  }
  function fmt(n, d) { return Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }); }

  /* ---------- Profile photo (falls back to the SJ monogram) ---------- */
  function loadPhoto() {
    $$("[data-photo]").forEach((el) => {
      const img = document.createElement("img");
      img.alt = ""; img.decoding = "async";
      img.onerror = () => img.remove(); // monogram stays underneath
      img.src = src(S.person.photo);
      el.appendChild(img);
    });
    // In-page players need the platforms reachable; test once with a tiny remote image.
    const probe = new Image();
    probe.referrerPolicy = "no-referrer";
    probe.onload = () => { remoteOK = true; };
    probe.src = S.person.photoRemote || "https://i.ytimg.com/vi/-5BuAJwTFSI/default.jpg";
  }
  // thumbnails: reveal on load, drop on error (fallback card stays)
  document.addEventListener("error", (e) => { if (e.target.matches?.(".project__media img")) e.target.remove(); }, true);

  /* ---------- Videos ---------- */
  const FILTERS = [["all", "All"], ["youtube", "YouTube"], ["short", "Shorts"], ["tiktok", "TikTok"], ["facebook", "Facebook"], ["instagram", "Instagram"]];
  let current = "all";
  let showAll = false;

  // Designed stand-in shown under thumbnails (and when a platform can't be loaded)
  function mediaFallback(v, full) {
    const pl = P[v.platform];
    const main = full ? `<b>${esc(titleOf(v))}</b><small>Playback isn't available here. Use the button below to watch on ${pl.label === "Short" ? "YouTube" : pl.label}.</small>`
                      : `<span class="pf">${esc(pl.label)}</span><small>${esc(v.speaker || viewsOf(v))}</small>`;
    return `<div class="media-fallback" data-p="${v.platform}">${icon(pl.icon)}${main}</div>`;
  }

  function videoCard(v, i) {
    const pl = P[v.platform];
    const t = pl.thumb ? src(pl.thumb(v)) : "";
    const alt = esc(`${pl.label} thumbnail: ${titleOf(v)}`);
    const thumb = !t ? "" : pl.tall
      ? `<img class="media-bg" src="${t}" alt="" aria-hidden="true" loading="lazy" decoding="async"><img class="media-poster" src="${t}" alt="${alt}" loading="lazy" decoding="async">`
      : `<img src="${t}" alt="${alt}" loading="lazy" decoding="async">`;
    const cat = v.topic ? `${pl.label} · ${v.topic}` : `${pl.label} · Reel`;
    const desc = v.speaker ? v.speaker : v.platform === "facebook" ? "A Reel from the Facebook page. Facebook doesn't show captions publicly, so open it to see the clip." : "A Reel from Instagram. Open it to watch with its caption.";
    const stats = [v.views ? `<strong>Views:</strong> ${esc(v.views)}` : "", v.when ? `<strong>Posted:</strong> ${esc(v.when)}` : v.date ? `<strong>Posted:</strong> ${esc(v.date)}` : "", v.duration ? `<strong>Length:</strong> ${esc(v.duration)}` : ""].filter(Boolean).join(" · ");
    const tags = [pl.label, v.topic, v.speaker && !/status|footage|nohay|qasida/i.test(v.speaker) ? v.speaker.replace(/^(Allama|Maulana|Ayatollah) (Syed )?/, "") : ""].filter(Boolean);
    return `
      <article class="card project" data-p="${v.platform}" data-index="${i}">
        <div class="project__media${pl.tall ? " project__media--tall" : ""}">
          ${thumb || mediaFallback(v)}
          <span class="status" data-p="${v.platform}">${pl.label}</span>
          ${v.duration ? `<span class="duration">${esc(v.duration)}</span>` : ""}
          <span class="play-hint">${icon("play-solid")}</span>
        </div>
        <div class="project__body">
          <p class="project__cat">${esc(cat)}</p>
          <h3 class="project__title">${esc(titleOf(v))}</h3>
          <p class="project__desc">${esc(desc)}</p>
          ${stats ? `<p class="project__contrib">${stats}</p>` : ""}
          <ul class="tags">${tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
          <div class="project__actions">
            <a class="btn btn--primary btn--sm" href="${pl.url(v)}" target="_blank" rel="noopener">Watch ${icon("external")}<span class="sr-only"> on ${pl.label} (opens in new tab)</span></a>
            <button class="btn btn--outline btn--sm" type="button" data-video="${i}">View Details</button>
          </div>
        </div>
      </article>`;
  }

  function renderFilters() {
    const count = (k) => (k === "all" ? S.videos.length : S.videos.filter((v) => v.platform === k).length);
    $("#filters").innerHTML = FILTERS.filter(([k]) => count(k) > 0).map(([k, l]) =>
      `<button class="filter${k === current ? " is-active" : ""}" type="button" data-filter="${k}" aria-pressed="${k === current}">${l}<span class="filter__count">${count(k)}</span></button>`).join("");
  }

  function renderVideos() {
    const list = S.videos.map((v, i) => [v, i]).filter(([v]) => current === "all" || v.platform === current);
    const limited = current === "all" && !showAll ? list.slice(0, S.videosInitial || 9) : list;
    $("#projects").innerHTML = limited.map(([v, i]) => videoCard(v, i)).join("");
    const more = $("#show-all");
    more.hidden = !(current === "all" && !showAll && list.length > limited.length);
    more.textContent = `Show all ${list.length} videos`;
    $("#filter-status").textContent = `Showing ${limited.length} of ${list.length} videos`;
  }

  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest(".filter"); if (!b) return;
    current = b.dataset.filter; showAll = false;
    renderFilters(); renderVideos();
  });
  $("#show-all").addEventListener("click", () => { showAll = true; renderVideos(); });

  /* ---------- Video modal ---------- */
  const modal = $("#video-modal");
  function openVideo(i) {
    const v = S.videos[i]; const pl = P[v.platform];
    const t = pl.thumb ? src(pl.thumb(v)) : "";
    const poster = `<a class="modal__poster${pl.tall ? " is-tall" : ""}" href="${pl.url(v)}" target="_blank" rel="noopener" aria-label="${esc(pl.open)}">
        ${pl.tall ? `<img class="media-bg" src="${t}" alt="" aria-hidden="true">` : ""}<img class="modal__poster-img" src="${t}" alt="">
        <span class="play-hint is-on">${icon("play-solid")}</span></a>`;
    const player = remoteOK
      ? `<iframe src="${pl.embed(v)}" title="${esc(titleOf(v))}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`
      : t ? poster : mediaFallback(v, true);
    $("#modal-content").innerHTML = `
      <div class="modal__player${pl.tall && remoteOK ? " modal__player--tall" : ""}">${player}</div>
      <div class="modal__body">
        <div class="modal__top">
          <p class="project__cat">${esc(v.topic ? `${pl.label} · ${v.topic}` : `${pl.label} · Reel`)}</p>
          <h2 class="modal__title" id="modal-title">${esc(titleOf(v))}</h2>
          <div class="modal__meta"><span class="status" data-p="${v.platform}">${pl.label}</span>${v.views ? `<span class="pill">${esc(v.views)} views</span>` : ""}${v.duration ? `<span class="pill">${esc(v.duration)}</span>` : ""}${v.when || v.date ? `<span class="pill">${esc(v.when || v.date)}</span>` : ""}</div>
        </div>
        <div class="modal__grid">
          <div class="modal__block"><h3>Speaker</h3><p>${esc(v.speaker || "Not shown in the public caption")}</p></div>
          <div class="modal__block"><h3>Topic</h3><p>${esc(v.topic || "Reel")}</p></div>
        </div>
        <div class="modal__actions">
          <a class="btn btn--primary" href="${pl.url(v)}" target="_blank" rel="noopener">${esc(pl.open)} ${icon("external")}</a>
          <a class="btn btn--ghost" href="${S.links[v.platform === "short" ? "youtube" : v.platform]}" target="_blank" rel="noopener">More on ${pl.label === "Short" ? "YouTube" : pl.label}</a>
        </div>
        <p class="modal__note">View counts as of ${esc(S.checkedOn)}.</p>
      </div>`;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
    document.body.classList.add("no-scroll");
  }
  function closeVideo() {
    if (modal.open) modal.close();
    $("#modal-content").innerHTML = "";
    document.body.classList.remove("no-scroll");
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-video]");
    if (b) openVideo(+b.dataset.video);
    if (e.target.closest("[data-close]")) closeVideo();
  });
  modal.addEventListener("click", (e) => { if (e.target === modal) closeVideo(); });
  modal.addEventListener("close", () => { $("#modal-content").innerHTML = ""; document.body.classList.remove("no-scroll"); });

  /* ---------- Hero strip: latest vertical clips ---------- */
  function renderStrip() {
    const el = $("#strip"); if (!el) return;
    const tall = S.videos.map((v, i) => [v, i]).filter(([v]) => P[v.platform].tall).slice(0, S.stripCount || 12);
    if (!tall.length) { el.closest(".strip").hidden = true; return; }
    const cards = tall.map(([v, i]) => `
      <button class="strip__item" type="button" data-video="${i}" aria-label="Play: ${esc(titleOf(v))}">
        <img src="${src(P[v.platform].thumb(v))}" alt="" loading="lazy" decoding="async">
        <span class="status" data-p="${v.platform}">${P[v.platform].label}</span>
        ${v.views ? `<span class="strip__views">${esc(v.views)} views</span>` : ""}
      </button>`).join("");
    el.innerHTML = cards + cards.replace(/data-video=/g, 'tabindex="-1" aria-hidden="true" data-video='); // doubled for a seamless loop
  }

  /* ---------- Journey tabs ---------- */
  function renderJourney() {
    const J = S.journey;
    $("#channels").innerHTML = J.channels.map((c) => `
      <article class="card timeline-item">
        <div class="timeline-item__head">
          <div><h3 class="timeline-item__role">${esc(c.title)}${c.current ? ' <span class="pill">Active</span>' : ""}</h3>
          <p class="timeline-item__org">${esc(c.org)}</p></div>
          <p class="timeline-item__date">${esc(c.date)}</p>
        </div>
        <ul class="checklist">${c.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
        <ul class="tags">${c.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
      </article>`).join("");
    $("#platforms").innerHTML = J.platforms.map((g) => `
      <div class="card skill-group"><h3 class="skill-group__title">${icon(g.icon)} ${esc(g.title)}</h3>
      <ul class="tags tags--lg">${g.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>`).join("");
    $("#voices").innerHTML = J.voices.map((n) => `<li>${esc(n)}</li>`).join("");
    $("#voices-count").textContent = `${J.voices.length} scholars`;
  }
  function initTabs() {
    const tabs = $$('[role="tab"]');
    const select = (t, focus) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.classList.toggle("is-active", on);
        x.setAttribute("aria-selected", on);
        x.tabIndex = on ? 0 : -1;
        $("#" + x.getAttribute("aria-controls")).hidden = !on;
      });
      if (focus) t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (k) { e.preventDefault(); select(tabs[(i + k + tabs.length) % tabs.length], true); }
        if (e.key === "Home") { e.preventDefault(); select(tabs[0], true); }
        if (e.key === "End") { e.preventDefault(); select(tabs[tabs.length - 1], true); }
      });
    });
  }

  /* ---------- Themes & FAQ ---------- */
  function renderThemes() {
    $("#themes-list").innerHTML = S.themes.items.map((t) => `
      <article class="card post reveal">${t.thumb ? `<div class="post__media"><img src="${src(thumbFor(t.thumb))}" alt="" loading="lazy" decoding="async"></div>` : ""}<p class="post__meta"><span class="pill">${esc(t.pill)}</span><span class="post__count">${esc(t.count)}</span></p>
      <h3 class="post__title">${esc(t.title)}</h3><p>${esc(t.text)}</p></article>`).join("");
  }
  function renderFaq() {
    $("#faq-list").innerHTML = S.faq.map((f, i) => `
      <div class="accordion__item">
        <h3 class="accordion__heading"><button class="accordion__btn" type="button" id="faq-${i}-btn" aria-expanded="false" aria-controls="faq-${i}">${esc(f.q)}${icon("plus")}</button></h3>
        <div class="accordion__panel" id="faq-${i}" role="region" aria-labelledby="faq-${i}-btn" hidden><p>${f.a}</p></div>
      </div>`).join("");
    $("#faq-list").addEventListener("click", (e) => {
      const b = e.target.closest(".accordion__btn"); if (!b) return;
      const open = b.getAttribute("aria-expanded") !== "true";
      $$(".accordion__btn", $("#faq-list")).forEach((x) => {
        const on = x === b && open;
        x.setAttribute("aria-expanded", on);
        $("#" + x.getAttribute("aria-controls")).hidden = !on;
        x.closest(".accordion__item").classList.toggle("is-open", on);
      });
    });
  }

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  function initForm() {
    const form = $("#contact-form");
    const rules = {
      name: (v) => (v.trim().length >= 2 ? "" : "Enter your name (at least 2 characters)."),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address, like name@example.com."),
      phone: (v) => (!v.trim() || /^[+\d\s()-]{7,20}$/.test(v.trim()) ? "" : "Use digits, spaces and + only, or leave it empty."),
      subject: (v) => (v.trim().length >= 3 ? "" : "Add a short subject (at least 3 characters)."),
      message: (v) => (v.trim().length >= 20 ? "" : "Write a little more (at least 20 characters)."),
    };
    const check = (input) => {
      const msg = rules[input.name]?.(input.value) || "";
      input.closest(".field").classList.toggle("has-error", !!msg);
      input.setAttribute("aria-invalid", !!msg);
      const err = $(`#f-${input.name}-err`); if (err) err.textContent = msg;
      return !msg;
    };
    // Errors appear on Send (so the button never moves under the pointer), then update live as the visitor fixes them.
    let attempted = false;
    $$("input, textarea", form).forEach((el) => el.addEventListener("input", () => { if (attempted || el.getAttribute("aria-invalid") === "true") check(el); }));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fields = $$("input, textarea", form);
      attempted = true;
      const ok = fields.map(check).every(Boolean);
      const status = $("#form-status");
      status.className = "form__status";
      if (!ok) { status.classList.add("is-error"); status.textContent = "Please fix the highlighted fields."; fields.find((f) => f.getAttribute("aria-invalid") === "true")?.focus(); return; }
      const d = Object.fromEntries(new FormData(form));
      const body = `${d.message}\n\n— ${d.name}\n${d.email}${d.phone ? `\n${d.phone}` : ""}`;
      const href = `mailto:${S.person.email}?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`;
      status.classList.add("is-success");
      status.innerHTML = `Your email app should open with this message ready to send. If it doesn't, email <a href="${href}">${esc(S.person.email)}</a> directly.`;
      window.location.href = href;
    });
  }

  /* ---------- Header, menu, scroll spy, back to top ---------- */
  function initChrome() {
    const header = $("#header"), nav = $("#primary-nav"), toggle = $("#nav-toggle"), toTop = $("#to-top");
    const setMenu = (open) => {
      nav.classList.toggle("is-open", open);
      header.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("no-scroll", open);
    };
    toggle.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); } });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });

    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 10);
      toTop.classList.toggle("is-visible", y > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

    const links = $$(".nav__link");
    const sections = links.map((l) => $(l.getAttribute("href"))).filter(Boolean);
    if ("IntersectionObserver" in window) {
      const spy = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + en.target.id));
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      sections.forEach((s) => spy.observe(s));
    }
  }

  /* ---------- Typewriter ---------- */
  function initTyped() {
    const el = $("#typed"); const roles = S.hero.roles;
    if (reduceMotion || roles.length < 2) { el.textContent = roles[0]; return; }
    let r = 0, c = 0, del = false;
    (function tick() {
      const word = roles[r];
      c += del ? -1 : 1;
      el.textContent = word.slice(0, c);
      let wait = del ? 40 : 75;
      if (!del && c === word.length) { del = true; wait = 1800; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
      setTimeout(tick, wait);
    })();
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    const els = $$("[data-count]");
    const run = (el) => {
      const to = +el.dataset.count, d = +el.dataset.dec, suf = el.dataset.suffix, t0 = performance.now(), dur = 1400;
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = fmt(to * e, d) + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }), { threshold: 0.5 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Scroll reveal (with a safety net so nothing stays hidden) ---------- */
  function initReveal() {
    const els = $$(".reveal");
    const showAllNow = () => els.forEach((el) => el.classList.add("is-visible"));
    if (reduceMotion || !("IntersectionObserver" in window)) return showAllNow();
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { x.target.classList.add("is-visible"); io.unobserve(x.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
    setTimeout(showAllNow, 2500);
  }

  /* ---------- Structured data for search engines ---------- */
  function addJsonLd() {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Person",
      name: S.person.name, alternateName: S.person.handle, jobTitle: S.person.role,
      image: S.person.photo, email: `mailto:${S.person.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Lahore", addressRegion: "Punjab", addressCountry: "PK" },
      sameAs: Object.values(S.links),
    });
    document.head.appendChild(s);
  }

  /* ---------- Boot ---------- */
  bindBasics();
  renderFilters();
  renderVideos();
  renderStrip();
  renderJourney();
  renderThemes();
  renderFaq();
  initTabs();
  initForm();
  initChrome();
  initTyped();
  initCounters();
  initReveal();
  loadPhoto();
  addJsonLd();
})();
