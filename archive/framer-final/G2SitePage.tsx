import * as React from "react"
import { addPropertyControls, ControlType, Link } from "framer"

type Page = "home" | "rental" | "pricing" | "trips" | "gallery" | "contact"
type Mode =
    | "page"
    | "collector"
    | "footer"
    | "header"
    | "benefits"
    | "contactBand"
    | "contactContent"
    | "notice"
    | "included"
    | "cta"
    | "tripLead"
    | "tripNotice"
    | "homeHeading"
type Kind = "category" | "accessory" | "trip" | "gallery" | "site"
type NavigationMode = "desktop" | "compact"
type Item = Record<string, any>
interface Props {
    page: Page
    mode: Mode
    kind: Kind
    navigationMode?: NavigationMode
    hideFooter?: boolean
    showPrice?: boolean
    categoryVariant?: "rental" | "pricing"
    accessoryVariant?: "rental" | "pricing"
    homeStrict?: boolean
    headingType?: "categories" | "trips" | "gallery"
    itemId?: string
    name?: string
    description?: string
    image?: any
    price?: number
    active?: boolean
    order?: number
    isMain?: boolean
    note?: string
    category?: string
    distance?: string
    time?: string
    difficulty?: string
    roadRatio?: string
    mapUrl?: string
    featured?: boolean
    caption?: string
    alt?: string
    address?: string
    phone1?: string
    phone2?: string
    email?: string
    openingPeriod?: string
    openingHours?: string
    openingNote?: string
    ctaText?: string
}

const buckets: Record<Kind, Map<string, Map<string, Item>>> = {
    category: new Map(),
    accessory: new Map(),
    trip: new Map(),
    gallery: new Map(),
    site: new Map(),
}
const listeners = new Set<() => void>()
function emit() {
    listeners.forEach((fn) => fn())
}
function register(kind: Kind, key: string, instance: string, item: Item) {
    if (!buckets[kind].has(key)) buckets[kind].set(key, new Map())
    buckets[kind].get(key)!.set(instance, item)
    emit()
    return () => {
        const group = buckets[kind].get(key)
        group?.delete(instance)
        if (!group?.size) buckets[kind].delete(key)
        emit()
    }
}
function snapshot(kind: Kind) {
    return Array.from(buckets[kind].values())
        .map((group) => {
            const values = Array.from(group.values())
            return values[values.length - 1]!
        })
        .sort((a, b) => (a.order || 0) - (b.order || 0))
}
function useCms(kind: Kind) {
    const [, tick] = React.useState(0)
    React.useEffect(() => {
        const fn = () => tick((v) => v + 1)
        listeners.add(fn)
        return () => {
            listeners.delete(fn)
        }
    }, [])
    return snapshot(kind)
}
function imageSrc(image: any) {
    return typeof image === "string" ? image : image?.src || image?.url || ""
}
function label(value: string = "") {
    const map: Record<string, string> = {
        lehke: "Lehké",
        vinarske: "Vinařské",
        vyhledy: "Výhledy",
        pamatky: "Památky",
        kola: "Kola",
        okoli: "Okolí",
        pujcovna: "Půjčovna",
    }
    return map[value] || value
}

const heroFallback =
    "https://www.palava.cz/templates/yootheme/cache/b5/palava-slide-03-b52d6fbd.jpeg"
const logo =
    "https://a6234f4d0c.clvaw-cdnwnd.com/823d9c839767ddafdae502964a71cea7/200001606-a2fa2a2fa5/700/1%20nov%C3%A9%20na%20web.webp?ph=a6234f4d0c"
const pageCopy: Record<Page, { title: string; lead: string }> = {
    home: {
        title: "Půjčovna kol pod Pálavou",
        lead: "Objevte krásy jižní Moravy ze sedla kola. Šakvice jsou ideální výchozí bod mezi vinohrady, jezery a historickými památkami.",
    },
    rental: {
        title: "Naše kola a vybavení",
        lead: "Vyberte si z pravidelně servisovaných kol, elektrokol, dětských kol, koloběžek a příslušenství.",
    },
    pricing: {
        title: "Ceník půjčovny",
        lead: "Přehledné ceny bez automatické rezervace. Dostupnost a konečnou nabídku vždy potvrdíme osobně.",
    },
    trips: {
        title: "Tipy na výlety",
        lead: "Inspirace pro výlety kolem Novomlýnských nádrží, Pálavy a Lednicko-valtického areálu.",
    },
    gallery: {
        title: "Galerie",
        lead: "Atmosféra výletů, krajina pod Pálavou a naše vybavení.",
    },
    contact: {
        title: "Kontakt",
        lead: "Ozvěte se nám. Rádi poradíme s výběrem kola, trasou i praktickými detaily.",
    },
}
const routes = [
    ["Domů", "/"],
    ["Půjčovna", "/pujcovna"],
    ["Ceník", "/cenik"],
    ["Výlety", "/vylety"],
    ["Galerie", "/galerie"],
    ["Kontakt", "/kontakt"],
    ["Poptávka", "/poptavka"],
]

const css = String.raw`
.g2{--ink:#192334;--muted:#697181;--cream:#f5f1e9;--paper:#fffdfa;--red:#b93f36;--red2:#96332c;--soft:#f8e8e4;--line:#e7e0d7;font-family:Inter,Arial,sans-serif;color:var(--ink);background:var(--cream);width:100%;min-height:100%;position:relative;overflow:hidden}.g2 *{box-sizing:border-box}.g2 a{color:inherit;text-decoration:none}.g2 img{display:block}.g2 button,.g2 input,.g2 textarea{font:inherit}.g2 :focus-visible{outline:3px solid #d8a09a;outline-offset:3px}.wrap{width:min(1180px,calc(100% - 40px));margin:auto}.nav{position:relative;z-index:20;background:rgba(255,253,250,.96);border-bottom:1px solid var(--line)}.navin{min-height:86px;display:flex;align-items:center;gap:20px}.logo{width:188px;height:62px;object-fit:contain}.links{margin-left:auto;display:flex;align-items:center;gap:4px}.links a{padding:10px;border-radius:10px;font-size:14px;font-weight:650}.links a:hover{background:var(--soft);color:var(--red)}.cta,.btn{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 20px;border:1px solid transparent;border-radius:12px;background:var(--red);color:white!important;font-weight:700;cursor:pointer}.cta:hover,.btn:hover{background:var(--red2)}.menu{display:none;margin-left:auto;border:1px solid var(--line);border-radius:12px;background:white;width:46px;height:46px}.mobilelinks{display:none;padding:8px 20px 20px}.mobilelinks.open{display:grid}.mobilelinks a{padding:13px 8px;border-bottom:1px solid var(--line)}.hero{position:relative;background:#f2eadf;display:grid;overflow:hidden}.hero img{grid-area:1/1;width:100%;height:auto;object-fit:contain;align-self:center}.shade{grid-area:1/1;z-index:1;background:linear-gradient(90deg,rgba(255,250,239,.98),rgba(255,250,239,.78) 40%,rgba(255,250,239,.05) 78%)}.heroText{grid-area:1/1;z-index:2;padding:72px 0 96px}.heroText>div{max-width:650px}.eyebrow{text-transform:uppercase;letter-spacing:.15em;color:var(--red);font-size:13px;font-weight:800}.hero h1{font-size:clamp(42px,5vw,68px);line-height:1.03;letter-spacing:-.045em;margin:14px 0 20px}.hero p{font-size:18px;line-height:1.55;color:var(--muted)}.heroActions{display:flex;gap:12px;margin-top:26px}.btn.secondary{background:white;color:var(--red)!important;border-color:#d8a09a}.section{padding:72px 0}.section.soft{background:#fbf7f1}.head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:26px}.head h2{font-size:clamp(30px,4vw,44px);letter-spacing:-.035em;margin:0}.head p{color:var(--muted);max-width:620px}.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.card{background:var(--paper);border:1px solid var(--line);border-radius:18px;overflow:hidden}.cardbody{padding:20px}.card h3{font-size:21px;margin:0 0 8px}.card p{color:var(--muted);line-height:1.55}.fit{width:100%;height:180px;object-fit:contain;background:white;padding:14px}.price{color:var(--red);font-size:20px;font-weight:800}.benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.benefit{padding:24px}.icon{width:46px;height:46px;display:grid;place-items:center;border-radius:50%;background:var(--red);color:white;font-weight:800;margin-bottom:14px}.tripgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:18px}.trip img{width:100%;height:230px;object-fit:cover}.meta{display:flex;gap:12px;flex-wrap:wrap;font-size:13px;color:var(--muted)}.filters{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:24px}.filters button{min-height:44px;padding:0 18px;border:1px solid var(--line);border-radius:999px;background:white;cursor:pointer}.filters button.active{background:var(--red);border-color:var(--red);color:white}.gallerygrid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.galleryitem{position:relative;border:0;padding:0;background:none;border-radius:16px;overflow:hidden;cursor:zoom-in}.galleryitem img{width:100%;height:260px;object-fit:cover}.galleryitem span{position:absolute;inset:auto 0 0;padding:34px 14px 14px;background:linear-gradient(transparent,rgba(0,0,0,.72));color:white;text-align:left}.lightbox{position:fixed;inset:0;z-index:1000;background:rgba(8,12,18,.94);display:grid;place-items:center;padding:70px}.lightbox figure{margin:0;max-width:90vw;max-height:85vh;color:white;text-align:center}.lightbox img{max-width:90vw;max-height:76vh;width:auto;height:auto;object-fit:contain;border-radius:10px}.lightbox figcaption{padding-top:12px;font-size:16px;line-height:1.45}.lightbox figcaption small{display:block;margin-top:4px;color:rgba(255,255,255,.72);font-size:13px}.close,.prev,.next{position:fixed;z-index:2;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.14);color:white;border-radius:50%;width:48px;height:48px;font-size:26px;cursor:pointer}.close:hover,.prev:hover,.next:hover{background:rgba(255,255,255,.24)}.close:disabled,.prev:disabled,.next:disabled{opacity:.35;cursor:default}.close{right:20px;top:20px}.prev{left:20px;top:50%}.next{right:20px;top:50%}.contactgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.contactcard{padding:24px;display:grid;align-content:start;gap:8px}.map{grid-column:span 2;min-height:360px}.map iframe{width:100%;height:100%;min-height:360px;border:0}.notice{padding:16px;border-radius:13px;background:var(--soft);color:#8d352e}.footer{border-top:1px solid var(--line);background:var(--paper);padding:32px 0}.foot{display:grid;grid-template-columns:auto 1fr auto;gap:28px;align-items:center}.foot img{width:150px}.foot nav{display:flex;justify-content:center;gap:15px;flex-wrap:wrap;font-size:13px}.admin{font-size:12px;color:var(--muted)}.cms-empty{padding:24px;border:1px dashed #cbbfb1;border-radius:16px;color:var(--muted);background:rgba(255,255,255,.45)}
.nav.nav-compact .links,.nav.nav-compact .navin>.cta{display:none}.nav.nav-compact .menu{display:block}
@media(max-width:809px){.links,.navin>.cta{display:none}.menu{display:block}.grid4{grid-template-columns:repeat(2,1fr)}.benefits{grid-template-columns:1fr}.tripgrid{grid-template-columns:1fr}.contactgrid{grid-template-columns:1fr}.map{grid-column:auto}.gallerygrid{grid-template-columns:repeat(2,1fr)}.foot{grid-template-columns:1fr;text-align:center}.foot img{margin:auto}}
@media(max-width:767px){.wrap{width:min(100% - 28px,1180px)}.navin{min-height:72px}.logo{width:154px;height:52px}.heroText{padding:48px 0 58px}.shade{background:linear-gradient(90deg,rgba(255,250,239,.97),rgba(255,250,239,.72))}.hero h1{font-size:40px}.hero p{font-size:16px}.heroActions{flex-direction:column;align-items:stretch}.section{padding:48px 0}.head{display:block}.grid4,.gallerygrid{grid-template-columns:1fr}.trip img,.galleryitem img{height:220px}.lightbox{padding:68px 16px}.prev{left:8px}.next{right:8px}.foot nav{display:grid}.contactgrid{gap:12px}}
/* Desktop parity with coded reference */
.g2{--red-dark:#9f2d28;--red-soft:#fae9e3;--olive:#536039;--shadow:0 18px 48px rgba(49,38,22,.1);background:radial-gradient(circle at 50% 0,#fff 0,var(--cream) 80%);font-size:16px;line-height:1.5}
.g2 h1,.g2 h2,.g2 h3,.g2 p{margin-top:0}.g2 h1,.g2 h2,.g2 h3{letter-spacing:-.035em;color:#111}.g2 h2{font-size:clamp(30px,3.5vw,48px);line-height:1.08;font-weight:650;margin-bottom:12px}.g2 h3{font-size:19px;line-height:1.22;font-weight:650;margin-bottom:8px}
.nav{position:sticky;top:0;z-index:40;background:rgba(255,253,250,.93);backdrop-filter:blur(14px);border-bottom:1px solid rgba(231,224,215,.7)}.navin{height:86px;gap:28px}.links{gap:8px}.links a{padding:10px 12px;font-size:15px;font-weight:600}.cta,.btn{min-height:48px;padding:0 24px;border-radius:12px;font-weight:650;background:linear-gradient(135deg,#c55348,var(--red-dark));box-shadow:0 9px 20px rgba(185,63,54,.2)}.navin>.cta{min-width:140px}.btn.secondary{background:rgba(255,255,255,.92);border-color:#d97870;box-shadow:none}
.hero{min-height:340px;align-items:center;background:#f6efe5}.hero::after{content:"";position:absolute;inset:auto 0 0;height:90px;background:linear-gradient(transparent,rgba(255,253,250,.95));z-index:1;pointer-events:none}.heroText{padding:70px 0 110px}.heroText>div{max-width:650px}.hero h1{font-size:clamp(45px,6vw,80px);line-height:1.02;font-weight:650;margin:14px 0 22px}.hero p{max-width:590px;font-size:19px}.pageHero .heroText{padding:60px 0 80px}.pageHero h1{font-size:clamp(43px,5vw,70px)}.pageHero .heroText{display:flex;align-items:center;justify-content:space-between}.handnote{width:210px;transform:rotate(-4deg);color:#202719;font-family:"Segoe Print",cursive;font-size:23px;line-height:1.25;text-align:center}.eyebrow{letter-spacing:.18em;font-size:12.5px;font-weight:700;margin-bottom:10px}
.section{padding:72px 0}.head{align-items:flex-end;margin-bottom:26px}.head h2{font-size:clamp(30px,3.5vw,48px)}.head>a{color:var(--red);font-weight:700}.grid4{gap:14px}.categorygrid .card{display:flex;flex-direction:column;min-height:315px;padding:22px;background:rgba(255,253,250,.97);border-radius:18px;box-shadow:0 10px 25px rgba(55,42,24,.08);transition:.2s ease}.categorygrid .card:hover{border-color:#d7a19a;transform:translateY(-3px)}.categorygrid .cardbody{display:flex;flex-direction:column;padding:0;min-height:100%}.categorygrid .card h3{font-size:24px;margin-bottom:8px}.categorygrid .card p{font-size:14.5px;margin-bottom:8px}.categorygrid .fit{order:2;height:185px;margin-top:auto;padding:0;mix-blend-mode:multiply}.categorygrid .price{display:flex;align-items:baseline;gap:6px;font-size:18px;margin-top:10px}.categorygrid .btn{display:none}
.infoStrip{display:grid;grid-template-columns:repeat(3,1fr);padding:24px;border:1px solid #efded4;border-radius:18px;background:linear-gradient(100deg,#fff9f3,#f7eadf)}.infoItem{display:flex;align-items:flex-start;gap:14px;padding:0 28px;border-right:1px solid #dfcfc5}.infoItem:last-child{border-right:0}.infoItem svg{width:26px;height:26px;flex:0 0 auto;color:var(--red)}.infoItem span{display:flex;flex-direction:column;color:var(--muted);font-size:13px}.infoItem b{color:#7b3e33;font-size:16px}.benefitsSection{padding:0 0 28px}
.tripgrid{grid-template-columns:repeat(3,1fr);gap:16px}.trip{border-radius:18px}.trip img{height:190px}.trip .cardbody{padding:18px;display:flex;flex-direction:column;align-items:flex-start}.trip h3{font-size:21px;margin:10px 0 8px}.trip p{min-height:3em;margin-bottom:12px}.meta{font-size:13px}.trip .btn{margin-top:auto;min-height:42px;padding-inline:16px;font-size:13px}.featuredTrip{display:grid;grid-template-columns:1.1fr 1fr;margin:26px 0}.featuredTrip img{height:100%;min-height:360px}.featuredTrip .cardbody{padding:42px;justify-content:center}.featuredTrip h3{font-size:37px}.featuredTrip p{min-height:0}

/* Výlety – menší tlačítko pouze v horní Featured Trip kartě */
.trip.featuredTrip .btn.secondary{
    width:fit-content;
    max-width:100%;
    min-height:34px;
    padding:6px 10px;
    gap:6px;
    font-size:12px;
    line-height:16px;
    white-space:nowrap;
}
.trip.featuredTrip .btn.secondary svg{
    width:15px;
    height:15px;
    flex:0 0 15px;
}
.gallerygrid.preview{grid-template-columns:repeat(6,1fr);gap:8px}.gallerygrid.preview .galleryitem{border-radius:12px}.gallerygrid.preview .galleryitem img{height:155px}.gallerygrid.preview .galleryitem span{display:none}.gallerygrid.mosaic{grid-template-columns:repeat(12,1fr);gap:10px;grid-auto-rows:190px}.gallerygrid.mosaic .galleryitem{grid-column:span 4;height:190px}.gallerygrid.mosaic .galleryitem:nth-child(5n+1),.gallerygrid.mosaic .galleryitem:nth-child(5n+5){grid-column:span 6}.gallerygrid.mosaic .galleryitem img{height:100%}
.contactBand{margin:20px auto 70px;border-radius:20px;background:linear-gradient(110deg,#303e1d,#53633b);color:#fff;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;min-height:220px}.contactBand>div:first-child{padding:36px;display:flex;flex-direction:column;align-items:flex-start;justify-content:center}.contactBand h2{color:#fff;font-size:32px}.contactBand p,.contactBand a:not(.btn){margin:0 0 6px}.contactBand .btn{margin-top:12px;background:#fff;color:var(--olive)!important;box-shadow:none}.contactBand iframe{width:100%;height:100%;min-height:220px;border:0}
.contactgrid{gap:16px}.contactcard{padding:26px;gap:9px}.contactcard h2{font-size:29px}.roundIcon{width:48px;height:48px;display:grid;place-items:center;border-radius:50%;background:var(--red);color:white;font-size:21px}.roundIcon svg{width:1.15em;height:1.15em;flex:0 0 auto}.roundIcon.olive{background:var(--olive)}.contactMap{grid-column:span 2;display:grid;grid-template-columns:.9fr 1.1fr;padding:0;overflow:hidden;min-height:360px}.contactMap>div{padding:30px;display:flex;flex-direction:column;align-items:flex-start}.contactMap iframe{width:100%;height:100%;min-height:360px;border:0}.arrival{display:flex;flex-direction:column;gap:16px}.contactFormPreview{grid-column:1/-1}
.pricegrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.pricecard{padding:22px}.pricecard .fit{height:150px;padding:0;mix-blend-mode:multiply}.pricecard h2{font-size:29px}.priceRow{display:flex;justify-content:space-between;gap:10px;padding:12px;border-radius:10px;background:#f7f0e9}.lowerGrid{display:grid;grid-template-columns:1.2fr .8fr;gap:18px;margin-top:18px}.included{margin-top:20px;padding:30px;border-radius:18px;background:#f5eee6}.included>div{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.included span{display:flex;align-items:center;gap:10px;font-size:14px}.included svg{width:25px;height:25px;color:var(--red)}
.footer{padding:28px 0 18px}.foot{grid-template-columns:auto 1fr auto auto}.foot nav{font-size:13px}.footerSocial{display:flex;flex-direction:column;font-size:12px}.footerNote{padding-top:14px;margin-top:14px;border-top:1px solid var(--line);color:var(--muted);font-size:11px}
@media(max-width:1199px){.nav:not(.nav-desktop) .links,.nav:not(.nav-desktop) .navin>.cta{display:none}.nav:not(.nav-desktop) .menu{display:block}.gallerygrid.preview{grid-template-columns:repeat(3,1fr)}.pricegrid{grid-template-columns:repeat(2,1fr)}.contactgrid{grid-template-columns:repeat(2,1fr)}.contactMap{grid-column:span 2}}
@media(max-width:809px){.pageHero .heroText{display:block}.handnote{display:none}.categorygrid{grid-template-columns:repeat(2,1fr)}.tripgrid{grid-template-columns:1fr}.infoStrip{grid-template-columns:1fr;gap:14px}.infoItem{border-right:0;border-bottom:1px solid #dfcfc5;padding:0 0 14px}.infoItem:last-child{border-bottom:0}.gallerygrid.mosaic{grid-template-columns:1fr 1fr}.gallerygrid.mosaic .galleryitem,.gallerygrid.mosaic .galleryitem:nth-child(5n+1),.gallerygrid.mosaic .galleryitem:nth-child(5n+5){grid-column:span 1}.contactBand{grid-template-columns:1fr}.contactgrid{grid-template-columns:1fr}.contactMap{grid-column:auto;grid-template-columns:1fr}.lowerGrid{grid-template-columns:1fr}.included>div{grid-template-columns:repeat(2,1fr)}.foot{grid-template-columns:1fr}.footerSocial{text-align:center}.featuredTrip{grid-template-columns:1fr}.featuredTrip img{min-height:220px;height:220px}.featuredTrip .cardbody{padding:24px}}
@media(max-width:520px){.categorygrid,.pricegrid,.gallerygrid.preview,.gallerygrid.mosaic{grid-template-columns:1fr}.gallerygrid.mosaic .galleryitem{grid-column:auto}.contactBand{width:min(100% - 28px,1180px)}.included>div{grid-template-columns:1fr}}

.homeGalleryItem img{height:155px}.homeGalleryItem span{display:none}

/* Verified parity checklist refinements */
.homeHero{min-height:0}.homeHero>img{object-fit:contain}.pageHero{min-height:340px}.pageHero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.pageHero .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,250,239,.98) 0%,rgba(255,250,239,.72) 40%,rgba(255,250,239,.06) 78%)}
.homeCategory,.rentalCategory{display:flex;flex-direction:column;min-height:315px;padding:22px}.homeCategory{box-shadow:0 10px 25px rgba(55,42,24,.08)}.rentalCategory{box-shadow:0 10px 25px rgba(55,42,24,.06)}.homeCategory .cardbody,.rentalCategory .cardbody{padding:0}.homeCategory .fit,.rentalCategory .fit{order:2;height:185px;margin-top:auto;padding:0;mix-blend-mode:multiply}.rentalCategory .fit{height:150px}.homeCategory h3,.rentalCategory h3{font-size:24px}.accessoryCard{border-radius:16px}.accessoryCard .fit{height:180px;padding:14px}.accessoryCard .cardbody{padding:16px}.accessoryCard .price{font-size:16px;color:var(--red-dark)}
.gallerygrid.mosaic .galleryitem{grid-column:span 4}.gallerygrid.mosaic .galleryitem:nth-child(1),.gallerygrid.mosaic .galleryitem:nth-child(5),.gallerygrid.mosaic .galleryitem:nth-child(6){grid-column:span 6}.gallerygrid.mosaic .galleryitem:nth-child(2),.gallerygrid.mosaic .galleryitem:nth-child(3),.gallerygrid.mosaic .galleryitem:nth-child(4){grid-column:span 4}.galleryitem img{transition:transform .2s ease}.galleryitem:hover img{transform:scale(1.03)}
.contactgrid>.contactcard:nth-child(-n+3){min-height:343px}.contactMap{min-height:378px}.contactMap iframe{min-height:376px}
.filters{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none}.filters::-webkit-scrollbar{display:none}.filters button{flex:0 0 auto;padding-inline:22px;background:#fbf7f1}
@media(max-width:520px){.wrap{width:min(100% - 24px,1180px)}.navin{min-height:75px}.logo{width:128px;height:52px}.mobilelinks{position:absolute;top:74px;left:20px;right:20px;width:auto;padding:12px;border:1px solid var(--line);border-radius:14px;background:var(--paper);box-shadow:0 18px 48px rgba(49,38,22,.12)}.mobilelinks a{min-height:44px}.homeHero{display:block}.homeHero>img{position:relative;width:100%;height:260px;object-fit:contain;background:#f2eadf}.homeHero .shade{display:none}.homeHero .heroText{padding:36px 12px 74px}.hero h1{font-size:46.8px;line-height:1.02}.pageHero{min-height:320px}.pageHero .heroText{padding:42px 0 60px}.pageHero h1{font-size:42.9px}.heroActions .btn{width:100%}.section{padding:48px 0}.homeCategory{min-height:300px}.homeCategory .fit{height:165px}.rentalCategory{min-height:320px}.rentalCategory .fit{height:145px}.accessoryCard{min-height:313px}.accessoryCard .fit{height:170px}.infoStrip{padding:24px}.gallerygrid.preview{grid-template-columns:repeat(2,1fr);gap:8px}.gallerygrid.preview .galleryitem img,.homeGalleryItem img{height:135px}.gallerygrid.mosaic{grid-template-columns:1fr;gap:10px}.gallerygrid.mosaic .galleryitem,.gallerygrid.mosaic .galleryitem:nth-child(n){grid-column:auto;height:170px}.gallerygrid.mosaic .galleryitem img{height:170px}.contactBand{width:calc(100% - 24px);margin-bottom:48px}.contactBand>div:first-child{padding:28px 36px}.contactBand iframe{min-height:220px}.trip img{height:190px}.featuredTrip{min-height:579px}.featuredTrip img{height:220px}.included>div{grid-template-columns:1fr}.foot,.footerSocial{text-align:left}.foot img{margin:0}.foot nav{display:flex;justify-content:flex-start}.lightbox{padding:68px 14px 90px}.lightbox img{max-width:362px}.prev,.next{top:auto;bottom:20px;width:56px;height:48px;border-radius:12px}.prev{left:calc(50% - 66px)}.next{right:calc(50% - 66px)}}
.tripFeaturedBlock{width:100%}.tripListHeading{margin-top:52px;margin-bottom:0}.tripNotice{width:100%;margin-top:-6px}
@media(max-width:809px){.tripListHeading{margin-top:40px}.tripNotice{margin-top:0}}
.bottomCtaWrap{padding:20px 0 70px}.bottomCTA{min-height:220px;border-radius:20px;background:linear-gradient(110deg,#fff7ef,#f5e7dc);display:grid;grid-template-columns:1fr auto;align-items:center;gap:40px;padding:36px 40px}.bottomCTA h2{font-size:42px;line-height:1.08;margin:0 0 12px}.bottomCTA p{margin:0;color:var(--muted);font-size:16px;line-height:1.5}.bottomCTA .btn{white-space:nowrap}
@media(max-width:809px){.bottomCtaWrap{padding:20px 0 48px}.bottomCTA{min-height:0;grid-template-columns:1fr;gap:24px;padding:32px 20px}.bottomCTA h2{font-size:31.2px;line-height:1.08}.bottomCTA .btn{width:100%;justify-content:center}}

/* Strict Home parity – isolated from the six inner routes */
.homeHeading{width:100%;display:flex;align-items:flex-end;justify-content:space-between;gap:20px}.homeHeading h2{font-size:48px;line-height:1.08;font-weight:650;letter-spacing:-.035em;margin:0}.homeHeading>a{color:var(--red);font-size:16px;line-height:24px;font-weight:700}.homeHero .heroText{padding:70px 0 110px}.homeHero h1{font-size:80px;line-height:1.02;font-weight:650;letter-spacing:-.035em;margin:14px 0 22px}.homeHero p{font-size:19.2px;line-height:1.5;color:var(--ink)}.homeHero .heroActions{gap:12px;margin-top:26px}.homeHero .btn{gap:8px}.homeHero .btn svg{width:18px;height:18px;flex:0 0 auto}.links a.homeActive{background:var(--soft);color:var(--red)}
.homeCategory p{font-size:14.5px;line-height:1.55}.homeGalleryItem{display:block}.infoItem b{font-size:13.6px;line-height:20.4px}.infoItem small{font-size:13.12px;line-height:19.68px}

/* Home hero – stronger white veil to match the coded GitHub reference */
.homeHero{
    position:relative;
}
.homeHero .shade{
    display:block;
    position:absolute;
    inset:0;
    z-index:1;
    pointer-events:none;
    background:
        linear-gradient(
            90deg,
            rgba(255,253,250,.995) 0%,
            rgba(255,253,250,.985) 16%,
            rgba(255,253,250,.94) 28%,
            rgba(255,253,250,.78) 40%,
            rgba(255,253,250,.52) 52%,
            rgba(255,253,250,.24) 64%,
            rgba(255,253,250,.06) 76%,
            rgba(255,253,250,0) 86%
        );
}
.homeHero::after{
    content:"";
    position:absolute;
    left:0;
    right:0;
    bottom:0;
    height:120px;
    z-index:1;
    pointer-events:none;
    background:
        linear-gradient(
            180deg,
            rgba(255,253,250,0) 0%,
            rgba(255,253,250,.42) 46%,
            rgba(255,253,250,.94) 100%
        );
}
.homeHero .heroText{
    position:relative;
    z-index:2;
}

/* Home trip cards – exact coded-reference treatment */
.homeTrip{
    height:auto;
    min-height:467px;
    display:flex;
    flex-direction:column;
    overflow:hidden;
    background:var(--paper);
    border:1px solid var(--line);
    border-radius:18px;
    box-shadow:none;
}
.homeTrip .tripImage{
    display:block;
    width:100%;
    height:190px;
    flex:0 0 190px;
    object-fit:cover;
    object-position:center;
    padding:0;
    margin:0;
}
.homeTrip .cardbody{
    width:100%;
    height:auto;
    min-height:0;
    flex:1 1 auto;
    display:flex;
    flex-direction:column;
    align-items:flex-start;
    padding:18px;
    background:var(--paper);
}
.homeTrip .tripDifficulty{
    margin:0 0 10px;
    color:var(--red);
    font-size:12.48px;
    line-height:18.72px;
    font-weight:700;
    letter-spacing:.18em;
    text-transform:uppercase;
}
.homeTrip .tripTitle{
    width:100%;
    margin:0 0 8px;
    color:#111;
    font-size:20.8px;
    line-height:25.376px;
    font-weight:650;
    letter-spacing:-.035em;
}
.homeTrip .tripDescription{
    width:100%;
    margin:0 0 18px;
    color:var(--muted);
    font-size:16px;
    line-height:24px;
    font-weight:400;
    min-height:0;
}
.homeTrip .tripMeta{
    width:100%;
    display:flex;
    flex-direction:column;
    gap:10px;
    margin:0 0 22px;
    color:var(--muted);
    font-size:13.12px;
    line-height:19.68px;
}
.homeTrip .tripMetaPrimary{
    display:flex;
    align-items:center;
    flex-wrap:wrap;
    gap:12px;
}
.homeTrip .tripMetaPrimary span,
.homeTrip .tripRoadRatio{
    display:inline-flex;
    align-items:center;
    gap:5px;
    color:var(--muted);
    font-size:13.12px;
    line-height:19.68px;
}
.homeTrip .tripMetaPrimary span{white-space:nowrap}
.homeTrip .tripRoadRatio{width:100%;gap:6px}
.homeTrip .tripMeta svg{
    width:15px;
    height:15px;
    flex:0 0 15px;
    color:var(--red);
}
.homeTrip .tripMapButton{
    width:fit-content;
    max-width:100%;
    height:fit-content;
    min-height:0;
    margin-top:auto;
    padding:10px 16px;
    display:inline-flex;
    align-items:center;
    justify-content:flex-start;
    gap:8px;
    border:1px solid #d97870;
    border-radius:10px;
    background:transparent;
    color:var(--red)!important;
    box-shadow:none;
    font-size:13.6px;
    line-height:20.4px;
    font-weight:650;
    white-space:nowrap;
    text-decoration:none;
    cursor:pointer;
}
.homeTrip .tripMapButton svg:first-child{
    width:18px;
    height:18px;
    flex:0 0 18px;
}
.homeTrip .tripMapButton svg:last-child{
    width:16px;
    height:16px;
    flex:0 0 16px;
    margin-left:2px;
}
.homeTrip .tripMapButton:hover{
    background:var(--red-soft);
    border-color:var(--red);
    color:var(--red-dark)!important;
}

.contactBand{min-height:303px}.contactBand iframe{min-height:303px}.contactBand>div:first-child>a:not(.btn){display:flex;align-items:center;gap:8px}.contactBand>div:first-child>a:not(.btn) svg{width:16px;height:16px;flex:0 0 auto}.contactBand .btn{gap:8px}.contactBand .btn svg{width:18px;height:18px}.homeFooter .foot img{width:160px;height:62px;object-fit:contain}.homeFooter .footerSocial a,.homeFooter .admin{display:flex;align-items:center;gap:6px}.homeFooter .footerSocial svg,.homeFooter .admin svg{width:16px;height:16px;flex:0 0 auto}.homeFooter .footerNote{font-size:11.52px;line-height:17.28px}
@media(max-width:520px){.homeNav{font-size:15px}.homeNav .navin{height:74px;min-height:74px}.homeNav .menu{width:44px;height:44px;padding:10px}.hamburgerLines{display:block}.hamburgerLines i{display:block;height:2px;margin:5px 0;background:var(--ink)}.homeHeading{align-items:flex-start;font-size:15px}.homeHeading.categories{flex-direction:column;gap:20px}.homeHeading h2{font-size:37.6px}.homeHeading>a{font-size:12.8px;line-height:19.2px;white-space:nowrap}.homeHero{font-size:15px}.homeHero .heroText{padding:36px 0 74px}.homeHero h1{font-size:46.8px;line-height:1.02;margin:0 0 22px}.homeHero .heroActions{margin-top:28px}.homeHero p{font-size:16.32px;line-height:24.48px}.homeCategory{font-size:15px}.benefitsSection{font-size:15px}.infoItem:last-child{padding-bottom:0}.homeTrip{height:auto;min-height:0;font-size:15px}.homeTrip .tripImage{height:190px;flex-basis:190px}.homeTrip .cardbody{height:auto;padding:18px}.homeTrip .tripTitle,.homeTrip .tripDescription{width:100%}.homeTrip .tripDescription{min-height:0;font-size:15px;line-height:22.5px;margin-bottom:18px;letter-spacing:-.01em}.homeTrip .tripMeta,.homeTrip .tripMetaPrimary span,.homeTrip .tripRoadRatio{font-size:13.12px;line-height:19.68px}.homeTrip .tripMapButton{width:fit-content;height:fit-content;min-height:0;padding:10px 16px;font-size:13.6px;line-height:20.4px}.contactBand{height:633.3px;min-height:633.3px;font-size:15px}.contactBand .eyebrow{line-height:1.5}.homeFooter{font-size:15px}.homeFooter .foot{gap:25.7px}}


/* =========================================================
   RENTAL – CMS CATEGORY COLLECTOR
   Strict coded-reference treatment
   ========================================================= */

.rentalCategory{
    width:100%;
    height:310px;
    min-height:310px;

    display:flex;
    flex-direction:column;
    align-items:stretch;

    padding:22px;

    background:var(--paper);
    border:1px solid #d97870;
    border-radius:18px;
    box-shadow:none;

    overflow:hidden;
    transform:none;
}

.rentalCategory:hover{
    transform:none;
    border-color:#d97870;
}

.rentalCategoryCopy{
    width:100%;
    flex:0 0 auto;
}

.rentalCategoryCopy h3{
    margin:0 0 8px;

    color:#111;

    font-size:24px;
    line-height:29px;
    font-weight:650;
    letter-spacing:-.035em;
}

.rentalCategoryCopy p{
    margin:0;

    color:var(--muted);

    font-size:14.5px;
    line-height:22px;
    font-weight:400;
}

.rentalCategoryImage{
    width:100%;
    height:150px;
    min-height:0;

    margin:3px 0 0;
    padding:0;

    object-fit:contain;
    object-position:center;

    background:transparent;
    mix-blend-mode:multiply;

    flex:1 1 auto;
}

.rentalCategoryPrice{
    width:100%;

    display:flex;
    align-items:baseline;
    gap:6px;

    margin-top:auto;
    padding-top:6px;

    white-space:nowrap;
}

.rentalCategoryFrom{
    color:var(--red);
    font-size:14px;
    line-height:20px;
    font-weight:500;
}

.rentalCategoryPrice strong{
    color:var(--red);
    font-size:20px;
    line-height:24px;
    font-weight:800;
}

.rentalCategoryPer{
    color:var(--muted);
    font-size:14px;
    line-height:20px;
    font-weight:400;
}

@media(max-width:809px){
    .rentalCategory{
        height:310px;
        min-height:310px;
    }
}

@media(max-width:520px){
    .rentalCategory{
        height:auto;
        min-height:310px;
    }

    .rentalCategoryImage{
        height:145px;
    }
}


/* =========================================================
   PRICING – CMS CATEGORY COLLECTOR
   Exact coded-reference variant.
   Isolated from Rental and Home.
   ========================================================= */

.pricingCategoryCard{
    width:100%;
    min-width:0;
    height:auto;
    min-height:0;

    display:flex;
    flex-direction:column;

    padding:22px;

    background:var(--paper);
    border:1px solid var(--line);
    border-radius:18px;

    overflow:hidden;
    box-shadow:none;
}

.pricingCategoryTop{
    width:100%;
    min-width:0;
}

.pricingCategoryIcon{
    float:right;

    width:38px;
    height:38px;

    display:grid;
    place-items:center;

    margin:0 0 8px 12px;

    border-radius:11px;

    background:var(--red-soft);
    color:var(--red);
}

.pricingCategoryIcon svg{
    width:22px;
    height:22px;
    flex:0 0 22px;
}

.pricingCategoryTop h2{
    margin:0 0 12px;

    color:#111;

    font-size:28.8px;
    line-height:1.08;
    font-weight:650;
    letter-spacing:-.035em;
}

.pricingCategoryTop p{
    margin:0;

    color:var(--muted);

    font-size:16px;
    line-height:24px;
    font-weight:400;
}

.pricingCategoryImage{
    display:block;

    width:100%;
    height:150px;

    margin:0;
    padding:0;

    object-fit:contain;
    object-position:center;

    background:transparent;
    mix-blend-mode:multiply;
}

.pricingCategoryRow{
    width:100%;

    display:flex;
    align-items:center;
    justify-content:space-between;

    gap:10px;

    padding:12px;

    border-radius:10px;

    background:#f7f0e9;

    font-size:16px;
    line-height:24px;
}

.pricingCategoryRow span{
    color:var(--ink);
    font-weight:400;
}

.pricingCategoryRow strong{
    color:#d6221a;

    font-size:16px;
    line-height:24px;
    font-weight:700;

    white-space:nowrap;
}

.pricingCategoryNote{
    margin:12px 0 0;

    color:var(--muted);

    font-size:12px;
    line-height:18px;
    font-weight:400;
}

@media(max-width:809px){
    .pricingCategoryCard{
        padding:22px;
    }
}

@media(max-width:520px){
    .pricingCategoryTop h2{
        font-size:28.8px;
    }

    .pricingCategoryImage{
        height:150px;
    }
}


/* =========================================================
   PRICING – CMS ACCESSORY COLLECTOR
   Compact card from the coded GitHub reference.
   Rental accessory card remains unchanged.
   ========================================================= */

.pricingAccessoryCard{
    width:100%;
    min-width:0;
    min-height:120px;

    display:flex;
    flex-direction:column;

    padding:14px;

    background:var(--paper);
    border:1px solid var(--line);
    border-radius:12px;

    overflow:hidden;
    box-shadow:none;
}

.pricingAccessoryCard b{
    display:block;

    margin:0 0 2px;

    color:var(--ink);

    font-size:16px;
    line-height:24px;
    font-weight:650;
}

.pricingAccessoryCard span{
    display:block;

    margin:0;

    color:var(--muted);

    font-size:13.12px;
    line-height:19.68px;
    font-weight:400;
}

.pricingAccessoryCard strong{
    display:block;

    margin-top:auto;
    padding-top:12px;

    color:var(--red);

    font-size:16px;
    line-height:24px;
    font-weight:700;
}

@media(max-width:520px){
    .pricingAccessoryCard{
        min-height:120px;
        padding:14px;
    }
}


/* =========================================================
   PRICING – standalone lower blocks
   notice = Dovoz a vyzvednutí
   included = Co je v ceně půjčovného?
   ========================================================= */

.pricingDeliveryStandalone{
    width:100%;
    min-height:100%;
    display:flex;
    flex-direction:column;
    gap:12px;
    padding:26px;
    background:rgba(255,253,250,.96);
    border:1px solid var(--line);
    border-radius:18px;
    overflow:hidden;
    box-shadow:none;
}
.pricingDeliveryStandalone h2{
    margin:0 0 8px;
    font-size:29px;
    line-height:1.08;
    font-weight:650;
    letter-spacing:-.035em;
}
.pricingDeliveryStandalone .priceRow{
    width:100%;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:10px;
    margin:0;
    padding:12px;
    border-radius:10px;
    background:#f7f0e9;
    font-size:16px;
    line-height:24px;
}
.pricingDeliveryStandalone .priceRow span{
    display:inline-flex;
    align-items:center;
    gap:7px;
    color:var(--ink);
    font-size:16px;
    line-height:24px;
    font-weight:400;
}
.pricingDeliveryStandalone .priceRow strong{
    color:#d6221a;
    font-size:16px;
    line-height:24px;
    font-weight:700;
    white-space:nowrap;
}
.pricingDeliveryStandalone .priceRow svg{
    width:16px;
    height:16px;
    flex:0 0 16px;
    color:var(--ink);
}
.pricingDeliveryNotice{
    width:100%;
    display:flex;
    align-items:flex-start;
    gap:9px;
    margin:0;
    padding:16px;
    border-radius:13px;
    background:var(--soft);
    color:#8d352e;
    font-size:16px;
    line-height:24px;
}
.pricingDeliveryNotice svg{
    width:16px;
    height:16px;
    flex:0 0 16px;
    margin-top:2px;
}

.pricingIncludedStandalone{
    width:100%;
    margin:0;
}
.pricingIncludedStandalone h2{
    margin:0 0 18px;
    font-size:32px;
    line-height:1.08;
    font-weight:650;
    letter-spacing:-.035em;
}


/* Contact form desktop parity */
@media(min-width:1200px){
    [data-framer-name="Native Framer Contact Form"]{
        display:grid!important;
        grid-template-columns:repeat(12,minmax(0,1fr))!important;
        column-gap:16px!important;
        row-gap:16px!important;
        align-items:start!important;
    }
    [data-framer-name="Native Framer Contact Form"]>[data-framer-name="Name Label"]{
        grid-column:1 / span 6;
    }
    [data-framer-name="Native Framer Contact Form"]>[data-framer-name="Email Label"]{
        grid-column:7 / span 6;
    }
    [data-framer-name="Native Framer Contact Form"]>[data-framer-name="Message Label"]{
        grid-column:1 / span 10;
    }
    [data-framer-name="Native Framer Contact Form"]>[data-framer-name="Odeslat zprávu"]{
        grid-column:11 / span 2;
        width:auto!important;
        justify-self:end;
        align-self:end;
    }
}


/* Mobile width containment repair */
@media(max-width:520px){
    .g2-page-pricing.g2-mode-header,
    .g2-page-contact.g2-mode-header,
    .g2-mode-contactContent,
    .g2-mode-notice,
    .g2-mode-included,
    .g2-page-pricing.g2-mode-cta{
        width:100%;
        min-width:0;
        max-width:100%;
        overflow:visible;
    }
    .pricingCategoryCard,
    .pricingCategoryCard *,
    .pricingAccessoryCard,
    .pricingAccessoryCard *,
    .pricingDeliveryStandalone,
    .pricingDeliveryStandalone *,
    .pricingIncludedStandalone,
    .pricingIncludedStandalone *,
    .g2-page-pricing.g2-mode-cta .bottomCtaWrap,
    .g2-page-pricing.g2-mode-cta .bottomCTA,
    .g2-page-pricing.g2-mode-cta .bottomCTA *,
    .g2-mode-contactContent .wrap,
    .g2-mode-contactContent .contactgrid,
    .g2-mode-contactContent .contactcard,
    .g2-mode-contactContent .contactMap,
    .g2-mode-contactContent .contactMap > div,
    .g2-mode-contactContent .arrival,
    .g2-mode-contactContent iframe,
    .g2-mode-contactContent img{
        min-width:0;
        max-width:100%;
    }
    .pricingCategoryCard h2,
    .pricingCategoryCard p,
    .pricingCategoryRow,
    .pricingAccessoryCard b,
    .pricingAccessoryCard span,
    .pricingDeliveryStandalone h2,
    .pricingDeliveryStandalone .priceRow,
    .pricingDeliveryNotice,
    .pricingIncludedStandalone h2,
    .pricingIncludedStandalone span,
    .g2-mode-contactContent h2,
    .g2-mode-contactContent h3,
    .g2-mode-contactContent p,
    .g2-mode-contactContent a,
    .g2-mode-footer .footerContact,
    .g2-mode-footer .footerContact span,
    .g2-mode-footer .footerContact a,
    .g2-mode-footer .admin{
        min-width:0;
        max-width:100%;
        white-space:normal;
        overflow-wrap:anywhere;
    }
    .pricingDeliveryStandalone .priceRow span{
        min-width:0;
        flex:1 1 auto;
        white-space:normal;
        overflow-wrap:break-word;
    }
    .pricingDeliveryStandalone .priceRow strong{
        min-width:0;
        flex:0 0 auto;
        white-space:nowrap;
        overflow-wrap:normal;
    }
    .g2-page-pricing.g2-mode-cta .bottomCTA .btn,
    .g2-mode-contactContent .btn{
        min-width:0;
        max-width:100%;
        white-space:normal;
    }
}

/* =========================================================
   PRICING HEADER – responsive podle skutečné šířky komponenty
   Opravuje Framer Mobile canvas i skutečný telefon.
   Desktop a Tablet >= 810 px zůstávají beze změny.
   ========================================================= */
.g2-page-pricing.g2-mode-header{
    container-type:inline-size;
    container-name:pricingHeader;
}

@container pricingHeader (max-width:809px){
    .pageHero{
        min-height:320px;
    }

    .pageHero > img{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        object-fit:cover;
        object-position:center;
    }

    .pageHero .shade{
        position:absolute;
        inset:0;
        display:block;
        background:
            linear-gradient(
                180deg,
                rgba(255,250,239,.96) 0%,
                rgba(255,250,239,.78) 42%,
                rgba(255,250,239,.54) 100%
            );
    }

    .pageHero .heroText{
        display:block;
        width:min(100% - 28px,1180px);
        max-width:1180px;
        padding:42px 0 60px;
    }

    .pageHero .heroText > div{
        width:100%;
        max-width:620px;
        min-width:0;
    }

    .pageHero .handnote{
        display:none !important;
    }

    .pageHero h1{
        width:100%;
        max-width:100%;
        margin:0 0 22px;
        font-size:clamp(40.8px,11cqw,52px);
        line-height:1.02;
        white-space:normal;
        overflow-wrap:normal;
    }

    .pageHero p{
        width:100%;
        max-width:620px;
        margin:0;
        font-size:clamp(16px,2.25cqw,18.24px);
        line-height:1.5;
        white-space:normal;
        overflow-wrap:break-word;
    }
}

@container pricingHeader (max-width:520px){
    .pageHero .heroText{
        width:calc(100% - 24px);
        padding:42px 0 60px;
    }

    .pageHero h1{
        font-size:clamp(40px,11cqw,42.9px);
    }

    .pageHero p{
        font-size:16px;
        line-height:1.5;
    }
}


/* =========================================================
   HOME – Mobile parity podle coded reference
   Používá container query, aby se mobile layout aplikoval
   i přímo ve Framer Mobile breakpointu. Tablet >= 810 px
   a Desktop zůstávají beze změny.
   ========================================================= */

.g2-page-home{
    container-type:inline-size;
    container-name:homeSection;
}

@container homeSection (max-width:809px){

    /* společný mobilní obsahový okraj */
    .wrap{
        width:min(calc(100% - 24px),1180px);
        margin-left:auto;
        margin-right:auto;
    }

    /* Header */
    .homeNav{
        font-size:15px;
    }

    .homeNav .navin{
        height:74px;
        min-height:74px;
        gap:10px;
    }

    .homeNav .logo{
        width:128px;
        height:52px;
    }

    .homeNav .links,
    .homeNav .navin > .cta{
        display:none;
    }

    .homeNav .menu{
        display:block;
        margin-left:auto;
        width:44px;
        height:44px;
        padding:10px;
    }

    .homeNav .hamburgerLines{
        display:block;
    }

    .homeNav .hamburgerLines i{
        display:block;
        height:2px;
        margin:5px 0;
        background:var(--ink);
    }

    .g2-page-home.g2-mode-header .mobilelinks{
        position:absolute;
        z-index:50;
        top:74px;
        left:20px;
        right:20px;
        width:auto;
        padding:12px;
        border:1px solid var(--line);
        border-radius:14px;
        background:var(--paper);
        box-shadow:0 18px 48px rgba(49,38,22,.12);
    }

    .g2-page-home.g2-mode-header .mobilelinks a{
        min-height:44px;
    }

    /* Home hero – obrázek nad textem, stejně jako coded mobile */
    .homeHero{
        display:flex;
        flex-direction:column;
        align-items:stretch;
        min-height:0;
        background:#f6efe5;
        overflow:hidden;
        font-size:15px;
    }

    .homeHero > img{
        position:relative;
        inset:auto;
        grid-area:auto;
        align-self:stretch;
        display:block;
        width:100%;
        height:auto;
        max-height:none;
        margin:0;
        object-fit:contain;
        object-position:center;
        background:#f2eadf;
    }

    .homeHero .shade,
    .homeHero::after{
        display:none;
    }

    .homeHero .heroText{
        position:relative;
        grid-area:auto;
        z-index:2;
        width:calc(100% - 24px);
        max-width:1180px;
        margin:0 auto;
        padding:36px 0 74px;
    }

    .homeHero .heroText > div{
        width:100%;
        max-width:none;
        min-width:0;
    }

    .homeHero .eyebrow{
        margin-bottom:10px;
    }

    .homeHero h1{
        width:100%;
        max-width:100%;
        margin:0 0 22px;
        font-size:clamp(42px,12cqw,54px);
        line-height:1.02;
        letter-spacing:-.035em;
        white-space:normal;
        overflow-wrap:normal;
    }

    .homeHero p{
        width:100%;
        max-width:100%;
        margin:0;
        font-size:clamp(15px,4.3cqw,16.32px);
        line-height:1.5;
        color:var(--ink);
        white-space:normal;
        overflow-wrap:break-word;
    }

    .homeHero .heroActions{
        width:100%;
        margin-top:28px;
        display:flex;
        flex-direction:column;
        align-items:stretch;
        gap:12px;
    }

    .homeHero .heroActions .btn{
        width:100%;
        max-width:100%;
        justify-content:center;
    }

    /* Nadpisy domácí stránky */
    .homeHeading{
        width:100%;
        min-width:0;
        align-items:flex-start;
        gap:14px;
        font-size:15px;
    }

    .homeHeading > div{
        min-width:0;
        flex:1 1 auto;
    }

    .homeHeading h2{
        max-width:100%;
        font-size:clamp(31px,9.5cqw,37.6px);
        line-height:1.08;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .homeHeading > a{
        flex:0 0 auto;
        max-width:45%;
        font-size:12.8px;
        line-height:19.2px;
        text-align:right;
        white-space:nowrap;
    }

    /* Jen nadpis Kola pro každý výlet je v originálu na mobilu pod sebou */
    .homeHeading.categories{
        flex-direction:column;
        align-items:flex-start;
        gap:20px;
    }

    .homeHeading.categories > a{
        max-width:100%;
        text-align:left;
    }

    /* Kategorie */
    .homeCategory{
        width:100%;
        min-width:0;
        height:auto;
        min-height:300px;
        font-size:15px;
    }

    .homeCategory .cardbody{
        min-width:0;
    }

    .homeCategory .fit{
        width:100%;
        height:175px;
        max-width:100%;
        object-fit:contain;
    }

    /* Výhody – na mobilu pod sebou */
    .benefitsSection{
        width:100%;
        font-size:15px;
    }

    .infoStrip{
        width:100%;
        grid-template-columns:1fr;
        gap:14px;
        padding:24px;
    }

    .infoItem{
        min-width:0;
        border-right:0;
        border-bottom:1px solid #dfcfc5;
        padding:0 0 14px;
    }

    .infoItem:last-child{
        border-bottom:0;
        padding-bottom:0;
    }

    .infoItem span{
        min-width:0;
    }

    /* Výletové karty */
    .homeTrip{
        width:100%;
        min-width:0;
        height:auto;
        min-height:0;
        font-size:15px;
    }

    .homeTrip .tripImage{
        width:100%;
        height:190px;
        flex-basis:190px;
        object-fit:cover;
    }

    .homeTrip .cardbody{
        width:100%;
        min-width:0;
        height:auto;
        padding:18px;
    }

    .homeTrip .tripTitle,
    .homeTrip .tripDescription{
        width:100%;
        max-width:100%;
        min-width:0;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .homeTrip .tripDescription{
        min-height:0;
        font-size:15px;
        line-height:22.5px;
        margin-bottom:18px;
        letter-spacing:-.01em;
    }

    .homeTrip .tripMeta{
        width:100%;
        min-width:0;
    }

    .homeTrip .tripMapButton{
        width:fit-content;
        max-width:100%;
        height:fit-content;
        min-height:0;
        padding:10px 16px;
        font-size:13.6px;
        line-height:20.4px;
    }

    /* Galerie – 2 sloupce jako coded mobile */
    .gallerygrid.preview{
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:8px;
    }

    .gallerygrid.preview .galleryitem,
    .homeGalleryItem{
        min-width:0;
        max-width:100%;
    }

    .gallerygrid.preview .galleryitem img,
    .homeGalleryItem img{
        width:100%;
        max-width:100%;
        height:135px;
        object-fit:cover;
    }

    /* Kontakt na homepage */
    .contactBand{
        width:calc(100% - 24px);
        max-width:1180px;
        height:auto;
        min-height:0;
        margin:20px auto 48px;
        grid-template-columns:1fr;
        gap:24px;
        padding:28px;
        font-size:15px;
    }

    .contactBand > div:first-child{
        min-width:0;
    }

    .contactBand h2,
    .contactBand p,
    .contactBand a{
        max-width:100%;
        min-width:0;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .contactBand .btn{
        width:100%;
        max-width:100%;
        justify-content:center;
    }

    .contactBand iframe{
        width:100%;
        max-width:100%;
        min-height:220px;
        height:220px;
    }

    /* Footer – jeden sloupec a žádné mačkání doprava */
    .homeFooter{
        font-size:15px;
    }

    .homeFooter .foot{
        width:min(calc(100% - 24px),1180px);
        grid-template-columns:1fr;
        gap:24px;
        text-align:center;
        justify-items:center;
        align-items:center;
    }

    .homeFooter .foot img{
        width:160px;
        height:62px;
        margin:0 auto;
        object-fit:contain;
    }

    .homeFooter .foot nav{
        width:100%;
        display:flex;
        justify-content:center;
        gap:15px;
        flex-wrap:wrap;
    }

    .homeFooter .footerSocial{
        width:100%;
        align-items:center;
        text-align:center;
    }

    .homeFooter .footerSocial a{
        justify-content:center;
        max-width:100%;
        white-space:normal;
        overflow-wrap:anywhere;
    }

    .homeFooter .admin{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:6px;
        justify-self:center;
        max-width:100%;
        white-space:normal;
    }

    .homeFooter .footerNote{
        width:min(calc(100% - 24px),1180px);
        text-align:center;
    }
}

@container homeSection (max-width:420px){

    .homeHero h1{
        font-size:clamp(42px,12cqw,48px);
    }

    .homeCategory{
        min-height:300px;
    }

    .homeCategory .fit{
        height:165px;
    }

    .homeHeading.trips,
    .homeHeading.gallery{
        gap:10px;
    }

    .homeHeading > a{
        max-width:42%;
    }
}


/* =========================================================
   ALL INNER PAGES – MOBILE PARITY / WIDTH CONTAINMENT
   Půjčovna, Ceník, Výlety, Galerie, Kontakt
   Desktop + Tablet >= 810 px zůstávají beze změny.
   ========================================================= */

.g2-page-rental,
.g2-page-pricing,
.g2-page-trips,
.g2-page-gallery,
.g2-page-contact,
.g2-mode-footer,
.g2-mode-benefits,
.g2-mode-contactBand,
.g2-mode-cta,
.g2-mode-tripLead,
.g2-mode-tripNotice,
.g2-mode-contactContent,
.g2-mode-notice,
.g2-mode-included{
    container-type:inline-size;
}

/* ---------- shared inner-page header ---------- */
@container (max-width:809px){
    .g2-mode-header .navin{
        height:74px;
        min-height:74px;
        gap:10px;
    }

    .g2-mode-header .logo{
        width:128px;
        height:52px;
    }

    .g2-mode-header .links,
    .g2-mode-header .navin > .cta{
        display:none;
    }

    .g2-mode-header .menu{
        display:block;
        margin-left:auto;
        width:44px;
        height:44px;
        padding:10px;
    }

    .g2-mode-header .hamburgerLines{
        display:block;
    }

    .g2-mode-header .hamburgerLines i{
        display:block;
        height:2px;
        margin:5px 0;
        background:var(--ink);
    }

    .g2-mode-header .mobilelinks{
        position:absolute;
        z-index:50;
        top:74px;
        left:20px;
        right:20px;
        width:auto;
        padding:12px;
        border:1px solid var(--line);
        border-radius:14px;
        background:var(--paper);
        box-shadow:0 18px 48px rgba(49,38,22,.12);
    }

    .g2-mode-header .mobilelinks a{
        min-height:44px;
    }

    .g2-mode-header .pageHero{
        min-height:320px;
        overflow:hidden;
    }

    .g2-mode-header .pageHero > img{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        object-fit:cover;
        object-position:center;
    }

    .g2-mode-header .pageHero .shade{
        position:absolute;
        inset:0;
        display:block;
        background:
            linear-gradient(
                180deg,
                rgba(255,250,239,.96) 0%,
                rgba(255,250,239,.80) 44%,
                rgba(255,250,239,.54) 100%
            );
    }

    .g2-mode-header .pageHero .heroText{
        display:block;
        width:min(calc(100% - 24px),1180px);
        max-width:1180px;
        margin-left:auto;
        margin-right:auto;
        padding:42px 0 60px;
    }

    .g2-mode-header .pageHero .heroText > div{
        width:100%;
        max-width:620px;
        min-width:0;
    }

    .g2-mode-header .pageHero .handnote{
        display:none !important;
    }

    .g2-mode-header .pageHero h1{
        width:100%;
        max-width:100%;
        margin:0 0 20px;
        font-size:clamp(40.8px,11cqw,51.2px);
        line-height:1.02;
        white-space:normal;
        overflow-wrap:normal;
    }

    .g2-mode-header .pageHero p{
        width:100%;
        max-width:620px;
        min-width:0;
        margin:0;
        font-size:16px;
        line-height:24px;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .g2-mode-header .pageHero .eyebrow{
        margin-bottom:10px;
    }
}

/* ---------- shared footer ---------- */
@container (max-width:809px){
    .g2-mode-footer .foot{
        width:min(calc(100% - 24px),1180px);
        grid-template-columns:1fr;
        gap:24px;
        text-align:center;
        justify-items:center;
        align-items:center;
    }

    .g2-mode-footer .foot img{
        width:128px;
        height:52px;
        margin:0 auto;
        object-fit:contain;
    }

    .g2-mode-footer .foot nav{
        width:100%;
        display:flex;
        justify-content:center;
        flex-wrap:wrap;
        gap:15px;
    }

    .g2-mode-footer .footerSocial{
        width:100%;
        align-items:center;
        text-align:center;
    }

    .g2-mode-footer .footerSocial a{
        justify-content:center;
        max-width:100%;
        min-width:0;
        white-space:normal;
        overflow-wrap:anywhere;
    }

    .g2-mode-footer .admin{
        display:inline-flex;
        align-items:center;
        justify-content:center;
        gap:6px;
        max-width:100%;
        min-width:0;
        white-space:normal;
    }

    .g2-mode-footer .footerNote{
        width:min(calc(100% - 24px),1180px);
        text-align:center;
    }
}

/* ---------- Benefits ---------- */
@container (max-width:809px){
    .g2-mode-benefits .infoStrip{
        width:min(calc(100% - 24px),1180px);
        grid-template-columns:1fr;
        gap:14px;
        padding:24px;
        margin-left:auto;
        margin-right:auto;
    }

    .g2-mode-benefits .infoItem{
        min-width:0;
        border-right:0;
        border-bottom:1px solid #dfcfc5;
        padding:0 0 14px;
    }

    .g2-mode-benefits .infoItem:last-child{
        border-bottom:0;
        padding-bottom:0;
    }

    .g2-mode-benefits .infoItem span{
        min-width:0;
    }
}

/* ---------- Shared bottom CTA ---------- */
@container (max-width:809px){
    .g2-mode-cta .bottomCtaWrap{
        width:100%;
        padding:20px 0 48px;
    }

    .g2-mode-cta .bottomCTA{
        width:min(calc(100% - 24px),1180px);
        min-height:0;
        margin-left:auto;
        margin-right:auto;
        grid-template-columns:1fr;
        gap:24px;
        padding:32px 20px;
    }

    .g2-mode-cta .bottomCTA > div{
        min-width:0;
    }

    .g2-mode-cta .bottomCTA h2{
        max-width:100%;
        margin:0 0 12px;
        font-size:31.2px;
        line-height:1.08;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .g2-mode-cta .bottomCTA p{
        max-width:100%;
        min-width:0;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .g2-mode-cta .bottomCTA .btn{
        width:100%;
        max-width:100%;
        min-width:0;
        justify-content:center;
        white-space:normal;
    }
}

/* =========================================================
   RENTAL / PŮJČOVNA
   ========================================================= */

@container (max-width:809px){
    .g2-page-rental .section{
        padding:48px 0;
    }

    .g2-page-rental .wrap{
        width:min(calc(100% - 24px),1180px);
    }

    .g2-page-rental .head{
        display:block;
        margin-bottom:26px;
    }

    .g2-page-rental .head h2{
        max-width:100%;
        font-size:37.6px;
        line-height:1.08;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .rentalCategory{
        width:100%;
        max-width:100%;
        min-width:0;
        height:auto;
        min-height:320px;
        padding:22px;
    }

    .rentalCategoryCopy,
    .rentalCategoryCopy h3,
    .rentalCategoryCopy p,
    .rentalCategoryPrice{
        width:100%;
        max-width:100%;
        min-width:0;
    }

    .rentalCategoryCopy h3,
    .rentalCategoryCopy p{
        white-space:normal;
        overflow-wrap:break-word;
    }

    .rentalCategoryImage{
        width:100%;
        max-width:100%;
        height:145px;
        object-fit:contain;
    }

    .rentalCategoryPrice{
        flex-wrap:wrap;
    }

    .accessoryCard{
        width:100%;
        max-width:100%;
        min-width:0;
        min-height:313px;
    }

    .accessoryCard .fit{
        width:100%;
        max-width:100%;
        height:170px;
        object-fit:contain;
    }

    .accessoryCard .cardbody,
    .accessoryCard h3,
    .accessoryCard p{
        max-width:100%;
        min-width:0;
    }

    .accessoryCard h3,
    .accessoryCard p{
        white-space:normal;
        overflow-wrap:break-word;
    }
}

/* =========================================================
   PRICING / CENÍK
   ========================================================= */

@container (max-width:809px){
    .pricingCategoryCard{
        width:100%;
        max-width:100%;
        min-width:0;
        height:auto;
        min-height:367px;
        padding:22px;
    }

    .pricingCategoryTop,
    .pricingCategoryTop h2,
    .pricingCategoryTop p,
    .pricingCategoryRow,
    .pricingCategoryNote{
        max-width:100%;
        min-width:0;
    }

    .pricingCategoryTop h2,
    .pricingCategoryTop p,
    .pricingCategoryNote{
        white-space:normal;
        overflow-wrap:break-word;
    }

    .pricingCategoryImage{
        width:100%;
        max-width:100%;
        height:150px;
        object-fit:contain;
    }

    .pricingCategoryRow{
        width:100%;
    }

    .pricingAccessoryCard{
        width:100%;
        max-width:100%;
        min-width:0;
        min-height:120px;
    }

    .pricingAccessoryCard b,
    .pricingAccessoryCard span,
    .pricingAccessoryCard strong{
        max-width:100%;
        min-width:0;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .pricingDeliveryStandalone{
        width:100%;
        max-width:100%;
        min-width:0;
        min-height:0;
        padding:26px;
    }

    .pricingDeliveryStandalone h2{
        max-width:100%;
        font-size:31.2px;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .pricingDeliveryStandalone .priceRow{
        width:100%;
        max-width:100%;
        min-width:0;
    }

    .pricingDeliveryStandalone .priceRow span{
        min-width:0;
        flex:1 1 auto;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .pricingDeliveryStandalone .priceRow strong{
        flex:0 0 auto;
        white-space:nowrap;
    }

    .pricingDeliveryNotice{
        width:100%;
        max-width:100%;
        min-width:0;
    }

    .pricingDeliveryNotice span{
        min-width:0;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .pricingIncludedStandalone{
        width:100%;
        max-width:100%;
        min-width:0;
        padding:30px;
    }

    .pricingIncludedStandalone h2{
        max-width:100%;
        font-size:31.2px;
        line-height:1.08;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .pricingIncludedStandalone > div{
        grid-template-columns:1fr;
        gap:16px;
    }

    .pricingIncludedStandalone span{
        max-width:100%;
        min-width:0;
        white-space:normal;
        overflow-wrap:break-word;
    }
}

/* =========================================================
   TRIPS / VÝLETY
   ========================================================= */

@container (max-width:809px){
    .g2-page-trips .section{
        padding:48px 0;
    }

    .g2-page-trips .wrap{
        width:min(calc(100% - 24px),1180px);
    }

    .g2-page-trips .filters{
        width:100%;
        max-width:100%;
        display:flex;
        flex-wrap:nowrap;
        gap:10px;
        overflow-x:auto;
        overflow-y:hidden;
        padding-bottom:6px;
        scrollbar-width:none;
    }

    .g2-page-trips .filters::-webkit-scrollbar{
        display:none;
    }

    .g2-page-trips .filters button{
        flex:0 0 auto;
        min-height:44px;
        white-space:nowrap;
    }

    .featuredTrip{
        width:100%;
        max-width:100%;
        min-width:0;
        min-height:579px;
        grid-template-columns:1fr;
        margin:26px 0;
    }

    .featuredTrip img{
        width:100%;
        max-width:100%;
        height:220px;
        min-height:220px;
        object-fit:cover;
    }

    .featuredTrip .cardbody{
        width:100%;
        max-width:100%;
        min-width:0;
        padding:24px;
    }

    .featuredTrip h3{
        max-width:100%;
        font-size:28.8px;
        line-height:35.1px;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .featuredTrip p{
        max-width:100%;
        min-width:0;
        min-height:0;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .trip{
        width:100%;
        max-width:100%;
        min-width:0;
    }

    .trip img{
        width:100%;
        max-width:100%;
        height:190px;
        object-fit:cover;
    }

    .trip .cardbody{
        width:100%;
        max-width:100%;
        min-width:0;
        padding:18px;
    }

    .trip h3,
    .trip p,
    .trip .meta{
        max-width:100%;
        min-width:0;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .trip p{
        min-height:0;
    }

    .trip .meta{
        display:flex;
        flex-wrap:wrap;
        gap:12px;
    }

    .trip .btn{
        width:fit-content;
        max-width:100%;
        min-width:0;
        white-space:normal;
    }

    .tripListHeading{
        margin-top:40px;
        margin-bottom:26px;
    }

    .tripListHeading h2{
        max-width:100%;
        font-size:37.6px;
        line-height:1.08;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .tripNotice{
        width:100%;
        max-width:100%;
        min-width:0;
        margin-top:20px;
        white-space:normal;
        overflow-wrap:break-word;
    }
}

/* =========================================================
   GALLERY / GALERIE
   ========================================================= */

@container (max-width:809px){
    .g2-page-gallery .section{
        padding:48px 0;
    }

    .g2-page-gallery .wrap{
        width:min(calc(100% - 24px),1180px);
    }

    .g2-page-gallery .filters{
        width:100%;
        max-width:100%;
        display:flex;
        flex-wrap:nowrap;
        gap:10px;
        overflow-x:auto;
        overflow-y:hidden;
        padding-bottom:6px;
        scrollbar-width:none;
    }

    .g2-page-gallery .filters::-webkit-scrollbar{
        display:none;
    }

    .g2-page-gallery .filters button{
        flex:0 0 auto;
        min-height:44px;
        white-space:nowrap;
    }

    .gallerygrid.mosaic{
        width:100%;
        max-width:100%;
        min-width:0;
        grid-template-columns:repeat(2,minmax(0,1fr));
        gap:10px;
        grid-auto-rows:170px;
    }

    .gallerygrid.mosaic .galleryitem,
    .gallerygrid.mosaic .galleryitem:nth-child(n){
        min-width:0;
        max-width:100%;
        grid-column:span 1;
        height:170px;
    }

    .gallerygrid.mosaic .galleryitem img{
        width:100%;
        max-width:100%;
        height:170px;
        object-fit:cover;
    }

    .gallerygrid.mosaic .galleryitem span{
        max-width:100%;
        min-width:0;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .lightbox img{
        max-width:calc(100cqw - 28px);
    }
}

@container (max-width:520px){
    .gallerygrid.mosaic{
        grid-template-columns:1fr;
    }

    .gallerygrid.mosaic .galleryitem,
    .gallerygrid.mosaic .galleryitem:nth-child(n){
        grid-column:auto;
        height:170px;
    }
}

/* =========================================================
   CONTACT / KONTAKT
   ========================================================= */

@container (max-width:809px){
    .g2-mode-contactContent .section,
    .g2-page-contact .section{
        padding:48px 0;
    }

    .g2-mode-contactContent .wrap,
    .g2-page-contact .wrap{
        width:min(calc(100% - 24px),1180px);
    }

    .g2-mode-contactContent .contactgrid,
    .g2-page-contact .contactgrid{
        width:100%;
        max-width:100%;
        min-width:0;
        grid-template-columns:1fr;
        gap:16px;
    }

    .g2-mode-contactContent .contactcard,
    .g2-page-contact .contactcard{
        width:100%;
        max-width:100%;
        min-width:0;
        min-height:0 !important;
        grid-column:auto;
    }

    .g2-mode-contactContent .contactgrid > .contactcard:nth-child(-n+3),
    .g2-page-contact .contactgrid > .contactcard:nth-child(-n+3){
        min-height:0 !important;
    }

    .g2-mode-contactContent .contactgrid > .contactcard:nth-child(-n+3) h2,
    .g2-page-contact .contactgrid > .contactcard:nth-child(-n+3) h2{
        font-size:28.8px;
        line-height:1.08;
    }

    .g2-mode-contactContent .contactcard h2,
    .g2-page-contact .contactcard h2,
    .g2-mode-contactContent .contactcard h3,
    .g2-page-contact .contactcard h3,
    .g2-mode-contactContent .contactcard p,
    .g2-page-contact .contactcard p,
    .g2-mode-contactContent .contactcard a,
    .g2-page-contact .contactcard a{
        max-width:100%;
        min-width:0;
        white-space:normal;
        overflow-wrap:anywhere;
    }

    .g2-mode-contactContent .contactcard .btn,
    .g2-page-contact .contactcard .btn{
        width:100%;
        max-width:100%;
        justify-content:center;
    }

    .g2-mode-contactContent .contactMap,
    .g2-page-contact .contactMap{
        width:100%;
        max-width:100%;
        min-width:0;
        min-height:0;
        grid-column:auto;
        grid-template-columns:1fr;
    }

    .g2-mode-contactContent .contactMap > div,
    .g2-page-contact .contactMap > div{
        width:100%;
        max-width:100%;
        min-width:0;
        padding:30px;
    }

    .g2-mode-contactContent .contactMap h2,
    .g2-page-contact .contactMap h2{
        max-width:100%;
        font-size:31.2px;
        line-height:1.08;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .g2-mode-contactContent .contactMap p,
    .g2-page-contact .contactMap p{
        max-width:100%;
        min-width:0;
        white-space:normal;
        overflow-wrap:break-word;
    }

    .g2-mode-contactContent .contactMap iframe,
    .g2-page-contact .contactMap iframe{
        display:block;
        width:100%;
        max-width:100%;
        height:220px;
        min-height:220px;
        border:0;
    }

    .g2-mode-contactContent .arrival,
    .g2-page-contact .arrival{
        width:100%;
        max-width:100%;
        min-width:0;
        grid-column:auto;
    }

    .g2-mode-contactContent .arrival h2,
    .g2-page-contact .arrival h2{
        font-size:31.2px;
        line-height:1.08;
    }
}

/* ---------- Native Framer Contact form ---------- */
[data-framer-name="Native Contact Form Section"]{
    container-type:inline-size;
}

@container (max-width:809px){
    [data-framer-name="Native Contact Form Section"]{
        width:100%;
        max-width:100%;
        min-width:0;
    }

    [data-framer-name="Contact Form Card"]{
        width:min(calc(100% - 24px),1180px) !important;
        max-width:1180px !important;
        min-width:0 !important;
        margin-left:auto !important;
        margin-right:auto !important;
    }

    [data-framer-name="Native Framer Contact Form"]{
        width:100% !important;
        max-width:100% !important;
        min-width:0 !important;
        display:flex !important;
        flex-direction:column !important;
        gap:14px !important;
    }

    [data-framer-name="Native Framer Contact Form"] > *{
        width:100% !important;
        max-width:100% !important;
        min-width:0 !important;
    }

    [data-framer-name="Native Framer Contact Form"] input,
    [data-framer-name="Native Framer Contact Form"] textarea,
    [data-framer-name="Native Framer Contact Form"] button{
        width:100% !important;
        max-width:100% !important;
        min-width:0 !important;
        box-sizing:border-box !important;
    }

    [data-framer-name="Native Framer Contact Form"] textarea{
        min-height:108px;
    }
}

/* =========================================================
   GENERIC MOBILE SAFETY – FORM CONTENT
   Pomáhá i na /poptavka, pokud formulář není v G2SitePage.
   Nemění desktop ani tablet.
   ========================================================= */

@media(max-width:809px){
    form,
    form fieldset,
    form label,
    form input,
    form textarea,
    form select,
    form button{
        box-sizing:border-box;
        max-width:100%;
        min-width:0;
    }

    form input,
    form textarea,
    form select{
        width:100%;
    }

    form textarea{
        overflow-wrap:break-word;
    }
}



/* =========================================================
   VÝLETY – MOBILE: odstranit extra nadpis "Trasy pod Pálavou"
   Coded reference tento nadpis nemá. Jen mobile.
   ========================================================= */
@media (max-width:809px){
    [data-framer-name="Trips List"] > [data-framer-name="Trasy pod Pálavou"]{
        display:none !important;
    }
}


`

function Glyph({ name }: { name: string }) {
    const paths: Record<string, React.ReactNode> = {
        bike: (
            <>
                <circle cx="6" cy="17" r="3.5" />
                <circle cx="18" cy="17" r="3.5" />
                <path d="m6 17 4-8h4l4 8M9 11h7M10 9 8.5 6.5H6M14 9l2-2" />
            </>
        ),
        bolt: <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />,
        child: (
            <>
                <circle cx="12" cy="5" r="2.5" />
                <path d="M8 22v-5l-2-4 3-3h6l3 3-2 4v5M9 10l3 5 3-5" />
            </>
        ),
        scooter: (
            <>
                <circle cx="6" cy="19" r="2.5" />
                <circle cx="18" cy="19" r="2.5" />
                <path d="M6 19h8l3-11h-3M17 8l-1-4h3M8 15h6" />
            </>
        ),
        shield: (
            <>
                <path d="M12 3 4 6v5c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6l-8-3Z" />
                <path d="m9 12 2 2 4-4" />
            </>
        ),
        tool: (
            <path d="M14 6a4 4 0 0 0-5-3l3 3-3 3-3-3a4 4 0 0 0 5 5l7 7a2 2 0 1 0 3-3l-7-7Z" />
        ),
        map: (
            <>
                <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
                <path d="M9 3v15M15 6v15" />
            </>
        ),
        phone: (
            <path d="M7 3H4.5A1.5 1.5 0 0 0 3 4.5C3 13.6 10.4 21 19.5 21a1.5 1.5 0 0 0 1.5-1.5V17l-4-1-1.2 3c-4.8-1-8.6-4.8-9.6-9.6l3-1.2L7 3Z" />
        ),
        pin: (
            <>
                <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
            </>
        ),
        clock: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </>
        ),
        mail: (
            <>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
            </>
        ),
        trend: <path d="M4 18V9M10 18V5M16 18v-7M22 18V3" />,
        route: (
            <>
                <circle cx="6" cy="18" r="2" />
                <circle cx="18" cy="6" r="2" />
                <path d="M8 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3" />
            </>
        ),
        info: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v6M12 7h.01" />
            </>
        ),
        arrow: <path d="M5 12h14M14 7l5 5-5 5" />,
        lock: (
            <>
                <rect x="5" y="10" width="14" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </>
        ),
    }
    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {paths[name] || paths.shield}
        </svg>
    )
}

function useSite() {
    return useCms("site")[0] || {}
}
function Header({
    page,
    navigationMode = "desktop",
}: {
    page?: Page
    navigationMode?: NavigationMode
}) {
    const [open, setOpen] = React.useState(false)
    return (
        <>
            <header
                className={
                    "nav " +
                    (page === "home" ? "homeNav " : "") +
                    (navigationMode === "compact" ? "nav-compact" : "")
                }
            >
                <div className="wrap navin">
                    <Link href="/">
                        <a>
                            <img
                                className="logo"
                                src={logo}
                                alt="Půjčovna pod Pálavou"
                            />
                        </a>
                    </Link>
                    <nav className="links" aria-label="Hlavní navigace">
                        {routes.map((r) => (
                            <Link key={r[1]} href={r[1]}>
                                <a
                                    className={
                                        page === "home" && r[1] === "/"
                                            ? "homeActive"
                                            : undefined
                                    }
                                    onClick={() => setOpen(false)}
                                >
                                    {r[0]}
                                </a>
                            </Link>
                        ))}
                    </nav>
                    <Link href="/poptavka">
                        <a className="cta">Poptat kola</a>
                    </Link>
                    <button
                        className="menu"
                        aria-expanded={open}
                        aria-label={open ? "Zavřít menu" : "Otevřít menu"}
                        onClick={() => setOpen(!open)}
                    >
                        {page === "home" ? (
                            <span className="hamburgerLines">
                                <i />
                                <i />
                                <i />
                            </span>
                        ) : (
                            "☰"
                        )}
                    </button>
                </div>
                <nav
                    className={"mobilelinks " + (open ? "open" : "")}
                    aria-label="Mobilní navigace"
                >
                    {routes.map((r) => (
                        <Link key={r[1]} href={r[1]}>
                            <a onClick={() => setOpen(false)}>{r[0]}</a>
                        </Link>
                    ))}
                </nav>
            </header>
        </>
    )
}
function Footer() {
    const s = useSite()
    return (
        <footer className="footer">
            <div className="wrap foot">
                <Link href="/">
                    <a>
                        <img src={logo} alt="Půjčovna pod Pálavou" />
                    </a>
                </Link>
                <nav>
                    {routes.map((r) => (
                        <Link key={r[1]} href={r[1]}>
                            <a>{r[0]}</a>
                        </Link>
                    ))}
                </nav>
                <div className="footerSocial">
                    <a
                        href={
                            s.phone1
                                ? "tel:" + String(s.phone1).replace(/\s/g, "")
                                : undefined
                        }
                    >
                        {s.phone1}
                    </a>
                    <a href={s.email ? "mailto:" + s.email : undefined}>
                        E-mail
                    </a>
                </div>
                <a
                    className="admin"
                    href="https://framer.com/projects/Capable-Potential--68chypQtvAOyfDyreksR-4zfGp"
                >
                    Přihlášení správce
                </a>
            </div>
            <div className="wrap footerNote">
                © 2026 Půjčovna jízdních kol pod Pálavou
            </div>
        </footer>
    )
}
function Hero({ page }: { page: Page }) {
    const c = pageCopy[page]
    const s = useSite()
    const eyebrow =
        page === "home"
            ? "Na kolech za krásami jižní Moravy"
            : page === "rental"
              ? "Katalog půjčovny"
              : page === "trips"
                ? "Na kolech za krásami jižní Moravy"
                : ""
    return (
        <section
            className={"hero " + (page === "home" ? "homeHero" : "pageHero")}
        >
            <img
                src={imageSrc(s.image) || heroFallback}
                alt="Pálava a Novomlýnské nádrže"
            />
            <div className="shade" />
            <div className="wrap heroText">
                <div>
                    {eyebrow && <div className="eyebrow">{eyebrow}</div>}
                    <h1>{c.title}</h1>
                    <p>{c.lead}</p>
                    {page === "home" && (
                        <div className="heroActions">
                            <Link href="/poptavka">
                                <a className="btn">
                                    {s.ctaText || "Poptat kola"}
                                    <Glyph name="arrow" />
                                </a>
                            </Link>
                            {s.phone1 ? (
                                <a
                                    className="btn secondary"
                                    href={
                                        "tel:" +
                                        String(s.phone1).replace(/\s/g, "")
                                    }
                                >
                                    <Glyph name="phone" />
                                    Zavolat
                                </a>
                            ) : (
                                <Link href="/kontakt">
                                    <a className="btn secondary">
                                        <Glyph name="phone" />
                                        Zavolat
                                    </a>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
                {page !== "home" && (
                    <div className="handnote">
                        Na kolech za krásami jižní Moravy
                    </div>
                )}
            </div>
        </section>
    )
}
function Empty({ name }: { name: string }) {
    return <div className="cms-empty">Načítám {name} z CMS…</div>
}
function CategoryCards({ prices = false }: { prices?: boolean }) {
    const items = useCms("category").filter((x) => x.active !== false)
    if (!items.length) return <Empty name="kategorie" />
    return (
        <div className="grid4 categorygrid">
            {items.map((c) => {
                const content = (
                    <>
                        <div className="cardbody">
                            <h3>{c.name}</h3>
                            <p>{c.description}</p>
                            {prices && (
                                <div className="price">
                                    <span>od</span> {c.price} Kč{" "}
                                    <small>/ den</small>
                                </div>
                            )}
                        </div>
                        <img
                            className="fit"
                            src={imageSrc(c.image)}
                            alt={c.name}
                        />
                    </>
                )
                return prices ? (
                    <article className="card" key={c.itemId}>
                        {content}
                    </article>
                ) : (
                    <Link key={c.itemId} href="/pujcovna">
                        <a className="card" aria-label={c.name}>
                            {content}
                        </a>
                    </Link>
                )
            })}
        </div>
    )
}
function Accessories() {
    const items = useCms("accessory").filter((x) => x.active !== false)
    if (!items.length) return <Empty name="příslušenství" />
    return (
        <div className="grid4">
            {items.map((a) => (
                <article className="card" key={a.itemId}>
                    <img className="fit" src={imageSrc(a.image)} alt={a.name} />
                    <div className="cardbody">
                        <h3>{a.name}</h3>
                        <p>{a.note}</p>
                        <div className="price">
                            {a.price
                                ? String(a.price) + " Kč / den"
                                : "Zdarma ke kolu"}
                        </div>
                    </div>
                </article>
            ))}
        </div>
    )
}
function TripCard({
    t,
    featured = false,
    home = false,
}: {
    t: Item
    featured?: boolean
    home?: boolean
}) {
    return (
        <article
            className={[
                "card",
                "trip",
                featured ? "featuredTrip" : "",
                home ? "homeTrip" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <img className="tripImage" src={imageSrc(t.image)} alt={t.name} />
            <div className="cardbody">
                {(featured || home) && (
                    <div
                        className={home ? "tripDifficulty eyebrow" : "eyebrow"}
                    >
                        {featured ? "Náš tip" : t.difficulty}
                    </div>
                )}

                <h3 className={home ? "tripTitle" : undefined}>{t.name}</h3>

                <p className={home ? "tripDescription" : undefined}>
                    {featured && t.longDescription
                        ? t.longDescription
                        : t.description}
                </p>

                {home ? (
                    <div className="tripMeta">
                        <div className="tripMetaPrimary">
                            <span>
                                <Glyph name="pin" />
                                {t.distance}
                            </span>
                            <span>
                                <Glyph name="clock" />
                                {t.time}
                            </span>
                            <span>
                                <Glyph name="trend" />
                                {t.difficulty}
                            </span>
                        </div>

                        {t.roadRatio && (
                            <div className="tripRoadRatio">
                                <Glyph name="route" />
                                <span>{t.roadRatio}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="meta">
                        <span>
                            <Glyph name="pin" />
                            {t.distance}
                        </span>
                        <span>
                            <Glyph name="clock" />
                            {t.time}
                        </span>
                        <span>{t.difficulty}</span>
                        {t.roadRatio && <span>{t.roadRatio}</span>}
                    </div>
                )}

                {t.mapUrl && (
                    <a
                        className={home ? "tripMapButton" : "btn secondary"}
                        href={t.mapUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Glyph name="map" />
                        <span>Otevřít trasu v Mapy.cz</span>
                        {home ? <Glyph name="arrow" /> : " →"}
                    </a>
                )}
            </div>
        </article>
    )
}
function TripCards({
    limit,
    home = false,
}: {
    limit?: number
    home?: boolean
}) {
    const all = useCms("trip").filter((x) => x.active !== false)
    const items = all.slice(0, limit)
    if (!items.length) return <Empty name="výlety" />
    return (
        <div className="tripgrid">
            {items.map((t) => (
                <TripCard key={t.itemId} t={t} home={home} />
            ))}
        </div>
    )
}
function Gallery({ preview = false }: { preview?: boolean }) {
    const all = useCms("gallery").filter((x) => x.active !== false)
    const categories = Array.from(
        new Set(all.map((x) => label(x.category)).filter(Boolean))
    )
    const [filter, setFilter] = React.useState("Vše")
    const [active, setActive] = React.useState<number | null>(null)
    const opener = React.useRef<HTMLButtonElement | null>(null)
    const items = all.filter(
        (g) => filter === "Vše" || label(g.category) === filter
    )
    const close = () => {
        setActive(null)
        if (typeof window !== "undefined")
            window.requestAnimationFrame(() => opener.current?.focus())
    }
    React.useEffect(() => {
        if (active === null || typeof window === "undefined") return
        const fn = (e: KeyboardEvent) => {
            if (e.key === "Escape") close()
            if (e.key === "ArrowRight") setActive((active + 1) % items.length)
            if (e.key === "ArrowLeft")
                setActive((active - 1 + items.length) % items.length)
        }
        window.addEventListener("keydown", fn)
        document.body.style.overflow = "hidden"
        return () => {
            window.removeEventListener("keydown", fn)
            document.body.style.overflow = ""
        }
    }, [active, items.length])
    const shown = preview ? all.slice(0, 6) : items
    if (!shown.length) return <Empty name="galerii" />
    return (
        <>
            {!preview && (
                <div className="filters">
                    {["Vše", ...categories].map((f) => (
                        <button
                            key={f}
                            className={filter === f ? "active" : ""}
                            onClick={() => {
                                setFilter(f)
                                setActive(null)
                            }}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            )}
            <div className={"gallerygrid " + (preview ? "preview" : "mosaic")}>
                {shown.map((g, i) => (
                    <button
                        className="galleryitem"
                        key={g.itemId}
                        onClick={(e) => {
                            opener.current = e.currentTarget
                            setActive(i)
                        }}
                    >
                        <img src={imageSrc(g.image)} alt={g.alt || g.caption} />
                        <span>{g.caption || g.name}</span>
                    </button>
                ))}
            </div>
            {active !== null && items[active] && (
                <div
                    className="lightbox"
                    role="dialog"
                    aria-modal="true"
                    aria-label={items[active].caption}
                    onMouseDown={(e) => {
                        if (e.currentTarget === e.target) close()
                    }}
                >
                    <button
                        autoFocus
                        className="close"
                        onClick={close}
                        aria-label="Zavřít"
                    >
                        ×
                    </button>
                    <button
                        className="prev"
                        onClick={() =>
                            setActive(
                                (active - 1 + items.length) % items.length
                            )
                        }
                        aria-label="Předchozí"
                    >
                        ‹
                    </button>
                    <figure>
                        <img
                            src={imageSrc(items[active].image)}
                            alt={items[active].alt || items[active].caption}
                        />
                        <figcaption>{items[active].caption}</figcaption>
                    </figure>
                    <button
                        className="next"
                        onClick={() => setActive((active + 1) % items.length)}
                        aria-label="Další"
                    >
                        ›
                    </button>
                </div>
            )}
        </>
    )
}
function ContactBand() {
    const s = useSite()
    const address = s.address || "Hlavní 50, Šakvice, 691 67"
    return (
        <section className="wrap contactBand">
            <div>
                <div className="eyebrow">Kontaktujte nás</div>
                <h2>{address}</h2>
                <a
                    href={
                        s.phone1
                            ? "tel:" + String(s.phone1).replace(/\s/g, "")
                            : undefined
                    }
                >
                    <Glyph name="phone" /> {s.phone1}
                </a>
                {s.phone2 && (
                    <a href={"tel:" + String(s.phone2).replace(/\s/g, "")}>
                        <Glyph name="phone" /> {s.phone2}
                    </a>
                )}
                <a href={s.email ? "mailto:" + s.email : undefined}>
                    <Glyph name="mail" /> {s.email}
                </a>
                <a
                    className="btn"
                    href={
                        "https://www.google.com/maps/search/?api=1&query=" +
                        encodeURIComponent(address)
                    }
                    target="_blank"
                    rel="noreferrer"
                >
                    Otevřít v Google Mapách →
                </a>
            </div>
            <iframe
                title="Mapa půjčovny"
                loading="lazy"
                src={
                    "https://www.google.com/maps?q=" +
                    encodeURIComponent(address) +
                    "&output=embed"
                }
            />
        </section>
    )
}
function Home() {
    return (
        <>
            <section className="section">
                <div className="wrap">
                    <div className="head">
                        <div>
                            <div className="eyebrow">Vyberte si vybavení</div>
                            <h2>Kola pro každý výlet</h2>
                        </div>
                        <Link href="/pujcovna">
                            <a>Celá nabídka →</a>
                        </Link>
                    </div>
                    <CategoryCards />
                </div>
            </section>
            <Benefits />
            <section className="section">
                <div className="wrap">
                    <div className="head">
                        <div>
                            <div className="eyebrow">
                                Inspirace pro den venku
                            </div>
                            <h2>Tipy na výlet</h2>
                        </div>
                        <Link href="/vylety">
                            <a>Všechny tipy →</a>
                        </Link>
                    </div>
                    <TripCards limit={3} home />
                </div>
            </section>
            <section className="section">
                <div className="wrap">
                    <div className="head">
                        <div>
                            <div className="eyebrow">Z jižní Moravy</div>
                            <h2>Z naší galerie</h2>
                        </div>
                        <Link href="/galerie">
                            <a>Zobrazit galerii →</a>
                        </Link>
                    </div>
                    <Gallery preview />
                </div>
            </section>
            <ContactBand />
        </>
    )
}
function Rental() {
    return (
        <>
            <section className="section">
                <div className="wrap">
                    <div className="head">
                        <div>
                            <div className="eyebrow">Vyberte si vybavení</div>
                            <h2>Naše nabídka</h2>
                        </div>
                    </div>
                    <CategoryCards prices />
                    <div className="head" style={{ marginTop: 52 }}>
                        <h2>Příslušenství</h2>
                    </div>
                    <Accessories />
                </div>
            </section>
            <Benefits />
            <ContactBand />
        </>
    )
}
function Pricing() {
    return (
        <section className="section">
            <div className="wrap">
                <div className="pricegrid">
                    {useCms("category")
                        .filter((x) => x.active !== false)
                        .map((c) => (
                            <article className="card pricecard" key={c.itemId}>
                                <h2>{c.name}</h2>
                                <p>{c.description}</p>
                                <img
                                    className="fit"
                                    src={imageSrc(c.image)}
                                    alt={c.name}
                                />
                                <div className="priceRow">
                                    <span>1 den</span>
                                    <strong>{c.price} Kč</strong>
                                </div>
                                <p className="meta">
                                    Další dny a dostupnost potvrdíme v nabídce.
                                </p>
                            </article>
                        ))}
                </div>
                <div className="lowerGrid">
                    <section className="card contactcard">
                        <h2>Příslušenství</h2>
                        <Accessories />
                    </section>
                    <section className="card contactcard">
                        <h2>Dovoz a vyzvednutí</h2>
                        <div className="priceRow">
                            <span>Předem domluvené místo</span>
                            <strong>individuálně</strong>
                        </div>
                        <div className="notice">
                            Dovoz je nutné objednat předem. Cena je
                            individuální.
                        </div>
                    </section>
                </div>
                <section className="included">
                    <h2>Co je v ceně půjčovného?</h2>
                    <div>
                        <span>
                            <Glyph name="tool" /> Pravidelně servisované
                            vybavení
                        </span>
                        <span>
                            <Glyph name="shield" /> Přilba, nářadí, hustilka a
                            zámek
                        </span>
                        <span>
                            <Glyph name="map" /> Místní tipy na výlety
                        </span>
                        <span>
                            <Glyph name="phone" /> Telefonická podpora během
                            výpůjčky
                        </span>
                    </div>
                </section>
            </div>
        </section>
    )
}
function Trips() {
    const all = useCms("trip").filter((x) => x.active !== false)
    const categories = Array.from(
        new Set(all.map((x) => label(x.category)).filter(Boolean))
    )
    const [filter, setFilter] = React.useState("Všechny trasy")
    const shown = all.filter(
        (t) => filter === "Všechny trasy" || label(t.category) === filter
    )
    const featured = all[0]
    return (
        <section className="section">
            <div className="wrap">
                <div className="filters">
                    {["Všechny trasy", ...categories].map((f) => (
                        <button
                            key={f}
                            className={filter === f ? "active" : ""}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                {featured && <TripCard t={featured} featured />}
                <div className="head" style={{ marginTop: 52 }}>
                    <h2>Další tipy na výlety</h2>
                </div>
                {shown.length ? (
                    <div className="tripgrid">
                        {shown.map((t) => (
                            <TripCard key={t.itemId} t={t} />
                        ))}
                    </div>
                ) : (
                    <Empty name="výlety" />
                )}
                <div className="notice" style={{ marginTop: 20 }}>
                    Vzdálenosti a časy jsou orientační. Před jízdou si v Mapy.cz
                    ověřte aktuální trasu a průjezdnost.
                </div>
            </div>
        </section>
    )
}
function Contact() {
    const s = useSite()
    const address = s.address || "Hlavní 50, Šakvice, 691 67"
    return (
        <section className="section">
            <div className="wrap contactgrid">
                <article className="card contactcard">
                    <span className="roundIcon">
                        <Glyph name="pin" />
                    </span>
                    <h2>Kontakt</h2>
                    <p>{address}</p>
                    <a
                        href={
                            s.phone1
                                ? "tel:" + String(s.phone1).replace(/\s/g, "")
                                : undefined
                        }
                    >
                        {s.phone1}
                    </a>
                    <a
                        href={
                            s.phone2
                                ? "tel:" + String(s.phone2).replace(/\s/g, "")
                                : undefined
                        }
                    >
                        {s.phone2}
                    </a>
                    <a href={s.email ? "mailto:" + s.email : undefined}>
                        {s.email}
                    </a>
                </article>
                <article className="card contactcard">
                    <span className="roundIcon olive">
                        <Glyph name="clock" />
                    </span>
                    <h2>Otevírací doba</h2>
                    <h3>{s.openingPeriod}</h3>
                    <p>{s.openingHours}</p>
                    <hr />
                    <p>{s.openingNote}</p>
                </article>
                <article className="card contactcard">
                    <span className="roundIcon">
                        <Glyph name="mail" />
                    </span>
                    <h2>Poptávka</h2>
                    <p>Pošlete nám termín, počet kol a výšky jezdců.</p>
                    <Link href="/poptavka">
                        <a className="btn">Vyplnit poptávku</a>
                    </Link>
                    <a
                        className="btn secondary"
                        href={s.email ? "mailto:" + s.email : undefined}
                    >
                        Napsat e-mail
                    </a>
                </article>
                <article className="card contactMap">
                    <div>
                        <div className="eyebrow">Kde nás najdete</div>
                        <h2>Šakvice pod Pálavou</h2>
                        <p>{address}</p>
                        <a
                            className="btn"
                            href={
                                "https://www.google.com/maps/search/?api=1&query=" +
                                encodeURIComponent(address)
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            Otevřít v Google Mapách →
                        </a>
                    </div>
                    <iframe
                        title="Mapa půjčovny"
                        loading="lazy"
                        src={
                            "https://www.google.com/maps?q=" +
                            encodeURIComponent(address) +
                            "&output=embed"
                        }
                    />
                </article>
                <article className="card contactcard arrival">
                    <h2>Jak se k nám dostat</h2>
                    <div>
                        <b>Autem</b>
                        <p>
                            Najdete nás přímo v obci Šakvice na adrese Hlavní
                            50.
                        </p>
                    </div>
                    <div>
                        <b>Půjčení a vrácení kol</b>
                        <p>
                            Vybavení se předává v provozovně, případně po
                            předchozí domluvě doveze.
                        </p>
                    </div>
                </article>
            </div>
        </section>
    )
}

function FooterProps({
    s,
    homeStrict = false,
}: {
    s: Item
    homeStrict?: boolean
}) {
    return (
        <footer className={"footer " + (homeStrict ? "homeFooter" : "")}>
            <div className="wrap foot">
                <Link href="/">
                    <a>
                        <img src={logo} alt="Půjčovna pod Pálavou" />
                    </a>
                </Link>
                <nav>
                    {routes.map((r) => (
                        <Link key={r[1]} href={r[1]}>
                            <a>{r[0]}</a>
                        </Link>
                    ))}
                </nav>
                <div className="footerSocial">
                    {homeStrict ? (
                        <>
                            <a
                                href={
                                    s.phone1
                                        ? "tel:" +
                                          String(s.phone1).replace(/\s/g, "")
                                        : undefined
                                }
                            >
                                <Glyph name="phone" />
                                {s.phone1}
                            </a>
                            <a href={s.email ? "mailto:" + s.email : undefined}>
                                <Glyph name="mail" />
                                E-mail
                            </a>
                        </>
                    ) : (
                        <>
                            <div>{s.phone1}</div>
                            <a href={s.email ? "mailto:" + s.email : undefined}>
                                E-mail
                            </a>
                        </>
                    )}
                </div>
                <a
                    className="admin"
                    href="https://framer.com/projects/Capable-Potential--68chypQtvAOyfDyreksR-4zfGp"
                >
                    {homeStrict && <Glyph name="lock" />}Přihlášení správce
                </a>
            </div>
            <div className="wrap footerNote">
                © 2026 Půjčovna jízdních kol pod Pálavou
            </div>
        </footer>
    )
}
function ContactBandProps({ s }: { s: Item }) {
    const address = s.address || "Hlavní 50, Šakvice, 691 67"
    return (
        <section className="wrap contactBand">
            <div>
                <div className="eyebrow">Kontaktujte nás</div>
                <h2>{address}</h2>
                <a
                    href={
                        s.phone1
                            ? "tel:" + String(s.phone1).replace(/\s/g, "")
                            : undefined
                    }
                >
                    <Glyph name="phone" />
                    {s.phone1}
                </a>
                {s.phone2 && (
                    <a href={"tel:" + String(s.phone2).replace(/\s/g, "")}>
                        <Glyph name="phone" />
                        {s.phone2}
                    </a>
                )}
                <a href={s.email ? "mailto:" + s.email : undefined}>
                    <Glyph name="mail" />
                    {s.email}
                </a>
                <a
                    className="btn"
                    href={
                        "https://www.google.com/maps/search/?api=1&query=" +
                        encodeURIComponent(address)
                    }
                    target="_blank"
                    rel="noreferrer"
                >
                    <Glyph name="pin" />
                    Otevřít v Google Mapách
                    <Glyph name="arrow" />
                </a>
            </div>
            <iframe
                title="Mapa půjčovny"
                loading="lazy"
                src={
                    "https://www.google.com/maps?q=" +
                    encodeURIComponent(address) +
                    "&output=embed"
                }
            />
        </section>
    )
}
function Benefits() {
    const items = [
        [
            "shield",
            "Pomůžeme s výběrem",
            "Poradíme podle výšky, plánů a trasy.",
        ],
        [
            "tool",
            "Pravidelný servis",
            "Kola připravujeme před každou výpůjčkou.",
        ],
        ["map", "Místní tipy", "Doporučíme cíle a praktické zastávky."],
    ]
    return (
        <section className="benefitsSection">
            <div className="wrap infoStrip">
                {items.map((x) => (
                    <div className="infoItem" key={x[1]}>
                        <Glyph name={x[0]} />
                        <span>
                            <b>{x[1]}</b>
                            <small>{x[2]}</small>
                        </span>
                    </div>
                ))}
            </div>
        </section>
    )
}
function HomeHeading({
    type = "categories",
}: {
    type?: "categories" | "trips" | "gallery"
}) {
    const content = {
        categories: [
            "Vyberte si vybavení",
            "Kola pro každý výlet",
            "Celá nabídka",
            "/pujcovna",
        ],
        trips: [
            "Inspirace pro den venku",
            "Tipy na výlet",
            "Všechny tipy",
            "/vylety",
        ],
        gallery: [
            "Z jižní Moravy",
            "Z naší galerie",
            "Zobrazit galerii",
            "/galerie",
        ],
    }[type]
    return (
        <div className={"homeHeading " + type}>
            <div>
                <div className="eyebrow">{content[0]}</div>
                <h2>{content[1]}</h2>
            </div>
            <Link href={content[3]}>
                <a>{content[2]} →</a>
            </Link>
        </div>
    )
}
function BottomCTA({ page }: { page: Page }) {
    const copies: Record<
        string,
        { title: string; text: string; button: string; href: string }
    > = {
        rental: {
            title: "Připraveni vyrazit?",
            text: "Vyplňte nezávaznou poptávku a my ověříme dostupnost.",
            button: "Poptat kola",
            href: "/poptavka",
        },
        pricing: {
            title: "Nezávazná poptávka",
            text: "Po odeslání vám půjčovna osobně potvrdí dostupnost a konečnou nabídku.",
            button: "Přejít na poptávku",
            href: "/poptavka",
        },
        trips: {
            title: "Nevíte, kam vyrazit?",
            text: "Rádi doporučíme cíl podle času, kondice a složení skupiny.",
            button: "Kontaktovat nás",
            href: "/kontakt",
        },
        gallery: {
            title: "Naplánujte si vlastní výlet pod Pálavou",
            text: "Půjčte si kolo a objevte jižní Moravu vlastním tempem.",
            button: "Přejít na poptávku",
            href: "/poptavka",
        },
    }
    const c = copies[page] || copies.rental
    return (
        <section className="bottomCtaWrap">
            <div className="wrap bottomCTA">
                <div>
                    <h2>{c.title}</h2>
                    <p>{c.text}</p>
                </div>
                <Link href={c.href}>
                    <a className="btn">{c.button} →</a>
                </Link>
            </div>
        </section>
    )
}
function TripLead() {
    return (
        <div className="head tripListHeading">
            <h2>Další tipy na výlety</h2>
        </div>
    )
}
function TripNotice() {
    return (
        <div className="notice tripNotice">
            Vzdálenosti a časy jsou orientační. Před jízdou si v Mapy.cz ověřte
            aktuální trasu a průjezdnost.
        </div>
    )
}
function ContactProps({ s }: { s: Item }) {
    const address = s.address || "Hlavní 50, Šakvice, 691 67"
    return (
        <section className="section">
            <div className="wrap contactgrid">
                <article className="card contactcard">
                    <span className="roundIcon">
                        <Glyph name="pin" />
                    </span>
                    <h2>Kontakt</h2>
                    <p>{address}</p>
                    <a
                        href={
                            s.phone1
                                ? "tel:" + String(s.phone1).replace(/\s/g, "")
                                : undefined
                        }
                    >
                        {s.phone1}
                    </a>
                    <a
                        href={
                            s.phone2
                                ? "tel:" + String(s.phone2).replace(/\s/g, "")
                                : undefined
                        }
                    >
                        {s.phone2}
                    </a>
                    <a href={s.email ? "mailto:" + s.email : undefined}>
                        {s.email}
                    </a>
                </article>
                <article className="card contactcard">
                    <span className="roundIcon olive">
                        <Glyph name="clock" />
                    </span>
                    <h2>Otevírací doba</h2>
                    <h3>{s.openingPeriod}</h3>
                    <p>{s.openingHours}</p>
                    <hr />
                    <p>{s.openingNote}</p>
                </article>
                <article className="card contactcard">
                    <span className="roundIcon">
                        <Glyph name="mail" />
                    </span>
                    <h2>Poptávka</h2>
                    <p>Pošlete nám termín, počet kol a výšky jezdců.</p>
                    <Link href="/poptavka">
                        <a className="btn">Vyplnit poptávku</a>
                    </Link>
                    <a
                        className="btn secondary"
                        href={s.email ? "mailto:" + s.email : undefined}
                    >
                        Napsat e-mail
                    </a>
                </article>
                <article className="card contactMap">
                    <div>
                        <div className="eyebrow">Kde nás najdete</div>
                        <h2>Šakvice pod Pálavou</h2>
                        <p>{address}</p>
                        <a
                            className="btn"
                            href={
                                "https://www.google.com/maps/search/?api=1&query=" +
                                encodeURIComponent(address)
                            }
                            target="_blank"
                            rel="noreferrer"
                        >
                            Otevřít v Google Mapách →
                        </a>
                    </div>
                    <iframe
                        title="Mapa půjčovny"
                        loading="lazy"
                        src={
                            "https://www.google.com/maps?q=" +
                            encodeURIComponent(address) +
                            "&output=embed"
                        }
                    />
                </article>
                <article className="card contactcard arrival">
                    <h2>Jak se k nám dostat</h2>
                    <div>
                        <b>Autem</b>
                        <p>
                            Najdete nás přímo v obci Šakvice na adrese Hlavní
                            50.
                        </p>
                    </div>
                    <div>
                        <b>Půjčení a vrácení kol</b>
                        <p>
                            Vybavení se předává v provozovně, případně po
                            předchozí domluvě doveze.
                        </p>
                    </div>
                </article>
            </div>
        </section>
    )
}

function PricingDeliveryOnly() {
    return (
        <section className="card pricingDeliveryStandalone">
            <h2>Dovoz a vyzvednutí</h2>
            <div className="priceRow">
                <span>
                    <Glyph name="pin" />
                    Předem domluvené místo
                </span>
                <strong>individuálně</strong>
            </div>
            <div className="notice pricingDeliveryNotice">
                <Glyph name="info" />
                <span>
                    Dovoz je nutné objednat předem. Cena je individuální.
                </span>
            </div>
        </section>
    )
}

function PricingIncludedOnly() {
    return (
        <section className="included pricingIncludedStandalone">
            <h2>Co je v ceně půjčovného?</h2>
            <div>
                <span>
                    <Glyph name="tool" /> Pravidelně servisované vybavení
                </span>
                <span>
                    <Glyph name="shield" /> Přilba, nářadí, hustilka a zámek
                </span>
                <span>
                    <Glyph name="map" /> Místní tipy na výlety
                </span>
                <span>
                    <Glyph name="phone" /> Telefonická podpora během výpůjčky
                </span>
            </div>
        </section>
    )
}

function PricingExtras() {
    return (
        <section className="section soft">
            <div className="wrap">
                <div className="lowerGrid">
                    <section className="card contactcard">
                        <h2>Dovoz a vyzvednutí</h2>
                        <div className="priceRow">
                            <span>Předem domluvené místo</span>
                            <strong>individuálně</strong>
                        </div>
                        <div className="notice">
                            Dovoz je nutné objednat předem. Cena je
                            individuální.
                        </div>
                    </section>
                </div>
                <section className="included">
                    <h2>Co je v ceně půjčovného?</h2>
                    <div>
                        <span>
                            <Glyph name="tool" /> Pravidelně servisované
                            vybavení
                        </span>
                        <span>
                            <Glyph name="shield" /> Přilba, nářadí, hustilka a
                            zámek
                        </span>
                        <span>
                            <Glyph name="map" /> Místní tipy na výlety
                        </span>
                        <span>
                            <Glyph name="phone" /> Telefonická podpora během
                            výpůjčky
                        </span>
                    </div>
                </section>
            </div>
        </section>
    )
}
let activeGalleryId: string | null = null
let galleryOpener: HTMLButtonElement | null = null
const galleryStateListeners = new Set<() => void>()
function setActiveGallery(id: string | null) {
    activeGalleryId = id
    galleryStateListeners.forEach((fn) => fn())
}
function useActiveGallery() {
    return React.useSyncExternalStore(
        React.useCallback((fn: () => void) => {
            galleryStateListeners.add(fn)
            return () => {
                galleryStateListeners.delete(fn)
            }
        }, []),
        () => activeGalleryId,
        () => null
    )
}

function normalizeFilter(value: unknown) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
}
function filterQuery(kind: Kind) {
    return kind === "trip"
        ? "kategorie-trasy"
        : kind === "gallery"
          ? "kategorie-galerie"
          : ""
}
function readFilter(kind: Kind) {
    if (typeof window === "undefined") return ""
    const query = filterQuery(kind)
    return query
        ? new URL(window.location.href).searchParams.get(query) || ""
        : ""
}
function useCmsFilter(kind: Kind) {
    return React.useSyncExternalStore(
        React.useCallback((notify: () => void) => {
            if (typeof window === "undefined") return () => {}
            window.addEventListener("popstate", notify)
            return () => window.removeEventListener("popstate", notify)
        }, []),
        () => readFilter(kind),
        () => ""
    )
}

function pricingCategoryPresentation(name: string) {
    const value = String(name || "")
        .trim()
        .toLowerCase()

    if (value.includes("elektro")) {
        return { title: "Elektrokolo", icon: "bolt" }
    }

    if (value.includes("dětsk") || value.includes("detsk")) {
        return { title: "Dětské kolo", icon: "child" }
    }

    if (value.includes("kolob")) {
        return { title: "Koloběžka", icon: "scooter" }
    }

    return { title: "Jízdní kolo", icon: "bike" }
}

function CmsCard(props: Props) {
    const p: any = props
    const instance = React.useId()
    const activeId = useActiveGallery()
    const selectedFilter = useCmsFilter(props.kind)
    const matchesFilter =
        !selectedFilter || normalizeFilter(label(p.category)) === selectedFilter
    const galleryItems = useCms("gallery").filter(
        (item) =>
            !selectedFilter ||
            normalizeFilter(label(item.category)) === selectedFilter
    )
    const galleryData = React.useMemo(
        () => ({
            itemId: p.itemId,
            name: p.name,
            image: p.image,
            active: p.active,
            order: p.order,
            category: p.category,
            caption: p.caption,
            alt: p.alt,
        }),
        [
            p.itemId,
            p.name,
            p.image,
            p.active,
            p.order,
            p.category,
            p.caption,
            p.alt,
        ]
    )
    React.useEffect(() => {
        if (props.kind !== "gallery" || !matchesFilter) return
        const key = p.itemId || p.name || instance
        return register("gallery", key, instance, galleryData)
    }, [props.kind, p.itemId, p.name, instance, galleryData, matchesFilter])
    const currentIndex = galleryItems.findIndex(
        (item) => (item.itemId || item.name) === activeId
    )
    const isOpen = props.kind === "gallery" && activeId === (p.itemId || p.name)
    const move = (direction: number) => {
        if (!galleryItems.length) return
        const start = currentIndex >= 0 ? currentIndex : 0
        const next =
            (start + direction + galleryItems.length) % galleryItems.length
        setActiveGallery(
            galleryItems[next]?.itemId || galleryItems[next]?.name || null
        )
    }
    const close = () => {
        setActiveGallery(null)
        if (typeof window !== "undefined")
            window.requestAnimationFrame(() => galleryOpener?.focus())
    }
    React.useEffect(() => {
        if (!isOpen || typeof window === "undefined") return
        const previousOverflow = document.body.style.overflow
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") close()
            else if (event.key === "ArrowRight") move(1)
            else if (event.key === "ArrowLeft") move(-1)
        }
        window.addEventListener("keydown", onKey)
        document.body.style.overflow = "hidden"
        return () => {
            window.removeEventListener("keydown", onKey)
            document.body.style.overflow = previousOverflow
        }
    }, [isOpen, currentIndex, galleryItems.length])
    React.useEffect(() => {
        if (isOpen && !matchesFilter) close()
    }, [isOpen, matchesFilter])
    if (props.kind === "category") {
        // HOME
        // Home uses the same CMS data but does not show a price.
        if (!props.showPrice) {
            const content = (
                <>
                    <div className="cardbody">
                        <h3>{p.name}</h3>
                        <p>{p.description}</p>
                    </div>
                    <img className="fit" src={imageSrc(p.image)} alt={p.name} />
                </>
            )

            return (
                <Link href="/pujcovna">
                    <a className="card homeCategory" aria-label={p.name}>
                        {content}
                    </a>
                </Link>
            )
        }

        // CENÍK
        // Explicit second visual version of the SAME CMS category collector.
        if (props.categoryVariant === "pricing") {
            const presentation = pricingCategoryPresentation(p.name)

            return (
                <article className="pricingCategoryCard">
                    <div className="pricingCategoryTop">
                        <span className="pricingCategoryIcon">
                            <Glyph name={presentation.icon} />
                        </span>

                        <h2>{presentation.title}</h2>
                        <p>Cena za jeden den</p>
                    </div>

                    <img
                        className="pricingCategoryImage"
                        src={imageSrc(p.image)}
                        alt={presentation.title}
                    />

                    <div className="pricingCategoryRow">
                        <span>1 den</span>
                        <strong>{p.price} Kč</strong>
                    </div>

                    <p className="pricingCategoryNote">
                        Další dny a dostupnost potvrdíme v nabídce.
                    </p>
                </article>
            )
        }

        // PŮJČOVNA
        // Default priced variant.
        return (
            <article className="card rentalCategory">
                <div className="rentalCategoryCopy">
                    <h3>{p.name}</h3>
                    <p>{p.description}</p>
                </div>

                <img
                    className="rentalCategoryImage"
                    src={imageSrc(p.image)}
                    alt={p.name}
                />

                <div className="rentalCategoryPrice">
                    <span className="rentalCategoryFrom">od</span>
                    <strong>{p.price} Kč</strong>
                    <span className="rentalCategoryPer">/ den</span>
                </div>
            </article>
        )
    }
    if (props.kind === "accessory") {
        // CENÍK
        // Compact text-only card from the coded GitHub reference.
        if (props.accessoryVariant === "pricing") {
            return (
                <article className="pricingAccessoryCard">
                    <b>{p.name}</b>
                    <span>{p.note}</span>
                    <strong>
                        {p.price ? String(p.price) + " Kč" : "zdarma"}
                    </strong>
                </article>
            )
        }

        // PŮJČOVNA
        // Image card used on the Rental page.
        return (
            <article className="card accessoryCard">
                <img className="fit" src={imageSrc(p.image)} alt={p.name} />
                <div className="cardbody">
                    <h3>{p.name}</h3>
                    <p>{p.note}</p>
                    <div className="price">
                        {p.price
                            ? String(p.price) + " Kč / den"
                            : "Zdarma ke kolu"}
                    </div>
                </div>
            </article>
        )
    }
    if (props.kind === "trip") {
        const staticFeatured = props.page === "trips"
        const home = props.page === "home"
        return staticFeatured || matchesFilter ? (
            <TripCard t={p} featured={staticFeatured} home={home} />
        ) : null
    }
    if (props.kind === "gallery")
        return matchesFilter ? (
            <>
                <button
                    type="button"
                    className={
                        "galleryitem " +
                        (props.page === "home" ? "homeGalleryItem" : "")
                    }
                    aria-label={`Otevřít fotografii: ${p.caption || p.name || "Galerie"}`}
                    onClick={(event) => {
                        galleryOpener = event.currentTarget
                        setActiveGallery(p.itemId || p.name || null)
                    }}
                >
                    <img
                        src={imageSrc(p.image)}
                        alt={p.alt || p.caption || p.name}
                    />
                    <span>{p.caption || p.name}</span>
                </button>
                {isOpen && (
                    <div
                        className="lightbox"
                        role="dialog"
                        aria-modal="true"
                        aria-label={p.caption || p.name || "Fotografie"}
                        onMouseDown={(event) => {
                            if (event.currentTarget === event.target) close()
                        }}
                    >
                        <button
                            type="button"
                            autoFocus
                            className="close"
                            onClick={close}
                            aria-label="Zavřít galerii"
                        >
                            ×
                        </button>
                        <button
                            type="button"
                            className="prev"
                            onClick={() => move(-1)}
                            aria-label="Předchozí fotografie"
                            disabled={galleryItems.length < 2}
                        >
                            ‹
                        </button>
                        <figure>
                            <img
                                src={imageSrc(p.image)}
                                alt={p.alt || p.caption || p.name}
                            />
                            <figcaption>
                                {p.caption || p.name}
                                <small>
                                    {currentIndex + 1} / {galleryItems.length}
                                </small>
                            </figcaption>
                        </figure>
                        <button
                            type="button"
                            className="next"
                            onClick={() => move(1)}
                            aria-label="Další fotografie"
                            disabled={galleryItems.length < 2}
                        >
                            ›
                        </button>
                    </div>
                )}
            </>
        ) : null
    return null
}

function Collector(props: Props) {
    const instance = React.useId()
    const key = props.itemId || props.name || "site"
    const data = React.useMemo(
        () => ({
            itemId: props.itemId,
            name: props.name,
            description: props.description,
            image: props.image,
            price: props.price,
            active: props.active,
            order: props.order,
            isMain: props.isMain,
            note: props.note,
            category: props.category,
            distance: props.distance,
            time: props.time,
            difficulty: props.difficulty,
            roadRatio: props.roadRatio,
            mapUrl: props.mapUrl,
            featured: props.featured,
            caption: props.caption,
            alt: props.alt,
            address: props.address,
            phone1: props.phone1,
            phone2: props.phone2,
            email: props.email,
            openingPeriod: props.openingPeriod,
            openingHours: props.openingHours,
            openingNote: props.openingNote,
            ctaText: props.ctaText,
        }),
        [
            props.itemId,
            props.name,
            props.description,
            props.image,
            props.price,
            props.active,
            props.order,
            props.isMain,
            props.note,
            props.category,
            props.distance,
            props.time,
            props.difficulty,
            props.roadRatio,
            props.mapUrl,
            props.featured,
            props.caption,
            props.alt,
            props.address,
            props.phone1,
            props.phone2,
            props.email,
            props.openingPeriod,
            props.openingHours,
            props.openingNote,
            props.ctaText,
        ]
    )
    React.useEffect(
        () => register(props.kind, key, instance, data),
        [props.kind, key, instance, data]
    )
    return (
        <div
            style={{ width: 1, height: 1, overflow: "hidden", opacity: 0 }}
            aria-hidden="true"
        />
    )
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function G2SitePage(props: Props) {
    const {
        page = "home",
        mode = "page",
        navigationMode = "desktop",
        hideFooter = false,
    } = props
    const shell = (node: React.ReactNode, transparent = false) => (
        <main
            className={`g2 g2-page-${page} g2-mode-${mode}`}
            style={
                transparent
                    ? {
                          background: "transparent",
                          minHeight: 0,
                          height: "fit-content",
                          overflow: "visible",
                      }
                    : undefined
            }
        >
            <style>{css}</style>
            {node}
        </main>
    )

    // CMS site collector is a data-only layer.
    // Keep its Framer/code-component wrapper fully transparent so it
    // cannot paint a rectangular background on the page.
    if (mode === "collector")
        return shell(
            <CmsCard {...props} />,
            props.kind === "site" ||
                props.kind === "category" ||
                props.kind === "accessory"
        )
    if (mode === "header")
        return shell(
            <>
                <Header page={page} navigationMode={navigationMode} />
                <Hero page={page} />
            </>
        )
    if (mode === "benefits") return shell(<Benefits />)
    if (mode === "homeHeading")
        return shell(<HomeHeading type={props.headingType} />, true)
    if (mode === "contactBand") return shell(<ContactBandProps s={props} />)
    if (mode === "contactContent") return shell(<ContactProps s={props} />)
    if (mode === "notice") return shell(<PricingDeliveryOnly />, true)
    if (mode === "included") return shell(<PricingIncludedOnly />, true)
    if (mode === "cta") return shell(<BottomCTA page={page} />)
    if (mode === "tripLead") return shell(<TripLead />)
    if (mode === "tripNotice") return shell(<TripNotice />)
    if (mode === "footer")
        return shell(<FooterProps s={props} homeStrict={props.homeStrict} />)
    let content: React.ReactNode
    if (page === "home") content = <Home />
    else if (page === "rental") content = <Rental />
    else if (page === "pricing") content = <Pricing />
    else if (page === "trips") content = <Trips />
    else if (page === "gallery")
        content = (
            <section className="section">
                <div className="wrap">
                    <Gallery />
                </div>
            </section>
        )
    else content = <Contact />
    return shell(
        <>
            <Header page={page} navigationMode={navigationMode} />
            <Hero page={page} />
            {content}
            {!hideFooter && <Footer />}
        </>
    )
}

addPropertyControls(G2SitePage, {
    mode: {
        type: ControlType.Enum,
        title: "Mode",
        options: [
            "page",
            "collector",
            "footer",
            "header",
            "benefits",
            "contactBand",
            "contactContent",
            "notice",
            "included",
            "cta",
            "tripLead",
            "tripNotice",
            "homeHeading",
        ],
        defaultValue: "page",
    },
    headingType: {
        type: ControlType.Enum,
        title: "Heading",
        options: ["categories", "trips", "gallery"],
        defaultValue: "categories",
        hidden: (p) => p.mode !== "homeHeading",
    },
    navigationMode: {
        type: ControlType.Enum,
        title: "Navigation",
        options: ["desktop", "compact"],
        optionTitles: ["Desktop", "Compact"],
        defaultValue: "desktop",
        hidden: (p) => p.mode !== "header" && p.mode !== "page",
    },
    page: {
        type: ControlType.Enum,
        title: "Page",
        options: ["home", "rental", "pricing", "trips", "gallery", "contact"],
        optionTitles: [
            "Home",
            "Půjčovna",
            "Ceník",
            "Výlety",
            "Galerie",
            "Kontakt",
        ],
        defaultValue: "home",

        // IMPORTANT:
        // Category collectors are shared between Home / Rental / Pricing.
        // The Page control must therefore be available on the collector
        // instance so each canvas instance can select its own visual variant.
        hidden: (p) => p.mode !== "page" && p.mode !== "cta",
    },
    kind: {
        type: ControlType.Enum,
        title: "CMS kind",
        options: ["category", "accessory", "trip", "gallery", "site"],
        defaultValue: "category",
        hidden: (p) => p.mode !== "collector",
    },
    hideFooter: {
        type: ControlType.Boolean,
        title: "Hide footer",
        defaultValue: false,
        hidden: (p) => p.mode !== "page",
    },
    showPrice: {
        type: ControlType.Boolean,
        title: "Show price",
        defaultValue: false,
        hidden: (p) => p.mode !== "collector",
    },
    categoryVariant: {
        type: ControlType.Enum,
        title: "Card version",
        options: ["rental", "pricing"],
        optionTitles: ["Půjčovna", "Ceník"],
        defaultValue: "rental",
        hidden: (p) =>
            p.mode !== "collector" ||
            p.kind !== "category" ||
            p.showPrice !== true,
    },
    accessoryVariant: {
        type: ControlType.Enum,
        title: "Accessory version",
        options: ["rental", "pricing"],
        optionTitles: ["Půjčovna", "Ceník"],
        defaultValue: "rental",
        hidden: (p) => p.mode !== "collector" || p.kind !== "accessory",
    },
    homeStrict: {
        type: ControlType.Boolean,
        title: "Home strict",
        defaultValue: false,
        hidden: (p) => p.mode !== "footer",
    },
    itemId: {
        type: ControlType.String,
        title: "Item ID",
        hidden: (p) => p.mode !== "collector",
    },
    name: {
        type: ControlType.String,
        title: "Name",
        hidden: (p) => p.mode !== "collector",
    },
    description: {
        type: ControlType.String,
        title: "Description",
        hidden: (p) => p.mode !== "collector",
    },
    image: {
        type: ControlType.Image,
        title: "Image",
        hidden: (p) => p.mode !== "collector",
    },
    price: {
        type: ControlType.Number,
        title: "Price",
        hidden: (p) => p.mode !== "collector",
    },
    active: {
        type: ControlType.Boolean,
        title: "Active",
        defaultValue: true,
        hidden: (p) => p.mode !== "collector",
    },
    order: {
        type: ControlType.Number,
        title: "Order",
        hidden: (p) => p.mode !== "collector",
    },
    isMain: {
        type: ControlType.Boolean,
        title: "Main",
        hidden: (p) => p.mode !== "collector",
    },
    note: {
        type: ControlType.String,
        title: "Note",
        hidden: (p) => p.mode !== "collector",
    },
    category: {
        type: ControlType.String,
        title: "Category",
        hidden: (p) => p.mode !== "collector",
    },
    distance: {
        type: ControlType.String,
        title: "Distance",
        hidden: (p) => p.mode !== "collector",
    },
    time: {
        type: ControlType.String,
        title: "Time",
        hidden: (p) => p.mode !== "collector",
    },
    difficulty: {
        type: ControlType.String,
        title: "Difficulty",
        hidden: (p) => p.mode !== "collector",
    },
    roadRatio: {
        type: ControlType.String,
        title: "Road ratio",
        hidden: (p) => p.mode !== "collector",
    },
    mapUrl: {
        type: ControlType.Link,
        title: "Map URL",
        hidden: (p) => p.mode !== "collector",
    },
    featured: {
        type: ControlType.Boolean,
        title: "Featured",
        hidden: (p) => p.mode !== "collector",
    },
    caption: {
        type: ControlType.String,
        title: "Caption",
        hidden: (p) => p.mode !== "collector",
    },
    alt: {
        type: ControlType.String,
        title: "Alt",
        hidden: (p) => p.mode !== "collector",
    },
    address: {
        type: ControlType.String,
        title: "Address",
        hidden: (p) => p.mode !== "collector",
    },
    phone1: {
        type: ControlType.String,
        title: "Phone 1",
        hidden: (p) => p.mode !== "collector",
    },
    phone2: {
        type: ControlType.String,
        title: "Phone 2",
        hidden: (p) => p.mode !== "collector",
    },
    email: {
        type: ControlType.String,
        title: "Email",
        hidden: (p) => p.mode !== "collector",
    },
    openingPeriod: {
        type: ControlType.String,
        title: "Period",
        hidden: (p) => p.mode !== "collector",
    },
    openingHours: {
        type: ControlType.String,
        title: "Hours",
        hidden: (p) => p.mode !== "collector",
    },
    openingNote: {
        type: ControlType.String,
        title: "Opening note",
        hidden: (p) => p.mode !== "collector",
    },
    ctaText: {
        type: ControlType.String,
        title: "CTA",
        hidden: (p) => p.mode !== "collector",
    },
})
