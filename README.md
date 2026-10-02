# G2 · Redesign webu půjčovny kol

Lokální funkční prototyp sedmi veřejných stránek a jednoduché content-driven administrace.

## Spuštění

```powershell
npm start
```

Poté otevřete `http://127.0.0.1:4173/#/home`. Pokud je port obsazený, lze nastavit jiný přes `$env:PORT='4174'`.

## Prototype admin

Odkaz je v zápatí každé stránky. Demo heslo je `palava`. Jde jen o lokální demonstraci, ne produkční autentizaci.

Změny produktů, příslušenství, ceníku, dovozu, výletů, galerie, textů a kontaktu se ukládají do `localStorage` aktuálního prohlížeče. Data lze exportovat jako JSON nebo obnovit do výchozího stavu.

## Testy

```powershell
npm test
```

Formuláře nic neodesílají mimo zařízení. Poptávka vytváří pouze čitelný souhrn připravený pro pozdější webhook / SMS integraci.

## Netlify

- Produkční URL: https://pujcovna-pod-palavou.netlify.app/
- Site: `pujcovna-pod-palavou`
- Další deployment: `npm run build` a poté `npx netlify-cli deploy --prod --dir dist`
- Vlastní doména není připojena.

## GitHub Pages

GitHub Actions workflow `.github/workflows/pages.yml` při každé změně větve `main` spustí testy, vytvoří statický build a nasadí jej na GitHub Pages. Relativní cesty assetů a hash routing fungují i pod projektovým base path.
