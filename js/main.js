/* ============================================================
   ZIPO FRESH — Main JavaScript
   ============================================================ */

'use strict';

// ── Navigation ──────────────────────────────────────────
const nav       = document.querySelector('.nav');
const ham       = document.querySelector('.nav__ham');
const drawer    = document.querySelector('.nav__drawer');
const backTop   = document.querySelector('.back-top');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav?.classList.toggle('scrolled', y > 50);
  backTop?.classList.toggle('show', y > 400);
}, {passive: true});

ham?.addEventListener('click', () => {
  ham.classList.toggle('open');
  drawer?.classList.toggle('open');
  document.body.style.overflow = drawer?.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.nav__drawer-link').forEach(l => {
  l.addEventListener('click', () => {
    ham?.classList.remove('open');
    drawer?.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Active nav
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__link, .nav__drawer-link').forEach(l => {
  const h = l.getAttribute('href') || '';
  if (h === page || (page === '' && h === 'index.html') ||
      (page.startsWith('blog') && h.startsWith('blog')) ||
      (page.startsWith('shop') && h.startsWith('shop')) ||
      (page.startsWith('about') && h.startsWith('about')) ||
      (page.startsWith('contact') && h.startsWith('contact'))) {
    l.classList.add('active');
  }
});

// ── Scroll Reveal ────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── Drag-to-Scroll ───────────────────────────────────────
function initDragScroll(selector) {
  document.querySelectorAll(selector).forEach(track => {
    let down = false, startX = 0, scrollLeft = 0;
    track.addEventListener('mousedown', e => {
      down = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft;
    });
    ['mouseleave','mouseup'].forEach(ev => track.addEventListener(ev, () => { down = false; }));
    track.addEventListener('mousemove', e => {
      if (!down) return;
      e.preventDefault();
      track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX) * 1.6;
    });
  });
}
initDragScroll('.hscroll__track');

// ── Arrow Buttons ────────────────────────────────────────
document.querySelectorAll('[data-scroll-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    const t = document.querySelector(btn.dataset.scrollTarget);
    if (!t) return;
    t.scrollBy({ left: (btn.dataset.dir === 'prev' ? -1 : 1) * 320, behavior: 'smooth' });
  });
});

// ── FAQ Accordion ────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const was = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!was) item.classList.add('open');
  });
});

// ── Filter Chips ─────────────────────────────────────────
document.querySelectorAll('[data-filter-group]').forEach(group => {
  group.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const f = chip.dataset.filter;
      document.querySelectorAll('[data-cat]').forEach(el => {
        el.style.display = (f === 'all' || el.dataset.cat === f) ? '' : 'none';
      });
    });
  });
});

// ── Newsletter Form ───────────────────────────────────────
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn   = form.querySelector('button');
    if (!input?.value) return;
    const orig = btn.textContent;
    btn.textContent = '<i class="fa-solid fa-check" aria-hidden="true"></i> Thank you!';
    btn.classList.replace('btn--dark','btn--lime');
    input.value = ''; input.disabled = true;
    setTimeout(() => {
      btn.textContent = orig; btn.classList.replace('btn--lime','btn--dark'); input.disabled = false;
    }, 3500);
  });
});

// ── Contact Form ──────────────────────────────────────────
const cForm = document.querySelector('#contact-form');
cForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = cForm.querySelector('[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = '<i class="fa-solid fa-check" aria-hidden="true"></i> Message Sent!';
  btn.classList.add('btn--lime'); btn.classList.remove('btn--outline');
  setTimeout(() => {
    btn.textContent = orig; btn.classList.remove('btn--lime'); btn.classList.add('btn--outline'); cForm.reset();
  }, 3500);
});

// ── Live Open/Closed Status ───────────────────────────────
function liveStatus() {
  const h = new Date().getHours();
  const isOpen = h >= 7 && h < 21;
  document.querySelectorAll('.js-status').forEach(el => {
    el.textContent = isOpen ? 'Open Now' : 'Closed Now';
    el.style.background = isOpen ? '' : 'rgba(255,80,80,.08)';
    el.style.borderColor = isOpen ? '' : 'rgba(255,80,80,.2)';
    el.style.color       = isOpen ? '' : '#ff5050';
  });
}
liveStatus();

// ── Footer Year ───────────────────────────────────────────
document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

// ── Blog Rendering ────────────────────────────────────────
function renderBlogCards(posts, container, limit = posts.length) {
  if (!container) return;
  container.innerHTML = '';
  posts.slice(0, limit).forEach(p => {
    const card = document.createElement('article');
    card.className = 'blog-card reveal';
    card.innerHTML = `
      <div class="blog-card__img">
        <img src="${p.image}" alt="${p.title}" loading="lazy" width="400" height="225">
        <span class="badge badge--lime blog-card__cat">${p.category}</span>
      </div>
      <div class="blog-card__body">
        <div class="blog-card__meta">
          <span><i class="fa-solid fa-calendar-days" aria-hidden="true"></i> ${formatDate(p.date)}</span>
          <span><i class="fa-solid fa-stopwatch" aria-hidden="true"></i> ${p.readTime}</span>
        </div>
        <h3 class="blog-card__title">${p.title}</h3>
        <p class="blog-card__exc">${p.excerpt}</p>
        <div class="blog-card__foot">
          <span class="blog-card__author">${p.author}</span>
          <a href="blog-post.html?slug=${p.slug}" class="blog-card__read">Read <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
        </div>
      </div>`;
    container.appendChild(card);
    revealObs.observe(card);
  });
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-MY', {day:'numeric',month:'short',year:'numeric'});
}

// Render homepage blog preview
const homeBlogs = document.querySelector('#home-blog-grid');
if (homeBlogs && typeof BLOG_POSTS !== 'undefined') renderBlogCards(BLOG_POSTS, homeBlogs, 3);

// Render blog listing page
const blogGrid = document.querySelector('#blog-grid');
if (blogGrid && typeof BLOG_POSTS !== 'undefined') {
  if (BLOG_POSTS.length > 0) {
    // Featured post
    const featured = document.querySelector('#blog-featured');
    if (featured) {
      const p = BLOG_POSTS[0];
      featured.innerHTML = `
        <div class="blog-card__img">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          <span class="badge badge--lime blog-card__cat">${p.category}</span>
        </div>
        <div class="blog-card__body">
          <div class="blog-card__meta">
            <span><i class="fa-solid fa-calendar-days" aria-hidden="true"></i> ${formatDate(p.date)}</span>
            <span><i class="fa-solid fa-stopwatch" aria-hidden="true"></i> ${p.readTime}</span>
          </div>
          <h2 class="blog-card__title">${p.title}</h2>
          <p class="blog-card__exc" style="-webkit-line-clamp:4">${p.excerpt}</p>
          <div class="blog-card__foot">
            <span class="blog-card__author">${p.author}</span>
            <a href="blog-post.html?slug=${p.slug}" class="blog-card__read">Read Article <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
          </div>
        </div>`;
    }
    renderBlogCards(BLOG_POSTS.slice(1), blogGrid);
  }
}

// Render single blog post
const postWrap = document.querySelector('#post-render');
if (postWrap && typeof BLOG_POSTS !== 'undefined') {
  const slug = new URLSearchParams(location.search).get('slug');
  const post = BLOG_POSTS.find(p => p.slug === slug);
  if (post) {
    document.title = `${post.title} — Zipo Fresh Blog`;
    document.querySelector('meta[name="description"]')
      ?.setAttribute('content', post.excerpt);
    postWrap.innerHTML = `
      <div class="post-hero post-wrap">
        <div class="post-meta">
          <span class="badge badge--lime">${post.category}</span>
          <span class="text-muted" style="font-size:var(--text-sm)"><i class="fa-solid fa-calendar-days" aria-hidden="true"></i> ${formatDate(post.date)}</span>
          <span class="text-muted" style="font-size:var(--text-sm)"><i class="fa-solid fa-stopwatch" aria-hidden="true"></i> ${post.readTime}</span>
        </div>
        <h1 class="post-title">${post.title}</h1>
        <p style="font-size:var(--text-lg);color:var(--t2);line-height:1.75">${post.excerpt}</p>
      </div>
      <div class="post-cover" style="max-width:var(--max-w);margin-inline:auto;padding-inline:var(--pad)">
        <img src="${post.image}" alt="${post.title}" loading="eager">
      </div>
      <div class="post-body post-wrap">${post.content}</div>`;
  } else {
    postWrap.innerHTML = `<div style="text-align:center;padding:5rem 2rem">
      <h2 style="font-family:var(--ff-d);font-size:var(--text-4xl);margin-bottom:1rem">Post Not Found</h2>
      <a href="blog.html" class="btn btn--lime"><i class="fa-solid fa-arrow-left" aria-hidden="true"></i> Back to Blog</a></div>`;
  }
}
