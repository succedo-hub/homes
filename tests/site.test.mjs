import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(new URL(`../dist${path}`, import.meta.url), 'utf8');

test('alla centrala sidor är byggda', async () => {
  const pages = ['/', '/bostader/', '/bostader/4-rum-och-kok-i-parhus-i-mariehamn/', '/bostader/objekt/', '/publicera-annons/', '/jag-soker-bostad/', '/bolag-forvaltning/', '/for-bostadsaktiebolag/', '/for-fastighetsagare/', '/koti-bo/', '/tjanster/', '/samarbeta/', '/om-oss/', '/kontakt/', '/integritet/', '/villkor/', '/404.html'];
  for (const page of pages) {
    const file = page.endsWith('.html') ? page : `${page}index.html`;
    assert.ok((await stat(new URL(`../dist${file}`, import.meta.url))).isFile(), `Saknar ${file}`);
  }
});

test('objektsidan behåller kärnfakta, priser, bilder och direktkontakt', async () => {
  const html = await read('/bostader/4-rum-och-kok-i-parhus-i-mariehamn/index.html');
  for (const text of ['94,1 m²', 'cirka 98 m² med teknikrum', '245 000 €', '1 290 €', 'Till salu', 'Uthyres', 'Bostads Ab Svärtan', 'tre separata sovrum', 'master bedroom har ett eget förråd/closet med fönster', 'gemensam fristående bastu', '1 december 2026', 'två månaders uppsägningstid', 'Värme, vatten och sophantering ingår', 'Bruksel tillkommer', 'legotomten', '2,80 euro per kvadratmeter', 'Entrén till bostaden', 'Sovrum 3', 'anton.strandvik@gmail.com']) assert.match(html, new RegExp(text, 'i'));
  assert.doesNotMatch(html, /mekanisk ventilation|Köp sker med offentligt köpvittne/i);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /action="https:\/\/formspree.io\/f\/xbgjrepy"/);
  assert.match(html, /vidarebefordras automatiskt till annonsören/i);
});

test('jag söker bostad har ingen manuell insamling eller väntelista', async () => {
  const html = await read('/jag-soker-bostad/index.html');
  assert.match(html, /Se aktuella bostäder/i);
  assert.match(html, /ingen väntelista/i);
  assert.doesNotMatch(html, /<form|name="onskat_omrade"/i);
});

test('annonsflödet bevaras och förklarar innehållsgranskningen', async () => {
  const html = await read('/publicera-annons/index.html');
  for (const field of ['listing_type', 'property_type', 'title', 'sale_price', 'monthly_rent', 'description', 'images', 'contact_email', 'privacy_consent']) assert.match(html, new RegExp(`name="${field}"`));
  assert.match(html, /väntar på granskning/i);
  assert.match(html, /inte en faktakontroll/i);
  assert.match(html, /rätt att använda bilderna/i);
  assert.match(html, /sociala medier/i);
  assert.match(html, /riktad annonsering/i);
});

test('startsidan prioriterar bostäder och visar de tre affärsområdena', async () => {
  const html = await read('/index.html');
  for (const text of ['Bostäder och boendetjänster på Åland', 'Kostnadsfria bostadsannonser', 'Direktkontakt med annonsören', 'Publicera bostadsannons kostnadsfritt', 'Bolag &amp; förvaltning', 'Koti\/bo', 'För fastighetsägare', 'Till salu', 'Uthyres', 'Varför Homes.ax']) assert.match(html, new RegExp(text, 'i'));
  assert.match(html, /inte en fastighetsmäklare/i);
  assert.doesNotMatch(html, /under utveckling|pilot|planeras/i);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /name="twitter:description"/);
  assert.match(html, /name="robots" content="index, follow, max-image-preview:large"/);
  assert.doesNotMatch(html, /googletagmanager|analytics/i);
});

test('bolags-, Koti/bo- och partnersidor är tydliga och kontaktformulären fungerar', async () => {
  const hub = await read('/bolag-forvaltning/index.html');
  const company = await read('/for-bostadsaktiebolag/index.html');
  const owner = await read('/for-fastighetsagare/index.html');
  const koti = await read('/koti-bo/index.html');
  const partner = await read('/samarbeta/index.html');
  for (const text of ['Digitala verktyg', 'Personlig kompetens', 'Bostadsaktiebolag', 'Fastighetsägare']) assert.match(hub, new RegExp(text, 'i'));
  for (const text of ['Koti/bo', 'Ekonomi och bokföringsunderlag', 'Lägenheter och vederlag', 'Styrelsearbete', 'Disponenttjänster', 'Administration', 'Bokföring']) assert.match(company, new RegExp(text, 'i'));
  for (const text of ['Ekonomi och verifikat', 'Dokument', 'Rapporter och uppföljning', 'digital produkt']) assert.match(koti, new RegExp(text, 'i'));
  for (const text of ['fastighetsägare', 'Typ av fastigheter', 'Antal lägenheter eller lokaler', 'inte.*komplett system för hyresadministration']) assert.match(owner, new RegExp(text, 'is'));
  assert.doesNotMatch(company, /under utveckling|pilot|planerat för/i);
  for (const field of ['roll', 'bolag', 'namn', 'email', 'meddelande']) assert.match(company, new RegExp(`name="${field}"`));
  assert.match(company, /action="https:\/\/formspree.io\/f\/xbgjrepy"/);
  assert.match(partner, /bostadsaktiebolag/i);
  assert.match(partner, /mailto:info@homes.ax/i);
});

test('tjänstesidan skiljer på produkt, professionella uppdrag och partnerarbete', async () => {
  const html = await read('/tjanster/index.html');
  for (const text of ['Bostadsfotografering', 'Bostadsmarknadsföring', 'Bokföring', 'Disponentfunktioner', 'Offentligt köpvittne', 'Juridisk konsultation', 'Energideklaration', 'Flyttstädning', 'Erbjuder ni en relevant tjänst']) assert.match(html, new RegExp(text, 'i'));
  for (const text of ['Digital produkt', 'Professionellt uppdrag', 'Via ansvarig partner', 'Status', 'Utförare']) assert.match(html, new RegExp(text, 'i'));
  assert.doesNotMatch(html, /Planeras|Under utveckling/i);
  assert.match(html, /lucide-camera/i);
});

test('juridisk part, roller och differentierad affärsmodell är konsekventa', async () => {
  const pages = await Promise.all(['/index.html', '/om-oss/index.html', '/villkor/index.html', '/integritet/index.html'].map(read));
  for (const html of pages) {
    assert.match(html, /Succedo Invest &amp; Consulting Ab/i);
    assert.match(html, /2496398-7/);
    assert.match(html, /Sprint Nordic/i);
  }
  const terms = pages[2];
  assert.match(terms, /Publicering av bostadsannons är kostnadsfri/i);
  assert.match(terms, /kan vara betalda/i);
  assert.doesNotMatch(terms, /Verksamheten drivs inte i syfte att få inkomst/i);
});

test('sitemap innehåller nya publika sidor och befintlig objektslug', async () => {
  const sitemap = await readFile(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8');
  for (const path of ['/bolag-forvaltning/', '/for-bostadsaktiebolag/', '/for-fastighetsagare/', '/koti-bo/', '/samarbeta/', '/bostader/4-rum-och-kok-i-parhus-i-mariehamn/']) assert.match(sitemap, new RegExp(`https://homes\\.ax${path}`));
});
