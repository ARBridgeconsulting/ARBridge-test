export const sourceIcon = '🔗';

export function confidenceTag(confidence) {
  return `<span class="tag" data-confidence="${confidence}">${confidence}</span>`;
}

export function sourceLinks(urls = []) {
  return `<div class="sources">${sourceIcon} ${urls
    .map((u, i) => `<a href="${u}" target="_blank" rel="noreferrer" aria-label="Kilde ${i + 1}">Kilde ${i + 1}</a>`)
    .join(' · ')}</div>`;
}

export function card({ title, body, meta = '', confidence = '', sources = [] }) {
  return `<article class="card">
    <h3>${title}</h3>
    <p>${body}</p>
    ${meta ? `<p class="meta">${meta}</p>` : ''}
    ${confidence ? confidenceTag(confidence) : ''}
    ${sourceLinks(sources)}
  </article>`;
}

export function section(id, title, content) {
  return `<section class="section" id="${id}"><h2>${title}</h2>${content}</section>`;
}
