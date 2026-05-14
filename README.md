# Tab Graveyard

**Automatically buries tabs you haven't visited in days. Nothing is ever truly lost.**

![Chrome](https://img.shields.io/badge/Chrome-MV3-4285F4?logo=googlechrome&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-brightgreen)

---

## The Problem

You have 80 tabs open. Most of them you opened days ago, never came back to, but can't close because "I might need that."

Existing solutions don't quite fit:
- **OneTab** — manual. You have to click to collapse tabs yourself. It doesn't watch your browser.
- **Tab Wrangler** — closes tabs after minutes/hours. Too aggressive. Built for short sessions, not the "forgot I had this open for 3 days" problem. No search on the corral.
- **Arc browser** — had the best auto-archiving ever built. Arc is now in maintenance mode.

Tab Graveyard fills the gap Arc left. Automatic, days-based, searchable, open source.

---

## How It Works

1. Tab Graveyard silently tracks when you last visited each tab
2. Every hour it checks for tabs you haven't visited in 3+ days
3. Stale tabs get buried — closed and saved to the Graveyard
4. Open the Graveyard anytime to search, restore, or permanently delete

Nothing is lost. Everything is searchable.

---

## Features

- **Automatic burial** — no clicking, no manual management
- **Days-based timer** — designed for tab hoarders, not short sessions
- **Searchable graveyard page** — find any buried tab instantly
- **Category emojis** — YouTube 🎬 GitHub 🐙 LinkedIn 💼 arXiv 📄 and more
- **One-click restore** — tab reopens instantly from the popup or graveyard page
- **Duplicate detection** — never buries the same URL twice
- **Open source** — every line of code is readable and auditable

---

## Install

### Chrome Web Store *(coming soon)*

### Developer Mode (now)
1. Clone or download this repo
2. Go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** → select the `TabGraveyard` folder

---

## Usage

Install it and forget it. Tab Graveyard runs silently in the background.

When you want to see what's been buried — click the icon. Recently buried tabs appear in the popup with one-click restore. For the full archive with search, click **Open Graveyard →**

---

## vs. The Alternatives

| | Tab Graveyard | OneTab | Tab Wrangler |
|---|---|---|---|
| Automatic | ✅ | ❌ Manual | ✅ |
| Time unit | Days | Manual | Minutes |
| Search | ✅ | ❌ | ❌ |
| Category icons | ✅ | ❌ | ❌ |
| Open source | ✅ | ❌ | ✅ |
| Manifest V3 | ✅ | ✅ | ✅ |

---

## Permissions

| Permission | Why |
|---|---|
| `tabs` | Track when tabs were last visited |
| `storage` | Save buried tabs across sessions |
| `alarms` | Run hourly staleness check |

No network requests. No data collection. Everything stays local.

---

## License

MIT