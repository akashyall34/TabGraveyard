function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function makeTabItem(tab, graveyard, onRestore) {
  const item = document.createElement('div');
  item.className = 'tab-item';

  const img = document.createElement('span');
  img.className = 'tab-emoji';
  img.textContent = tab.favicon || '🔗';

  const info = document.createElement('div');
  info.className = 'tab-info';

  const title = document.createElement('div');
  title.className = 'tab-title';
  title.textContent = tab.title;

  const age = document.createElement('div');
  age.className = 'tab-age';
  age.textContent = `buried ${timeAgo(tab.buriedAt)}`;

  info.append(title, age);

  const btn = document.createElement('button');
  btn.className = 'restore-btn';
  btn.textContent = 'Restore';
  btn.addEventListener('click', () => onRestore(tab));

  item.append(img, info, btn);
  return item;
}

async function loadPopup() {
  const data = await chrome.storage.local.get(['graveyard']);
  const graveyard = data.graveyard || [];

  document.getElementById('count').textContent =
    `${graveyard.length} tab${graveyard.length !== 1 ? 's' : ''} buried`;

  const list = document.getElementById('tab-list');
  list.innerHTML = '';

  if (graveyard.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'Your graveyard is empty. Stale tabs will appear here.';
    list.appendChild(empty);
    return;
  }

  const recent = graveyard.slice(0, 5);
  recent.forEach(tab => {
    list.appendChild(makeTabItem(tab, graveyard, async (t) => {
      await chrome.tabs.create({ url: t.url });
      const updated = graveyard.filter(x => x.id !== t.id);
      await chrome.storage.local.set({ graveyard: updated });
      loadPopup();
    }));
  });
}

document.getElementById('open-graveyard').addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('graveyard.html') });
});

loadPopup();
