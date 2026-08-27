import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(new URL(`../dist${path}`, import.meta.url), 'utf8');

test('alla centrala sidor är byggda', async () => {
  const pages = ['/', '/bostader/', '/bostader/4-rum-och-kok-i-parhus-i-mariehamn/', '/tjanster/', '/om-oss/', '/kontakt/', '/integritet/', '/villkor/', '/404.html'];
  for (const page of pages) {
    const file = page.endsWith('.html') ? page : `${page}index.html`;
    assert.ok((await stat(new URL(`../dist${file}`, import.meta.url))).isFile(), `Saknar ${file}`);
  }
});

test('objektsidan innehåller verifierade kärnfakta och ansvarsfriskrivning', async () => {
  const html = await read('/bostader/4-rum-och-kok-i-parhus-i-mariehamn/index.html');
  for (const text of ['94,1 m²', '1 290 €', 'Bostads Ab Svärtan', '1 januari 2027', 'annonsplattform']) assert.match(html, new RegExp(text));
  assert.match(html, /application\/ld\+json/);
});

test('startsidan har grundläggande SEO och ingen spårning', async () => {
  const html = await read('/index.html');
  assert.match(html, /<html lang="sv">/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /property="og:title"/);
  assert.doesNotMatch(html, /googletagmanager|analytics|cookie/i);
});
