# HK Hovedstaden – Partnerbriefing (intern)

Dette projekt er et faktabaseret briefing-site på dansk om **HK Hovedstaden** til intern brug i et konsulenthus.

## Kør lokalt

```bash
python3 -m http.server 4173
```

Åbn derefter: `http://localhost:4173`

## Datastruktur (single source of truth)

- `data/people.json` – personer med felt-niveau kilder.
- `data/org.json` – organisationsenheder, relationer og roller med felt-niveau kilder.
- `data/stats.json` – nøgletal med dato/år og felt-niveau kilder.
- `data/sources.json` – samlet kildekatalog med besøgsdato.

## Opdatering af data/kilder

1. Find en offentlig, autoritativ kilde (primært `hk.dk`).
2. Tilføj kilden i `data/sources.json` (titel, URL, besøgsdato).
3. Opdater relevante felter i `people/org/stats` og angiv mindst én URL i `sources` på hvert felt.
4. Sæt `confidence` pr. felt:
   - `Bekræftet` = direkte, eksplicit oplysning i officiel kilde.
   - `Delvist bekræftet` = indirekte/afledt eller ikke fuldt specificeret.
   - `Ikke oplyst` = ikke dokumenteret offentligt.

## Tests

```bash
node --test tests/schema.test.mjs tests/navigation.test.mjs
```

- `schema.test.mjs` validerer JSON-struktur + field-level sources.
- `navigation.test.mjs` verificerer, at hovednavigation og centrale sektioner findes i UI.

## Bemærkning om stackvalg

Opgaven anbefalede Next.js/Tailwind. Miljøet tillod ikke installation fra npm registry (403), derfor er løsningen implementeret som dependency-fri statisk webapp med fokus på samme informationsarkitektur, sporbarhed og printvenlig briefing.
