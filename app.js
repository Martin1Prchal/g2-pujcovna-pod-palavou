import { initialData, cloneData, STORAGE_KEY } from './data.mjs?v=2';

const routes = [
  ['home', 'Domů'], ['pujcovna', 'Půjčovna'], ['cenik', 'Ceník'], ['vylety', 'Výlety'],
  ['galerie', 'Galerie'], ['kontakt', 'Kontakt'], ['poptavka', 'Poptávka']
];

const state = {
  data: loadData(),
  route: 'home',
  rentalFilter: 'vse',
  tripFilter: 'vse',
  galleryFilter: 'vse',
  adminTab: 'products',
  adminAuth: sessionStorage.getItem('g2-admin-auth') === 'true',
  inquirySent: false
};

function loadData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? migrateData(JSON.parse(stored)) : cloneData();
  } catch { return cloneData(); }
}

function migrateData(stored) {
  const fresh = cloneData();
  const merged = { ...fresh, ...stored, brand: { ...fresh.brand, ...stored.brand }, contact: { ...fresh.contact, ...stored.contact }, pageText: { ...fresh.pageText, ...stored.pageText }, uiText: { ...fresh.uiText, ...stored.uiText }, contactContent: { ...fresh.contactContent, ...stored.contactContent } };
  merged.categories = (stored.categories || fresh.categories).map(category => {
    const fallback = fresh.categories.find(item => item.id === category.id);
    return { ...fallback, ...category, icon: fallback?.icon || 'bike' };
  });
  merged.trips = (stored.trips || fresh.trips).map(trip => ({ ...fresh.trips.find(item => item.id === trip.id), ...trip }));
  merged.meta = fresh.meta;
  return merged;
}

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const money = value => value === 0 ? 'zdarma' : `${Number(value).toLocaleString('cs-CZ')} Kč`;
const telHref = value => `tel:${value.replace(/\s+/g, '')}`;

const iconPaths = {
  bike: '<circle cx="6" cy="17" r="3.5"/><circle cx="18" cy="17" r="3.5"/><path d="m6 17 4-8h4l4 8M9 11h7M10 9 8.5 6.5H6M14 9l2-2"/>',
  bolt: '<path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>',
  child: '<circle cx="12" cy="5" r="2.5"/><path d="M8 22v-5l-2-4 3-3h6l3 3-2 4v5M9 10l3 5 3-5"/>',
  scooter: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M6 19h8l3-11h-3M17 8l-1-4h3M8 15h6"/>',
  shield: '<path d="M12 3 4 6v5c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-3Z"/><path d="m9 12 2 2 4-4"/>',
  phone: '<path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5C3 13.6 10.4 21 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-1-1.2 3c-4.8-1-8.6-4.8-9.6-9.6l3-1.2L7 3Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  tool: '<path d="M14 6a4 4 0 0 0-5-3l3 3-3 3-3-3a4 4 0 0 0 5 5l7 7a2 2 0 1 0 3-3l-7-7Z"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m15 9-2 4-4 2 2-4 4-2Z"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
  pin: '<path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  trend: '<path d="M4 18V9M10 18V5M16 18v-7M22 18V3"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  car: '<path d="m5 16-1 3h16l-1-3-2-7H7l-2 7Z"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M5 14h14"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 17 5-4 4 3 3-2 4 3"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>'
};

function svgIcon(name, className = '') {
  const paths = iconPaths[name] || iconPaths.info;
  return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

function currentRoute() {
  const hashRoute = location.hash.replace(/^#\/?/, '').split('?')[0];
  const pathRoute = location.pathname.replace(/^\/+|\/+$/g, '');
  const raw = hashRoute || pathRoute || 'home';
  return [...routes.map(([id]) => id), 'admin'].includes(raw) ? raw : 'home';
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    return true;
  } catch {
    toast('Změnu se nepodařilo uložit. Zkuste menší obrázek.');
    return false;
  }
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2600);
}

function header() {
  const { brand } = state.data;
  const nav = routes.map(([id, label]) => `<a href="#/${id}" class="nav-link ${state.route === id ? 'active' : ''}">${label}</a>`).join('');
  return `<header class="site-header">
    <div class="shell header-inner">
      <a class="brand" href="#/home" aria-label="Domů"><img src="${esc(brand.logo)}" alt="${esc(brand.name)}"></a>
      <button class="menu-toggle" type="button" aria-label="Otevřít menu" aria-expanded="false"><span></span><span></span><span></span></button>
      <nav class="main-nav" aria-label="Hlavní navigace">${nav}</nav>
      <a class="button primary header-cta" href="#/poptavka">Poptávka</a>
    </div>
  </header>`;
}

function footer() {
  const { brand, contact } = state.data;
  return `<footer class="site-footer">
    <div class="shell footer-grid">
      <a class="brand footer-brand" href="#/home"><img src="${esc(brand.logo)}" alt="${esc(brand.name)}"></a>
      <nav aria-label="Navigace v zápatí">${routes.map(([id, label]) => `<a href="#/${id}">${label}</a>`).join('')}</nav>
      <div class="footer-social"><a href="${telHref(contact.phones[0])}">${svgIcon('phone')} ${esc(contact.phones[0])}</a><a href="mailto:${esc(contact.email)}">${svgIcon('mail')} E-mail</a></div>
      <a class="admin-link" href="#/admin" aria-label="Přihlášení správce">${svgIcon('lock')} Přihlášení správce</a>
    </div>
    <div class="shell footer-note">© 2026 ${esc(brand.name)}</div>
  </footer>`;
}

function pageHero(title, lead, eyebrow = '') {
  const { brand } = state.data;
  return `<section class="page-hero" style="--hero:url('${esc(brand.hero)}')">
    <div class="shell page-hero-inner">
      <div>${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h1>${esc(title)}</h1><p>${esc(lead)}</p></div>
      <div class="hand-note">${esc(brand.slogan)}</div>
    </div>
  </section>`;
}

function googleMapEmbed() {
  const address = state.data.contact.address;
  const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  return `<div class="map-embed"><iframe src="${esc(src)}" title="Mapa – ${esc(address)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`;
}

function infoStrip() {
  return `<div class="info-strip">${state.data.benefits.filter(item => item.active).map(item => `<div>${svgIcon(item.icon)}<span><b>${esc(item.title)}</b><small>${esc(item.text)}</small></span></div>`).join('')}</div>`;
}

function categoryCards() {
  return state.data.categories.filter(x => x.active && x.id !== 'prislusenstvi').map(category => {
    const product = state.data.products.find(p => p.category === category.id && p.active);
    return `<a href="#/pujcovna" class="category-card">
      <div class="category-card-heading"><h3>${esc(category.name)}</h3><p>${esc(category.description)}</p></div>
      ${(category.image || product?.image) ? `<img src="${esc(category.image || product.image)}" alt="${esc(category.name)}">` : ''}
    </a>`;
  }).join('');
}

function productCard(product, compact = false) {
  const category = state.data.categories.find(c => c.id === product.category);
  return `<article class="product-card ${compact ? 'compact' : ''}">
    <div class="product-heading"><span class="pill-label">${esc(category?.name || '')}</span><h3>${esc(product.name)}</h3></div>
    <div class="product-image"><img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy"></div>
    <div class="product-body">
      ${compact ? '' : `<ul>${(Array.isArray(product.params) ? product.params : String(product.params || '').split('\n')).filter(Boolean).map(p => `<li>${esc(p)}</li>`).join('')}<li>Výška: ${esc(product.riderHeight)}</li></ul>`}
      <p>${esc(product.description)}</p>
      <div class="card-bottom"><strong>${money(product.price)} <small>/ den</small></strong><a href="#/poptavka" aria-label="Poptat ${esc(product.name)}">${svgIcon('arrow')}</a></div>
    </div>
  </article>`;
}

function tripCard(trip, featured = false) {
  return `<article class="trip-card ${featured ? 'featured' : ''}">
    <img src="${esc(trip.image)}" alt="${esc(trip.name)}" loading="lazy">
    <div><span class="eyebrow">${featured ? 'Náš tip' : esc(trip.difficulty)}</span><h3>${esc(trip.name)}</h3><p>${esc(featured && trip.longDescription ? trip.longDescription : trip.description)}</p>
      <div class="trip-meta"><span>${svgIcon('pin')}${esc(trip.distance)}</span><span>${svgIcon('clock')}${esc(trip.time)}</span><span>${svgIcon('trend')}${esc(trip.difficulty)}</span>${trip.roadRatio ? `<span>${svgIcon('route')}${esc(trip.roadRatio)}</span>` : ''}</div>
      ${trip.mapyUrl ? `<a class="button route-button" href="${esc(trip.mapyUrl)}" target="_blank" rel="noopener noreferrer">${svgIcon('map')}${esc(state.data.uiText.mapyCta)}${svgIcon('arrow')}</a>` : ''}
    </div>
  </article>`;
}

function homePage() {
  const { pageText, brand, trips, gallery, contact, uiText } = state.data;
  return `<main id="main">
    <section class="home-hero"><img class="home-hero-image" src="${esc(brand.hero)}" alt="Krajina pod Pálavou" fetchpriority="high"><div class="shell hero-content">
      <p class="eyebrow">Na kolech za krásami jižní Moravy</p><h1>${esc(pageText.homeTitle)}</h1><p>${esc(pageText.homeLead)}</p>
      <div class="hero-actions"><a class="button primary" href="#/poptavka">${esc(uiText.inquiryCta)}${svgIcon('arrow')}</a><a class="button secondary" href="${telHref(contact.phones[0])}">${svgIcon('phone')}${esc(uiText.callCta)}</a></div>
    </div></section>
    <section class="shell categories-section"><div class="section-heading"><div><p class="eyebrow">${esc(uiText.homeCategoriesEyebrow)}</p><h2>${esc(uiText.homeCategoriesTitle)}</h2></div><a href="#/pujcovna">${esc(uiText.catalogCta)}${svgIcon('arrow')}</a></div><div class="category-overlap">${categoryCards()}</div></section>
    <section class="soft-section"><div class="shell">${infoStrip()}</div></section>
    <section class="shell section"><div class="section-heading"><div><p class="eyebrow">Inspirace pro den venku</p><h2>${esc(uiText.tripsTitle)}</h2></div><a href="#/vylety">${esc(uiText.allTripsCta)}${svgIcon('arrow')}</a></div>
      <div class="trip-grid">${trips.filter(x => x.active).slice(0, 3).map(x => tripCard(x)).join('')}</div>
    </section>
    <section class="shell section"><div class="section-heading"><div><p class="eyebrow">Z jižní Moravy</p><h2>${esc(uiText.galleryTitle)}</h2></div><a href="#/galerie">${esc(uiText.galleryCta)}${svgIcon('arrow')}</a></div>
      <div class="gallery-preview">${gallery.filter(x => x.active).slice(0, 6).map((x, i) => `<img src="${esc(x.image)}" alt="${esc(x.caption)}" loading="lazy" data-lightbox-index="${i}" tabindex="0" role="button" aria-label="Otevřít fotografii: ${esc(x.caption)}">`).join('')}</div>
    </section>
    ${contactBand()}
  </main>`;
}

function rentalPage() {
  const { pageText, categories, accessories, prices } = state.data;
  const rentalCategories = categories.filter(category => category.active && ['kola','elektrokola','detska-kola','kolobezky'].includes(category.id));
  const categoryOffers = rentalCategories.map(category => {
    const price = prices.find(item => item.active && item.category === category.id)?.day;
    return `<article class="category-card rental-category-card"><div class="category-card-heading"><h3>${esc(category.name)}</h3><p>${esc(category.description)}</p></div>${category.image ? `<img src="${esc(category.image)}" alt="${esc(category.name)}" loading="lazy">` : ''}${price != null ? `<div class="category-price"><span>od</span><strong>${money(price)}</strong><small>/ den</small></div>` : ''}</article>`;
  }).join('');
  return `<main id="main">${pageHero(pageText.rentalTitle, pageText.rentalLead, 'Katalog půjčovny')}
    <section class="shell section rental-offer"><div class="section-heading"><div><p class="eyebrow">Vyberte si vybavení</p><h2>Naše nabídka</h2></div></div>
      <div class="rental-category-grid">${categoryOffers}</div>
      <div class="section-heading subheading"><h2>Příslušenství</h2></div><div class="accessory-grid">${accessories.filter(a => a.active).map(accessoryCard).join('')}</div>
    </section>
    <section class="shell">${infoStrip()}</section>${ctaBand('Připraveni vyrazit?', 'Vyplňte nezávaznou poptávku a my ověříme dostupnost.', 'Poptat kola')}
  </main>`;
}

function accessoryCard(a) {
  return `<article class="accessory-card"><img src="${esc(a.image)}" alt="${esc(a.name)}" loading="lazy"><div><h3>${esc(a.name)}</h3><p>${esc(a.note)}</p><strong>${money(a.price)}${a.price ? ' / den' : ''}</strong></div></article>`;
}

function pricingPage() {
  const { pageText, prices, accessories, delivery } = state.data;
  return `<main id="main">${pageHero(pageText.pricingTitle, pageText.pricingLead)}
    <section class="shell section"><div class="price-grid">${prices.filter(x => x.active).map(price => {
      const cat = state.data.categories.find(c => c.id === price.category);
      const product = state.data.products.find(p => p.category === price.category && p.active);
      return `<article class="price-card"><div><span class="category-icon">${svgIcon(cat?.icon || 'bike')}</span><h2>${esc(price.label)}</h2><p>${esc(price.description)}</p></div>${product ? `<img src="${esc(product.image)}" alt="${esc(price.label)}">` : ''}<div class="price-row"><span>1 den</span><strong>${money(price.day)}</strong></div><p class="data-note">Další dny a dostupnost potvrdíme v nabídce.</p></article>`;
    }).join('')}</div>
    <div class="pricing-lower"><section class="panel"><div class="section-heading"><h2>Příslušenství</h2></div><div class="mini-price-grid">${accessories.filter(x => x.active).map(a => `<div><b>${esc(a.name)}</b><span>${esc(a.note)}</span><strong>${money(a.price)}</strong></div>`).join('')}</div></section>
    <section class="panel"><div class="section-heading"><h2>Dovoz a vyzvednutí</h2></div>${delivery.filter(x => x.active).map(d => `<div class="delivery-row"><span>${svgIcon('pin')}${esc(d.place)}</span><strong>${esc(d.price)}</strong></div>`).join('')}<div class="notice">${svgIcon('info')}<span>Dovoz je nutné objednat předem. Cena je individuální.</span></div></section></div>
    <div class="included"><h2>Co je v ceně půjčovného?</h2><div>${state.data.included.filter(item => item.active).map(item => `<span>${svgIcon(item.icon)}${esc(item.text)}</span>`).join('')}</div></div></section>
    ${ctaBand('Nezávazná poptávka', 'Vyberte termín a vybavení. Rezervace vznikne až po potvrzení půjčovnou.')}
  </main>`;
}

function tripsPage() {
  const { pageText, trips } = state.data;
  const cats = [['vse', 'Všechny trasy'], ['lehke', 'Lehké'], ['vinarske', 'Vinařské'], ['vyhledy', 'Výhledy'], ['pamatky', 'Památky']];
  const filtered = trips.filter(t => t.active && (state.tripFilter === 'vse' || t.category === state.tripFilter));
  return `<main id="main">${pageHero(pageText.tripsTitle, pageText.tripsLead, 'Na kolech za krásami jižní Moravy')}
    <section class="shell section"><div class="filters">${cats.map(([id, name]) => `<button class="filter-button ${state.tripFilter === id ? 'active' : ''}" data-trip-filter="${id}">${name}</button>`).join('')}</div>
      ${trips.find(x => x.active) ? tripCard(trips.find(x => x.active), true) : ''}
      <div class="section-heading subheading"><h2>Další tipy na výlety</h2></div><div class="trip-grid">${filtered.length ? filtered.map(x => tripCard(x)).join('') : emptyState('Pro tento filtr nejsou žádné aktivní tipy.')}</div>
      <div class="notice data-disclaimer">${svgIcon('info')}<span>Vzdálenosti a časy jsou orientační. Před jízdou si v Mapy.cz ověřte aktuální trasu a průjezdnost.</span></div>
    </section>${ctaBand('Nevíte, kam vyrazit?', 'Rádi doporučíme cíl podle času, kondice a složení skupiny.', 'Kontaktovat nás', '#/kontakt')}
  </main>`;
}

function galleryPage() {
  const { pageText, gallery } = state.data;
  const cats = [['vse','Vše'],['kola','Kola'],['okoli','Okolí'],['pujcovna','Půjčovna']];
  const filtered = gallery.filter(g => g.active && (state.galleryFilter === 'vse' || g.category === state.galleryFilter));
  return `<main id="main">${pageHero(pageText.galleryTitle, pageText.galleryLead)}<section class="shell section">
    <div class="filters">${cats.map(([id, name]) => `<button class="filter-button ${state.galleryFilter === id ? 'active' : ''}" data-gallery-filter="${id}">${name}</button>`).join('')}</div>
    <div class="gallery-grid">${filtered.length ? filtered.map((g, i) => `<figure class="gallery-item item-${i % 5}" data-lightbox-index="${i}" tabindex="0" role="button" aria-label="Otevřít fotografii: ${esc(g.caption)}"><img src="${esc(g.image)}" alt="${esc(g.caption)}" loading="lazy"><figcaption>${esc(g.caption)}</figcaption></figure>`).join('') : emptyState('V této kategorii nejsou fotografie.')}</div>
    </section>${ctaBand('Naplánujte si vlastní výlet pod Pálavou', 'Půjčte si kolo a objevte jižní Moravu vlastním tempem.')}</main>`;
}

function contactPage() {
  const { pageText, contact, uiText, contactContent } = state.data;
  return `<main id="main">${pageHero(pageText.contactTitle, pageText.contactLead)}<section class="shell section contact-grid">
    <article class="panel contact-card"><span class="round-icon">${svgIcon('pin')}</span><h2>${esc(contactContent.detailsTitle)}</h2><p>${esc(contact.address)}</p>${contact.phones.map(p => `<a href="${telHref(p)}">${svgIcon('phone')}${esc(p)}</a>`).join('')}<a href="mailto:${esc(contact.email)}">${svgIcon('mail')}${esc(contact.email)}</a></article>
    <article class="panel contact-card"><span class="round-icon olive">${svgIcon('clock')}</span><h2>${esc(contactContent.openingTitle)}</h2><h3>${esc(contact.openingTitle)}</h3><p>${esc(contact.openingHours)}</p><hr><p>${esc(contact.openingNote)}</p></article>
    <article class="panel contact-card"><span class="round-icon">${svgIcon('mail')}</span><h2>${esc(contactContent.inquiryTitle)}</h2><p>${esc(contactContent.inquiryText)}</p><a class="button primary" href="#/poptavka">${esc(uiText.fillInquiryCta)}</a><a class="button secondary" href="mailto:${esc(contact.email)}">${esc(uiText.emailCta)}</a></article>
    <article class="panel map-card"><div><p class="eyebrow">Kde nás najdete</p><h2>${esc(contactContent.locationTitle)}</h2><p>${esc(contact.address)}</p><a class="button primary" href="${esc(contact.mapUrl)}" target="_blank" rel="noopener noreferrer">${svgIcon('pin')}${esc(uiText.googleMapsCta)}${svgIcon('arrow')}</a></div>${googleMapEmbed()}</article>
    <article class="panel arrival-card"><h2>${esc(contactContent.arrivalTitle)}</h2><div><b>${svgIcon('car')}${esc(contactContent.carTitle)}</b><p>${esc(contactContent.carText)}</p></div><div><b>${svgIcon('bike')}${esc(contactContent.handoverTitle)}</b><p>${esc(contactContent.handoverText)}</p></div></article>
    <article class="panel message-card"><h2>Napište nám</h2><form id="contact-form"><label>Jméno a příjmení *<input required name="name" autocomplete="name"></label><label>E-mail *<input required type="email" name="email" autocomplete="email"></label><label class="wide">Vaše zpráva *<textarea required name="message" rows="4"></textarea></label><button class="button primary" type="submit">Odeslat zprávu</button></form><p class="form-note">Zpráva se neodesílá mimo toto zařízení.</p></article>
    </section></main>`;
}

function contactBand() {
  const { contact, uiText } = state.data;
  return `<section class="shell contact-band"><div><p class="eyebrow">Kontaktujte nás</p><h2>${esc(contact.address)}</h2>${contact.phones.map(phone => `<a href="${telHref(phone)}">${svgIcon('phone')}${esc(phone)}</a>`).join('')}<a href="mailto:${esc(contact.email)}">${svgIcon('mail')}${esc(contact.email)}</a><a class="button light" href="${esc(contact.mapUrl)}" target="_blank" rel="noopener noreferrer">${svgIcon('pin')}${esc(uiText.googleMapsCta)}${svgIcon('arrow')}</a></div>${googleMapEmbed()}</section>`;
}

function ctaBand(title, text, label = state.data.uiText.defaultInquiryCta, href = '#/poptavka') {
  return `<section class="shell cta-band"><div><p class="eyebrow">Půjčovna pod Pálavou</p><h2>${esc(title)}</h2><p>${esc(text)}</p></div><a class="button primary" href="${href}">${esc(label)}</a></section>`;
}

function emptyState(text) { return `<div class="empty-state">${esc(text)}</div>`; }

function inquiryPage() {
  const { pageText, categories, accessories } = state.data;
  const rentable = categories.filter(c => ['kola','elektrokola','detska-kola','kolobezky'].includes(c.id));
  return `<main id="main">${pageHero(pageText.inquiryTitle, pageText.inquiryLead)}<section class="shell section inquiry-wrap">
    <form id="inquiry-form" class="inquiry-form">
      ${formSection(1, 'Vaše kontaktní údaje', `<div class="form-grid three"><label>Jméno *<input name="name" required autocomplete="name" placeholder="Jan Novák"></label><label>Telefon *<input name="phone" required type="tel" autocomplete="tel" placeholder="+420 777 123 456"></label><label>E-mail *<input name="email" required type="email" autocomplete="email" placeholder="jan@example.cz"></label></div>`)}
      ${formSection(2, 'Termín půjčení', `<div class="form-grid four"><label>Datum od *<input name="dateFrom" type="date" required></label><label>Datum do *<input name="dateTo" type="date" required></label><label>Počet dnů<input name="days" readonly value="—"></label><label>Čas vyzvednutí *<input name="pickupTime" type="time" required></label></div>`)}
      ${formSection(3, 'Co chcete půjčit?', `<p class="section-help">Lze kombinovat více typů.</p><div class="quantity-grid">${rentable.map(c => quantityControl(c.id, c.name, c.icon)).join('')}</div>`)}
      ${formSection(4, 'Příslušenství', `<p class="section-help">Vyberte položky a počet kusů.</p><div class="accessory-selects">${accessories.filter(a => a.active).map(a => quantityControl(`acc-${a.id}`, a.name, a.price ? `${money(a.price)} / den` : 'zdarma')).join('')}</div>`)}
      ${formSection(5, 'Jezdci', `<p class="section-help">Počet jezdců se řídí celkovým počtem kol a koloběžek. Od výšky 180 cm je povinná hmotnost.</p><div id="riders" class="riders-list">${emptyState('Nejprve vyberte alespoň jeden kus vybavení.')}</div>`)}
      ${formSection(6, 'Způsob převzetí', `<div class="pickup-options"><label><input type="radio" name="handover" value="Osobní vyzvednutí" checked> <span><b>Osobní vyzvednutí</b><small>${esc(state.data.contact.address)}</small></span></label><label><input type="radio" name="handover" value="Dovoz"> <span><b>Dovoz kol</b><small>Po předchozí domluvě, cena individuální.</small></span></label><label id="delivery-place" class="delivery-place hidden">Místo dovozu *<input name="deliveryPlace" placeholder="Adresa nebo místo"></label></div>`)}
      ${formSection(7, 'Poznámka', `<label><span class="sr-only">Poznámka</span><textarea name="note" rows="4" placeholder="Speciální požadavky, plánovaná trasa nebo jiné vybavení…"></textarea></label>`)}
      <div class="form-submit"><div class="notice">${svgIcon('info')}<span>Rezervace je platná až po potvrzení půjčovnou.</span></div><button class="button primary" type="submit">${esc(state.data.uiText.submitInquiryCta)}${svgIcon('arrow')}</button></div>
    </form><div id="inquiry-result"></div></section></main>`;
}

function formSection(number, title, content) {
  return `<fieldset class="form-section"><legend><span>${number}</span>${esc(title)}</legend>${content}</fieldset>`;
}

function quantityControl(name, label, icon) {
  const visual = iconPaths[icon] ? svgIcon(icon) : `<small>${esc(icon)}</small>`;
  return `<div class="quantity-control"><div>${visual}<b>${esc(label)}</b></div><div><button type="button" data-qty="minus" aria-label="Odebrat ${esc(label)}">−</button><input name="${name}" value="0" inputmode="numeric" min="0" max="20" aria-label="Počet ${esc(label)}"><button type="button" data-qty="plus" aria-label="Přidat ${esc(label)}">+</button></div></div>`;
}

function adminPage() {
  if (!state.adminAuth) return `<main id="main" class="admin-login"><section class="panel"><p class="eyebrow">Lokální administrace</p><h1>Přihlášení správce</h1><p>Lokální správa obsahu oddělená od budoucího Framer CMS.</p><form id="admin-login"><label>Demo heslo<input type="password" name="password" required placeholder="palava"></label><button class="button primary" type="submit">Přihlásit</button></form><small>Použijte heslo <b>palava</b>. Nejde o produkční zabezpečení.</small><a href="#/home">← Zpět na web</a></section></main>`;
  const tabs = [['products','Produkty'],['accessories','Příslušenství'],['prices','Ceník'],['trips','Výlety'],['gallery','Galerie'],['content','Obsah webu'],['contact','Kontakty']];
  return `<main id="main" class="admin-shell"><div class="admin-header"><div><p class="eyebrow">Lokální administrace</p><h1>Správa obsahu</h1><p>Změny jsou pouze lokální v tomto prohlížeči.</p></div><div><button class="button secondary" id="export-data">Export JSON</button><button class="button secondary" id="reset-data">Obnovit výchozí data</button><button class="button ghost" id="admin-logout">Odhlásit</button></div></div>
    <nav class="admin-tabs">${tabs.map(([id, label]) => `<button class="${state.adminTab === id ? 'active' : ''}" data-admin-tab="${id}">${label}</button>`).join('')}</nav>
    <section class="admin-content">${adminContent()}</section></main>`;
}

function adminContent() {
  if (state.adminTab === 'products') return adminCollection('products', ['name','category','params','description','riderHeight','price','image','active']);
  if (state.adminTab === 'accessories') return adminCollection('accessories', ['name','note','price','image','active']);
  if (state.adminTab === 'prices') return `<section class="admin-group"><h2>Ceník půjčovny</h2>${adminCollection('prices', ['label','category','day','description','active'])}</section><section class="admin-group"><h2>Dovoz a vyzvednutí</h2>${adminCollection('delivery', ['place','price','active'])}</section>`;
  if (state.adminTab === 'trips') return adminCollection('trips', ['name','category','description','longDescription','distance','time','difficulty','roadRatio','mapyUrl','image','active']);
  if (state.adminTab === 'gallery') return adminCollection('gallery', ['caption','category','image','active']);
  if (state.adminTab === 'contact') {
    const contactFields = ['address','phones.0','phones.1','email','openingTitle','openingHours','openingNote','mapUrl'].map(key => adminField(`contact.${key}`, key, getPath(state.data.contact, key))).join('');
    return `<div class="admin-settings single"><section class="panel"><h2>Kontakty, provoz a mapa</h2>${contactFields}</section></div>`;
  }
  const textFields = Object.entries(state.data.pageText).map(([key, value]) => adminField(`pageText.${key}`, key, value)).join('');
  const uiFields = Object.entries(state.data.uiText).map(([key, value]) => adminField(`uiText.${key}`, key, value)).join('');
  const contactContentFields = Object.entries(state.data.contactContent).map(([key, value]) => adminField(`contactContent.${key}`, key, value)).join('');
  const brandFields = ['slogan','hero'].map(key => adminField(`brand.${key}`, key, state.data.brand[key])).join('');
  return `<div class="admin-settings"><section class="panel"><h2>Texty stránek</h2>${textFields}</section><section class="panel"><h2>Texty rozhraní a CTA</h2>${uiFields}</section><section class="panel"><h2>Texty kontaktu</h2>${contactContentFields}</section><section class="panel"><h2>Hero a vizuální obsah</h2>${brandFields}</section><section class="panel categories-admin"><h2>Kategorie</h2>${adminCollection('categories', ['name','description','image','icon','active'])}</section><section class="panel categories-admin"><h2>Výhody půjčovny</h2>${adminCollection('benefits', ['title','text','icon','active'])}</section><section class="panel categories-admin"><h2>Co je v ceně</h2>${adminCollection('included', ['text','icon','active'])}</section></div>`;
}

function adminCollection(name, fields) {
  const items = state.data[name];
  return `<div class="admin-actions"><button class="button primary" data-add-item="${name}">+ Přidat položku</button><span>${items.length} položek</span></div><div class="admin-list">${items.map((item, index) => `<article class="admin-item"><div class="admin-item-title"><h3>${esc(item.name || item.label || item.caption || item.place || `Položka ${index + 1}`)}</h3><div class="item-order"><button class="icon-button" data-move-item="${name}" data-index="${index}" data-direction="-1" aria-label="Posunout výše" ${index === 0 ? 'disabled' : ''}>↑</button><button class="icon-button" data-move-item="${name}" data-index="${index}" data-direction="1" aria-label="Posunout níže" ${index === items.length - 1 ? 'disabled' : ''}>↓</button><button class="icon-button" data-remove-item="${name}" data-index="${index}" aria-label="Odstranit">×</button></div></div><div class="admin-fields">${fields.map(field => adminField(`${name}.${index}.${field}`, field, item[field])).join('')}</div></article>`).join('')}</div>`;
}

function adminField(path, label, value) {
  const labels = { name: 'Název', title: 'Nadpis', text: 'Text', category: 'Kategorie', params: 'Důležité parametry', description: 'Krátký popis', longDescription: 'Delší popis', riderHeight: 'Výška jezdce', price: 'Cena', day: 'Cena za den', image: 'Fotografie', active: 'Aktivní / zobrazené', note: 'Popis', caption: 'Popisek', distance: 'Délka', time: 'Přibližný čas', difficulty: 'Obtížnost', roadRatio: 'Poměr cyklostezka / silnice', mapyUrl: 'Mapy.cz GPS URL', place: 'Místo', hero: 'Hero fotografie', slogan: 'Slogan', address: 'Adresa', 'phones.0': 'Telefon 1', 'phones.1': 'Telefon 2', email: 'E-mail', openingTitle: 'Provozní období', openingHours: 'Otevírací doba', openingNote: 'Poznámka k provozu', mapUrl: 'Google Maps URL', icon: 'Typ ikony' };
  const fieldLabel = labels[label] || label;
  if (typeof value === 'boolean') return `<label class="switch-field"><input type="checkbox" data-path="${path}" ${value ? 'checked' : ''}><span>${esc(fieldLabel)}</span></label>`;
  if (label === 'image' || label === 'hero') return imageAdminField(path, fieldLabel, value);
  if (label === 'category') {
    const choices = path.startsWith('trips.') ? [['lehke','Lehké'],['vinarske','Vinařské'],['vyhledy','Výhledy'],['pamatky','Památky']] : path.startsWith('gallery.') ? [['kola','Kola'],['okoli','Okolí'],['pujcovna','Půjčovna']] : state.data.categories.filter(item => item.id !== 'prislusenstvi').map(item => [item.id, item.name]);
    return `<label>${esc(fieldLabel)}<select data-path="${path}">${choices.map(([id, name]) => `<option value="${esc(id)}" ${id === value ? 'selected' : ''}>${esc(name)}</option>`).join('')}</select></label>`;
  }
  if (label === 'difficulty') return `<label>${esc(fieldLabel)}<select data-path="${path}">${['Lehká','Střední','Náročná'].map(item => `<option ${item === value ? 'selected' : ''}>${item}</option>`).join('')}</select></label>`;
  if (label === 'icon') return `<label>${esc(fieldLabel)}<select data-path="${path}">${[['bike','Kolo'],['bolt','Elektro'],['child','Dětské'],['scooter','Koloběžka'],['shield','Štít'],['tool','Servis'],['compass','Kompas'],['map','Mapa'],['phone','Telefon']].map(([id, name]) => `<option value="${id}" ${id === value ? 'selected' : ''}>${name}</option>`).join('')}</select></label>`;
  if (Array.isArray(value)) return `<label>${esc(fieldLabel)}<textarea data-path="${path}" data-array-field rows="4">${esc(value.join('\n'))}</textarea></label>`;
  const type = typeof value === 'number' ? 'number' : 'text';
  const inputType = ['mapyUrl','mapUrl'].includes(label) ? 'url' : type;
  const isLong = ['description','longDescription','openingNote'].includes(label) || String(value).length > 90;
  return `<label>${esc(fieldLabel)}${isLong ? `<textarea data-path="${path}" rows="3">${esc(value ?? '')}</textarea>` : `<input type="${inputType}" data-path="${path}" value="${esc(value ?? '')}" ${label === 'mapyUrl' ? 'placeholder="https://mapy.cz/..."' : ''}>`}</label>`;
}

function imageAdminField(path, label, value) {
  const isUploaded = String(value || '').startsWith('data:image/');
  return `<div class="image-admin-field"><span>${esc(label)}</span><div class="image-admin-row">${value ? `<img src="${esc(value)}" alt="Náhled ${esc(label)}">` : `<div class="image-placeholder">${svgIcon('image')}<small>Bez fotografie</small></div>`}<div><label class="upload-button">${svgIcon('upload')}Nahrát ze zařízení<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" data-image-upload="${path}"></label><label>URL obrázku<input type="url" data-path="${path}" value="${isUploaded ? '' : esc(value || '')}" placeholder="https://..."></label><small>${isUploaded ? 'Fotografie je uložená lokálně v tomto prohlížeči.' : 'Lze nahrát soubor nebo použít URL.'}</small></div></div></div>`;
}

function getPath(object, path) {
  return path.split('.').reduce((target, key) => target?.[key], object);
}

function lightbox() {
  return `<div class="lightbox hidden" id="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Náhled fotografie" tabindex="-1">
    <button class="lightbox-close" type="button" aria-label="Zavřít náhled">&times;</button>
    <button class="lightbox-nav lightbox-prev" type="button" aria-label="Předchozí fotografie">&#10094;</button>
    <figure class="lightbox-content"><img alt=""><figcaption></figcaption></figure>
    <button class="lightbox-nav lightbox-next" type="button" aria-label="Další fotografie">&#10095;</button>
  </div>`;
}

function appShell(content) { return `${state.route === 'admin' ? '' : header()}${content}${state.route === 'admin' ? '' : `${footer()}${lightbox()}`}`; }

function render() {
  document.body.classList.remove('lightbox-open');
  state.route = currentRoute();
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  if (state.route === 'pujcovna' && params.get('filter')) state.rentalFilter = params.get('filter');
  const pages = { home: homePage, pujcovna: rentalPage, cenik: pricingPage, vylety: tripsPage, galerie: galleryPage, kontakt: contactPage, poptavka: inquiryPage, admin: adminPage };
  $('#app').innerHTML = appShell(pages[state.route]());
  document.title = `${routes.find(([id]) => id === state.route)?.[1] || 'Administrace'} · ${state.data.brand.shortName}`;
  bindEvents();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function bindEvents() {
  $('.menu-toggle')?.addEventListener('click', event => {
    const button = event.currentTarget;
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    $('.main-nav').classList.toggle('open', !open);
  });
  $$('[data-rental-filter]').forEach(b => b.addEventListener('click', () => { state.rentalFilter = b.dataset.rentalFilter; render(); }));
  $$('[data-trip-filter]').forEach(b => b.addEventListener('click', () => { state.tripFilter = b.dataset.tripFilter; render(); }));
  $$('[data-gallery-filter]').forEach(b => b.addEventListener('click', () => { state.galleryFilter = b.dataset.galleryFilter; render(); }));
  bindLightbox();
  $('#contact-form')?.addEventListener('submit', event => { event.preventDefault(); event.currentTarget.reset(); toast('Zpráva je připravena a neodesílá se mimo toto zařízení.'); });
  bindInquiry();
  bindAdmin();
}

function bindLightbox() {
  const modal = $('#gallery-lightbox');
  const triggers = $$('[data-lightbox-index]');
  if (!modal || !triggers.length) return;

  const image = $('.lightbox-content img', modal);
  const caption = $('.lightbox-content figcaption', modal);
  const previous = $('.lightbox-prev', modal);
  const next = $('.lightbox-next', modal);
  const closeButton = $('.lightbox-close', modal);
  let currentIndex = 0;
  let opener = null;

  const showImage = index => {
    currentIndex = (index + triggers.length) % triggers.length;
    const trigger = triggers[currentIndex];
    const source = trigger.matches('img') ? trigger : $('img', trigger);
    image.src = source.src;
    image.alt = source.alt;
    caption.textContent = source.alt;
  };
  const open = (index, trigger) => {
    opener = trigger;
    showImage(index);
    modal.classList.remove('hidden');
    document.body.classList.add('lightbox-open');
    closeButton.focus();
  };
  const close = () => {
    modal.classList.add('hidden');
    document.body.classList.remove('lightbox-open');
    image.removeAttribute('src');
    opener?.focus();
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => open(index, trigger));
    trigger.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open(index, trigger);
      }
    });
  });
  closeButton.addEventListener('click', close);
  previous.addEventListener('click', () => showImage(currentIndex - 1));
  next.addEventListener('click', () => showImage(currentIndex + 1));
  modal.addEventListener('click', event => {
    if (!event.target.closest('.lightbox-content img, .lightbox-close, .lightbox-nav')) close();
  });
  modal.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}

function bindInquiry() {
  const form = $('#inquiry-form');
  if (!form) return;
  const dateFrom = form.elements.dateFrom;
  const dateTo = form.elements.dateTo;
  const today = new Date().toISOString().slice(0, 10);
  dateFrom.min = today; dateTo.min = today;
  const updateDays = () => {
    const from = new Date(`${dateFrom.value}T00:00:00`), to = new Date(`${dateTo.value}T00:00:00`);
    const days = dateFrom.value && dateTo.value ? Math.floor((to - from) / 86400000) + 1 : 0;
    form.elements.days.value = days > 0 ? String(days) : '—';
    dateTo.setCustomValidity(days < 1 && dateFrom.value && dateTo.value ? 'Datum do nesmí být dříve než datum od.' : '');
  };
  dateFrom.addEventListener('change', () => { dateTo.min = dateFrom.value || today; updateDays(); });
  dateTo.addEventListener('change', updateDays);
  $$('.quantity-control button', form).forEach(button => button.addEventListener('click', () => {
    const input = button.parentElement.querySelector('input');
    const next = Math.max(0, Math.min(20, Number(input.value || 0) + (button.dataset.qty === 'plus' ? 1 : -1)));
    input.value = String(next); input.dispatchEvent(new Event('change', { bubbles: true }));
  }));
  $$('.quantity-control input', form).forEach(input => input.addEventListener('change', () => {
    input.value = String(Math.max(0, Math.min(20, Number.parseInt(input.value, 10) || 0)));
    if (!input.name.startsWith('acc-')) updateRiders(form);
  }));
  $$('input[name="handover"]', form).forEach(input => input.addEventListener('change', () => {
    const delivery = input.value === 'Dovoz' && input.checked;
    $('#delivery-place').classList.toggle('hidden', !delivery);
    form.elements.deliveryPlace.required = delivery;
  }));
  form.addEventListener('submit', event => {
    event.preventDefault(); updateDays(); updateRiderRequirements();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const total = ['kola','elektrokola','detska-kola','kolobezky'].reduce((sum, key) => sum + Number(form.elements[key].value), 0);
    if (!total) { toast('Vyberte alespoň jeden kus vybavení.'); form.elements.kola.focus(); return; }
    const summary = createSmsSummary(form);
    $('#inquiry-result').innerHTML = `<section class="success-panel"><span>${svgIcon('check')}</span><h2>Poptávka je připravena</h2><p>Poptávka se nikam neodeslala. Níže je formát připravený pro budoucí webhook / SMS službu.</p><pre>${esc(summary)}</pre><button class="button secondary" id="copy-summary" type="button">Kopírovat souhrn</button></section>`;
    $('#copy-summary').addEventListener('click', async () => { await navigator.clipboard?.writeText(summary); toast('Souhrn zkopírován.'); });
    $('#inquiry-result').scrollIntoView({ behavior: 'smooth' });
  });
}

function updateRiders(form) {
  const keys = ['kola','elektrokola','detska-kola','kolobezky'];
  const count = keys.reduce((sum, key) => sum + Number(form.elements[key].value || 0), 0);
  const existing = $$('.rider-row').map(row => ({ height: row.querySelector('[name^="riderHeight"]').value, weight: row.querySelector('[name^="riderWeight"]')?.value || '' }));
  $('#riders').innerHTML = count ? Array.from({ length: count }, (_, index) => riderRow(index, existing[index])).join('') : emptyState('Nejprve vyberte alespoň jeden kus vybavení.');
  $$('[name^="riderHeight"]').forEach(input => input.addEventListener('input', updateRiderRequirements));
  updateRiderRequirements();
}

function riderRow(index, values = {}) {
  return `<div class="rider-row"><b>Jezdec ${index + 1}</b><label>Výška *<span><input name="riderHeight-${index}" type="number" min="80" max="230" required value="${esc(values.height || '')}"><em>cm</em></span></label><label class="weight-field hidden">Hmotnost *<span><input name="riderWeight-${index}" type="number" min="20" max="250" value="${esc(values.weight || '')}"><em>kg</em></span></label></div>`;
}

function updateRiderRequirements() {
  $$('.rider-row').forEach(row => {
    const height = Number(row.querySelector('[name^="riderHeight"]').value);
    const field = row.querySelector('.weight-field');
    const input = field.querySelector('input');
    const required = height >= 180;
    field.classList.toggle('hidden', !required); input.required = required;
    if (!required) input.value = '';
  });
}

function createSmsSummary(form) {
  const fd = new FormData(form);
  const itemLabels = { kola: 'kolo', elektrokola: 'elektrokolo', 'detska-kola': 'dětské kolo', kolobezky: 'koloběžka' };
  const items = Object.entries(itemLabels).filter(([key]) => Number(fd.get(key))).map(([key, label]) => `${fd.get(key)}× ${label}`);
  const heights = $$('[name^="riderHeight"]').map(x => x.value).filter(Boolean);
  const weights = $$('[name^="riderWeight"]').map((x, i) => x.value ? `jezdec ${i + 1} – ${x.value} kg` : '').filter(Boolean);
  const from = formatDate(fd.get('dateFrom')), to = formatDate(fd.get('dateTo'));
  return ['Nová poptávka', fd.get('name'), `${from}–${to}`, ...items, `Výšky: ${heights.join(' / ')} cm`, weights.length ? `Hmotnost: ${weights.join(', ')}` : '', `Převzetí: ${fd.get('handover')}${fd.get('deliveryPlace') ? ` – ${fd.get('deliveryPlace')}` : ''}`, `Vyzvednutí: ${fd.get('pickupTime')}`, `Tel.: ${fd.get('phone')}`, `E-mail: ${fd.get('email')}`, fd.get('note') ? `Poznámka: ${fd.get('note')}` : ''].filter(Boolean).join('\n');
}

function formatDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function bindAdmin() {
  $('#admin-login')?.addEventListener('submit', event => {
    event.preventDefault();
    if (event.currentTarget.elements.password.value !== 'palava') { toast('Nesprávné demo heslo.'); return; }
    state.adminAuth = true; sessionStorage.setItem('g2-admin-auth', 'true'); render();
  });
  $('#admin-logout')?.addEventListener('click', () => { state.adminAuth = false; sessionStorage.removeItem('g2-admin-auth'); render(); });
  $$('[data-admin-tab]').forEach(button => button.addEventListener('click', () => { state.adminTab = button.dataset.adminTab; render(); }));
  $$('[data-path]').forEach(input => input.addEventListener(input.type === 'checkbox' || input.tagName === 'SELECT' ? 'change' : 'input', () => {
    const rawValue = input.type === 'checkbox' ? input.checked : input.type === 'number' ? Number(input.value) : input.value;
    const value = input.dataset.arrayField != null ? String(rawValue).split('\n').map(item => item.trim()).filter(Boolean) : rawValue;
    if (input.type === 'url' && input.value && !isValidHttpUrl(input.value, input.dataset.path.endsWith('mapyUrl'))) {
      input.setCustomValidity(input.dataset.path.endsWith('mapyUrl') ? 'Zadejte platnou HTTPS adresu Mapy.cz nebo Mapy.com.' : 'Zadejte platnou HTTP(S) adresu.');
      return;
    }
    input.setCustomValidity('');
    setPath(state.data, input.dataset.path, value); persist();
  }));
  $$('[data-image-upload]').forEach(input => input.addEventListener('change', () => handleImageUpload(input)));
  $$('[data-add-item]').forEach(button => button.addEventListener('click', () => { addItem(button.dataset.addItem); persist(); render(); toast('Položka přidána.'); }));
  $$('[data-move-item]').forEach(button => button.addEventListener('click', () => {
    const list = state.data[button.dataset.moveItem], from = Number(button.dataset.index), to = from + Number(button.dataset.direction);
    if (to < 0 || to >= list.length) return;
    [list[from], list[to]] = [list[to], list[from]]; persist(); render(); toast('Pořadí změněno.');
  }));
  $$('[data-remove-item]').forEach(button => button.addEventListener('click', () => { state.data[button.dataset.removeItem].splice(Number(button.dataset.index), 1); persist(); render(); toast('Položka odstraněna.'); }));
  $('#reset-data')?.addEventListener('click', () => { state.data = cloneData(initialData); persist(); render(); toast('Výchozí data obnovena.'); });
  $('#export-data')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = 'g2-content-export.json'; link.click(); URL.revokeObjectURL(link.href);
  });
}

function setPath(object, path, value) {
  const parts = path.split('.'); const key = parts.pop(); const target = parts.reduce((acc, part) => acc[part], object); target[key] = value;
}

function isValidHttpUrl(value, mapyOnly = false) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    return !mapyOnly || /(^|\.)mapy\.(cz|com)$/i.test(url.hostname);
  } catch { return false; }
}

function handleImageUpload(input) {
  const file = input.files?.[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) { toast('Vyberte soubor obrázku.'); input.value = ''; return; }
  if (file.size > 2_000_000) { toast('Obrázek je příliš velký. Maximum jsou 2 MB.'); input.value = ''; return; }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    setPath(state.data, input.dataset.imageUpload, reader.result);
    if (persist()) { render(); toast('Fotografie byla nahrána.'); }
  });
  reader.addEventListener('error', () => toast('Fotografii se nepodařilo načíst.'));
  reader.readAsDataURL(file);
}

function addItem(collection) {
  const id = `${collection}-${Date.now()}`;
  const templates = {
    products: { id, name: 'Nová položka', category: 'kola', description: 'Doplňte popis.', params: ['Doplňte parametr'], riderHeight: 'dle domluvy', price: 0, active: false, image: '' },
    accessories: { id, name: 'Nové příslušenství', note: 'Doplňte popis.', price: 0, active: false, image: '' },
    prices: { id, category: 'kola', label: 'Nová cena', day: 0, description: 'Doplňte popis.', active: false },
    delivery: { id, place: 'Nové místo', price: 'individuálně', active: false },
    trips: { id, name: 'Nový výlet', category: 'lehke', description: 'Doplňte krátký popis.', longDescription: 'Doplňte delší popis trasy.', distance: 'k ověření', time: 'k ověření', difficulty: 'Lehká', roadRatio: 'Doplňte poměr povrchů', mapyUrl: '', active: false, image: '' },
    gallery: { id, category: 'okoli', caption: 'Nová fotografie', image: '', active: false },
    categories: { id, name: 'Nová kategorie', icon: 'bike', description: 'Doplňte popis.', image: '', active: false },
    benefits: { id, icon: 'bike', title: 'Nová výhoda', text: 'Doplňte text.', active: false },
    included: { id, icon: 'shield', text: 'Nová položka v ceně', active: false }
  };
  state.data[collection].push(templates[collection]);
}

window.addEventListener('hashchange', render);
render();
