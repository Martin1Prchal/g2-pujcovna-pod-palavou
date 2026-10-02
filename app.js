import { initialData, cloneData, STORAGE_KEY } from './data.mjs';

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
    return stored ? JSON.parse(stored) : cloneData();
  } catch { return cloneData(); }
}

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const money = value => value === 0 ? 'zdarma' : `${Number(value).toLocaleString('cs-CZ')} Kč`;
const telHref = value => `tel:${value.replace(/\s+/g, '')}`;

function currentRoute() {
  const hashRoute = location.hash.replace(/^#\/?/, '').split('?')[0];
  const pathRoute = location.pathname.replace(/^\/+|\/+$/g, '');
  const raw = hashRoute || pathRoute || 'home';
  return [...routes.map(([id]) => id), 'admin'].includes(raw) ? raw : 'home';
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
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
      <div class="footer-social"><a href="${telHref(contact.phones[0])}">☎ ${esc(contact.phones[0])}</a><a href="mailto:${esc(contact.email)}">✉ E-mail</a></div>
      <a class="admin-link" href="#/admin" aria-label="Přihlášení správce">🔒 Přihlášení správce</a>
    </div>
    <div class="shell footer-note">© 2026 ${esc(brand.name)} · G2 funkční prototyp</div>
  </footer>`;
}

function pageHero(title, lead, eyebrow = '') {
  const { brand } = state.data;
  return `<section class="page-hero" style="--hero:url('${esc(brand.hero)}')">
    <div class="shell page-hero-inner">
      <div>${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}<h1>${esc(title)}</h1><p>${esc(lead)}</p></div>
      <div class="hand-note">${esc(brand.slogan)}<span>♡</span></div>
    </div>
  </section>`;
}

function infoStrip() {
  return `<div class="info-strip">
    <div><b>🚲 Pomůžeme s výběrem</b><span>Poradíme podle výšky, plánů a trasy.</span></div>
    <div><b>♢ Pravidelný servis</b><span>Kola připravujeme před každou výpůjčkou.</span></div>
    <div><b>◉ Místní tipy</b><span>Doporučíme cíle a praktické zastávky.</span></div>
  </div>`;
}

function categoryCards() {
  return state.data.categories.filter(x => x.active && x.id !== 'prislusenstvi').map(category => {
    const product = state.data.products.find(p => p.category === category.id && p.active);
    return `<a href="#/pujcovna?filter=${category.id}" class="category-card">
      <div><span class="category-icon">${category.icon}</span><h3>${esc(category.name)}</h3><p>${esc(category.description)}</p></div>
      ${product ? `<img src="${esc(product.image)}" alt="${esc(product.name)}">` : ''}
    </a>`;
  }).join('');
}

function productCard(product, compact = false) {
  const category = state.data.categories.find(c => c.id === product.category);
  return `<article class="product-card ${compact ? 'compact' : ''}">
    <div class="product-image"><img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy"></div>
    <div class="product-body"><span class="pill-label">${esc(category?.name || '')}</span><h3>${esc(product.name)}</h3><p>${esc(product.description)}</p>
      ${compact ? '' : `<ul>${product.params.map(p => `<li>${esc(p)}</li>`).join('')}<li>Výška: ${esc(product.riderHeight)}</li></ul>`}
      <div class="card-bottom"><strong>${money(product.price)} <small>/ den</small></strong><a href="#/poptavka" aria-label="Poptat ${esc(product.name)}">→</a></div>
    </div>
  </article>`;
}

function tripCard(trip, featured = false) {
  return `<article class="trip-card ${featured ? 'featured' : ''}">
    <img src="${esc(trip.image)}" alt="${esc(trip.name)}" loading="lazy">
    <div><span class="eyebrow">${featured ? 'Náš tip' : esc(trip.difficulty)}</span><h3>${esc(trip.name)}</h3><p>${esc(trip.description)}</p>
      <div class="trip-meta"><span>⌖ ${esc(trip.distance)}</span><span>◷ ${esc(trip.time)}</span><span>↗ ${esc(trip.difficulty)}</span></div>
    </div>
  </article>`;
}

function homePage() {
  const { pageText, brand, products, trips, gallery, contact } = state.data;
  return `<main id="main">
    <section class="home-hero" style="--hero:url('${esc(brand.hero)}')"><div class="shell hero-content">
      <p class="eyebrow">Na kolech za krásami jižní Moravy</p><h1>${esc(pageText.homeTitle)}</h1><p>${esc(pageText.homeLead)}</p>
      <div class="hero-actions"><a class="button primary" href="#/poptavka">Poptat kola</a><a class="button secondary" href="${telHref(contact.phones[0])}">☎ Zavolat</a></div>
    </div></section>
    <div class="shell category-overlap">${categoryCards()}</div>
    <section class="shell section"><div class="section-heading"><div><p class="eyebrow">Připraveno na cestu</p><h2>Vybraná kola z půjčovny</h2></div><a href="#/pujcovna">Zobrazit vše →</a></div>
      <div class="product-grid home-products">${products.filter(x => x.active).slice(0, 4).map(x => productCard(x, true)).join('')}</div>
    </section>
    <section class="soft-section"><div class="shell">${infoStrip()}</div></section>
    <section class="shell section"><div class="section-heading"><div><p class="eyebrow">Inspirace pro den venku</p><h2>Tipy na výlet</h2></div><a href="#/vylety">Všechny tipy →</a></div>
      <div class="trip-grid">${trips.filter(x => x.active).slice(0, 3).map(x => tripCard(x)).join('')}</div>
    </section>
    <section class="shell section"><div class="section-heading"><div><p class="eyebrow">Z jižní Moravy</p><h2>Z naší galerie</h2></div><a href="#/galerie">Zobrazit galerii →</a></div>
      <div class="gallery-preview">${gallery.filter(x => x.active).slice(0, 6).map(x => `<img src="${esc(x.image)}" alt="${esc(x.caption)}" loading="lazy">`).join('')}</div>
    </section>
    ${contactBand()}
  </main>`;
}

function rentalPage() {
  const { pageText, categories, products, accessories } = state.data;
  const tabs = [{ id: 'vse', name: 'Vše' }, ...categories.filter(c => c.active)].map(c => `<button class="filter-button ${state.rentalFilter === c.id ? 'active' : ''}" data-rental-filter="${c.id}">${esc(c.name)}</button>`).join('');
  const filtered = products.filter(p => p.active && (state.rentalFilter === 'vse' || p.category === state.rentalFilter));
  const showAccessories = state.rentalFilter === 'vse' || state.rentalFilter === 'prislusenstvi';
  return `<main id="main">${pageHero(pageText.rentalTitle, pageText.rentalLead, 'Katalog půjčovny')}
    <section class="shell section"><div class="filters" aria-label="Filtr katalogu">${tabs}</div>
      <div class="product-grid">${filtered.length ? filtered.map(p => productCard(p)).join('') : (showAccessories ? '' : emptyState('V této kategorii momentálně není aktivní položka.'))}</div>
      ${showAccessories ? `<div class="section-heading subheading"><h2>Příslušenství</h2></div><div class="accessory-grid">${accessories.filter(a => a.active).map(accessoryCard).join('')}</div>` : ''}
    </section>
    <section class="shell">${infoStrip()}</section>${ctaBand('Připraveni vyrazit?', 'Vyplňte nezávaznou poptávku a my ověříme dostupnost.')}
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
      return `<article class="price-card"><div><span class="category-icon">${cat?.icon || '🚲'}</span><h2>${esc(price.label)}</h2><p>${esc(price.description)}</p></div>${product ? `<img src="${esc(product.image)}" alt="${esc(price.label)}">` : ''}<div class="price-row"><span>1 den</span><strong>${money(price.day)}</strong></div><p class="data-note">Další dny a dostupnost potvrdíme v nabídce.</p></article>`;
    }).join('')}</div>
    <div class="pricing-lower"><section class="panel"><div class="section-heading"><h2>Příslušenství</h2></div><div class="mini-price-grid">${accessories.filter(x => x.active).map(a => `<div><b>${esc(a.name)}</b><span>${esc(a.note)}</span><strong>${money(a.price)}</strong></div>`).join('')}</div></section>
    <section class="panel"><div class="section-heading"><h2>Dovoz a vyzvednutí</h2></div>${delivery.filter(x => x.active).map(d => `<div class="delivery-row"><span>⌖ ${esc(d.place)}</span><strong>${esc(d.price)}</strong></div>`).join('')}<div class="notice">ⓘ Dovoz je nutné objednat předem. Cena je individuální.</div></section></div>
    <div class="included"><h2>Co je v ceně půjčovného?</h2><div>${['Pravidelně servisované vybavení', 'Přilba, nářadí, hustilka a zámek', 'Místní tipy na výlety', 'Telefonická podpora během výpůjčky'].map((x, i) => `<span><b>${['🔧','◉','▱','☎'][i]}</b>${x}</span>`).join('')}</div></div></section>
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
      <div class="notice data-disclaimer">ⓘ Vzdálenosti a časy jsou orientační návrhové údaje. Před jízdou si ověřte aktuální trasu a průjezdnost.</div>
    </section>${ctaBand('Nevíte, kam vyrazit?', 'Rádi doporučíme cíl podle času, kondice a složení skupiny.', 'Kontaktovat nás', '#/kontakt')}
  </main>`;
}

function galleryPage() {
  const { pageText, gallery } = state.data;
  const cats = [['vse','Vše'],['kola','Kola'],['okoli','Okolí'],['pujcovna','Půjčovna']];
  const filtered = gallery.filter(g => g.active && (state.galleryFilter === 'vse' || g.category === state.galleryFilter));
  return `<main id="main">${pageHero(pageText.galleryTitle, pageText.galleryLead)}<section class="shell section">
    <div class="filters">${cats.map(([id, name]) => `<button class="filter-button ${state.galleryFilter === id ? 'active' : ''}" data-gallery-filter="${id}">${name}</button>`).join('')}</div>
    <div class="gallery-grid">${filtered.length ? filtered.map((g, i) => `<figure class="gallery-item item-${i % 5}"><img src="${esc(g.image)}" alt="${esc(g.caption)}" loading="lazy"><figcaption>${esc(g.caption)}</figcaption></figure>`).join('') : emptyState('V této kategorii nejsou fotografie.')}</div>
    </section>${ctaBand('Naplánujte si vlastní výlet pod Pálavou', 'Půjčte si kolo a objevte jižní Moravu vlastním tempem.')}</main>`;
}

function contactPage() {
  const { pageText, contact } = state.data;
  return `<main id="main">${pageHero(pageText.contactTitle, pageText.contactLead)}<section class="shell section contact-grid">
    <article class="panel contact-card"><span class="round-icon">⌖</span><h2>Naše kontaktní údaje</h2><p>${esc(contact.address)}</p>${contact.phones.map(p => `<a href="${telHref(p)}">☎ ${esc(p)}</a>`).join('')}<a href="mailto:${esc(contact.email)}">✉ ${esc(contact.email)}</a></article>
    <article class="panel contact-card"><span class="round-icon olive">◷</span><h2>Provozní doba</h2><h3>${esc(contact.openingTitle)}</h3><p>${esc(contact.openingHours)}</p><hr><p>${esc(contact.openingNote)}</p></article>
    <article class="panel contact-card"><span class="round-icon">▤</span><h2>Nezávazná poptávka</h2><p>Pošlete nám termín, počet kol a výšky jezdců.</p><a class="button primary" href="#/poptavka">Vyplnit poptávku</a><a class="button secondary" href="mailto:${esc(contact.email)}">Napsat e-mail</a></article>
    <article class="panel map-card"><div><p class="eyebrow">Kde nás najdete</p><h2>Šakvice pod Pálavou</h2><p>${esc(contact.address)}</p><a class="button primary" href="${esc(contact.mapUrl)}" target="_blank" rel="noreferrer">Otevřít v Google Maps</a></div><div class="map-visual"><span>Novomlýnské nádrže</span><b>⌖ Šakvice</b><small>Pálava</small></div></article>
    <article class="panel arrival-card"><h2>Jak se k nám dostat</h2><div><b>🚗 Autem</b><p>Najdete nás přímo v obci Šakvice na adrese Hlavní 50.</p></div><div><b>🚲 Půjčení a vrácení kol</b><p>Vybavení se předává v provozovně, případně po předchozí domluvě doveze.</p></div></article>
    <article class="panel message-card"><h2>Napište nám</h2><form id="contact-form"><label>Jméno a příjmení *<input required name="name" autocomplete="name"></label><label>E-mail *<input required type="email" name="email" autocomplete="email"></label><label class="wide">Vaše zpráva *<textarea required name="message" rows="4"></textarea></label><button class="button primary" type="submit">Odeslat zprávu</button></form><p class="form-note">V prototypu se zpráva neodesílá mimo zařízení.</p></article>
    </section></main>`;
}

function contactBand() {
  const { contact } = state.data;
  return `<section class="shell contact-band"><div><p class="eyebrow">Kontaktujte nás</p><h2>${esc(contact.address)}</h2><a href="${telHref(contact.phones[0])}">${esc(contact.phones[0])}</a><a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></div><div class="map-visual"><span>Novomlýnské nádrže</span><b>⌖ Šakvice</b><small>Pálava</small></div></section>`;
}

function ctaBand(title, text, label = 'Přejít na poptávku', href = '#/poptavka') {
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
      <div class="form-submit"><div class="notice">ⓘ Rezervace je platná až po potvrzení půjčovnou.</div><button class="button primary" type="submit">Odeslat poptávku</button></div>
    </form><div id="inquiry-result"></div></section></main>`;
}

function formSection(number, title, content) {
  return `<fieldset class="form-section"><legend><span>${number}</span>${esc(title)}</legend>${content}</fieldset>`;
}

function quantityControl(name, label, icon) {
  return `<div class="quantity-control"><div><span>${icon}</span><b>${esc(label)}</b></div><div><button type="button" data-qty="minus" aria-label="Odebrat ${esc(label)}">−</button><input name="${name}" value="0" inputmode="numeric" min="0" max="20" aria-label="Počet ${esc(label)}"><button type="button" data-qty="plus" aria-label="Přidat ${esc(label)}">+</button></div></div>`;
}

function adminPage() {
  if (!state.adminAuth) return `<main id="main" class="admin-login"><section class="panel"><p class="eyebrow">Prototype admin</p><h1>Přihlášení správce</h1><p>Lokální demonstrace oddělená od budoucího Framer CMS.</p><form id="admin-login"><label>Demo heslo<input type="password" name="password" required placeholder="palava"></label><button class="button primary" type="submit">Přihlásit</button></form><small>Pro prototyp použijte heslo <b>palava</b>. Nejde o produkční zabezpečení.</small><a href="#/home">← Zpět na web</a></section></main>`;
  const tabs = [['products','Produkty'],['accessories','Příslušenství'],['prices','Ceník'],['delivery','Dovoz'],['trips','Výlety'],['gallery','Galerie'],['content','Texty a kontakt']];
  return `<main id="main" class="admin-shell"><div class="admin-header"><div><p class="eyebrow">Prototype admin</p><h1>Správa obsahu</h1><p>Změny jsou pouze lokální v tomto prohlížeči.</p></div><div><button class="button secondary" id="export-data">Export JSON</button><button class="button secondary" id="reset-data">Obnovit výchozí data</button><button class="button ghost" id="admin-logout">Odhlásit</button></div></div>
    <nav class="admin-tabs">${tabs.map(([id, label]) => `<button class="${state.adminTab === id ? 'active' : ''}" data-admin-tab="${id}">${label}</button>`).join('')}</nav>
    <section class="admin-content">${adminContent()}</section></main>`;
}

function adminContent() {
  if (state.adminTab === 'products') return adminCollection('products', ['name','category','description','riderHeight','price','image','active']);
  if (state.adminTab === 'accessories') return adminCollection('accessories', ['name','note','price','image','active']);
  if (state.adminTab === 'prices') return adminCollection('prices', ['label','category','day','description','active']);
  if (state.adminTab === 'delivery') return adminCollection('delivery', ['place','price','active']);
  if (state.adminTab === 'trips') return adminCollection('trips', ['name','category','description','distance','time','difficulty','image','active']);
  if (state.adminTab === 'gallery') return adminCollection('gallery', ['caption','category','image','active']);
  const textFields = Object.entries(state.data.pageText).map(([key, value]) => adminField(`pageText.${key}`, key, value)).join('');
  const contactFields = ['address','email','openingTitle','openingHours','openingNote'].map(key => adminField(`contact.${key}`, key, state.data.contact[key])).join('');
  const brandFields = ['hero','slogan'].map(key => adminField(`brand.${key}`, key, state.data.brand[key])).join('');
  return `<div class="admin-settings"><section class="panel"><h2>Texty stránek</h2>${textFields}</section><section class="panel"><h2>Kontakt a otevírací doba</h2>${contactFields}</section><section class="panel"><h2>Vizuální obsah</h2>${brandFields}</section></div>`;
}

function adminCollection(name, fields) {
  const items = state.data[name];
  return `<div class="admin-actions"><button class="button primary" data-add-item="${name}">+ Přidat položku</button><span>${items.length} položek</span></div><div class="admin-list">${items.map((item, index) => `<article class="admin-item"><div class="admin-item-title"><h3>${esc(item.name || item.label || item.caption || item.place || `Položka ${index + 1}`)}</h3><div class="item-order"><button class="icon-button" data-move-item="${name}" data-index="${index}" data-direction="-1" aria-label="Posunout výše" ${index === 0 ? 'disabled' : ''}>↑</button><button class="icon-button" data-move-item="${name}" data-index="${index}" data-direction="1" aria-label="Posunout níže" ${index === items.length - 1 ? 'disabled' : ''}>↓</button><button class="icon-button" data-remove-item="${name}" data-index="${index}" aria-label="Odstranit">×</button></div></div><div class="admin-fields">${fields.map(field => adminField(`${name}.${index}.${field}`, field, item[field])).join('')}</div></article>`).join('')}</div>`;
}

function adminField(path, label, value) {
  if (typeof value === 'boolean') return `<label class="switch-field"><input type="checkbox" data-path="${path}" ${value ? 'checked' : ''}><span>${esc(label)}</span></label>`;
  const type = typeof value === 'number' ? 'number' : 'text';
  const isLong = ['description','image','hero','openingNote'].includes(label) || String(value).length > 70;
  return `<label>${esc(label)}${isLong ? `<textarea data-path="${path}" rows="2">${esc(value)}</textarea>` : `<input type="${type}" data-path="${path}" value="${esc(value)}">`}</label>`;
}

function appShell(content) { return `${state.route === 'admin' ? '' : header()}${content}${state.route === 'admin' ? '' : footer()}`; }

function render() {
  state.route = currentRoute();
  const params = new URLSearchParams(location.hash.split('?')[1] || '');
  if (state.route === 'pujcovna' && params.get('filter')) state.rentalFilter = params.get('filter');
  const pages = { home: homePage, pujcovna: rentalPage, cenik: pricingPage, vylety: tripsPage, galerie: galleryPage, kontakt: contactPage, poptavka: inquiryPage, admin: adminPage };
  $('#app').innerHTML = appShell(pages[state.route]());
  document.title = `${routes.find(([id]) => id === state.route)?.[1] || 'Prototype admin'} · ${state.data.brand.shortName}`;
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
  $('#contact-form')?.addEventListener('submit', event => { event.preventDefault(); event.currentTarget.reset(); toast('Zpráva je připravena. V prototypu se neodesílá.'); });
  bindInquiry();
  bindAdmin();
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
    $('#inquiry-result').innerHTML = `<section class="success-panel"><span>✓</span><h2>Poptávka je připravena</h2><p>V prototypu se nikam neodeslala. Níže je formát připravený pro budoucí webhook / SMS službu.</p><pre>${esc(summary)}</pre><button class="button secondary" id="copy-summary" type="button">Kopírovat souhrn</button></section>`;
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
  $$('[data-path]').forEach(input => input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', () => {
    const value = input.type === 'checkbox' ? input.checked : input.type === 'number' ? Number(input.value) : input.value;
    setPath(state.data, input.dataset.path, value); persist();
  }));
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

function addItem(collection) {
  const id = `${collection}-${Date.now()}`;
  const templates = {
    products: { id, name: 'Nová položka', category: 'kola', description: 'Doplňte popis.', params: ['Doplňte parametr'], riderHeight: 'dle domluvy', price: 0, active: false, image: '' },
    accessories: { id, name: 'Nové příslušenství', note: 'Doplňte popis.', price: 0, active: false, image: '' },
    prices: { id, category: 'kola', label: 'Nová cena', day: 0, description: 'Doplňte popis.', active: false },
    delivery: { id, place: 'Nové místo', price: 'individuálně', active: false },
    trips: { id, name: 'Nový výlet', category: 'lehke', description: 'Doplňte popis.', distance: 'k ověření', time: 'k ověření', difficulty: 'Lehká', active: false, image: '' },
    gallery: { id, category: 'okoli', caption: 'Nová fotografie', image: '', active: false }
  };
  state.data[collection].push(templates[collection]);
}

window.addEventListener('hashchange', render);
render();
