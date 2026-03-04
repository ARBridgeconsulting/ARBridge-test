import { card, confidenceTag, sourceLinks } from './components/ui.js';

const [peopleRes, orgRes, statsRes, sourcesRes] = await Promise.all([
  fetch('./data/people.json'),
  fetch('./data/org.json'),
  fetch('./data/stats.json'),
  fetch('./data/sources.json')
]);

const people = (await peopleRes.json()).people;
const org = await orgRes.json();
const stats = (await statsRes.json()).stats;
const sources = await sourcesRes.json();

const routes = [
  ['overblik', 'Overblik'],
  ['organisation', 'Organisation'],
  ['ledelse', 'Ledelse'],
  ['medlemmer', 'Medlemmer'],
  ['hk-danmark', 'HK Danmark'],
  ['historie', 'Historie'],
  ['kilder', 'Kilder']
];

const app = document.querySelector('#app');
const pjj = people.find((p) => p.id === 'peter-jacques-jensen');
const hkh = org.entities.find((e) => e.id === 'hk-hovedstaden');

function currentRoute() {
  const hash = location.hash.replace('#/', '').replace('#', '') || 'overblik';
  return routes.some(([r]) => r === hash) ? hash : 'overblik';
}

function navHtml(active) {
  return `<aside class="sidenav"><p class="sidenav-title">Kapitler</p>${routes
    .map(([id, label]) => `<a class="${active === id ? 'active' : ''}" href="#/${id}">${label}</a>`)
    .join('')}</aside>`;
}

function bread(active) {
  const label = routes.find(([id]) => id === active)?.[1] ?? 'Overblik';
  return `<div class="breadcrumb">Partnerbriefing / ${label}</div>`;
}

function takeaway(title, body) {
  return `<div class="takeaway"><h3>${title}</h3><p>${body}</p></div>`;
}

function pageOverblik() {
  return `
    <section class="hero">
      <p class="eyebrow">HK Hovedstaden · intern partnerbriefing</p>
      <h1>Kort beslutningsoverblik</h1>
      <p>Dette site samler verificerede fakta om HK Hovedstaden og relationen til HK Danmark i en skimmbar konsulentstruktur.</p>
      ${sourceLinks(['https://www.hk.dk/omhk/afdeling/hk-hovedstaden/om-hk-hovedstaden','https://www.hk.dk/omhk/organisationen'])}
    </section>

    <section class="section divider">
      <h2>Key takeaways</h2>
      <div class="take-grid">
        ${takeaway('HK Hovedstaden', 'Beskrives som største lokalafdeling i HK og har repræsentantskab som øverste myndighed.')}
        ${takeaway('HK Danmark', 'Kongressen er øverste myndighed; hovedbestyrelsen leder mellem kongresser.')}
        ${takeaway('Datakvalitet', 'Felt-niveau kilder er bevaret; usikre punkter markeres som Ikke oplyst.')}
      </div>
    </section>

    <section class="section divider">
      <h2>Nøgletal</h2>
      <div class="cards-3">${stats
        .map((s) => card({ title: s.fields.label.value, body: String(s.fields.value.value), meta: `Pr. ${s.fields.asOf.value}`, confidence: s.fields.value.confidence, sources: s.fields.value.sources }))
        .join('')}</div>
    </section>`;
}

function pageOrganisation() {
  const imgUrl = hkh.fields.orgDiagramImage.value;
  return `
    <section class="section divider">
      <h1>Organisation</h1>
      <p>Organisationsdiagrammet nedenfor er fra HK Hovedstadens “Om”-side og bruges her som centralt referencepunkt.</p>
      ${sourceLinks(['https://www.hk.dk/omhk/afdeling/hk-hovedstaden/om-hk-hovedstaden'])}
      <figure class="diagram-main">
        <img src="${imgUrl}" alt="HK Hovedstadens organisationsdiagram" loading="lazy" />
        <figcaption>Kilde: HK Hovedstaden (Om-side). Senest hentet: 2026-03-04.</figcaption>
      </figure>
      <div class="diagram-actions">
        <button id="open-diagram" class="btn">Åbn i lightbox</button>
      </div>
    </section>

    <section class="section divider">
      <h2>Struktur i korte træk</h2>
      <ul>
        <li>HK Hovedstaden: lokalafdeling med repræsentantskab som øverste myndighed.</li>
        <li>Repræsentantskabet består af 171 medlemmer.</li>
        <li>HK Danmark er overordnet forbundsniveau.</li>
      </ul>
      ${sourceLinks([
        'https://www.hk.dk/omhk/afdeling/hk-hovedstaden/om-hk-hovedstaden',
        'https://www.hk.dk/omhk/organisationen'
      ])}
    </section>`;
}

function pageLedelse() {
  return `
    <section class="section divider">
      <h1>Ledelse</h1>
      <div class="profile-card">
        <h2>Peter Jacques Jensen</h2>
        <p class="bio">${pjj.fields.shortBio.value}</p>
        <div class="profile-grid">
          <div><h3>Nuværende rolle</h3><p>${pjj.fields.currentRole.value} ${confidenceTag(pjj.fields.currentRole.confidence)}</p>${sourceLinks(pjj.fields.currentRole.sources)}</div>
          <div><h3>Erfaring (udvalgte)</h3><p>${pjj.fields.experienceSelected.value} ${confidenceTag(pjj.fields.experienceSelected.confidence)}</p>${sourceLinks(pjj.fields.experienceSelected.sources)}</div>
          <div><h3>Uddannelse</h3><p>${pjj.fields.education.value} ${confidenceTag(pjj.fields.education.confidence)}</p>${sourceLinks(pjj.fields.education.sources)}</div>
          <div><h3>Relevante fokusområder</h3><p>${pjj.fields.focusAreas.value} ${confidenceTag(pjj.fields.focusAreas.confidence)}</p>${sourceLinks(pjj.fields.focusAreas.sources)}</div>
        </div>
        <p class="note">${pjj.fields.nameVariantCheck.value}</p>
      </div>
      <div class="callout warn">LinkedIn er inkluderet som reference, men detaljer kan være begrænset af login.</div>
    </section>

    <section class="section divider">
      <h2>Politisk ledelse i HK Danmark (uddrag)</h2>
      <div class="cards-2">${people
        .map((p) => card({ title: p.fields.name.value, body: p.fields.currentRole?.value ?? 'Ikke oplyst', confidence: p.fields.category.confidence, sources: p.fields.category.sources }))
        .join('')}</div>
    </section>`;
}

function pageMedlemmer() {
  return `
  <section class="section divider">
    <h1>Medlemmer</h1>
    <p>HK’s medlemmer beskrives som en alsidig gruppe på tværs af kontor, handel, it, økonomi, kommunikation, sundhed og service.</p>
    ${sourceLinks(['https://www.hk.dk/omhk/fakta-om-hk/hks-medlemmer'])}
  </section>

  <section class="section divider">
    <h2>Tilbud (kildebaseret)</h2>
    <div class="cards-3">
      ${card({ title: 'Netværk og klubber', body: hkh.fields.offersNetworking.value, confidence: hkh.fields.offersNetworking.confidence, sources: hkh.fields.offersNetworking.sources })}
      ${card({ title: 'Jobhjælp', body: hkh.fields.offersJobboard.value, confidence: hkh.fields.offersJobboard.confidence, sources: hkh.fields.offersJobboard.sources })}
      ${card({ title: 'Kurser', body: hkh.fields.offersCourses.value, confidence: hkh.fields.offersCourses.confidence, sources: hkh.fields.offersCourses.sources })}
    </div>
  </section>`;
}

function pageHKDanmark() {
  const hkd = org.entities.find((e) => e.id === 'hk-danmark');
  return `
    <section class="section divider">
      <h1>HK Danmark</h1>
      <p>HK i korte træk: forbund med kongres som øverste myndighed, og hovedbestyrelsen som øverste myndighed mellem kongresser.</p>
      ${sourceLinks(['https://www.hk.dk/omhk/organisationen','https://www.hk.dk/omhk/fakta-om-hk/politisk-ledelse/hk-danmarks-hovedbestyrelse'])}
      <div class="cards-3">
        ${card({ title: 'Topmyndighed', body: hkd.fields.topAuthority.value, confidence: hkd.fields.topAuthority.confidence, sources: hkd.fields.topAuthority.sources })}
        ${card({ title: 'Mellem kongresser', body: hkd.fields.betweenCongressesAuthority.value, confidence: hkd.fields.betweenCongressesAuthority.confidence, sources: hkd.fields.betweenCongressesAuthority.sources })}
        ${card({ title: 'Sektorer', body: hkd.fields.sectors.value, confidence: hkd.fields.sectors.confidence, sources: hkd.fields.sectors.sources })}
      </div>
    </section>`;
}

function pageHistorie() {
  return `
  <section class="section divider">
    <h1>Historie</h1>
    <p>HK’s historieside beskriver bl.a. stiftelsen af hovedforbundet i 1900 og udviklingen over 125 år.</p>
    ${sourceLinks(['https://www.hk.dk/omhk/fakta-om-hk/historie'])}
  </section>

  <section class="section divider">
    <h2>Hvorfor det er relevant i briefing</h2>
    <p>Historisk kontekst bruges her til at forstå organisationsmodellen og HK’s udvikling som landsdækkende fagforbund.</p>
  </section>`;
}

function pageKilder() {
  return `
    <section class="section divider">
      <h1>Kilder</h1>
      <ul class="source-list">${sources
        .map((s) => `<li><h3>${s.title}</h3><p><a href="${s.url}" target="_blank" rel="noreferrer">${s.url}</a></p><p class="meta">Dato hentet: ${s.visitedAt}</p><p class="meta">Understøtter: ${s.supports.join(', ')}</p></li>`)
        .join('')}</ul>
      <div class="callout warn">Begrænsning: LinkedIn kan kræve login; profilerelaterede detaljer er derfor kun brugt, hvis de også kunne bekræftes i åbne kilder.</div>
    </section>`;
}

function renderRoute() {
  const route = currentRoute();
  const pages = {
    overblik: pageOverblik,
    organisation: pageOrganisation,
    ledelse: pageLedelse,
    medlemmer: pageMedlemmer,
    'hk-danmark': pageHKDanmark,
    historie: pageHistorie,
    kilder: pageKilder
  };

  app.innerHTML = `<div class="layout">${navHtml(route)}<div class="content">${bread(route)}${pages[route]()}<div class="next-links">${nextLinks(route)}</div></div></div>`;
  bindDynamic();
}

function nextLinks(route) {
  const idx = routes.findIndex(([r]) => r === route);
  const prev = routes[idx - 1];
  const next = routes[idx + 1];
  return `<div class="pager">${prev ? `<a href="#/${prev[0]}">← ${prev[1]}</a>` : ''}${next ? `<a href="#/${next[0]}">${next[1]} →</a>` : ''}</div>`;
}

function bindDynamic() {
  const btn = document.querySelector('#open-diagram');
  if (btn) btn.addEventListener('click', openDiagramModal);
}

function openDiagramModal() {
  const dialog = document.querySelector('#modal');
  const body = dialog.querySelector('.modal-body');
  const imageUrl = hkh.fields.orgDiagramImage.value;
  body.innerHTML = `<h3>Organisationsdiagram (HK Hovedstaden)</h3>
  ${sourceLinks(['https://www.hk.dk/omhk/afdeling/hk-hovedstaden/om-hk-hovedstaden'])}
  <div class="zoom-controls"><button id="zoom-in">+</button><button id="zoom-out">−</button><button id="zoom-reset">Reset</button></div>
  <div class="zoom-stage"><img id="zoom-img" src="${imageUrl}" alt="Organisationsdiagram forstørret"/></div>`;
  dialog.showModal();

  let z = 1;
  const img = body.querySelector('#zoom-img');
  body.querySelector('#zoom-in').onclick = () => { z += 0.2; img.style.transform = `scale(${z})`; };
  body.querySelector('#zoom-out').onclick = () => { z = Math.max(0.6, z - 0.2); img.style.transform = `scale(${z})`; };
  body.querySelector('#zoom-reset').onclick = () => { z = 1; img.style.transform = 'scale(1)'; };
}

document.querySelector('#modal-close').addEventListener('click', () => document.querySelector('#modal').close());
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelector('#modal').close(); });
window.addEventListener('hashchange', renderRoute);

if (!location.hash || location.hash === '#') location.hash = '#/overblik';
renderRoute();
