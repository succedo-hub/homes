# Homes.ax

Version 1.0 av Homes.ax – en svensk bostadsplattform för privata sälj- och hyresobjekt på Åland.

Homes.ax är en digital annonsplattform och agerar inte som fastighetsmäklare eller part i en affär.

## Teknisk lösning

- Astro 7 och strikt TypeScript
- statiskt genererade sidor med dynamiska, publicerade objekt från Supabase
- Supabase Postgres, Storage och en validerande Edge Function för annonsinlämning
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

## Supabase och granskningsflöde

Databasmigrationerna finns i `supabase/migrations`. Edge Function-koden finns i `supabase/functions/submit-listing`.

Besökaren skickar ett objekt till Edge Functionen, som alltid sparar det med status `pending`. Den publika Supabase-nyckeln kan endast läsa objekt med status `published` och kan inte skriva direkt till tabellerna. Kontaktuppgifter ligger i `listing_contacts`, som saknar publik läsbehörighet. Bilder lagras i den privata bucketen `listing-images` och kan bara hämtas när det kopplade objektet är publicerat.

Godkännande i version 1.0:

1. Öppna `homes-production` i Supabase.
2. Kontrollera raden i `listings`, motsvarande kontakt i `listing_contacts` och bilder i Storage.
3. Sätt `status` till `published` och `published_at` till aktuell tid för att publicera.
4. Sätt status till `rejected` eller `archived` när objektet inte ska visas.

Administratör och mottagare av Formspree-aviseringar är `anton.strandvik@gmail.com`.

## Innehåll och bilder

Bostaden finns typad i `src/data/property.ts`. Den kan byggas ut eller ersättas med en content collection när fler objekt tillkommer. Fakta kommer från `BAB-Svartan.pdf` samt projektbriefen. Äldre ägarkostnader från prospektet visas inte som hyreskostnader.

Åtta unika bostadsbilder används. Den exakta dubbletten av vardagsrumsbilden är borttagen. Originalfilerna bevaras i `src/assets`, medan Astro genererar responsiva optimerade varianter vid bygge. Logotypens original bevaras och en WebP-version genereras för sidhuvudet. Prospektet innehöll ingen planritning med tillräcklig kvalitet – sidorna 4–5 är bildmontage – så ingen planritning publiceras.

## Cloudflare

### Workers Builds via GitHub

I **Cloudflare Dashboard → Workers & Pages → aland-homes → Settings → Build** ska följande värden användas:

| Inställning | Värde |
| --- | --- |
| Production branch | `main` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Non-production branch deploy command | `npx wrangler versions upload` |
| Root directory | `/` eller tomt |

`dist/` skapas av Astro-kommandot i byggsteget och läses därefter av Wrangler. Cloudflare Workers Builds använder inte `build.command` från `wrangler.jsonc`, så byggkommandot måste anges i dashboardens Build settings. Produktionsbygget fungerar först efter att webbplatsens PR har slagits samman till `main`; feature-branchen kan användas som preview innan dess.

Efter att Build settings har sparats ska en **ny build** startas. Att bara återköra en äldre build kan använda inställningarna som var aktiva när den körningen skapades.

### Lokal eller extern CI-driftsättning

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

- annonsgodkännande görs tills vidare i Supabase-panelen
- dynamiska objektsidor använder en frågeparameter och är därför märkta `noindex` i version 1.0
- tjänsteleverantörer, priser, omdömen och statistik publiceras inte ännu
- ingen analys eller icke-nödvändiga cookies används
