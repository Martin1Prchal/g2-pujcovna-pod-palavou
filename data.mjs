export const STORAGE_KEY = 'g2-pujcovna-content-v1';

export const initialData = {
  meta: { version: 1, project: 'G2 · Redesign webu půjčovny kol' },
  brand: {
    name: 'Půjčovna jízdních kol pod Pálavou',
    shortName: 'Půjčovna pod Pálavou',
    logo: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001606-a2fa2a2fa5/700/1%20nov%C3%A9%20na%20web.webp?ph=a6234f4d0c',
    hero: 'https://www.palava.cz/templates/yootheme/cache/b5/palava-slide-03-b52d6fbd.jpeg',
    slogan: 'Na kolech za krásami jižní Moravy'
  },
  contact: {
    addressLines: ['Hlavní 50', 'Šakvice, 691 67'],
    address: 'Hlavní 50, Šakvice, 691 67',
    phones: ['+420 728 280 463', '+420 734 609 780'],
    email: 'pujcovnapodpalavou@gmail.com',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hlavn%C3%AD+50%2C+%C5%A0akvice',
    openingTitle: 'Březen – listopad',
    openingHours: '9:00–11:00 a 13:00–18:30',
    openingNote: 'Aktuální provoz doporučujeme ověřit telefonicky.'
  },
  pageText: {
    homeTitle: 'Půjčovna kol pod Pálavou',
    homeLead: 'Objevte krásy jižní Moravy ze sedla kola. Šakvice jsou ideální výchozí bod mezi vinohrady, jezery a historickými památkami.',
    rentalTitle: 'Naše kola a vybavení',
    rentalLead: 'Vyberte si z pravidelně servisovaných kol, elektrokol, dětských kol, koloběžek a příslušenství.',
    pricingTitle: 'Ceník půjčovny',
    pricingLead: 'Přehledné ceny bez automatické rezervace. Dostupnost a konečnou nabídku vždy potvrdíme osobně.',
    tripsTitle: 'Tipy na výlety',
    tripsLead: 'Inspirace pro výlety kolem Novomlýnských nádrží, Pálavy a Lednicko-valtického areálu.',
    galleryTitle: 'Galerie',
    galleryLead: 'Atmosféra výletů, krajina pod Pálavou a naše vybavení.',
    contactTitle: 'Kontakt',
    contactLead: 'Ozvěte se nám. Rádi poradíme s výběrem kola, trasou i praktickými detaily.',
    inquiryTitle: 'Poptávka',
    inquiryLead: 'Pošlete nezávaznou poptávku. Ozveme se s potvrzením a nabídkou co nejdříve.'
  },
  categories: [
    { id: 'kola', name: 'Kola', icon: '🚲', description: 'Spolehlivá kola pro výlety po okolí', active: true },
    { id: 'elektrokola', name: 'Elektrokola', icon: '⚡', description: 'Delší trasy s lehkostí', active: true },
    { id: 'detska-kola', name: 'Dětská kola', icon: '🌱', description: 'Pro malé cyklisty', active: true },
    { id: 'kolobezky', name: 'Koloběžky', icon: '🛴', description: 'Zábava pro děti i dospělé', active: true },
    { id: 'prislusenstvi', name: 'Příslušenství', icon: '◉', description: 'Vše potřebné na cestu', active: true }
  ],
  products: [
    { id: 'author-classic', name: 'Author Classic', category: 'kola', description: 'Krosové kolo pro pohodové výlety.', params: ['Velikost dle domluvy', 'Pravidelný servis'], riderHeight: '155–195 cm', price: 500, active: true, image: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001496-d0ba9d0bac/Author%20Classic%202022.webp?ph=a6234f4d0c' },
    { id: 'kross-evado', name: 'Kross Evado', category: 'kola', description: 'Univerzální trekové kolo.', params: ['Krosové provedení', 'Velikost dle domluvy'], riderHeight: '155–195 cm', price: 500, active: true, image: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001089-118fe11900/18092-1_panske-kolo-kross-evao-3-0-3.jpg?ph=a6234f4d0c' },
    { id: 'pells-thorr-2', name: 'PELLS Thorr 2', category: 'elektrokola', description: 'Elektrokolo na delší trasy.', params: ['Motor Bafang M400', 'Baterie 630 Wh', 'Uváděný dojezd 120–150 km'], riderHeight: '160–195 cm', price: 900, active: true, image: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001563-e4c22e4c24/pells-thorr-2-er.jpeg?ph=a6234f4d0c' },
    { id: 'pells-panasonic', name: 'PELLS Thorr Panasonic 2', category: 'elektrokola', description: 'Výkonné elektrokolo s dlouhým dojezdem.', params: ['Motor Panasonic GX Ultimate', 'Baterie 720 Wh', 'Uváděný dojezd 140–170 km'], riderHeight: '160–195 cm', price: 900, active: true, image: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001617-4d2914d293/PELLS%20THORR%20PANASONIC%202.jpeg?ph=a6234f4d0c' },
    { id: 'ctm-roxxy', name: 'CTM Roxxy GX', category: 'elektrokola', description: 'Pohodlné elektrokolo pro celodenní výlet.', params: ['Motor Panasonic GX Power Plus', 'Baterie 720 Wh'], riderHeight: '155–185 cm', price: 900, active: true, image: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001619-6004d6004f/ROXXY%20GX.png?ph=a6234f4d0c' },
    { id: 'detske-author', name: 'Dětské kolo Author', category: 'detska-kola', description: 'Dětská kola v různých velikostech.', params: ['Přesný model a velikost na dotaz'], riderHeight: 'dle domluvy', price: 430, active: true, image: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001498-8d8398d83a/Author%20Integra%202022.webp?ph=a6234f4d0c' },
    { id: 'kostka-tour', name: 'Kostka Tour Max', category: 'kolobezky', description: 'Koloběžka s blatníky pro výlety po okolí.', params: ['Velikost a dostupnost na dotaz'], riderHeight: 'pro dospělé', price: 400, active: true, image: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001115-7e6667e686/kolobezka-kostka-tour-max-g6%20%282%29.jpg?ph=a6234f4d0c' },
    { id: 'kostka-kid', name: 'Kostka Kid Mini', category: 'kolobezky', description: 'Lehká koloběžka pro děti.', params: ['Vhodnost ověříme podle věku a výšky'], riderHeight: 'pro děti', price: 400, active: true, image: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001099-1f61a1f61c/KOSTKA%20KID%20MINI%202%20a-2.PNG?ph=a6234f4d0c' }
  ],
  accessories: [
    { id: 'helma', name: 'Helma', price: 0, note: 'K zapůjčenému kolu zdarma', active: true, image: 'https://images.unsplash.com/photo-1557803175-2f2e744e83c4?auto=format&fit=crop&w=500&q=80' },
    { id: 'zamek', name: 'Zámek', price: 0, note: 'K zapůjčenému kolu zdarma', active: true, image: 'https://images.unsplash.com/photo-1583227122027-d2d360c66d3c?auto=format&fit=crop&w=500&q=80' },
    { id: 'sedacka', name: 'Dětská sedačka', price: 100, note: 'Pro děti do 22 kg', active: true, image: 'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&w=500&q=80' },
    { id: 'rukavice', name: 'Cyklistické rukavice', price: 30, note: 'Doplňkové vybavení', active: true, image: 'https://images.unsplash.com/photo-1529422643029-d4585747aaf2?auto=format&fit=crop&w=500&q=80' },
    { id: 'gel', name: 'Gelový potah', price: 30, note: 'Doplňkové vybavení', active: true, image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=500&q=80' }
  ],
  prices: [
    { id: 'p1', category: 'kola', label: 'Jízdní kolo', day: 500, description: 'Cena za jeden den', active: true },
    { id: 'p2', category: 'elektrokola', label: 'Elektrokolo', day: 900, description: 'Cena za jeden den', active: true },
    { id: 'p3', category: 'detska-kola', label: 'Dětské kolo', day: 430, description: 'Cena za jeden den', active: true },
    { id: 'p4', category: 'kolobezky', label: 'Koloběžka', day: 400, description: 'Cena za jeden den', active: true }
  ],
  delivery: [
    { id: 'd1', place: 'Předem domluvené místo', price: 'individuálně', active: true }
  ],
  trips: [
    { id: 't1', name: 'Novomlýnské nádrže', category: 'lehke', description: 'Výlet ze Šakvic k vodě a výhledům na Pálavu.', distance: 'orientačně 12 km', time: '1–2 hod', difficulty: 'Lehká', active: true, image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85' },
    { id: 't2', name: 'Pavlov a Pálava', category: 'vyhledy', description: 'Vinařské obce, krajina a zastávky podle vlastního tempa.', distance: 'dle zvolené trasy', time: 'půlden', difficulty: 'Střední', active: true, image: 'https://www.palava.cz/templates/yootheme/cache/b5/palava-slide-03-b52d6fbd.jpeg' },
    { id: 't3', name: 'Lednicko-valtický areál', category: 'pamatky', description: 'Celodenní inspirace za krajinou a památkami.', distance: 'dle zvolené trasy', time: 'celý den', difficulty: 'Střední', active: true, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85' },
    { id: 't4', name: 'Vinařské obce pod Pálavou', category: 'vinarske', description: 'Pohodová jízda mezi vinicemi a obcemi jižní Moravy.', distance: 'orientační', time: '2–4 hod', difficulty: 'Lehká', active: true, image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=85' }
  ],
  gallery: [
    { id: 'g1', category: 'pujcovna', caption: 'Kola připravená na cestu', image: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001116-d829ad829d/Ani%C4%8Dka%2CMaruna%2CPatrik%2CRomana.jpg?ph=a6234f4d0c', active: true },
    { id: 'g2', category: 'okoli', caption: 'Krajina pod Pálavou', image: 'https://www.palava.cz/templates/yootheme/cache/b5/palava-slide-03-b52d6fbd.jpeg', active: true },
    { id: 'g3', category: 'kola', caption: 'Výlet na dvou kolech', image: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001117-735e0735e3/2018-5%20P%C5%99ibylov%C3%A1%201.jpg?ph=a6234f4d0c', active: true },
    { id: 'g4', category: 'kola', caption: 'Společně na výletě', image: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001104-763977639a/17.6.2017%20rozlou%C4%8Den%C3%AD%20se%20svobodou%2C%20obj.%20Aneta%20%C4%8Capkov%C3%A1-%C4%8Cern%C3%A1%2C%20tel.%20737%20541%20533%20%282%29%20%E2%80%93%20kopie%20zmen%C5%A1.jpg?ph=a6234f4d0c', active: true },
    { id: 'g5', category: 'okoli', caption: 'Jižní Morava', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=85', active: true },
    { id: 'g6', category: 'pujcovna', caption: 'Zázemí půjčovny', image: 'https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001108-24c2e24c31/2018-5%20Rezkov%C3%A11.jpg?ph=a6234f4d0c', active: true }
  ]
};

export function cloneData(data = initialData) {
  return JSON.parse(JSON.stringify(data));
}

