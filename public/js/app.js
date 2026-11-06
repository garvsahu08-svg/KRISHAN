/* KRISHAN WEBDESIGNERC – site behaviour (no dependencies) */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp (existing number + messages preserved) ---------- */
  const WA_NUMBER = '918815639703';
  const WA_MESSAGES = {
    general: 'Hello KRISHAN WEBDESIGNERC, I want to create a professional website. Please share your pricing and details.',
    price: 'Hello KRISHAN WEBDESIGNERC, I’m interested in a website starting from ₹6,949. Please share the details and a quotation for my requirements.',
  };
  const waUrl = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  $$('[data-wa]').forEach((a) => { a.href = waUrl(WA_MESSAGES[a.dataset.wa] || a.dataset.wa); });

  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- mobile menu ---------- */
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    nav.classList.toggle('menu-open', open);
    document.body.classList.toggle('lock', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (innerWidth >= 1000) setMenu(false); });

  /* ---------- nav state + active link ---------- */
  const spyLinks = $$('[data-spy]');
  const spySections = spyLinks.map((l) => $('#' + l.dataset.spy)).filter(Boolean);
  let ticking = false;
  function onScroll() {
    ticking = false;
    nav.classList.toggle('scrolled', scrollY > 16);
    let current = spySections[0];
    for (const s of spySections) if (s.getBoundingClientRect().top <= innerHeight * 0.35) current = s;
    spyLinks.forEach((l) => l.classList.toggle('active', Boolean(current) && l.dataset.spy === current.id));
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else revealEls.forEach((el) => el.classList.add('in'));

  /* ---------- pick a project type from a CTA ---------- */
  document.addEventListener('click', (e) => {
    const pick = e.target.closest('[data-pick]');
    if (!pick) return;
    const sel = $('#f-type');
    if (sel) { sel.value = pick.dataset.pick; sel.dispatchEvent(new Event('change')); }
    if (!modal.hidden) closeModal();
  });

  /* ---------- demo project preview modal ---------- */
  const PROJECTS = [
    { title: 'Corporate website', blurb: 'A clean company website that builds trust with services, team and a clear enquiry path.', pages: ['Home', 'About', 'Services', 'Team', 'Contact'], features: ['Responsive layout', 'Contact form', 'WhatsApp button', 'Basic SEO setup'], type: 'Business Website' },
    { title: 'Online store', blurb: 'A store layout with product grid, cart-ready design and easy ordering.', pages: ['Home', 'Shop', 'Product details', 'Cart', 'Contact'], features: ['Product catalogue', 'Cart-ready layout', 'Order enquiries via WhatsApp', 'Admin panel (where applicable)'], type: 'E-commerce Website' },
    { title: 'Creative portfolio', blurb: 'A bold, elegant showcase for creatives and professionals to present their best work.', pages: ['Home', 'Work', 'About', 'Contact'], features: ['Project gallery', 'Smooth animations', 'Social media links', 'Fast loading'], type: 'Portfolio Website' },
    { title: 'Lead-generation page', blurb: 'A focused single page with a strong headline, clear call-to-action and enquiry form.', pages: ['Single page'], features: ['Hero with call-to-action', 'Lead enquiry form', 'Benefits area', 'Speed optimisation'], type: 'Landing Page' },
    { title: 'Restaurant website', blurb: 'Digital menu, gallery and reservation enquiries in one mobile-friendly site.', pages: ['Home', 'Menu', 'Gallery', 'Reservations', 'Contact'], features: ['Digital menu', 'Reservation enquiry', 'Location map', 'WhatsApp ordering enquiries'], type: 'Restaurant Website' },
  ];
  const modal = $('#modal'), modalBody = $('#modalBody');
  let lastFocus = null;
  const tick = '<svg class="ic"><use href="#i-check"/></svg>';

  function openModal(i) {
    const p = PROJECTS[i]; if (!p) return;
    const win = $(`.project[data-i="${i}"] .win`).cloneNode(true);
    win.style.cssText = 'height:auto;border:1px solid var(--line);border-radius:12px';
    const wa = waUrl(`Hello KRISHAN WEBDESIGNERC, I liked the demo ${p.title.toLowerCase()} on your website. I want something similar. Please share details and pricing.`);
    modalBody.innerHTML = `<span class="chip demo">Demo project</span><h3 id="modalTitle">${p.title}</h3><p>${p.blurb}</p>`;
    const wrap = document.createElement('div'); wrap.className = 'stage-s'; wrap.appendChild(win); modalBody.appendChild(wrap);
    modalBody.insertAdjacentHTML('beforeend',
      `<div class="md-cols"><div><h4>Typical pages</h4><ul>${p.pages.map((x) => `<li>${tick}${x}</li>`).join('')}</ul></div><div><h4>Features</h4><ul>${p.features.map((x) => `<li>${tick}${x}</li>`).join('')}</ul></div></div>` +
      `<p class="md-note">This is a demo concept created to show my design style – not a live client website.</p>` +
      `<div class="s-btns"><a class="btn btn-primary btn-sm" href="${wa}" target="_blank" rel="noopener"><svg class="ic"><use href="#i-wa"/></svg>I want something like this</a><a class="btn btn-ghost btn-sm" href="#contact" data-pick="${p.type}">Send an enquiry</a></div>`);
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('lock');
    $('.modal-x', modal).focus();
  }
  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('lock');
    modalBody.innerHTML = '';
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) { openModal(Number(opener.dataset.i)); return; }
    if (e.target.closest('[data-close]')) closeModal();
  });
  addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      const f = $$('button,a[href]', modal).filter((x) => !x.disabled);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- FAQ accordion ---------- */
  $$('.faq').forEach((item) => {
    const btn = $('.faq-q', item);
    btn.addEventListener('click', () => {
      const open = !item.classList.contains('open');
      $$('.faq.open').forEach((o) => { if (o !== item) { o.classList.remove('open'); $('.faq-q', o).setAttribute('aria-expanded', 'false'); } });
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- contact form (same /api/contact contract as before) ---------- */
  const form = $('#contactForm'), statusBox = $('#formStatus');
  const FIELDS = ['name', 'phone', 'email', 'websiteType', 'budget', 'message'];
  const showStatus = (kind, html) => { statusBox.className = `form-status show ${kind}`; statusBox.innerHTML = html; };
  const setErr = (name, msg) => {
    const f = form.elements[name] && form.elements[name].closest('.field'); if (!f) return;
    f.classList.toggle('invalid', Boolean(msg));
    form.elements[name].setAttribute('aria-invalid', String(Boolean(msg)));
    $('.err', f).textContent = msg || '';
  };
  function clientValidate(d) {
    const e = {};
    if (d.name.trim().length < 2) e.name = 'Please enter your name.';
    if (!/^\+?[\d\s\-()]{7,18}$/.test(d.phone.trim()) || d.phone.replace(/\D/g, '').length < 7) e.phone = 'Please enter a valid phone number.';
    if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim())) e.email = 'Please enter a valid email address.';
    if (!d.websiteType) e.websiteType = 'Please choose a project type.';
    if (d.message.trim().length < 5) e.message = 'Please tell me a little about your project.';
    return e;
  }
  const waFallback = (d) => waUrl(`Hello KRISHAN WEBDESIGNERC, my name is ${d.name}. I want a ${d.websiteType || 'website'}${d.budget ? ` (budget: ${d.budget})` : ''}. ${d.message}`.slice(0, 900));

  if (form) {
    FIELDS.forEach((n) => {
      form.elements[n].addEventListener('input', () => setErr(n, ''));
      form.elements[n].addEventListener('change', () => setErr(n, ''));
    });
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      statusBox.className = 'form-status';
      const fd = new FormData(form);
      const d = Object.fromEntries([...FIELDS, 'company'].map((k) => [k, String(fd.get(k) || '')]));
      const errs = clientValidate(d);
      FIELDS.forEach((n) => setErr(n, errs[n]));
      const firstBad = Object.keys(errs)[0];
      if (firstBad) { form.elements[firstBad].focus(); return; }

      form.classList.add('loading');
      $('#submitBtn .lbl').textContent = 'Sending…';
      try {
        const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
        let data = {};
        try { data = await res.json(); } catch { /* non-JSON response */ }
        if (res.ok && data.ok) {
          showStatus('ok', '<b>Thank you!</b> Your enquiry has been sent. I’ll get back to you shortly.');
          form.reset();
        } else if (res.status === 422 && data.fields) {
          Object.entries(data.fields).forEach(([n, m]) => setErr(n, m));
          showStatus('bad', data.error || 'Please check the highlighted fields.');
        } else {
          showStatus('bad', `${data.error || 'Something went wrong. Please try again.'}<br><a href="${waFallback(d)}" target="_blank" rel="noopener">Send this on WhatsApp instead</a>`);
        }
      } catch {
        showStatus('bad', `I couldn’t reach the server. Please check your connection and try again.<br><a href="${waFallback(d)}" target="_blank" rel="noopener">Send this on WhatsApp instead</a>`);
      } finally {
        form.classList.remove('loading');
        $('#submitBtn .lbl').textContent = 'Send enquiry';
      }
    });
  }
})();
