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
  assert.match(app, /category-price/);
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
