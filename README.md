# G2 · Redesign webu půjčovny kol

Funkční prototyp sedmi veřejných stránek a content-driven administrace. Veřejná část používá jednotný responzivní design systém, výlety podporují GPS odkazy Mapy.cz a fotografie lze v Prototype Adminu nahrát ze zařízení.

## Spuštění

```powershell
npm start
```

Poté otevřete `http://127.0.0.1:4173/#/home`. Pokud je port obsazený, lze nastavit jiný přes `$env:PORT='4174'`.

## Prototype admin

Odkaz je v zápatí každé stránky. Demo heslo je `palava`. Jde jen o lokální demonstraci, ne produkční autentizaci.

Změny produktů, příslušenství, ceníku, dovozu, výletů, galerie, textů, kategorií a kontaktu se ukládají do `localStorage` aktuálního prohlížeče. Data lze exportovat jako JSON nebo obnovit do výchozího stavu. Upload obrázků přijímá PNG, JPEG, WebP a GIF do 2 MB; v prototypu se ukládají jako data URL.

Každý výlet má vlastní editovatelnou `mapyUrl`. Veřejné CTA otevírá konkrétní trasu v nové záložce. Kontaktní `mapUrl` řídí Google Maps CTA na homepage a stránce Kontakt.

## Testy

```powershell
npm test
```

Formuláře nic neodesílají mimo zařízení. Poptávka vytváří pouze čitelný souhrn připravený pro pozdější webhook / SMS integraci.

## GitHub Pages

GitHub Actions workflow `.github/workflows/pages.yml` při každé změně větve `main` spustí testy, vytvoří statický build a nasadí jej na GitHub Pages. Relativní cesty assetů a hash routing fungují i pod projektovým base path.

- Repo: https://github.com/Martin1Prchal/g2-pujcovna-pod-palavou
- Pages: https://martin1prchal.github.io/g2-pujcovna-pod-palavou/
