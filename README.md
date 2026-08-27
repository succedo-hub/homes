# Åland Homes

Lanseringsbar MVP för Åland Homes – en svensk, statiskt genererad innehållswebbplats för privata bostadsannonser, hyresobjekt och framtida bostadstjänster på Åland.

Åland Homes är en digital annonsplattform och agerar inte som fastighetsmäklare eller part i en affär.

## Teknisk lösning

- Astro 7 och strikt TypeScript
- statiskt genererade sidor utan databas, CMS, konton eller klientramverk
- Astro Assets för responsiva WebP-bilder och stabila bilddimensioner
- Cloudflare Workers Static Assets via Wrangler 4
- vanlig CSS med ett litet, logobaserat designsystem

Astro valdes för mycket liten mängd JavaScript, stark SEO och enkel statisk publicering. Cloudflare-konfigurationen följer aktuell dokumentation för Workers Static Assets: `dist` distribueras som statiska assets och `not_found_handling: "404-page"` använder den genererade 404-sidan. `compatibility_date` är implementeringsdatumet 2026-08-27.

## Lokal utveckling

Krav: Node.js 22.12 eller senare.

```bash
npm ci
npm run dev
```

Kvalitetskontroller:

```bash
npm run lint
npm run check
npm run build
npm test
npm run deploy:dry
```

`npm test` körs efter ett lyckat bygge och verifierar centrala routes, bostadsfakta, metadata och frånvaro av spårning.

## Innehåll och bilder

Bostaden finns typad i `src/data/property.ts`. Den kan byggas ut eller ersättas med en content collection när fler objekt tillkommer. Fakta kommer från `BAB-Svartan.pdf` samt projektbriefen. Äldre ägarkostnader från prospektet visas inte som hyreskostnader.

Åtta unika bostadsbilder används. Den exakta dubbletten av vardagsrumsbilden är borttagen. Originalfilerna bevaras i `src/assets`, medan Astro genererar responsiva optimerade varianter vid bygge. Logotypens original bevaras och en WebP-version genereras för sidhuvudet. Prospektet innehöll ingen planritning med tillräcklig kvalitet – sidorna 4–5 är bildmontage – så ingen planritning publiceras.

## Cloudflare

Kontrollera autentisering och gör först en torrkörning:

```bash
npx wrangler whoami
npm run deploy:dry
```

Publicera därefter till standardadressen på `workers.dev`:

```bash
npm run deploy
```

För slutlig domän konfigureras en Custom Domain i Cloudflare för Worker-projektet `aland-homes`. Källkoden innehåller inga nycklar, tokens, konto-ID:n eller DNS-inställningar. `site` i `astro.config.mjs`, canonical-länkar och sitemap är satta till `https://homes.ax`; ändra endast om den slutliga produktionsdomänen blir en annan.

## Kända begränsningar

- endast ett bostadsobjekt är publicerat
- publicering och intresseanmälan sker via `mailto:`
- tjänsteleverantörer, priser, omdömen och statistik publiceras inte ännu
- ingen analys eller icke-nödvändiga cookies används
