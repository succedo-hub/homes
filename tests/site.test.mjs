import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(new URL(`../dist${path}`, import.meta.url), 'utf8');

test('alla centrala sidor är byggda', async () => {
  const pages = ['/', '/bostader/', '/bostader/4-rum-och-kok-i-parhus-i-mariehamn/', '/bostader/objekt/', '/publicera-annons/', '/jag-soker-bostad/', '/tjanster/', '/om-oss/', '/kontakt/', '/integritet/', '/villkor/', '/404.html'];
  for (const page of pages) {
    const file = page.endsWith('.html') ? page : `${page}index.html`;
    assert.ok((await stat(new URL(`../dist${file}`, import.meta.url))).isFile(), `Saknar ${file}`);
  }
});

test('objektsidan innehåller verifierade kärnfakta och ansvarsfriskrivning', async () => {
  const html = await read('/bostader/4-rum-och-kok-i-parhus-i-mariehamn/index.html');
  for (const text of ['94,1 m²', '142 500 €', '1 290 €', 'Till salu', 'Uthyres', 'Bostads Ab Svärtan', '1 januari 2027', 'tre separata sovrum', 'gemensam i bolaget som består av två lägenheter', 'tillgänglig för dialog och visning nu', 'uthyres omöblerad från 1.1.2027', 'Vissa möbler kan ingå i hyran enligt överenskommelse', 'Våningsplan 2', 'uteplatsen ligger i västerläge', 'mindre odlingar och samvaro', 'annonsplattform']) assert.match(html, new RegExp(text, 'i'));
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /action="https:\/\/formspree.io\/f\/xbgjrepy"/);
});

test('bostadssökande kan lämna kontaktuppgifter via Formspree', async () => {
  const html = await read('/jag-soker-bostad/index.html');
  assert.match(html, /action="https:\/\/formspree.io\/f\/xbgjrepy"/);
  for (const field of ['namn', 'email', 'telefon', 'onskat_omrade', 'meddelande']) assert.match(html, new RegExp(`name="${field}"`));
});

test('annonsörer kan skicka sälj- och hyresobjekt för granskning', async () => {
  const html = await read('/publicera-annons/index.html');
  for (const field of ['listing_type', 'property_type', 'title', 'sale_price', 'monthly_rent', 'description', 'images', 'contact_email', 'privacy_consent']) assert.match(html, new RegExp(`name="${field}"`));
  assert.match(html, /väntar på granskning/i);
});

test('startsidan har grundläggande SEO och ingen spårning', async () => {
  const html = await read('/index.html');
  assert.match(html, /<html lang="sv">/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /property="og:title"/);
  assert.doesNotMatch(html, /googletagmanager|analytics|cookie/i);
  assert.match(html, /Hitta hem/);
  assert.match(html, /Skapa synlighet/);
  assert.match(html, /Publicera annons/);
  assert.match(html, /homes-ax-icon-light\.svg/);
});
