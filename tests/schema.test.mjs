import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const people = JSON.parse(fs.readFileSync('data/people.json', 'utf8')).people;
const org = JSON.parse(fs.readFileSync('data/org.json', 'utf8'));
const stats = JSON.parse(fs.readFileSync('data/stats.json', 'utf8')).stats;

function validateFields(fields) {
  for (const value of Object.values(fields)) {
    assert.ok('sources' in value, 'Field mangler sources');
    assert.ok(Array.isArray(value.sources) && value.sources.length >= 1, 'sources skal have mindst én URL');
    assert.ok(value.confidence, 'Field mangler confidence');
  }
}

test('alle people-felter har field-level sources', () => {
  people.forEach((p) => validateFields(p.fields));
});

test('alle org-felter har field-level sources', () => {
  org.entities.forEach((e) => validateFields(e.fields));
  org.relations.forEach((r) => validateFields(r.fields));
});

test('alle stats-felter har field-level sources', () => {
  stats.forEach((s) => validateFields(s.fields));
});
