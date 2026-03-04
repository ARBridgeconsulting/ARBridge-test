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
  assert.ok(html.includes('id="modal"'));
});
