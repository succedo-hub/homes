import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(new URL(`../dist${path}`, import.meta.url), 'utf8');

test('alla centrala sidor är byggda', async () => {
  const pages = ['/', '/bostader/', '/bostader/4-rum-och-kok-i-parhus-i-mariehamn/', '/bostader/objekt/', '/publicera-annons/', '/jag-soker-bostad/', '/for-bostadsaktiebolag/', '/tjanster/', '/samarbeta/', '/om-oss/', '/kontakt/', '/integritet/', '/villkor/', '/404.html'];
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
});

test('startsidan visar bostäder, Homes Bolag och partneringång', async () => {
  const html = await read('/index.html');
  for (const text of ['Hitta hem', 'Publicera annons', 'Homes Bolag', 'Under utveckling', 'Samarbeta med oss', 'Till salu', 'Uthyres']) assert.match(html, new RegExp(text, 'i'));
  assert.match(html, /rel="canonical"/);
  assert.match(html, /property="og:title"/);
  assert.doesNotMatch(html, /googletagmanager|analytics/i);
});

test('pilot- och partnersidor är tydliga och pilotformuläret fungerar tekniskt', async () => {
  const pilot = await read('/for-bostadsaktiebolag/index.html');
  const partner = await read('/samarbeta/index.html');
  for (const text of ['Produktvy under utveckling', 'Alla uppgifter i vyn är fiktiva', 'Ekonomi', 'Dokument', 'Styrelse och disponent']) assert.match(pilot, new RegExp(text, 'i'));
  for (const field of ['roll', 'bolag', 'namn', 'email', 'meddelande']) assert.match(pilot, new RegExp(`name="${field}"`));
  assert.match(pilot, /action="https:\/\/formspree.io\/f\/xbgjrepy"/);
  assert.match(partner, /registrerad fastighetsmäklarrörelse/i);
  assert.match(partner, /mailto:info@homes.ax/i);
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
  for (const path of ['/for-bostadsaktiebolag/', '/samarbeta/', '/bostader/4-rum-och-kok-i-parhus-i-mariehamn/']) assert.match(sitemap, new RegExp(`https://homes\\.ax${path}`));
});
