# HK Hovedstaden – intern partnerbriefing (GitHub Pages)

Professionelt, kildebaseret briefing-site om HK Hovedstaden til intern brug.

## Lokal kørsel

```bash
python3 -m http.server 4173
```

Åbn: `http://localhost:4173/`

## GitHub Pages kompatibilitet

- Appen er statisk (ingen server-side runtime).
- Alle links til data/assets bruger relative stier (`./data/...`, `./assets/...`), så den virker under repo-paths som `/ARBridge-test/`.

## Datastruktur

- `data/people.json` – personer med field-level citations (`value`, `sources[]`, `confidence`).
- `data/org.json` – organisation, relationer og tilbud.
- `data/stats.json` – nøgletal med opgørelsesdato.
- `data/sources.json` – samlet kilderegister inkl. hvad kilden understøtter.

## Opdatering af indhold

1. Verificér fakta i officiel HK-kilde (offentligt tilgængelig).
2. Tilføj/ret source i `data/sources.json`.
3. Opdater felter i `people/org/stats` og behold mindst én kilde pr. felt.
4. Brug confidence:
   - `Bekræftet`
   - `Delvist bekræftet`
   - `Ikke oplyst`

## Tests

```bash
node --test tests/schema.test.mjs tests/navigation.test.mjs
```
