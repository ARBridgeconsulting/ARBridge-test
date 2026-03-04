# HK Hovedstaden – intern partnerbriefing (GitHub Pages)

Statisk briefing-site med hash-routing, felt-niveau kilder og fokus på skimmelig konsulentformidling.

## Lokal kørsel

```bash
python3 -m http.server 4173
```

Åbn `http://localhost:4173/#/overblik`

## Routing (GitHub Pages robust)

Sitet bruger hash-routing med undersider:

- `#/overblik`
- `#/organisation`
- `#/ledelse`
- `#/medlemmer`
- `#/hk-danmark`
- `#/historie`
- `#/kilder`

Dette undgår 404-problemer på GitHub Pages og virker uden server-side rewrites.

## Datafiler (single source of truth)

- `data/people.json`
- `data/org.json`
- `data/stats.json`
- `data/sources.json`

Hvert faktafelt har `value`, `sources[]` og `confidence`.

## LinkedIn-begrænsning

LinkedIn-kilden for Peter Jacques Jensen kan være login-begrænset. Derfor er detaljer kun medtaget, når de også fremgår af åbne/officielle kilder.

## Tests

```bash
node --test tests/schema.test.mjs tests/navigation.test.mjs
```
