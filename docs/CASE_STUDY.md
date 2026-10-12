# Case study – G2: Půjčovna pod Pálavou

## 1. Project

- **Název:** G2 – Půjčovna pod Pálavou
- **Typ:** portfolio redesign concept; responzivní vícestránkový web půjčovny kol

## 2. Context

Projekt vznikl jako samostatně iniciovaný redesign scénáře lokální půjčovny kol. Původní veřejný web sloužil jako obsahová reference, nikoli jako tvrzení o placené klientské zakázce. Hlavní problém představovala potřeba zpřehlednit nabídku, ceník, výlety, galerii, kontakt a cestu k nezávazné poptávce.

## 3. Goal

- sjednotit informační architekturu sedmi veřejných částí,
- vytvořit přehledné kategorie a ceník,
- podpořit rozhodování pomocí výletů, galerie a praktických informací,
- ověřit editovatelný obsah a dynamickou poptávku,
- zachovat konzistenci coded prototypu, Figmy a Frameru.

## 4. My role

Informační architektura, UX/UI, responzivní coded prototyp, datový model, převod obrazovek a komponent do Figmy, Framer implementace, iterace a QA. AI/Codex byl využit jako podpůrný nástroj při implementaci, porovnávání variant, řešení responzivity a dokumentaci.

## 5. Process

1. Analýza obsahu a návrh struktury.
2. Funkční prototyp v HTML, CSS a JavaScriptu.
3. Iterace kategorií, ceníku, výletů, galerie, kontaktu a poptávky.
4. Převod sedmi desktopových a sedmi mobilních obrazovek do Figmy.
5. Navazující implementace a responzivní úpravy ve Frameru.
6. Automatické testy, vizuální QA a kontrola deploymentů.

## 6. Solution

Coded řešení používá hash routing a centrální datovou vrstvu pro sedm veřejných částí. Lokální Prototype Admin demonstruje úpravy obsahu bez kódu. Poptávka dynamicky reaguje na vybavení, počet jezdců, výšku a zvolený způsob převzetí, ale nic neposílá mimo zařízení.

## 7. Key features

- sedm veřejných rout a mobilní navigace,
- kategorie kol, příslušenství a ceník,
- výlety s externími Mapy.cz odkazy,
- galerie s filtrováním a přístupným lightboxem,
- kontaktní sekce s Google Maps,
- dynamická demonstrační poptávka,
- lokální správa obsahu, JSON export a upload náhledů.

## 8. Design / UX

Čistý světlý základ, výrazný červený akcent, čitelné sans-serif písmo a konzistentní karty udržují rozhraní praktické. Hero pracuje s krajinou Pálavy, CTA mají jasnou prioritu a mobilní layout skládá karty a formulář do dotykově použitelných bloků. Design nepředstírá ostrou rezervaci ani produkční administraci.

## 9. Tech stack

HTML5, CSS, JavaScript ES modules, Node.js, `node:test`, GitHub Actions, GitHub Pages, Figma a Framer.

## 10. Responsive approach

Coded web byl ověřen na desktopu, tabletu a mobilu včetně 1440, 820/768 a 390 px bez horizontálního overflow. Figma dokumentuje sedm obrazovek při 1440 px a sedm při 390 px. Mobilní filtry, karty, lightbox, mapa a formulář používají samostatné responzivní stavy.

## 11. Challenges

- udržet konzistenci mezi coded webem, Figmou a Framerem,
- odstranit mobilní overflow a zachovat čitelné zalamování,
- navrhnout dynamická pole poptávky bez produkčního backendu,
- demonstrovat správu obsahu bez předstírání bezpečného CMS,
- pracovat s externími fotografiemi a jejich budoucí licenční kontrolou.

## 12. What I learned

Coded prototyp může být účinným zdrojem pravdy pro pozdější designové a no-code nástroje. Projekt také ukázal, že demo administrace a formuláře musí mít stejně jasně popsané hranice jako jejich funkční možnosti.

## 13. Result

Dokončený portfolio projekt s 14 procházejícími testy, úspěšným buildem, ověřenou kanonickou GitHub Pages verzí, strukturovanou Figmou a publikovanou Framer variantou. Produkční backend, SMS a skutečná autentizace zůstávají záměrně mimo scope.

## 14. Links

- [Kanonická coded verze](https://martin1prchal.github.io/g2-pujcovna-pod-palavou/)
- [Framer live](https://capable-potential-559369.framer.app/)
- [GitHub](https://github.com/Martin1Prchal/g2-pujcovna-pod-palavou)
- [Figma](https://www.figma.com/design/tLXhGwJ40K68unlFzdd49D)
- [Původní web – obsahová reference](https://www.pujcovnapodpalavou.cz/)

## 15. Screenshot plan

1. **Desktop 1440 px:** homepage hero s hlavním CTA.
2. **Desktop:** přehled kategorií a benefitů.
3. **Desktop:** ceník se sjednocenou obsahovou osou.
4. **Desktop:** výlety s parametry a Mapy.cz CTA.
5. **Mobile 390 × 844:** otevřená navigace a kategorie.
6. **Mobile:** galerie s otevřeným lightboxem.
7. **Mobile:** poptávka se stavem jezdce nad 180 cm nebo s dovozem.
8. **Desktop:** Prototype Admin s ukázkou editovatelného obsahu; použít pouze demo data.
