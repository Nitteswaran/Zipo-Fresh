/* ============================================================
   ZIPO FRESH — Cart & WhatsApp Ordering
   ------------------------------------------------------------
   No backend, no database. Cart lives in localStorage and the
   order is sent as a pre-filled WhatsApp message.
   ============================================================ */

'use strict';

(function () {
  const WHATSAPP_NUMBER = '60122605295';
  const STORAGE_KEY = 'zipo_cart';

  // ── Cart state (localStorage) ───────────────────────────
  function getCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }
  function setCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    refreshUI();
  }
  function cartCount() { return getCart().reduce((n, i) => n + i.qty, 0); }
  function cartSubtotal() { return getCart().reduce((s, i) => s + i.price * i.qty, 0); }
  const formatRM = n => 'RM' + Number(n).toFixed(2);

  function addItem(product) {
    const cart = getCart();
    const existing = cart.find(i => i.id === product.id);
    if (existing) existing.qty += 1;
    else cart.push({ id: product.id, name: product.name, price: product.price, unit: product.unit, qty: 1 });
    setCart(cart);
  }
  function changeQty(id, delta) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    setCart(cart);
  }
  function removeItem(id) { setCart(getCart().filter(i => i.id !== id)); }
  function clearCart() { setCart([]); }

  // ── Build cart button in nav + drawer (once) ────────────
  let drawerEl, overlayEl, countBadges = [];

  function injectNavButton() {
    document.querySelectorAll('.nav__actions').forEach(actions => {
      if (actions.querySelector('.cart-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'cart-btn';
      btn.setAttribute('aria-label', 'Open cart');
      btn.innerHTML = '<i class="fa-solid fa-basket-shopping" aria-hidden="true"></i>' +
        '<span class="cart-btn__count" aria-hidden="true">0</span>';
      btn.addEventListener('click', openCart);
      actions.insertBefore(btn, actions.firstChild);
      countBadges.push(btn.querySelector('.cart-btn__count'));
    });
  }

  function injectDrawer() {
    if (document.querySelector('.cart-drawer')) return;
    overlayEl = document.createElement('div');
    overlayEl.className = 'cart-overlay';
    overlayEl.addEventListener('click', closeCart);

    drawerEl = document.createElement('aside');
    drawerEl.className = 'cart-drawer';
    drawerEl.setAttribute('aria-label', 'Shopping cart');
    drawerEl.setAttribute('role', 'dialog');
    drawerEl.setAttribute('aria-modal', 'true');
    drawerEl.innerHTML = `
      <div class="cart-drawer__head">
        <h2 class="cart-drawer__title"><i class="fa-solid fa-basket-shopping" aria-hidden="true"></i> Your Order</h2>
        <button class="cart-drawer__close" aria-label="Close cart"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </div>
      <div class="cart-drawer__body" id="cart-body"></div>
      <div class="cart-drawer__foot" id="cart-foot"></div>`;

    document.body.appendChild(overlayEl);
    document.body.appendChild(drawerEl);
    drawerEl.querySelector('.cart-drawer__close').addEventListener('click', closeCart);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });
  }

  function openCart() {
    renderDrawer();
    overlayEl.classList.add('open');
    drawerEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    overlayEl?.classList.remove('open');
    drawerEl?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ── Render cart contents + checkout form ────────────────
  function renderDrawer() {
    const body = document.getElementById('cart-body');
    const foot = document.getElementById('cart-foot');
    if (!body || !foot) return;
    const cart = getCart();

    if (cart.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <i class="fa-solid fa-basket-shopping" aria-hidden="true"></i>
          <p>Your cart is empty.</p>
          <a href="shop.html" class="btn btn--lime btn--sm" onclick="(function(){})()">Browse Products</a>
        </div>`;
      foot.innerHTML = '';
      return;
    }

    body.innerHTML = cart.map(i => `
      <div class="cart-item" data-id="${i.id}">
        <div class="cart-item__info">
          <span class="cart-item__name">${i.name}</span>
          <span class="cart-item__meta">${formatRM(i.price)} · ${i.unit}</span>
        </div>
        <div class="cart-item__qty">
          <button class="qty-btn" data-act="dec" aria-label="Decrease quantity"><i class="fa-solid fa-minus" aria-hidden="true"></i></button>
          <span class="qty-val">${i.qty}</span>
          <button class="qty-btn" data-act="inc" aria-label="Increase quantity"><i class="fa-solid fa-plus" aria-hidden="true"></i></button>
        </div>
        <span class="cart-item__line">${formatRM(i.price * i.qty)}</span>
        <button class="cart-item__rm" data-act="rm" aria-label="Remove item"><i class="fa-solid fa-trash-can" aria-hidden="true"></i></button>
      </div>`).join('');

    body.querySelectorAll('.cart-item').forEach(row => {
      const id = row.dataset.id;
      row.querySelector('[data-act="dec"]').addEventListener('click', () => changeQty(id, -1));
      row.querySelector('[data-act="inc"]').addEventListener('click', () => changeQty(id, 1));
      row.querySelector('[data-act="rm"]').addEventListener('click', () => removeItem(id));
    });

    foot.innerHTML = `
      <div class="cart-subtotal">
        <span>Subtotal</span>
        <strong>${formatRM(cartSubtotal())}</strong>
      </div>
      <p class="cart-note"><i class="fa-solid fa-circle-info" aria-hidden="true"></i> Final price &amp; availability confirmed by Zipo Fresh on WhatsApp.</p>
      <form id="checkout-form" class="checkout-form" novalidate>
        <div class="checkout-mode" role="group" aria-label="Order mode">
          <label class="mode-opt"><input type="radio" name="mode" value="Delivery" checked> <span><i class="fa-solid fa-truck" aria-hidden="true"></i> Delivery</span></label>
          <label class="mode-opt"><input type="radio" name="mode" value="Pickup"> <span><i class="fa-solid fa-store" aria-hidden="true"></i> Pickup</span></label>
        </div>
        <input class="form-input" name="name" type="text" placeholder="Your name *" required>
        <input class="form-input" name="phone" type="tel" placeholder="Phone number *" required>
        <textarea class="form-input" name="address" rows="2" placeholder="Delivery address *" required></textarea>
        <textarea class="form-input" name="notes" rows="2" placeholder="Notes (optional)"></textarea>
        <button type="submit" class="btn btn--lime checkout-form__submit">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i> Order via WhatsApp
        </button>
      </form>`;

    const form = document.getElementById('checkout-form');
    const addrField = form.querySelector('[name="address"]');
    form.querySelectorAll('[name="mode"]').forEach(r => r.addEventListener('change', () => {
      const isDelivery = form.mode.value === 'Delivery';
      addrField.placeholder = isDelivery ? 'Delivery address *' : 'Address (optional for pickup)';
      addrField.required = isDelivery;
    }));
    form.addEventListener('submit', handleCheckout);
  }

  // ── Checkout → WhatsApp ─────────────────────────────────
  function handleCheckout(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const cart = getCart();
    if (cart.length === 0) return;

    const mode = form.mode.value;
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const address = form.address.value.trim();
    const notes = form.notes.value.trim();

    const lines = cart.map(i => `${i.qty}× ${i.name} (${i.unit}) — ${formatRM(i.price * i.qty)}`);
    const sep = '————————————————';
    let msg = `*New Zipo Fresh Order*\n${sep}\n`;
    msg += lines.join('\n');
    msg += `\n${sep}\nSubtotal: ${formatRM(cartSubtotal())}\n\n`;
    msg += `*Customer details*\nName: ${name}\nPhone: ${phone}\nMode: ${mode}\n`;
    if (address) msg += `Address: ${address}\n`;
    if (notes) msg += `Notes: ${notes}\n`;
    msg += `\n_(Prices to be confirmed by Zipo Fresh)_`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener');

    const btn = form.querySelector('.checkout-form__submit');
    btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Order sent! Clearing cart…';
    setTimeout(() => { clearCart(); }, 1200);
  }

  // ── Refresh all count badges + open drawer if visible ───
  function refreshUI() {
    const n = cartCount();
    countBadges.forEach(b => {
      b.textContent = n;
      b.classList.toggle('show', n > 0);
    });
    if (drawerEl?.classList.contains('open')) renderDrawer();
  }

  // ── Product grid (shop page) ────────────────────────────
  function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid || typeof PRODUCTS === 'undefined') return;
    grid.innerHTML = PRODUCTS.map(p => `
      <article class="product-card" data-cat="${p.cat}" data-id="${p.id}">
        <div class="product-card__icon"><i class="${p.icon}" aria-hidden="true"></i></div>
        <div class="product-card__body">
          <h3 class="product-card__name">${p.name}</h3>
          <p class="product-card__desc">${p.desc || ''}</p>
          <div class="product-card__row">
            <div class="product-card__price">${formatRM(p.price)} <span>${p.unit}</span></div>
            <button class="btn btn--lime btn--sm product-card__add" data-id="${p.id}">
              <i class="fa-solid fa-plus" aria-hidden="true"></i> Add
            </button>
          </div>
        </div>
      </article>`).join('');

    grid.querySelectorAll('.product-card__add').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = PRODUCTS.find(p => p.id === btn.dataset.id);
        if (!prod) return;
        addItem(prod);
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Added';
        btn.classList.add('is-added');
        setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('is-added'); }, 1100);
      });
    });
  }

  // ── Init ────────────────────────────────────────────────
  injectNavButton();
  injectDrawer();
  renderProducts();
  refreshUI();
})();
