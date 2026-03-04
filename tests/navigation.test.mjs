import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');

const expectedAnchors = ['#/overblik', '#/organisation', '#/ledelse', '#/medlemmer', '#/hk-danmark', '#/historie', '#/kilder'];

test('navigation indeholder alle hash-routes', () => {
  expectedAnchors.forEach((anchor) => {
    assert.ok(html.includes(`href="${anchor}"`), `Manglende route ${anchor}`);
  });
});

test('modal findes i markup', () => {
const expectedAnchors = ['#overblik', '#kpi', '#organisation', '#personer', '#medlemmer', '#tilbud', '#metode'];

test('navigation indeholder alle hovedsektioner', () => {
  expectedAnchors.forEach((anchor) => {
    assert.ok(html.includes(`href="${anchor}"`), `Manglende anchor ${anchor}`);
  });
});

test('modal til person/diagram visning findes', () => {
  assert.ok(html.includes('id="modal"'));
});
