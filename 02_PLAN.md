# Plan

## Forma řešení
Lokální content-driven prototyp jako lehká SPA s hash routingem a lokální administrací.

## Technologie a nástroje
Sémantické HTML, moderní CSS, vanilla JavaScript, Node.js bez externích runtime závislostí.

## Architektura / struktura
`data.mjs` je výchozí datová vrstva; veřejné stránky i admin čtou stejný stav. Změny adminu se ukládají do `localStorage` a lze je exportovat/importovat jako JSON.

## Hlavní fáze
1. Projekt a dokumentace
2. Design system a datový model
3. Veřejné stránky a interakce
4. Prototype admin
5. Responzivita a QA

## Pořadí realizace
Sdílený shell → obsahové renderery → formulář → admin → automatické a vizuální testy.

