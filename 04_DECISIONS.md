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

### 2026-10-05 Responzivní homepage hero

- Kontext: Hero fotografie musí být vždy celá, bez ořezu a deformace.
- Rozhodnutí: Na homepage použít běžný `<img>` s `width: 100%`, `height: auto` a `object-fit: contain`; na mobilu umístit text pod fotografii.
- Důvod: Poměr stran zůstává zachovaný na všech běžných šířkách.
- Dopady: Výška desktopového hero přirozeně vychází z poměru stran zdrojového obrázku; navazující sekce nemá negativní margin ani překrytí.

### 2026-10-05 Zjednodušení kategorií a kontaktu na homepage

- Rozhodnutí: Z kategorií odstranit ceny a ponechat pouze název, popis a větší obrázek. Kontaktní část tvoří jediný blok s vloženou Google mapou a CTA.
- Důvod: Homepage má sloužit jako přehled kategorií; detail cen zůstává v ceníku. Kontakt současně ukazuje přesnou polohu půjčovny.

### 2026-10-05 Verzování a hosting

- Rozhodnutí: Zdrojový kód spravovat v existujícím GitHub repozitáři a větev `main` automaticky publikovat přes GitHub Pages.
- Důvod: Jeden konzistentní workflow pro verzování, kontrolu a veřejný náhled před převodem do Figmy a Frameru.

### 2026-10-05 Veřejná Půjčovna bez inventárních modelů

- Kontext: Zákazník vybírá typ vybavení, nikoliv konkrétní značku nebo fyzický kus.
- Rozhodnutí: Veřejná Půjčovna zobrazuje čtyři obecné kategorie a obecné příslušenství; konkrétní produkty zůstávají pouze v datové a administrační vrstvě.
- Důvod: Kratší a srozumitelnější nabídka odpovídající skutečnému procesu poptávky.
- Dopady: Cena kategorie se načítá z `prices`, fotografie a popis z `categories`; vše zůstává řaditelné a editovatelné v adminu.
