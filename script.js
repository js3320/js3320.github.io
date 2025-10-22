// Lightweight rendering + email protection
document.getElementById('year').textContent = new Date().getFullYear();

// Email obfuscation
const user = 'jiho.shin20';
const host = 'imperial.ac.uk'
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
    const img = p.image ? el('img', { src: p.image, alt: p.title, class: 'card-img' }) : null;
    const titleLink = p.link
      ? el('a', { href: p.link, target: '_blank', rel: 'noopener' }, [document.createTextNode(p.title)])
      : document.createTextNode(p.title);

    const card = el('div', { class: 'card' }, [
      img || el('span'),
      el('h3', {}, [titleLink]),
      el('p', {}, [document.createTextNode(p.summary)]),
      p.tags && p.tags.length ? el('p', { class: 'tags' }, [document.createTextNode(p.tags.join(' · '))]) : el('span'),
      p.link ? el('p', { html: `<a href="${p.link}" target="_blank" rel="noopener">View project file</a>` }) : el('span')
    ]);
    container.appendChild(card);
  });
  const talks = await loadJSON('talks.json') || [];
  const talksEl = document.getElementById('talks');
  talks.forEach(t => {
    const li = el('li', {
      html: `<strong>${t.title}</strong> — ${t.event} (${t.year})<br>${t.summary}${t.link ? ` · <a href="${t.link}" target="_blank" rel="noopener">View poster</a>` : ''}`
    });
    talksEl.appendChild(li);
  });
  const workshops = await loadJSON('workshops.json') || [];
  const workshopsEl = document.getElementById('workshops-list');
  workshops.forEach(w => {
    const li = el('li', {
      html: `<strong>${w.title}</strong> — ${w.event} (${w.year})<br>${w.summary}${w.link ? ` · <a href="${w.link}" target="_blank" rel="noopener">View abstract</a>` : ''}`
    });
    workshopsEl.appendChild(li);
  });


})();
