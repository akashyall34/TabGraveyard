function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

let allTabs = [];

async function loadGraveyard() {
  const data = await chrome.storage.local.get(['graveyard']);
  allTabs = data.graveyard || [];

  document.getElementById('count').textContent =
    `${allTabs.length} tab${allTabs.length !== 1 ? 's' : ''} buried`;

  renderTabs(allTabs);
}

function makeTabCard(tab) {
  const card = document.createElement('div');
  card.className = 'tab-card';
  card.dataset.id = tab.id;

  const img = document.createElement('span');
  img.className = 'tab-emoji';
  img.textContent = tab.favicon || '🔗';

  const info = document.createElement('div');
  info.className = 'tab-info';

  const title = document.createElement('div');
  title.className = 'tab-title';
  title.textContent = tab.title;

  const url = document.createElement('div');
  url.className = 'tab-url';
  url.textContent = tab.url;

  info.append(title, url);

  const age = document.createElement('span');
  age.className = 'tab-age';
  age.textContent = timeAgo(tab.buriedAt);

  const restoreBtn = document.createElement('button');
  restoreBtn.className = 'restore-btn';
  restoreBtn.textContent = 'Restore';
  restoreBtn.addEventListener('click', async () => {
    await chrome.tabs.create({ url: tab.url });
    await removeTab(tab.id);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', async () => {
    await removeTab(tab.id);
  });

  card.append(img, info, age, restoreBtn, deleteBtn);
  return card;
}

function renderTabs(tabs) {
  const grid = document.getElementById('tab-grid');
  grid.innerHTML = '';

  if (tabs.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'The graveyard is empty. Nothing is lost here.';
    grid.appendChild(empty);
    return;
  }

  tabs.forEach(tab => grid.appendChild(makeTabCard(tab)));
}

async function removeTab(id) {
  allTabs = allTabs.filter(t => t.id !== id);
  await chrome.storage.local.set({ graveyard: allTabs });
  loadGraveyard();
}

document.getElementById('search').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const filtered = allTabs.filter(t =>
    t.title.toLowerCase().includes(query) ||
    t.url.toLowerCase().includes(query)
  );
  renderTabs(filtered);
});

loadGraveyard();
