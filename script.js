// Lightweight rendering + email protection
document.getElementById('year').textContent = new Date().getFullYear();

// Email obfuscation
const user = 'js3320'; // change if needed
const host = 'ic.ac.uk'; // change if needed
const address = `${user}@${host}`;
document.getElementById('email').setAttribute('href', `mailto:${address}`);
document.getElementById('email').textContent = 'Email';
document.getElementById('email-inline').textContent = address;

// Load JSON data for news, projects, pubs
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    return await res.json();
  } catch (e) {
    return null;
  }
}
function el(tag, attrs={}, children=[]) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else n.setAttribute(k, v);
  });
  children.forEach(c => n.appendChild(c));
  return n;
}

(async () => {
  const news = await loadJSON('news.json') || [];
  const newsList = document.getElementById('news-list');
  news.forEach(item => {
    const li = el('li', {}, [
      el('span', {}, [document.createTextNode('• ')]),
      el('time', {}, [document.createTextNode(item.date)]),
      el('span', {}, [document.createTextNode(item.text)]),
    ]);
    newsList.appendChild(li);
  });

  const projects = await loadJSON('projects.json') || [];
  const container = document.getElementById('projects');
  projects.forEach(p => {
    const card = el('div', {class: 'card'}, [
      el('h3', {}, [document.createTextNode(p.title)]),
      el('p', {}, [document.createTextNode(p.summary)]),
      el('p', {}, [document.createTextNode(p.tags.join(' · '))]),
      p.link ? el('p', {html: `<a href="${p.link}" target="_blank" rel="noopener">Learn more</a>`}) : el('span')
    ]);
    container.appendChild(card);
  });

  const pubs = await loadJSON('pubs.json') || [];
  const pubsEl = document.getElementById('pubs');
  pubs.forEach((p, i) => {
    const li = el('li', {html: `<strong>${p.title}</strong> — ${p.authors} (${p.year}). ${p.venue}${p.link ? ` · <a href="${p.link}" target="_blank" rel="noopener">link</a>` : ''}`});
    pubsEl.appendChild(li);
  });
})();
