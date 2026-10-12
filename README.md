# G2 – Půjčovna pod Pálavou

Portfolio redesign concept webu půjčovny kol na jižní Moravě. Projekt ověřuje přehlednou prezentaci nabídky, ceníku, výletů, galerie, kontaktu a nezávazné poptávky v responzivním coded prototypu, Figmě a navazující Framer implementaci.

## Live demo

- [Kanonická coded verze – GitHub Pages](https://martin1prchal.github.io/g2-pujcovna-pod-palavou/)
- [Publikovaná Framer verze](https://capable-potential-559369.framer.app/)
- [Figma](https://www.figma.com/design/tLXhGwJ40K68unlFzdd49D)

## Přehled projektu

Sedm veřejných částí pokrývá homepage, půjčovnu, ceník, výlety, galerii, kontakt a poptávku. Coded verze slouží jako funkční reference a obsahuje také lokální Prototype Admin pro demonstraci datově řízeného obsahu. Nejde o placenou klientskou realizaci ani produkční rezervační systém.

## Hlavní funkce

- responzivní navigace a sedm veřejných rout,
- nabídka obecných kategorií kol a příslušenství,
- ceník, výlety s Mapy.cz odkazy a kontaktní mapa,
- filtrovatelná galerie s klávesnicově ovladatelným lightboxem,
- demonstrační poptávka s dynamickými poli pro jezdce a dovoz,
- lokální Prototype Admin s `localStorage`, JSON exportem a náhledy obrázků,
- centrální datová vrstva pro obsah veřejného webu.

## Moje role

Informační architektura, UX/UI, responzivní coded prototyp, převod do Figmy, Framer implementace, iterace a QA. AI/Codex byl použit jako podpůrný nástroj pro implementaci, kontrolu konzistence, řešení responzivních problémů a dokumentaci.

## Technologie

HTML5, CSS, JavaScript ES modules, Node.js, `node:test`, GitHub Actions a GitHub Pages. Navazující design a publikovaná varianta používají Figma a Framer.

## Responzivní design

Veřejný web a hlavní interakce byly ověřeny na desktopu, tabletu a mobilu včetně 1440, 820/768 a 390 px. Figma obsahuje sedm desktopových a sedm mobilních obrazovek a samostatné interakční stavy.

## Lokální spuštění

Vyžaduje Node.js 20 nebo novější.

```sh
npm start
npm test
npm run build
```

Poté otevřete `http://127.0.0.1:4173/#/home`. Prototype Admin je dostupný ze zápatí a slouží pouze k lokální demonstraci; heslo `palava` není produkční autentizace.

## Stav projektu

Dokončený portfolio/demo projekt. Automatické testy, produkční build a smoke test kanonické GitHub Pages verze prošly. Formuláře nic neposílají mimo zařízení a Prototype Admin není produkční CMS. Podrobnosti jsou v [závěrečném auditu](docs/FINAL_AUDIT.md) a [case study](docs/CASE_STUDY.md).

## Odkazy

- [GitHub](https://github.com/Martin1Prchal/g2-pujcovna-pod-palavou)
- [Projektový handoff](07_HANDOFF.md)
- [QA](06_QA.md)
