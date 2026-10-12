# Finální audit projektu G2

Datum auditu: 12. října 2026

## Rozsah

Audit zahrnul strukturu repozitáře, Git stav, HTML/CSS/JavaScript, hash routing, centrální data, Prototype Admin, poptávku, build a testovací skripty, metadata, Figma podklady, responzivitu a veřejné deploymenty.

## Provedené úpravy

- Technický název balíčku byl sjednocen na `g2-pujcovna-pod-palavou`.
- Doplněny canonical, robots, theme color a Open Graph/Twitter metadata.
- README bylo sjednoceno s prezentačním standardem G1 a G3.
- Doplněn jednotný case-study podklad a tento finální audit.
- Zachovány a začleněny existující dokumentační změny k Framer ceníku a jeho 1180px desktopové ose.

## Ověření

- `npm test` – 14/14 testů prošlo.
- `npm run build` – statický produkční build prošel.
- `node --check` – JavaScript, ES modules a lokální server bez syntaktických chyb.
- GitHub Pages načetly všech sedm veřejných rout; hlavní navigace a lightbox fungují.
- Viewporty 1440 × 1000, 820 × 1000 a 390 × 844 neměly horizontální overflow.
- Mobilní navigace se otevřela se správným `aria-expanded`; lightbox přesunul focus na zavírací tlačítko.
- Konzole kanonické produkce neobsahovala chyby ani varování.
- Figma obsahuje Cover, Foundations, Components, sedm desktopových a sedm mobilních obrazovek včetně interakčních stavů.
- Nebyly nalezeny sledované env soubory ani zjevné secrets.

## Deploymenty

- **Kanonická coded verze:** https://martin1prchal.github.io/g2-pujcovna-pod-palavou/
- **Publikovaná Framer verze:** https://capable-potential-559369.framer.app/
- **Starší Netlify verze:** https://pujcovna-pod-palavou.netlify.app/
- **Historický Firebase URL:** https://pujcovna-pod-palavou.web.app/

GitHub Pages odpovídají aktuálnímu `main` a jsou kanonickou coded verzí. Netlify obsahuje starší variantu. Firebase zobrazuje pouze historický placeholder. Žádný funkční deployment nebyl odstraněn.

## Známá omezení

- Poptávka a Prototype Admin jsou lokální demo bez produkčního backendu, SMS a autentizace.
- Výletové vzdálenosti, časy a trasové body musí před reálným použitím potvrdit provozovatel.
- Externí fotografie vyžadují před produkčním použitím licenční kontrolu a přesun do cílového CMS.
- Framer linter eviduje existující překryv pomocného CMS ground node; nejde o chybu coded webu.
- V repozitáři zůstává dříve sledovaný archiv `G2-final-backup.zip`; nebyl měněn ani mazán.

## Výsledek

Audit: **PASS**. Projekt je technicky i prezentačně připravený pro navazující portfolio fázi.
