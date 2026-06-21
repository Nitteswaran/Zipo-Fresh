/* ============================================================
   ZIPO FRESH — Product Catalogue
   ------------------------------------------------------------
   HOW TO EDIT:
   • Change name / price / unit / desc freely.
   • price is in RM (Malaysian Ringgit), numbers only (no "RM").
   • cat must be one of: fruits, vegetables, dairy, meat,
                         bakery, beverages, household
   • icon is a Font Awesome class (already loaded site-wide),
     e.g. "fa-solid fa-apple-whole". See fontawesome.com/icons
   • id must be unique (used by the cart). Keep it short.
   NOTE: prices below are PLACEHOLDERS — update to your real prices.
   ============================================================ */

const PRODUCTS = [
  // ── Fruits ──────────────────────────────────────────────
  { id: 'fr-banana',   name: 'Bananas (Pisang)',        price: 5.90,  unit: 'per kg',     cat: 'fruits',     icon: 'fa-solid fa-lemon',          desc: 'Sweet local pisang berangan' },
  { id: 'fr-apple',    name: 'Red Apples',              price: 9.50,  unit: 'per kg',     cat: 'fruits',     icon: 'fa-solid fa-apple-whole',    desc: 'Crisp imported apples' },
  { id: 'fr-orange',   name: 'Mandarin Oranges',        price: 8.00,  unit: 'per kg',     cat: 'fruits',     icon: 'fa-solid fa-lemon',          desc: 'Juicy & seedless' },
  { id: 'fr-melon',    name: 'Watermelon',              price: 6.50,  unit: 'each',       cat: 'fruits',     icon: 'fa-solid fa-apple-whole',    desc: 'Whole, chilled & sweet' },

  // ── Vegetables ──────────────────────────────────────────
  { id: 'vg-kangkung', name: 'Kangkung',                price: 2.50,  unit: 'per bunch',  cat: 'vegetables', icon: 'fa-solid fa-leaf',           desc: 'Fresh water spinach' },
  { id: 'vg-bayam',    name: 'Bayam (Spinach)',         price: 2.50,  unit: 'per bunch',  cat: 'vegetables', icon: 'fa-solid fa-leaf',           desc: 'Tender green leaves' },
  { id: 'vg-broccoli', name: 'Broccoli',                price: 7.90,  unit: 'per kg',     cat: 'vegetables', icon: 'fa-solid fa-leaf',           desc: 'Fresh green florets' },
  { id: 'vg-carrot',   name: 'Carrots',                 price: 4.50,  unit: 'per kg',     cat: 'vegetables', icon: 'fa-solid fa-carrot',         desc: 'Crunchy & sweet' },

  // ── Dairy & Eggs ────────────────────────────────────────
  { id: 'dy-milk',     name: 'Fresh Milk 1L',           price: 8.50,  unit: 'per bottle', cat: 'dairy',      icon: 'fa-solid fa-glass-water',    desc: 'Full-cream pasteurised' },
  { id: 'dy-yoghurt',  name: 'Natural Yoghurt',         price: 6.90,  unit: 'per tub',    cat: 'dairy',      icon: 'fa-solid fa-glass-water',    desc: 'Creamy & unsweetened' },
  { id: 'dy-eggs',     name: 'Grade A Eggs (10s)',      price: 7.20,  unit: 'per tray',   cat: 'dairy',      icon: 'fa-solid fa-egg',            desc: 'Farm fresh' },
  { id: 'dy-cheese',   name: 'Cheddar Cheese Slices',   price: 9.90,  unit: 'per pack',   cat: 'dairy',      icon: 'fa-solid fa-cheese',         desc: 'Pack of 10 slices' },

  // ── Meat & Seafood ──────────────────────────────────────
  { id: 'mt-chicken',  name: 'Whole Chicken',           price: 13.50, unit: 'per kg',     cat: 'meat',       icon: 'fa-solid fa-drumstick-bite', desc: 'Fresh, cleaned' },
  { id: 'mt-beef',     name: 'Beef Cubes',              price: 32.00, unit: 'per kg',     cat: 'meat',       icon: 'fa-solid fa-drumstick-bite', desc: 'Tender stewing beef' },
  { id: 'mt-fish',     name: 'Ikan Kembung',            price: 14.00, unit: 'per kg',     cat: 'meat',       icon: 'fa-solid fa-fish',           desc: 'Fresh daily catch' },
  { id: 'mt-prawn',    name: 'Prawns (Medium)',         price: 28.00, unit: 'per kg',     cat: 'meat',       icon: 'fa-solid fa-fish',           desc: 'Fresh & deveined' },

  // ── Bakery ──────────────────────────────────────────────
  { id: 'bk-bread',    name: 'Wholemeal Bread',         price: 4.20,  unit: 'per loaf',   cat: 'bakery',     icon: 'fa-solid fa-bread-slice',    desc: 'Soft & freshly baked' },
  { id: 'bk-croiss',   name: 'Butter Croissant',        price: 3.50,  unit: 'each',       cat: 'bakery',     icon: 'fa-solid fa-bread-slice',    desc: 'Flaky & buttery' },
  { id: 'bk-bun',      name: 'Kaya Buns (4s)',          price: 5.00,  unit: 'per pack',   cat: 'bakery',     icon: 'fa-solid fa-bread-slice',    desc: 'Soft buns with kaya' },

  // ── Beverages ───────────────────────────────────────────
  { id: 'bv-juice',    name: 'Orange Juice 1L',         price: 7.50,  unit: 'per bottle', cat: 'beverages',  icon: 'fa-solid fa-bottle-water',   desc: '100% no added sugar' },
  { id: 'bv-coffee',   name: 'Local Coffee Powder',     price: 12.00, unit: 'per pack',   cat: 'beverages',  icon: 'fa-solid fa-mug-hot',        desc: 'Traditional kopi-o' },
  { id: 'bv-coconut',  name: 'Fresh Coconut Water',     price: 4.00,  unit: 'each',       cat: 'beverages',  icon: 'fa-solid fa-glass-water',    desc: 'Chilled, straight from the husk' },

  // ── Household ───────────────────────────────────────────
  { id: 'hh-detergent',name: 'Laundry Detergent 2kg',   price: 18.90, unit: 'per pack',   cat: 'household',   icon: 'fa-solid fa-house',          desc: 'Fresh-scent washing powder' },
  { id: 'hh-tissue',   name: 'Tissue Rolls (10s)',      price: 14.50, unit: 'per pack',   cat: 'household',   icon: 'fa-solid fa-basket-shopping',desc: '3-ply soft tissue' },
];
