/* ==========================================================================
   FAI FOLAU — Interactions
   Principe : le site est complet sans ce fichier. Ce script n'ajoute que
   le mouvement — lent, rare, toujours au service du voyage.
   ========================================================================== */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = root.classList.contains('reduced-motion');
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const pad = (n) => String(n).padStart(2, '0');
  const SVG = 'http://www.w3.org/2000/svg';

  /* ------------------------------------------------------------------------
     1. Entrée — le hero se révèle quand les polices sont prêtes
     ------------------------------------------------------------------------ */
  const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('is-ready')));
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 1400))]).then(ready);

  /* ------------------------------------------------------------------------
     2. Houle — lignes de mer en perspective, qui dérivent très lentement.
     Proches de l'horizon : serrées, calmes. Proches de nous : amples.
     ------------------------------------------------------------------------ */
  const PERIODS = [150, 200, 240, 300, 400, 600]; // diviseurs de 1200 → boucle sans couture

  function buildSwell(el) {
    const deep = el.dataset.swell === 'deep';
    const lines = deep ? 6 : 8;
    const H = 200;
    const svg = document.createElementNS(SVG, 'svg');
    svg.setAttribute('class', 'swell');
    svg.setAttribute('viewBox', `0 0 1200 ${H}`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < lines; i++) {
      const t = (i + 1) / lines;                     // 0 → horizon, 1 → premier plan
      const y0 = 4 + (H - 12) * Math.pow(t, 1.7);
      const amp = 0.6 + 6 * t;
      const P = PERIODS[Math.min(PERIODS.length - 1, Math.floor(t * PERIODS.length))];
      const phase = i * 1.7;
      let d = '';
      for (let x = 0; x <= 2400; x += 8) {
        const y = y0
          + amp * Math.sin((2 * Math.PI * x) / P + phase)
          + amp * 0.35 * Math.sin((4 * Math.PI * x) / P + phase * 2.3);
        d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(2);
      }
      const g = document.createElementNS(SVG, 'g');
      g.style.setProperty('--d', `${Math.round(150 - 90 * t)}s`);
      const path = document.createElementNS(SVG, 'path');
      path.setAttribute('d', d);
      path.setAttribute('stroke-opacity', (0.18 + 0.62 * t).toFixed(2));
      g.appendChild(path);
      svg.appendChild(g);
    }
    el.appendChild(svg);
  }
  $$('[data-swell]').forEach(buildSwell);

  /* ------------------------------------------------------------------------
     3. En-tête — prend la couleur de la section qu'il survole
     ------------------------------------------------------------------------ */
  const header = $('[data-header]');
  const themed = $$('main > section[data-theme], footer[data-theme]');
  let lastY = window.scrollY;

  function updateHeader(y) {
    if (!header) return;
    const probe = header.offsetHeight / 2;
    for (const s of themed) {
      const r = s.getBoundingClientRect();
      if (r.top <= probe && r.bottom > probe) {
        if (header.dataset.on !== s.dataset.theme) header.dataset.on = s.dataset.theme;
        break;
      }
    }
    header.classList.toggle('is-scrolled', y > 40);
    const menuOpen = root.classList.contains('menu-open');
    if (!menuOpen && Math.abs(y - lastY) > 6) {
      header.classList.toggle('is-hidden', y > lastY && y > window.innerHeight * 0.9);
    }
    lastY = y;
  }

  /* ------------------------------------------------------------------------
     4. Le voyage — la traversée Wallis → Futuna au fil du scroll
     ------------------------------------------------------------------------ */
  const voyage = $('[data-voyage]');
  const V = voyage && !reduced ? (() => {
    const steps = $$('.voyage__step', voyage);
    const route = $('[data-route]', voyage);
    const traveller = $('[data-traveller]', voyage);
    const measure = document.createElementNS(SVG, 'path');
    measure.setAttribute('d', route.getAttribute('d'));
    measure.setAttribute('fill', 'none');
    measure.setAttribute('stroke', 'none');
    route.parentNode.appendChild(measure);
    const length = measure.getTotalLength();
    $('[data-voyage-total]', voyage).textContent = pad(steps.length);
    return {
      steps,
      route,
      traveller,
      measure,
      length,
      bar: $('[data-voyage-bar]', voyage),
      count: $('[data-voyage-step]', voyage),
      km: $('[data-voyage-km]', voyage),
      coords: $('[data-voyage-coords]', voyage),
      ring: $('.route__ring--end', voyage),
      current: -1,
    };
  })() : null;

  // Coordonnées réelles : Wallis 13°17′S 176°10′O → Futuna 14°17′S 178°09′O
  const FROM = { lat: 13 + 17 / 60, lon: 176 + 10 / 60 };
  const TO = { lat: 14 + 17 / 60, lon: 178 + 9 / 60 };
  const dms = (v) => {
    let d = Math.floor(v);
    let m = Math.round((v - d) * 60);
    if (m === 60) { d += 1; m = 0; }
    return `${d}°${pad(m)}′`;
  };

  function updateVoyage() {
    if (!V) return;
    const r = voyage.getBoundingClientRect();
    const total = voyage.offsetHeight - window.innerHeight;
    const p = clamp(-r.top / total);
    const n = V.steps.length;
    const idx = Math.min(n - 1, Math.floor(p * n));

    // Le tracé naît à la 2e étape et touche Futuna avant la dernière
    const rp = clamp((p - 1 / n) / ((n - 2) / n));
    V.route.style.setProperty('--p', rp.toFixed(4));
    const pt = V.measure.getPointAtLength(rp * V.length);
    V.traveller.setAttribute('cx', pt.x.toFixed(1));
    V.traveller.setAttribute('cy', pt.y.toFixed(1));
    V.ring.style.setProperty('--arrive', rp > 0.995 ? 1 : 0.3);
    V.km.textContent = Math.round(rp * 230);
    V.coords.textContent = `${dms(FROM.lat + (TO.lat - FROM.lat) * rp)}S · ${dms(FROM.lon + (TO.lon - FROM.lon) * rp)}O`;
    V.bar.style.setProperty('--p', p.toFixed(4));

    if (idx !== V.current) {
      V.steps.forEach((s, i) => {
        s.classList.toggle('is-active', i === idx);
        s.classList.toggle('is-past', i < idx);
        s.setAttribute('aria-hidden', i === idx ? 'false' : 'true');
      });
      V.count.textContent = pad(idx + 1);
      voyage.classList.toggle('is-final', idx === n - 1);
      V.current = idx;
    }
  }

  /* ------------------------------------------------------------------------
     5. Parallaxe — à peine perceptible
     ------------------------------------------------------------------------ */
  const parallax = reduced ? [] : $$('[data-parallax]').map((el) => ({ el, f: parseFloat(el.dataset.parallax) || 0.06 }));

  function updateParallax() {
    const vh = window.innerHeight;
    for (const item of parallax) {
      const box = (item.el.closest('.media') || item.el).getBoundingClientRect();
      if (box.bottom < -vh * 0.2 || box.top > vh * 1.2) continue;
      const max = box.height * 0.06;
      const offset = clamp((vh / 2 - (box.top + box.height / 2)) * item.f * -1, -max, max);
      item.el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    }
  }

  /* ------------------------------------------------------------------------
     Boucle de scroll unique
     ------------------------------------------------------------------------ */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      updateHeader(y);
      updateVoyage();
      updateParallax();
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ------------------------------------------------------------------------
     6. Apparitions progressives
     ------------------------------------------------------------------------ */
  const reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ------------------------------------------------------------------------
     7. Menu plein écran
     ------------------------------------------------------------------------ */
  const menu = $('[data-menu]');
  const openBtn = $('[data-menu-open]');
  const closeBtn = $('[data-menu-close]');

  function openMenu() {
    menu.hidden = false;
    root.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    openBtn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => {
      menu.classList.add('is-open');
      closeBtn.focus();
    });
  }
  function closeMenu(focusBack = true) {
    menu.classList.remove('is-open');
    root.classList.remove('menu-open');
    document.body.style.overflow = '';
    openBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => { menu.hidden = true; }, reduced ? 0 : 700);
    if (focusBack) openBtn.focus();
  }
  if (menu && openBtn) {
    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', () => closeMenu());
    $$('a', menu).forEach((a) => a.addEventListener('click', () => closeMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (menu.hidden) return;
      if (e.key === 'Escape') closeMenu();
      if (e.key === 'Tab') {
        const f = $$('a, button', menu);
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ------------------------------------------------------------------------
     8. Programme — onglets par jour (clavier : ← → Début Fin)
     ------------------------------------------------------------------------ */
  $$('[data-tabs]').forEach((list) => {
    const tabs = $$('[role="tab"]', list);
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const select = (i, focus) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', on);
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const k = e.key;
        let n = null;
        if (k === 'ArrowRight') n = (i + 1) % tabs.length;
        if (k === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
        if (k === 'Home') n = 0;
        if (k === 'End') n = tabs.length - 1;
        if (n !== null) { e.preventDefault(); select(n, true); }
      });
    });
    select(Math.max(0, tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true')));
  });

  /* ------------------------------------------------------------------------
     9. Index des participants — aperçu flottant (souris uniquement)
     ------------------------------------------------------------------------ */
  const box = $('[data-preview-box]');
  const index = $('[data-index]');
  if (box && index && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const img = $('img', box);
    const text = $('[data-preview-text]', box);
    let tx = 0, ty = 0, x = 0, y = 0, raf = null;
    const follow = () => {
      const k = reduced ? 1 : 0.12;
      x += (tx - x) * k;
      y += (ty - y) * k;
      box.style.setProperty('--x', `${x.toFixed(1)}px`);
      box.style.setProperty('--y', `${y.toFixed(1)}px`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(follow) : null;
    };
    index.addEventListener('pointermove', (e) => {
      tx = e.clientX + 32;
      ty = e.clientY;
      if (!box.classList.contains('is-on')) { x = tx; y = ty; }
      if (!raf) raf = requestAnimationFrame(follow);
    });
    $$('.index__row', index).forEach((row) => {
      row.addEventListener('pointerenter', () => {
        text.textContent = row.dataset.previewLabel || '';
        img.hidden = true;
        img.onload = () => { img.hidden = false; };
        img.onerror = () => { img.hidden = true; };
        img.src = row.dataset.preview;
        box.classList.add('is-on');
      });
    });
    index.addEventListener('pointerleave', () => box.classList.remove('is-on'));
  }
})();
