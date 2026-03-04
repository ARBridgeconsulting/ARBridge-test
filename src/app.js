const today = new Date().toISOString().slice(0, 10);

const [peopleRes, orgRes, statsRes, sourcesRes] = await Promise.all([
  fetch('data/people.json'),
  fetch('data/org.json'),
  fetch('data/stats.json'),
  fetch('data/sources.json')
]);
const people = (await peopleRes.json()).people;
const org = await orgRes.json();
const stats = (await statsRes.json()).stats;
const sources = await sourcesRes.json();

const app = document.getElementById('app');

function sourceLinks(urls) {
  return `<div class="small">Kilder: ${urls.map((u) => `<a href="${u}" target="_blank" rel="noreferrer">${u}</a>`).join(' · ')}</div>`;
}

function tag(conf) {
  return `<span class="tag ${conf}">${conf}</span>`;
}

function render() {
  app.innerHTML = `
    <section class="section" id="overblik">
      <h2>Overblik</h2>
      <p>Kort briefing om HK Hovedstaden baseret på offentligt tilgængelige kilder fra HK.dk.</p>
      <div class="summary-grid">
        ${stats.map((s) => `<article class="card"><b>${s.fields.label.value}</b><div>${s.fields.value.value}</div><div class="small">Pr. ${s.fields.asOf.value}</div>${tag(s.fields.value.confidence)}${sourceLinks(s.fields.value.sources)}</article>`).join('')}
      </div>
      <p class="small">Seneste opdatering: ${today}. Se også <a href="#metode">Metode & Kilder</a>.</p>
    </section>

    <section class="section" id="organisation">
      <h2>Organisation & Ledelse</h2>
      <p>Strukturen skelner mellem politisk ledelse (fx forperson/formænd) og daglig ledelse (ikke fuldt offentligt specificeret pr. person).</p>
      <div class="org-controls">
        <input id="search" placeholder="Søg person/rolle" aria-label="Søg person eller rolle" />
        <button id="zoom-in">Zoom +</button><button id="zoom-out">Zoom -</button>
      </div>
      <div id="chart-viewport"><div id="chart"></div></div>
    </section>

    <section class="section" id="personer">
      <h2>Personer</h2>
      <label>Filter: 
        <select id="category-filter" aria-label="Filtrer personer">
          <option>Alle</option><option>Politisk ledelse</option><option>Daglig ledelse</option><option>Udvalg</option><option>Andet</option>
        </select>
      </label>
      <table><thead><tr><th>Navn</th><th>Rolle</th><th>Kategori</th><th>Scope</th></tr></thead><tbody id="people-body"></tbody></table>
    </section>

    <section class="section" id="medlemmer">
      <h2>Medlemmer & Relation til HK (overordnet)</h2>
      <ul>
        <li>HK Hovedstaden beskrives som lokalafdeling under HK Danmark.</li>
        <li>HK's kongres er øverste myndighed i forbundet; hovedbestyrelsen er øverste myndighed mellem kongresserne.</li>
      </ul>
      ${sourceLinks(['https://www.hk.dk/omhk/fakta-om-hk','https://www.hk.dk/omhk/fakta-om-hk/politisk-ledelse/hk-danmarks-hovedbestyrelse','https://www.hk.dk/omhk/afdeling/hk-hovedstaden/om-hk-hovedstaden-original'])}
      <p>Medlemsudvikling over tid: <b>Ikke oplyst (offentligt)</b> i de anvendte kilder.</p>
    </section>

    <section class="section" id="metode">
      <h2>Metode & Kilder</h2>
      <p>Data er manuelt indsamlet fra offentlige HK-kilder. Hvert datafelt har kilde-URL og confidence-tag.</p>
      <h3>Begrænsninger</h3>
      <ul>
        <li>Ikke alle roller/personer i HK Hovedstadens daglige ledelse fremgår eksplicit med navne i åbne kilder.</li>
        <li>Politisk ståsted er sat til “Ikke oplyst”, medmindre eksplicit dokumenteret.</li>
      </ul>
      <h3>Kildeliste</h3>
      <ul>${sources.map((s) => `<li><a href="${s.url}">${s.title}</a> (besøgt: ${s.visitedAt})</li>`).join('')}</ul>
    </section>`;

  const chart = document.getElementById('chart');
  chart.innerHTML = `<div class="node" data-id="hk-danmark">HK Danmark</div><div>⬇</div><div class="node" data-id="hk-hovedstaden">HK Hovedstaden</div><div>⬇</div>${people.map((p) => `<div class="node person" data-id="${p.id}">${p.fields.name.value}<br/><span class='small'>${p.fields.title.value}</span></div>`).join('')}`;

  let scale = 1;
  document.getElementById('zoom-in').onclick = () => { scale += 0.1; chart.style.transform = `scale(${scale})`; };
  document.getElementById('zoom-out').onclick = () => { scale = Math.max(0.6, scale - 0.1); chart.style.transform = `scale(${scale})`; };

  const modal = document.getElementById('person-modal');
  const modalContent = document.getElementById('modal-content');
  document.getElementById('close-modal').onclick = () => modal.close();
  chart.querySelectorAll('.person').forEach((n) => n.addEventListener('click', () => openPerson(n.dataset.id)));

  const peopleBody = document.getElementById('people-body');
  const filter = document.getElementById('category-filter');
  function paintPeople() {
    const cat = filter.value;
    peopleBody.innerHTML = people.filter((p) => cat === 'Alle' || p.fields.category.value === cat).map((p) =>
      `<tr><td><a href="#person/${p.id}">${p.fields.name.value}</a></td><td>${p.fields.title.value}</td><td>${p.fields.category.value}</td><td>${p.fields.scope.value}</td></tr>`).join('');
  }
  filter.onchange = paintPeople;
  paintPeople();

  document.getElementById('search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    chart.querySelectorAll('.person').forEach((el) => {
      el.style.display = el.textContent.toLowerCase().includes(q) ? 'inline-block' : 'none';
    });
  });

  function openPerson(id) {
    const p = people.find((x) => x.id === id);
    if (!p) return;
    modalContent.innerHTML = `<h3>${p.fields.name.value}</h3>${Object.entries(p.fields).map(([k, v]) => `<p><b>${k}</b>: ${v.value} ${tag(v.confidence)} ${sourceLinks(v.sources)}</p>`).join('')}`;
    modal.showModal();
  }

  if (location.hash.startsWith('#person/')) openPerson(location.hash.replace('#person/', ''));
}

render();
