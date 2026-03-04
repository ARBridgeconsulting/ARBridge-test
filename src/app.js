import { TOKENS } from './design-system.js';
import { card, confidenceTag, section, sourceLinks } from './components/ui.js';

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
const root = document.querySelector('#app');

document.documentElement.style.setProperty('--primary', TOKENS.colors.primary);

autoRender();

function autoRender() {
  const today = new Date().toISOString().slice(0, 10);
  const hkstaden = org.entities.find((x) => x.id === 'hk-hovedstaden');

  root.innerHTML = [
    `<section class="hero" id="overblik">
      <p class="eyebrow">Intern partnerbriefing</p>
      <h1>HK Hovedstaden – faktabaseret overblik</h1>
      <p class="lead">Sammenfattet beslutningsunderlag til rådgivning. Alle faktablokke har feltvise kilder og confidence-tags.</p>
      <div class="hero-meta"><span>Senest opdateret: ${today}</span><a href="#metode">Se metode & kilder</a></div>
    </section>`,

    section(
      'kpi',
      'Nøgletal',
      `<div class="kpi-grid">${stats
        .map((s) =>
          card({
            title: s.fields.label.value,
            body: String(s.fields.value.value),
            meta: `Pr. ${s.fields.asOf.value}`,
            confidence: s.fields.value.confidence,
            sources: s.fields.value.sources
          })
        )
        .join('')}</div>`
    ),

    section(
      'organisation',
      'Organisation & Ledelse',
      `<div class="layout-two">
        <div>
          <p><b>Struktur:</b> HK Hovedstaden er en lokalafdeling under HK Danmark. Repræsentantskabet er øverste myndighed i HK Hovedstaden.</p>
          ${sourceLinks([
            'https://www.hk.dk/omhk/organisationen',
            'https://www.hk.dk/omhk/afdeling/hk-hovedstaden/om-hk-hovedstaden-original'
          ])}
          <div class="profile-focus">
            <h3>Ledelsesprofil: Peter Shaques Jensen (kilde-check)</h3>
            ${renderPerson('peter-jacques-jensen')}
          </div>
        </div>
        <div>
          <figure class="diagram">
            <img src="./assets/orgdiagram.svg" alt="Organisationsdiagram HK Hovedstaden" id="org-image" />
            <figcaption>Redaktionel visualisering baseret på officielle HK-kilder.</figcaption>
            ${sourceLinks(['https://www.hk.dk/omhk/organisationen', 'https://www.hk.dk/omhk/afdeling/hk-hovedstaden/om-hk-hovedstaden-original'])}
            <button id="open-diagram" class="btn">Forstør diagram</button>
          </figure>
        </div>
      </div>`
    ),

    section(
      'personer',
      'Personer',
      `<div class="toolbar"><input id="person-search" placeholder="Søg navn/rolle" aria-label="Søg personer"/><select id="person-filter" aria-label="Filtrer kategori"><option>Alle</option><option>Politisk ledelse</option><option>Daglig ledelse</option><option>Udvalg</option><option>Andet</option></select></div>
      <div id="people-list" class="people-grid"></div>`
    ),

    section(
      'medlemmer',
      'Medlemmer & Relation til HK Danmark',
      `<div class="cards-3">
        ${card({
          title: 'HK overordnet struktur',
          body: 'HK er organiseret i flere sektorer. Hovedbestyrelsen er øverste myndighed mellem kongresserne.',
          confidence: 'Bekræftet',
          sources: [
            'https://www.hk.dk/omhk/organisationen',
            'https://www.hk.dk/omhk/fakta-om-hk/politisk-ledelse/hk-danmarks-hovedbestyrelse'
          ]
        })}
        ${card({
          title: 'Medlemsprofiler',
          body: 'HK repræsenterer bl.a. kontor, handel, it, økonomi, kommunikation, sundhed og service.',
          confidence: 'Bekræftet',
          sources: ['https://www.hk.dk/omhk/fakta-om-hk/hks-medlemmer']
        })}
        ${card({
          title: 'Historisk kontekst',
          body: 'HK-historien beskriver bl.a. forbundets stiftelse i 1900 og udvikling over 125 år.',
          confidence: 'Bekræftet',
          sources: ['https://www.hk.dk/omhk/fakta-om-hk/historie']
        })}
      </div>
      <p class="note">Politisk ståsted for enkeltpersoner: <b>Ikke oplyst</b> i de anvendte officielle kilder.</p>`
    ),

    section(
      'tilbud',
      'HK Hovedstadens tilbud',
      `<div class="cards-3">
        ${card({
          title: 'Branchenetværk og klubber',
          body: hkstaden.fields.offersNetworking.value,
          confidence: hkstaden.fields.offersNetworking.confidence,
          sources: hkstaden.fields.offersNetworking.sources
        })}
        ${card({
          title: 'Jobbørs',
          body: hkstaden.fields.offersJobboard.value,
          confidence: hkstaden.fields.offersJobboard.confidence,
          sources: hkstaden.fields.offersJobboard.sources
        })}
        ${card({
          title: 'Kurser',
          body: hkstaden.fields.offersCourses.value,
          confidence: hkstaden.fields.offersCourses.confidence,
          sources: hkstaden.fields.offersCourses.sources
        })}
      </div>`
    ),

    section(
      'metode',
      'Metode & Kilder',
      `<p>Data er indsamlet manuelt fra offentlige kilder. Hvert felt i datasættet har mindst én kilde-URL.</p>
       <ul class="source-list">${sources
         .map(
           (s) =>
             `<li><h3>${s.title}</h3><p><a href="${s.url}" target="_blank" rel="noreferrer">${s.url}</a></p><p class="meta">Besøgt: ${s.visitedAt} · Understøtter: ${s.supports.join(', ')}</p></li>`
         )
         .join('')}</ul>
       <p class="note">Begrænsning: detaljeret baggrund/ansvar for Peter Jacques Jensen fremgår ikke eksplicit i de anvendte åbne kilder.</p>`
    )
  ].join('');

  bindPeople();
  bindDiagramModal();
}

function renderPerson(id) {
  const p = people.find((x) => x.id === id);
  if (!p) return '<p>Ikke oplyst (offentligt)</p>';
  return `<div class="person-detail">${Object.entries(p.fields)
    .map(([k, v]) => `<p><b>${k}</b>: ${v.value} ${confidenceTag(v.confidence)} ${sourceLinks(v.sources)}</p>`)
    .join('')}</div>`;
}

function bindPeople() {
  const list = document.querySelector('#people-list');
  const search = document.querySelector('#person-search');
  const filter = document.querySelector('#person-filter');

  function paint() {
    const q = search.value.toLowerCase();
    const cat = filter.value;
    list.innerHTML = people
      .filter((p) => (cat === 'Alle' || p.fields.category.value === cat) && `${p.fields.name.value} ${p.fields.title.value}`.toLowerCase().includes(q))
      .map(
        (p) => `<button class="person-card" data-person="${p.id}"><h3>${p.fields.name.value}</h3><p>${p.fields.title.value}</p>${confidenceTag(
          p.fields.title.confidence
        )}</button>`
      )
      .join('');

    list.querySelectorAll('[data-person]').forEach((btn) => {
      btn.addEventListener('click', () => openPersonModal(btn.getAttribute('data-person')));
    });
  }

  search.addEventListener('input', paint);
  filter.addEventListener('change', paint);
  paint();
}

function bindDiagramModal() {
  const btn = document.querySelector('#open-diagram');
  if (!btn) return;
  btn.addEventListener('click', () => openDiagramModal());
}

function openPersonModal(personId) {
  const p = people.find((x) => x.id === personId);
  const dialog = document.querySelector('#modal');
  const body = dialog.querySelector('.modal-body');
  body.innerHTML = `<h3>${p.fields.name.value}</h3>${Object.entries(p.fields)
    .map(([k, v]) => `<p><b>${k}</b>: ${v.value} ${confidenceTag(v.confidence)} ${sourceLinks(v.sources)}</p>`)
    .join('')}`;
  dialog.showModal();
}

function openDiagramModal() {
  const dialog = document.querySelector('#modal');
  const body = dialog.querySelector('.modal-body');
  body.innerHTML = `<h3>Organisationsdiagram</h3>
    <div class="zoom-controls"><button id="zoom-plus">+</button><button id="zoom-minus">−</button><button id="zoom-reset">Reset</button></div>
    <div class="zoom-stage" id="zoom-stage"><img src="./assets/orgdiagram.svg" id="zoom-img" alt="Organisationsdiagram forstørret"/></div>`;
  dialog.showModal();
  let zoom = 1;
  const img = body.querySelector('#zoom-img');
  body.querySelector('#zoom-plus').onclick = () => ((zoom += 0.2), (img.style.transform = `scale(${zoom})`));
  body.querySelector('#zoom-minus').onclick = () => ((zoom = Math.max(0.5, zoom - 0.2)), (img.style.transform = `scale(${zoom})`));
  body.querySelector('#zoom-reset').onclick = () => ((zoom = 1), (img.style.transform = 'scale(1)'));
}

document.querySelector('#modal-close').addEventListener('click', () => document.querySelector('#modal').close());
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') document.querySelector('#modal').close();
});
