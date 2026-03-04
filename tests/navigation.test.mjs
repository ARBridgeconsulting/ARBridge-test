import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');

const expectedAnchors = [
  '#overblik',
  '#organisation',
  '#personer',
  '#medlemmer',
  '#metode'
];

test('navigation indeholder alle hovedsektioner', () => {
  expectedAnchors.forEach((anchor) => {
    assert.ok(html.includes(`href="${anchor}"`), `Manglende anchor ${anchor}`);
  });
});

test('modal til personvisning findes', () => {
  assert.ok(html.includes('id="person-modal"'));
});
