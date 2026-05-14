// Track when a tab was last visited
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  
  if (!tab.url || tab.url.startsWith('chrome://')) {
    return;
  }

  const visits = await getVisits();
  visits[activeInfo.tabId] = {
    url: tab.url,
    title: tab.title || tab.url,
    favicon: tab.favIconUrl || '',
    lastVisited: Date.now()
  };
  
  await chrome.storage.local.set({ tab_visits: visits });
});

// Helper to get all visit data
async function getVisits() {
  const result = await chrome.storage.local.get(['tab_visits']);
  return result.tab_visits || {};
}

// Run a check every hour
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('checkStaleTabs', { periodInMinutes: 60 }); // set to 1 minute for testing extension
});

// When the alarm fires, check for stale tabs
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'checkStaleTabs') {
    checkStaleTabs();
  }
});

// checks stale tabs
async function checkStaleTabs() {
  const settings = await getSettings();
  const visits = await getVisits();
  const allTabs = await chrome.tabs.query({});
  
  const cutoff = Date.now() - (settings.daysUntilBurial * 24 * 60 * 60 * 1000);

  for (const tab of allTabs) {
    if (!tab.url || tab.url.startsWith('chrome://')) continue;
    if (tab.active) continue; // never bury the tab you're currently on

    const visit = visits[tab.id];
    if (visit && visit.lastVisited < cutoff) { // if last visited is before 3 days, save to graveyard
      await buryTab(tab.id, visit);
    }
  }
}

async function getSettings() {
  const result = await chrome.storage.local.get(['settings']);
  return { daysUntilBurial: 3, ...result.settings };
}

// bury tab
async function buryTab(tabId, tabInfo) {
  const graveyard = await getGraveyard();

  // Don't bury duplicates
  const alreadyBuried = graveyard.some(t => t.url === tabInfo.url);
  if (alreadyBuried) {
    await chrome.tabs.remove(tabId).catch(() => {});
    return;
  }

  graveyard.unshift({
    id: Math.random().toString(36).slice(2),
    url: tabInfo.url,
    title: tabInfo.title,
    favicon: getCategoryIcon(tabInfo.url),
    buriedAt: Date.now(),
    lastVisited: tabInfo.lastVisited
  });

  await saveGraveyard(graveyard);
  await chrome.tabs.remove(tabId).catch(() => {});
}

async function getGraveyard() {
  const result = await chrome.storage.local.get(['graveyard']);
  return result.graveyard || [];
}

async function saveGraveyard(graveyard) {
  await chrome.storage.local.set({ graveyard });
}

// When extension loads, record all currently open tabs
chrome.runtime.onInstalled.addListener(async () => {
  const tabs = await chrome.tabs.query({});
  const visits = await getVisits();
  
  for (const tab of tabs) {
    if (!tab.url || tab.url.startsWith('chrome://')) continue;
    visits[tab.id] = {
      url: tab.url,
      title: tab.title || tab.url,
      favicon: tab.favIconUrl || '',
      lastVisited: Date.now()
    };
  }
  
  await chrome.storage.local.set({ tab_visits: visits });
});

// Assign an emoji per website and if else, just a chain for a website
function getCategoryIcon(url) {
  if (!url) return '🔗';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return '🎬';
  if (url.includes('linkedin.com')) return '💼';
  if (url.includes('github.com')) return '🐙';
  if (url.includes('twitter.com') || url.includes('x.com')) return '🐦';
  if (url.includes('reddit.com')) return '🤖';
  if (url.includes('google.com/docs') || url.includes('docs.google')) return '📝';
  if (url.includes('google.com/drive') || url.includes('drive.google')) return '📁';
  if (url.includes('gmail.com') || url.includes('mail.google')) return '📧';
  if (url.includes('stackoverflow.com')) return '📚';
  if (url.includes('arxiv.org')) return '📄';
  if (url.includes('medium.com')) return '✍️';
  if (url.includes('notion.so')) return '📒';
  if (url.includes('figma.com')) return '🎨';
  if (url.endsWith('.pdf') || url.includes('.pdf')) return '📄';
  if (url.includes('claude.ai')) return '🤖';
  if (url.includes('openai.com') || url.includes('chatgpt.com')) return '🤖';
  return '🔗';
}