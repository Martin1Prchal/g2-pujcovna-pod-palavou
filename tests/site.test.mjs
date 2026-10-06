import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initialData } from '../data.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const docs = ['00_PROJECT_INDEX.md', '04_DECISIONS.md', '07_HANDOFF.md', 'README.md']
  .map(file => fs.readFileSync(path.join(root, file), 'utf8'))
  .join('\n');

test('sedm veřejných stránek je v routeru', () => {
  for (const route of ['home','pujcovna','cenik','vylety','galerie','kontakt','poptavka']) {
    assert.match(app, new RegExp(`['\"]${route}['\"]`));
  }
});

test('datový model obsahuje editovatelné kolekce', () => {
  for (const key of ['products','categories','accessories','prices','trips','gallery','benefits','included','pageText','uiText','contactContent','contact']) {
    assert.ok(initialData[key], `Chybí ${key}`);
  }
  assert.ok(initialData.products.length >= 4);
  assert.ok(initialData.trips.length >= 3);
  assert.ok(initialData.gallery.length >= 4);
});

test('výlety mají datově řízenou GPS trasu a rozšířený obsah', () => {
  for (const trip of initialData.trips) {
    assert.match(trip.mapyUrl, /^https:\/\/(?:www\.)?mapy\.(?:cz|com)\//);
    assert.ok(trip.longDescription);
    assert.ok(trip.roadRatio);
    assert.ok(trip.distance);
    assert.ok(trip.time);
  }
  assert.match(app, /target="_blank"/);
  assert.match(app, /state\.data\.uiText\.mapyCta/);
  assert.match(app, /endsWith\('mapyUrl'\)/);
});

test('admin podporuje upload fotografií a editaci obsahu bez kódu', () => {
  assert.match(app, /type="file"/);
  assert.match(app, /FileReader/);
  assert.match(app, /data-image-upload/);
  assert.match(app, /imageAdminField/);
  assert.match(app, /adminCollection\('categories'/);
  assert.match(app, /\['products','Produkty'\]/);
  assert.match(app, /\['contact','Kontakty'\]/);
});

test('homepage prezentuje kategorie a nevrací vybrané modely', () => {
  assert.equal(initialData.uiText.homeCategoriesTitle, 'Kola pro každý výlet');
  assert.doesNotMatch(app, /Vybraná kola z půjčovny/);
  assert.doesNotMatch(app.match(/function categoryCards\(\)[\s\S]*?function productCard/)?.[0] || '', /category-price|money\(/);
  assert.match(app, /class="home-hero-image"/);
  assert.match(app.match(/function categoryCards\(\)[\s\S]*?function productCard/)?.[0] || '', /href="#\/pujcovna"/);
  assert.doesNotMatch(app.match(/function categoryCards\(\)[\s\S]*?function productCard/)?.[0] || '', /\?filter=/);
  assert.match(app.match(/function contactBand\(\)[\s\S]*?function ctaBand/)?.[0] || '', /googleMapEmbed\(\)/);
});

test('veřejný web neobsahuje označení prototypu a dokumentace nezmiňuje nepoužívaný hosting', () => {
  assert.doesNotMatch(app, /G2 funkční prototyp|Prototype admin|V prototypu/i);
  assert.doesNotMatch(html.match(/<meta name="description"[^>]+>/)?.[0] || '', /prototyp|demo|G2/i);
  assert.doesNotMatch(app.match(/function contactPage\(\)[\s\S]*?function contactBand/)?.[0] || '', /prototyp|form-note/i);
  assert.doesNotMatch(docs, new RegExp(['net', 'lify'].join(''), 'i'));
  assert.equal(fs.existsSync(path.join(root, ['net', 'lify.toml'].join(''))), false);
  assert.doesNotMatch(app.match(/function render\(\)[\s\S]*?function bindEvents/)?.[0] || '', /URLSearchParams|params\.get\('filter'\)/);
});

test('homepage a kontakt používají responzivní Google Maps embed', () => {
  assert.match(app, /https:\/\/www\.google\.com\/maps\?q=/);
  assert.match(app, /output=embed/);
  assert.equal((app.match(/googleMapEmbed\(\)/g) || []).length, 3);
  assert.match(app, /loading="lazy"/);
  assert.match(css, /\.map-embed iframe[^}]*width:\s*100%[^}]*height:\s*100%/);
});

test('galerie otevírá obrázky v ovladatelném lightboxu', () => {
  assert.match(app, /id="gallery-lightbox"/);
  assert.match(app, /data-lightbox-index/);
  assert.match(app, /event\.key === 'Escape'/);
  assert.match(app, /event\.key === 'ArrowLeft'/);
  assert.match(app, /event\.key === 'ArrowRight'/);
  assert.match(css, /\.lightbox\s*\{[^}]*position:\s*fixed[^}]*inset:\s*0/);
  assert.match(css, /\.lightbox-content img\s*\{[^}]*object-fit:\s*contain/);
});

test('půjčovna zobrazuje obecné kategorie místo jednotlivých modelů', () => {
  const rental = app.match(/function rentalPage\(\)[\s\S]*?function accessoryCard/)?.[0] || '';
  assert.match(rental, /rental-category-grid/);
  assert.match(rental, /prices\.find/);
  assert.doesNotMatch(rental, /productCard\(/);
  assert.ok(initialData.categories.filter(item => ['kola','elektrokola','detska-kola','kolobezky'].includes(item.id)).every(item => item.image));
});

test('obrázky příslušenství jsou celé viditelné bez ořezu a deformace', () => {
  const imageRule = css.match(/\.accessory-card img\s*\{[^}]+\}/)?.[0] || '';
  assert.match(imageRule, /object-fit:\s*contain/);
  assert.match(imageRule, /object-position:\s*center/);
  assert.doesNotMatch(imageRule, /object-fit:\s*cover/);
});

test('ve viditelném UI nejsou emoji ikony', () => {
  assert.doesNotMatch(app, /[🚲⚡🌱📍🛴🔒☎✉🚗🔧ⓘ]/u);
  assert.doesNotMatch(JSON.stringify(initialData), /[🚲⚡🌱📍🛴🔒☎✉🚗🔧ⓘ]/u);
  assert.match(app, /function svgIcon/);
});

test('kontaktní údaje odpovídají zadání', () => {
  assert.deepEqual(initialData.contact.phones, ['+420 728 280 463', '+420 734 609 780']);
  assert.equal(initialData.contact.email, 'pujcovnapodpalavou@gmail.com');
  assert.match(initialData.contact.address, /Hlavní 50/);
});

test('poptávka obsahuje požadovaná podmíněná pravidla', () => {
  assert.match(app, /height >= 180/);
  assert.match(app, /dateFrom/);
  assert.match(app, /deliveryPlace/);
  assert.match(app, /createSmsSummary/);
  assert.match(app, /Rezervace je platná až po potvrzení půjčovnou/);
});

test('stránka má metadata, responzivní CSS a skip link', () => {
  assert.match(html, /name="viewport"/);
  assert.match(html, /class="skip-link"/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /prefers-reduced-motion/);
});
