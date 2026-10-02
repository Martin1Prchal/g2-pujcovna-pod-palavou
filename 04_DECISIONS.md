# Decisions

## Záznam rozhodnutí

### 2026-10-01 Lehký lokální prototyp bez frameworku

- Kontext: Prototyp má ověřit UX, obsahový model a správu, nikoliv produkční infrastrukturu.
- Rozhodnutí: Použít vanilla JavaScript SPA, CSS a jednoduchý Node server bez externích závislostí.
- Důvod: Rychlé spuštění, minimální závislosti, snadná přenositelnost a dostatečná funkcionalita.
- Dopady: Prototype admin používá pouze lokální úložiště prohlížeče; nejde o víceuživatelské CMS.

### 2026-10-01 Oddělená datová vrstva

- Kontext: Obsah nesmí být rozesetý v komponentách a má se později mapovat do Framer CMS.
- Rozhodnutí: Veškerý editovatelný obsah držet v normalizovaném objektu v `data.mjs`; UI pracuje se stejnými entitami.
- Důvod: Umožňuje testovat datový model i administraci bez backendu.
- Dopady: Změny adminu se ukládají do `localStorage`, lze je exportovat a obnovit.

### 2026-10-01 Ověřené vs. návrhové údaje

- Kontext: Zdrojový web potvrzuje kontakty, nabídku a část ceníku, ale ne přesné parametry všech návrhových tras.
- Rozhodnutí: Kontakty a základní nabídka vycházejí ze zdroje; výletové metriky jsou v datech označeny jako orientační.
- Důvod: Nevydávat neověřené údaje za skutečnost.
- Dopady: Před produkčním převodem je třeba trasy a ceny znovu potvrdit provozovatelem.

### 2026-10-02 Trvalý Netlify site pro prototyp

- Kontext: Uživatel požadoval samostatný produkční Netlify site bez zásahu do existujícího ostrého webu.
- Rozhodnutí: Nasadit statický build do site `pujcovna-pod-palavou` v týmu `prchalmartin2` a zachovat konfiguraci v `netlify.toml`.
- Důvod: Stabilní veřejná URL a možnost dalších production deploymentů stejného lokálně propojeného projektu.
- Dopady: Vlastní doména není připojena; ostrý web zůstává beze změny.

### 2026-10-02 Jednotný design systém a lineární SVG ikony

- Kontext: Veřejné stránky používaly smíšenou typografii a emoji ikony.
- Rozhodnutí: Použít jeden sans-serif font Inter, jednotnou hierarchii a vlastní malou sadu inline lineárních SVG ikon.
- Důvod: Konzistentní vzhled bez nové knihovny a bez závislosti na emoji vykreslení operačního systému.
- Dopady: Veškeré veřejné stránky i admin sdílejí stejné tokeny, radius, formuláře a responzivní breakpointy.

### 2026-10-02 Mapy.cz trasy a lokální upload obrázků

- Kontext: Každý výlet potřebuje vlastní GPS odkaz a administrátor musí spravovat fotografie bez kódu.
- Rozhodnutí: Rozšířit `data.mjs` o `mapyUrl`, delší popis a poměr povrchů; obrázky v prototypu ukládat pomocí `FileReader` jako data URL v `localStorage` s limitem 2 MB.
- Důvod: Funkční ověření administrační logiky bez backendu, připravené k mapování na Framer CMS/asset management.
- Dopady: Upload je lokální pro konkrétní prohlížeč; pro produkci je nutné použít trvalé CMS úložiště.
