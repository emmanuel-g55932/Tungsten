/* Tungsten 1.5.1 · libraryroot.custom.js · Millennium theme for Steam

   One self-contained IIFE. Millennium loads this file into many Steam windows
   (menus, dialogs, Settings); it does nothing in any of them except three:
   - Big Picture mode, where Tungsten is the home screen and steps aside
     whenever one of Steam's own pages or dialogs is up;
   - the main Steam window, where it adds #tungsten-root over the library,
     just under Steam's title bar, plus a small toggle button in the title bar;
   - the in-game overlay ("SP Overlay: ..." windows), where it starts in
     In-Game Overlay Mode on the running game.

   Switch between Tungsten and Steam's own interface at any time by holding
   the controller's View button, with Ctrl + Shift + X or F12, or with the
   title bar button. The choice is remembered.

   GAMES is your Steam library, read from Steam's own stores (collectionStore,
   appStore, appDetailsStore). If they can't be reached within 20 seconds, the
   built-in sample library is shown instead. Play calls
   SteamClient.Apps.RunGame(gameid, "", -1, 100), falling back to
   steam://rungameid/<appid>.

   Generated from tungsten.html by build_theme.py. Edit the source and rebuild. */

(() => {
'use strict';

/* ═════════════════════════ Host ═════════════════════════
   The same script runs in two places:
   - the standalone page (this file), where #tungsten-root is already in the
     page and the library is the built-in sample below;
   - Steam, as a Millennium theme (libraryroot.custom.js). Millennium loads it
     into many Steam windows, but Tungsten only mounts in three: Big Picture
     mode, the main Steam window and the in-game overlay. Everywhere else
     (menus, dialogs, Settings, the friends list, store pages) it stops right
     here and leaves the window untouched.                                   */

const MARKUP = "<!-- Shared paint for the frosted-glass category icons and item glyphs\n     (the glyph shapes and their masks are added from the script) -->\n<svg width=\"0\" height=\"0\" style=\"position:absolute\" aria-hidden=\"true\" focusable=\"false\">\n  <defs id=\"tg-glass-defs\">\n    <linearGradient id=\"tg-frost\" x1=\"0\" y1=\"3\" x2=\"0\" y2=\"21\" gradientUnits=\"userSpaceOnUse\">\n      <stop offset=\"0\" stop-color=\"rgb(255, 255, 255)\" stop-opacity=\"0.95\" />\n      <stop offset=\"1\" stop-color=\"rgb(200, 215, 235)\" stop-opacity=\"0.55\" />\n    </linearGradient>\n    <!-- 1px specular rim: bright on each shape's upper edges, gone by mid-height -->\n    <linearGradient id=\"tg-frost-rim\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n      <stop offset=\"0\" stop-color=\"rgb(255, 255, 255)\" stop-opacity=\"0.9\" />\n      <stop offset=\"0.42\" stop-color=\"rgb(255, 255, 255)\" stop-opacity=\"0\" />\n    </linearGradient>\n    <!-- Specular edge for the item glyphs: brightest near the top of the glyph -->\n    <linearGradient id=\"tg-glyph-rim\" x1=\"0\" y1=\"3\" x2=\"0\" y2=\"21\" gradientUnits=\"userSpaceOnUse\">\n      <stop offset=\"0\" stop-color=\"rgb(255, 255, 255)\" stop-opacity=\"0.9\" />\n      <stop offset=\"0.5\" stop-color=\"rgb(255, 255, 255)\" stop-opacity=\"0.5\" />\n      <stop offset=\"1\" stop-color=\"rgb(255, 255, 255)\" stop-opacity=\"0.2\" />\n    </linearGradient>\n  </defs>\n</svg>\n\n<!-- The running game (its art, full-screen) and the in-game menu's dark glass -->\n<div id=\"game\" aria-hidden=\"true\">\n  <div class=\"feed\"></div>\n  <div class=\"glass\"></div>\n</div>\n\n<canvas id=\"field\" aria-hidden=\"true\"></canvas>\n\n<div id=\"dwell\" aria-hidden=\"true\">\n  <div class=\"hero\"></div>\n  <div class=\"vignette\"></div>\n  <div class=\"logo\"></div>\n</div>\n<div id=\"shade\" aria-hidden=\"true\"></div>\n\n<div id=\"tracks\"></div>\n<ul id=\"cats\" role=\"tablist\" aria-label=\"Categories\"></ul>\n\n<!-- GAMES > Library: every game you own, letters across, games down (see \"Library\") -->\n<section id=\"library\" aria-label=\"Library\" aria-hidden=\"true\">\n  <div class=\"lib-head\"><div class=\"eyebrow\">Library</div><div class=\"lib-name\"></div><div class=\"lib-n\"></div></div>\n  <ul class=\"lib-track\" role=\"listbox\" aria-label=\"Games\"></ul>\n  <ul class=\"lib-row\" role=\"tablist\" aria-label=\"Letters\"></ul>\n  <div class=\"lib-count\" aria-hidden=\"true\"></div>\n  <div class=\"lib-empty\"></div>\n</section>\n\n<aside id=\"drawer\" role=\"dialog\" aria-label=\"Options\" aria-hidden=\"true\">\n  <div class=\"drawer-inner\">\n    <div class=\"eyebrow\">Options</div>\n    <div class=\"game\" id=\"drawer-game\"></div>\n    <div class=\"opts\"><span class=\"bar\" aria-hidden=\"true\"></span><ul role=\"menu\"></ul></div>\n  </div>\n</aside>\n\n<!-- Desktop Game Inspector (filled from the script) -->\n<section id=\"inspector\" aria-label=\"Game details\" aria-hidden=\"true\">\n  <div class=\"scroll\"></div>\n</section>\n\n<div id=\"topbar\">\n  <label id=\"search\" title=\"Search games (Ctrl + F or /)\">\n    <svg viewBox=\"0 0 14 14\" aria-hidden=\"true\"><circle cx=\"5.9\" cy=\"5.9\" r=\"4.3\" /><path d=\"M9.2 9.2 12.7 12.7\" /></svg>\n    <input type=\"text\" placeholder=\"Search\" spellcheck=\"false\" autocomplete=\"off\" aria-label=\"Search games\">\n  </label>\n  <div id=\"osk\" aria-hidden=\"true\" aria-label=\"On-screen keyboard\"></div>\n  <div id=\"status\" role=\"status\" aria-label=\"Date and time\">\n    <svg class=\"spin\" viewBox=\"0 0 12 12\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.4\" stroke-linecap=\"round\" aria-hidden=\"true\">\n      <path d=\"M6 1.3a4.7 4.7 0 0 1 4.7 4.7\" />\n      <path d=\"M6 10.7A4.7 4.7 0 0 1 1.3 6\" opacity=\"0.5\" />\n    </svg>\n    <span id=\"clock\"></span>\n  </div>\n</div>\n\n<div id=\"nowplaying\" aria-hidden=\"true\"><svg viewBox=\"0 0 17 13\"><path d=\"M5.1 1.7h6.8c1.9 0 3.3 1.3 3.6 3.2l.6 4.1c.2 1.6-1.2 2.6-2.4 1.9-.7-.4-1.3-1.2-1.8-1.9H5.1c-.5.7-1.1 1.5-1.8 1.9-1.2.7-2.6-.3-2.4-1.9l.6-4.1c.3-1.9 1.7-3.2 3.6-3.2Z\"/><path d=\"M4.8 4.6v2.8M3.4 6h2.8\"/><path d=\"M12 4.9h.01M13.4 6.7h.01\" stroke-width=\"2\"/></svg><span class=\"t\"></span></div>\n\n<!-- The legend shows the controls for where you are (see layoutLegend):\n     data-in names the places a hint shows (menu, ins = the Game Inspector,\n     bar = the selected search bar, drawer = an options list); a hint\n     without it shows everywhere. -->\n<div id=\"legend\" aria-hidden=\"true\">\n  <div class=\"row keys\">\n    <span class=\"hint\" data-in=\"bar\"><kbd data-k=\"select\">ENTER</kbd>Type</span>\n    <span class=\"hint\" data-in=\"menu ins drawer page lib\"><kbd data-k=\"select\">ENTER</kbd>Select</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint\"><kbd data-k=\"back\">ESC</kbd>Back</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint\" data-in=\"menu ins\" data-drop=\"6\"><kbd data-k=\"options\">O</kbd>Options</span>\n    <span class=\"hint\" data-in=\"lib\" data-drop=\"6\"><kbd data-k=\"options\">O</kbd>Show</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint tint-hint\" data-in=\"menu ins drawer page lib\" data-drop=\"3\"><kbd data-k=\"tint\">T</kbd>Color Tint<span class=\"toast\" id=\"tint-toast\"></span></span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint\" data-in=\"menu\" data-drop=\"4\"><kbd data-k=\"left\">←</kbd><kbd data-k=\"right\">→</kbd>Category</span>\n    <span class=\"hint\" data-in=\"lib\" data-drop=\"4\"><kbd data-k=\"left\">←</kbd><kbd data-k=\"right\">→</kbd>Letter</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint\" data-in=\"menu drawer lib\"><kbd data-k=\"up\">↑</kbd><kbd data-k=\"down\">↓</kbd>Navigate</span>\n    <span class=\"hint\" data-in=\"ins page\"><kbd data-k=\"up\">↑</kbd><kbd data-k=\"down\">↓</kbd><kbd data-k=\"left\">←</kbd><kbd data-k=\"right\">→</kbd>Navigate</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint\" data-in=\"ins\" data-drop=\"5\"><kbd data-k=\"pageup\">PG UP</kbd><kbd data-k=\"pagedown\">PG DN</kbd>Previous / Next Game</span>\n    <span class=\"hint\" data-in=\"page\" data-drop=\"5\"><kbd data-k=\"pageup\">PG UP</kbd><kbd data-k=\"pagedown\">PG DN</kbd>Scroll</span>\n    <span class=\"hint\" data-in=\"lib\" data-drop=\"5\"><kbd data-k=\"pageup\">PG UP</kbd><kbd data-k=\"pagedown\">PG DN</kbd>Jump 8</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint\" data-in=\"menu ins drawer page lib\" data-drop=\"2\"><kbd data-k=\"mute\">M</kbd><span id=\"mute-label\">Mute Audio</span></span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint ingame-hint\" data-in=\"menu\"><kbd data-k=\"ingame\">I</kbd>In-Game Menu</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint cold-hint\" data-in=\"menu\" data-drop=\"1\"><kbd data-k=\"coldboot\">B</kbd>Cold Boot</span>\n  </div>\n  <div class=\"row pad\">\n    <span class=\"hint\" data-in=\"bar\"><span class=\"btn\" data-k=\"select\" title=\"Cross\"><svg viewBox=\"0 0 12 12\"><path d=\"M2.6 2.6l6.8 6.8M9.4 2.6l-6.8 6.8\" /></svg></span>Keyboard</span>\n    <span class=\"hint\" data-in=\"menu ins drawer page lib\"><span class=\"btn\" data-k=\"select\" title=\"Cross\"><svg viewBox=\"0 0 12 12\"><path d=\"M2.6 2.6l6.8 6.8M9.4 2.6l-6.8 6.8\" /></svg></span>Select</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint\"><span class=\"btn\" data-k=\"back\" title=\"Circle\"><svg viewBox=\"0 0 12 12\"><circle cx=\"6\" cy=\"6\" r=\"3.9\" /></svg></span>Back</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint\" data-in=\"menu ins\" data-drop=\"6\"><span class=\"btn\" data-k=\"options\" title=\"Triangle\"><svg viewBox=\"0 0 12 12\"><path d=\"M6 2.2 9.9 8.95H2.1z\" /></svg></span>Options</span>\n    <span class=\"hint\" data-in=\"lib\" data-drop=\"6\"><span class=\"btn\" data-k=\"options\" title=\"Triangle\"><svg viewBox=\"0 0 12 12\"><path d=\"M6 2.2 9.9 8.95H2.1z\" /></svg></span>Show</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint tint-hint\" data-in=\"menu ins drawer page lib\" data-drop=\"3\"><span class=\"btn\" data-k=\"tint\" title=\"Square\"><svg viewBox=\"0 0 12 12\"><rect x=\"2.7\" y=\"2.7\" width=\"6.6\" height=\"6.6\" rx=\"0.4\" /></svg></span>Color Tint</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint\" data-in=\"menu ins drawer page lib\"><span class=\"btn\" data-k=\"up down left right\" title=\"D-pad\"><svg class=\"dpad\" viewBox=\"0 0 12 12\"><path d=\"M4.4 1.3h3.2v3.1h3.1v3.2H7.6v3.1H4.4V7.6H1.3V4.4h3.1z\" /></svg></span>Navigate</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint\" data-in=\"ins\" data-drop=\"5\"><span class=\"btn trig\" data-k=\"pageup\" title=\"L2\">L2</span><span class=\"btn trig\" data-k=\"pagedown\" title=\"R2\">R2</span>Previous / Next Game</span>\n    <span class=\"hint\" data-in=\"page\" data-drop=\"5\"><span class=\"btn trig\" data-k=\"pageup\" title=\"L2\">L2</span><span class=\"btn trig\" data-k=\"pagedown\" title=\"R2\">R2</span>Scroll</span>\n    <span class=\"hint\" data-in=\"lib\" data-drop=\"4\"><span class=\"btn trig\" data-k=\"left\" title=\"L1\">L1</span><span class=\"btn trig\" data-k=\"right\" title=\"R1\">R1</span>Letter</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint\" data-in=\"lib\" data-drop=\"5\"><span class=\"btn trig\" data-k=\"pageup\" title=\"L2\">L2</span><span class=\"btn trig\" data-k=\"pagedown\" title=\"R2\">R2</span>Jump 8</span>\n    <span class=\"sep\">·</span>\n    <span class=\"hint ingame-hint\" data-in=\"menu\"><span class=\"btn\" data-k=\"ingame\" title=\"Home\"><svg class=\"home\" viewBox=\"0 0 12 12\"><path d=\"M6 1.5 1.3 5.6h1.4v4.6h2.7V7.6h1.2v2.6h2.7V5.6h1.4z\" /></svg></span>In-Game Menu</span>\n    <span class=\"sep steam-hint\">·</span>\n    <span class=\"hint steam-hint\" data-drop=\"7\"><span class=\"btn\" data-k=\"steam\" title=\"View (hold)\"><svg viewBox=\"0 0 12 12\"><rect x=\"2\" y=\"2.4\" width=\"5.2\" height=\"4.4\" rx=\"0.7\" /><rect x=\"4.8\" y=\"5.2\" width=\"5.2\" height=\"4.4\" rx=\"0.7\" /></svg></span>Hold: Steam</span>\n  </div>\n</div>\n\n<div id=\"announce\" class=\"sr-only\" aria-live=\"polite\"></div>\n\n<!-- Screenshot / DLC viewer -->\n<div id=\"lightbox\" role=\"dialog\" aria-label=\"Media viewer\" aria-hidden=\"true\">\n  <button class=\"frost nav prev\" aria-label=\"Previous\"><svg viewBox=\"0 0 16 16\"><path d=\"M10 3 5 8l5 5\" /></svg></button>\n  <img alt=\"\">\n  <div class=\"cap\"></div>\n  <button class=\"frost nav next\" aria-label=\"Next\"><svg viewBox=\"0 0 16 16\"><path d=\"M6 3l5 5-5 5\" /></svg></button>\n</div>\n\n<!-- Launch sequence overlay (pitch black + launch card) -->\n<div id=\"boot\" aria-hidden=\"true\">\n  <div class=\"card\">\n    <div class=\"mark\"></div>\n    <div class=\"line\"><span></span></div>\n    <div class=\"label\">Launching</div>\n  </div>\n</div>\n\n<!-- Cold boot (the startup movie, B replays it): black lifting off the\n     ribbons, and the wordmark on the right before the cross comes in -->\n<div id=\"coldboot\" aria-hidden=\"true\">\n  <div class=\"veil\"></div>\n  <div class=\"mark\">\n    <div class=\"word\">TUNGSTEN</div>\n    <div class=\"cap\">INTERACTIVE LAUNCHER ENVIRONMENT</div>\n  </div>\n</div>";       // the root's contents, filled in by the theme build

// The main window is Steam's "SP Desktop" popup: Millennium marks it with a
// class, and Steam names the window after it. Other Steam popups can also be
// titled just "Steam", so the title alone isn't enough. Big Picture mode is
// its own full-screen window ("SP BPM"), where Tungsten is the home screen.
function detectHost() {
  if (document.getElementById('tungsten-root')) return { kind: 'page', role: 'standalone' };
  const cls = document.documentElement.classList, title = document.title || '';
  let name = '';
  try { name = String(window.name || ''); } catch (e) { /* not readable */ }
  if (cls.contains('MillenniumWindow_MainSteamWindow') || (title === 'Steam' && /^SP Desktop/.test(name))) return { kind: 'steam', role: 'main' };
  if (title === 'Steam Big Picture Mode' || /^SP BPM/.test(name)) return { kind: 'steam', role: 'bpm' };
  if (/^SP Overlay:/.test(title)) return { kind: 'steam', role: 'overlay' };
  return { kind: 'steam', role: null };
}
const HOST = detectHost();
if (!HOST.role || window.__tungsten) return;      // not a window Tungsten belongs in, or already running here
window.__tungsten = true;

// Messages also go to Steam's shared context, which writes them to Steam's own
// log (Steam\logs\webhelper_js.txt), next to Steam's.
function tlog(...parts) {
  if (HOST.kind !== 'steam') return;
  const msg = `[Tungsten] (${HOST.role}) ${parts.join(' ')}`;
  try { console.info(msg); } catch (e) { /* no console */ }
  try { if (window.opener && window.opener !== window) window.opener.console.info(msg); } catch (e) { /* not reachable */ }
}
const VERSION = '1.5.1';
tlog(`${VERSION} started: "${document.title}", ${window.innerWidth}×${window.innerHeight}, ${location.pathname}`);
window.addEventListener('error', (e) => { if (/Tungsten|libraryroot/.test(String(e.filename || ''))) tlog(`error: ${e.message} (line ${e.lineno})`); });
window.addEventListener('unhandledrejection', (e) => { const s = String((e.reason && e.reason.stack) || ''); if (/Tungsten|libraryroot/.test(s)) tlog(`error: ${e.reason && e.reason.message}`); });

const root = (() => {
  let el = document.getElementById('tungsten-root');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'tungsten-root';
  el.className = `steam ${HOST.role}`;
  el.innerHTML = MARKUP;
  el.setAttribute('data-version', VERSION);
  (document.body || document.documentElement).appendChild(el);
  if (!document.getElementById('tungsten-font')) {       // Inter, as in the standalone page (Segoe UI until it loads)
    const font = document.createElement('link');
    font.id = 'tungsten-font'; font.rel = 'stylesheet';
    font.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap';
    document.head.appendChild(font);
  }
  return el;
})();
const IN_STEAM = HOST.kind === 'steam', IN_OVERLAY = HOST.role === 'overlay', IN_BPM = HOST.role === 'bpm';
let enabled = true;             // Tungsten on (Steam: Ctrl + Shift + X, F12 or the title bar button)
let active = true;              // on and on screen: input, the ribbons and the controller polling run
const $ = (sel) => root.querySelector(sel);                    // queries stay inside Tungsten
const inRoot = (t) => !!(t && t.nodeType && root.contains(t));   // event targets can be the window itself
const viewW = () => root.clientWidth || window.innerWidth;     // the root's size, i.e. the space Tungsten has
const viewH = () => root.clientHeight || window.innerHeight;

/* ═════════════════════════ Config ═════════════════════════ */

const CDN = 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/';
const DWELL_MS = 550;              // pause before Layer 1 fades in
// Holding a direction (key, controller or Steam's controller events): one
// step right away, then after a short pause a step every 100ms, speeding up
// to one every 60ms once it has been held for a moment and a half.
const HOLD_DELAY_MS = 300;
const HOLD_STEP_MS = 100;
const HOLD_FAST_STEP_MS = 60;
const HOLD_ACCEL_AFTER_MS = 1500;
const holdStep = (heldFor) => (heldFor >= HOLD_ACCEL_AFTER_MS ? HOLD_FAST_STEP_MS : HOLD_STEP_MS);
// When the next step of a hold is due: on the beat, without a burst of steps
// after a stalled frame or a late event.
const nextBeat = (next, now, step) => (next + step > now ? next + step : now + step);
const PAGE_ROWS = 8;               // LT / RT and Page Up / Page Down jump this many rows
const MAX_GAMES = 1000;            // the most games GAMES shows (most recently played first)
const LOGO_MAX_W = 300;            // spec
const LOGO_AREA = 300 * 126;       // optical size target for clear logos (px²)
const LOGO_MAX_H = 200;

// Enter on a game calls SteamClient.Apps.RunGame when the page runs inside Steam
// (Millennium). In a normal browser it only plays the launch sequence, unless
// this is true, in which case it also opens steam://rungameid/<appid>.
const LAUNCH_VIA_STEAM_PROTOCOL = false;

/* ═════════════════════════ Icons (24×24, frosted glass) ═════════════════════════ */

function gearPath(cx, cy, ro, ri, n) {
  const step = Math.PI * 2 / n, wo = step * 0.26, wi = step * 0.38;
  const p = (r, a) => `${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = i * step - Math.PI / 2;
    d += `${i ? 'L' : 'M'}${p(ri, a - wi / 2)}L${p(ro, a - wo / 2)}L${p(ro, a + wo / 2)}L${p(ri, a + wi / 2)}`;
    d += `A${ri} ${ri} 0 0 1 ${p(ri, (i + 1) * step - Math.PI / 2 - wi / 2)}`;
  }
  return d + 'Z';
}
function starPath(cx, cy, ro, ri) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? ri : ro, a = -Math.PI / 2 + i * Math.PI / 5;
    d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`;
  }
  return d + 'Z';
}
const PAD    = 'M7.2 7.5h9.6c2.3 0 4.2 1.6 4.7 3.8l.9 4.2c.4 1.8-1 3.5-2.8 3.5-.9 0-1.8-.5-2.3-1.3l-1-1.6H7.7l-1 1.6c-.5.8-1.4 1.3-2.3 1.3-1.8 0-3.2-1.7-2.8-3.5l.9-4.2c.5-2.2 2.4-3.8 4.7-3.8z';
const BAG    = 'M5.25 8.25h13.5l-1.05 11.1a1.75 1.75 0 0 1-1.74 1.58H8.04a1.75 1.75 0 0 1-1.74-1.58z';
const GEAR   = gearPath(12, 12, 9.4, 7.0, 8);
const STAR   = starPath(12, 12.6, 9, 4.1);
const BUBBLE = 'M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5V14a2.5 2.5 0 0 1-2.5 2.5h-6L7 20.25V16.5h-.5A2.5 2.5 0 0 1 4 14z';
const TAG    = 'M3.75 11.6V5.25a1.5 1.5 0 0 1 1.5-1.5h6.35l8.65 8.65a1.5 1.5 0 0 1 0 2.12l-6.48 6.48a1.5 1.5 0 0 1-2.12 0z';
const HEART  = 'M12 20.25c-.35 0-8-4.7-8-10.35A4.45 4.45 0 0 1 12 7.2a4.45 4.45 0 0 1 8 2.7c0 5.65-7.65 10.35-8 10.35z';
const LENS   = 'M12 3.25c2.5 2.35 3.75 5.25 3.75 8.75S14.5 18.4 12 20.75C9.5 18.4 8.25 15.5 8.25 12S9.5 5.6 12 3.25z';

// Filled silhouettes for the six category icons (frosted glass). Cut-outs use
// even-odd fill so the background shows through them.
const CIRCLE_HOLE = (cx, cy, r) => `M${cx} ${+(cy - r).toFixed(3)}a${r} ${r} 0 1 0 0 ${2 * r}a${r} ${r} 0 1 0 0 ${-2 * r}Z`;
const CAT_ICONS = {
  controller: `<g transform="translate(0 -1.25)"><path class="glass" fill-rule="evenodd" d="${PAD}M6.75 10.4V11.45H5.7V12.95H6.75V14H8.25V12.95H9.3V11.45H8.25V10.4Z${CIRCLE_HOLE(15.7, 11.2, 1.05)}${CIRCLE_HOLE(17.7, 13.2, 1.05)}"/></g>`,
  apps:       `<rect class="glass" x="3.5" y="3.5" width="7" height="7" rx="1.9"/><circle class="glass" cx="17" cy="7" r="3.6"/><rect class="glass" x="3.5" y="13.5" width="7" height="7" rx="1.9"/><rect class="glass" x="13.5" y="13.5" width="7" height="7" rx="1.9"/>`,
  media:      `<path class="glass" fill-rule="evenodd" d="M4.95 4.25h14.1a2.2 2.2 0 0 1 2.2 2.2v8.1a2.2 2.2 0 0 1-2.2 2.2H4.95a2.2 2.2 0 0 1-2.2-2.2v-8.1a2.2 2.2 0 0 1 2.2-2.2zM10.2 7.75v5.5l4.75-2.75z"/><rect class="glass" x="8" y="18.6" width="8" height="1.8" rx="0.9"/>`,
  friends:    `<circle class="glass behind" cx="17.6" cy="8.9" r="2.75"/><path class="glass behind" d="M16.3 14.05c.55-.2 1.15-.3 1.75-.3 2.4 0 4.1 1.9 4.1 4.6v1.25h-4.15c-.05-2.25-.6-4.15-1.7-5.55z"/><circle class="glass" cx="9" cy="8.1" r="3.4"/><path class="glass" d="M2.6 19.6c0-3.6 2.9-6.1 6.4-6.1s6.4 2.5 6.4 6.1z"/>`,
  store:      `<path class="glass" d="${BAG}"/><path class="glass" d="M8.4 8.25V7a3.6 3.6 0 0 1 7.2 0v1.25h-1.5V7a2.1 2.1 0 0 0-4.2 0v1.25z"/>`,
  system:     `<path class="glass" fill-rule="evenodd" d="${GEAR}${CIRCLE_HOLE(12, 12, 2.9)}"/>`,
};
const catIcon = (name) =>
  `<svg class="glow" viewBox="0 0 24 24" aria-hidden="true">${CAT_ICONS[name]}</svg>` +
  `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${CAT_ICONS[name]}</svg>`;

// Item glyphs for the non-game columns: frameless frosted glass, like the
// category icons. Each is drawn as a mask, white = glass and black = cut-out,
// so cut lines (a globe's meridians, a clock's hands) are easy to carve. The
// frost gradient fills the mask, and the top highlight is the glyph minus a
// copy of itself shifted 0.45 down: a thin bright edge on every contour that
// faces up, like light catching the top of a glass shape.
const GLASS = 'fill="#fff"', CUT = 'fill="#000"';
const edge = (color, w) => `fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const GLOBE_LENS = 'M12 3.5c2.45 2.3 3.7 5.2 3.7 8.5s-1.25 6.2-3.7 8.5c-2.45-2.3-3.7-5.2-3.7-8.5S9.55 5.8 12 3.5z';
const BIG_BUBBLE = 'M3 6.2A2.7 2.7 0 0 1 5.7 3.5h12.6A2.7 2.7 0 0 1 21 6.2v8.6a2.7 2.7 0 0 1-2.7 2.7h-6.6l-4.8 3.75V17.5H5.7A2.7 2.7 0 0 1 3 14.8z';
const BIG_HEART = 'M12 20.9c-.4 0-9.25-5.2-9.25-11.6A5 5 0 0 1 12 6.75a5 5 0 0 1 9.25 2.55c0 6.4-8.85 11.6-9.25 11.6z';
const GLYPHS = {
  // APPS
  globe:      `<circle cx="12" cy="12" r="9.25" ${GLASS}/><g ${edge('#000', 1.25)}><path d="M2 12h20M3.4 7.5h17.2M3.4 16.5h17.2"/><path d="${GLOBE_LENS}"/></g>`,
  note:       `<path ${GLASS} d="M8.25 6.55 19.75 4.2v11.3h-1.7V7.15L9.95 8.8v8.7H8.25z"/>` +
              `<ellipse cx="6.55" cy="17.55" rx="2.95" ry="2.35" transform="rotate(-18 6.55 17.55)" ${GLASS}/>` +
              `<ellipse cx="16.35" cy="15.45" rx="2.95" ry="2.35" transform="rotate(-18 16.35 15.45)" ${GLASS}/>`,
  cast:       `<rect x="2.75" y="4.25" width="18.5" height="14" rx="2.2" ${GLASS}/><circle cx="3" cy="19.75" r="10.4" ${CUT}/>` +
              `<path ${edge('#fff', 1.9)} d="M3 15.25a4.5 4.5 0 0 1 4.5 4.5M3 11.6a8.15 8.15 0 0 1 8.15 8.15"/><circle cx="3.55" cy="19.2" r="1.45" ${GLASS}/>`,
  monitor:    `<rect x="2.5" y="3.5" width="19" height="13" rx="2.1" ${GLASS}/><rect x="4.2" y="5.2" width="15.6" height="9.6" rx="0.9" ${CUT}/>` +
              `<rect x="6.1" y="7.1" width="7.4" height="5.2" rx="0.8" ${GLASS}/><path ${GLASS} d="M10.6 16.4h2.8v2.7h-2.8z"/><rect x="7.25" y="18.7" width="9.5" height="2.05" rx="1" ${GLASS}/>`,
  // MEDIA
  image:      `<rect x="2.75" y="4.25" width="18.5" height="15.5" rx="2.2" ${GLASS}/><rect x="4.45" y="5.95" width="15.1" height="12.1" rx="0.9" ${CUT}/>` +
              `<path ${GLASS} d="M4.45 18.05v-2.3l4.7-4.9 3.65 3.65 2.45-2.45 4.3 4.4v1.6z"/><circle cx="15.7" cy="9.6" r="1.75" ${GLASS}/>`,
  record:     `<circle cx="12" cy="12" r="9.25" ${GLASS}/><circle cx="12" cy="12" r="6.9" ${CUT}/><circle cx="12" cy="12" r="4.3" ${GLASS}/>`,
  headphones: `<path ${edge('#fff', 2)} d="M4.4 15V12a7.6 7.6 0 0 1 15.2 0v3"/>` +
              `<rect x="2.75" y="13.2" width="5.25" height="7.55" rx="1.9" ${GLASS}/><rect x="16" y="13.2" width="5.25" height="7.55" rx="1.9" ${GLASS}/>`,
  film:       `<rect x="3.25" y="3.25" width="17.5" height="17.5" rx="2.2" ${GLASS}/><rect x="7.6" y="4.9" width="8.8" height="14.2" rx="0.6" ${CUT}/>` +
              [6.68, 10.23, 13.78, 17.33].map((y) => `<rect x="4.58" y="${y - 0.8}" width="1.7" height="1.6" rx="0.35" ${CUT}/><rect x="17.72" y="${y - 0.8}" width="1.7" height="1.6" rx="0.35" ${CUT}/>`).join('') +
              `<path ${GLASS} d="M10.55 9.3v5.4l4.4-2.7z"/>`,
  // FRIENDS
  friends:    `<circle cx="17.4" cy="8.6" r="2.85" ${GLASS}/><path ${GLASS} d="M13.2 19.6c.2-3.4 2-5.9 4.6-5.9s4.4 2.3 4.4 5.9z"/>` +
              `<circle cx="8.9" cy="8.2" r="4.75" ${CUT}/><path ${CUT} d="M1 21c0-5 3.5-9.3 7.9-9.3s7.9 4.3 7.9 9.3z"/>` +
              `<circle cx="8.9" cy="8.2" r="3.45" ${GLASS}/><path ${GLASS} d="M2.3 19.6c0-3.8 2.9-6.6 6.6-6.6s6.6 2.8 6.6 6.6z"/>`,
  chat:       `<path ${GLASS} d="${BIG_BUBBLE}"/>` + [8.2, 12, 15.8].map((x) => `<circle cx="${x}" cy="10.5" r="1.25" ${CUT}/>`).join(''),
  clock:      `<circle cx="12" cy="12" r="9.25" ${GLASS}/><path ${edge('#000', 1.75)} d="M12 6.6V12l3.7 2.25"/>`,
  addFriend:  `<circle cx="9.4" cy="8.1" r="3.6" ${GLASS}/><path ${GLASS} d="M2.4 19.75c0-3.95 3.1-6.85 7-6.85s7 2.9 7 6.85z"/>` +
              `<circle cx="18.1" cy="16.1" r="5.3" ${CUT}/><path ${edge('#fff', 1.9)} d="M18.1 12.6v7M14.6 16.1h7"/>`,
  // STORE
  star:       `<path ${GLASS} stroke="#fff" stroke-width="0.6" stroke-linejoin="round" d="${starPath(12, 12.4, 9.6, 4.4)}"/>`,
  tag:        `<path ${GLASS} stroke="#fff" stroke-width="0.4" stroke-linejoin="round" d="${TAG}"/><circle cx="8.1" cy="8.1" r="1.6" ${CUT}/>`,
  heart:      `<path ${GLASS} d="${BIG_HEART}"/>`,
  gift:       `<rect x="2.9" y="7.1" width="18.2" height="3.6" rx="1.1" ${GLASS}/><rect x="4.2" y="11.6" width="15.6" height="8.9" rx="1.4" ${GLASS}/>` +
              `<rect x="11.3" y="6" width="1.4" height="15.5" ${CUT}/>` +
              `<path ${GLASS} d="M11.6 6.9C10.2 4 6.8 3.4 6.8 5.4c0 1.3 1.6 1.5 4.8 1.5zM12.4 6.9c1.4-2.9 4.8-3.5 4.8-1.5 0 1.3-1.6 1.5-4.8 1.5z"/>`,
  // SYSTEM
  system:     `<path ${GLASS} fill-rule="evenodd" d="${GEAR}${CIRCLE_HOLE(12, 12, 2.9)}"/>`,
  download:   `<path ${GLASS} d="M10.85 3.4h2.3v7.1h3.35L12 15.35 7.5 10.5h3.35z"/>` +
              `<path ${edge('#fff', 2.1)} d="M3.9 14.9v2.7a2.6 2.6 0 0 0 2.6 2.6h11a2.6 2.6 0 0 0 2.6-2.6v-2.7"/>`,
  controller: `<g transform="translate(0 -1.25)"><path ${GLASS} d="${PAD}"/><path ${CUT} d="M6.75 10.4h1.5v1.05h1.05v1.5H8.25V14h-1.5v-1.05H5.7v-1.5h1.05z"/>` +
              `<circle cx="15.7" cy="11.2" r="1.05" ${CUT}/><circle cx="17.7" cy="13.2" r="1.05" ${CUT}/></g>`,
  power:      `<path ${edge('#fff', 2.2)} d="M12 3.4v8.1M7.1 6.3a7.9 7.9 0 1 0 9.8 0"/>`,
  // GAMES: the Library (a shelf: three spines, banded, and one leaning on them)
  library:    [3, 7.6].map((x) => `<rect x="${x}" y="4.2" width="3.7" height="15.6" rx="0.9" ${GLASS}/>`).join('') +
              `<rect x="12.2" y="6.6" width="3.7" height="13.2" rx="0.9" ${GLASS}/>` +
              [3, 7.6, 12.2].map((x) => `<rect x="${x}" y="${x === 12.2 ? 8.9 : 7.3}" width="3.7" height="0.85" ${CUT}/><rect x="${x}" y="16.4" width="3.7" height="0.85" ${CUT}/>`).join('') +
              `<g transform="rotate(-15 17.2 19.8)"><rect x="16.2" y="5.2" width="3.9" height="15.4" rx="0.95" ${edge('#000', 1.4)}/>` +
              `<rect x="16.2" y="5.2" width="3.9" height="15.4" rx="0.95" ${GLASS}/></g>`,
  // In-game menu
  resume:     `<circle cx="12" cy="12" r="9.25" ${GLASS}/><path ${CUT} stroke="#000" stroke-width="0.8" stroke-linejoin="round" d="M9.8 7.7v8.6l6.9-4.3z"/>`,
  quit:       `<circle cx="12" cy="12" r="9.25" ${GLASS}/><path ${edge('#000', 1.9)} d="M8.7 8.7l6.6 6.6M15.3 8.7l-6.6 6.6"/>`,
};
// Shapes and masks go into the shared <defs> once; every glyph reuses them.
(function addGlyphDefs() {
  const box = 'maskUnits="userSpaceOnUse" x="-1" y="-1" width="26" height="26"';
  $('#tg-glass-defs').insertAdjacentHTML('beforeend', Object.keys(GLYPHS).map((n) =>
    `<g id="tg-gl-${n}">${GLYPHS[n]}</g>` +
    `<mask id="tg-gm-${n}" ${box}><use href="#tg-gl-${n}"/></mask>` +
    `<mask id="tg-gr-${n}" ${box}><use href="#tg-gl-${n}"/><rect x="-1" y="-1" width="26" height="26" ${CUT} mask="url(#tg-gm-${n})" transform="translate(0 0.45)"/></mask>`
  ).join(''));
})();
const glyphIcon = (name) => nodeFrom(
  `<svg class="glyph" viewBox="0 0 24 24" aria-hidden="true">` +
  `<rect x="-1" y="-1" width="26" height="26" fill="url(#tg-frost)" mask="url(#tg-gm-${name})"/>` +
  `<rect x="-1" y="-1" width="26" height="26" fill="url(#tg-glyph-rim)" mask="url(#tg-gr-${name})"/></svg>`);

/* ═════════════════════════ Library data ═════════════════════════
   The sample library, used by the standalone page and as the fallback when
   Steam's own library can't be read. Asset paths are relative to
   CDN/<appid>/ and are tried in order. They were checked against Steam's own
   store and library asset records. Playtimes, "last played" (days before
   today) and achievement counts are made up for the sample. Inside Steam the
   real library replaces these (see "Steam library").                        */

const SAMPLE_GAMES = [
  { aka: 'gta gtav gta5 gta 5', title: 'Grand Theft Auto V Enhanced', daysAgo: 0, hours: 128, appid: 3240220,
    thumb: ['4c8d7ce5142a528bdac68c093bd1bcc720e2baee/capsule_616x353.jpg', 'header.jpg'],
    hero:  ['156530620aa0b27bc9c73f78c3ca64f7d8fed03d/library_hero_2x.jpg', '156530620aa0b27bc9c73f78c3ca64f7d8fed03d/library_hero.jpg', 'library_hero.jpg'],
    logo:  ['b45f1fc647bfb9389a2c741686627ef7e139f2df/logo_2x.png', 'b45f1fc647bfb9389a2c741686627ef7e139f2df/logo.png', 'logo.png'],
    heroPos: '52% 50%', tones: ['#e8a25b', '#13314f'] },
  { aka: 'sims sims4 ts4', title: 'The Sims™ 4', daysAgo: 2, hours: 96, appid: 1222670,
    thumb: ['c8e5182a9f55f9074bd11c965ea539e3ad94457f/capsule_616x353.jpg', 'capsule_616x353.jpg', 'header.jpg'],
    hero:  ['library_hero_2x.jpg', 'library_hero.jpg'],
    logo:  ['logo_2x.png', 'logo.png'],
    heroPos: '58% 50%', tones: ['#45c96b', '#14467a'] },
  { title: 'RimWorld', daysAgo: 5, hours: 214, appid: 294100,
    thumb: ['5b965773bfafb57450cd3d7967770c09dff6bb16/capsule_616x353.jpg', 'capsule_616x353.jpg', 'header.jpg'],
    hero:  ['6d7bd7e3d848308ffac87221194aba2338d10efa/library_hero_2x.jpg', '6d7bd7e3d848308ffac87221194aba2338d10efa/library_hero.jpg', 'library_hero.jpg'],
    logo:  ['b9132fc5f1fdeaeb6c12a002e87b37c8978ea970/logo_2x.png', 'b9132fc5f1fdeaeb6c12a002e87b37c8978ea970/logo.png', 'logo.png'],
    heroPos: '50% 50%', tones: ['#c27b45', '#2b1d17'] },
  { aka: 'cs2 cities skylines 2', title: 'Cities: Skylines II', daysAgo: 9, hours: 57, appid: 949230,
    thumb: ['capsule_616x353.jpg', 'header.jpg'],
    hero:  ['library_hero_2x.jpg', 'library_hero.jpg'],
    logo:  ['logo_2x.png', 'logo.png'],
    heroPos: '50% 50%', tones: ['#5fb6e6', '#123459'] },
  { aka: 'watch dogs wd', title: 'Watch_Dogs', daysAgo: 16, hours: 31, appid: 243470,
    thumb: ['capsule_616x353.jpg', 'header.jpg'],
    // No library hero or logo exists for this game on Steam, so a 1920×1080
    // store screenshot stands in for the hero and the title is set as type.
    hero:  ['ss_ad985b3cf8444e2fe1867b388bf5658a5a2bc3bc.1920x1080.jpg'],
    logo:  [],
    heroPos: '50% 50%', tones: ['#25b6c8', '#121a22'] },
  { aka: 'bf6 bf 6', title: 'Battlefield™ 6', daysAgo: 23, hours: 42, appid: 2807960,
    thumb: ['c12d12ce3c7d217398d3fcad77427bfc9d57c570/header.jpg', 'b0f1d6c5c6489a2aee500c5d151ca315aa78ef0a/capsule_616x353_alt_assets_24.jpg'],
    hero:  ['7165682cb6055d92bd2aafd940edbe70cb33ff6b/library_hero_2x.jpg', '7165682cb6055d92bd2aafd940edbe70cb33ff6b/library_hero.jpg'],
    logo:  ['8676c458d98b510064a2ff9dcdc5ce6d1ff11228/logo_2x.png', '8676c458d98b510064a2ff9dcdc5ce6d1ff11228/logo.png'],
    heroPos: '38% 50%', tones: ['#e8742a', '#262b31'] },
];

/* Game Inspector details, by appid. Screenshots, achievement totals, names and
   icons, and DLC names come from each game's Steam store record (checked
   2026-10-25; The Sims 4 and RimWorld have no Steam achievements). Last
   played and playtime come from the sample above; unlocked counts and
   friends are placeholders. */
const ACH_CDN = 'https://shared.akamai.steamstatic.com/community_assets/images/apps/';
const DETAILS = {
  3240220: { achTotal: 77, achDone: 41,
    ach: [['Welcome to Los Santos', '10049685f640607f6c41826aabef9d87210b4c86'], ['A Friendship Resurrected', 'f8d1ec571d81f8ad48a2dd9f028cf6bb0414b9c9'], ["A Fair Day's Pay", '3e73a071eff77c31bfe6fd5f252685acb11e0311'], ['The Moment of Truth', '4a82448f49ec53edfe6fa91d8cab3d31f95612ed']],
    shots: ['d61184a98c1cf2db2b08b2999c04b0519e3615bb/ss_d61184a98c1cf2db2b08b2999c04b0519e3615bb', '8340fd391012e12be7e4c02e65801a2648a6b60e/ss_8340fd391012e12be7e4c02e65801a2648a6b60e', 'f2e70b5823510daa062293ff0b03821e1dee2d37/ss_f2e70b5823510daa062293ff0b03821e1dee2d37'],
    dlc: [],
    friends: [['Nova', 'playing'], ['Kestrel', 'online'], ['Mako', 'owns']] },
  1222670: { achTotal: 0, achDone: 0, ach: [],
    shots: ['ss_537683e5e29c2d6d02c64aa7321dcb26166f7d82', 'ss_2fc938d99a1e87893852cb2d2113478190607941', 'ss_b447d6436d2d00cd5e7c170e509b2246dfc879e8'],
    dlc: [[1235733, 'Seasons', 'header.jpg'], [1235721, 'Cats & Dogs', 'header.jpg'], [1235734, 'Get To Work', 'header.jpg']],
    friends: [['Juniper', 'online'], ['Sable', 'owns']] },
  294100: { achTotal: 0, achDone: 0, ach: [],
    shots: ['80e383ef19353058791efe17a6485849246c9c17/ss_80e383ef19353058791efe17a6485849246c9c17', 'a6158c5cef23ac8157b37dd3eb17f3c2d2649e93/ss_a6158c5cef23ac8157b37dd3eb17f3c2d2649e93', 'cccfece4c643fd32d438642fbea1b980bc519a48/ss_cccfece4c643fd32d438642fbea1b980bc519a48'],
    dlc: [[1149640, 'Royalty', '45ca4ea5e7b18f1ed0a38776c3036146491e998d/header.jpg'], [1392840, 'Ideology', '1735af8e16d6a81f8c41d7940ab7a5cf349089dd/header.jpg'], [1826140, 'Biotech', 'd9e00ec47322ba4f608ebfc98e110190306a15e0/header.jpg']],
    friends: [['Orbit', 'playing'], ['Rook', 'owns'], ['Lumen', 'owns']] },
  949230: { achTotal: 44, achDone: 18,
    ach: [['My First City', 'ae8903eed8cb5f081a8febc59874b54590eb64ca'], ['The Inspector', '0f39199cae0148522f0c12f2c5febb4daa0a8802'], ['Happy to Be of Service', '52d712afaaa6332533c5749653b5875e4bc9b7b2'], ['Royal Flush', 'e8bc4380e2418c454713ed8c5b8ee6f8d028981f']],
    shots: ['fcc6a62a3b53c6f76ae1a7ce0cc5a4b8a0e1f022/ss_fcc6a62a3b53c6f76ae1a7ce0cc5a4b8a0e1f022', 'ee0b920f27abfa62682bbb5c70862a5e18804fe2/ss_ee0b920f27abfa62682bbb5c70862a5e18804fe2', 'c2092a2047a684f24faaaa47e58dc1dc1d3a57e6/ss_c2092a2047a684f24faaaa47e58dc1dc1d3a57e6'],
    dlc: [[2427743, 'Bridges & Ports', '04a438f3cd2b30cd8f170d035cca39ee523d2dc4/header.jpg'], [3579790, 'Creator Pack: Skyscrapers', '7967f641ce29c089543b454670767f0bd1a25f4a/header.jpg'], [3579780, 'Creator Pack: Office Evolution', '3795588c9ba65d5758a7ae247fd5aabd3623675b/header.jpg']],
    friends: [['Pixel', 'playing'], ['Ash', 'online'], ['Nova', 'owns']] },
  243470: { achTotal: 49, achDone: 27,
    ach: [['Hello World', 'f02d53961402c3da6019b98b08a0743afedcfdb4'], ['End of Line', 'be8c2e6880fde3c4f686a6497524e84ecd2d80fb'], ['Basest Base', '1edd5de30329488b3ec2ed41ad08cfae19921012'], ['They Call Him The Vigilante', '18698ab4c13418889ec6d3cbc08ef100d6a5a3ec']],
    shots: ['ss_752aefdfdf2c55dfc8a94d1e9b8d9f6dd42a359c', 'ss_e898214ffaeef618f63e4171a4bd415e7a1f391b', 'ss_0ce6b9f9a11b038f9d1e5dcf12a5d9a9043e6c16'],
    dlc: [[293061, 'Bad Blood', 'header.jpg'], [293059, 'Access Granted Pack', 'header.jpg']],
    friends: [['Kestrel', 'owns'], ['Mako', 'away']] },
  2807960: { achTotal: 53, achDone: 14,
    ach: [['Stand Alone', '30fc2a6cc0f2e271c90187a7e76be65ce87d4f15'], ['Rock of Gibraltar', '91b79cfadb3d9ef18f9dd94ed8c3052e3f0429df'], ['Devil in the Dark', '0b8f78ce16dd7329797543666b47180f7faf32cf'], ['Secret Service', '2c1bd5cad972a4c494c1931f9afaaa26b3fff0ec']],
    shots: ['da4272c45a80ab463989f6b8f6a8f2d26d088732/ss_da4272c45a80ab463989f6b8f6a8f2d26d088732', 'd1760577af2328ae8a21a2b66760baddd0eba015/ss_d1760577af2328ae8a21a2b66760baddd0eba015', '539f35d16112e907d311b98ba01be7dd82806dd8/ss_539f35d16112e907d311b98ba01be7dd82806dd8'],
    dlc: [[4888270, 'Season 5 Battlefield Pro', '08eb815ce56c3e92f136d81ada3447a214c7a9e0/header.jpg']],
    friends: [['Rook', 'playing'], ['Sable', 'playing'], ['Ash', 'online'], ['Orbit', 'owns']] },
};

// The sample's "last played" days, counted back from today.
const SAMPLE_DAY_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
const sampleDay = (days) => (days === 0 ? 'today' : days === 1 ? 'yesterday' : SAMPLE_DAY_FMT.format(new Date(Date.now() - days * 864e5)));
for (const g of SAMPLE_GAMES) {
  g.sub = `Last played ${sampleDay(g.daysAgo)} · ${g.hours} hrs played`;
  const d = DETAILS[g.appid];
  if (d) { const day = sampleDay(g.daysAgo); d.played = day[0].toUpperCase() + day.slice(1); d.hours = g.hours; }
}

// Actions at the top of GAMES while a game is running (in-game menu).
const RESUME = { kind: 'resume', title: 'Resume Game', icon: 'resume', sub: '' };
const QUIT = { kind: 'quit', title: 'Quit Game', icon: 'quit', sub: 'Close the game and return to the launcher' };
// The first item of GAMES, where the launcher starts (so it opens on the
// ribbons, not on a game's art): every game you own, on Tungsten's Library
// page. Not in the in-game menu, nor in search results.
const LIBRARY = { kind: 'library', title: 'Library', icon: 'library', act: 'library', sub: 'Every game you own, A to Z' };

// The other five categories: Steam's own features. Each item names what it
// opens (`act`, carried out by STEAM.open inside Steam); in the standalone
// page they only show "Opening…". `roles` limits an item to some Steam
// windows (Big Picture "bpm", the in-game "overlay", the Steam window "main").
const item = (title, sub, icon, act, roles) => ({ title, sub, icon, act, roles });
const CATEGORIES = [
  { label: 'GAMES', icon: 'controller', items: [] },          // filled at start: the Steam library, or the sample
  { label: 'APPS', icon: 'apps', items: [
    item('Web Browser', 'Search and browse the web', 'globe', 'browser'),
    item('Music Player', 'Play your soundtracks', 'note', 'music', ['bpm', 'overlay']),
    item('Remote Play', 'Stream to another screen', 'cast', 'remoteplay'),
    item('Desktop Mode', 'Leave Big Picture for the Steam window', 'monitor', 'desktop', ['bpm']),
    item('Big Picture Mode', 'Switch Steam to the TV interface', 'monitor', 'bigpicture', ['main']),
  ]},
  { label: 'MEDIA', icon: 'media', items: [
    item('Screenshots', 'Every capture from your games', 'image', 'screenshots'),
    item('Game Clips', 'Moments you saved while playing', 'record', 'recordings'),
    item('Soundtracks', 'Your Steam soundtrack library', 'headphones', 'soundtracks', ['bpm']),
  ]},
  { label: 'FRIENDS', icon: 'friends', items: [
    item('Friends & Chat', 'See who is online and message them', 'friends', 'friends'),
    item('Voice Chat', 'Talk with friends while you play', 'chat', 'voice', ['bpm', 'overlay']),
    item('Recent Players', 'People from your recent matches', 'clock', 'recentplayers'),
    item('Add a Friend', 'Share your friend code', 'addFriend', 'addfriend'),
  ]},
  { label: 'STORE', icon: 'store', items: [
    item('Featured', 'Highlights this week', 'star', 'store'),
    item('Specials', 'Current deals', 'tag', 'specials'),
    item('Wishlist', 'Saved for later', 'heart', 'wishlist'),
    item('Points Shop', 'Spend your Steam Points', 'gift', 'points'),
  ]},
  { label: 'SYSTEM', icon: 'system', items: [
    item('Settings', 'Display, audio and controllers', 'system', 'settings'),
    item('Downloads', 'Updates and installs', 'download', 'downloads'),
    item('Controller', 'Configure your controller', 'controller', 'controller'),
    item('Power', 'Sleep, restart or shut down', 'power', 'power', ['bpm', 'overlay']),
  ]},
];
// Inside Steam, each window only lists what it can open.
if (HOST.kind === 'steam') for (const cat of CATEGORIES) cat.items = cat.items.filter((it) => !it.roles || it.roles.includes(HOST.role));
else for (const cat of CATEGORIES) cat.items = cat.items.filter((it) => it.act !== 'bigpicture');   // the preview shows the Big Picture set

/* ═════════════════════════ Helpers ═════════════════════════ */

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nodeFrom = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
let uid = 0;

function loadImage(url, cors, timeoutMs = 9000) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (cors) img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    const timer = setTimeout(() => { img.src = ''; reject(new Error('timeout')); }, timeoutMs);
    img.onload = () => { clearTimeout(timer); resolve(img); };
    img.onerror = () => { clearTimeout(timer); reject(new Error('load failed')); };
    img.src = url;
  });
}
async function firstImage(urls, cors) {
  for (const url of urls) {
    try { return await loadImage(url, cors); } catch (e) { /* try the next candidate */ }
  }
  return null;
}
// Candidate URLs for a game's art, tried in order. The sample games keep
// paths relative to the CDN; Steam games carry full URLs (Steam's local
// library cache first, then the CDN).
const artUrls = (game, kind) => (game.live ? (game.art[kind] || []) : (game[kind] || []).map((p) => `${CDN}${game.appid}/${p}`));
const dedupe = (list) => [...new Set(list.filter(Boolean))];
const safe = (fn, fallback) => { try { const v = fn(); return v === undefined || v === null ? fallback : v; } catch (e) { return fallback; } };
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);
const whenLoaded = (fn) => (document.readyState === 'complete' ? setTimeout(fn, 0) : window.addEventListener('load', fn, { once: true }));

/* ═════════════════════════ Steam library (Millennium) ═════════════════════════
   Inside Steam, Tungsten reads the real library from Steam's own stores, the
   same ones the Steam library uses. They live in Steam's shared JS context,
   which opened this window, so they're reached through window.opener:
   - collectionStore.localGamesCollection: the games installed on this PC,
     shown most recently played first (if there are none, recent games)
   - appStore overviews: name, playtime (minutes_playtime_forever), last played
     (rt_last_time_played), install and cloud status
   - appDetailsStore: library art (hero, logo, header), achievements, DLC and
     your own screenshots, for the Game Inspector
   Art is tried in order: Steam's own URLs (custom art first, then its local
   cache), then /assets/<appid>_library_hero.jpg-style cache paths, then the
   CDN. Launch, resume and quit go through SteamClient.Apps (RunGame,
   RaiseWindowForGame, TerminateApp), the calls Steam's own Play, Resume and
   Exit buttons make; Properties and Controller Layout open Steam's own
   windows (OpenAppSettingsDialog, ShowControllerConfigurator). If the stores
   can't be reached, the sample library is used instead.                     */

const STEAM = (() => {
  if (!IN_STEAM) return null;
  const wins = [window];
  try { if (window.opener) wins.push(window.opener); } catch (e) { /* not reachable */ }
  try { if (window.top && window.top !== window) wins.push(window.top); } catch (e) { /* not reachable */ }
  const find = (test) => { for (const w of wins) { try { if (w && test(w)) return w; } catch (e) { /* cross-origin */ } } return null; };
  const host = () => find((w) => w.appStore && w.collectionStore);
  // SteamClient for app, overlay and session calls: this window's own copy
  // when it has those parts (registrations then end with the window), else the
  // shared context's.
  const client = (part) => {
    const w = find((x) => x.SteamClient && x.SteamClient[part]);
    return w ? w.SteamClient : null;
  };

  const isGame = (o) => (o.app_type & 1) === 1 || safe(() => o.BIsShortcut(), false);
  const gameIdOf = (o) => safe(() => String(o.GetGameID()), '') || String(o.gameid || o.appid);

  // "Last played Oct 22 · 142 hrs played", like the sample subtitles. (The
  // formatters are made once: a toLocale…String call with options builds a
  // new one each time, which for a whole library read was most of its cost.)
  const DAY_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });
  const DAY_YEAR_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const COUNT_FMT = new Intl.NumberFormat('en-US');
  function playedText(rt) {
    if (!rt) return '';
    const d = new Date(rt * 1000), now = new Date();
    const day = (x) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const days = Math.round((day(now) - day(d)) / 86400000);
    if (days <= 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return (d.getFullYear() !== now.getFullYear() ? DAY_YEAR_FMT : DAY_FMT).format(d);
  }
  function hoursText(min) {
    if (!min) return '';
    if (min < 60) return `${min} min`;
    const h = Math.round(min / 60);
    return `${COUNT_FMT.format(h)} hr${h === 1 ? '' : 's'}`;       // "2,330 hrs"
  }
  function subtitle(o) {
    const played = playedText(o.rt_last_time_played), hours = hoursText(o.minutes_playtime_forever);
    if (!played && !hours) return 'Not played yet';
    return [played && `Last played ${played === 'Today' || played === 'Yesterday' ? played.toLowerCase() : played}`, hours && `${hours} played`].filter(Boolean).join(' · ');
  }
  // Two tones per game for the generated stand-in art.
  function tones(appid) {
    const h = (appid * 47) % 360;
    return [`hsl(${h} 55% 55%)`, `hsl(${(h + 200) % 360} 45% 18%)`].map(hslToHex);
  }
  function hslToHex(hsl) {
    const [h, s, l] = hsl.match(/[\d.]+/g).map(Number);
    const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
    const f = (n) => { const k = (n + h / 30) % 12; const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); return Math.round(c * 255).toString(16).padStart(2, '0'); };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  function toGame(o) {
    const appid = o.appid, w = host(), ds = w && w.appDetailsStore;
    return {
      live: true, appid, gameid: gameIdOf(o), o, shortcut: isShortcut(o),
      title: o.display_name, sub: subtitle(o),
      aka: o.sort_as && o.sort_as !== o.display_name ? String(o.sort_as) : '',
      heroPos: '50% 50%', tones: tones(appid),
      art: {
        thumb: dedupe([...safe(() => Array.from(ds.GetHeaderImages(o)), []), `/assets/${appid}/header.jpg`, `/assets/${appid}_header.jpg`, `${CDN}${appid}/header.jpg`]),
        hero: [`/assets/${appid}_library_hero.jpg`, `/assets/${appid}/library_hero.jpg`, `${CDN}${appid}/library_hero.jpg`],
        logo: [`/assets/${appid}_logo.png`, `/assets/${appid}/logo.png`, `${CDN}${appid}/logo.png`],
      },
    };
  }

  // Steam fills its stores only after it has signed in. Some of its lists
  // can't be worked out before then, and Steam keeps the error from an early
  // read (Big Picture's Home then fails to draw until Steam restarts), so
  // nothing is read until Steam says its services are up.
  // true, false, or null when this Steam version doesn't say.
  function ready() {
    const w = host();
    if (!w) return false;
    const app = safe(() => w.App, null);
    if (app && typeof app.GetServicesInitialized === 'function') return safe(() => app.GetServicesInitialized() === true, false);
    return safe(() => typeof w.collectionStore.m_mapSystemCollectionIdToName.get === 'function', false) || null;
  }

  // ── Games and apps ──
  // Steam's game lists in Big Picture leave non-Steam shortcuts out (they
  // have a tab of their own there, "Non-Steam"), so Tungsten adds them back:
  // a game added to Steam by hand is a game here too. Apps go to APPS
  // instead of GAMES and the Library: Steam's software (Wallpaper Engine,
  // DSX...), tools you've started yourself (SteamVR; not Proton or a
  // redistributable), what's in a collection you named Utilities, Apps,
  // Applications, Software, Tools or Programs, and anything moved there with
  // Tungsten's Move to APPS (Move to GAMES moves anything back).
  const APP_COLLECTION = /^(?:apps?|applications?|software|utilit(?:y|ies)|tools?|programs?)$/i;
  const PLUMBING = /^(?:steamworks common redistributables|steamworks sdk|steam linux runtime|proton\b)/i;   // tools Steam runs for games, never you
  const isShortcut = (o) => safe(() => o.BIsShortcut(), false);
  const isInstalled = (o) => isShortcut(o) || safe(() => o.local_per_client_data.installed === true, false);
  const readMoved = () => {                       // Move to APPS / Move to GAMES: { appid: 'apps' | 'games' }
    try { const m = JSON.parse(localStorage.getItem('tungsten.apps') || '{}'); return m && typeof m === 'object' && !Array.isArray(m) ? m : {}; } catch (e) { return {}; }
  };
  function appCollectionIds(cs) {
    const ids = new Set();
    for (const c of safe(() => Array.from(cs.userCollections), [])) {
      if (!APP_COLLECTION.test(String(safe(() => c.displayName, '') || '').trim())) continue;
      for (const o of safe(() => Array.from(c.allApps), [])) if (o && o.appid) ids.add(o.appid);
    }
    return ids;
  }
  // Where something belongs: 'games', 'apps', or '' (neither: DLC, a
  // soundtrack, a tool you never started).
  function placeOf(o, coll, moved) {
    const m = moved[o.appid];
    if (m === 'apps' || m === 'games') return m;
    if (coll.has(o.appid)) return 'apps';
    if ((o.app_type & 2) === 2) return 'apps';                                  // software
    if ((o.app_type & 4) === 4) return o.rt_last_time_played && !PLUMBING.test(String(o.display_name || '').trim()) ? 'apps' : '';   // a tool you've started
    return isGame(o) ? 'games' : '';
  }
  function shortcuts(cs) {                        // the non-Steam shortcuts
    const own = safe(() => cs.deckDesktopApps, null);   // (Big Picture's Non-Steam tab)
    let list = own ? safe(() => Array.from(own.allApps), []) : [];
    if (!list.length) list = safe(() => Array.from(cs.allAppsCollection.allApps).filter((o) => o && isShortcut(o)), []);
    return list;
  }
  const allApps = (cs) => safe(() => Array.from(cs.allAppsCollection.allApps), []);
  const byRecent = (a, b) => (b.rt_last_time_played || 0) - (a.rt_last_time_played || 0) ||
    String(a.sort_as || a.display_name).localeCompare(String(b.sort_as || b.display_name));

  // The installed games, most recently played first (up to 1,000: only the
  // rows near the focus are ever laid out). null while Steam isn't ready;
  // when Steam can't say, only once `force` is set (after a wait).
  function library(force = false) {
    const w = host(), r = ready();
    if (!w || r === false || (r === null && !force)) return null;
    const cs = w.collectionStore;
    const apps = (name) => safe(() => Array.from(cs[name].allApps), []);
    let list = apps('localGamesCollection');
    if (!list.length) list = apps('recentAppsCollection');
    if (!list.length) list = apps('allGamesCollection');
    const coll = appCollectionIds(cs), moved = readMoved();
    const seen = new Set(list.map((o) => o && o.appid));
    const more = [...shortcuts(cs)];
    if (Object.values(moved).includes('games')) more.push(...allApps(cs).filter((o) => o && moved[o.appid] === 'games' && isInstalled(o)));
    for (const o of more) if (o && o.appid && !seen.has(o.appid)) { seen.add(o.appid); list.push(o); }
    list = list.filter((o) => o && o.appid && o.display_name && placeOf(o, coll, moved) === 'games');
    list.sort(byRecent);
    return list.slice(0, MAX_GAMES).map(toGame);
  }
  // The installed apps, most recently used first.
  function userApps() {
    const w = host(), r = ready();
    if (!w || r === false) return null;
    const cs = safe(() => w.collectionStore, null);
    if (!cs) return null;
    const coll = appCollectionIds(cs), moved = readMoved();
    const seen = new Set(), list = [];
    for (const o of [...allApps(cs), ...shortcuts(cs)]) {
      if (!o || !o.appid || !o.display_name || seen.has(o.appid)) continue;
      seen.add(o.appid);
      if (isInstalled(o) && placeOf(o, coll, moved) === 'apps') list.push(o);
    }
    list.sort(byRecent);
    return list.map((o) => {
      const it = toGame(o), used = playedText(o.rt_last_time_played);
      it.kind = 'app';
      it.sub = used ? `Last used ${used === 'Today' || used === 'Yesterday' ? used.toLowerCase() : used}` : 'Not used yet';
      return it;
    });
  }

  // Every game the account owns, installed here or not (Steam's All Games,
  // plus anything installed that isn't in it, and the non-Steam shortcuts),
  // for Tungsten's Library: name and sort name, installed or not, last
  // played and playtime (and the subtitle GAMES would give it). Apps are
  // left out (see "Games and apps"). Also Steam's own Favorites and the
  // user's collections (Big Picture lists its Installed collection among
  // them too: that one is left out, it's the Installed filter already).
  function owned() {
    const w = host(), r = ready();
    if (!w || r === false) return null;
    const cs = safe(() => w.collectionStore, null);
    if (!cs) return null;
    const appsOf = (c) => (c ? safe(() => Array.from(c.allApps), []) : []);
    const local = appsOf(safe(() => cs.localGamesCollection, null));
    const here = new Set(local.map((o) => o && o.appid));
    const coll = appCollectionIds(cs), moved = readMoved();
    const seen = new Map();
    for (const o of [...appsOf(safe(() => cs.allGamesCollection, null)), ...local, ...shortcuts(cs)]) {
      if (!o || !o.appid || !o.display_name || seen.has(o.appid) || placeOf(o, coll, moved) !== 'games') continue;
      seen.set(o.appid, {
        appid: o.appid, title: String(o.display_name), sort: String(o.sort_as || o.display_name),
        installed: here.has(o.appid) || isShortcut(o), played: +o.rt_last_time_played || 0, minutes: +o.minutes_playtime_forever || 0,
        sub: subtitle(o),
      });
    }
    const idsOf = (c) => new Set(appsOf(c).map((o) => o && o.appid).filter((id) => seen.has(id)));
    const fav = safe(() => cs.collectionsFromStorage.get('favorite'), null) || safe(() => cs.GetCollection('favorite'), null);
    const localColl = safe(() => cs.localGamesCollection, null), localId = safe(() => localColl.id, undefined);
    // (Names are shown trimmed: a leading space is a common way to sort them in Steam.)
    const collections = safe(() => Array.from(cs.userCollections), [])
      .filter((c) => c && c !== localColl && (localId === undefined || c.id !== localId) && String(safe(() => c.displayName, '') || '').trim())
      .map((c) => ({ id: String(safe(() => c.id, '') || c.displayName), name: String(c.displayName).trim(), ids: idsOf(c) }))
      .filter((c) => c.ids.size);
    return { games: [...seen.values()], favorites: fav ? idsOf(fav) : new Set(), collections };
  }
  // How many games that is (for the Library's subtitle), without building them.
  function ownedCount() {
    const cs = safe(() => host().collectionStore, null);
    if (!cs) return 0;
    const coll = appCollectionIds(cs), moved = readMoved();
    const ids = new Set();
    for (const list of [safe(() => Array.from(cs.allGamesCollection.allApps), []), safe(() => Array.from(cs.localGamesCollection.allApps), []), shortcuts(cs)]) {
      for (const o of list) if (o && o.appid && o.display_name && placeOf(o, coll, moved) === 'games') ids.add(o.appid);
    }
    return ids.size;
  }

  // ── Steam's own UI sounds ──
  // Big Picture's gamepad interface plays a sound of its own for moves,
  // selects, its menus and pages: one player for every Big Picture window,
  // the in-game overlay included (SteamUIStore.GamepadUIAudio). Over
  // Tungsten they'd play on top of Tungsten's own, so while Tungsten has the
  // screen those navigation sounds are held back. Steam's notification
  // sounds (messages, achievements, screenshots, the volume) still play, and
  // with Tungsten off, or stepped aside for one of Steam's pages or menus,
  // everything is Steam's again. Each Tungsten window says whether it has
  // the screen right now (quietWhen); the player asks when a sound comes up.
  // It's wrapped from a window that lasts (Big Picture, or the Steam
  // window) and unwrapped when that window goes.
  const NAV_SOUND = /\/deck_ui_(?:misc_10|bumper_end|default_activation|navigation|launch_game|into_game_detail|out_of_game_detail|show_modal|hide_modal|side_menu_fly_|tab_transition|tile_scroll|slider_|switch_toggle_|typing)/;
  const quietKey = `${HOST.role}:${Math.random().toString(36).slice(2)}`;
  function quietWhen(fn, install) {
    const w = host();
    if (!w) return false;
    const reg = w.__tungstenQuiet || (w.__tungstenQuiet = new Map());
    if (!reg.has(quietKey)) window.addEventListener('pagehide', () => reg.delete(quietKey));
    reg.set(quietKey, fn);
    if (!install) return true;
    const player = safe(() => w.SteamUIStore.GamepadUIAudio.AudioPlaybackManager, null) ||
      safe(() => w.SteamUIStore.m_GamepadUIAudioStore.m_AudioPlaybackManager, null);
    if (!player || typeof player.PlayAudioURL !== 'function') return false;
    if (Object.prototype.hasOwnProperty.call(player, 'PlayAudioURL')) return true;   // (wrapped already, from another window)
    const play = player.PlayAudioURL;
    function PlayAudioURL(url, ...rest) {
      try {
        if (typeof url === 'string' && NAV_SOUND.test(url)) {
          for (const [k, quiet] of reg) {
            let q = false;
            try { q = quiet() === true; } catch (e) { reg.delete(k); }   // (a window that's gone)
            if (q) return undefined;
          }
        }
      } catch (e) { /* never in Steam's way */ }
      return play.call(this, url, ...rest);
    }
    Object.defineProperty(player, 'PlayAudioURL', { value: PlayAudioURL, configurable: true, writable: true });
    window.addEventListener('pagehide', () => { try { if (player.PlayAudioURL === PlayAudioURL) delete player.PlayAudioURL; } catch (e) { /* gone */ } });
    tlog("Steam's navigation sounds: held back while Tungsten has the screen");
    return true;
  }
  // The controller Steam says was used last, for the legend's button
  // symbols: which family it belongs to, and Steam's own settings for its
  // buttons (Nintendo layout, swapped buttons, universal symbols). Steam's
  // controller types (EControllerType): 4 the Steam Deck; 33, 34, 45, 46
  // PlayStation; 38 to 44 Nintendo Switch pads. Newer ones (a DualSense
  // Edge, a Switch 2 pad...) go by their name; anything else is an Xbox
  // style pad. null when Steam doesn't say.
  const PS_PADS = new Set([33, 34, 45, 46]), NINTENDO_PADS = new Set([38, 39, 40, 41, 42, 44]);
  function padKind() {
    const c = safe(() => host().SteamUIStore.MostRecentlyActiveController, null);
    if (!c || typeof c.eControllerType !== 'number') return null;
    const t = c.eControllerType, name = String(safe(() => c.strName, '') || '');
    const family = PS_PADS.has(t) || /dualsense|dualshock|playstation|\bps[345]\b/i.test(name) ? 'ps'
      : NINTENDO_PADS.has(t) || /nintendo|switch|joy-?con/i.test(name) ? 'nintendo'
      : t === 4 || /steam deck/i.test(name) ? 'deck' : 'xbox';
    return { family, swap: !!c.bUseReversedLayout !== !!c.bNintendoLayout, universal: !!c.bUseUniversalFaceButtonGlyphs, type: t, name };
  }

  // Apps opened from Tungsten, in any window: appid -> { at (Date.now),
  // shortcut, seen (running since), stalled, handled (by which windows) }.
  // Steam sends every Big Picture window, the overlay included, to an app's
  // page as it starts it (all but tools), and Tungsten takes them back (see
  // watchSteamPages).
  const appLaunches = () => { const w = host(); return w ? (w.__tungstenAppLaunches || (w.__tungstenAppLaunches = new Map())) : new Map(); };

  // A game that isn't installed here: Steam's own install dialog for it (it
  // asks where, and how big), as Steam's library does it.
  function install(appid) {
    const sc = safe(() => host().SteamClient, null) || client('Installs');
    try {
      if (sc && sc.Installs && typeof sc.Installs.OpenInstallWizard === 'function') {
        const r = sc.Installs.OpenInstallWizard([Number(appid)]);
        if (r && typeof r.catch === 'function') r.catch((e) => tlog(`install ${appid}: ${e && e.message}`));
        tlog(`install ${appid}: Steam's install dialog`);
        return true;
      }
    } catch (e) { tlog(`install ${appid}: ${e && e.message}`); }
    tlog(`install ${appid} (steam:// link)`);
    return steamUrl(`steam://install/${appid}`);
  }

  // Steam's own hero and logo URLs need the app's details (asset file names).
  async function prepareArt(it) {
    if (it.artReady) return;
    it.artReady = true;
    const w = host(), ds = w && w.appDetailsStore;
    if (!ds) return;
    try { await withTimeout(Promise.resolve(ds.RequestAppDetails(it.appid)), 4000); } catch (e) { /* use the fallbacks */ }
    it.art.hero = dedupe([...safe(() => Array.from(ds.GetHeroImages(it.o).rgHeroImages), []), ...it.art.hero]);
    it.art.logo = dedupe([...safe(() => Array.from(ds.GetLogoImages(it.o).rgLogoImages), []), ...it.art.logo]);
  }

  async function appDetails(appid) {
    const w = host(), ds = w && w.appDetailsStore;
    if (ds) { try { const d = await withTimeout(Promise.resolve(ds.RequestAppDetails(appid)), 5000); if (d) return d; } catch (e) { /* try the client */ } }
    const sc = client('Apps');
    if (!sc || !sc.Apps.RegisterForAppDetails) return null;
    return new Promise((resolve) => {
      let reg = null;
      const done = (d) => { if (reg) { try { reg.unregister(); } catch (e) { /* gone */ } reg = null; } resolve(d); };
      setTimeout(() => done(null), 5000);
      try { reg = sc.Apps.RegisterForAppDetails(appid, (d) => done(d)); } catch (e) { done(null); }
    });
  }

  const CLOUD = { 1: 'Off', 2: 'Unknown', 3: 'Up to Date', 4: 'Checking', 5: 'Out of Sync', 6: 'Uploading', 7: 'Downloading', 8: 'Sync Failed', 9: 'Conflict', 10: 'Pending' };
  // Everything the Game Inspector shows, from Steam. Friends aren't exposed
  // to themes in a usable form, so that section is left out for Steam games.
  async function details(it) {
    const [d, o] = [await appDetails(it.appid), safe(() => host().appStore.GetAppOverviewByAppID(it.appid), null) || it.o];
    const cloud = safe(() => o.local_per_client_data.cloud_status, null) ?? (d && d.eCloudStatus);
    const ach = (d && d.achievements) || {};
    const got = safe(() => Array.from(ach.vecHighlight), []).filter((a) => a.bAchieved !== false);
    const todo = safe(() => Array.from(ach.vecUnachieved), []);
    const img = (a) => (a.strImage && !/^https?:/.test(a.strImage) ? `https://cdn.akamai.steamstatic.com/steamcommunity/public/images/apps/${it.appid}/${a.strImage}` : a.strImage || '');
    const badges = [...got.slice(0, todo.length ? 3 : 4).map((a) => ({ name: a.strName, src: img(a), locked: false })),
      ...todo.slice(0, 1).map((a) => ({ name: a.strName, src: img(a), locked: true }))];
    const shots = safe(() => Array.from(d.vecScreenShots), [])
      .filter((x) => /^https?:/.test(x.strUrl || ''))
      .sort((a, b) => (b.nCreated || 0) - (a.nCreated || 0)).slice(0, 3)
      .map((x) => ({ thumb: x.strUrl, full: x.strUrl }));
    const dlc = safe(() => Array.from(d.vecDLC), []).filter((x) => x.bEnabled)
      .map((x) => ({ name: x.strName, src: `${CDN}${x.unAppID}/${x.strHeaderFilename || 'header.jpg'}` }));
    return {
      live: true,
      played: playedText(o.rt_last_time_played) || 'Never',
      hours: hoursText(o.minutes_playtime_forever) || '0 hrs',
      cloud: { text: CLOUD[cloud] || 'Unavailable', ok: cloud === 3 },
      ach: { total: ach.nTotal || 0, done: ach.nAchieved || 0, badges },
      friends: null,
      shots, shotsNote: 'No screenshots yet',
      dlc, dlcNote: 'No DLC installed',
    };
  }

  function runningAppIds() {
    if (ready() === false) return [];
    const ui = safe(() => host().SteamUIStore, null), ids = [];
    const add = (a) => { if (a && a.appid && !ids.includes(a.appid)) ids.push(a.appid); };
    add(safe(() => ui.MainRunningApp, null));
    for (const a of safe(() => Array.from(ui.RunningApps), [])) add(a);
    return ids;
  }

  // The game this overlay window belongs to: its title is
  // "SP Overlay: <pid>/<browser id>/<browser type>".
  async function overlayApp() {
    const m = /^SP Overlay:\s*(\d+)\/(\d+)/.exec(document.title || ''), sc = client('Overlay');
    if (m && sc && sc.Overlay.GetOverlayBrowserInfo) {
      try {
        const all = Array.from((await sc.Overlay.GetOverlayBrowserInfo()) || []);
        const hit = all.find((b) => String(b.unPID) === m[1] && String(b.nBrowserID) === m[2]) || all.find((b) => String(b.unPID) === m[1]);
        if (hit && hit.appID) return { appid: hit.appID, pid: hit.unPID };
      } catch (e) { /* fall through */ }
    }
    const ids = runningAppIds();
    return ids.length ? { appid: ids[0], pid: m ? +m[1] : 0 } : null;
  }

  // The header stats straight from the library overview (no details needed).
  function quick(it) {
    const o = safe(() => host().appStore.GetAppOverviewByAppID(it.appid), null) || it.o || {};
    const cloud = safe(() => o.local_per_client_data.cloud_status, null);
    return {
      played: playedText(o.rt_last_time_played) || 'Never',
      hours: hoursText(o.minutes_playtime_forever) || '0 hrs',
      cloud: { text: CLOUD[cloud] || '', ok: cloud === 3 },
    };
  }

  // The main window shows Store and Community pages in a separate browser view
  // that Steam draws above the window's own page, Tungsten included. Going to
  // Steam's own Library page hides it again.
  const mainHistory = () => { const w = find((x) => x.MainWindowBrowserManager && x.MainWindowBrowserManager.m_history); return w ? w.MainWindowBrowserManager.m_history : null; };
  const onWebPage = () => /^\/browser(\/|$)/.test(safe(() => mainHistory().location.pathname, ''));
  function showLibrary() {
    if (!onWebPage()) return false;
    try { mainHistory().push('/library/home'); return true; } catch (e) { /* try Steam's own link */ }
    const sc = client('URL');
    try { if (sc && sc.URL.ExecuteSteamURL) { sc.URL.ExecuteSteamURL('steam://open/games'); return true; } } catch (e) { /* nothing else to try */ }
    return false;
  }
  function onPageChange(cb) {
    const h = mainHistory();
    if (!h || !h.listen) return null;
    try { const un = h.listen(() => cb()); return { unregister: typeof un === 'function' ? un : () => {} }; } catch (e) { return null; }
  }

  const apps = () => { const sc = client('Apps'); return sc && sc.Apps; };
  // steam:// links go to the client itself, not through the window.
  function steamUrl(url) {
    const sc = client('URL');
    try { if (sc && sc.URL.ExecuteSteamURL) { sc.URL.ExecuteSteamURL(url); return true; } } catch (e) { /* fall back */ }
    window.location.href = url;
    return true;
  }

  // Steam's own object for this window (Big Picture's, the in-game overlay's
  // or the Steam window's). Its Navigator opens Steam's pages the way Steam's
  // own menus do, and its MenuStore holds the Steam and Quick Access menus.
  function instance() {
    const ws = safe(() => host().SteamUIStore.WindowStore, null);
    if (!ws) return null;
    const pid = IN_OVERLAY ? +((/^SP Overlay:\s*(\d+)\//.exec(document.title || '') || [])[1] || 0) : 0;   // the game's process
    return safe(() => ws.GetWindowInstanceFromWindow(window), null)
      || (IN_BPM ? safe(() => ws.GamepadUIMainWindowInstance, null) : null)
      || (pid ? safe(() => ws.GetInstanceForPID(pid), null) : null)
      || (HOST.role === 'main' ? safe(() => ws.MainWindowInstance, null) : null);
  }
  const nav = () => safe(() => instance().Navigator, null);
  const menus = () => safe(() => instance().MenuStore, null);
  // The page this window shows, as Steam's router has it ("/library/home",
  // "/apprunning", "/steamweb"...), or "" when it has none.
  const pagePath = () => String(safe(() => instance().LocationPathName, '') || '');
  // Steam names its store and community pages; the addresses are the fallback.
  const WEB = {
    store: ['StoreFrontPage', 'https://store.steampowered.com/'],
    specials: ['StoreSpecials', 'https://store.steampowered.com/specials'],
    wishlist: ['UserWishlist', 'https://store.steampowered.com/wishlist/'],
    points: ['PointsShop', 'https://store.steampowered.com/points/shop/'],
    recentplayers: ['CurrentlyPlayedWith', 'https://steamcommunity.com/my/friends/coplay/'],
    addfriend: ['CommunityAddFriends', 'https://steamcommunity.com/my/friends/add'],
  };
  const webUrl = (act) => {
    const url = safe(() => host().urlStore.ResolveURL(WEB[act][0]), null) || WEB[act][1];
    // Steam's "CurrentlyPlayedWith" is the community's players page, which
    // now only shows the friends list. Recently Played With is /friends/coplay/.
    return act === 'recentplayers' ? String(url).replace(/\/friends\/players\/?(?=$|[?#])/, '/friends/coplay/') : url;
  };
  const QAM = { voice: 2, friends: 3, music: 7 };   // Quick Access tabs (Steam's own numbering)
  // Quick Access only has its Voice tab while a voice chat is on.
  const voiceActive = () => !!safe(() => host().g_FriendsUIApp.VoiceStore.IsAnyVoiceActive(), false);
  // Steam's media page, filtered to one kind (its filter: where from, which
  // kind, uploaded or not; "clip" is a clip you saved).
  const mediaFilter = (kind) => ({ listSource: { type: 'recents' }, mediaType: kind, uploadStatus: 'all' });
  // steam:// links, for a window whose navigator isn't there.
  const LINKS = {
    store: 'steam://store', downloads: 'steam://open/downloads', settings: 'steam://open/settings', library: 'steam://open/games',
    controller: 'steam://open/settings', remoteplay: 'steam://open/settings', friends: 'steam://open/friends',
    voice: 'steam://open/friends', screenshots: 'steam://open/screenshots', recordings: 'steam://open/screenshots',
    bigpicture: 'steam://open/bigpicture', browser: 'steam://openurl/https://www.google.com/',
  };
  // Opens what a non-game item stands for. true when it went to Steam.
  function open(act) {
    const n = nav(), m = menus();
    const gamepad = !!n && (n.type === 'gamepad' || n.type === 'gamepadoverlay');
    const tryIt = (fn) => { try { fn(); return true; } catch (e) { tlog(`open ${act}: ${e && e.message}`); return false; } };
    const done = (() => {
      switch (act) {
        case 'store': case 'specials': case 'wishlist': case 'points': case 'recentplayers': case 'addfriend':
          return !!n && !!n.SteamWeb && tryIt(() => n.SteamWeb(webUrl(act)));
        case 'browser':                              // Big Picture's web browser, the overlay's, or the desktop's own browser
          return !!n && !!n.ExternalWeb && tryIt(() => n.ExternalWeb('https://www.google.com/'));
        case 'music': case 'voice': {
          // No voice chat on: the Friends tab, where one starts.
          const tab = act === 'voice' && !voiceActive() ? QAM.friends : QAM[act];
          if (gamepad && m && m.OpenQuickAccessMenu) return tryIt(() => m.OpenQuickAccessMenu(tab, true));
          return act === 'voice' && !!n && !!n.Chat && tryIt(() => n.Chat());
        }
        case 'remoteplay':
          return !!n && !!n.Settings && tryIt(() => n.Settings('RemotePlay'));
        case 'friends':
          return !!n && !!n.Chat && tryIt(() => n.Chat());
        case 'screenshots': case 'recordings':
          return !!n && !!n.Media && tryIt(() => n.Media.Grid({ state: { filter: mediaFilter(act === 'screenshots' ? 'screenshot' : 'clip') } }));
        case 'soundtracks':
          return gamepad && !!n.LibraryTab && tryIt(() => n.LibraryTab('Soundtracks'));
        case 'settings':
          return !!n && !!n.Settings && tryIt(() => n.Settings(gamepad ? 'Root' : 'General'));
        case 'controller':
          return !!n && !!n.Settings && tryIt(() => n.Settings('Controller'));
        case 'downloads':
          return !!n && !!n.Downloads && tryIt(() => n.Downloads());
        case 'library':                              // Steam's own library page
          if (n && n.LibraryTab && tryIt(() => n.LibraryTab('AllGames'))) return true;
          return !!n && !!n.Library && tryIt(() => n.Library());
        case 'power': {
          const ui = safe(() => host().SteamUIStore, null);
          return !!ui && !!ui.OpenPowerMenu && tryIt(() => ui.OpenPowerMenu(document.documentElement));
        }
        case 'desktop': {                            // as the Power menu's Exit Big Picture does it: minimize, then leave
          const sc = client('UI');
          if (!sc || !sc.UI.ExitBigPictureMode) return false;
          try { window.SteamClient.Window.Minimize(); } catch (e) { /* leaving still works */ }
          return tryIt(() => sc.UI.ExitBigPictureMode());
        }
        default: return false;
      }
    })();
    if (done) { tlog(`opened ${act}`); return true; }
    if (LINKS[act]) { tlog(`opened ${act} (steam:// link)`); return steamUrl(LINKS[act]); }
    tlog(`can't open ${act} here`);
    return false;
  }
  // Tungsten's own Power menu runs what Steam's Power menu runs (sp.js):
  // Sleep through Steam's SuspendResumeStore.RequestSleep(), which has the
  // sleep manager get downloads and Steam Cloud ready (or ask about them)
  // before it suspends; Restart and Shut Down through SteamClient.System;
  // Restart and Exit Steam through SteamClient.User. All from the shared
  // context's SteamClient, where Steam's own menu calls them.
  const sysClient = () => safe(() => host().SteamClient, null) || client('System');
  const POWER_CALLS = {
    sleep: () => {
      const s = safe(() => host().SuspendResumeStore, null);
      if (s && typeof s.RequestSleep === 'function') return () => s.RequestSleep();
      const sc = sysClient();
      return sc && sc.System && typeof sc.System.SuspendPC === 'function' ? () => sc.System.SuspendPC() : null;
    },
    restart: () => { const sc = sysClient(); return sc && sc.System && typeof sc.System.RestartPC === 'function' ? () => sc.System.RestartPC() : null; },
    shutdown: () => { const sc = sysClient(); return sc && sc.System && typeof sc.System.ShutdownPC === 'function' ? () => sc.System.ShutdownPC() : null; },
    restartsteam: () => { const sc = sysClient(); return sc && sc.User && typeof sc.User.StartRestart === 'function' ? () => sc.User.StartRestart(false) : null; },
    exitsteam: () => { const sc = sysClient(); return sc && sc.User && typeof sc.User.StartShutdown === 'function' ? () => sc.User.StartShutdown(true) : null; },
    exitbpm: () => { const sc = client('UI'); return sc && typeof sc.UI.ExitBigPictureMode === 'function' ? () => open('desktop') : null; },
  };
  const canPower = (kind) => !!(POWER_CALLS[kind] && safe(POWER_CALLS[kind], null));
  function power(kind) {
    const fn = POWER_CALLS[kind] && safe(POWER_CALLS[kind], null);
    if (!fn) { tlog(`power: ${kind} isn't available`); return false; }
    try {
      const r = fn();
      if (r && typeof r.catch === 'function') r.catch((e) => tlog(`power: ${kind} failed (${e && e.message})`));
      tlog(`power: ${kind}`);
      return r !== false;
    } catch (e) { tlog(`power: ${kind} failed (${e && e.message})`); return false; }
  }

  // ── Tungsten's own pages: Steam's data, the calls Steam's own pages make ──
  // Downloads: Steam's downloadsStore, read the way its Downloads page reads
  // it (a row's bytes are the sum of its update types' Download progress,
  // k_EAppUpdateProgress_Download = 2; the active row's percent, speed and
  // time left come from the overview).
  const DL = 2;
  const appTitle = (appid) => safe(() => host().appStore.GetAppOverviewByAppID(appid).display_name, '') || `App ${appid}`;
  function downloads() {
    const ds = safe(() => host().downloadsStore, null);
    if (!ds) return null;
    const ov = safe(() => ds.LocalDownloadOverview, null) || {};
    const row = (x) => {
      const appid = x.appid, active = !!appid && ov.update_appid == appid;   // (== : the ids can be numbers or strings)
      const sum = (k) => safe(() => Array.from(x.update_type_info).reduce((n, u) => n + (+u.progress[DL][k] || 0), 0), 0);
      let done = sum('bytes_in_progress'), total = sum('bytes_total');
      if (!total && active) { done = +safe(() => ov.progress[DL].bytes_in_progress, 0) || 0; total = +safe(() => ov.progress[DL].bytes_total, 0) || 0; }
      return {
        appid, title: appTitle(appid), active,
        completed: !!x.completed, queued: x.queue_index !== -1 && !x.deferred_time,
        paused: (!!x.paused || !!ov.paused) && !x.completed,
        pct: active ? +ov.overall_percent_complete || 0 : x.completed ? 100 : +x.overall_percent_complete || 0,
        done, total,
        secs: active ? +ov.overall_estimated_time_remaining_sec || -1 : -1,
        bps: active ? +ov.update_network_bytes_per_second || 0 : 0,
        state: active ? String(ov.update_state || '') : '',
        at: +x.completed_time || 0,
        deferred: +x.deferred_time || 0,
      };
    };
    const list = (k) => safe(() => Array.from(ds[k] || []), []).map(row);
    const queued = list('QueuedTransfers');
    return {
      paused: !!ov.paused, state: String(ov.update_state || 'None'), bps: +ov.update_network_bytes_per_second || 0,
      appid: ov.update_appid || 0, pct: +ov.overall_percent_complete || 0,
      queued, unqueued: list('UnqueuedTransfers'), scheduled: list('ScheduledTransfers'),
      completed: list('CompletedTransfers').slice(0, 30),
    };
  }
  // Something is downloading right now (for the indicator by the clock):
  // Steam has an update under way (update_appid) and isn't paused. Its
  // state can be any of Steam's (Starting, Downloading, Updating, Patching,
  // Installing, Verifying, Finalizing...); only None and Stopping don't count.
  function downloading() {
    const ov = safe(() => host().downloadsStore.LocalDownloadOverview, null);
    const st = String((ov && ov.update_state) || '');
    return !!ov && !ov.paused && !!ov.update_appid && !/^(None|Stopping)?$/i.test(st)
      ? { appid: ov.update_appid, pct: +ov.overall_percent_complete || 0, state: st } : null;
  }
  // The buttons of Steam's Downloads page: pause or resume everything, start
  // one now, add one to the queue, take one off the list.
  function downloadAction(act, appid) {
    const sc = sysClient(), D = sc && sc.Downloads;
    const cid = safe(() => host().downloadsStore.LocalDownloadOverview.remote_client_id, undefined);
    const call = (fn, ...a) => { if (!D || typeof D[fn] !== 'function') return false; const r = cid === undefined ? D[fn](...a) : D[fn](...a, cid); if (r && r.catch) r.catch(() => {}); return true; };
    try {
      let ok = false;
      if (act === 'pauseall') ok = call('EnableAllDownloads', false);
      else if (act === 'resumeall') ok = call('EnableAllDownloads', true);
      else if (act === 'start') ok = call('ResumeAppUpdate', appid);
      else if (act === 'queue') ok = call('QueueAppUpdate', appid);
      else if (act === 'remove') {
        const ov = safe(() => host().downloadsStore.LocalDownloadOverview, {}), first = safe(() => host().downloadsStore.QueuedTransfers[0].appid, 0);
        ok = call('RemoveFromDownloadList', appid);
        if (ok && first == appid && ov.paused) call('EnableAllDownloads', true);   // as Steam does: the next one goes on
      }
      tlog(`downloads: ${act}${appid ? ` ${appid}` : ''}${ok ? '' : " (Steam's call isn't there)"}`);
      return ok;
    } catch (e) { tlog(`downloads: ${act} failed (${e && e.message})`); return false; }
  }

  // Friends: Steam's friends list (g_FriendsUIApp.FriendStore.all_friends),
  // each with the status Steam's own list shows.
  function friends() {
    const fs = safe(() => host().g_FriendsUIApp.FriendStore, null);
    const all = fs && safe(() => Array.from(fs.all_friends || []), null);
    if (!all) return null;
    return all.map((f) => {
      const p = f.persona || f;
      const accountid = safe(() => p.GetAccountID(), null) ?? f.accountid ?? null;
      const steamid = String(safe(() => p.m_steamid.ConvertTo64BitString(), '') || '');
      const name = String(f.display_name || p.m_strPlayerName || '');
      const ingame = !!p.is_ingame, online = !!p.is_online, away = !!p.is_awayOrSnooze;
      return {
        accountid, steamid, name,
        state: ingame ? 'ingame' : online ? (away ? 'away' : 'online') : 'offline',
        game: ingame ? String(safe(() => p.GetCurrentGameName(), '') || '') : '',
        avatar: String(p.avatar_url_medium || p.avatar_url || ''),
      };
    }).filter((x) => x.name && x.accountid != null);
  }
  // Chat with a friend, the way Steam's own UI opens one (sp.js,
  // ShowFriendChatDialog): in Big Picture and its overlay, Quick Access on
  // the Friends tab with the chat expanded, then a "FriendChatOpen" message
  // to the shared context, which Quick Access's friends panel answers by
  // opening that friend's chat; in the Steam window, the friend's
  // OpenChatDialog. Else the friends app's own call, else the link.
  function chatWith(fr) {
    const inst = instance(), fa = safe(() => host().g_FriendsUIApp, null);
    const gamepad = /^gamepad/.test(String(safe(() => inst.Navigator.type, '')));
    try {
      if (gamepad && inst && inst.MenuStore && fa) {
        const pid = safe(() => inst.params.browserInfo.m_unPID, 0);
        inst.MenuStore.OpenQuickAccessMenu(QAM.friends, true);
        if (safe(() => typeof fa.UIStore.SetQAMFriendsChatExpanded === 'function', false)) fa.UIStore.SetQAMFriendsChatExpanded(true);
        else host().postMessage({ message: 'QamFriendsExpanded' }, 'https://steamloopback.host');
        host().postMessage({ message: 'FriendChatOpen', pid, accountID: fr.accountid }, 'https://steamloopback.host');
        tlog('chat with a friend (Quick Access)');
        return true;
      }
      const f = safe(() => fa.FriendStore.GetFriend(fr.accountid), null), info = safe(() => inst.params.browserInfo, null);
      if (f && typeof f.OpenChatDialog === 'function' && info) { f.OpenChatDialog(info); tlog('chat with a friend'); return true; }
      if (fa && typeof fa.ShowFriendChatDialog === 'function') {
        fa.ShowFriendChatDialog(safe(() => fa.GetDefaultBrowserContext(), undefined), fr.accountid, true);
        tlog('chat with a friend (friends window)');
        return true;
      }
    } catch (e) { tlog(`chat: ${e && e.message}`); }
    return fr.steamid ? steamUrl(`steam://friends/message/${fr.steamid}`) : false;
  }
  // A friend's Community profile, in Steam's web view.
  function profile(fr) {
    const n = nav(), url = `https://steamcommunity.com/profiles/${fr.steamid}`;
    if (!fr.steamid) return false;
    try { if (n && n.SteamWeb) { n.SteamWeb(url); tlog('opened a profile'); return true; } } catch (e) { tlog(`profile: ${e && e.message}`); }
    return steamUrl(`steam://openurl/${url}`);
  }

  // Screenshots: every screenshot on this PC, the way Steam's media page
  // gets them (GetAllAppsLocalScreenshotsRange, a thousand at a time; their
  // addresses are on Steam's loopback host), grouped by game, newest first.
  async function screenshots() {
    const sc = sysClient(), S = sc && sc.Screenshots;
    if (!S || typeof S.GetAllAppsLocalScreenshotsCount !== 'function' || typeof S.GetAllAppsLocalScreenshotsRange !== 'function') return null;
    const n = +(await S.GetAllAppsLocalScreenshotsCount()) || 0;
    const all = [];
    for (let i = 0; i < n; i += 1000) {
      const part = await S.GetAllAppsLocalScreenshotsRange(i, Math.min(n - 1, i + 999));
      for (const x of part || []) all.push(x);
    }
    const groups = new Map();
    for (const x of all) {
      const gameid = String(x.strGameID || x.nAppID || '0');
      const url = String(x.strUrl || '');
      if (!url) continue;
      let g = groups.get(gameid);
      if (!g) {
        const appid = /^\d{1,10}$/.test(gameid) ? +gameid : 0;
        g = { gameid, appid, title: (appid && appTitle(appid)) || x.strShortcutName || 'Other games', shots: [] };
        groups.set(gameid, g);
      }
      g.shots.push({ src: url.startsWith('https://') ? url : `https://steamloopback.host/${url.replace(/^\//, '')}`, at: +x.nCreated || 0 });
    }
    const list = [...groups.values()];
    for (const g of list) g.shots.sort((a, b) => b.at - a.at);
    list.sort((a, b) => (b.shots[0] ? b.shots[0].at : 0) - (a.shots[0] ? a.shots[0].at : 0));
    return { count: all.length, groups: list };
  }

  // Steam's Home page in this window (replacing the page it's on, so Back
  // doesn't return there).
  function home() {
    const n = nav();
    try { if (n && n.Home) { n.Home({}, { bReplace: true }); return true; } } catch (e) { tlog(`home: ${e && e.message}`); }
    try { const i = instance(); if (i && i.Navigate) { i.Navigate('/library/home'); return true; } } catch (e) { /* nothing else to try */ }
    return false;
  }
  // The overlay's own home: the running game's page (/apprunning, Steam's
  // AppRunning route), in place of the page it's on, and without moving the
  // focus (Tungsten's in-game menu keeps it).
  function overlayHome() {
    const i = instance();
    try {
      if (i && typeof i.NavigateWithoutChangingFocus === 'function') { i.NavigateWithoutChangingFocus('/apprunning', true); return true; }
      if (i && typeof i.Navigate === 'function') { i.Navigate('/apprunning', true); return true; }
    } catch (e) { tlog(`overlay home: ${e && e.message}`); }
    return false;
  }
  // Big Picture's in-game overlay is only on screen while something is up
  // in it: Steam's menu, Quick Access, a dialog or one of its pages. Over
  // just the game (/apprunning) it hides. While Tungsten's in-game menu is
  // up, Tungsten asks the window's composition store to keep the overlay
  // up (2: Overlay, the way Steam's own overlay pages ask for it), and lets
  // go when the menu closes.
  let overlayHeld = false;
  function overlayUp(on) {
    const cs = safe(() => instance().CompositionStateStore, null);
    if (!cs || !cs.AddMinimumCompositionStateRequest) return false;
    try {
      if (on && !overlayHeld) { cs.AddMinimumCompositionStateRequest(2, 'Tungsten in-game menu'); overlayHeld = true; }
      else if (!on && overlayHeld) { overlayHeld = false; cs.RemoveMinimumCompositionStateRequest(2, 'Tungsten in-game menu'); }
      return true;
    } catch (e) { tlog(`overlay: ${e && e.message}`); return false; }
  }
  // The Steam (PS) button in this window. Steam's own handler
  // (OnHomeButtonPressed) toggles its menu; takeHomeButton puts handler()
  // in front of it, and Steam's runs only when handler() returns false.
  let homeTaken = null;
  function takeHomeButton(handler) {
    const i = instance();
    if (homeTaken) return homeTaken.inst === i;
    if (!i || typeof i.OnHomeButtonPressed !== 'function') return false;
    const own = Object.prototype.hasOwnProperty.call(i, 'OnHomeButtonPressed'), steams = i.OnHomeButtonPressed;
    try {
      Object.defineProperty(i, 'OnHomeButtonPressed', {
        configurable: true, writable: true,
        value(...args) {
          let took = false;
          try { took = !!handler(); } catch (e) { tlog(`Steam button: ${e && e.message}`); }
          return took ? undefined : steams.apply(this, args);
        },
      });
      homeTaken = { inst: i, own, steams };
      return true;
    } catch (e) { tlog(`Steam button: ${e && e.message}`); return false; }
  }
  function releaseHomeButton() {
    if (!homeTaken) return;
    const { inst, own, steams } = homeTaken;
    homeTaken = null;
    try {
      if (own) Object.defineProperty(inst, 'OnHomeButtonPressed', { configurable: true, writable: true, value: steams });
      else delete inst.OnHomeButtonPressed;
    } catch (e) { /* the window is going away */ }
  }
  // Big Picture's screensaver (sp.js): Steam's client says when it starts and
  // ends (Screensaver.NotifyActiveStateChanged; GetActiveState asks). Those
  // calls live in a module of Steam's webpack bundle, found once by its text.
  // Its settings are in the shared settingsStore: screensaver_current_id
  // ("uioverride-tungsten" for Tungsten's) and the idle time before it, in
  // seconds (system_idle_screensaver_ac_sec, 0 = never).
  let wpReq;
  function webpackRequire() {
    if (wpReq !== undefined) return wpReq;
    wpReq = null;
    try {
      const chunk = host().webpackChunksteamui;
      if (chunk && typeof chunk.push === 'function') chunk.push([[Symbol('tungsten')], {}, (r) => { wpReq = r; }]);
    } catch (e) { tlog(`webpack: ${e && e.message}`); }
    return wpReq;
  }
  function moduleWith(text) {
    const req = webpackRequire();
    if (!req || !req.m) return null;
    for (const id of Object.keys(req.m)) {
      let src = '';
      try { src = Function.prototype.toString.call(req.m[id]); } catch (e) { continue; }
      if (src.indexOf(text) < 0) continue;
      try { return req(id); } catch (e) { return null; }
    }
    return null;
  }
  let saverService;
  function screensaverService() {
    if (saverService !== undefined) return saverService;
    saverService = null;
    const t0 = performance.now(), ex = moduleWith('"Screensaver.NotifyActiveStateChanged#1"');
    if (ex) {
      for (const k of Object.keys(ex)) {
        const v = safe(() => ex[k], null);
        if (v && typeof v.GetActiveState === 'function' && typeof v.RegisterForNotifyActiveStateChanged === 'function') { saverService = v; break; }
      }
    }
    tlog(`screensaver: Steam's screensaver calls ${saverService ? 'found' : 'not found'} (${Math.round(performance.now() - t0)} ms)`);
    return saverService;
  }
  function screensaverSetup() {
    const cs = safe(() => host().settingsStore.clientSettings, null);
    if (!cs) return null;
    return { id: String(safe(() => cs.screensaver_current_id, '') || ''), secs: +safe(() => cs.system_idle_screensaver_ac_sec, 0) || 0 };
  }
  // cb(true) as it starts, cb(false) as it ends (and once now, with how it is).
  function onScreensaver(cb) {
    const s = screensaverService();
    if (!s) return null;
    try {
      const reg = s.RegisterForNotifyActiveStateChanged((msg) => {
        try { cb(!!msg.Body().active()); } catch (e) { tlog(`screensaver: ${e && e.message}`); }
        return 1;                                    // (k_EResultOK, like Steam's own handler)
      });
      Promise.resolve(s.GetActiveState({})).then((r) => { try { cb(!!r.Body().active(), true); } catch (e) { /* no answer */ } }, () => {});
      return reg;
    } catch (e) { tlog(`screensaver: ${e && e.message}`); return null; }
  }

  // Steam's own menus (the Steam button menu, Quick Access) in this window.
  const openSideMenu = () => safe(() => menus().GetOpenSideMenu(), 0) || 0;   // 0 none, 1 the Steam menu, 2 Quick Access
  const sideMenuOpen = () => openSideMenu() !== 0;
  function closeSideMenus(steamMenuOnly = false) {
    const m = menus(), open = openSideMenu();
    if (!m || !open || (steamMenuOnly && open !== 1)) return false;
    try { m.CloseSideMenus(); return true; } catch (e) { return false; }
  }

  return {
    steamUrl, showLibrary, onWebPage, onPageChange,
    instance, open, home, overlayHome, pagePath, openSideMenu, sideMenuOpen, closeSideMenus, overlayUp, takeHomeButton, releaseHomeButton, power, canPower,
    downloads, downloading, downloadAction, friends, chatWith, profile, screenshots,
    screensaverSetup, onScreensaver,
    mainPage: () => String(safe(() => mainHistory().location.pathname, '') || ''),
    host, client, ready, library, owned, ownedCount, userApps, quietWhen, appLaunches, padKind, install, prepareArt, details, quick, runningAppIds, overlayApp,
    gameOf: (appid, gamesOnly = false) => {           // gamesOnly: not apps like a controller utility
      const o = ready() !== false && safe(() => host().appStore.GetAppOverviewByAppID(appid), null);
      return o && (!gamesOnly || isGame(o)) ? toGame(o) : null;
    },
    run(it) {
      const a = apps();
      if (a && a.RunGame) { a.RunGame(it.gameid, '', -1, 100); return true; }      // 100 = launched from the library
      return steamUrl(`steam://rungameid/${it.gameid}`);
    },
    async raise(it) {                                  // Resume: bring the game's window to the front
      const a = apps();
      try { if (a && a.RaiseWindowForGame) return (await a.RaiseWindowForGame(it.gameid)) !== 1; } catch (e) { /* use RunGame */ }
      try { if (a && a.RunGame) a.RunGame(it.gameid, '', -1, 100); } catch (e) { /* nothing else to try */ }
      return true;
    },
    terminate(it) { const a = apps(); try { a.TerminateApp(it.gameid, false); return true; } catch (e) { return false; } },
    hideOverlay(it) { const sc = client('Overlay'); try { sc.Overlay.SetOverlayState(String(it.gameid), 0); return true; } catch (e) { return false; } },   // 0 = hidden
    // A named section is needed: Big Picture and the gamepad overlay look the
    // section up in their page table, where "" is no page and throws.
    properties(it, section = 'general') { const a = apps(); try { a.OpenAppSettingsDialog(it.appid, section); return true; } catch (e) { return false; } },
    controllerLayout(it) { const a = apps(); try { a.ShowControllerConfigurator(it.appid); return true; } catch (e) { return false; } },
    onLifetime(cb) { const sc = client('GameSessions'); try { return sc.GameSessions.RegisterForAppLifetimeNotifications(cb); } catch (e) { return null; } },
    onOverlay(cb) { const sc = client('Overlay'); try { return sc.Overlay.RegisterForOverlayActivated(cb); } catch (e) { return null; } },
  };
})();

/* ═════════════════════════ Thumbnails ═════════════════════════ */

function wrapWords(text, maxChars) {
  const lines = []; let line = '';
  for (const w of text.split(/\s+/)) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars && line) { lines.push(line); line = w; } else line = next;
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

// Stand-in when a game's thumbnail can't be fetched.
function gameThumbFallback(game) {
  const id = `tg-thumb-${uid++}`, [a, b] = game.tones;
  const lines = wrapWords(game.title.replace(/™/g, '').toUpperCase(), 15);
  const lh = 27, y0 = 90 - ((lines.length - 1) * lh) / 2 + 7;
  return nodeFrom(`<svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
    <rect width="320" height="180" fill="url(#${id})"/><rect width="320" height="180" fill="rgba(5,8,13,0.38)"/>
    ${lines.map((l, k) => `<text x="160" y="${y0 + k * lh}" text-anchor="middle" font-family="Inter, 'Segoe UI', sans-serif" font-size="21" font-weight="500" letter-spacing="3" fill="#fff">${esc(l)}</text>`).join('')}
  </svg>`);
}

// Games far down a long Steam library load their thumbnail when they come
// near the screen (loading="lazy"); the first few load right away.
function gameThumb(game, eager = true) {
  const urls = artUrls(game, 'thumb');
  if (!urls.length) return gameThumbFallback(game);
  const img = new Image();
  img.alt = ''; img.decoding = 'async'; img.draggable = false;
  if (!eager) img.loading = 'lazy';
  let k = 0, done = false;
  const giveUp = () => { if (!done) { done = true; img.replaceWith(gameThumbFallback(game)); } };
  img.onload = () => { done = true; };
  img.onerror = () => { if (done) return; k += 1; if (k < urls.length) img.src = urls[k]; else giveUp(); };
  if (eager) setTimeout(() => { if (!img.complete || !img.naturalWidth) giveUp(); }, 12000);
  img.src = urls[0];
  return img;
}

/* ═════════════════════════ Build DOM ═════════════════════════
   Each column keeps its entries ({ it, li }) in order. `list` is what the
   column shows right now: the search can filter GAMES, and while a game is
   running GAMES also starts with Resume Game and Quit Game.                */

const catList = $('#cats'), tracksEl = $('#tracks');
const catEls = [], trackEls = [];
const cols = CATEGORIES.map(() => ({ all: [], list: [] }));

const PLAY_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3.2 1.9v8.2L10 6z"/></svg>';
const INFO_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true"><path fill-rule="evenodd" d="M6 .9a5.1 5.1 0 1 1 0 10.2A5.1 5.1 0 0 1 6 .9zM5.3 5.3h1.4v3.9H5.3zM6 2.6a.85.85 0 1 1 0 1.7.85.85 0 0 1 0-1.7z"/></svg>';

function makeItem(c, it, eager = true) {
  const li = document.createElement('li');
  li.className = it.appid ? 'item game' : it.friend ? `item icon friend ${it.friend.state}` : 'item icon';
  li.setAttribute('role', 'option');
  const thumb = document.createElement('div');
  thumb.className = 'thumb';
  thumb.appendChild(it.appid ? gameThumb(it, eager) : it.friend ? friendThumb(it.friend) : glyphIcon(it.icon));
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `<div class="title">${esc(it.title)}</div><div class="sub"><span>${esc(it.sub)}</span></div>` +
    (it.appid && it.kind !== 'app' ? `<div class="actions"><button class="act-btn" data-act="play" tabindex="-1">${PLAY_SVG}Play</button>` +
                `<button class="act-btn" data-act="details" tabindex="-1">${INFO_SVG}Details</button></div>` : '');   // (apps: a click opens them)
  li.append(thumb, meta);
  if (it.appid) {                                       // the focus bloom (see .glow)
    const glow = document.createElement('div');
    glow.className = 'glow';
    li.insertBefore(glow, meta);
  }
  const entry = { c, it, li };
  wireItem(entry, thumb, meta);
  return entry;
}

CATEGORIES.forEach((cat, i) => {
  const li = document.createElement('li');
  li.className = 'cat';
  li.setAttribute('role', 'tab');
  li.innerHTML = `${catIcon(cat.icon)}<span class="label">${cat.label}</span>`;
  li.addEventListener('click', () => clickCategory(i));
  li.addEventListener('pointerenter', (ev) => { if (i !== state.cat && !inputLocked()) hoverTick(ev); });
  catList.appendChild(li); catEls.push(li);

  const ul = document.createElement('ul');
  ul.className = i === 0 ? 'track' : 'track icons';      // cards in GAMES, frosted glyphs everywhere else
  ul.setAttribute('role', 'listbox');
  ul.setAttribute('aria-label', cat.label);
  for (const it of cat.items) { const e = makeItem(i, it); ul.appendChild(e.li); cols[i].all.push(e); }
  tracksEl.appendChild(ul); trackEls.push(ul);
});
const nomatchEl = document.createElement('li');            // shown when the search finds nothing
nomatchEl.className = 'nomatch';
trackEls[0].appendChild(nomatchEl);
// The Library leads GAMES (see LIBRARY); the games follow it.
const libraryEntry = makeItem(0, LIBRARY);
trackEls[0].insertBefore(libraryEntry.li, trackEls[0].firstChild);
cols[0].all.unshift(libraryEntry);

// Puts a game list into the GAMES column: the Steam library (again on each
// refresh) or the sample. Games already there keep their card and art and
// just update their subtitle; the focus stays on the same game.
let GAMES = [];
let libraryNote = '';                                       // e.g. "Loading your Steam library…"
function setGames(list) {
  const was = (cols[0].list[state.sel[0]] || {}).it;
  const old = new Map(cols[0].all.filter((e) => !e.it.kind).map((e) => [e.it.appid, e]));
  const entries = list.map((it, k) => {
    const e = old.get(it.appid);
    if (!e) return makeItem(0, it, k < 12);
    old.delete(it.appid);
    if (e.it.sub !== it.sub || e.it.title !== it.title) {
      e.it.title = it.title; e.it.sub = it.sub;
      e.li.querySelector('.title').textContent = it.title;
      if (!(launch && launch.li === e.li)) e.li.querySelector('.sub > span').textContent = it.sub;
    }
    if (it.o) e.it.o = it.o;
    return e;
  });
  for (const e of old.values()) e.li.remove();               // gone from the library
  // Cards keep the library's order in the page. Only new cards and those that
  // changed place are moved (a moved card starts its fade-in again).
  let spot = trackEls[0].querySelector(':scope > li.game') || nomatchEl;
  for (const e of entries) {
    if (e.li === spot) spot = spot.nextElementSibling || nomatchEl;
    else trackEls[0].insertBefore(e.li, spot);
  }
  cols[0].all = [...cols[0].all.filter((e) => e.it.kind), ...entries];
  GAMES = entries.map((e) => e.it);
  CATEGORIES[0].items = GAMES;
  if (session) session.it = GAMES.find((g) => g.appid === session.it.appid) || session.it;
  refreshLists();
  if (was) {
    const k = cols[0].list.findIndex((e) => !e.it.kind && was.appid && e.it.appid === was.appid);
    if (k >= 0) state.sel[0] = k;
  }
  render();
  if (state.cat === 0 && (cols[0].list[state.sel[0]] || {}).it !== was) selectionChanged();
  updateLibraryItem();
  if (lib.open) libReload();                                 // (installed, uninstalled, renamed)
}
const findGame = (appid) => GAMES.find((g) => g.appid === appid) || null;

/* APPS starts with your apps (Steam's software, tools you've started, your
   Utilities collection, anything moved there: see "Games and apps" in the
   Steam bridge), most recently used first, as cards with their art; then
   Steam's own items. An app keeps its row (and art) when the list is read
   again, and the focus stays on the same item. Apps open the way Steam's
   library opens them (openApp): no launch sequence, no in-game menu. */
const APPS_COL = CATEGORIES.findIndex((c) => c.label === 'APPS');
let APPS = [];
function setApps(list) {
  if (APPS_COL < 0) return;
  const col = cols[APPS_COL], track = trackEls[APPS_COL];
  const was = (col.list[state.sel[APPS_COL]] || {}).it;
  const old = new Map(col.all.filter((e) => e.it.kind === 'app').map((e) => [e.it.appid, e]));
  const first = !old.size && !APPS.length;
  const entries = list.map((it) => {
    const e = old.get(it.appid);
    if (!e) return makeItem(APPS_COL, it);
    old.delete(it.appid);
    if (e.it.sub !== it.sub || e.it.title !== it.title) {
      e.it.title = it.title; e.it.sub = it.sub;
      e.li.querySelector('.title').textContent = it.title;
      if (!(launch && launch.li === e.li)) e.li.querySelector('.sub > span').textContent = it.sub;
    }
    return e;
  });
  for (const e of old.values()) e.li.remove();
  let spot = track.firstElementChild;                        // the apps first, in order (only moved rows move)
  for (const e of entries) {
    if (e.li === spot) spot = spot.nextElementSibling;
    else track.insertBefore(e.li, spot);
  }
  col.all = [...entries, ...col.all.filter((e) => e.it.kind !== 'app')];
  APPS = entries.map((e) => e.it);
  refreshLists();
  if (first && state.cat !== APPS_COL) state.sel[APPS_COL] = 0;   // APPS opens on the app used last
  else if (was) { const k = col.list.findIndex((e) => e.it === was); if (k >= 0) state.sel[APPS_COL] = k; }
  render();
  if (state.cat === APPS_COL && (col.list[state.sel[APPS_COL]] || {}).it !== was) selectionChanged();
}
const findApp = (appid) => APPS.find((a) => a.appid === appid) || null;
// Move to APPS / Move to GAMES (Triangle on a game, or on an app): kept in
// Tungsten's settings on this PC (every Tungsten window), then GAMES and
// APPS are read again, so it moves at once.
function moveTo(it, place) {
  if (!STEAM || !it || !it.appid) { hold('Not available here'); return false; }
  try {
    const m = JSON.parse(localStorage.getItem('tungsten.apps') || '{}') || {};
    m[it.appid] = place;
    localStorage.setItem('tungsten.apps', JSON.stringify(m));
  } catch (e) { hold('Not available here'); return false; }
  lastLibraryRead = 0;
  refreshLibrary();
  Sound.confirm();
  toast(`${it.title}: now in ${place === 'apps' ? 'APPS' : 'GAMES'}`);
  tlog(`moved ${it.appid} to ${place === 'apps' ? 'APPS' : 'GAMES'}`);
  return true;
}
window.addEventListener('storage', (e) => { if (e.key === 'tungsten.apps') { lastLibraryRead = 0; refreshLibrary(); } });   // moved in another window
// The Library's subtitle counts what's in it.
function updateLibraryItem() {
  const installed = GAMES.filter(isGame).length, owned = STEAM && libraryLive ? STEAM.ownedCount() : 0;
  const sub = !installed && !owned ? LIBRARY.sub
    : owned > installed ? `${installed.toLocaleString('en-US')} installed · ${owned.toLocaleString('en-US')} in your library`
    : `${installed.toLocaleString('en-US')} game${installed === 1 ? '' : 's'}, A to Z`;
  if (sub === LIBRARY.sub && libraryEntry.li.querySelector('.sub > span').textContent === sub) return;
  LIBRARY.sub = sub;
  if (!(launch && launch.li === libraryEntry.li)) libraryEntry.li.querySelector('.sub > span').textContent = sub;
}

/* FRIENDS lists your Steam friends after its own items, the way the PS3's
   Friends column did: in a game first, then online, away and offline, each
   with Steam's avatar and status. Cross (or Triangle) on a friend: Chat or
   View Profile, in the options panel. Read again when you come to FRIENDS,
   and every 30 seconds while you're there. Friends already listed keep
   their row (and its place, unless their status moved them). */
const FRIENDS_COL = CATEGORIES.findIndex((c) => c.label === 'FRIENDS');
const FRIEND_RANK = { ingame: 0, online: 1, away: 2, offline: 3 };
const friendSub = (fr) => (fr.state === 'ingame' ? (fr.game ? `Playing ${fr.game}` : 'In a game') : fr.state === 'online' ? 'Online' : fr.state === 'away' ? 'Away' : 'Offline');
function friendThumb(fr) {
  const box = document.createElement('div');
  box.className = 'ava-box';
  const hue = [...fr.name].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7);
  box.style.background = `linear-gradient(135deg, hsl(${hue} 45% 52%), hsl(${(hue + 40) % 360} 50% 28%))`;
  box.dataset.letter = (fr.name.trim()[0] || '?').toUpperCase();
  const img = document.createElement('img');
  img.className = 'ava'; img.alt = ''; img.decoding = 'async';
  img.addEventListener('error', () => img.classList.add('broken'), { once: true });
  if (fr.avatar) img.src = fr.avatar; else img.classList.add('broken');
  const dot = document.createElement('span');
  dot.className = 'dot';
  box.append(img, dot);
  return box;
}
let friendsAt = -1e9;
function refreshFriends(force = false) {
  if (!STEAM || FRIENDS_COL < 0 || !libraryLive) return false;
  if (!force && performance.now() - friendsAt < 30000) return false;
  friendsAt = performance.now();
  const list = STEAM.friends();
  if (!list) return false;
  setFriends(list);
  return true;
}
function setFriends(list) {
  list = list.slice().sort((a, b) => FRIEND_RANK[a.state] - FRIEND_RANK[b.state] || a.name.localeCompare(b.name));
  const c = FRIENDS_COL, col = cols[c];
  const was = (col.list[state.sel[c]] || {}).it;
  const old = new Map(col.all.filter((e) => e.it.friend).map((e) => [String(e.it.friend.accountid), e]));
  const entries = list.map((fr) => {
    const e = old.get(String(fr.accountid));
    const sub = friendSub(fr);
    if (!e) return makeItem(c, { title: fr.name, sub, icon: 'friends', friend: fr });
    old.delete(String(fr.accountid));
    const prev = e.it.friend;
    e.it.friend = fr;
    if (e.it.title !== fr.name) { e.it.title = fr.name; e.li.querySelector('.title').textContent = fr.name; }
    if (e.it.sub !== sub) { e.it.sub = sub; if (!(launch && launch.li === e.li)) e.li.querySelector('.sub > span').textContent = sub; }
    if (prev.state !== fr.state) { e.li.classList.remove(prev.state); e.li.classList.add(fr.state); }
    if (prev.avatar !== fr.avatar && fr.avatar) { const img = e.li.querySelector('.ava'); if (img) { img.classList.remove('broken'); img.src = fr.avatar; } }
    return e;
  });
  for (const e of old.values()) e.li.remove();             // no longer a friend
  const track = trackEls[c];
  let spot = track.querySelector(':scope > li.friend');
  for (const e of entries) {                                // only rows out of place move
    if (e.li === spot) spot = spot.nextElementSibling;
    else track.insertBefore(e.li, spot);
  }
  col.all = [...col.all.filter((e) => !e.it.friend), ...entries];
  refreshLists();
  if (was) {
    const k = col.list.findIndex((e) => e.it === was || (was.friend && e.it.friend && String(e.it.friend.accountid) === String(was.friend.accountid)));
    if (k >= 0) state.sel[c] = k;
  }
  render();
}
// A friend's options, in the options panel.
const FRIEND_OPTIONS = [{ id: 'chat', label: 'Chat' }, { id: 'profile', label: 'View Profile' }];
function openFriend(it) {
  if (drawer.open || boot || dipping || !it || !it.friend) return false;
  endLaunch(); closeInspector(true); closeLightbox();
  fillDrawer('friend', FRIEND_OPTIONS);
  drawerEyebrow.textContent = 'Friend';
  drawerGame.textContent = it.title;
  showDrawer(0);
  $('#announce').textContent = `${it.title}, ${it.sub}. Chat`;
  return true;
}

/* ═════════════════════════ UI sound (Web Audio, synthesized) ═════════════════════════
   Starts on the first key press, click or controller press (browsers keep
   audio locked until the page gets one; Chromium-based browsers, Steam's
   included, count a controller press, some others don't). No files:
   - move:   glass tap. Sine 1480 → 740 Hz over 22ms, a 12ms 2960 Hz triangle
             overtone, a 4ms band-passed noise strike at 2500 Hz
   - slide:  the tap plus an airy high-passed breath panned in the direction
             of travel (90ms decay)
   - select: F#5 A5 C#6 E6 chime, attacks 15ms apart, 550ms exponential release
   - back:   880 Hz then 587 Hz, 45ms apart, 140ms decay
   - hover:  mouse over an unfocused item or category: a softer, higher
             micro-tick, 2200 Hz sine, 8ms, peak 0.15
   Everything passes through a subtle 35ms stereo (ping-pong) feedback delay. */

const Sound = (() => {
  const VOLUME = 0.45;
  let ac = null, master = null, dry = null, noise = null, muted = false;

  function unlock() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    if (!ac) {
      ac = new AC({ latencyHint: 'interactive' });
      master = ac.createGain();
      master.gain.value = muted ? 0 : VOLUME;
      master.connect(ac.destination);
      dry = ac.createGain();
      dry.connect(master);
      // 35ms ping-pong delay: left feeds right feeds left, a little darker each pass.
      const send = ac.createGain(); send.gain.value = 0.3;
      const darken = ac.createBiquadFilter(); darken.type = 'lowpass'; darken.frequency.value = 7000;
      const left = ac.createDelay(0.1), right = ac.createDelay(0.1);
      left.delayTime.value = 0.035; right.delayTime.value = 0.035;
      const toRight = ac.createGain(), toLeft = ac.createGain();
      toRight.gain.value = 0.38; toLeft.gain.value = 0.38;
      const stereo = ac.createChannelMerger(2);
      dry.connect(send); send.connect(darken); darken.connect(left);
      left.connect(toRight); toRight.connect(right);
      right.connect(toLeft); toLeft.connect(left);
      left.connect(stereo, 0, 0); right.connect(stereo, 0, 1);
      stereo.connect(master);
      // Half a second of white noise, reused for strikes and breaths.
      noise = ac.createBuffer(1, Math.floor(ac.sampleRate * 0.5), ac.sampleRate);
      const ch = noise.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
    }
    if (ac.state === 'suspended') ac.resume();
  }
  const live = () => ac && !muted && ac.state === 'running';

  function envelope(param, t, peak, attack, release) {
    param.setValueAtTime(0.0001, t);
    param.exponentialRampToValueAtTime(peak, t + attack);
    param.exponentialRampToValueAtTime(0.0001, t + attack + release);
  }
  function tone(type, freq, t, peak, attack, release, dest = dry) {
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    envelope(g.gain, t, peak, attack, release);
    o.connect(g); g.connect(dest);
    o.start(t); o.stop(t + attack + release + 0.02);
    return o;
  }
  function hiss(type, freq, q, t, peak, attack, release, dest = dry) {
    const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    src.buffer = noise;
    f.type = type; f.frequency.setValueAtTime(freq, t); f.Q.value = q;
    envelope(g.gain, t, peak, attack, release);
    src.connect(f); f.connect(g); g.connect(dest);
    src.start(t, Math.random() * 0.3); src.stop(t + attack + release + 0.02);
    return f;
  }

  function tick(level = 1) {
    if (!live()) return;
    const t = ac.currentTime + 0.002;
    tone('sine', 1480, t, 0.3 * level, 0.0015, 0.09).frequency.exponentialRampToValueAtTime(740, t + 0.022);
    tone('triangle', 2960, t, 0.06 * level, 0.001, 0.011);
    hiss('bandpass', 2500, 1.4, t, 0.2 * level, 0.0005, 0.0035);
  }
  function whoosh(dir = 1) {
    if (!live()) return;
    const t = ac.currentTime + 0.002;
    let dest = dry;
    if (ac.createStereoPanner) {
      const pan = ac.createStereoPanner();
      pan.pan.setValueAtTime(-0.5 * dir, t);
      pan.pan.linearRampToValueAtTime(0.5 * dir, t + 0.11);
      pan.connect(dry);
      dest = pan;
    }
    hiss('highpass', 1600, 0.6, t, 0.07, 0.018, 0.09, dest).frequency.exponentialRampToValueAtTime(4800, t + 0.11);
  }
  function confirm() {
    if (!live()) return;
    const t = ac.currentTime + 0.002;
    [739.99, 880.0, 1108.73, 1318.51].forEach((f, k) => {     // F#5 A5 C#6 E6
      const at = t + k * 0.015;
      tone('sine', f, at, 0.085, 0.008, 0.55);
      tone('triangle', f, at, 0.025, 0.008, 0.45).detune.value = 6;   // faint shimmer
    });
  }
  function hover() {
    if (!live()) return;
    tone('sine', 2200, ac.currentTime + 0.002, 0.15, 0.001, 0.007);
  }
  function back() {
    if (!live()) return;
    const t = ac.currentTime + 0.002;
    [[880, 0], [587.33, 0.045]].forEach(([f, dt]) => {
      tone('sine', f, t + dt, 0.15, 0.003, 0.14);
      tone('sine', f * 2.01, t + dt, 0.03, 0.002, 0.05);         // glassy partial
    });
  }
  /* Cold boot (playColdBootSound), timed from 0.0 s of the movie:
     A · tuning swell, 0 – 4.4 s. Seven warm voices (sawtooth and triangle)
         start up to 15 Hz off their notes and glide into an open A major 9th
         (A2 E3 A3 C#4 E4 G#4 B4), locked by 1.4 s as the wordmark appears.
         One low-pass filter opens from 420 Hz to 2.2 kHz (1.6 s) and settles
         at 900 Hz (4.2 s). The swell peaks at 1.6 s and is gone by 4.4 s.
     B · glass bell, 1.4 – 5.0 s. E5 B5 C#6 E6 sines struck 45 ms apart,
         with a faint glassy partial each, ringing out through a soft
         stereo echo (230 / 310 ms) over the fading swell.
     If the audio isn't allowed to start yet, it plays on the first key
     press or click instead, as long as that comes within 8 s.            */
  const COLD_VOICES = [110, 164.81, 220, 277.18, 329.63, 415.3, 493.88];
  const COLD_LEVELS = [0.055, 0.05, 0.048, 0.044, 0.042, 0.038, 0.036];
  const COLD_PANS = [0, -0.35, 0.3, -0.55, 0.5, -0.2, 0.65];
  const COLD_BELLS = [659.26, 987.77, 1108.73, 1318.51];
  const COLD_GRACE_MS = 8000;
  const SWELL = (() => {                       // gain over 4.4 s: up by 1.6 s, then away
    const n = 441, c = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const u = (4.4 * i) / (n - 1);
      if (u <= 1.6) { const x = u / 1.6; c[i] = x * x * (3 - 2 * x); }
      else { const x = (u - 1.6) / 2.8; c[i] = (1 - x) * (1 - x); }
    }
    return c;
  })();
  const BELL = (() => {                        // a struck glass: 4 ms in, rings down (τ 0.85 s), gone at the end
    const n = 720, c = new Float32Array(n), len = 3.6;
    for (let i = 0; i < n; i++) {
      const u = (len * i) / (n - 1);
      const ring = u < 0.004 ? u / 0.004 : Math.exp(-(u - 0.004) / 0.85);
      const tail = u > len - 0.3 ? 0.5 + 0.5 * Math.cos((Math.PI * (u - (len - 0.3))) / 0.3) : 1;
      c[i] = ring * tail;
    }
    return c;
  })();
  let coldAsked = -1e9, coldBus = null;
  function stopColdBoot() {
    if (!coldBus || !ac) return;
    const b = coldBus;
    coldBus = null;
    b.gain.cancelScheduledValues(ac.currentTime);
    b.gain.setTargetAtTime(0, ac.currentTime, 0.05);
    setTimeout(() => { try { b.disconnect(); } catch (e) { /* gone */ } }, 600);
  }
  function playColdBootSound() {
    coldAsked = performance.now();
    if (muted) return false;
    if (!ac) unlock();
    if (!ac) return false;
    if (ac.state !== 'running') {              // not allowed yet: as soon as it is (see unlock)
      const asked = coldAsked;
      ac.resume().then(() => { if (coldAsked === asked && performance.now() - asked < COLD_GRACE_MS) coldBootNow(); }, () => {});
      return false;
    }
    coldBootNow();
    return true;
  }
  function coldBootNow() {
    coldAsked = -1e9;
    if (muted || !ac || ac.state !== 'running') return;
    stopColdBoot();
    const t = ac.currentTime + 0.03;
    const bus = ac.createGain();
    bus.connect(master);
    coldBus = bus;
    // A · the swell
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass'; lp.Q.value = 0.8;
    lp.frequency.setValueAtTime(420, t);
    lp.frequency.exponentialRampToValueAtTime(2200, t + 1.6);
    lp.frequency.exponentialRampToValueAtTime(900, t + 4.2);
    const swell = ac.createGain();
    swell.gain.value = 0;
    swell.gain.setValueCurveAtTime(SWELL, t, 4.4);
    lp.connect(swell); swell.connect(bus);
    COLD_VOICES.forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = i % 2 ? 'triangle' : 'sawtooth';
      o.frequency.setValueAtTime(Math.max(40, f + (Math.random() * 2 - 1) * 15), t);
      o.frequency.exponentialRampToValueAtTime(f, t + 1.4);   // into tune with the others
      g.gain.value = COLD_LEVELS[i];
      o.connect(g);
      if (ac.createStereoPanner) { const p = ac.createStereoPanner(); p.pan.value = COLD_PANS[i]; g.connect(p); p.connect(lp); }
      else g.connect(lp);
      o.start(t); o.stop(t + 4.5);
    });
    // B · the glass bell and its echo
    const bell = ac.createGain();
    bell.connect(bus);
    const send = ac.createGain(), soften = ac.createBiquadFilter(), merge = ac.createChannelMerger(2);
    const dl = ac.createDelay(1), dr = ac.createDelay(1), fl = ac.createGain(), fr = ac.createGain();
    send.gain.value = 0.4;
    soften.type = 'lowpass'; soften.frequency.value = 5200;
    dl.delayTime.value = 0.23; dr.delayTime.value = 0.31;
    fl.gain.value = 0.36; fr.gain.value = 0.36;
    bell.connect(send); send.connect(soften); soften.connect(dl);
    dl.connect(fl); fl.connect(dr); dr.connect(fr); fr.connect(dl);
    dl.connect(merge, 0, 0); dr.connect(merge, 0, 1); merge.connect(bus);
    COLD_BELLS.forEach((f, k) => {
      const at = t + 1.4 + k * 0.045, ring = 5.0 - 1.4 - k * 0.045;
      const o = ac.createOscillator(), g = ac.createGain(), level = ac.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      g.gain.value = 0;
      g.gain.setValueCurveAtTime(BELL, at, ring);
      level.gain.value = 0.06 - k * 0.006;
      o.connect(g); g.connect(level); level.connect(bell);
      o.start(at); o.stop(at + ring + 0.02);
      tone('sine', f * 2.76, at, 0.008, 0.002, 0.5, bell);   // the glass in it
    });
    setTimeout(() => { if (coldBus === bus) coldBus = null; try { bus.disconnect(); } catch (e) { /* gone */ } }, 7000);
  }
  function setMuted(m) {
    muted = m;
    if (ac) master.gain.setTargetAtTime(m ? 0 : VOLUME, ac.currentTime, 0.02);
  }
  // Paused while Tungsten is switched off or minimized.
  function suspend() { if (ac && ac.state === 'running') ac.suspend(); }
  function resume() { if (ac && ac.state === 'suspended') ac.resume(); }
  return {
    unlock, tick, whoosh, confirm, back, hover, setMuted, suspend, resume, playColdBootSound, stopColdBoot,
    get muted() { return muted; },
    get state() { return ac ? ac.state : 'locked'; },
    get coldPlaying() { return !!coldBus; },
  };
})();

const muteLabel = $('#mute-label');
function toggleMute() {
  Sound.setMuted(!Sound.muted);
  muteLabel.textContent = Sound.muted ? 'Unmute Audio' : 'Mute Audio';
  if (!Sound.muted) Sound.tick(0.8);
  return true;
}

/* ═════════════════════════ State & positioning ═════════════════════════ */

// state.sel[c] is the focused position within column c's current list.
const state = { cat: 0, sel: CATEGORIES.map(() => 0) };
const searchBar = { sel: false };                     // the search bar is selected (see selectSearchBar)
let UI = 1;                                    // layout scale, kept in step with --ui (see setUiScale)
const uiScale = () => UI;
const currentEntry = () => cols[state.cat].list[state.sel[state.cat]] || null;
const current = () => { const e = currentEntry(); return e ? e.it : null; };
const isGame = (it) => !!(it && it.appid && it.kind !== 'app');
const isApp = (it) => !!(it && it.kind === 'app');      // one of your apps, in APPS (see setApps)
const normText = (s) => s.toLowerCase().replace(/[™®©]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();

// Work out what each column shows (search filter, in-game actions), keeping
// the same item focused whenever it is still there.
function refreshLists() {
  const q = lib.open ? '' : normText(search.query);   // (a search in the Library is the Library's)
  const keep = (e) => {                               // GAMES: the Library, the in-game actions, the games (searched)
    if (e.it.kind === 'library') return !q && !session;
    return !!e.it.kind || !q || normText(`${e.it.title} ${e.it.aka || ''}`).includes(q);
  };
  cols.forEach((col, c) => {
    const focused = col.list[state.sel[c]];
    col.list = c === 0 ? col.all.filter(keep) : col.all.slice();
    const k = focused ? col.list.indexOf(focused) : -1;
    state.sel[c] = k >= 0 ? k : clamp(state.sel[c], 0, Math.max(0, col.list.length - 1));
  });
}

// How many rows above and below the focus can be on screen, plus a margin so
// a row always slides in from off screen rather than appearing (see the row
// positions in the CSS: 14cqh + (delta + 1) · 74px above the focus, 56cqh +
// (delta - 1) · 88px below it, scaled by --ui). Worked out on each resize
// (see setUiScale), so moving never has to measure anything.
let rowWin = { above: 6, below: 9, W: 1920 };
function measureRows() {
  const H = viewH(), ui = uiScale();
  rowWin = {
    above: Math.ceil(1 + (0.14 * H + 65 * ui) / (74 * ui)) + 2,
    below: Math.ceil(1 + (0.44 * H) / (88 * ui)) + 2,
    W: viewW(),
  };
}

function render() {
  const win = rowWin;
  CATEGORIES.forEach((cat, i) => {
    const active = i === state.cat;
    const el = catEls[i];
    el.style.setProperty('--rel', i - state.cat);           // left: calc(22vw + (i - activeCat) * 115px)
    el.classList.toggle('active', active);
    el.setAttribute('aria-selected', String(active));

    const track = trackEls[i];
    track.style.setProperty('--crel', i - state.cat);       // inactive columns ride along with their icon
    track.classList.toggle('active', active);
    track.setAttribute('aria-hidden', String(!active));

    const col = cols[i];
    const at = new Map(col.list.map((e, j) => [e, j]));
    for (const e of col.all) {
      const j = at.has(e) ? at.get(e) : -1;
      if (j < 0) {                                          // filtered out: fades where it stands
        if (!e.gone) { e.gone = true; e.li.classList.add('gone'); e.li.classList.remove('hover'); }
        continue;
      }
      if (e.gone) { e.gone = false; e.li.classList.remove('gone'); }
      const delta = j - state.sel[i];                       // delta = j - activeGame
      if (delta < -win.above || delta > win.below) {        // off screen: not laid out until it comes near
        if (!e.far) {
          e.far = true;
          e.li.classList.add('far');
          e.li.classList.remove('focused', 'above', 'below', 'hover');
          e.li.setAttribute('aria-selected', 'false');
        }
        continue;
      }
      e.li.style.setProperty('--delta', delta);
      e.li.classList.toggle('focused', delta === 0);
      e.li.classList.toggle('below', delta > 0);
      e.li.classList.toggle('above', delta < 0);
      e.li.setAttribute('aria-selected', String(delta === 0));
      if (e.far) { e.far = false; e.li.classList.remove('far'); }
    }
  });
  const noGames = !cols[0].list.some((e) => isGame(e.it));
  const empty = noGames && (!!search.query || !!libraryNote);
  if (empty) nomatchEl.textContent = search.query ? `No games match \u201c${search.query.trim()}\u201d` : libraryNote;
  nomatchEl.classList.toggle('show', empty);
  tuckCategories();
}

// Category icons that would land under the open Game Inspector fade out.
function tuckCategories() {
  const W = rowWin.W, ui = uiScale(), edge = 0.48 * W - 12;   // (the width as of the last resize: no measuring here)
  catEls.forEach((el, i) => {
    const x = 0.22 * W + (i - state.cat) * 115 * ui;
    el.classList.toggle('tucked', inspector.open && x + 34 * ui > edge);
  });
}

function announce() {
  const it = current();
  $('#announce').textContent = it ? `${CATEGORIES[state.cat].label}. ${it.title}. ${it.sub}` : `${CATEGORIES[state.cat].label}. No games match.`;
}

// Both return true when the selection actually moved; `quiet` skips the sound.
function setCategory(i, quiet = false) {
  i = clamp(i, 0, CATEGORIES.length - 1);
  if (i === state.cat) return false;
  const dir = Math.sign(i - state.cat);
  endLaunch();
  state.cat = i;
  if (i === FRIENDS_COL) refreshFriends();          // who's online now
  render();
  selectionChanged();
  if (!quiet) { Sound.tick(); Sound.whoosh(dir); }
  return true;
}
function setItem(j, quiet = false) {
  const n = cols[state.cat].list.length;
  if (!n) return false;
  j = clamp(j, 0, n - 1);
  if (j === state.sel[state.cat]) return false;
  endLaunch();
  state.sel[state.cat] = j;
  render();
  selectionChanged();
  if (!quiet) Sound.tick();
  return true;
}

/* ═════════════════════════ Layer 1 · dwell ═════════════════════════ */

const dwell = $('#dwell'), heroSlot = dwell.querySelector('.hero'), logoSlot = dwell.querySelector('.logo');
const artCache = new Map();
let dwellTimer = 0, dwellSeq = 0, fieldOccluded = false;

function selectionChanged() {
  if (session && session.quitArmed && current() !== QUIT) disarmQuit();   // moving off Quit cancels the "press again"
  if (searchBar.sel) deselectSearchBar(false);
  dwellSeq += 1;
  const seq = dwellSeq;
  dwell.classList.remove('on');                // fade back to 0 immediately
  field.classList.remove('veiled');            // waves return underneath
  fieldOccluded = false;
  // The clear logo belongs to GAMES only. Anywhere else its element is taken
  // out of the layout and emptied, so nothing can show in that corner.
  const inGames = state.cat === 0;
  if (!inGames) logoSlot.replaceChildren();
  logoSlot.style.display = inGames ? '' : 'none';
  clearTimeout(dwellTimer);
  dwellTimer = setTimeout(() => showDwell(seq), DWELL_MS);
  announce();
  syncInspector();                             // the inspector follows the focused game
}

async function showDwell(seq) {
  // Backdrop + clear logo exist only for games, and never over a running game.
  // The cold boot and the screensaver bring it back themselves when they end.
  if (state.cat !== 0 || !isGame(current()) || session || cold || ambient.on) return;
  const art = await getArt(current());         // already cached (and decoded) for preloaded games
  if (seq !== dwellSeq || state.cat !== 0 || !isGame(current()) || session || cold || ambient.on) return;   // moved while the art was loading
  heroSlot.replaceChildren(art.hero);
  logoSlot.style.display = '';
  logoSlot.replaceChildren(art.logo);
  dwell.classList.add('on');                   // art 0 → 1 over 650ms
  field.classList.add('veiled');               // waves 1 → 0 over the same 650ms
}

// Once the waves have faded out completely the canvas can stop drawing.
// (Only while it's meant to be hidden: a fade-out that ends just as the
// waves are asked back must not stop them.)
$('#field').addEventListener('transitionend', (e) => {
  const hidden = e.target.classList.contains('veiled') || root.classList.contains('ingame');
  if (e.propertyName === 'opacity' && hidden && getComputedStyle(e.target).opacity === '0') { fieldOccluded = true; settleFlow(); }
});
// After leaving GAMES the backdrop finishes its fade, then it's cleared too.
dwell.addEventListener('transitionend', (e) => {
  if (e.target === dwell && e.propertyName === 'opacity' && state.cat !== 0 && !dwell.classList.contains('on')) heroSlot.replaceChildren();
});

// The art of the last couple of dozen games looked at stays ready (each is
// a decoded backdrop and a logo canvas, about a megabyte); older ones are
// let go and loaded again if they come back.
const ART_CACHE_MAX = 24;
function getArt(it) {
  let art = artCache.get(it);
  if (art) artCache.delete(it);                     // (the most recent last)
  else art = buildArt(it);
  artCache.set(it, art);
  while (artCache.size > ART_CACHE_MAX) artCache.delete(artCache.keys().next().value);
  return art;
}

async function buildArt(it) {
  if (it.live && STEAM) await STEAM.prepareArt(it);    // Steam's own hero / logo URLs
  const [heroImg, logo] = await Promise.all([firstImage(artUrls(it, 'hero'), false), buildLogo(it)]);
  let hero;
  if (heroImg) {
    heroImg.alt = '';
    heroImg.draggable = false;
    heroImg.style.objectPosition = it.heroPos || '50% 50%';
    // Decode ahead of time so the fade-in starts exactly on the dwell beat.
    if (heroImg.decode) { try { await heroImg.decode(); } catch (e) { /* ignore */ } }
    hero = heroImg;
  } else {
    hero = document.createElement('div');
    const [a, b] = it.tones;
    hero.style.background =
      `radial-gradient(60% 80% at 66% 40%, ${a}66 0%, transparent 70%),` +
      `radial-gradient(55% 70% at 28% 75%, ${b}cc 0%, transparent 72%),` +
      'linear-gradient(160deg, #0e141d 0%, #05080d 100%)';
  }
  return { hero, logo };
}

async function buildLogo(it) {
  const urls = artUrls(it, 'logo');
  if (urls.length) {
    let img = await firstImage(urls, true);          // CORS load so the padding can be trimmed
    let trimmable = !!img;
    if (!img) img = await firstImage(urls, false);   // still displayable, just untrimmed
    if (img && img.decode) { try { await img.decode(); } catch (e) { /* drawn as it is */ } }   // decoded off the main thread first
    if (img) return logoCanvas(img, trimmable);
  }
  return wordmark(it.title);
}

// Bounding box of the visible pixels (Steam logos carry a lot of transparent
// padding). It's found on a copy at most 320 px wide, which is plenty to see
// the edges and a small fraction of the work of a full 2x logo, then scaled
// back with a little slack so nothing of the logo is cut.
const ALPHA_SCAN_W = 320;
function alphaBox(img) {
  const W = img.naturalWidth, H = img.naturalHeight;
  if (!W || !H) return null;
  const s = Math.min(1, ALPHA_SCAN_W / W);
  const w = Math.max(1, Math.round(W * s)), h = Math.max(1, Math.round(H * s));
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  cx.drawImage(img, 0, 0, w, h);
  let d;
  try { d = cx.getImageData(0, 0, w, h).data; } catch (e) { return null; }
  const T = 12, A = (x, y) => d[(y * w + x) * 4 + 3];
  let top = 0, bottom = h - 1, left = 0, right = w - 1;
  scanTop: for (; top < h; top++) for (let x = 0; x < w; x++) if (A(x, top) > T) break scanTop;
  if (top >= h) return null;
  scanBottom: for (; bottom > top; bottom--) for (let x = 0; x < w; x++) if (A(x, bottom) > T) break scanBottom;
  scanLeft: for (; left < w; left++) for (let y = top; y <= bottom; y++) if (A(left, y) > T) break scanLeft;
  scanRight: for (; right > left; right--) for (let y = top; y <= bottom; y++) if (A(right, y) > T) break scanRight;
  const pad = 2 + Math.ceil(1 / s);                 // in the image's own pixels
  const x0 = Math.max(0, Math.floor(left / s) - pad), y0 = Math.max(0, Math.floor(top / s) - pad);
  const x1 = Math.min(W - 1, Math.ceil((right + 1) / s) + pad), y1 = Math.min(H - 1, Math.ceil((bottom + 1) / s) + pad);
  return { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
}

function logoCanvas(img, trimmable) {
  const box = (trimmable && alphaBox(img)) || { x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight };
  const aspect = box.w / box.h;
  let dw = Math.sqrt(LOGO_AREA * aspect), dh = dw / aspect;     // equal optical weight across logos
  if (dw > LOGO_MAX_W) { dw = LOGO_MAX_W; dh = dw / aspect; }
  if (dh > LOGO_MAX_H) { dh = LOGO_MAX_H; dw = dh * aspect; }
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const cv = document.createElement('canvas');
  cv.width = Math.round(dw * dpr); cv.height = Math.round(dh * dpr);
  cv.style.width = `${dw.toFixed(1)}px`; cv.style.height = `${dh.toFixed(1)}px`;
  const cx = cv.getContext('2d');
  cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
  cx.drawImage(img, box.x, box.y, box.w, box.h, 0, 0, cv.width, cv.height);
  return cv;
}

// Typographic clear logo for games that have no logo art on Steam.
const measure = document.createElement('canvas').getContext('2d');
async function wordmark(title) {
  try { await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1500))]); } catch (e) { /* ignore */ }
  const text = title.replace(/™/g, '').toUpperCase();
  const el = document.createElement('div');
  el.className = 'wordmark';
  for (let size = 46; size >= 18; size -= 2) {
    measure.font = `300 ${size}px Inter, "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
    const width = (s) => measure.measureText(s).width + s.length * size * 0.14;
    const lines = []; let line = '';
    for (const w of text.split(/\s+/)) {
      const next = line ? `${line} ${w}` : w;
      if (line && width(next) > LOGO_MAX_W) { lines.push(line); line = w; } else line = next;
    }
    if (line) lines.push(line);
    if (lines.length <= 3 && lines.every((l) => width(l) <= LOGO_MAX_W)) {
      el.style.fontSize = `${size}px`;
      el.innerHTML = lines.map(esc).join('<br>');
      return el;
    }
  }
  el.style.fontSize = '18px';
  el.textContent = text;
  return el;
}

/* ═════════════════════════ Select / back ═════════════════════════ */

let launch = null;

function select() {
  if (launch || boot || dipping) return false;
  const it = current();
  if (!it) return false;                       // an empty search
  if (it.kind === 'resume') { resumeGame(); return true; }
  if (it.kind === 'quit') { quitGame(); return true; }
  if (it.kind === 'library') return openLibrary();                // every game you own (see "Library")
  if (isApp(it)) return openApp(it);                              // one of your apps (see setApps)
  if (isGame(it)) {
    if (session && session.it === it) { resumeGame(); return true; }   // it's already running
    if (session && it.live) { hold('Quit the running game first'); return false; }   // Steam runs one game at a time
    Sound.confirm();                           // F#5 A5 C#6 E6 chime
    closeInspector(true);
    startBoot(it);                             // the full launch sequence
    launchGame(it);
    return true;
  }
  // Anything else opens Steam's own page, menu or dialog for it (inside
  // Steam), with a moment of "Opening…" on the item.
  if (STEAM && it.act === 'power' && openPower()) return true;   // Tungsten's own Power menu (Steam's, if it can't run here)
  if (STEAM && (it.act === 'downloads' || it.act === 'screenshots') && openPage(it.act)) return true;   // Tungsten's own pages (Steam's, if they can't run here)
  if (it.friend) return openFriend(it);                            // a friend: Chat or View Profile
  if (STEAM && it.act) {
    lastOpenedAt = performance.now();
    steamQuietUntil = lastOpenedAt + 1200;                   // (Steam's sounds for the page it opens: Tungsten made its own)
    // In a game's overlay, Controller means that game's controller layout.
    const opened = IN_OVERLAY && it.act === 'controller' && session && session.live ? STEAM.controllerLayout(session.it) : STEAM.open(it.act);
    if (!opened) { hold('Not available here'); return false; }
  }
  Sound.confirm();
  const li = currentEntry().li, span = li.querySelector('.sub > span');
  launch = { li, span, prev: span.textContent, timer: setTimeout(endLaunch, STEAM ? 1500 : 2400) };
  span.textContent = 'Opening…';
  li.classList.add('launching');
  if (STEAM && watchSteamPages.check) watchSteamPages.check();   // a Steam page now has the screen
  return true;
}
// One of your apps: Steam starts it the way its library does, with a
// moment of "Opening…" on the item. No launch sequence and no in-game menu
// (it isn't a game), and it opens from the in-game menu too, next to the
// running game. Steam goes to the app's page as it starts it: Tungsten
// stays up over that page and sends Steam back once the app is running, or
// done already (see watchSteamPages).
function openApp(it) {
  if (STEAM && it.live) {
    STEAM.appLaunches().set(it.appid, { at: Date.now(), shortcut: !!it.shortcut, seen: false, stalled: false, handled: {} });
    lastOpenedAt = performance.now();
    if (!STEAM.run(it)) { STEAM.appLaunches().delete(it.appid); hold('Not available here'); return false; }
    tlog(`app ${it.appid}: opening`);
  }
  steamQuietUntil = performance.now() + 1500;                // (Steam's launch sounds)
  Sound.confirm();
  const li = currentEntry().li, span = li.querySelector('.sub > span');
  launch = { li, span, prev: span.textContent, timer: setTimeout(endLaunch, STEAM ? 2000 : 2400) };
  span.textContent = 'Opening…';
  li.classList.add('launching');
  if (STEAM && watchSteamPages.check) watchSteamPages.check();
  return true;
}
function endLaunch() {
  if (!launch) return;
  clearTimeout(launch.timer);
  launch.li.classList.remove('launching');
  launch.span.textContent = launch.prev;
  launch = null;
}
// Same idea as "Opening…": the focused item's subtitle says something for a
// moment (with the back sound), then returns.
function hold(text) {
  endLaunch();
  const e = currentEntry();
  if (!e) return;
  const span = e.li.querySelector('.sub > span');
  launch = { li: e.li, span, prev: span.textContent, timer: setTimeout(endLaunch, 2400) };
  span.textContent = text;
  Sound.back();
  $('#announce').textContent = text;
}
function launchGame(it) {
  try {
    if (it.live && STEAM) return STEAM.run(it);                 // SteamClient.Apps.RunGame(gameid, '', -1, 100)
    const sc = window.SteamClient;
    if (sc && sc.Apps && typeof sc.Apps.RunGame === 'function') { sc.Apps.RunGame(String(it.appid), '', -1, 100); return true; }
  } catch (e) { console.warn('[Tungsten] launch failed', e); }
  const url = `steam://rungameid/${it.gameid || it.appid}`;
  if (STEAM) return STEAM.steamUrl(url);
  if (LAUNCH_VIA_STEAM_PROTOCOL) window.location.href = url;
  return false;
}
// Back, in order: cancel "Opening…", clear the search, leave the in-game
// menu, jump to the top of the column, then back to GAMES.
function back() {
  let did = false;
  if (launch) { endLaunch(); did = true; }
  else if (search.query) { clearSearch(); did = true; }
  else if (session) return resumeGame();
  else if (state.sel[state.cat] > 0) did = setItem(0, true);
  else if (state.cat > 0) did = setCategory(0, true);
  if (did) Sound.back();
  return did;
}

/* ═════════════════════════ Launch sequence (Enter on a game) ═════════════════════════
   1.6 seconds, timed from here and styled in CSS ("Launch sequence"):
   the axes zoom and fade, the ribbons surge, the screen goes black, a launch
   card shows the game's clear logo, then the black lifts on the running game
   (see "In-game"). Input is held for the duration (M still mutes).          */

const BOOT = { dark: 350, show: 750, hide: 1400, end: 1600 };   // ms
const bootEl = $('#boot'), bootMark = bootEl.querySelector('.mark');
let boot = null;

// A second copy of the clear logo (the dwell layer keeps the original).
function copyLogo(src) {
  if (!(src instanceof HTMLCanvasElement)) return src.cloneNode(true);
  const c = document.createElement('canvas');
  c.width = src.width; c.height = src.height;
  c.style.width = `calc(${src.style.width} * var(--ui))`;
  c.style.height = `calc(${src.style.height} * var(--ui))`;
  c.getContext('2d').drawImage(src, 0, 0);
  return c;
}

function startBoot(it) {
  const run = { it, timers: [] };
  boot = run;
  // The title in type first, swapped for the clear logo as soon as it's ready
  // (it's normally cached already).
  const title = document.createElement('div');
  title.className = 'wordmark';
  title.textContent = it.title.replace(/™/g, '');
  bootMark.replaceChildren(title);
  getArt(it).then((art) => {
    if (boot === run && !bootEl.classList.contains('show')) bootMark.replaceChildren(copyLogo(art.logo));
  });
  fieldOccluded = false;                       // the ribbons come back for the surge
  root.classList.add('booting');
  bootEl.classList.add('on');
  const at = (ms, fn) => run.timers.push(setTimeout(fn, ms));
  at(BOOT.dark, () => bootEl.classList.add('dark'));
  at(BOOT.show, () => bootEl.classList.add('show', 'fill'));
  at(BOOT.hide, () => bootEl.classList.remove('show'));
  at(BOOT.end, endBoot);
  $('#announce').textContent = `Launching ${it.title}`;
}

function endBoot() {
  if (!boot) return;
  const run = boot;
  boot.timers.forEach(clearTimeout);
  boot = null;
  fieldOccluded = false;
  root.classList.remove('booting');
  bootEl.classList.remove('dark', 'show', 'fill', 'on');
  startSession(run.it, !!run.it.live);         // as the black lifts, the game is running
}
// While the screen is fully black there's nothing to draw underneath.
bootEl.addEventListener('transitionend', (e) => {
  if (e.target === bootEl && e.propertyName === 'opacity' && boot && bootEl.classList.contains('dark')) fieldOccluded = true;
});

/* ═════════════════════════ Cold boot (the startup movie) ═════════════════════════
   Plays once when Tungsten first comes up (Big Picture, the Steam window,
   the standalone page), and again whenever B is pressed in the launcher.
   Timed from here and styled in CSS ("Cold boot"); the ribbons' sweep is
   in frame() (coldBoost). It all happens on the live ribbons, so when the
   menu comes in they're the same ribbons, exactly where they were.        */

const COLD = {
  word: 1300, wordOut: 3800, ui: 4800, end: 6200,     // ms
  dip: 250,                                           // a replay: down to black first
  hold: 250, sweep: 2500,                             // the sweep: full for 250 ms, eased out by 2.5 s
  amp: 0.6, vel: 0.8, glow: 0.65, blur: 3,            // at full sweep: waves 1.6×, flow 1.8×, brightness 1.65, blur 3px
};
// The flow seconds the sweep gains on the shared clock (flow 1.8× while full,
// then easing out): the movie starts that far behind, so it ends on it.
const SWEEP_GAIN = COLD.vel * (COLD.hold + (COLD.sweep - COLD.hold) / 2) / 1000;
const coldEl = $('#coldboot');
// It plays by itself when Tungsten first comes up, except in the in-game
// overlay (and with ?coldboot=0 in the address, for tests).
const COLD_AUTO = !IN_OVERLAY && !/[?&#]coldboot=0\b/.test(String(location.href)) && !window.__tungstenNoColdBoot;
let cold = null;                 // the movie: { timers, t0, ui }
let sweep = null;                // the ribbons' sweep: { t0, skipAt, skipK } (it can outlast the movie)
let coldShown = false;           // the first one has played
// The sweep at `now`: k (1 at full sweep, 0 when settled) and the flow
// seconds it has gained so far, worked out exactly (k's integral), less what
// it gains in all: so it starts behind the shared clock and lands right on
// it. A skip eases k out in 450 ms instead (the ribbons then end slightly
// behind, which settleFlow tidies away later). Once it's over, what it
// gained goes into flow.off.
const SKIP_EASE = 450;
function sweepAt(now) {
  if (!sweep || reduceMotion) return { k: 0, gain: 0 };
  const H = COLD.hold, D = COLD.sweep - COLD.hold, t = now - sweep.t0;
  const I = (x) => { if (x <= 0) return 0; const u = clamp((x - H) / D, 0, 1); return Math.min(x, H) + D * (u - u * u * u + (u * u * u * u) / 2); };
  let k, i, over;
  if (sweep.skipAt) {
    const ts = sweep.skipAt - sweep.t0, u = clamp(t - ts, 0, SKIP_EASE);
    k = sweep.skipK * (1 - u / SKIP_EASE);
    i = I(ts) + sweep.skipK * (u - (u * u) / (2 * SKIP_EASE));
    over = t - ts >= SKIP_EASE;
  } else {
    k = 1 - smooth((t - H) / D);
    i = I(t);
    over = t >= COLD.sweep;
  }
  const gain = (COLD.vel * i) / 1000 - SWEEP_GAIN;
  if (over) { flow.off += gain; sweep = null; return { k: 0, gain: 0 }; }
  return { k: Math.max(0, k), gain };
}
const coldBoost = (now) => sweepAt(now).k;
const COLD_CLASSES = ['cold', 'cold-hold', 'cold-dip', 'cold-in', 'cold-word', 'cold-wordout', 'cold-ui', 'cold-skip'];

function coldBoot(why = 'start') {
  if (why === 'start') coldShown = true;                 // (once, even if a game is running then)
  if (IN_OVERLAY || session || boot || dipping || powering || !active) return false;
  const dip = why === 'B';                               // B: down to black first; at start-up it's black from the first frame
  if (cold) { cold.timers.forEach(clearTimeout); cold = null; }
  coldShown = true;
  endAmbient(true);
  closeLightbox(); closeDrawer('none'); closeInspector(true); closeLibrary(false); closeOsk(false); blurSearch(); deselectSearchBar(false); endLaunch();
  clearTimeout(dwellTimer); dwellSeq += 1;
  const run = { timers: [], t0: 0, ui: false };
  cold = run;
  const later = (ms, fn) => run.timers.push(setTimeout(() => { if (cold === run) fn(); }, ms));
  root.classList.remove(...COLD_CLASSES);
  root.classList.add('cold', 'cold-hold');
  if (dip) root.classList.add('cold-dip');
  dwell.classList.remove('on');                          // (under the black either way)
  $('#announce').textContent = 'Tungsten';
  const begin = () => {
    root.classList.remove('cold-dip');
    // Pitch black now. The art goes, the ribbons come back on, and the
    // sweep starts (its flow clock behind by what it will gain, see sweepAt).
    field.classList.remove('veiled');
    fieldOccluded = false;
    const now = performance.now();
    if (sweep) { flow.off += sweepAt(now).gain; sweep = null; }   // a replay mid-sweep: keep what the last one gained
    flow.ease = null; flow.fade = null;
    sweep = { t0: now, skipAt: 0, skipK: 1 };
    run.t0 = sweep.t0;
    void coldEl.offsetWidth;                             // the black is drawn before it lifts
    root.classList.add('cold-in');
    Sound.playColdBootSound();
    later(COLD.word, () => root.classList.add('cold-word'));
    later(COLD.wordOut, () => root.classList.add('cold-wordout'));
    later(COLD.ui, materializeCold);
  };
  if (dip) later(COLD.dip, begin); else begin();
  tlog(`cold boot (${why})`);
  setTimeout(() => tlog(`cold boot sound: ${Sound.coldPlaying ? 'playing' : Sound.muted ? 'muted' : `waiting (audio ${Sound.state})`}`), COLD.dip + 700);
  return true;
}
// Stage 4: the cross comes in, and input works again.
function materializeCold() {
  if (!cold || cold.ui) return;
  const run = cold;
  run.ui = true;
  root.classList.remove('cold-hold');
  root.classList.add('cold-ui');
  run.timers.push(setTimeout(() => { if (cold === run) endCold(); }, COLD.end - COLD.ui));
}
// Enter, Space, Esc or a click before 4800 ms: straight to stage 4.
function skipCold() {
  if (!cold || cold.ui || !cold.t0) return false;          // (not while a replay is still going down to black)
  cold.timers.forEach(clearTimeout); cold.timers = [];
  root.classList.add('cold-skip', 'cold-in');
  if (root.classList.contains('cold-word')) root.classList.add('cold-wordout');
  const now = performance.now(), k = coldBoost(now);
  if (sweep && !sweep.skipAt) { sweep.skipK = k; sweep.skipAt = now; }
  materializeCold();
  return true;
}
// The movie is over (or cut short): the interface is all there, and the
// focused game's art follows after the usual dwell.
function endCold() {
  if (!cold) return;
  cold.timers.forEach(clearTimeout);
  cold = null;
  root.classList.remove(...COLD_CLASSES);
  clearTimeout(dwellTimer);
  const seq = ++dwellSeq;
  dwellTimer = setTimeout(() => showDwell(seq), DWELL_MS);
  announce();
}
coldEl.addEventListener('click', (e) => { if (e.isTrusted) { Sound.unlock(); skipCold(); } });

/* ═════════════════════════ Screensaver (Big Picture) ═════════════════════════
   Big Picture's screensaver is a page of its own that Steam lays over
   everything after the idle time in its Power settings. Tungsten's (see
   build_screensaver.py) is the ribbons alone. So that it feels like the
   same screen with the menu put away:
   - Tungsten counts the idle time too. Three seconds before the screensaver
     is due, the menu, the art and everything else fade away (2 s), leaving
     the background and the ribbons, and Steam's own timer then starts the
     screensaver over them. A press before that brings the menu straight back.
   - The screensaver draws the same ribbons at the same moment (the shared
     flow clock) and eases them up to twice the pace. Tungsten, underneath,
     mirrors it frame for frame.
   - A press ends it: Steam takes its page away and Tungsten is there with
     the same ribbons, easing back to the menu's pace (2.5 s) while the menu
     fades back in (1.2 s).
   This runs with Tungsten's screensaver picked (Settings > Customization)
   and an idle time set, in Big Picture, with Tungsten on screen and nothing
   else going on (no game, launch, cold boot, Steam menu or Steam page).   */

const AMBIENT = { lead: 3, fade: 2000, back: 300, ret: 1200, settle: 2500, latency: 100 };   // s, then ms
const ambient = { on: false, saver: false, at: 0, timer: 0, tint: null, swallowUntil: 0, saverPress: 0 };
let lastInputAt = performance.now();

// Any input at all (keys, the controller, the mouse) counts as activity. If
// the menu was fading for the screensaver, it comes straight back; when it
// was mostly gone, the press that brought it back does nothing else.
function noteInput() {
  const now = performance.now();
  lastInputAt = now;
  if (ambient.on && !ambient.saver && endAmbient()) ambient.swallowUntil = now + 60;
}
const ambientSwallows = () => performance.now() < ambient.swallowUntil;

function restartDwell(ms = DWELL_MS) {
  clearTimeout(dwellTimer);
  const seq = ++dwellSeq;
  dwellTimer = setTimeout(() => showDwell(seq), ms);
}
// The menu, the art and the rest fade away; the ribbons come back on, on
// the shared clock (a cross-fade if they're still ahead of it from the last
// screensaver), in the clock's own colors.
function startAmbient(atOnce = false) {
  ambient.on = true; ambient.at = performance.now();
  clearTimeout(dwellTimer); dwellSeq += 1;
  dwell.classList.remove('on');
  field.classList.remove('veiled');
  fieldOccluded = false;
  if (!flow.saver && Math.abs(flow.off) > 0.002) {
    if (atOnce) flow.fade = null;
    else flow.fade = { at: performance.now(), from: flow.off, ms: AMBIENT.fade };
    flow.off = 0; flow.ease = null;
  }
  if (colorMode !== 0) { ambient.tint = colorMode; colorMode = 0; applyColor(atOnce); }   // the screensaver follows the clock's colors
  clearTimeout(ambient.timer);
  root.classList.remove('ambient-back', 'ambient-return');
  root.classList.toggle('ambient-now', atOnce);
  root.classList.add('ambient');
}
// Back from the fade (a press, or something else came up): `instant` for
// the cold boot, which covers it anyway.
function endAmbient(instant = false) {
  if (!ambient.on || ambient.saver) return false;
  const gone = (performance.now() - ambient.at) / AMBIENT.fade > 0.5;
  ambient.on = false;
  root.classList.remove('ambient', 'ambient-now');
  if (!instant) {
    root.classList.add('ambient-back');
    clearTimeout(ambient.timer);
    ambient.timer = setTimeout(() => root.classList.remove('ambient-back'), AMBIENT.back + 50);
  }
  if (ambient.tint !== null) { colorMode = ambient.tint; ambient.tint = null; applyColor(); }
  if (!instant) restartDwell();
  tlog('screensaver: the menu is back');
  return gone;
}
// (Big Picture's page never has the keyboard focus as far as the page can
// tell, so that isn't asked. Steam's own timer starts the screensaver: it
// sees all the input, Tungsten only its own, so nothing here can start it
// while the PC is being used somewhere else.)
function checkIdle() {
  if (!IN_BPM || !STEAM || ambient.saver) return;
  const ok = active && !under && !session && !boot && !dipping && !powering && !cold && !launch;
  if (!ok) { if (ambient.on) endAmbient(); return; }
  const setup = STEAM.screensaverSetup();
  if (!setup || !/^uioverride-tungsten$/i.test(setup.id) || !(setup.secs > 0)) { if (ambient.on) endAmbient(); return; }
  const idle = (performance.now() - lastInputAt) / 1000;
  if (!ambient.on && idle >= setup.secs - AMBIENT.lead) { startAmbient(); tlog(`screensaver due in ${Math.round(setup.secs - idle)} s: the menu fades`); }
}
// Steam's word that the screensaver started or ended.
function onScreensaver(on, initial = false) {
  const now = performance.now();
  ambient.saverPress = 0;
  if (on) {
    if (ambient.saver || initial) return;
    if (!active || session || boot || cold) { tlog('screensaver on (over something else)'); return; }
    if (!ambient.on) startAmbient(true);               // Steam's own timer (or a preview) came first: under it, at once
    ambient.saver = true;
    if (flow.fade) { flow.fade = null; }               // (already on the shared clock)
    flow.saver = { at: now + AMBIENT.latency, off: flow.off };   // its page starts drawing about this much later
    tlog('screensaver on: mirroring its ribbons');
    return;
  }
  if (!ambient.saver) return;
  ambient.saver = false;
  const s = Math.max(0, (now - flow.saver.at) / 1000);
  flow.off = flow.saver.off + saverFlow(s);           // exactly where its ribbons are now
  flow.ease = { at: now, v: saverSpeed(s), ms: AMBIENT.settle };
  flow.saver = null; flow.at = now;
  lastInputAt = now;
  ambient.on = false;
  root.classList.remove('ambient', 'ambient-now');
  root.classList.add('ambient-return');
  clearTimeout(ambient.timer);
  ambient.timer = setTimeout(() => root.classList.remove('ambient-return'), AMBIENT.ret + 50);
  if (ambient.tint !== null) { colorMode = ambient.tint; ambient.tint = null; applyColor(); }
  restartDwell(AMBIENT.ret + DWELL_MS);
  tlog(`screensaver off after ${Math.round(s)} s: the menu fades back in`);
}

/* ═════════════════════════ Options drawer (O / Tab) and Power ═════════════════════════
   The panel on the right. For the focused game, its options: while it's
   open, Up/Down move through them, Enter runs one, and Esc, Left, O or Tab
   close it. Launch Game and Game Details do something real everywhere;
   inside Steam the others open Steam's own windows for the game.
   The same panel is the Power menu (SYSTEM > Power in Big Picture and the
   in-game overlay): Sleep, Restart, Shut Down, and in Big Picture also Exit
   Big Picture, Restart Steam and Exit Steam, run the way Steam's own Power
   menu runs them (STEAM.power). The ones that close things (Restart, Shut
   Down, Restart Steam, Exit Steam) ask for a second press. While the PC
   goes to sleep or shuts down, the screen fades to black and says so.      */

const OPTIONS = ['Launch Game', 'Game Details', 'Achievements', 'Manage DLC', 'Controller Layout', 'Properties', ...(IN_STEAM ? ['Move to APPS'] : [])];
const APP_OPTIONS = [{ id: 'open', label: 'Open' }, { id: 'games', label: 'Move to GAMES' }, { id: 'props', label: 'Properties' }];
const GAME_OPTIONS = OPTIONS.map((label) => ({ label }));
const POWER = [
  { id: 'sleep', label: 'Sleep', doing: 'Going to sleep' },
  { id: 'restart', label: 'Restart', confirm: true, doing: 'Restarting' },
  { id: 'shutdown', label: 'Shut Down', confirm: true, doing: 'Shutting down' },
  { id: 'exitbpm', label: 'Exit Big Picture', bpm: true },
  { id: 'restartsteam', label: 'Restart Steam', confirm: true, doing: 'Restarting Steam', bpm: true },
  { id: 'exitsteam', label: 'Exit Steam', confirm: true, doing: 'Closing Steam', bpm: true },
];
const drawerEl = $('#drawer'), drawerGame = $('#drawer-game'), drawerBar = drawerEl.querySelector('.bar');
const drawerEyebrow = drawerEl.querySelector('.eyebrow'), drawerList = drawerEl.querySelector('ul');
const drawer = { open: false, sel: 0, kind: '', items: [], armed: -1, armTimer: 0, at: 0 };
let optionEls = [];
function fillDrawer(kind, items) {
  if (drawer.kind === kind && drawer.items.length === items.length && drawer.items.every((x, k) => x === items[k])) return;
  drawer.kind = kind;
  drawer.items = items;
  optionEls = items.map((item, i) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'menuitem');
    li.textContent = item.label;
    if (item.n !== undefined) {                        // the Show list: how many games, and a check on the one in use
      const n = document.createElement('span');
      n.className = 'n';
      n.textContent = item.n.toLocaleString('en-US');
      li.appendChild(n);
    }
    if (item.on) li.classList.add('on');
    li.addEventListener('click', () => { drawerSelect(i, true); drawerActivate(); });
    return li;
  });
  drawerList.replaceChildren(...optionEls);
}
fillDrawer('game', GAME_OPTIONS);

function placeBar() {
  const li = optionEls[drawer.sel];
  if (li) drawerBar.style.setProperty('--bar-y', `${li.offsetTop + (li.offsetHeight - drawerBar.offsetHeight) / 2}px`);
}
function drawerSelect(i, quiet = false) {
  i = clamp(i, 0, drawer.items.length - 1);
  if (i === drawer.sel) return false;
  disarmPower();
  drawer.sel = i;
  optionEls.forEach((li, k) => li.classList.toggle('sel', k === i));
  placeBar();
  $('#announce').textContent = drawer.items[i].label;
  if (!quiet) Sound.tick();
  return true;
}
function showDrawer(sel) {
  drawer.open = true;
  drawer.sel = sel;
  drawer.at = performance.now();
  optionEls.forEach((li, k) => li.classList.toggle('sel', k === sel));
  root.classList.add('drawer-open');
  drawerEl.setAttribute('aria-hidden', 'false');
  layoutLegend();
  placeBar();
  Sound.tick(); Sound.whoosh(-1);                      // slides in from the right
}
function openDrawer(sel = 0) {
  if (!drawer.open && isApp(current())) return openAppOptions();
  if (drawer.open || state.cat !== 0 || !isGame(current())) return false;   // options are for games (and apps)
  endLaunch();
  closeInspector(true);                                 // one side panel at a time
  fillDrawer('game', GAME_OPTIONS);
  drawerEyebrow.textContent = 'Options';
  drawerGame.textContent = current().title;
  showDrawer(sel);
  $('#announce').textContent = `Options for ${current().title}. ${OPTIONS[sel]}`;
  return true;
}
// One of your apps in APPS: Open, Move to GAMES, Properties.
function openAppOptions() {
  const it = current();
  if (drawer.open || !isApp(it)) return false;
  endLaunch();
  closeInspector(true);
  fillDrawer('appopts', APP_OPTIONS);
  drawerEyebrow.textContent = 'Options';
  drawerGame.textContent = it.title;
  showDrawer(0);
  $('#announce').textContent = `Options for ${it.title}. ${APP_OPTIONS[0].label}`;
  return true;
}
// SYSTEM > Power. With none of Steam's power calls reachable, false: then
// Steam's own Power menu opens instead.
let powerItems = null;
function openPower() {
  if (drawer.open || boot || dipping || !STEAM) return false;
  const items = POWER.filter((p) => (!p.bpm || IN_BPM) && STEAM.canPower(p.id));
  if (!items.length) return false;
  if (!powerItems || powerItems.length !== items.length || powerItems.some((p, k) => p !== items[k])) powerItems = items;
  endLaunch(); closeInspector(true); closeLightbox();
  fillDrawer('power', powerItems);
  drawerEyebrow.textContent = 'Power';
  drawerGame.textContent = 'Sleep, restart or shut down';
  showDrawer(0);
  $('#announce').textContent = `Power. ${powerItems[0].label}`;
  return true;
}
function closeDrawer(sound = 'slide') {
  if (!drawer.open) return false;
  disarmPower();
  drawer.open = false;
  root.classList.remove('drawer-open');
  drawerEl.setAttribute('aria-hidden', 'true');
  layoutLegend();
  if (sound === 'back') Sound.back();
  else if (sound === 'slide') { Sound.tick(); Sound.whoosh(1); }
  return true;
}
function drawerActivate() {
  const li = optionEls[drawer.sel];
  if (!li) return false;
  if (drawer.kind === 'power') return powerActivate(li, drawer.items[drawer.sel]);
  if (drawer.kind === 'appopts') {                    // one of your apps
    const it = current(), opt = drawer.items[drawer.sel];
    li.classList.remove('pressed'); void li.offsetWidth; li.classList.add('pressed');
    closeDrawer('none');
    if (opt.id === 'open') return select();
    if (opt.id === 'games') return moveTo(it, 'games');
    if (it && it.live && STEAM && STEAM.properties(it)) { Sound.confirm(); return true; }
    hold('Not available here');
    return false;
  }
  if (drawer.kind === 'libfilter') {                  // the Library's Show list
    const item = drawer.items[drawer.sel];
    li.classList.remove('pressed'); void li.offsetWidth; li.classList.add('pressed');
    closeDrawer('none');
    Sound.confirm();
    libSetFilter(item.id);
    return true;
  }
  if (drawer.kind === 'friend') {
    const it = current(), opt = drawer.items[drawer.sel];
    li.classList.remove('pressed'); void li.offsetWidth; li.classList.add('pressed');
    closeDrawer('none');
    if (!it || !it.friend || !STEAM) { Sound.back(); return false; }
    const done = opt.id === 'chat' ? STEAM.chatWith(it.friend) : STEAM.profile(it.friend);
    if (!done) { hold('Not available here'); return false; }
    Sound.confirm();
    lastOpenedAt = performance.now();
    const e = currentEntry(), span = e.li.querySelector('.sub > span');
    endLaunch();
    launch = { li: e.li, span, prev: span.textContent, timer: setTimeout(endLaunch, 1500) };
    span.textContent = 'Opening…';
    if (watchSteamPages.check) watchSteamPages.check();
    return true;
  }
  li.classList.remove('pressed'); void li.offsetWidth; li.classList.add('pressed');
  const opt = OPTIONS[drawer.sel], it = current();
  if (opt === 'Launch Game') { closeDrawer('none'); return select(); }
  if (opt === 'Game Details') { closeDrawer('none'); return openInspector(); }
  if (opt === 'Move to APPS') { closeDrawer('none'); return moveTo(it, 'apps'); }
  // Inside Steam the others open Steam's own windows for the game (the sample
  // library has nothing to open, so there they only confirm).
  if (it && it.live && STEAM) {
    if (opt === 'Achievements') { closeDrawer('none'); return openInspector(); }   // the Inspector lists them
    const done = opt === 'Controller Layout' ? STEAM.controllerLayout(it)
      : opt === 'Properties' ? STEAM.properties(it)
      : opt === 'Manage DLC' ? STEAM.properties(it, 'dlc') : false;   // DLC lives in Properties
    if (done) { Sound.confirm(); closeDrawer('none'); return true; }
  }
  Sound.confirm();
  return true;
}
function powerActivate(li, item) {
  if (performance.now() - drawer.at < 350) return false;   // Power pressed twice quickly doesn't pick the first item
  li.classList.remove('pressed'); void li.offsetWidth; li.classList.add('pressed');
  if (item.confirm && drawer.armed !== drawer.sel) {      // "Press again" first
    disarmPower();
    drawer.armed = drawer.sel;
    const note = document.createElement('span');
    note.className = 'confirm';
    note.textContent = 'Press again to confirm';
    li.appendChild(note);
    li.classList.add('armed');
    placeBar();
    $('#announce').textContent = `${item.label}? Press again to confirm.`;
    Sound.tick();
    drawer.armTimer = setTimeout(disarmPower, 4000);
    return true;
  }
  disarmPower();
  closeDrawer('none');
  if (item.id === 'exitbpm') {
    Sound.confirm();
    return STEAM.power('exitbpm') || (hold('Not available here'), false);
  }
  Sound.confirm();
  powerFade(item);
  if (STEAM.power(item.id)) return true;
  endPowerFade();
  hold('Not available here');
  return false;
}
function disarmPower() {
  clearTimeout(drawer.armTimer);
  if (drawer.armed < 0) return;
  const li = optionEls[drawer.armed], item = drawer.items[drawer.armed];
  drawer.armed = -1;
  if (li && item) { li.textContent = item.label; li.classList.remove('armed'); }
  if (drawer.open) placeBar();
}
const toggleDrawer = () => (drawer.open ? closeDrawer() : openDrawer());
// What each action does while the drawer is open.
const DRAWER_ACTIONS = {
  up: () => drawerSelect(drawer.sel - 1),
  down: () => drawerSelect(drawer.sel + 1),
  pageup: () => drawerSelect(drawer.sel - PAGE_ROWS),
  pagedown: () => drawerSelect(drawer.sel + PAGE_ROWS),
  select: drawerActivate,
  back: () => closeDrawer('back'),
  left: () => closeDrawer(),
  right: () => false,
  options: () => closeDrawer(),
};

// The screen fades to black while the PC goes to sleep, restarts or shuts
// down, or Steam closes, saying which in the launch card's type. Back (B,
// Esc) lifts it, and so does waking up; it also lifts by itself if nothing
// has happened after a while (half a minute; 8 seconds for Sleep).
let powering = null;
function powerFade(item) {
  endPowerFade();
  const w = document.createElement('div');
  w.className = 'wordmark';
  w.textContent = item.doing;
  bootMark.replaceChildren(w);
  bootEl.classList.add('on', 'dark', 'show', 'power');
  powering = { item, timer: setTimeout(endPowerFade, item.id === 'sleep' ? 8000 : 30000) };
  $('#announce').textContent = `${item.doing}.`;
}
function endPowerFade() {
  if (!powering) return false;
  clearTimeout(powering.timer);
  powering = null;
  bootEl.classList.remove('dark', 'show', 'power');
  setTimeout(() => { if (!boot && !powering && !dipping) bootEl.classList.remove('on'); }, 450);
  return true;
}

/* ═════════════════════════ In-game (running game + in-game menu) ═════════════════════════
   When a launch finishes, the game is "running": its art fills the screen
   (brightness 0.95) and the launcher steps away. I, Home, Esc (or the
   controller's Home / Menu button) open the in-game menu: dark glass over the
   game, ribbons at 35%, the cross interface with Resume Game and Quit Game at
   the top of GAMES, and a Now Playing badge. Every column stays usable.
   Resume goes back to the game; Quit plays the cancel chime and returns to
   the launcher. Pressing I or Home with no game running opens the menu over
   the focused game, as a preview.
   Inside Steam the game is real, so the menu is how Tungsten shows it:
   - in the Steam window, whenever a game is running (started from Tungsten or
     anywhere else), over that game's art. Resume brings the game's window to
     the front; Quit asks once more, then closes it the way Steam's own Exit
     does. When the game ends, Tungsten goes back to the launcher by itself.
   - in the in-game overlay (Shift + Tab), over the game itself. Resume closes
     the overlay.                                                            */

const gameFeed = $('#game .feed'), nowTitle = $('#nowplaying .t');
let session = null;             // { it, menu, actions, live, pending, quitArmed }
let dipping = false;            // a short fade through black (quitting)
const QUIT_SUB = QUIT.sub;

function startSession(it, menu = false) {
  if (session) endSession();    // launching another game closes the one that was running
  closeLibrary(false);          // (a game started from Steam itself while the Library was open)
  const live = !!(it.live && STEAM);
  session = { it, menu: false, actions: [], live, at: performance.now() };
  gameFeed.replaceChildren();
  if (!IN_OVERLAY) getArt(it).then((art) => { if (session && session.it === it) gameFeed.replaceChildren(art.hero.cloneNode(true)); });
  RESUME.sub = IN_OVERLAY ? `Close the overlay and go back to ${it.title}` : `Back to ${it.title}`;
  QUIT.sub = live ? 'Close the game' : QUIT_SUB;
  session.actions = [makeItem(0, RESUME), makeItem(0, QUIT)];
  for (const e of session.actions) trackEls[0].appendChild(e.li);
  cols[0].all.unshift(...session.actions);
  nowTitle.textContent = it.title;
  root.classList.add('ingame');
  if (live) {
    menu = true;                                     // the real game has its own window
    session.pending = !STEAM.runningAppIds().includes(it.appid);
    // Launched but never reported running (cancelled, failed): back to the
    // launcher. (Not in the overlay: it only exists while the game runs.)
    const s = session;
    if (!IN_OVERLAY) s.pendingTimer = setTimeout(() => {
      if (session === s && s.pending && !STEAM.runningAppIds().includes(s.it.appid)) closeSession(s.it);
    }, 90000);
    if (!IN_OVERLAY) s.probeTimer = setTimeout(() => probeBehindGame(s), 30000);
  }
  setMenu(menu, true);
  layoutLegend();
  if (!menu) $('#announce').textContent = `${it.title} is running. Press I or Home for the in-game menu.`;
}

// For Steam's log, half a minute into a game: whether this window still
// draws frames while the game is in front of it (Chromium stops drawing a
// window it knows is covered; whether Steam's windows do is what this shows).
function probeBehindGame(s) {
  if (session !== s) return;
  const t0 = performance.now();
  let n = 0, done = false;
  const report = () => {
    if (done) return;
    done = true;
    tlog(`in-game check: ${n} frames in 1 s, page ${document.visibilityState}, ${document.hasFocus() ? 'focused' : 'not focused'}, ` +
      `menu ${s.menu ? 'up' : 'down'}, Tungsten ${active ? 'on screen' : 'stepped aside'}`);
  };
  const count = () => { if (done) return; n += 1; if (performance.now() - t0 < 1000) requestAnimationFrame(count); else report(); };
  requestAnimationFrame(count);
  setTimeout(report, 1500);                          // (no frames at all: it isn't drawing)
}

function endSession() {
  if (!session) return;
  if (IN_OVERLAY) hideInGameMenu();
  clearTimeout(session.pendingTimer); clearTimeout(session.quitTimer); clearTimeout(session.probeTimer);
  for (const e of session.actions) e.li.remove();
  const actions = session.actions;
  cols[0].all = cols[0].all.filter((e) => !actions.includes(e));   // (the Library stays)
  session = null;
  fieldOccluded = false;                            // the ribbons come back
  root.classList.remove('ingame', 'ingame-menu', 'ingame-live');
  refreshLists();
  layoutLegend();
}

// Opens (true) or closes (false) the in-game menu over the running game.
function setMenu(open, silent = false) {
  if (!session) return false;
  if (!open && session.live) {                      // a real game: go back to it, the menu stays put
    disarmQuit();
    closeDrawer('none'); closeInspector(true); closeLightbox();
    if (resetSearch()) { render(); selectionChanged(); }
    if (!silent) { Sound.tick(0.7); Sound.whoosh(-1); }
    if (IN_OVERLAY) { hideInGameMenu(); STEAM.hideOverlay(session.it); }   // back to just the game: the overlay hides
    else {
      const s = session;
      STEAM.raise(s.it).then((ok) => {
        if (ok || session !== s) return;
        if (s.pending) hold('Still starting…');      // launched, not running yet
        else if (STEAM.runningAppIds().includes(s.it.appid)) tlog(`game ${s.it.appid}: no window to bring forward, still running`);
        else closeSession(s.it);                      // not running any more
      });
    }
    return true;
  }
  session.menu = open;
  root.classList.toggle('ingame-menu', open);
  root.classList.toggle('ingame-live', !open);
  if (open) {
    endLaunch();
    closeDrawer('none'); closeInspector(true); closeLightbox();   // nothing left open over it
    resetSearch();                                  // the full list, no search left over
    state.cat = 0;                                  // focus lands on Resume Game
    refreshLists();
    state.sel[0] = 0;
    render();
    selectionChanged();
    $('#announce').textContent = `In-game menu. ${session.it.title} is ${session.live ? 'running' : 'paused'}. Resume Game.`;
    if (!silent) { Sound.tick(); Sound.whoosh(1); }
  } else {
    closeDrawer('none'); closeInspector(true); closeLightbox();
    if (resetSearch()) { render(); selectionChanged(); }
    if (!silent) { Sound.tick(0.7); Sound.whoosh(-1); }
  }
  return true;
}
const resumeGame = () => setMenu(false);

// A real game is closed only on a second press: the first one asks.
function disarmQuit() {
  if (!session || !session.quitArmed) return;
  session.quitArmed = false;
  clearTimeout(session.quitTimer);
  const q = session.actions[1];
  if (q) q.li.querySelector('.sub > span').textContent = QUIT.sub;
}
function quitGame() {
  if (!session || dipping) return false;
  const it = session.it;
  if (session.live) {
    const span = session.actions[1].li.querySelector('.sub > span');
    if (session.closing) return false;
    if (!session.quitArmed) {
      session.quitArmed = true;
      span.textContent = 'Press again to quit. Unsaved progress may be lost.';
      $('#announce').textContent = `Quit ${it.title}? Press again to quit.`;
      Sound.tick();
      session.quitTimer = setTimeout(disarmQuit, 4000);
      return true;
    }
    disarmQuit();
    Sound.back();                                   // the cancel chime
    session.closing = true;
    span.textContent = 'Closing…';
    STEAM.terminate(it);
    // Steam reports the game closed (see the session listener). If it hasn't
    // after 10 seconds: a game that's gone brings the launcher back anyway;
    // one still running (it stopped to ask about saving, say) keeps its menu,
    // and Quit can be pressed again.
    const s = session;
    s.quitTimer = setTimeout(() => {
      if (session !== s) return;
      if (STEAM.runningAppIds().includes(s.it.appid)) {
        s.closing = false;
        span.textContent = QUIT.sub;
        tlog(`game ${s.it.appid} still running 10 s after Quit: its menu stays`);
        return;
      }
      closeSession(s.it);
    }, 10000);
    return true;
  }
  Sound.back();                                     // the cancel chime
  dip(() => backToLauncher(it));
  return true;
}
// Ends the session behind a dip to black and lands on that game.
function closeSession(it) {
  if (!session || session.it !== it || dipping) return;
  closeDrawer('none'); closeInspector(true); closeLightbox();
  dip(() => backToLauncher(it));
}
function backToLauncher(it) {
  endSession();
  gameFeed.replaceChildren();
  // Back in the plain launcher, on the game that was just closed.
  state.cat = 0;
  refreshLists();
  const k = cols[0].list.findIndex((e) => e.it === it || (it.appid && e.it.appid === it.appid && !e.it.kind));
  if (k >= 0) state.sel[0] = k;
  render();
  selectionChanged();
}

// Fade through black, run fn while it's dark, fade back. (During a Power
// fade the screen is already going dark for good: fn just runs.)
function dip(fn) {
  if (powering) { fn(); return; }
  dipping = true;
  bootEl.classList.add('on', 'dark');
  setTimeout(() => {
    fn();
    bootEl.classList.remove('dark');
    setTimeout(() => { if (!boot) bootEl.classList.remove('on'); dipping = false; }, 450);
  }, 460);
}

// I / Home / the controller's Home or Menu button.
function toggleInGame() {
  if (session) return setMenu(!session.menu);
  if (STEAM && libraryLive) { toast('No game is running'); Sound.back(); return false; }   // nothing to show over
  const e = cols[0].list.find((x, k) => k === state.sel[0] && isGame(x.it)) || cols[0].all.find((x) => isGame(x.it));
  if (!e) return false;
  startSession(e.it, true);
  Sound.tick(); Sound.whoosh(1);
  return true;
}

/* ═════════════════════════ Desktop Game Inspector (Space / Details) ═════════════════════════
   Right half of the screen while the cross stays at 22vw. It follows the
   focused game, and folds away on Esc, Space or a click outside it.        */

const inspectorEl = $('#inspector'), inspectorBody = inspectorEl.querySelector('.scroll');
const inspector = { open: false, it: null, focus: 0, sub: -1, view: 'game', entry: null, page: null, timer: 0, sig: '' };
// Favorites are shared by all of Tungsten's windows: read again before each
// change, and followed when another window changes them.
const favorites = new Set();
function readFavorites() {
  try {
    const ids = JSON.parse(localStorage.getItem('tungsten.favorites') || '[]');
    favorites.clear();
    if (Array.isArray(ids)) ids.forEach((id) => favorites.add(id));
  } catch (e) { /* storage unavailable */ }
}
readFavorites();
window.addEventListener('storage', (e) => { if (e.key === 'tungsten.favorites') readFavorites(); });

const GEAR_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${gearPath(12, 12, 9, 6.8, 8)}"/><circle cx="12" cy="12" r="2.8"/></svg>`;
const STAR_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${starPath(12, 12.6, 8.6, 3.9)}"/></svg>`;
const CHECK_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.3 5 8.6l4.5-5"/></svg>';
const FRIEND_STATUS = { playing: 'Playing now', online: 'Online', away: 'Away', owns: 'Owns this game' };
const avatarHue = (name) => [...name].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) % 360, 7);

// What the inspector shows, in one shape for both libraries: the sample's
// DETAILS, or Steam's (fetched when a game is first inspected, kept for two
// minutes, and refreshed when a game session ends).
const liveDetails = new Map();                  // appid -> { data, at } or { pending }
function sampleDetails(it) {
  const d = DETAILS[it.appid] || { played: '', hours: 0, achTotal: 0, achDone: 0, ach: [], shots: [], dlc: [], friends: [] };
  return {
    played: d.played, hours: `${d.hours} hrs`, cloud: { text: 'Up to Date', ok: true },
    ach: { total: d.achTotal, done: d.achDone, badges: d.ach.map(([name, icon], k) => ({ name, src: `${ACH_CDN}${it.appid}/${icon}.jpg`, locked: k === 3 })) },
    friends: d.friends,
    shots: d.shots.map((p) => ({ thumb: `${CDN}${it.appid}/${p}.600x338.jpg`, full: `${CDN}${it.appid}/${p}.1920x1080.jpg` })),
    shotsNote: '',
    dlc: d.dlc.map(([id, name, img]) => ({ name, src: `${CDN}${id}/${img}` })),
    dlcNote: 'No DLC for this game',
  };
}
function detailsFor(it) {
  if (!it.live || !STEAM) return sampleDetails(it);
  const got = liveDetails.get(it.appid);
  if (got && got.data && performance.now() - got.at < 120000) return got.data;
  if (!got || !got.pending) {
    liveDetails.set(it.appid, { pending: true, data: got && got.data });
    STEAM.details(it).then((data) => {
      liveDetails.set(it.appid, { data, at: performance.now() });
      if (inspector.open && inspector.it === it) fillInspector(it, true);
    }).catch(() => liveDetails.delete(it.appid));
  }
  if (got && got.data) return got.data;          // a little old, while the fresh copy loads
  return { loading: true, ...STEAM.quick(it), ach: null, friends: null, shots: [], dlc: [], shotsNote: '', dlcNote: '' };
}

function inspectorHTML(it) {
  const d = detailsFor(it);
  const fav = favorites.has(it.appid);
  const a = d.ach, wait = '<div class="no-ach">Loading…</div>';
  const pct = a && a.total ? Math.round((a.done / a.total) * 100) : 0;
  const ach = !a ? `<div class="sec-head"><span>Achievements</span></div>${wait}`
    : a.total
      ? `<div class="sec-head"><span>Achievements</span><span class="count">${a.done} / ${a.total} Unlocked <span class="pct">(${pct}%)</span></span></div>
         <div class="ach-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${a.total}" aria-valuenow="${a.done}"><span data-w="${pct}"></span></div>
         <div class="badges">${a.badges.map((b) => `<div class="frost badge${b.locked ? ' locked' : ''}" title="${esc(b.name || '')}${b.locked ? ' (locked)' : ''}">${b.src ? `<img src="${esc(b.src)}" alt="" loading="lazy">` : ''}</div>`).join('')}</div>`
      : `<div class="sec-head"><span>Achievements</span></div><div class="no-ach">This game has no Steam achievements.</div>`;
  let friends = '';
  if (d.friends) {
    const playing = d.friends.filter(([, st]) => st === 'playing').length;
    const list = d.friends.length
      ? `<div class="friends">${d.friends.map(([name, st]) => `<span class="friend"><span class="ava" style="background: linear-gradient(135deg, hsl(${avatarHue(name)} 45% 52%), hsl(${(avatarHue(name) + 40) % 360} 50% 28%))">${esc(name[0])}</span><span class="who">${esc(name)}</span><span class="st ${st}">${FRIEND_STATUS[st]}</span></span>`).join('')}</div>`
      : '<div class="no-ach">None of your friends have this game yet.</div>';
    friends = `<div class="ins-sec"><div class="sec-head"><span>Friends</span><span class="count">${playing ? `${playing} playing now` : `${d.friends.length} own it`}</span></div>${list}</div>`;
  }
  const shots = d.shots.length
    ? `<div class="shots">${d.shots.map((x, k) => `<button class="frost shot" data-act="shot" data-k="${k}" aria-label="Screenshot ${k + 1}"><img src="${esc(x.thumb)}" alt="" loading="lazy"></button>`).join('')}</div>`
    : d.loading ? wait : d.shotsNote ? `<div class="no-ach">${esc(d.shotsNote)}</div>` : '';
  const dlc = d.loading ? ''
    : d.dlc.length ? d.dlc.map((x, k) => `<button class="frost tag" data-act="dlc" data-k="${k}">${CHECK_SVG}${esc(x.name)}</button>`).join('')
    : `<span class="tag none">${esc(d.dlcNote)}</span>`;
  const stat = (k, v, cls = '') => `<div class="frost stat"><span class="k">${k}</span><span class="v${cls}">${v ? esc(v) : '&nbsp;'}</span></div>`;
  return `<div class="ins-eyebrow">Game Details</div>
    <h2 class="ins-title">${esc(it.title)}</h2>
    <div class="ins-bar">
      <button class="frost ins-play" data-act="play">${PLAY_SVG}${session && session.it === it ? 'Resume Game' : 'Play Game'}</button>
      ${stat('Last Played', d.played)}
      ${stat('Total Playtime', d.hours)}
      ${stat('Cloud Status', d.cloud.text, d.cloud.ok ? ' ok' : '')}
      <div class="quick">
        <button class="frost icon-btn" data-act="properties" title="Properties" aria-label="Properties">${GEAR_SVG}</button>
        <button class="frost icon-btn" data-act="favorite" title="Favorite" aria-label="Favorite" aria-pressed="${fav}">${STAR_SVG}</button>
      </div>
    </div>
    <div class="ins-sec">${ach}</div>
    ${friends}
    <div class="ins-sec"><div class="sec-head"><span>Screenshots &amp; DLC</span></div>${shots}<div class="tags">${dlc}</div></div>`;
}

function fillInspector(it, refresh = false) {
  const keep = refresh ? inspectorBody.scrollTop : 0;
  inspector.it = it;
  inspectorBody.innerHTML = inspectorHTML(it);
  inspectorBody.scrollTop = keep;
  insFocus(refresh ? inspector.focus : 0, false);      // a new game starts on Play
  const bar = inspectorBody.querySelector('.ach-bar > span');
  if (bar) requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = `${bar.dataset.w}%`; }));   // fills in
}

function openInspector() {
  const it = current();
  if (inspector.open || !isGame(it) || boot || dipping) return false;
  closeDrawer('none');
  inspector.open = true;
  fillInspector(it);
  root.classList.add('inspecting');
  layoutLegend();
  inspectorEl.setAttribute('aria-hidden', 'false');
  tuckCategories();
  $('#announce').textContent = `Game details for ${it.title}`;
  Sound.tick(); Sound.whoosh(-1);
  return true;
}
function closeInspector(quiet = false) {
  if (!inspector.open) return false;
  inspector.open = false;
  clearInterval(inspector.timer);
  inspector.view = 'game'; inspector.page = null; inspector.entry = null;
  closeLightbox();
  root.classList.remove('inspecting', 'paging');
  layoutLegend();
  inspectorEl.setAttribute('aria-hidden', 'true');
  tuckCategories();
  if (!quiet) Sound.back();
  return true;
}
const toggleInspector = () => (inspector.open ? closeInspector() : openInspector());
// Called whenever the focus moves: follow the new game, or fold away.
function syncInspector() {
  if (!inspector.open) return;
  if (inspector.view !== 'game') { if (currentEntry() !== inspector.entry) closeInspector(true); return; }   // a page stays with its item
  const it = current();
  if (!isGame(it)) closeInspector(true);
  else if (it !== inspector.it && !root.classList.contains('fast')) fillInspector(it);   // while a direction is held, it catches up at the end
}

inspectorEl.addEventListener('click', (e) => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  if (inspector.view !== 'game') { pageAct(b); return; }
  if (!inspector.it) return;
  const it = inspector.it, d = detailsFor(it);
  switch (b.dataset.act) {
    case 'play': closeInspector(true); select(); break;
    case 'properties':                              // Steam's own Properties window, or the drawer in the sample
      if (it.live && STEAM && STEAM.properties(it)) { Sound.confirm(); break; }
      openDrawer(OPTIONS.indexOf('Properties'));
      break;
    case 'favorite': {
      readFavorites();
      if (favorites.has(it.appid)) favorites.delete(it.appid); else favorites.add(it.appid);
      b.setAttribute('aria-pressed', String(favorites.has(it.appid)));
      try { localStorage.setItem('tungsten.favorites', JSON.stringify([...favorites])); } catch (err) { /* storage unavailable */ }
      Sound.tick(0.8);
      break;
    }
    case 'shot':
      openLightbox(d.shots.map((x, k) => ({ src: x.full, cap: `${it.title} · Screenshot ${k + 1}` })), +b.dataset.k);
      break;
    case 'dlc':
      openLightbox(d.dlc.map((x) => ({ src: x.src, cap: `${x.name} · Installed` })), +b.dataset.k);
      break;
    default: break;
  }
});

/* ═════════════════════════ Tungsten's own pages: Downloads, Screenshots ═════════════════════════
   SYSTEM > Downloads and MEDIA > Screenshots open in the inspector's panel
   instead of Steam's pages, with Steam's own data (STEAM.downloads,
   STEAM.screenshots) and the calls Steam's pages make. The D-pad moves the
   focus ring as in the Game Inspector, Cross presses, L2 / R2 page through,
   Circle closes. Each page has a way to Steam's own page for anything else.
   Downloads updates every second while it's open.                          */

const PAUSE_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 2h2.2v8H3zM6.8 2H9v8H6.8z"/></svg>';
const OPEN_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>';
const SHOTS_SHOWN = 6;                             // per game, until "Show all"

const gb = (n) => (n >= 1e9 ? `${(n / 1e9).toFixed(n >= 1e10 ? 0 : 1)} GB` : n >= 1e6 ? `${Math.round(n / 1e6)} MB` : n > 0 ? `${Math.max(1, Math.round(n / 1e3))} KB` : '0 MB');
const speedText = (bps) => (bps >= 1e6 ? `${(bps / 1e6).toFixed(1)} MB/s` : bps > 0 ? `${Math.round(bps / 1e3)} KB/s` : '');
function timeLeft(secs) {
  if (!(secs > 0)) return '';
  if (secs < 60) return `${Math.round(secs)} s left`;
  const m = Math.round(secs / 60);
  return m < 60 ? `${m} min left` : `${Math.floor(m / 60)} hr ${m % 60} min left`;
}
// Header art for any app, in the order the library tries it (custom art,
// Steam's cache, the CDN); a picture that doesn't load hands over to the next.
function headerArt(appid) {
  const g = findGame(appid);
  const cache = STEAM ? [`/assets/${appid}/header.jpg`, `/assets/${appid}_header.jpg`] : [];   // (Steam keeps art for games not installed too)
  const urls = [...(g ? artUrls(g, 'thumb') : cache), `${CDN}${appid}/header.jpg`];
  return [...new Set(urls)];
}
const artImg = (cls, appid) => { const urls = headerArt(appid); return `<img class="${cls}" src="${esc(urls[0])}" data-next="${esc(urls.slice(1).join('|'))}" alt="" loading="lazy" decoding="async">`; };

function openPage(view) {
  if (!STEAM || boot || dipping) return false;
  const data = view === 'downloads' ? STEAM.downloads() : true;
  if (!data) return false;                         // Steam's own page instead
  closeInspector(true); closeDrawer('none'); closeLightbox(); deselectSearchBar(false);
  inspector.open = true;
  inspector.view = view;
  inspector.it = null;
  inspector.entry = currentEntry();
  inspector.page = view === 'downloads' ? { ...data, expanded: new Set() } : { loading: true, expanded: new Set() };
  inspector.sig = '';
  fillPage();
  root.classList.add('inspecting', 'paging');
  inspectorEl.setAttribute('aria-hidden', 'false');
  layoutLegend();
  tuckCategories();
  if (view === 'downloads') inspector.timer = setInterval(refreshDownloads, 1000);
  else {
    STEAM.screenshots().then((d) => {
      if (!inspector.open || inspector.view !== 'screenshots') return;
      inspector.page = d ? { ...d, expanded: new Set() } : { error: true, expanded: new Set() };
      fillPage();                                  // the focus goes to the newest screenshot
    }).catch((e) => {
      tlog(`screenshots: ${e && e.message}`);
      if (inspector.open && inspector.view === 'screenshots') { inspector.page = { error: true, expanded: new Set() }; fillPage(true); }
    });
  }
  $('#announce').textContent = view === 'downloads' ? 'Downloads' : 'Screenshots';
  Sound.tick(); Sound.whoosh(-1);
  tlog(`opened ${view} (Tungsten's page)`);
  return true;
}
// What a stop on a page is (a download's row and which of its buttons, or a
// button by what it does), so a page drawn again can find it: rows move up
// as downloads finish, and the focus has to stay on the same thing, not the
// same place.
function stopKey(el, sub) {
  if (!el) return null;
  if (el.classList.contains('dl-row')) { const b = rowButtons(el)[sub]; return { row: el.dataset.appid, act: b ? b.dataset.act : '' }; }
  return { act: el.dataset.act || '', appid: el.dataset.appid || '', key: el.dataset.key || '' };
}
function findStop(els, key) {
  if (!key) return null;
  if (key.row !== undefined) {
    const k = els.findIndex((el) => el.classList.contains('dl-row') && el.dataset.appid === key.row);
    if (k < 0) return null;
    return { k, sub: Math.max(0, rowButtons(els[k]).findIndex((b) => b.dataset.act === key.act)) };
  }
  const k = els.findIndex((el) => !el.classList.contains('dl-row') && (el.dataset.act || '') === key.act &&
    (el.dataset.appid || '') === key.appid && (el.dataset.key || '') === key.key);
  return k < 0 ? null : { k, sub: 0 };
}
function fillPage(refresh = false) {
  const keep = refresh ? inspectorBody.scrollTop : 0;
  const was = refresh ? stopKey(insTargets()[inspector.focus], inspector.sub) : null;
  inspectorBody.innerHTML = inspector.view === 'downloads' ? downloadsHTML(inspector.page) : screenshotsHTML(inspector.page);
  inspectorBody.scrollTop = keep;
  inspectorBody.querySelectorAll('img').forEach((img) => img.addEventListener('error', function next() {
    const rest = (img.dataset.next || '').split('|').filter(Boolean);
    if (!rest.length) { img.classList.add('broken'); img.removeEventListener('error', next); return; }
    img.dataset.next = rest.slice(1).join('|');
    img.src = rest[0];
  }));
  // The focus starts on the first thing to press: Pause Downloads, or the
  // newest screenshot (the corner button to Steam's page comes later). Drawn
  // again, it stays on what it was on; if that's gone, on the stop that took
  // its place, at its first button.
  const els = insTargets();
  const first = Math.max(0, els.findIndex((el) => el.dataset.act !== 'ss-steam'));
  if (!refresh) { insFocus(first, false, 0); return; }
  const found = findStop(els, was);
  if (found) insFocus(found.k, false, found.sub);
  else insFocus(Math.min(inspector.focus, Math.max(0, els.length - 1)), false, 0);
}

// Downloads, as Steam's Downloads page groups them.
function downloadsSig(d) {
  const ids = (l) => l.map((x) => `${x.appid}:${x.active ? 'a' : ''}${x.paused ? 'p' : ''}`).join(',');
  return [d.paused, ids(d.queued), ids(d.unqueued), ids(d.scheduled), ids(d.completed), [...(d.expanded || [])].join()].join('|');
}
const WHEN_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const SHOT_DAY_FMT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const whenText = (t) => (t ? WHEN_FMT.format(new Date(t * 1000)) : '');
function dlRow(x, kind) {
  const meta = kind === 'done' ? ['Done', whenText(x.at)].filter(Boolean).join(' · ')
    : x.active ? [x.total ? `${gb(x.done)} of ${gb(x.total)}` : '', x.paused ? 'Paused' : speedText(x.bps), x.paused ? '' : timeLeft(x.secs)].filter(Boolean).join(' · ')
    : kind === 'scheduled' ? [x.total ? `${gb(x.total)}` : '', x.deferred ? `Scheduled for ${whenText(x.deferred)}` : 'Scheduled'].filter(Boolean).join(' · ')
    : [x.total ? `${gb(x.total)}` : '', kind === 'unqueued' ? 'Not in the queue' : x.paused ? 'Paused' : 'Waiting'].filter(Boolean).join(' · ');
  const start = `<button class="frost dl-btn" data-act="dl-start" data-appid="${x.appid}">${PLAY_SVG}Start Now</button>`;
  const g = kind === 'done' ? findGame(x.appid) : null;
  const acts = kind === 'current' ? `<button class="frost dl-btn" data-act="dl-toggle">${x.paused ? `${PLAY_SVG}Resume` : `${PAUSE_SVG}Pause`}</button>`
    : kind === 'next' ? `${start}<button class="frost dl-btn" data-act="dl-remove" data-appid="${x.appid}">Remove</button>`
    : kind === 'scheduled' ? start
    : kind === 'unqueued' ? `<button class="frost dl-btn" data-act="dl-queue" data-appid="${x.appid}">Download</button>`
    : g && isGame(g) ? `<button class="frost dl-btn" data-act="dl-play" data-appid="${x.appid}">${PLAY_SVG}Play</button>`
    : '';
  const bar = kind === 'done' || kind === 'scheduled' ? '' : `<div class="dl-bar"><span style="transform: ${barShift(x.pct)}"></span></div>`;
  return `<div class="dl-row${x.active ? ' active' : ''}" data-appid="${x.appid}">
      ${artImg('dl-art', x.appid)}
      <div class="dl-main"><div class="dl-title">${esc(x.title)}</div>${bar}<div class="dl-meta">${esc(meta)}</div></div>
      ${acts ? `<div class="dl-acts">${acts}</div>` : ''}
    </div>`;
}
function downloadsHTML(d) {
  inspector.sig = downloadsSig(d);
  const cur = d.queued.find((x) => x.active) || null;
  const next = d.queued.filter((x) => x !== cur);
  const busy = !!cur && !d.paused;
  const title = busy ? `Downloading ${cur.title}` : d.queued.length ? (d.paused ? 'Downloads paused' : 'Waiting to download') : 'Nothing to download';
  const stat = (k, v, cls = '') => `<div class="frost stat"><span class="k">${k}</span><span class="v${cls}" data-v="${k}">${v ? esc(v) : '&nbsp;'}</span></div>`;
  const sec = (head, rows, count) => (rows ? `<div class="ins-sec"><div class="sec-head"><span>${head}</span>${count ? `<span class="count">${count}</span>` : ''}</div><div class="dl-list">${rows}</div></div>` : '');
  // A long list shows its first few rows, and "Show all" for the rest, so
  // the focus never has to travel down a long list to reach the next one.
  const fold = (key, list, kind, few) => {
    if (!list.length) return '';
    const all = d.expanded && d.expanded.has(key), shown = all || list.length <= few + 1 ? list : list.slice(0, few);
    const more = shown.length < list.length ? `<div class="tags"><button class="frost tag" data-act="dl-more" data-key="${key}">Show all ${list.length}</button></div>` : '';
    return shown.map((x) => dlRow(x, kind)).join('') + more;
  };
  return `<div class="ins-eyebrow">Downloads</div>
    <h2 class="ins-title" data-v="title">${esc(title)}</h2>
    <div class="ins-bar">
      ${d.queued.length ? `<button class="frost ins-play" data-act="dl-toggle">${d.paused ? `${PLAY_SVG}Resume Downloads` : `${PAUSE_SVG}Pause Downloads`}</button>` : ''}
      ${stat('Speed', busy ? speedText(cur.bps) : '')}
      ${stat('Time Left', busy ? timeLeft(cur.secs).replace(/ left$/, '') : '')}
      ${stat('In Queue', String(d.queued.length))}
      <div class="quick"><button class="frost icon-btn" data-act="dl-steam" title="Steam's Downloads page" aria-label="Steam's Downloads page">${OPEN_SVG}</button></div>
    </div>
    ${cur ? sec(d.paused ? 'Paused' : 'Downloading', dlRow(cur, 'current'), `${Math.floor(cur.pct)}%`) : ''}
    ${sec('Up Next', fold('next', next, 'next', 5), next.length ? String(next.length) : '')}
    ${sec('Not Queued', fold('unqueued', d.unqueued, 'unqueued', 5), d.unqueued.length > 1 ? String(d.unqueued.length) : '')}
    ${sec('Scheduled', fold('scheduled', d.scheduled, 'scheduled', 3), d.scheduled.length > 1 ? String(d.scheduled.length) : '')}
    ${sec('Completed', fold('completed', d.completed, 'done', 3), '')}
    ${!d.queued.length && !d.unqueued.length && !d.scheduled.length && !d.completed.length ? '<div class="ins-sec"><div class="no-ach">Updates and installs show up here.</div></div>' : ''}`;
}
// Every second: the numbers move in place; anything else changing (a game
// finished, the queue changed, paused) draws the page again, keeping the
// focus where it was.
const barShift = (pct) => `translateX(${(Math.max(0, Math.min(100, pct || 0)) - 100).toFixed(1)}%)`;
function refreshDownloads() {
  if (!inspector.open || inspector.view !== 'downloads' || !STEAM || !active) return;   // (nothing to update while it's out of sight)
  const d = STEAM.downloads();
  if (!d) return;
  d.expanded = (inspector.page && inspector.page.expanded) || new Set();
  inspector.page = d;
  if (downloadsSig(d) !== inspector.sig) { fillPage(true); return; }
  const cur = d.queued.find((x) => x.active);
  if (!cur) return;
  const row = inspectorBody.querySelector(`.dl-row.active[data-appid="${cur.appid}"]`);
  if (row) {
    const bar = row.querySelector('.dl-bar > span');
    if (bar) bar.style.transform = barShift(cur.pct);
    const meta = row.querySelector('.dl-meta');
    if (meta) meta.textContent = [cur.total ? `${gb(cur.done)} of ${gb(cur.total)}` : '', d.paused ? 'Paused' : speedText(cur.bps), d.paused ? '' : timeLeft(cur.secs)].filter(Boolean).join(' · ');
    const count = row.closest('.ins-sec').querySelector('.sec-head .count');
    if (count) count.textContent = `${Math.floor(cur.pct)}%`;
  }
  const v = (k) => inspectorBody.querySelector(`[data-v="${k}"]`);
  if (v('Speed')) v('Speed').textContent = d.paused ? ' ' : speedText(cur.bps) || ' ';
  if (v('Time Left')) v('Time Left').textContent = d.paused ? ' ' : timeLeft(cur.secs).replace(/ left$/, '') || ' ';
}

// Screenshots, by game, newest first.
function screenshotsHTML(p) {
  const head = (title) => `<div class="ins-eyebrow">Screenshots</div><h2 class="ins-title">${esc(title)}</h2>
    <div class="ins-bar"><div class="quick"><button class="frost icon-btn" data-act="ss-steam" title="Steam's media page" aria-label="Steam's media page">${OPEN_SVG}</button></div></div>`;
  if (p.loading) return `${head('Screenshots')}<div class="ins-sec"><div class="no-ach">Loading your screenshots…</div></div>`;
  if (p.error) return `${head('Screenshots')}<div class="ins-sec"><div class="no-ach">Steam didn't hand over the screenshots. Steam's media page has them.</div></div>`;
  if (!p.groups.length) return `${head('No screenshots yet')}<div class="ins-sec"><div class="no-ach">Screenshots you take in games show up here (F12 by default).</div></div>`;
  const groups = p.groups.map((g, gi) => {
    const all = p.expanded.has(gi), shown = all ? g.shots : g.shots.slice(0, SHOTS_SHOWN);
    const more = !all && g.shots.length > SHOTS_SHOWN ? `<div class="tags"><button class="frost tag" data-act="ss-more" data-g="${gi}">Show all ${g.shots.length}</button></div>` : '';
    return `<div class="ins-sec"><div class="sec-head"><span>${esc(g.title)}</span><span class="count">${g.shots.length}</span></div>
      <div class="shots">${shown.map((x, k) => `<button class="frost shot" data-act="ss-shot" data-g="${gi}" data-k="${k}" aria-label="${esc(g.title)}, screenshot ${k + 1}"><img src="${esc(x.src)}" alt="" loading="lazy" decoding="async"></button>`).join('')}</div>${more}</div>`;
  }).join('');
  return `${head(`${p.count.toLocaleString('en-US')} screenshot${p.count === 1 ? '' : 's'}`)}${groups}`;
}

/* ═════════════════════════ Library (GAMES > Library) ═════════════════════════
   Every game you own, installed here or not, as a cross of its own: the
   letters sit where the categories are (only the letters that have games)
   and the games run down under them in A to Z order, in the same cards as
   GAMES. A leading "The" doesn't count, so The Witcher sorts under W.
   - Up / Down go game by game straight through the alphabet (the letters
     follow), Left / Right (and L1 / R1) jump to the previous or next
     letter, L2 / R2 (Page Up / Down) jump 8 games. Up past the first game
     is the search bar, and the search filters the library while it's open.
   - Triangle (O) opens Show: All Games, Installed, Favorites (Steam's and
     the stars in Game Details) and your Steam collections.
   - Cross on an installed game plays it; on one that isn't installed,
     Steam's install dialog opens.
   - Circle clears a search first, then goes back to GAMES.
   The ribbons stay behind it the whole time. What it shows and the game it
   was on are remembered. Only the rows near the focus are in the page.     */
const libraryEl = $('#library'), libTrack = libraryEl.querySelector('.lib-track'), libRowEl = libraryEl.querySelector('.lib-row');
const libNameEl = libraryEl.querySelector('.lib-name'), libNumEl = libraryEl.querySelector('.lib-n');
const libCountEl = libraryEl.querySelector('.lib-count'), libEmptyEl = libraryEl.querySelector('.lib-empty');
const LIB_ROWS_KEPT = 120;           // rows kept ready for coming back to (the oldest beyond that are let go)
const libView = { filter: 'all', focus: 0 };   // what it shows, and the game it was last on (both kept)
try {
  const s = JSON.parse(localStorage.getItem('tungsten.library') || '{}');
  if (typeof s.filter === 'string') libView.filter = s.filter;
  if (Number.isFinite(s.focus)) libView.focus = s.focus;
} catch (e) { /* storage unavailable */ }
const saveLibView = () => { try { localStorage.setItem('tungsten.library', JSON.stringify({ filter: libView.filter, focus: libView.focus })); } catch (e) { /* storage unavailable */ } };
const LIB_COLLATOR = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const DL_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.8v6M3.4 5.6 6 8.2l2.6-2.6M2.2 10.2h7.6"/></svg>';
// p: the library as read when it opened; list: what it shows now (filter,
// search); letters: [{ ch, start, n }] over the list; sel: the focused row;
// rows: the rows made so far, by appid; shown: the ones in the page.
const lib = { open: false, p: null, list: [], letters: [], lsig: '', sel: 0, at: -1, rows: new Map(), shown: new Set(), hold: null, clearTimer: 0, artTimer: 0 };

// How a title sorts: no accents, case or punctuation, and no leading "The".
function libKey(s) {
  const t = normText(String(s).normalize('NFD').replace(/[̀-ͯ]/g, ''));
  return t.replace(/^the (?=\S)/, '') || t;
}
const libLetter = (key) => (/^[a-z]/.test(key) ? key[0].toUpperCase() : '#');
const libCmp = (a, b) => LIB_COLLATOR.compare(a.key, b.key) || LIB_COLLATOR.compare(a.title, b.title) || a.appid - b.appid;

// Steam's whole library inside Steam (see STEAM.owned), the sample here.
function libraryData() {
  readFavorites();
  const p = (STEAM && libraryLive && STEAM.owned()) || {
    games: GAMES.filter(isGame).map((g) => ({ appid: g.appid, title: g.title, sort: g.title, aka: g.aka || '', installed: true, played: 0, minutes: 0, sub: g.sub })),
    favorites: new Set(), collections: [],
  };
  const ids = new Set(p.games.map((g) => g.appid));
  for (const id of favorites) if (ids.has(id)) p.favorites.add(id);   // the stars in Game Details count too
  for (const g of p.games) {
    g.key = libKey(g.sort || g.title);
    g.letter = libLetter(g.key);
    g.find = normText(`${g.title} ${g.sort || ''} ${g.aka || ''}`);   // (what the search looks in)
  }
  p.games.sort(libCmp);
  return p;
}
// The Show list. Installed is offered when it differs from All Games,
// Favorites and each collection when they have games.
function libFilters(p) {
  const installed = p.games.filter((g) => g.installed).length, favs = p.games.filter((g) => p.favorites.has(g.appid)).length;
  const out = [{ id: 'all', label: 'All Games', n: p.games.length }];
  if (installed && installed < p.games.length) out.push({ id: 'installed', label: 'Installed', n: installed });
  if (favs) out.push({ id: 'favorites', label: 'Favorites', n: favs });
  for (const c of p.collections) out.push({ id: `c:${c.id}`, label: c.name, n: c.ids.size });
  return out;
}
const libFilterName = () => (libFilters(lib.p).find((f) => f.id === libView.filter) || { label: 'All Games' }).label;
function libList() {
  const p = lib.p, f = libView.filter, q = normText(search.query);
  const c = f.startsWith('c:') ? p.collections.find((x) => `c:${x.id}` === f) : null;
  let list = f === 'installed' ? p.games.filter((g) => g.installed)
    : f === 'favorites' ? p.games.filter((g) => p.favorites.has(g.appid))
    : c ? p.games.filter((g) => c.ids.has(g.appid)) : p.games;
  if (q) list = list.filter((g) => g.find.includes(q));
  return list;
}
const libSub = (g) => (g.installed ? g.sub || 'Installed'
  : g.sub && g.sub !== 'Not played yet' ? `Not installed · ${g.sub}` : 'Not installed');
const libSig = (g) => `${g.installed ? 1 : 0}|${g.title}|${g.sub || ''}`;

// What it shows again (opened, a filter, a search, Steam's library changed).
// The focus stays on `appid` if it's still there; if not, on the first game
// (a search), or (`near`) where that game would be.
function libRefresh(appid = 0, near = false) {
  const old = lib.list[lib.sel] || null;
  lib.list = libList();
  const letters = [];
  lib.list.forEach((g, k) => {
    const L = letters[letters.length - 1];
    if (L && L.ch === g.letter) L.n += 1; else letters.push({ ch: g.letter, start: k, n: 1 });
  });
  lib.letters = letters;
  let k = appid ? lib.list.findIndex((g) => g.appid === appid) : -1;
  if (k < 0 && near && old) { k = lib.list.findIndex((g) => libCmp(g, old) >= 0); if (k < 0) k = lib.list.length - 1; }
  lib.sel = Math.max(0, k);
  const lsig = letters.map((L) => `${L.ch}${L.n}`).join();
  if (lsig !== lib.lsig) { lib.lsig = lsig; libLetters(); }
  libNameEl.textContent = libFilterName();
  const n = lib.list.length, q = search.query.trim();
  libNumEl.textContent = q ? `${n.toLocaleString('en-US')} ${n === 1 ? 'match' : 'matches'} for “${q}”` : `${n.toLocaleString('en-US')} game${n === 1 ? '' : 's'}`;
  libEmptyEl.textContent = q ? `No games match “${q}”` : 'No games here yet';
  libEmptyEl.classList.toggle('show', !n);
  if (lib.list[lib.sel]) libView.focus = lib.list[lib.sel].appid;
  libRender();
}
function libLetters() {
  lib.at = -1;
  libRowEl.classList.add('instant');                 // a new set of letters lands in place (no slide)
  libRowEl.replaceChildren(...lib.letters.map((L, i) => {
    const li = document.createElement('li');
    li.className = 'lib-letter';
    li.setAttribute('role', 'tab');
    li.setAttribute('aria-label', `${L.ch === '#' ? 'Numbers and symbols' : L.ch}, ${L.n} game${L.n === 1 ? '' : 's'}`);
    li.style.setProperty('--i', i);
    const glyph = (cls) => `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><text class="glass" x="12" y="19">${L.ch}</text></svg>`;
    li.innerHTML = glyph('glow') + glyph('ico');
    li.addEventListener('click', () => { if (lib.open && !inputLocked()) libToLetter(i); });
    li.addEventListener('pointerenter', (ev) => { if (lib.open && i !== lib.at && !inputLocked()) hoverTick(ev); });
    return li;
  }));
}
const libLetterAt = (k) => { let i = 0; while (i + 1 < lib.letters.length && lib.letters[i + 1].start <= k) i += 1; return i; };

// A row for a game: made when it first comes near the focus, then kept for
// a while (its art stays loaded), the most recently used last.
function libThumb(g) {
  const it = findGame(g.appid);
  if (it) return gameThumb(it);                       // the same art GAMES shows
  const h = (g.appid * 47) % 360;                     // (the stand-in art's tones, as for GAMES)
  return gameThumb({ title: g.title, appid: g.appid, live: true, tones: [`hsl(${h} 55% 55%)`, `hsl(${(h + 200) % 360} 45% 18%)`], art: { thumb: headerArt(g.appid) } });
}
function libRowFor(g) {
  let e = lib.rows.get(g.appid);
  if (e && e.sig !== libSig(g)) { e.li.remove(); lib.rows.delete(g.appid); e = null; }   // installed since, or renamed
  if (e) { e.g = g; lib.rows.delete(g.appid); lib.rows.set(g.appid, e); return e; }
  const li = document.createElement('li');
  li.className = g.installed ? 'item game' : 'item game off';
  li.setAttribute('role', 'option');
  const thumb = document.createElement('div');
  thumb.className = 'thumb';
  // Held through the library, rows go by faster than their art could load:
  // they get it once the focus rests (see libArt).
  const racing = fastOn;
  thumb.appendChild(racing ? Object.assign(document.createElement('div'), { className: 'ph' }) : libThumb(g));
  if (!g.installed) thumb.insertAdjacentHTML('beforeend', `<span class="dl-mark" title="Not installed">${DL_SVG}</span>`);
  const glow = document.createElement('div');
  glow.className = 'glow';
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.innerHTML = `<div class="title">${esc(g.title)}</div><div class="sub"><span>${esc(libSub(g))}</span></div>`;
  li.append(thumb, glow, meta);
  e = { g, li, k: -1, sig: libSig(g), leave: 0, out: 0, art: !racing, at: 0 };
  const enter = (ev) => {
    clearTimeout(e.leave);
    if (!lib.open || inputLocked() || li.classList.contains('hover')) return;
    li.classList.add('hover');
    if (!li.classList.contains('focused')) hoverTick(ev);
  };
  const leave = () => { clearTimeout(e.leave); e.leave = setTimeout(() => li.classList.remove('hover'), 200); };
  for (const el of [thumb, meta]) {
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('click', () => libClick(e));
  }
  thumb.addEventListener('dblclick', () => {         // double-click: as Cross (a click only focuses, as in GAMES)
    if (lib.open && !inputLocked() && !e.out && lib.list[lib.sel] === e.g) libPick();
  });
  lib.rows.set(g.appid, e);
  return e;
}
// Lays out the rows near the focus and lights its letter. `dir` (a letter
// jumped): the rows that go leave that way and the new ones come in from
// the other side, if none of them stay.
function libRender(dir = 0) {
  const list = lib.list, sel = lib.sel, win = rowWin;
  const show = new Set();
  if (list.length) {
    const lo = Math.max(0, sel - win.above), hi = Math.min(list.length - 1, sel + win.below);
    for (let k = lo; k <= hi; k++) {
      const e = libRowFor(list[k]), delta = k - sel;
      e.k = k;
      show.add(e);
      e.li.style.setProperty('--delta', delta);
      e.li.classList.toggle('focused', delta === 0);
      e.li.classList.toggle('below', delta > 0);
      e.li.classList.toggle('above', delta < 0);
      e.li.setAttribute('aria-selected', String(delta === 0));
    }
  }
  const stays = [...show].filter((e) => e.li.isConnected && !e.out);
  const slide = dir && !stays.length && !fastOn ? (dir > 0 ? 'r' : 'l') : '';   // (held: they just change)
  for (const e of lib.shown) {
    if (show.has(e)) continue;
    e.li.classList.remove('hover');
    if (slide && e.li.isConnected && !e.out) {          // out to the side, then gone
      e.li.classList.add(slide === 'r' ? 'out-l' : 'out-r');
      e.out = setTimeout(() => libDrop(e), 320);
    } else if (!e.out) e.li.remove();
  }
  const first = stays[0];
  for (const e of show) {
    if (e.out) {                                       // on its way out, and wanted again: it stays
      clearTimeout(e.out); e.out = 0;
      e.li.classList.remove('out-l', 'out-r');
      continue;
    }
    if (e.li.isConnected) continue;
    e.at = performance.now();                          // (in the page since: see libArt)
    if (slide) e.li.dataset.in = slide; else delete e.li.dataset.in;   // (set before it goes in: its entrance plays once)
    if (first && e.k < first.k) libTrack.insertBefore(e.li, first.li);
    else libTrack.appendChild(e.li);
  }
  lib.shown = show;
  if (!lib.artTimer && [...show].some((e) => !e.art)) lib.artTimer = setTimeout(libArt, 120);
  // The letter of the focused game, on the axis.
  const at = list.length ? libLetterAt(sel) : -1;
  if (at !== lib.at) {
    const els = libRowEl.children;
    if (els[lib.at]) els[lib.at].classList.remove('active');
    if (els[at]) { els[at].classList.add('active'); els[at].setAttribute('aria-selected', 'true'); }
    lib.at = at;
    libRowEl.style.setProperty('--at', Math.max(0, at));
    if (libRowEl.classList.contains('instant')) { void libRowEl.offsetWidth; libRowEl.classList.remove('instant'); }
    const L = lib.letters[at];
    libCountEl.textContent = L ? `${L.n.toLocaleString('en-US')} game${L.n === 1 ? '' : 's'}` : '';
  }
  // Rows not used for a while are let go (the ones in the page never).
  if (lib.rows.size > LIB_ROWS_KEPT) {
    for (const [id, e] of lib.rows) {
      if (lib.rows.size <= LIB_ROWS_KEPT) break;
      if (show.has(e) || e.out) continue;
      e.li.remove();
      lib.rows.delete(id);
    }
  }
}
// Rows made while a direction is held get their art once they've stayed a
// moment (holding Down, each row stays on screen a while); rows that only
// flash by (holding Right through the letters) never load any.
function libArt() {
  lib.artTimer = 0;
  const now = performance.now();
  let later = false;
  for (const e of lib.shown) {
    if (e.art) continue;
    if (fastOn && now - e.at < 250) { later = true; continue; }
    e.art = true;
    const ph = e.li.querySelector('.thumb > .ph');
    if (ph) ph.replaceWith(libThumb(e.g));
  }
  if (later) lib.artTimer = setTimeout(libArt, 60);
}
function libDrop(e) {
  e.out = 0;
  e.li.classList.remove('out-l', 'out-r');
  if (!lib.shown.has(e)) e.li.remove();
}
function libAnnounce() {
  const g = lib.list[lib.sel];
  if (g) $('#announce').textContent = `${g.title}. ${libSub(g)}`;
}

// Moves the focus to row k; true when it moved.
function libSet(k, quiet = false, dir = 0) {
  const n = lib.list.length;
  if (!n) return false;
  k = clamp(k, 0, n - 1);
  if (k === lib.sel) return false;
  libEndHold();
  lib.sel = k;
  libView.focus = lib.list[k].appid;
  libRender(dir);
  libAnnounce();
  if (!quiet) Sound.tick();
  return true;
}
// The first game of letter i (Left / Right step one letter; a click on the
// focused letter goes back to its first game).
function libToLetter(i) {
  const L = lib.letters[i];
  if (!L) return false;
  if (i === lib.at) return libSet(L.start);
  const dir = Math.sign(i - lib.at);
  libSet(L.start, true, dir);
  Sound.tick();
  if (!fastOn) Sound.whoosh(dir);                    // (held: the ticks alone, or the swishes would run together)
  return true;
}
function libClick(e) {
  if (!lib.open || inputLocked() || e.out) return;
  const k = lib.list.indexOf(e.g);
  if (k >= 0 && k !== lib.sel) libSet(k);            // glides into the focus slot
}

function openLibrary() {
  if (lib.open || boot || dipping || session || (cold && !cold.ui)) return false;
  const t0 = performance.now();
  endLaunch(); closeInspector(true); closeDrawer('none'); closeLightbox(); deselectSearchBar(false);
  if (search.query && resetSearch()) render();
  clearTimeout(lib.clearTimer);
  lib.p = libraryData();
  if (!libFilters(lib.p).some((f) => f.id === libView.filter)) libView.filter = 'all';   // (a collection deleted, say)
  lib.open = true;
  lib.list = []; lib.sel = 0;
  libRefresh(libView.focus);
  root.classList.add('lib-open');
  libraryEl.setAttribute('aria-hidden', 'false');
  layoutLegend();
  libAnnounce();
  Sound.tick(); Sound.whoosh(1);
  tlog(`library: opened (${lib.p.games.length} games, ${lib.p.collections.length} collections, ${libFilterName()}, ${Math.round(performance.now() - t0)} ms)`);
  return true;
}
function closeLibrary(sound = true) {
  if (!lib.open) return false;
  lib.open = false;
  libEndHold();
  if (drawer.open && drawer.kind === 'libfilter') closeDrawer('none');
  root.classList.remove('lib-open');
  libraryEl.setAttribute('aria-hidden', 'true');
  saveLibView();                                     // (where it was, for next time)
  if ((search.query || osk.open || searchBar.sel) && resetSearch()) render();   // a search in the library ends with it
  layoutLegend();
  if (sound) { Sound.back(); Sound.whoosh(-1); }
  announce();
  clearTimeout(lib.clearTimer);
  lib.clearTimer = setTimeout(() => { if (!lib.open) libClear(); }, 450);   // once it has faded out, its rows go
  return true;
}
function libClear() {
  clearTimeout(lib.artTimer); lib.artTimer = 0;
  for (const e of lib.rows.values()) clearTimeout(e.out);
  libTrack.replaceChildren();
  lib.rows.clear(); lib.shown = new Set();
  lib.list = []; lib.p = null;
}
// Steam's library changed while it's open (a game installed, say).
function libReload() {
  if (!lib.open) return;
  const g = lib.list[lib.sel];
  lib.p = libraryData();
  if (!libFilters(lib.p).some((f) => f.id === libView.filter)) libView.filter = 'all';
  libRefresh(g ? g.appid : libView.focus, true);
}
// Circle: "Opening…" first, then a search, then back to GAMES.
function libBack() {
  if (lib.hold) { libEndHold(); Sound.back(); return true; }
  if (search.query) { clearSearch(); Sound.back(); return true; }
  return closeLibrary();
}
// Cross: an installed game plays (the launch sequence runs over the
// library, and GAMES moves to the game underneath, so it's there after the
// game); one that isn't installed opens Steam's install dialog.
function libPick() {
  const g = lib.list[lib.sel];
  if (!g || lib.hold || launch || boot || dipping) return false;
  libView.focus = g.appid;
  saveLibView();
  const it = findGame(g.appid);
  if (it && isGame(it)) {
    state.cat = 0;
    refreshLists();
    const k = cols[0].list.findIndex((e) => e.it === it);
    if (k >= 0) state.sel[0] = k;
    render();
    Sound.confirm();
    startBoot(it);
    launchGame(it);
    tlog('library: launching a game from the library');
    return true;
  }
  if (STEAM && STEAM.install(g.appid)) {
    Sound.confirm();
    libHold('Opening Steam’s install dialog…', 1600);
    if (watchSteamPages.check) watchSteamPages.check();   // Steam's dialog has the screen now
    return true;
  }
  libHold('Not available here');
  Sound.back();
  return false;
}
// The focused row's subtitle says something for a moment, then returns.
function libHold(text, ms = 2400) {
  libEndHold();
  const e = lib.rows.get((lib.list[lib.sel] || {}).appid);
  if (!e) return;
  const span = e.li.querySelector('.sub > span');
  lib.hold = { span, prev: span.textContent, timer: setTimeout(libEndHold, ms) };
  span.textContent = text;
  $('#announce').textContent = text;
}
function libEndHold() {
  if (!lib.hold) return;
  clearTimeout(lib.hold.timer);
  lib.hold.span.textContent = lib.hold.prev;
  lib.hold = null;
}
// Triangle: Show, in the options panel.
function openLibFilter() {
  if (!lib.open || drawer.open) return false;
  const items = libFilters(lib.p).map((f) => ({ ...f, on: f.id === libView.filter }));
  fillDrawer('libfilter', items);
  drawerEyebrow.textContent = 'Library';
  drawerGame.textContent = 'Show';
  const sel = Math.max(0, items.findIndex((f) => f.on));
  showDrawer(sel);
  $('#announce').textContent = `Show. ${items[sel].label}`;
  return true;
}
function libSetFilter(id) {
  if (!lib.open || id === libView.filter) return false;
  libView.filter = id;
  saveLibView();
  const g = lib.list[lib.sel];
  libRefresh(g ? g.appid : 0, true);                 // the same game if it's there, or where it would be
  libAnnounce();
  tlog(`library: showing ${libFilterName()} (${lib.list.length})`);
  return true;
}
const LIB_ACTIONS = {
  up: () => libSet(lib.sel - 1), down: () => libSet(lib.sel + 1),
  left: () => libToLetter(lib.at - 1), right: () => libToLetter(lib.at + 1),
  pageup: () => libSet(lib.sel - PAGE_ROWS), pagedown: () => libSet(lib.sel + PAGE_ROWS),
  select: libPick, back: libBack, options: openLibFilter, details: () => false,
};

function pageAct(b) {
  const act = b.dataset.act, appid = +b.dataset.appid || 0;
  if (act === 'dl-steam' || act === 'ss-steam') {     // Steam's own page, for everything else
    const which = act === 'dl-steam' ? 'downloads' : 'screenshots';
    closeInspector(true);
    if (STEAM && STEAM.open(which)) { Sound.confirm(); if (watchSteamPages.check) watchSteamPages.check(); }
    return;
  }
  if (act === 'dl-more') {
    const d = inspector.page;
    if (d && d.expanded) { d.expanded.add(b.dataset.key); const k = inspector.focus; fillPage(true); insFocus(k); Sound.tick(0.8); }
    return;
  }
  if (act === 'dl-play') {                                // a finished download: play it
    const g = findGame(appid);
    if (!g || !isGame(g) || session || boot) { Sound.back(); return; }
    closeInspector(true);
    Sound.confirm();
    startBoot(g);
    launchGame(g);
    return;
  }
  if (act.startsWith('dl-')) {
    const d = inspector.page;
    const what = act === 'dl-toggle' ? (d && d.paused ? 'resumeall' : 'pauseall') : act === 'dl-start' ? 'start' : act === 'dl-queue' ? 'queue' : act === 'dl-remove' ? 'remove' : '';
    if (what && STEAM && STEAM.downloadAction(what, appid)) {
      Sound.confirm();
      setTimeout(refreshDownloads, 250);
    } else Sound.back();
    return;
  }
  const p = inspector.page;
  if (!p || !p.groups) return;
  if (act === 'ss-more') {
    p.expanded.add(+b.dataset.g);
    const k = inspector.focus;
    fillPage(true);
    insFocus(k);                                       // the focus stays on the first new screenshot's button spot
    Sound.tick(0.8);
    return;
  }
  if (act === 'ss-shot') {
    const g = p.groups[+b.dataset.g];
    if (!g) return;
    const day = (t) => (t ? SHOT_DAY_FMT.format(new Date(t * 1000)) : '');
    openLightbox(g.shots.map((x) => ({ src: x.src, cap: [g.title, day(x.at)].filter(Boolean).join(' · ') })), +b.dataset.k);
  }
}

/* Lightbox: screenshots at full size, DLC art. Left / Right step through,
   Esc or a click outside the picture closes it.                            */
const lightboxEl = $('#lightbox'), lightboxImg = lightboxEl.querySelector('img'), lightboxCap = lightboxEl.querySelector('.cap');
const lightbox = { open: false, items: [], k: 0 };
function showLightboxItem(k) {
  lightbox.k = (k + lightbox.items.length) % lightbox.items.length;
  const item = lightbox.items[lightbox.k];
  lightboxImg.src = item.src;
  lightboxCap.innerHTML = `${esc(item.cap)}${lightbox.items.length > 1 ? `<span class="n">${lightbox.k + 1} / ${lightbox.items.length}</span>` : ''}`;
  lightboxEl.querySelectorAll('.nav').forEach((n) => { n.hidden = lightbox.items.length < 2; });
}
function openLightbox(items, k = 0) {
  if (!items.length) return false;
  lightbox.open = true;
  lightbox.items = items;
  showLightboxItem(k);
  lightboxEl.classList.add('open');
  lightboxEl.setAttribute('aria-hidden', 'false');
  Sound.tick();
  return true;
}
function closeLightbox(sound = false) {
  if (!lightbox.open) return false;
  lightbox.open = false;
  lightboxEl.classList.remove('open');
  lightboxEl.setAttribute('aria-hidden', 'true');
  if (sound) Sound.back();
  return true;
}
function stepLightbox(dir) {
  if (lightbox.items.length < 2) return false;
  showLightboxItem(lightbox.k + dir);
  Sound.tick();
  return true;
}
lightboxEl.addEventListener('click', (e) => {
  const nav = e.target.closest('.nav');
  if (nav) stepLightbox(nav.classList.contains('next') ? 1 : -1);
  else if (e.target !== lightboxImg) closeLightbox(true);
});
const LIGHTBOX_ACTIONS = {
  left: () => stepLightbox(-1), right: () => stepLightbox(1), up: () => false, down: () => false,
  pageup: () => false, pagedown: () => false,
  back: () => closeLightbox(true), select: () => closeLightbox(true), details: () => closeLightbox(true),
  mute: toggleMute, options: () => false, tint: cycleTint, ingame: () => false,
};
// The inspector with the D-pad or the arrow keys: a focus ring moves between
// its buttons, screenshots and DLC (to the nearest one that way), Cross or
// Enter presses it, L2 / R2 (Page Up / Down) go to the previous or next game,
// and Circle or Esc closes it. With nothing further up or down, Up and Down
// scroll the panel; a button far below is scrolled to first.
// The stops for the focus ring, in page order. On Downloads each row is one
// stop (its buttons are picked with Left / Right, see rowButtons).
const insTargets = () => [...inspectorBody.querySelectorAll(inspector.view === 'downloads' ? '[data-act]:not(.dl-row [data-act]), .dl-row' : '[data-act]')];
const rowButtons = (row) => [...row.querySelectorAll('[data-act]')];
function insFocus(k, scroll = true, sub = 0) {
  inspectorBody.querySelectorAll('.pad-focus, .pad-sub').forEach((el) => el.classList.remove('pad-focus', 'pad-sub'));
  const els = insTargets();
  inspector.focus = els.length ? clamp(k, 0, els.length - 1) : -1;
  const el = els[inspector.focus];
  if (!el) return;
  el.classList.add('pad-focus');
  if (el.classList.contains('dl-row')) {
    const bs = rowButtons(el);
    inspector.sub = bs.length ? clamp(sub, 0, bs.length - 1) : -1;
    if (bs[inspector.sub]) bs[inspector.sub].classList.add('pad-sub');
  } else inspector.sub = -1;
  if (scroll) insReveal(el);
}

// Scrolling follows the focus with a short glide that a new step simply
// re-aims (quicker while a direction is held), so a held direction never
// waits for the last scroll to finish. Each step is worked out from where
// the glide is heading, not where it happens to be.
const insGlide = { to: null, raf: 0, last: 0 };
const insScrollGoal = () => (insGlide.to === null ? inspectorBody.scrollTop : insGlide.to);
function insScrollTo(top) {
  const max = Math.max(0, inspectorBody.scrollHeight - inspectorBody.clientHeight);
  insGlide.to = clamp(top, 0, max);
  if (!insGlide.raf) { insGlide.last = performance.now(); insGlide.raf = requestAnimationFrame(insGlideStep); }
}
function insGlideStep(now) {
  const dt = Math.min(64, now - insGlide.last);
  insGlide.last = now;
  if (insGlide.to === null) { insGlide.raf = 0; return; }
  const tau = root.classList.contains('fast') ? 40 : 85;          // ms
  const cur = inspectorBody.scrollTop, next = insGlide.to + (cur - insGlide.to) * Math.exp(-dt / tau);
  if (Math.abs(insGlide.to - next) < 0.75) { inspectorBody.scrollTop = insGlide.to; insGlide.to = null; insGlide.raf = 0; return; }
  inspectorBody.scrollTop = next;
  insGlide.raf = requestAnimationFrame(insGlideStep);
}
function stopInsGlide() { insGlide.to = null; }
// Bring a stop into view, with a margin, from where the glide is going.
function insReveal(el) {
  const b = inspectorBody.getBoundingClientRect(), q = el.getBoundingClientRect();
  const goal = insScrollGoal(), h = inspectorBody.clientHeight, m = Math.min(80, h * 0.12);
  const top = q.top - b.top + inspectorBody.scrollTop, bottom = top + q.height;   // in the page's own coordinates
  if (top < goal + m) insScrollTo(top - m);
  else if (bottom > goal + h - m) insScrollTo(Math.min(top - m, bottom - h + m));
}
function insScroll(dir) {
  const goal = insScrollGoal(), max = inspectorBody.scrollHeight - inspectorBody.clientHeight;
  if ((dir === 'down' && goal >= max - 1) || (dir === 'up' && goal <= 0)) return false;
  insScrollTo(goal + (dir === 'down' ? 1 : -1) * inspectorBody.clientHeight * 0.45);
  return true;
}
// Up / Down go to the nearest line of stops that way (the closest stop on
// it across), so nothing in a list is ever skipped; Left / Right stay on
// the line. On a download row, Left / Right move between its buttons.
function insMove(dir) {
  const els = insTargets(), cur = els[inspector.focus];
  if (!cur) return els.length ? (insFocus(0), true) : insScroll(dir);
  const isRow = cur.classList.contains('dl-row');
  if (isRow && (dir === 'left' || dir === 'right')) {
    const bs = rowButtons(cur), k = inspector.sub + (dir === 'right' ? 1 : -1);
    if (k < 0 || k >= bs.length) return false;
    insFocus(inspector.focus, false, k);
    Sound.tick(0.6);
    return true;
  }
  const r = cur.getBoundingClientRect(), cy = r.top + r.height / 2;
  const cx = isRow ? r.left + Math.min(r.width * 0.2, 90) : r.left + r.width / 2;   // a row lines up from its art
  let best = -1;
  if (dir === 'up' || dir === 'down') {
    const down = dir === 'down', cand = [];
    els.forEach((el, k) => {
      if (k === inspector.focus) return;
      const q = el.getBoundingClientRect();
      if (!q.width || !q.height || (down ? q.top < r.bottom - 1 : q.bottom > r.top + 1)) return;
      cand.push({ k, q });
    });
    if (!cand.length) return insScroll(dir);
    const near = cand.reduce((a, c) => ((down ? c.q.top < a.q.top : c.q.bottom > a.q.bottom) ? c : a)).q;
    const line = cand.filter((c) => (down ? c.q.top < near.bottom - 1 : c.q.bottom > near.top + 1));
    best = line.reduce((a, c) => (Math.abs(c.q.left + c.q.width / 2 - cx) < Math.abs(a.q.left + a.q.width / 2 - cx) ? c : a)).k;
    // Far below (or above) the panel: scroll toward it first, so what's in
    // between is seen on the way.
    const q = els[best].getBoundingClientRect(), b = inspectorBody.getBoundingClientRect(), shift = insScrollGoal() - inspectorBody.scrollTop;
    const far = down ? q.bottom - shift > b.bottom + b.height * 0.5 : q.top - shift < b.top - b.height * 0.5;
    if (far && insScroll(dir)) return true;
  } else {
    let bestScore = Infinity;
    els.forEach((el, k) => {
      const q = el.getBoundingClientRect();
      if (k === inspector.focus || !q.width || !q.height) return;
      const x = q.left + q.width / 2, y = q.top + q.height / 2;
      let along;
      if (dir === 'right') { if (q.left < r.right - 1 || Math.abs(y - cy) > r.height) return; along = x - cx; }
      else { if (q.right > r.left + 1 || Math.abs(y - cy) > r.height) return; along = cx - x; }
      const score = along + Math.abs(y - cy) * 2;
      if (score < bestScore) { bestScore = score; best = k; }
    });
    if (best < 0) return false;
  }
  insFocus(best, true, 0);
  Sound.tick(0.6);
  return true;
}
function insPress() {
  const el = insTargets()[inspector.focus];
  if (el && el.classList.contains('dl-row')) {           // a download: its button under the ring
    const b = rowButtons(el)[inspector.sub];
    if (b) b.click(); else Sound.back();
    return true;
  }
  if (el) { el.click(); return true; }
  closeInspector(true);
  return select();
}
// While the inspector is open (anything not listed works as usual).
const INSPECTOR_ACTIONS = {
  up: () => insMove('up'), down: () => insMove('down'), left: () => insMove('left'), right: () => insMove('right'),
  // the previous / next game (the inspector follows), or a page of a page
  pageup: () => (inspector.view === 'game' ? setItem(state.sel[state.cat] - 1) : insScroll('up')),
  pagedown: () => (inspector.view === 'game' ? setItem(state.sel[state.cat] + 1) : insScroll('down')),
  back: () => closeInspector(),
  details: () => closeInspector(),
  select: insPress,
  options: openDrawer,
};

/* ═════════════════════════ Quick search (Ctrl + F or /) ═════════════════════════
   Filters the GAMES column as you type: games that don't match fade out and
   the rest close ranks around the 22vw / 41vh focus slot. Up / Down move
   through the results, Enter launches, Esc clears.                          */

const searchEl = $('#search'), searchInput = searchEl.querySelector('input');
const search = { query: '' };
function applySearch(q) {
  search.query = q;
  if (lib.open) { libRefresh((lib.list[lib.sel] || {}).appid); return; }   // the Library searches itself (games not installed too)
  if (state.cat !== 0) { state.cat = 0; Sound.whoosh(-1); }
  refreshLists();
  // In the in-game menu, Resume and Quit stay at the top of the results: the
  // focus moves down to the first matching game.
  const list = cols[0].list, cur = list[state.sel[0]];
  if (session && normText(q) && cur && cur.it.kind) {
    const k = list.findIndex((e) => !e.it.kind);
    if (k >= 0) state.sel[0] = k;
  }
  render();
  selectionChanged();
}
function openSearch() {
  if (boot || dipping || powering || ambient.on || (cold && !cold.ui) || (session && !session.menu)) return false;
  if (cold) endCold();                                // (the movie's last stage: it finishes at once)
  closeLightbox(); closeInspector(true); closeDrawer('none');
  deselectSearchBar(false);
  searchEl.classList.add('open');
  searchInput.focus({ preventScroll: true });
  searchInput.select();
  return true;
}
function blurSearch() {
  if (document.activeElement === searchInput) searchInput.blur();
}
function clearSearch() {
  searchInput.value = '';
  closeOsk(false);
  blurSearch();
  searchEl.classList.remove('open');
  if (search.query) applySearch('');
  return true;
}
// The same, without a sound or a move: the in-game menu opens and closes
// with no search left over. True when the column changed (the caller lays
// it out again).
function resetSearch() {
  closeOsk(false);
  deselectSearchBar(false);
  blurSearch();
  searchInput.value = '';
  searchEl.classList.remove('open');
  if (!search.query) return false;
  search.query = '';
  refreshLists();
  return true;
}
// Searching with a controller (R3, or Up at the top of GAMES): an on-screen
// keyboard under the search box. The D-pad moves, Cross types, Square
// deletes, Triangle adds a space, Options (or R3) is done, and Circle closes
// it; the results stay until Circle (Back) clears them. A keyboard types
// into it too.
const OSK = [
  [...'1234567890'].map((k) => ({ k })),
  [...'qwertyuiop'].map((k) => ({ k })),
  [..."asdfghjkl'"].map((k) => ({ k })),
  [...'zxcvbnm-:.'].map((k) => ({ k })),
  [{ k: ' ', label: 'Space', span: 4 }, { k: 'Backspace', label: 'Delete', span: 3 }, { k: 'Done', label: 'Done', span: 3 }],
];
const oskEl = $('#osk');
const osk = { open: false, r: 1, c: 0 };
oskEl.innerHTML = OSK.map((row, r) => `<div class="row">${row.map((cell, i) =>
  `<button class="frost key${cell.span ? ' wide' : ''}"${cell.span ? ` style="grid-column: span ${cell.span}"` : ''} data-r="${r}" data-i="${i}">${esc(cell.label || cell.k)}</button>`).join('')}</div>`).join('')
  + '<div class="osk-hints"><span>□ Delete</span><span>△ Space</span><span>☰ Done</span><span>○ Close</span></div>';
function oskCell(r, c) {                                // the key in row r over column c
  let col = 0;
  for (let i = 0; i < OSK[r].length; i++) { col += OSK[r][i].span || 1; if (c < col) return i; }
  return OSK[r].length - 1;
}
const oskColumn = (r, i) => OSK[r].slice(0, i).reduce((n, cell) => n + (cell.span || 1), 0);
function oskShow() {
  oskEl.querySelectorAll('.pad-focus').forEach((el) => el.classList.remove('pad-focus'));
  const el = oskEl.querySelector(`.key[data-r="${osk.r}"][data-i="${oskCell(osk.r, osk.c)}"]`);
  if (el) el.classList.add('pad-focus');
}
function oskMove(dir) {
  if (dir === 'up' || dir === 'down') {
    const r = clamp(osk.r + (dir === 'down' ? 1 : -1), 0, OSK.length - 1);
    if (r === osk.r) return false;
    osk.r = r;
  } else {
    const i = oskCell(osk.r, osk.c), n = clamp(i + (dir === 'right' ? 1 : -1), 0, OSK[osk.r].length - 1);
    if (n === i) return false;
    osk.c = oskColumn(osk.r, n);
  }
  oskShow();
  Sound.tick(0.5);
  return true;
}
function oskType(k) {
  if (k === 'Done') return oskDone();
  let v = searchInput.value;
  if (k === 'Backspace') { if (!v) return false; v = v.slice(0, -1); }
  else v += k;
  searchInput.value = v;
  applySearch(v);
  Sound.tick(0.7);
  return true;
}
const oskPress = () => oskType(OSK[osk.r][oskCell(osk.r, osk.c)].k);
function openOsk() {
  if (boot || dipping || (session && !session.menu)) return false;   // (the in-game menu searches too)
  closeLightbox(); closeInspector(true); closeDrawer('none');
  blurSearch();
  deselectSearchBar(false);
  osk.open = true;
  searchEl.classList.add('open', 'typing');
  oskEl.classList.add('open');
  oskEl.setAttribute('aria-hidden', 'false');
  layoutLegend();
  osk.r = 1; osk.c = 0;
  oskShow();
  $('#announce').textContent = 'Search. On-screen keyboard open.';
  Sound.tick(); Sound.whoosh(1);
  return true;
}
function closeOsk(sound = true) {
  if (!osk.open) return false;
  osk.open = false;
  oskEl.classList.remove('open');
  oskEl.setAttribute('aria-hidden', 'true');
  layoutLegend();
  searchEl.classList.remove('typing');
  if (!searchInput.value) searchEl.classList.remove('open');   // nothing typed: the box closes too
  if (sound) Sound.back();
  return true;
}
function oskDone() {                                    // the results stay; the D-pad goes back to them
  closeOsk(false);
  Sound.confirm();
  return true;
}
oskEl.addEventListener('click', (e) => {
  const b = e.target.closest('.key');
  if (!b) return;
  osk.r = +b.dataset.r;
  osk.c = oskColumn(osk.r, +b.dataset.i);
  oskShow();
  oskPress();
});
const OSK_ACTIONS = {
  up: () => oskMove('up'), down: () => oskMove('down'), left: () => oskMove('left'), right: () => oskMove('right'),
  select: oskPress, back: () => closeOsk(), tint: () => oskType('Backspace'), options: () => oskType(' '),
  ingame: oskDone, search: oskDone, pageup: () => false, pagedown: () => false, mute: toggleMute, details: () => false,
};
// The search bar is selected first (Up past the top of GAMES, or R3), and
// only pressing it opens it: Cross or Enter, or a click. From a controller
// (and any click in Big Picture) that's the on-screen keyboard; from a
// keyboard the box takes the typing, and so does typing a letter while it's
// selected. Down or Back leaves it. Ctrl + F and / still type straight away.
function selectSearchBar() {
  if (searchBar.sel || boot || dipping || (session && !session.menu)) return false;
  closeLightbox(); closeInspector(true); closeDrawer('none');
  blurSearch();
  searchBar.sel = true;
  searchEl.classList.add('selected');
  root.classList.add('search-focus');
  layoutLegend();
  $('#announce').textContent = 'Search. Press to type.';
  Sound.tick();
  return true;
}
function deselectSearchBar(sound = true) {
  if (!searchBar.sel) return false;
  searchBar.sel = false;
  searchEl.classList.remove('selected');
  root.classList.remove('search-focus');
  layoutLegend();
  if (sound) Sound.tick(0.6);
  return true;
}
function pressSearchBar(source) {
  deselectSearchBar(false);
  return source === 'key' ? openSearch() : openOsk();
}
const SEARCHBAR_ACTIONS = {
  select: pressSearchBar, search: pressSearchBar,
  down: () => deselectSearchBar(), back: () => deselectSearchBar(),
  up: () => false, left: () => false, right: () => false, pageup: () => false, pagedown: () => false,
  options: () => false, details: () => false,
};
// A click on the box: in Big Picture, or after controller use, the on-screen
// keyboard (no caret, so Steam's own keyboard stays away); otherwise the box
// takes the typing as usual.
const clickOpensOsk = () => IN_BPM || inputMode === 'pad';
searchEl.addEventListener('mousedown', (e) => { if (clickOpensOsk()) e.preventDefault(); });
searchEl.addEventListener('click', (e) => {
  if (!clickOpensOsk()) { deselectSearchBar(false); return; }
  e.preventDefault();
  deselectSearchBar(false);
  if (!osk.open) openOsk();
});
searchInput.addEventListener('focus', () => searchEl.classList.add('open'));
searchInput.addEventListener('blur', () => { if (!searchInput.value) searchEl.classList.remove('open'); });
searchInput.addEventListener('input', () => applySearch(searchInput.value));
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { e.preventDefault(); clearSearch(); Sound.back(); }
  else if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'PageDown' || e.key === 'PageUp') { e.preventDefault(); keyStep(e, KEYS[e.key]); }
  else if (e.key === 'Enter') { e.preventDefault(); if (lib.open) { blurSearch(); libPick(); } else if (isGame(current())) { blurSearch(); select(); } }
  else if (e.key === 'Tab') { e.preventDefault(); blurSearch(); }
  else if ((e.ctrlKey || e.metaKey) && (e.key === 'f' || e.key === 'F')) e.preventDefault();   // already searching
  e.stopPropagation();                                       // typing never drives the launcher
});

/* ═════════════════════════ Color engine (calendar + circadian) ═════════════════════════
   Auto mode (default): hue and saturation come from this month's palette and
   slide toward next month's as the month goes on (day 1 = this month, last day
   ≈ next month). Lightness follows a 24-hour curve: brightest at 12:00 PM,
   easing down to near-black obsidian from 10:00 PM to 5:00 AM. The canvas
   ribbons sit above the background, so they stay bright at night.
   T cycles Auto → Jan → … → Dec → Auto. A picked palette shows at its full
   daytime look, since Auto is the mode that follows the clock.              */

const PALETTES = [
  { month: 'Jan', name: 'Silver/Ice',        hue: 210, sat: 12 },
  { month: 'Feb', name: 'Warm Gold',         hue: 46,  sat: 78 },
  { month: 'Mar', name: 'Spring Chartreuse', hue: 88,  sat: 62 },
  { month: 'Apr', name: 'Soft Rose Pink',    hue: 338, sat: 65 },
  { month: 'May', name: 'Deep Emerald',      hue: 145, sat: 68 },
  { month: 'Jun', name: 'Soft Lavender',     hue: 268, sat: 55 },
  { month: 'Jul', name: 'Sky Cyan',          hue: 196, sat: 78 },
  { month: 'Aug', name: 'Deep Cobalt Blue',  hue: 222, sat: 82 },
  { month: 'Sep', name: 'Royal Violet',      hue: 282, sat: 68 },
  { month: 'Oct', name: 'Warm Amber/Orange', hue: 32,  sat: 82 },
  { month: 'Nov', name: 'Russet Bronze',     hue: 18,  sat: 65 },
  { month: 'Dec', name: 'Deep Crimson',      hue: 354, sat: 76 },
];
// Background lightness in % (center / edge of the radial gradient).
const LIGHT = { noonCenter: 24, noonEdge: 6.5, nightCenter: 4, nightEdge: 1.2 };

// 0 at night, 1 at noon: half-cosine rise 5:00 AM → 12:00 PM, fall 12:00 PM → 10:00 PM.
function daylight(d) {
  const h = d.getHours() + d.getMinutes() / 60;
  if (h >= 5 && h < 12) return 0.5 - 0.5 * Math.cos((Math.PI * (h - 5)) / 7);
  if (h >= 12 && h < 22) return 0.5 + 0.5 * Math.cos((Math.PI * (h - 12)) / 10);
  return 0;
}
// Signed shortest turn between two hues, in degrees (-180 … 180).
const hueTurn = (from, to) => ((((to - from) % 360) + 540) % 360) - 180;

function autoColor(d) {
  const m = d.getMonth(), a = PALETTES[m], b = PALETTES[(m + 1) % 12];
  const days = new Date(d.getFullYear(), m + 1, 0).getDate();
  const f = (d.getDate() - 1 + (d.getHours() + d.getMinutes() / 60) / 24) / days;
  return { hue: a.hue + hueTurn(a.hue, b.hue) * f, sat: a.sat + (b.sat - a.sat) * f, day: daylight(d) };
}

let colorMode = 0;               // 0 = Auto, 1–12 = Jan–Dec
let shownHue = null;             // kept unwrapped so every change turns the short way round
function applyColor(instant = false) {
  const c = colorMode === 0 ? autoColor(new Date()) : { ...PALETTES[colorMode - 1], day: 1 };
  shownHue = shownHue === null ? c.hue : shownHue + hueTurn(shownHue, c.hue);
  const lc = LIGHT.nightCenter + (LIGHT.noonCenter - LIGHT.nightCenter) * c.day;
  const le = LIGHT.nightEdge + (LIGHT.noonEdge - LIGHT.nightEdge) * c.day;
  const sat = c.sat * (0.55 + 0.45 * c.day);       // color recedes a little in the dark too
  if (instant) root.classList.add('instant');
  root.style.setProperty('--tg-theme-hue', shownHue.toFixed(2));
  root.style.setProperty('--tg-theme-sat', sat.toFixed(2));
  root.style.setProperty('--tg-bg-lc', lc.toFixed(2));
  root.style.setProperty('--tg-bg-le', le.toFixed(2));
  if (instant) { getComputedStyle(root).getPropertyValue('--tg-bg-lc'); root.classList.remove('instant'); }
}

const toastEl = $('#tint-toast');
let toastTimer = 0;
function toast(text) {
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

function cycleTint() {
  colorMode = (colorMode + 1) % 13;
  applyColor();
  const p = PALETTES[colorMode - 1];
  toast(colorMode === 0 ? 'Auto (Date/Time)' : `${p.month} · ${p.name}`);
  Sound.tick(0.7);
  return true;
}

/* ═════════════════════════ Input ═════════════════════════ */

const KEYS = {
  ArrowLeft: 'left', a: 'left', A: 'left',
  ArrowRight: 'right', d: 'right', D: 'right',
  ArrowUp: 'up', w: 'up', W: 'up',
  ArrowDown: 'down', s: 'down', S: 'down',
  Enter: 'select', Escape: 'back', Backspace: 'back',
  t: 'tint', T: 'tint',
  m: 'mute', M: 'mute',
  o: 'options', O: 'options', Tab: 'options',
  i: 'ingame', I: 'ingame', Home: 'ingame',
  b: 'coldboot', B: 'coldboot',
  ' ': 'details',
  PageUp: 'pageup', PageDown: 'pagedown',
};
const MOVES = new Set(['left', 'right', 'up', 'down', 'pageup', 'pagedown']);
const ACTIONS = {
  left: () => setCategory(state.cat - 1),
  right: () => setCategory(state.cat + 1),
  up: () => setItem(state.sel[state.cat] - 1),
  down: () => setItem(state.sel[state.cat] + 1),
  pageup: () => setItem(Math.max(0, state.sel[state.cat] - PAGE_ROWS)),
  pagedown: () => setItem(state.sel[state.cat] + PAGE_ROWS),
  select, back, tint: cycleTint, mute: toggleMute,
  options: () => (current() && current().friend ? openFriend(current()) : openDrawer()), ingame: toggleInGame, details: toggleInspector,
  search: () => false, coldboot: () => false,         // (see perform)
};
// Keycaps and controller badges that light up for each action (the D-pad
// badge lights for all four directions).
const legendEl = $('#legend');
const legendHits = {};
legendEl.querySelectorAll('[data-k]').forEach((el) => {
  for (const k of el.dataset.k.split(' ')) (legendHits[k] = legendHits[k] || []).push(el);
});
// Where you are, for the legend: the on-screen keyboard (which has its own
// hints, so the legend fades away), the selected search bar, an options list,
// the Game Inspector, or the menu. Separators stay only between hints that
// show. (legendReady: callers can run before this part of the script has.)
var legendReady = true;
// On a narrow screen (or a small window) the hints that are least needed
// make way, in the order of their data-drop (B Cold Boot first, then Mute,
// Color Tint, Category, the page keys, Options, Hold: Steam), until each row
// fits right of the cross with a margin to spare. Select, Back, Navigate and
// the in-game menu always stay.
const LEGEND_ROOM = 0.76;                // of the width: from the cross (22%) to 2% short of the edge
function layoutLegend() {
  if (!legendReady) return;
  const ctx = osk.open ? 'osk' : searchBar.sel ? 'bar' : drawer.open ? 'drawer' : lib.open ? 'lib' : inspector.open ? (inspector.view === 'game' ? 'ins' : 'page') : 'menu';
  root.dataset.ctx = ctx;
  const noCold = IN_OVERLAY || !!session;              // B (Cold Boot) is the launcher's, not the in-game menu's
  const room = root.clientWidth * LEGEND_ROOM;
  for (const row of legendEl.querySelectorAll('.row')) {
    const dropped = new Set();
    const apply = () => {
      let before = false, sep = null;
      for (const el of row.children) {
        if (el.classList.contains('sep')) { el.hidden = true; sep = el; continue; }
        const show = (!el.dataset.in || el.dataset.in.split(' ').includes(ctx)) && !(noCold && el.classList.contains('cold-hint')) && !dropped.has(el);
        el.hidden = !show;
        if (show) { if (before && sep) sep.hidden = false; before = true; sep = null; }
      }
    };
    apply();
    if (!room) continue;                                 // (hidden: laid out again when it shows)
    const order = [...row.querySelectorAll(':scope > .hint[data-drop]')].sort((a, b) => a.dataset.drop - b.dataset.drop);
    for (const h of order) {
      if (row.scrollWidth <= room) break;
      if (h.hidden) continue;
      dropped.add(h);
      apply();
    }
  }
}
function flash(action) {
  for (const el of legendHits[action] || []) {
    el.classList.add('hit');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('hit'), 170);
  }
}

// Nothing in the launcher reacts while a launch or quit plays out, while
// the game has the whole screen, or before the cold boot brings the cross in.
const inputLocked = () => !!(boot || dipping || powering || (session && !session.menu) || (cold && !cold.ui) || ambient.on);
// The cold boot, before its stage 4: these skip to it. During stage 4 these
// finish it at once first (they open things over the cross, or launch).
const COLD_SKIPS = new Set(['select', 'back', 'details']);
const COLD_ENDS = new Set(['select', 'details', 'options', 'ingame', 'search']);

// With Steam running, its desktop controller layout can turn the D-pad into
// arrow keys while the browser also sees the pad itself. Drop an action that
// arrives from the other source within 150ms of the same action so one press
// never moves twice.
const MIRROR_MS = 150;
let lastAct = { action: '', source: '', t: 0 };
// `repeat` is the pace of a held direction (ms per step), 0 for a single press.
function perform(action, source = 'key', repeat = 0) {
  const now = performance.now();
  const MIRRORS = ['key', 'pad', 'vgp'];
  const mirror = MIRRORS.includes(source) && MIRRORS.includes(lastAct.source);
  if (mirror && action === lastAct.action && source !== lastAct.source && now - lastAct.t < MIRROR_MS) return;
  lastAct = { action, source, t: now };
  if (source !== 'test') noteInput();
  if (ambientSwallows()) return;                                         // that press brought the menu back from the screensaver fade
  // Steam's screensaver is up: Steam itself wakes it on a press, and the
  // menu underneath waits for its word. (If that word never comes, a press
  // a moment later brings the menu back anyway.)
  if (ambient.saver) {
    if (!ambient.saverPress) ambient.saverPress = now;
    else if (now - ambient.saverPress > 1500) { tlog('screensaver: no word from Steam after a press, the menu comes back'); onScreensaver(false); }
    return;
  }
  if (powering) { if (action === 'back') { endPowerFade(); Sound.back(); } return; }   // the PC is going to sleep or shutting down
  if (boot || dipping) { if (action === 'mute') toggleMute(); return; }   // a launch or quit plays out in full
  if (session && !session.menu) {                                        // the running game has the screen
    if (action === 'ingame' || action === 'back') { flash(action); setMenu(true); }
    else if (action === 'mute') { flash(action); toggleMute(); }
    return;
  }
  if (action === 'coldboot') { if (!repeat) { flash(action); coldBoot('B'); } return; }   // B: the cold boot again, from the start
  if (cold) {
    if (action === 'mute') { flash(action); toggleMute(); return; }
    if (!cold.ui) { if (COLD_SKIPS.has(action) && !repeat) { flash(action); skipCold(); } return; }
    if (COLD_ENDS.has(action)) endCold();
  }
  if (repeat) { noteHoldStep(action); goFast(repeat); }
  flash(action);
  if (osk.open) { const f = OSK_ACTIONS[action]; if (f) f(); return; }
  if (searchBar.sel) {
    const f = SEARCHBAR_ACTIONS[action];
    if (f) { f(source); return; }
    if (action !== 'tint' && action !== 'mute') deselectSearchBar(false);       // anything else: back to the menu first
  }
  if (action === 'search') { selectSearchBar(); return; }
  if (action === 'up' && !repeat && !lightbox.open && !drawer.open && !inspector.open &&
      (lib.open ? lib.sel === 0 : state.cat === 0 && state.sel[0] === 0) && selectSearchBar()) return;   // Up past the top of GAMES (or Resume Game, or the Library's first game): the search bar
  if (lightbox.open) { const f = LIGHTBOX_ACTIONS[action]; if (f) f(); return; }
  if (drawer.open && DRAWER_ACTIONS[action]) DRAWER_ACTIONS[action]();
  else if (lib.open && LIB_ACTIONS[action]) LIB_ACTIONS[action]();
  else if (inspector.open && INSPECTOR_ACTIONS[action]) INSPECTOR_ACTIONS[action]();
  else ACTIONS[action]();
}

// While a direction is held, every move is short enough to finish before the
// next step, so the column keeps up and the focused item is always the one
// in the focus slot. The usual pace comes back a moment after the last step.
let fastTimer = 0, fastOn = false;
function goFast(step) {
  fastOn = true;
  root.classList.add('fast');
  root.classList.toggle('faster', step <= HOLD_FAST_STEP_MS);
  clearTimeout(fastTimer);
  fastTimer = setTimeout(endFast, step + 160);
}
function endFast() {
  clearTimeout(fastTimer);
  if (!fastOn) return;
  fastOn = false;
  root.classList.remove('fast', 'faster');
  syncInspector();                                   // it waits while the column is racing by
  reportHold();
}
// How a hold went, for Steam's log: its steps, how many found the focused
// item already settled in the focus slot (no move still running), and the
// frame times meanwhile (from the frame loop).
const holdStats = { steps: 0, landed: 0, t0: 0, frames: [] };
let lastHold = null;
function noteHoldStep(action = '') {
  if (!holdStats.steps) {
    // what was held, and where: for the log line
    const where = osk.open ? 'the keyboard' : drawer.open ? 'an options list' : lib.open ? `the Library${search.query ? ' (search)' : ''}` : inspector.open ? (inspector.view === 'game' ? 'Game Details' : inspector.view) : `${CATEGORIES[state.cat].label}${search.query ? ' (search)' : ''}`;
    Object.assign(holdStats, { landed: 0, t0: performance.now(), frames: [], what: `${action || 'a direction'} in ${where}` });
    ribbonCost();
  }
  holdStats.steps += 1;
  const e = lib.open ? lib.rows.get((lib.list[lib.sel] || {}).appid) : currentEntry();
  if (e && !e.li.getAnimations().some((a) => a.transitionProperty === 'top')) holdStats.landed += 1;
}
function reportHold() {
  if (!holdStats.steps) return;
  const f = holdStats.frames.slice().sort((a, b) => a - b), at = (q) => (f.length ? Math.round(f[Math.min(f.length - 1, Math.floor(f.length * q))]) : 0);
  lastHold = { steps: holdStats.steps, landed: holdStats.landed, ms: Math.round(performance.now() - holdStats.t0), frames: { median: at(0.5), p95: at(0.95), max: at(1) }, what: holdStats.what };
  const rib = ribbonCost();
  lastHold.ribbons = +rib.toFixed(2);
  tlog(`held (${lastHold.what}): ${lastHold.steps} repeats in ${(lastHold.ms / 1000).toFixed(1)} s, ${lastHold.landed} found the focus settled, frames ${lastHold.frames.median} / ${lastHold.frames.p95} / ${lastHold.frames.max} ms (median / 95th / max)` +
    (rib ? `, ribbons ${rib.toFixed(1)} ms per draw` : ''));
  holdStats.steps = 0;
}

// The legend follows the input: controller symbols after any controller
// input (or G), keyboard keys again after any other key press. Going back to
// keys waits a beat and is skipped if the controller was used just now, so
// Steam's keyboard copies of controller presses can't make it flicker.
let inputMode = 'keys', lastPadUse = -Infinity, toKeysTimer = 0;
function setInputMode(mode) {
  clearTimeout(toKeysTimer);
  if (mode === inputMode) return false;
  inputMode = mode;
  legendEl.classList.toggle('pad-mode', mode === 'pad');
  searchInput.placeholder = mode === 'pad' ? 'Search' : 'Search...';
  legendEl.querySelector(`.row.${mode} .tint-hint`).appendChild(toastEl);   // the color toast moves with it
  return true;
}
function keyboardUsed() {
  hideCursor();
  if (inputMode === 'keys') return;
  clearTimeout(toKeysTimer);
  toKeysTimer = setTimeout(() => { if (performance.now() - lastPadUse > MIRROR_MS) setInputMode('keys'); }, 120);
}

// The button symbols follow the controller in use: PlayStation shapes on a
// DualSense or DualShock, A B X Y on Xbox pads and the many that copy them,
// Nintendo's letters on a Switch pad, and the Steam Deck's names for its
// shoulders. Inside Steam it's the controller Steam says was used last,
// with Steam's own settings for it (STEAM.padKind); in a browser, the
// gamepad's name. Until a controller says otherwise: the PlayStation shapes.
const FACE_SHAPES = {
  Cross: '<path d="M2.6 2.6l6.8 6.8M9.4 2.6l-6.8 6.8" />',
  Circle: '<circle cx="6" cy="6" r="3.9" />',
  Triangle: '<path d="M6 2.2 9.9 8.95H2.1z" />',
  Square: '<rect x="2.7" y="2.7" width="6.6" height="6.6" rx="0.4" />',
};
const FACE_TEXT = { Cross: '✕', Circle: '○', Triangle: '△', Square: '□' };
const PAD_FAMILIES = {             // each family's names for the four face buttons, by place, and for its shoulders
  ps: { faces: { bottom: 'Cross', right: 'Circle', top: 'Triangle', left: 'Square' }, shoulders: ['L1', 'R1', 'L2', 'R2'] },
  xbox: { faces: { bottom: 'A', right: 'B', top: 'Y', left: 'X' }, shoulders: ['LB', 'RB', 'LT', 'RT'] },
  deck: { faces: { bottom: 'A', right: 'B', top: 'Y', left: 'X' }, shoulders: ['L1', 'R1', 'L2', 'R2'] },
  nintendo: { faces: { bottom: 'B', right: 'A', top: 'X', left: 'Y' }, shoulders: ['L', 'R', 'ZL', 'ZR'] },
};
const FACE_PLACE = { select: 'bottom', back: 'right', options: 'top', tint: 'left' };
const SWAPPED_PLACE = { bottom: 'right', right: 'bottom', top: 'left', left: 'top' };   // Steam's swapped (or Nintendo) layout
const DOT_AT = { top: [6, 2.3], right: [9.7, 6], bottom: [6, 9.7], left: [2.3, 6] };
let padLook = { family: 'ps', swap: false, universal: false };
const placeOfAction = (action, look) => (look.swap ? SWAPPED_PLACE[FACE_PLACE[action]] : FACE_PLACE[action]);
function faceGlyph(place, look) {
  const name = PAD_FAMILIES[look.family].faces[place];
  if (look.universal) {                              // Steam's universal symbols: the button's place among the four
    return { title: `${place[0].toUpperCase()}${place.slice(1)} button`, text: name.length === 1 ? name : FACE_TEXT[name],
      svg: `<svg class="dots" viewBox="0 0 12 12">${Object.entries(DOT_AT).map(([p, [x, y]]) => `<circle cx="${x}" cy="${y}" r="1.6"${p === place ? ' class="on"' : ''} />`).join('')}</svg>` };
  }
  if (FACE_SHAPES[name]) return { title: name, text: FACE_TEXT[name], svg: `<svg viewBox="0 0 12 12">${FACE_SHAPES[name]}</svg>` };
  return { title: name, text: name, svg: `<svg class="letter" viewBox="0 0 12 12"><text x="6" y="6.35" text-anchor="middle" dominant-baseline="middle">${name}</text></svg>` };
}
function drawPadLook() {
  const look = padLook;
  for (const btn of legendEl.querySelectorAll('.row.pad .btn[data-k]:not(.trig)')) {
    if (!FACE_PLACE[btn.dataset.k]) continue;
    const g = faceGlyph(placeOfAction(btn.dataset.k, look), look);
    btn.title = g.title;
    btn.innerHTML = g.svg;
  }
  const [l1, r1, l2, r2] = PAD_FAMILIES[look.family].shoulders;
  for (const btn of legendEl.querySelectorAll('.row.pad .btn.trig')) {
    const name = { pageup: l2, pagedown: r2, left: l1, right: r1 }[btn.dataset.k];
    if (name) { btn.textContent = name; btn.title = name; }
  }
  const hints = oskEl.querySelector('.osk-hints');
  if (hints) {
    const t = (action) => esc(faceGlyph(placeOfAction(action, look), look).text);
    hints.innerHTML = `<span>${t('tint')} Delete</span><span>${t('options')} Space</span><span>☰ Done</span><span>${t('back')} Close</span>`;
  }
  layoutLegend();
}
function setPadLook(kind, why = '') {
  if (!kind || !PAD_FAMILIES[kind.family]) return false;
  const look = { family: kind.family, swap: !!kind.swap, universal: !!kind.universal };
  const same = look.family === padLook.family && look.swap === padLook.swap && look.universal === padLook.universal;
  if (!same) { padLook = look; drawPadLook(); }
  if (!same || why) tlog(`buttons: ${look.family}${look.swap ? ', swapped' : ''}${look.universal ? ', universal symbols' : ''}${why}`);
  return !same;
}
// In a browser: the gamepad's name (Chromium adds the USB vendor: 054c Sony,
// 057e Nintendo, 28de Valve).
function padKindFromId(id) {
  const s = String(id || '');
  if (/054c|dualsense|dualshock|playstation/i.test(s)) return { family: 'ps' };
  if (/057e|nintendo|switch|joy-?con/i.test(s)) return { family: 'nintendo' };
  if (/steam deck|28de.{0,20}1205/i.test(s)) return { family: 'deck' };
  return { family: 'xbox' };
}
let padKindAt = -1e9, padKindLogged = false, lastPadId = '';
function readSteamPad() {                            // (at most once a second, on a controller press)
  const now = performance.now();
  if (!STEAM || now - padKindAt < 1000) return;
  padKindAt = now;
  const k = STEAM.padKind();
  if (!k) return;
  setPadLook(k, padKindLogged ? '' : ` (Steam's controller type ${k.type}${k.name ? `, "${k.name}"` : ''})`);
  padKindLogged = true;
}

// A held key: the keyboard's own repeats only say the key is still down, and
// the steps keep Tungsten's pace (see HOLD_* in Config).
let keyHold = { key: '', since: 0, next: 0 };
function keyStep(e, action) {
  const now = performance.now();
  if (!e.repeat) {
    keyHold = { key: e.key, since: now, next: now + HOLD_DELAY_MS };
    perform(action, 'key');
    return;
  }
  if (!MOVES.has(action)) return;                    // only movement repeats while held
  if (keyHold.key !== e.key) keyHold = { key: e.key, since: now - HOLD_DELAY_MS, next: now };   // held since before Tungsten saw it
  if (now < keyHold.next) return;
  const step = holdStep(now - keyHold.since);
  keyHold.next = nextBeat(keyHold.next, now, step);
  perform(action, 'key', step);
}
window.addEventListener('keyup', (e) => { if (e.key === keyHold.key) keyHold.key = ''; }, { capture: true });
window.addEventListener('blur', () => { keyHold.key = ''; });

const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'AltGraph', 'Meta', 'CapsLock', 'Fn']);
// Ctrl + Shift + X or F12 switch between Tungsten and Steam's own interface.
const isToggleKey = (e) => IN_STEAM && !e.altKey && !e.metaKey &&
  ((e.ctrlKey && e.shiftKey && (e.code === 'KeyX' || e.key === 'x' || e.key === 'X')) || (e.key === 'F12' && !e.ctrlKey && !e.shiftKey));

function onKeyDown(e) {
  if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === 'f' || e.key === 'F')) {   // Ctrl + F: search
    e.preventDefault();
    if (e.isTrusted) Sound.unlock();
    keyboardUsed();
    openSearch();
    return;
  }
  if (e.ctrlKey || e.metaKey || e.altKey || MODIFIER_KEYS.has(e.key)) return;
  if (e.shiftKey && e.key === 'Tab') return;         // Shift + Tab is Steam's overlay key
  if (e.isTrusted) Sound.unlock();                   // first real key press starts the audio
  if (osk.open && !e.repeat) {                       // a keyboard types into the on-screen keyboard's search
    if (e.key.length === 1) { e.preventDefault(); oskType(e.key.toLowerCase()); return; }
    if (e.key === 'Backspace') { e.preventDefault(); oskType('Backspace'); return; }
    if (e.key === 'Enter') { e.preventDefault(); oskDone(); return; }
  }
  if (osk.open && e.repeat && (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter')) { e.preventDefault(); return; }   // (a held letter types once, and never moves the keys)
  if (searchBar.sel && !e.repeat && e.key.length === 1 && e.key !== ' ') {   // a letter on the selected search bar: the box takes it
    keyboardUsed();
    pressSearchBar('key');                           // (the letter lands in the box, which has the focus now)
    return;
  }
  if (e.key === 'g' || e.key === 'G') {              // G: switch the legend by hand
    e.preventDefault();
    if (!e.repeat && setInputMode(inputMode === 'pad' ? 'keys' : 'pad')) Sound.tick(0.6);
    return;
  }
  keyboardUsed();
  if (e.key === '/') { e.preventDefault(); if (!e.repeat) openSearch(); return; }   // / : search
  const action = KEYS[e.key];
  if (!action) return;
  e.preventDefault();
  keyStep(e, action);
}
// Steam can open its own dialogs over Tungsten (they sit at z-index 1500 and
// up). While one of them has the focus, its keys and controller presses are
// left to it. Anything else outside Tungsten is hidden underneath it, except
// the title bar.
const isEditable = (t) => !!(t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || '')));
function steamOnTop(t) {
  if (!IN_STEAM || !t || !t.getBoundingClientRect || t === document.body || t === document.documentElement || inRoot(t)) return false;
  if (t.closest && t.closest('.title-area')) return false;
  const r = t.getBoundingClientRect();
  if (!r.width || !r.height) return false;
  const x = clamp(r.left + r.width / 2, 0, window.innerWidth - 1), y = clamp(r.top + r.height / 2, 0, window.innerHeight - 1);
  const hit = document.elementFromPoint(x, y);
  return !!hit && hit !== document.body && hit !== document.documentElement && !inRoot(hit) && (t.contains(hit) || hit.contains(t));
}
// Whatever Steam had focused underneath gives way, so keys come to Tungsten.
function takeFocus() {
  const a = document.activeElement;
  if (a && a !== document.body && !inRoot(a) && !steamOnTop(a) && a.blur) a.blur();
}

// Big Picture draws Steam's menu and Quick Access over Tungsten, each in a
// window of its own. While one is open, keys and controller presses are left
// to it, even when the Big Picture window still has the focus.
const steamMenuUp = () => IN_BPM && !!STEAM && STEAM.sideMenuOpen();

// Keys reach Tungsten one of two ways: from the window, when the focus is
// outside Tungsten (the usual case), or from the root, when something inside
// it has focus (the search box handles its own keys first). In Steam either
// path ends there, so the interface underneath never reacts to them.
window.addEventListener('keydown', (e) => {
  if (e.isTrusted && active) noteInput();             // (the screensaver's idle time, and its fade)
  if (isToggleKey(e)) {
    e.preventDefault(); e.stopImmediatePropagation();
    if (!e.repeat) toggleTungsten();
    return;
  }
  if (!active || inRoot(e.target) || steamOnTop(e.target) || steamMenuUp()) return;
  if (IN_STEAM) {
    e.stopPropagation();
    if (isEditable(e.target)) { e.preventDefault(); e.target.blur(); }   // a Steam text box under Tungsten is never typed into
  }
  onKeyDown(e);
}, { capture: true });
root.addEventListener('keydown', (e) => {
  if (!active || e.target === searchInput || steamMenuUp()) return;
  if (IN_STEAM) e.stopPropagation();
  onKeyDown(e);
});
if (IN_STEAM) {
  for (const type of ['keyup', 'keypress']) {
    window.addEventListener(type, (e) => { if (active && !inRoot(e.target) && !steamOnTop(e.target) && !isToggleKey(e) && !steamMenuUp()) e.stopPropagation(); }, { capture: true });
  }
  root.addEventListener('contextmenu', (e) => e.preventDefault());
}
window.addEventListener('pointerdown', (e) => { if (active && e.isTrusted) { Sound.unlock(); noteInput(); } }, { capture: true, passive: true });
// A click outside the open drawer or inspector just closes it (the click
// doesn't also act on what's underneath). Clicks outside Tungsten, on Steam's
// own title bar, are left alone.
window.addEventListener('click', (e) => {
  if (!active || !inRoot(e.target)) return;
  if (drawer.open && !drawerEl.contains(e.target)) { e.stopPropagation(); e.preventDefault(); closeDrawer(); return; }
  if (inspector.open && !inspectorEl.contains(e.target) && !lightboxEl.contains(e.target) &&
      !e.target.closest('#topbar, .actions [data-act="details"]')) {
    e.stopPropagation(); e.preventDefault(); closeInspector();
  }
}, { capture: true });

// Steam Input hands controller presses to its windows as vgp_ events (the
// in-game overlay, and the Steam window when it uses controller navigation).
// They do the same as the Gamepad API buttons, and Steam's own Guide and
// Quick Access buttons are left to Steam.
// View (13) is handled on its own: a short press mutes, holding it switches
// Tungsten on or off (see "On / off"), which also works while Tungsten is off.
const VGP_ACTIONS = {
  1: 'select', 2: 'back', 3: 'tint', 4: 'options', 5: 'left', 6: 'right', 7: 'pageup', 8: 'pagedown',
  9: 'up', 10: 'down', 11: 'left', 12: 'right', 14: 'ingame', 16: 'search',
};
const VGP_VIEW = 13;
const VGP_FROM_KEYBOARD = 2;         // detail.source: 1 controller, 2 Steam's keyboard simulator, 3 mouse
// Steam repeats a held D-pad direction (or the stick) by itself, every 50ms
// once it has been held for 400ms. Tungsten keeps its own pace instead (see
// HOLD_* in Config): Steam's repeats only say the direction is still held,
// and the steps come from the frame loop. If the repeats stop without a
// release (another window took the controller), the hold ends by itself.
const VGP_DIRECTIONS = new Set([9, 10, 11, 12]);
const VGP_HOLD_LOST_MS = 200;
const vgpHold = { button: 0, action: '', since: 0, beat: 0, next: 0, repeating: false };
let lastVgpPad = -Infinity;          // the last controller press Steam delivered here (see "Gamepad")
// A press Tungsten acted on stays Tungsten's until the button comes up: if it
// opened one of Steam's dialogs or pages (Power, Downloads), the release
// mustn't reach whatever Steam focused there (Power's first item is Suspend).
const pressTaken = new Set();
function vgpDirection(button, action, isRepeat) {
  const now = performance.now();
  if (!isRepeat) {                                   // a new press: one step now
    Object.assign(vgpHold, { button, action, since: now, beat: now, repeating: false });
    perform(action, 'vgp');
    return;
  }
  if (vgpHold.button !== button) Object.assign(vgpHold, { button, action, since: now - HOLD_DELAY_MS, repeating: false });   // held since before Tungsten saw it
  vgpHold.beat = now;
  if (!vgpHold.repeating) {                          // Steam's first repeat: the repeats start right here
    vgpHold.repeating = true;
    const step = holdStep(now - vgpHold.since);
    vgpHold.next = now + step;
    perform(action, 'vgp', step);
  }
}
function tickVgpHold(now) {
  if (!vgpHold.button || !vgpHold.repeating) return;
  if (!active || now - vgpHold.beat > VGP_HOLD_LOST_MS) { vgpHold.button = 0; return; }
  if (now < vgpHold.next) return;
  const step = holdStep(now - vgpHold.since);
  vgpHold.next = nextBeat(vgpHold.next, now, step);
  perform(vgpHold.action, 'vgp', step);
}
if (IN_STEAM) {
  const ours = (e) => active && !steamOnTop(e.target) && !steamMenuUp();
  const padUsed = () => { lastPadUse = lastVgpPad = performance.now(); setInputMode('pad'); hideCursor(); Sound.unlock(); lastInputAt = lastPadUse; readSteamPad(); };
  // Big Picture also turns key presses into these events (source 2, its
  // keyboard simulator). Tungsten already has the key itself, so such a copy
  // is only kept from Steam: no second step, and the legend stays on keys.
  const fromKeys = (e) => !!e.detail && e.detail.source === VGP_FROM_KEYBOARD;
  window.addEventListener('vgp_onbuttondown', (e) => {
    const button = e.detail && e.detail.button;
    if (active) noteInput();
    if (button === VGP_VIEW) {
      if (fromKeys(e)) { if (ours(e)) { e.stopPropagation(); e.preventDefault(); } return; }
      if (!e.detail.is_repeat) viewDown();
      if (ours(e)) { e.stopPropagation(); e.preventDefault(); padUsed(); }
      return;
    }
    const action = ours(e) && VGP_ACTIONS[button];
    if (!action) { pressTaken.delete(button); return; }
    e.stopPropagation(); e.preventDefault();
    pressTaken.add(button);
    if (fromKeys(e)) return;
    padUsed();
    if (VGP_DIRECTIONS.has(button)) vgpDirection(button, action, !!e.detail.is_repeat);
    else if (!e.detail.is_repeat) perform(action, 'vgp');
  }, { capture: true });
  window.addEventListener('vgp_onbuttonup', (e) => {
    const button = e.detail && e.detail.button;
    if (button === vgpHold.button) vgpHold.button = 0;
    const taken = pressTaken.delete(button);
    if (button === VGP_VIEW && !fromKeys(e) && !viewUpConsumed() && ours(e)) perform('mute', 'vgp');
    if ((ours(e) || taken) && button !== 27 && button !== 28) { e.stopPropagation(); if (taken) e.preventDefault(); }
  }, { capture: true });
  for (const type of ['vgp_onok', 'vgp_oncancel', 'vgp_onsecondaryaction', 'vgp_onoptions', 'vgp_onmenu', 'vgp_ondirection']) {
    window.addEventListener(type, (e) => {
      const button = e.detail && e.detail.button;
      if ((ours(e) || pressTaken.has(button)) && button !== 27 && button !== 28) e.stopPropagation();
    }, { capture: true });
  }
}

/* ═════════════════════════ Mouse ═════════════════════════
   Click any category or item to bring it into focus (with its sound).
   Hovering an unfocused one lifts it to 0.85 with a soft micro-tick.
   Hovering the focused game shows Play / Details; double-click launches;
   right-click opens its options. The wheel follows where the pointer is:
   top 32% of the screen (or Shift) = categories, below = the column, over
   the drawer or inspector = that panel.                                     */

const pointerAt = { x: NaN, y: NaN };
let lastHoverTick = -Infinity;
window.addEventListener('pointermove', (e) => {
  if (!active || e.pointerType === 'touch') return;
  if (e.isTrusted && (e.clientX !== pointerAt.x || e.clientY !== pointerAt.y)) noteInput();   // (a real move)
  pointerAt.x = e.clientX; pointerAt.y = e.clientY;
  if (!ambient.on) showCursor();
}, { passive: true });
// Only when the pointer itself moved onto something: entering events fire
// before the move is recorded, so a new position means real movement, and
// the same position means an item glided under a resting pointer.
function hoverTick(ev) {
  const now = performance.now();
  if (!ev || (ev.clientX === pointerAt.x && ev.clientY === pointerAt.y) || now - lastHoverTick < 45) return;
  lastHoverTick = now;
  Sound.hover();
}
function clickCategory(i) {
  if (inputLocked() || i === state.cat) return;
  setCategory(i);                                    // slides there, with the category sound
}
function itemClick(e) {
  if (inputLocked() || e.c !== state.cat) return;
  const j = cols[e.c].list.indexOf(e);
  if (j < 0) return;
  if (j !== state.sel[e.c]) setItem(j);              // glides into the focus slot, with the move sound
  else if (!isGame(e.it)) select();                  // focused app or in-game action opens on click
}
function wireItem(e, thumb, meta) {
  const enter = (ev) => {
    clearTimeout(e.leaveTimer);
    if (inputLocked() || e.c !== state.cat || e.li.classList.contains('gone') || e.li.classList.contains('hover')) return;
    e.li.classList.add('hover');
    if (!e.li.classList.contains('focused')) hoverTick(ev);
  };
  const leave = () => { clearTimeout(e.leaveTimer); e.leaveTimer = setTimeout(() => e.li.classList.remove('hover'), 200); };
  for (const el of [thumb, meta]) {
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('click', (ev) => { if (!ev.target.closest('.actions')) itemClick(e); });
    el.addEventListener('contextmenu', (ev) => {     // right-click a game (or an app): select it, open its options
      if (!isGame(e.it) && !isApp(e.it)) return;
      ev.preventDefault();
      if (inputLocked() || e.c !== state.cat) return;
      const j = cols[e.c].list.indexOf(e);
      if (j < 0) return;
      closeDrawer('none');
      setItem(j);
      openDrawer();
    });
  }
  thumb.addEventListener('dblclick', () => {         // double-click the focused game: launch
    if (!inputLocked() && isGame(e.it) && currentEntry() === e) select();
  });
  const actions = meta.querySelector('.actions');
  if (actions) actions.addEventListener('click', (ev) => {
    ev.stopPropagation();
    const b = ev.target.closest('[data-act]');
    if (!b || inputLocked() || currentEntry() !== e) return;
    b.blur();
    if (b.dataset.act === 'play') select(); else toggleInspector();
  });
}

let wheelX = 0, wheelY = 0, wheelLast = 0, wheelStep = 0;
window.addEventListener('wheel', (e) => {
  if (!active || !inRoot(e.target)) return;   // Steam's own title bar keeps its wheel
  if (e.ctrlKey) return;                             // browser zoom
  if (inspector.open && !lightbox.open && inspectorEl.contains(e.target)) {   // over the inspector: it scrolls, nothing else moves
    stopInsGlide();
    const sc = inspectorBody;
    if (sc.scrollHeight <= sc.clientHeight + 1) e.preventDefault();
    return;
  }
  e.preventDefault();
  if (e.isTrusted) noteInput();
  if (inputLocked()) return;
  const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? viewH() : 1;
  let dx = e.deltaX * unit, dy = e.deltaY * unit;
  const overDrawer = drawer.open && drawerEl.contains(e.target);
  const categoryZone = e.shiftKey || e.clientY - root.getBoundingClientRect().top < viewH() * 0.32;
  if (!dx && (lightbox.open || (!overDrawer && categoryZone))) { dx = dy; dy = 0; }
  const now = performance.now();
  if (now - wheelLast > 250) { wheelX = 0; wheelY = 0; }
  wheelLast = now;
  wheelX += dx; wheelY += dy;
  if (now - wheelStep < 70) return;
  if (Math.abs(wheelY) >= 50 && Math.abs(wheelY) >= Math.abs(wheelX)) {
    perform(wheelY > 0 ? 'down' : 'up', 'wheel'); wheelX = 0; wheelY = 0; wheelStep = now;
  } else if (Math.abs(wheelX) >= 50) {
    perform(wheelX > 0 ? 'right' : 'left', 'wheel'); wheelX = 0; wheelY = 0; wheelStep = now;
  }
}, { passive: false });

/* ═════════════════════════ Gamepad (Gamepad API, standard mapping) ═════════════════════════
   Polled once per animation frame with navigator.getGamepads().
   - D-pad (buttons 12–15) or left stick (axes 0 and 1, 0.45 deadzone):
     left/right = category, up/down = item, with the same sounds as the keys.
     A push moves once right away. Held, it repeats after a short pause, at
     the pace in Config (HOLD_*), so a slightly long press never moves twice.
     On the stick, the stronger axis wins, so a diagonal never moves both
     ways. LB/RB (4, 5) also change category, LT/RT (6, 7) jump a page.
   - Bottom face (0, Cross / A) = select or launch. Right face (1, Circle / B)
     = back, or close the drawer. Top face (3, Triangle / Y) = options drawer
     on/off. Left face (2, Square / X) = color tint. Home / Guide (16) or
     Menu (9) = in-game menu. View (8) mutes.
   Inside Steam, Steam Input normally hands the controller to its windows as
   vgp_ events (see above), and the Gamepad API can see the same controller
   too, whichever window has it. So there it only counts while this window
   has the focus and Steam hasn't delivered a controller press here for a
   while; otherwise Tungsten would move along with Steam's own menus.       */

const PAD_DEADZONE = 0.45;       // the stick counts as pushed past this
const PAD_RELEASE = 0.35;        // ...and as let go below this, so it can't flicker at the edge
const PAD_TRIGGER = 0.5;         // LT / RT count as pressed past this
const VGP_DEFERS_MS = 10000;     // Steam's controller events win for this long after the last one
const PAD_BUTTONS = [[0, 'select'], [1, 'back'], [3, 'options'], [2, 'tint'], [8, 'mute'], [9, 'ingame'], [16, 'ingame'], [6, 'pageup'], [7, 'pagedown'], [11, 'search']];
const pad = { dir: null, src: null, since: 0, next: 0, prev: [], active: false };
const padAllowed = (now) => !IN_STEAM || (document.hasFocus() && now - lastVgpPad > VGP_DEFERS_MS && !steamMenuUp());
let padIgnoredLog = -1e9, padIgnoredCount = 0;   // (logged a few times at most)

function firstGamepad() {
  if (!navigator.getGamepads) return null;
  for (const p of navigator.getGamepads()) if (p && p.connected) return p;
  return null;
}

function pollGamepad(now) {
  const gp = firstGamepad();
  if (!gp) { pad.dir = null; pad.src = null; pad.active = false; pad.prev = []; return; }
  const down = gp.buttons.map((btn, i) => !!(btn && (i === 6 || i === 7 ? btn.value > PAD_TRIGGER : btn.pressed)));
  const was = pad.prev || down;
  pad.prev = down;
  if (!padAllowed(now)) {                            // (the buttons' state is still tracked)
    if (!document.hasFocus() && down.some((d, i) => d && !was[i]) && now - padIgnoredLog > 5000 && padIgnoredCount < 3) {
      padIgnoredLog = now; padIgnoredCount += 1;
      tlog('controller press left alone: another window has the focus');
    }
    pad.dir = null; pad.src = null; pad.active = false;
    return;
  }
  const pressed = (i) => down[i] && !was[i];

  // Which way is it pointing? The D-pad (and LB/RB) first, then the left stick.
  const dp = { up: down[12], down: down[13], left: down[14] || down[4], right: down[15] || down[5] };
  const onDpad = dp.up || dp.down || dp.left || dp.right;
  let dir = null;
  if (onDpad) {
    dir = pad.dir && dp[pad.dir] ? pad.dir : ['up', 'down', 'left', 'right'].find((d) => dp[d]);
  } else {
    const x = gp.axes[0] || 0, y = gp.axes[1] || 0;
    const limit = pad.src === 'stick' ? PAD_RELEASE : PAD_DEADZONE;
    if (Math.max(Math.abs(x), Math.abs(y)) > limit) {
      let vertical = Math.abs(y) >= Math.abs(x);
      if (pad.src === 'stick') {                       // near a diagonal, keep the axis already in use
        const wasVertical = pad.dir === 'up' || pad.dir === 'down';
        if (vertical !== wasVertical && Math.abs(Math.abs(y) - Math.abs(x)) < 0.15) vertical = wasVertical;
      }
      dir = vertical ? (y < 0 ? 'up' : 'down') : (x < 0 ? 'left' : 'right');
    }
  }

  // Any use of the controller switches the legend to its symbols (and, in
  // Chromium, counts as the gesture that lets the sounds start).
  const sticks = Math.min(gp.mapping === 'standard' ? 4 : 2, gp.axes.length);
  let active = !!dir || down.some(Boolean);
  for (let i = 0; i < sticks && !active; i++) active = Math.abs(gp.axes[i]) > PAD_DEADZONE;
  if (active) {
    lastPadUse = now;
    lastInputAt = now;                                // (pushes that do something also go through noteInput)
    if (!pad.active || down.some((d, i) => d && !was[i])) { setInputMode('pad'); Sound.unlock(); hideCursor(); }
    if (IN_STEAM) readSteamPad();                     // (inside Steam the Gamepad API can see Steam's own virtual Xbox pad)
    else if (gp.id !== lastPadId) { lastPadId = gp.id; setPadLook(padKindFromId(gp.id)); }
  }
  pad.active = active;

  // Move: once on a new push, then at the hold pace while held.
  if (!dir) { pad.dir = null; pad.src = null; }
  else if (dir !== pad.dir) {
    pad.dir = dir; pad.src = onDpad ? 'dpad' : 'stick';
    pad.since = now;
    pad.next = now + HOLD_DELAY_MS;
    perform(dir, 'pad');
  } else {
    pad.src = onDpad ? 'dpad' : 'stick';
    if (now >= pad.next) {
      const step = holdStep(now - pad.since);
      pad.next = nextBeat(pad.next, now, step);
      perform(dir, 'pad', step);
    }
  }

  // Face buttons fire once per press. Inside Steam, View (8) mutes when it's
  // let go quickly; held, it switches Tungsten off (see "On / off").
  for (const [i, action] of PAD_BUTTONS) {
    if (IN_STEAM && i === 8) {
      if (pressed(8)) viewDown();
      else if (was[8] && !down[8] && !viewUpConsumed()) perform('mute', 'pad');
      continue;
    }
    if (pressed(i)) perform(action, 'pad');
  }
}
let lastPadFrame = 0;
function padLoop(now) {
  if (!loopsRunning) return;
  padRaf = requestAnimationFrame(padLoop);           // first, so stopLoops can always cancel it
  if (lastPadFrame) {
    if (fastOn) holdStats.frames.push(now - lastPadFrame);
    if (perfProbe.on) perfProbe.gaps.push(now - lastPadFrame);
  }
  lastPadFrame = now;
  pollGamepad(now);
  tickVgpHold(now);
  if (densityChanged()) onResize();                  // moved to a screen with another pixel density
}

// The pointer shows while the mouse is in use and hides as soon as the
// keyboard or a controller takes over (it's a TV UI and a desktop one).
function showCursor() { root.classList.remove('cursor-idle'); }
function hideCursor() { root.classList.add('cursor-idle'); }

/* ═════════════════════════ Layer 0 · harmonic phase-field ═════════════════════════ */

const field = $('#field');
const ctx = field.getContext('2d');
let W = 0, H = 0;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Silk ribbons, sampled every 8px from x = 0 to the right edge.
// Centerline: the upward diagonal (58vh at the left edge, 42vh at the right)
// plus a compound wave that rolls each ribbon into S-curve hills and valleys:
//     wave(x, t) = sin(x·0.003 + t)·45 + cos(x·0.007 − t·1.3)·25      (px)
// The upper and lower edges sit either side of the centerline on their own
// sines (independent frequencies and phases), so they keep crossing over;
// at each crossing the silk twists into a narrow, bright pinch.
// The highest edge at every x is the ridge crest: a crisp 1.5px glowing line,
// with the sheet fading from 0.12 alpha right under it to 0 at the lower edge.
const STEP = 8;                        // px between samples
const SPEED = 0.15;                    // wave time t advances 0.15 per second: a slow, unhurried drift
const DIAG = [0.58, 0.42];             // centerline y (fraction of H) at x = 0 and x = W
const THREADS = 10;                    // faint lines across each sheet
const RIBBONS = [
  { phase: [0, 0], lift: 0,
    upper: { base: 26, amp: 46, k: 0.0046, w: 0.83, p: 0.0 },
    lower: { base: 26, amp: 46, k: 0.0037, w: -1.07, p: 2.2 } },
  { phase: [2.4, 1.1], lift: 24,
    upper: { base: 24, amp: 44, k: 0.0041, w: 0.95, p: 4.1 },
    lower: { base: 30, amp: 48, k: 0.0052, w: -0.78, p: 1.0 } },
];
let DPR = 1, N = 0, XS = new Float32Array(0), BUF = [];    // sample columns + per-ribbon buffers
// The crest glow is a soft blur with no fine detail, so it renders into a
// half-resolution layer that is scaled up onto the canvas: same look, a
// fraction of the blur work every frame.
const SOFT = 0.5;
const soft = document.createElement('canvas');
soft.id = 'field-soft';
const sctx = soft.getContext('2d');

// Flow time: the seconds every moving part of the field follows (the waves,
// the bokeh's drift and twinkle). It's wall time since 2026, plus an offset
// for any stretch the ribbons ran faster, so Tungsten and its screensaver
// (another page, see build_screensaver.py) draw the very same frame at the
// same moment and can hand the ribbons over without a seam.
const FLOW_EPOCH = Date.UTC(2026, 0, 1);
// (The system clock, read every time: a page's own clock can fall behind it
// after the PC sleeps, and a page that just opened wouldn't agree.)
const wallFlow = (now) => (Date.now() - FLOW_EPOCH + (now - performance.now())) / 1000;
// The screensaver's ribbons ease from the menu's pace up to twice it over
// RAMP seconds. saverFlow(s): the flow seconds gained s seconds in.
const SAVER = { speed: 2, ramp: 3 };
function saverSpeed(s) {
  const x = Math.min(1, Math.max(0, s / SAVER.ramp));
  return 1 + (SAVER.speed - 1) * x * x * (3 - 2 * x);
}
function saverFlow(s) {
  if (s <= 0) return 0;
  const R = SAVER.ramp, x = Math.min(1, s / R);
  return (SAVER.speed - 1) * (R * (x * x * x - (x * x * x * x) / 2) + Math.max(0, s - R));
}

// The same 25 bokeh every time (a fixed seed), so both pages agree on them.
function seeded(seed) {
  return () => {
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = seeded(0x7a1c3);
const BOKEH = Array.from({ length: 25 }, () => ({
  x: rnd(), y: rnd(),                          // fractions of the viewport at flow time 0
  r: 1 + rnd() * 1.5,                          // radius 1px to 2.5px
  a: 0.15 + rnd() * 0.2,                       // opacity 0.15 to 0.35
  vx: (rnd() - 0.5) * 5,                       // px per second, drifting slowly
  vy: (rnd() - 0.5) * 3 - 1,
  tw: rnd() * Math.PI * 2,
}));
const wrapView = (v) => ((((v + 0.02) % 1.04) + 1.04) % 1.04) - 0.02;   // just past one edge comes back at the other

function resizeField() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = viewW(); H = viewH();
  field.width = Math.round(W * DPR); field.height = Math.round(H * DPR);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  soft.width = Math.max(1, Math.round(W * SOFT)); soft.height = Math.max(1, Math.round(H * SOFT));
  sctx.setTransform(SOFT, 0, 0, SOFT, 0, 0);
  N = Math.ceil(W / STEP) + 1;
  XS = new Float32Array(N);
  for (let i = 0; i < N; i++) XS[i] = i * STEP;
  BUF = RIBBONS.map(() => ({ u: new Float32Array(N), l: new Float32Array(N), top: new Float32Array(N), bot: new Float32Array(N) }));
}
// 1 at 900px+ tall and 1400px+ wide; below that, px sizes shrink in proportion.
// Layout scale (--ui). Exactly 1 from 1400×900 up to 1920×1080, so every px
// value is used as written. Smaller windows shrink in proportion so rows never
// collide (1280×720 → 0.8); bigger screens grow in proportion so nothing looks
// tiny (2560×1440 → 1.33, 3840×2160 → 2). Kept between 0.6 and 2.5.
function setUiScale() {
  const W = viewW(), H = viewH();
  const small = Math.min(1, H / 900, W / 1400);
  const large = Math.max(1, Math.min(W / 1920, H / 1080));
  UI = clamp(small < 1 ? small : large, 0.6, 2.5);
  root.style.setProperty('--ui', UI.toFixed(4));
  measureRows();
}
// The layout follows the root's size: the window, minus Steam's title bar.
// The pixel density counts too: moved to a screen with another scale, the
// window can keep its size in CSS pixels while the canvas needs new ones.
let lastSize = '', lastDpr = window.devicePixelRatio || 1;
function onResize() {
  const dpr = window.devicePixelRatio || 1;
  const size = `${viewW()}x${viewH()}@${dpr}`;
  if (!root.clientWidth || size === lastSize) return;  // hidden (off), or nothing changed
  lastSize = size;
  if (dpr !== lastDpr) { lastDpr = dpr; artCache.clear(); }   // (logos are drawn for the density they were made at)
  resizeField();                                     // a hidden canvas redraws when it's shown again
  setUiScale();
  render();
  if (lib.open) libRender();
  if (drawer.open) placeBar();
  layoutLegend();                                    // (what fits in the legend depends on the width)
}
window.addEventListener('resize', onResize);
if (window.ResizeObserver) new ResizeObserver(onResize).observe(root);
// (A density change alone doesn't always come with a resize event, so the
// controller loop, which runs every frame while Tungsten is on screen, also
// looks at it: see padLoop. Coming back on screen runs onResize too.)
const densityChanged = () => (window.devicePixelRatio || 1) !== lastDpr;
resizeField();
setUiScale();

// Fill one ribbon's sample buffers at wave time tt. `amp` scales the waves
// (the cold-start sweep runs them at 1.6).
function sampleRibbon(rb, b, tt, amp = 1) {
  const slope = ((DIAG[1] - DIAG[0]) * H) / W, y0 = DIAG[0] * H + rb.lift;
  const U = rb.upper, L = rb.lower;
  for (let i = 0; i < N; i++) {
    const x = XS[i];
    const c = y0 + slope * x
      + (Math.sin(x * 0.003 + tt + rb.phase[0]) * 45
      + Math.cos(x * 0.007 - tt * 1.3 + rb.phase[1]) * 25) * amp;
    const u = c - (U.base + U.amp * amp * Math.sin(x * U.k + tt * U.w + U.p));
    const l = c + (L.base + L.amp * amp * Math.sin(x * L.k + tt * L.w + L.p));
    b.u[i] = u; b.l[i] = l;
    b.top[i] = u < l ? u : l;               // highest edge = ridge crest
    b.bot[i] = u < l ? l : u;
  }
}
function polyline(c, ys) {
  c.moveTo(XS[0], ys[0]);
  for (let i = 1; i < N; i++) c.lineTo(XS[i], ys[i]);
}
// 1 · Sheet: 0.12 alpha just under the crest fading to 0 at the lower edge.
//     Drawn as one slim quad per 8px column, each with its own top-to-bottom
//     fade, so the fade hugs the curve wherever it rolls. Neighbouring quads
//     share their edges and add up exactly ('lighter'), so no seams. Every
//     column uses the same gradient (0 → 1 down the y axis), stretched onto
//     the column by a transform: y' = (y − top) / height. Same pixels as a
//     gradient per column, without making ~300 gradients every frame.
let SHEET = null;
function drawSheet(b) {
  if (!SHEET) {
    SHEET = ctx.createLinearGradient(0, 0, 0, 1);
    SHEET.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    SHEET.addColorStop(1, 'rgba(255, 255, 255, 0)');
  }
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = SHEET;
  for (let i = 0; i < N - 1; i++) {
    const t0 = b.top[i], t1 = b.top[i + 1], b0 = b.bot[i], b1 = b.bot[i + 1];
    if (b0 - t0 < 0.5 && b1 - t1 < 0.5) continue;            // pinched shut here
    const y = (t0 + t1) / 2, h = Math.max(0.5, (b0 + b1) / 2 - y);
    ctx.setTransform(DPR, 0, 0, DPR * h, 0, DPR * y);
    ctx.beginPath();
    ctx.moveTo(XS[i], (t0 - y) / h); ctx.lineTo(XS[i + 1], (t1 - y) / h); ctx.lineTo(XS[i + 1], (b1 - y) / h); ctx.lineTo(XS[i], (b0 - y) / h);
    ctx.closePath();
    ctx.fill();
  }
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

// Soft pass (half-resolution layer): the crest's glow.
function drawGlow(b) {
  // 2 · Crest glow: the 1.5px crest stroke with shadowBlur 12 and a white 0.6
  //     shadow. The stroke itself is drawn far off to the left and only its
  //     shadow is offset back into view; the crisp line is drawn at full
  //     resolution in the sharp pass. (Shadow sizes and offsets are in canvas
  //     pixels, so they're scaled to this layer.)
  const OFF = 20000;
  sctx.save();
  sctx.translate(-OFF, 0);
  sctx.lineWidth = 1.5;
  sctx.lineJoin = 'round';
  sctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  sctx.shadowBlur = 12 * SOFT;
  sctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
  sctx.shadowOffsetX = OFF * SOFT;
  sctx.beginPath(); polyline(sctx, b.top); sctx.stroke();
  sctx.restore();
}

// Sharp pass (full resolution): threads, the crisp crest line, pinch glints.
function drawSharp(b) {
  // 3 · Threads between the two edges. They converge wherever the silk twists,
  //     and since they add up ('lighter') the light piles into a pinch highlight.
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineWidth = 1;
  for (let k = 1; k < THREADS; k++) {
    const f = k / THREADS, rim = Math.pow(Math.abs(f - 0.5) * 2, 2);
    ctx.strokeStyle = `rgba(255, 255, 255, ${(0.016 + 0.022 * rim).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(XS[0], b.u[0] + (b.l[0] - b.u[0]) * f);
    for (let i = 1; i < N; i++) ctx.lineTo(XS[i], b.u[i] + (b.l[i] - b.u[i]) * f);
    ctx.stroke();
  }

  // 4 · Ridge crest: crisp 1.5px line along the highest edge (its glow is in
  //     the soft pass). It runs through every twist, so pinch points are lit too.
  ctx.globalCompositeOperation = 'source-over';
  ctx.lineWidth = 1.5;
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.beginPath(); polyline(ctx, b.top); ctx.stroke();

  // 5 · Specular glint where the sheet pinches (local minimum of its width),
  //     a soft streak lying along the ribbon.
  ctx.globalCompositeOperation = 'lighter';
  const pinch = 0.016 * H;
  for (let i = 1; i < N - 1; i++) {
    const w = Math.abs(b.l[i] - b.u[i]);
    if (w > 2.5 * pinch || w > Math.abs(b.l[i - 1] - b.u[i - 1]) || w >= Math.abs(b.l[i + 1] - b.u[i + 1])) continue;
    const glow = 0.22 * Math.exp(-w / pinch), r = 0.022 * H;
    ctx.save();
    ctx.translate(XS[i], (b.u[i] + b.l[i]) / 2);
    ctx.rotate(Math.atan2(b.top[i + 1] - b.top[i - 1], 2 * STEP));
    ctx.scale(3.2, 1);
    const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    rg.addColorStop(0, `rgba(255, 255, 255, ${glow.toFixed(3)})`);
    rg.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = rg;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

// One frame of the field at flow time F (seconds): the sheets and the crest
// glow, the glow layer scaled up over just the band the crests occupy (plus
// room for the blur), the threads, crests and glints, then the bokeh. `amp`
// scales the waves; `alpha` < 1 with clear = false lays a second, fainter
// frame over the first (a cross-fade between two flow times). Returns the
// band the ribbons cover, for any pass drawn on top.
function drawField(F, amp = 1, alpha = 1, clear = true) {
  const tt = F * SPEED;
  if (clear) ctx.clearRect(0, 0, W, H);
  sctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = alpha;
  let y0 = H, y1 = 0, yb = 0;
  RIBBONS.forEach((rb, k) => {
    const b = BUF[k];
    sampleRibbon(rb, b, tt, amp);
    for (let i = 0; i < N; i++) { if (b.top[i] < y0) y0 = b.top[i]; if (b.top[i] > y1) y1 = b.top[i]; if (b.bot[i] > yb) yb = b.bot[i]; }
    drawSheet(b);
    drawGlow(b);
  });
  y0 = Math.max(0, Math.floor(y0 - 40)); y1 = Math.min(H, Math.ceil(y1 + 40));
  if (y1 > y0) {
    ctx.globalCompositeOperation = 'lighter';
    ctx.drawImage(soft, 0, y0 * SOFT, W * SOFT, (y1 - y0) * SOFT, 0, y0, W, y1 - y0);
  }
  RIBBONS.forEach((rb, k) => drawSharp(BUF[k]));
  ctx.globalCompositeOperation = 'screen';
  for (const p of BOKEH) {
    const x = wrapView(p.x + (p.vx * F) / W), y = wrapView(p.y + (p.vy * F) / H);
    const a = clamp(p.a + 0.06 * Math.sin(F * 0.5 + p.tw), 0.15, 0.35);   // a slow twinkle (about 13 s)
    ctx.beginPath();
    ctx.arc(x * W, y * H, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${a.toFixed(3)})`;
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  return { top: y0, bottom: Math.max(y1, yb) };
}

/* Tungsten's flow clock: the shared clock (wallFlow) plus flow.off, the
   seconds its ribbons have run ahead. Anything that speeds them up for a
   while adds to it: the cold-start sweep (which starts behind by exactly
   what it gains, so it ends back on the shared clock), the screensaver
   (mirrored while it's up, see "Screensaver"), and the easing back to the
   menu's pace after it. Whenever nobody can see the ribbons (game art over
   them, Tungsten out of sight) the offset quietly goes back to 0 (see
   settleFlow), so the screensaver always finds them where it expects.     */
const smooth = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const flow = {
  off: 0,
  saver: null,              // { at, off }: mirroring the screensaver's ramp from `at` (ms)
  ease: null,               // { at, v, ms }: easing from speed v back to 1
  fade: null,               // { at, from, ms }: cross-fading from `from` seconds ahead onto the shared clock
  at: -1,                   // the last time the offset was brought up to date (ms)
};
function flowAt(now) {
  if (reduceMotion) return 0;
  const dt = flow.at < 0 ? 0 : Math.min(0.25, Math.max(0, (now - flow.at) / 1000));
  flow.at = now;
  if (flow.saver) return wallFlow(now) + flow.saver.off + saverFlow((now - flow.saver.at) / 1000);
  if (flow.ease) {
    const x = (now - flow.ease.at) / flow.ease.ms;
    if (x >= 1) flow.ease = null;
    else flow.off += (flow.ease.v - 1) * (1 - smooth(x)) * dt;
  }
  return wallFlow(now) + flow.off;
}
// Nobody can see the ribbons: they go back onto the shared clock.
function settleFlow() {
  if (flow.saver || coldBoost(performance.now()) > 0) return;
  flow.off = 0; flow.ease = null; flow.fade = null;
}

// The ribbons drift slowly (a crest moves well under a pixel per frame), so
// they're drawn about 30 times a second, with the frames in between left
// free for the menus. Nothing assumes a refresh rate: the screen's frame
// interval is measured as it runs (it changes when the window moves to
// another monitor), and the ribbons are drawn on every Nth frame, N being
// the whole number of frames closest to 1/30 s (2 at 60 Hz, 4 at 120 or
// 130, 5 at 144, 8 at 240), so they keep an even beat on any screen. A launch
// surge (it follows a CSS animation) and the cold-start sweep draw every
// frame.
const FIELD_MS = 1000 / 30;
const FIELD_FADE_MS = 400;         // the ribbons' fade-out as a game's session starts (320 ms in the CSS)
let lastFrame = -1e9;
let frameGap = 1000 / 60, lastTick = 0;
function noteFrame(now) {
  const d = now - lastTick;
  lastTick = now;
  if (d > 2 && d < 50) frameGap += (d - frameGap) * 0.05;   // (a stall, or the first frame back, doesn't count)
}
const fieldDue = (now) => now - lastFrame >= (Math.max(1, Math.round(FIELD_MS / frameGap)) - 0.5) * frameGap;
const drawn = { at: 0, F: 0 };     // the last frame: when, and at what flow time (for the tests)
function frame(now) {
  if (!loopsRunning) return;
  fieldRaf = requestAnimationFrame(frame);         // first, so stopLoops can always cancel it
  noteFrame(now);
  const sw = sweepAt(now), k = sw.k;
  const busy = !!boot || k > 0;                    // (even at twice the pace a crest moves under a pixel a frame at 30 fps)
  if (fieldOccluded || (!busy && !fieldDue(now))) return;
  // In-game there are no ribbons: once they've faded out (a beat after the
  // in-game menu comes up), nothing is drawn until the game is over.
  if (session && !boot && now - session.at > FIELD_FADE_MS) return;
  lastFrame = now;
  const t0 = performance.now();
  const F = flowAt(now) + (reduceMotion ? 0 : sw.gain), amp = 1 + COLD.amp * k;
  drawn.at = now; drawn.F = F;
  let band;
  if (flow.fade) {
    const x = (now - flow.fade.at) / flow.fade.ms;
    if (x >= 1) { flow.fade = null; band = drawField(F, amp); }
    else { const w = smooth(x); drawField(F + flow.fade.from, amp, 1 - w); band = drawField(F, amp, w, false); }
  } else band = drawField(F, amp);
  // Launch surge and the cold start's glow. Everything here is white light on
  // a transparent canvas, which a CSS brightness() filter leaves unchanged,
  // so the canvas brightens itself: the ribbon band is added onto itself at
  // (gain − 1), which makes those pixels exactly `gain` times as bright.
  let gain = 1;
  if (boot) { const m = /brightness\(([\d.]+)\)/.exec(getComputedStyle(field).filter); gain = m ? +m[1] : 1; }
  else if (k > 0) gain = 1 + COLD.glow * k;
  const top = Math.floor(band.top * DPR), bottom = Math.min(field.height, Math.ceil((band.bottom + 40) * DPR));
  if (gain > 1.001 && bottom > top) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, gain - 1);
    ctx.drawImage(field, 0, top, field.width, bottom - top, 0, top, field.width, bottom - top);
    ctx.restore();
  }
  // The cold start's soft focus: blur(3px) easing to none with the sweep.
  const blur = k > 0.002 && !reduceMotion ? `blur(${(COLD.blur * k).toFixed(2)}px)` : '';
  if (field.style.filter !== blur) field.style.filter = blur;
  const ms = performance.now() - t0;
  drawStats.n += 1; drawStats.ms += ms;
  if (perfProbe.on) perfProbe.draws.push(ms);
}

// The ribbons and the controller polling run only while Tungsten is on
// screen: switched off, or with the window minimized, they cost nothing.
// Stopping cancels the frame each loop has asked for. (A window that's
// hidden doesn't get frames at all, so a loop that only checked a flag
// could still be waiting when the window came back, and run twice from
// then on: a second copy for every game played.)
let loopsRunning = false, fieldRaf = 0, padRaf = 0;
function startLoops() {
  if (loopsRunning) return;
  loopsRunning = true;
  lastFrame = -1e9;
  lastPadFrame = 0;
  if (!IN_OVERLAY) fieldRaf = requestAnimationFrame(frame);   // (no ribbons in the in-game overlay: see "In-game")
  pad.prev = null;                                  // a button already held when Tungsten comes back isn't a new press
  padRaf = requestAnimationFrame(padLoop);
}
function stopLoops() {
  loopsRunning = false;
  cancelAnimationFrame(fieldRaf);
  cancelAnimationFrame(padRaf);
}

// Numbers for Steam's log, to judge the real PC (webhelper_js.txt):
// - after each hold (see reportHold): how long a ribbon frame took to draw
// - once, 20 seconds after Tungsten starts: 5 seconds of frames as they
//   come (the screen's refresh rate, and how often a frame ran late) and the
//   ribbon draws meanwhile.
const drawStats = { n: 0, ms: 0 };
const perfProbe = { on: false, done: false, gaps: [], draws: [] };
function ribbonCost() {
  const avg = drawStats.n ? drawStats.ms / drawStats.n : 0;
  drawStats.n = 0; drawStats.ms = 0;
  return avg;
}
function startPerfProbe() {
  if (perfProbe.done || perfProbe.on || !active) return;
  perfProbe.on = true; perfProbe.gaps = []; perfProbe.draws = [];
  setTimeout(() => {
    perfProbe.on = false;
    const g = perfProbe.gaps.slice().sort((a, b) => a - b), d = perfProbe.draws.slice().sort((a, b) => a - b);
    if (g.length < 30) return;                         // stepped aside meanwhile: try again next time
    perfProbe.done = true;
    const at = (a, q) => (a.length ? a[Math.min(a.length - 1, Math.floor(a.length * q))] : 0);
    const hz = Math.round(1000 / at(g, 0.5)), late = g.filter((x) => x > at(g, 0.5) * 1.5).length;
    tlog(`perf: ${hz} Hz, ${late} of ${g.length} frames late (95th ${at(g, 0.95).toFixed(1)} ms, max ${at(g, 1).toFixed(1)} ms), ` +
      (d.length ? `ribbons ${at(d, 0.5).toFixed(1)} ms to draw (95th ${at(d, 0.95).toFixed(1)} ms, ${d.length} draws)` : IN_OVERLAY ? 'no ribbons in-game' : 'ribbons not drawn (art up)'));
  }, 5000);
}

/* ═════════════════════════ Status clock ═════════════════════════ */

// The spinner by the date shows only while Steam is downloading something
// (its tooltip says what); clicking it then opens the Downloads page.
const statusEl = $('#status');
let statusBusy = false;
function updateStatus() {
  const d = STEAM && active ? STEAM.downloading() : null;
  if (!!d !== statusBusy) {
    statusBusy = !!d;
    statusEl.classList.toggle('busy', statusBusy);
    statusEl.setAttribute('aria-label', statusBusy ? 'Date and time. Downloading.' : 'Date and time');
  }
  const g = d && findGame(d.appid);
  statusEl.title = d ? `Downloading${g ? ` ${g.title}` : ''}: ${Math.floor(d.pct)}%` : '';
}
statusEl.addEventListener('click', () => { if (statusBusy && !inputLocked()) openPage('downloads'); });


const clockEl = $('#clock');
let lastMinute = -1;
function tick() {
  const d = new Date();
  const h = d.getHours() % 12 || 12, m = String(d.getMinutes()).padStart(2, '0');
  const text = `${d.getMonth() + 1}/${d.getDate()}  ${h}:${m} ${d.getHours() < 12 ? 'AM' : 'PM'}`;
  if (clockEl.textContent !== text) clockEl.textContent = text;   // (once a minute: nothing to redraw in between)
  // Auto color follows the clock: re-evaluate once a minute (it glides, never jumps).
  if (d.getMinutes() !== lastMinute) {
    if (lastMinute !== -1 && colorMode === 0) applyColor();
    lastMinute = d.getMinutes();
  }
  setTimeout(tick, 1000 - d.getMilliseconds() + 20);
}
applyColor(true);               // start in Auto, without a sweep from the CSS defaults
tick();

/* ═════════════════════════ On / off (Steam) ═════════════════════════
   Ctrl + Shift + X, F12, holding the controller's View button, or the
   small cross button in Steam's title bar switch between Tungsten and
   Steam's own interface at any time. The choice is remembered, and the main
   window, Big Picture and the overlay follow each other. In the main window
   Tungsten sits just under Steam's title bar, so Steam's menus and window
   buttons stay where they are.                                              */

const toggleBtn = (() => {
  if (HOST.role !== 'main') return null;
  const b = document.createElement('div');
  b.id = 'tungsten-toggle';
  b.setAttribute('role', 'button');
  b.setAttribute('aria-label', 'Switch between Tungsten and the Steam interface');
  b.title = 'Tungsten  (Ctrl + Shift + X  or  F12)';
  b.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.75v12.5M1.75 8h12.5"/><circle cx="8" cy="8" r="2.15"/></svg>';
  b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); toggleTungsten(); });
  b.addEventListener('mousedown', (e) => e.stopPropagation());
  return b;
})();
// Into the title bar next to the window buttons (or floating at the top right
// if Steam's title bar isn't found), and Tungsten's top edge just below it.
function placeToggle() {
  if (!toggleBtn) return;
  let group = document.querySelector('.title-bar-actions.window-controls') || document.querySelector('.title-bar-actions');
  if (group && !group.getClientRects().length) group = null;            // hidden in this layout
  if (group) {
    if (toggleBtn.parentNode !== group) group.appendChild(toggleBtn);   // a row-reverse flex row: last = leftmost
    toggleBtn.classList.remove('floating');
  } else if (!toggleBtn.isConnected || !toggleBtn.classList.contains('floating')) {
    toggleBtn.classList.add('floating');
    document.body.appendChild(toggleBtn);
  }
  const r = group && group.getBoundingClientRect();
  const top = r && r.height ? Math.round(clamp(r.bottom, 0, 72)) : 0;
  if (root.style.top !== `${top}px`) { root.style.top = `${top}px`; onResize(); }
}

function readEnabled() { try { return localStorage.getItem('tungsten.enabled') !== '0'; } catch (e) { return true; } }
function setEnabled(on, remember = true) {
  enabled = on;
  if (!on && IN_OVERLAY) hideInGameMenu();           // the overlay goes back to Steam's
  if (remember) { try { localStorage.setItem('tungsten.enabled', on ? '1' : '0'); } catch (e) { /* storage unavailable */ } }
  root.classList.toggle('off', !on);
  if (toggleBtn) {
    toggleBtn.classList.toggle('on', on);
    toggleBtn.setAttribute('aria-pressed', String(on));
  }
  updateActive();
}
// The switch always brings Tungsten up when it isn't showing, even over one
// of Steam's own pages (it steps aside again on the next page).
function toggleTungsten() {
  if (enabled && !active && watchSteamPages.check) {
    showOverPage();
    if (active) { tlog('shown over a Steam page'); Sound.unlock(); Sound.tick(); Sound.whoosh(1); return; }
  }
  // In a game's overlay the switch is for that game's menu only: it isn't
  // remembered, and Big Picture (which shares the setting) keeps Tungsten.
  setEnabled(!enabled, !IN_OVERLAY);
  tlog(enabled ? 'switched on' : 'switched off');
  if (enabled && watchSteamPages.check) showOverPage();
  if (enabled) { Sound.unlock(); Sound.tick(); Sound.whoosh(1); }
}
function showOverPage() {
  if (HOST.role === 'main') STEAM.showLibrary();     // the store's browser view would cover Tungsten
  if (IN_OVERLAY) { if (session && !inGameUp) showInGameMenu('switched on'); STEAM.closeSideMenus(); }
  shownOver = steamPage();
  watchSteamPages.check();
}

// Holding the controller's View button (Create on a DualSense, the small one
// left of center) switches too, so a controller alone can do it. It takes a
// deliberate hold, shown filling up under "Hold: Steam", since games use that
// button as well. A short press still mutes. Steam can report one press twice
// (its own controller events and the Gamepad API), so a release right after
// another one counts as the same press. A hold whose release never arrives
// (the window lost the controller) is let go after a while.
const VIEW_HOLD_MS = 1200;
const VIEW_HOLD_LOST_MS = 4000;
let viewHeld = null, lastViewUp = { t: -1e9, consumed: false };
const steamHints = [...legendEl.querySelectorAll('.hint.steam-hint')];
function viewHolding(on) {
  for (const el of steamHints) {
    el.style.setProperty('--hold', `${VIEW_HOLD_MS}ms`);
    el.classList.toggle('holding', on);
  }
}
function viewDown() {
  if (viewHeld) {
    if (performance.now() - viewHeld.at < VIEW_HOLD_LOST_MS) return;
    viewUpConsumed();                    // the last one never came up: this is a new press
  }
  viewHolding(true);
  // (A press that just brought the menu back from the screensaver fade
  // doesn't also mute when it comes up.)
  viewHeld = { at: performance.now(), consumed: false, woke: ambientSwallows(), timer: setTimeout(() => {
    if (!viewHeld) return;
    viewHeld.consumed = true;
    viewHolding(false);
    flash('steam');
    toggleTungsten();
  }, VIEW_HOLD_MS) };
}
function viewUpConsumed() {              // true: the press already did something (switched), so no mute
  const now = performance.now();
  if (!viewHeld) return now - lastViewUp.t < 300;
  clearTimeout(viewHeld.timer);
  viewHolding(false);
  lastViewUp = { t: now, consumed: viewHeld.consumed || viewHeld.woke };
  viewHeld = null;
  return lastViewUp.consumed;
}

let away = false;               // one of Steam's own pages, dialogs or menus has the screen
let under = false;              // ...one of Steam's menus: Tungsten stays drawn underneath it, without the input
function updateActive() {
  root.classList.toggle('away', away && !under);
  root.classList.toggle('under', away && under);
  const now = enabled && !away && document.visibilityState !== 'hidden';
  if (now === active) return;
  active = now;
  if (active) {
    if (powering && powering.item.id === 'sleep') endPowerFade();   // back from sleep
    if (STEAM && HOST.role === 'main') STEAM.showLibrary();   // nothing of Steam's drawn over Tungsten
    takeFocus();
    onResize();
    layoutLegend();                                  // (what fits may have changed while it was away)
    startLoops();
    Sound.resume();
    lastInputAt = performance.now();
    if (libraryLive) refreshLibrary();
    if (!coldShown && COLD_AUTO) coldBoot('start');      // the first time Tungsten is on screen
  } else {
    stopLoops();
    Sound.suspend();
    closeLightbox(); closeDrawer('none'); blurSearch(); deselectSearchBar(false);
    showCursor();
    if (cold) endCold(true);                         // the movie doesn't wait for Tungsten to come back
    settleFlow();
  }
}
document.addEventListener('visibilitychange', updateActive);
window.addEventListener('storage', (e) => { if (e.key === 'tungsten.enabled') setEnabled(e.newValue !== '0', false); });

/* Steam's own pages. Tungsten is the home screen of Big Picture and of the
   in-game overlay, and it covers the library in the Steam window. Steam's
   own pages, dialogs and menus still work (opened from Steam's menus or from
   Tungsten's items): while one of them is up, Tungsten steps aside, and it
   comes back as soon as Steam is home again. Pages are Steam's router paths
   ("/library/home", "/steamweb", "/apprunning"...):
   - Big Picture keeps its page in the address of Steam's shared context, the
     window that opened this one (/routes/<page>); this window's own address
     doesn't move. Home is /library/home; /login is the sign-in screen.
   - The in-game overlay (Big Picture style) has its own router. Home is the
     running-game page (/apprunning). Steam's menu there (the Steam button)
     counts as one of its pages.
   - The Steam window: its page history (MainWindowBrowserManager). Home is
     the library; the store and community pages are /browser/.            */
const HOME_PAGES = {
  bpm: /^\/?$|^\/library\/home\/?$|^\/home\/?$|^\/apprunning\/?$/,
  overlay: /^\/?$|^\/apprunning\/?$|^\/app\/\d+\/overlay\/?$/,
  main: /^\/?$|^\/library\/?$|^\/library\/home\/?$/,
};
function bigPicturePath() {
  try {
    const p = String(window.opener.location.pathname || '');
    if (/^\/routes(\/|$)/.test(p)) return p.slice(7) || '/';
  } catch (e) { /* not reachable */ }
  return STEAM.pagePath();                 // Big Picture's own router (without /routes)
}
function steamPage() {
  if (!STEAM) return '';
  if (IN_BPM) return bigPicturePath();
  if (IN_OVERLAY) return STEAM.pagePath();
  if (HOST.role === 'main') return STEAM.mainPage();
  return '';
}
let shownOver = null;           // the Steam page Tungsten was switched on over: it stays up there
let overlayShownAt = -1e9;      // when Tungsten's in-game menu last came up in the overlay (Steam's menu is closed then)
let inGameUp = false;           // the overlay: Tungsten's in-game menu is up over the game
const OVERLAY_MENU_GRACE_MS = 1500;   // ...for this long, in case Steam opens it a moment late
const LAUNCH_STALL_MS = 10000;        // a launch not running by then shows Steam's page for the game
const SHORTCUT_DONE_MS = 3000;        // a non-Steam shortcut opened from APPS not running by then is done
const WINDOW_ID = `${HOST.role}:${Math.random().toString(36).slice(2)}`;   // this window, among Tungsten's
let lastOpenedAt = -1e9;        // when one of Tungsten's items last opened a Steam page
let steamQuietUntil = 0;        // Steam's navigation sounds stay quiet until then too (see STEAM.quietWhen)
// Whether this window has the screen, for Steam's navigation sounds: the
// launcher in front (Big Picture, the Steam window) or Tungsten's in-game
// menu up in the overlay (Tungsten steps aside otherwise); and for a moment
// after Tungsten itself opened something of Steam's or closed the overlay.
const steamQuiet = () => enabled && (performance.now() < steamQuietUntil || (active && (IN_OVERLAY || !session)));
// Games that just closed, and when (see watchSteamPages). Some games run as
// two appids (The Sims 4 reports 1222670 and 1182480) that close together,
// in either order, so each one is kept for a moment.
const leftGames = new Map();
let leftHomeAt = -1e9;
function watchSteamPages() {
  let lastPath = null, lastWhy = '';
  const home = HOME_PAGES[HOST.role] || HOME_PAGES.bpm;
  const check = () => {
    // The Steam window can open on a store page, and it builds its page
    // history a moment after it opens: for its first seconds Tungsten puts
    // it on the library (unless Tungsten itself just opened a page).
    if (HOST.role === 'main' && enabled && performance.now() < 15000 && performance.now() - lastOpenedAt > 5000 && STEAM.onWebPage()) STEAM.showLibrary();
    const path = steamPage();
    if (path !== lastPath) {
      lastPath = path;
      tlog(`Steam page: ${path || '(none)'}`);
      if (shownOver !== null && path !== shownOver) shownOver = null;
    }
    // (checkVisibility only needs styles, where getClientRects would lay out
    // Steam's page four times a second while it's on screen.)
    const shown = (el) => (el.checkVisibility ? el.checkVisibility() : el.getClientRects().length > 0);
    const dialog = HOST.role !== 'main' &&
      [...document.querySelectorAll('.FullModalOverlay')].some((el) => !inRoot(el) && shown(el));
    // Starting a game sends Steam to that game's page (Play button, stats).
    // While the game runs, Tungsten stays up there with its in-game menu.
    // When it closes, Steam would stay on that page, so Tungsten sends Steam
    // back to Home and the launcher is what comes back. A dialog Steam shows
    // as the game closes (a cloud sync, say) goes first.
    const playing = (session && session.it.appid) || (boot && boot.it.appid);
    const onGame = (appid) => !!appid && new RegExp(`^/library/app/${appid}(/|$)`).test(path);
    // A launch that hasn't become a running game after a while (an update
    // to download first, an error): Steam's page for the game shows what's
    // going on, so Tungsten lets the launch go and steps aside for it. If
    // the game starts later, Tungsten comes back with its in-game menu.
    if (session && session.live && session.pending && STEAM.runningAppIds().includes(session.it.appid)) session.pending = false;
    if (session && session.live && session.pending && !dialog && onGame(session.it.appid) && performance.now() - session.at > LAUNCH_STALL_MS) {
      tlog(`game ${session.it.appid} hasn't started after ${LAUNCH_STALL_MS / 1000} s: showing Steam's page for it`);
      closeSession(session.it);
    }
    let onLeftGame = false;
    for (const [appid, at] of leftGames) {
      const again = (boot && boot.it.appid === appid) || (session && session.it.appid === appid && session.at > at);
      if (again) leftGames.delete(appid);                     // launched again: its page is the launch now
      else if (onGame(appid)) {
        onLeftGame = true;
        if (enabled && !dialog && performance.now() - leftHomeAt > 800) {
          leftHomeAt = performance.now();
          if (STEAM.home()) tlog(`game ${appid} closed: Steam back to Home`);
        }
      } else if (performance.now() - at > 3000) leftGames.delete(appid);   // Steam is home, or somewhere else on purpose
    }
    // An app opened from APPS (in any Tungsten window): Steam sends Big
    // Picture and the overlay to its page as it starts it, as for a game.
    // Tungsten stays up over that page, and once the app is running, or done
    // already, each window goes back where it was (Big Picture Home, the
    // overlay to the game), so what was on screen stays there. A non-Steam
    // shortcut not running a moment after it started is done (a small tool
    // can be: there's no update or download that Steam's page could show for
    // it). Any other app that hasn't started after a while: Steam's page
    // shows why.
    let onAppLaunch = false;
    const launches = STEAM ? STEAM.appLaunches() : new Map();
    for (const [appid, l] of launches) {
      if (!l || typeof l !== 'object') { launches.delete(appid); continue; }
      const age = Date.now() - l.at;
      if (age > 60000) { launches.delete(appid); continue; }
      const running = STEAM.runningAppIds().includes(appid);
      if (running) l.seen = true;
      if (l.stalled || !onGame(appid)) continue;
      const mine = l.handled[WINDOW_ID];
      if (mine !== undefined) { if (performance.now() - mine < 1500) onAppLaunch = true; continue; }   // (sent back: its page goes in a moment)
      const done = !running && (l.seen || (l.shortcut && age > SHORTCUT_DONE_MS));
      if (!running && !done && age > LAUNCH_STALL_MS) { l.stalled = true; tlog(`app ${appid} hasn't started after ${LAUNCH_STALL_MS / 1000} s: showing Steam's page for it`); continue; }
      onAppLaunch = true;
      if ((running || done) && enabled && !dialog && performance.now() - leftHomeAt > 800) {
        leftHomeAt = performance.now();
        l.handled[WINDOW_ID] = performance.now();
        if (IN_OVERLAY ? STEAM.overlayHome() : STEAM.home()) tlog(`app ${appid} ${running ? 'running' : 'done'}: ${IN_OVERLAY ? 'the overlay back to the game' : 'Steam back to Home'}`);
      }
    }
    // In the overlay, Tungsten shows only while its in-game menu is up (the
    // Steam button, see "In-game menu"). Otherwise the overlay is hidden, or
    // shows Steam's Quick Access over the game itself, and Tungsten stays out
    // of the picture.
    const gameOnly = IN_OVERLAY && !inGameUp;
    const onPage = !gameOnly && !!path && !home.test(path) && path !== shownOver && !onGame(playing) && !onLeftGame && !onAppLaunch;
    // Right after the in-game menu comes up, Steam's own menu opening as well
    // (late) is closed again: Tungsten's in-game menu is the menu here.
    // Opened later, it's Steam's menu on purpose.
    const fresh = IN_OVERLAY && inGameUp && performance.now() - overlayShownAt < OVERLAY_MENU_GRACE_MS;
    if (fresh && enabled && STEAM.closeSideMenus(true)) tlog("closed Steam's menu over the in-game menu");
    const side = IN_OVERLAY ? STEAM.openSideMenu() : 0;          // Quick Access always counts; Steam's menu after the first moment
    if (side === 2) overlayShownAt = -1e9;                       // (opened on purpose: the moment is over)
    const menu = side === 2 || (side === 1 && !fresh);
    const why = onPage ? 'a Steam page' : gameOnly ? 'the game' : dialog ? 'a Steam dialog' : menu ? "Steam's menu" : '';
    if (!!why !== away || (why && why !== lastWhy)) {
      if (!!why !== away) tlog(why ? `steps aside (${why})` : 'back');
      lastWhy = why;
      away = !!why;
      // Steam's menus (Quick Access, its main menu) are views of their own
      // over this window, so Tungsten can stay drawn underneath them. Its
      // dialogs and pages are drawn in the window's own page, which sits
      // under Tungsten: for those, Tungsten gets out of the way entirely.
      under = why === "Steam's menu";
      updateActive();
    }
  };
  watchSteamPages.check = check;
  check();
  setInterval(check, 250);
}

/* ═════════════════════════ Start ═════════════════════════ */

let libraryLive = false;        // GAMES holds the Steam library (not the sample)
let overlayPid = 0;
const registrations = [];
let lastLibraryRead = 0;

// Reads the Steam library again (playtime and order change after playing).
function refreshLibrary() {
  if (!libraryLive || performance.now() - lastLibraryRead < 3000) return;
  lastLibraryRead = performance.now();
  const list = STEAM.library(true);
  if (list) setGames(list);
  refreshApps();
}
function refreshApps() {
  const list = STEAM && STEAM.userApps();
  if (list) setApps(list);
}

// Warm the hero/logo cache for the first games so dwell art appears without a wait.
function preloadArt() {
  GAMES.slice(0, 8).forEach((g, i) => setTimeout(() => getArt(g), 200 + i * 300));
}

// Steam tells every window when a game starts or stops.
function onAppLifetime(n) {
  const appid = n && n.unAppID;
  if (!appid) return;                              // non-Steam shortcuts report 0
  tlog(`game ${appid} ${n.bRunning ? 'running' : 'closed'}`);
  if (n.bRunning) {
    leftGames.delete(appid);
    const opened = STEAM.appLaunches().get(appid);
    if (opened && typeof opened === 'object') opened.seen = true;   // (an app that's done in a moment counts too)
    if (session && session.it.appid === appid) { session.pending = false; return; }
    if (boot || IN_OVERLAY) return;                // our own launch ends in a session already
    if (findApp(appid)) return;                    // one of your apps: it runs next to the launcher, no in-game menu
    // A game Steam started (from its own pages, a desktop shortcut): the
    // in-game menu comes up for it. Apps that aren't games (a controller
    // utility Steam starts with Windows, say) leave the launcher alone. A
    // game that runs as two appids can report its helper first: the menu
    // moves to the one in the library when that reports in.
    const lib = findGame(appid);
    if (session && !(session.fromSteam && lib && !findGame(session.it.appid))) return;
    const it = lib || STEAM.gameOf(appid, true);
    if (it) { startSession(it, true); session.fromSteam = true; Sound.tick(); Sound.whoosh(1); }
  } else {
    liveDetails.delete(appid);                     // playtime and achievements changed
    if (!IN_OVERLAY) leftGames.set(appid, performance.now());   // Steam's page for it gives way to Home
    if (session && session.it.appid === appid) closeSession(session.it);
    if (watchSteamPages.check) watchSteamPages.check();
    setTimeout(refreshLibrary, 1500);
  }
}
// In-game menu. In Big Picture the Steam (PS) button toggles Steam's own
// menu in the game's overlay, and that menu is also what brings the overlay
// up. While Tungsten is on, the button is Tungsten's instead (see
// takeHomeButton): it brings up Tungsten's in-game menu, keeping the overlay
// up itself, and pressing it again goes back to the game. Steam's menu
// never opens, so it doesn't flash either. With Steam's menu or Quick Access
// open, the button does what Steam's does (it closes them). If Steam's menu
// opens over the game anyway (another shortcut, or the button wasn't taken),
// Tungsten closes it and brings up its in-game menu.
let lastHomeAt = -1e9;
function onHomeButton() {
  if (!enabled || !session || !session.it.appid) return false;   // Steam's own
  if (STEAM.sideMenuOpen()) { overlayShownAt = -1e9; return false; }   // Steam's menus are open: Steam's button (nothing of it gets undone)
  const now = performance.now();
  if (now - lastHomeAt < 300) return true;           // one press reported twice
  lastHomeAt = now;
  if (inGameUp) { tlog('Steam button: back to the game'); setMenu(false); }
  else showInGameMenu('Steam button');
  return true;
}
function showInGameMenu(why) {
  closeLightbox(); closeDrawer('none'); closeInspector(true); resetSearch();
  setMenu(true, true);                               // from Resume Game
  inGameUp = true;
  overlayShownAt = performance.now();
  if (!STEAM.overlayUp(true)) tlog('the overlay may not stay up');
  tlog(`${why}: in-game menu`);
  if (watchSteamPages.check) watchSteamPages.check();
  setTimeout(takeFocus, 300);
}
function hideInGameMenu() {                          // the overlay goes back to just the game
  if (!inGameUp) return;
  inGameUp = false;
  steamQuietUntil = performance.now() + 900;         // (the overlay closing is Tungsten's sound)
  STEAM.overlayUp(false);
  if (watchSteamPages.check) watchSteamPages.check();
}
function watchSteamMenuInGame() {
  if (inGameUp || !enabled || !session || !session.it.appid || STEAM.openSideMenu() !== 1) return;
  showInGameMenu("Steam's menu");                    // first: the overlay stays up while Steam's menu closes
  STEAM.closeSideMenus(true);
}
// The overlay opening or closing (for any reason). Closed some other way
// than Resume (the game took the focus back, say): the in-game menu goes too.
function onOverlayActivated(pid, appid, on) {
  if (overlayPid && pid && pid !== overlayPid) return;
  if (!on) {                                         // (one that crossed the in-game menu coming up is old news)
    if (performance.now() - overlayShownAt > 400) hideInGameMenu();
    return;
  }
  watchSteamMenuInGame();
}

function startWithSteam() {
  libraryNote = 'Loading your Steam library…';
  setGames([]);
  const t0 = performance.now();
  let noted = false;
  (function attempt() {
    const list = STEAM.library(performance.now() - t0 > 20000);
    if (list) {
      libraryLive = true;
      lastLibraryRead = performance.now();
      libraryNote = list.length ? '' : 'No installed games found';
      tlog(`library: ${list.length} games${noted ? ` (Steam ready after ${Math.round((performance.now() - t0) / 1000)} s)` : ''}`);
      setGames(list);
      refreshApps();
      if (APPS.length) tlog(`apps: ${APPS.length} (${APPS.slice(0, 6).map((a) => a.title).join(', ')}${APPS.length > 6 ? '…' : ''})`);
      STEAM.quietWhen(steamQuiet, !IN_OVERLAY);      // Steam's navigation sounds (see STEAM.quietWhen)
      setInterval(() => STEAM.quietWhen(steamQuiet, !IN_OVERLAY), 5000);
      if (!IN_OVERLAY) preloadArt();               // (the in-game menu never shows a game's backdrop)
      setTimeout(refreshLibrary, 8000);            // install states can settle a moment after sign-in
      setTimeout(() => { if (refreshFriends(true)) tlog(`friends: ${cols[FRIENDS_COL].all.filter((e) => e.it.friend).length}`); }, 1500);
      setInterval(() => { if (active && state.cat === FRIENDS_COL && !drawer.open) refreshFriends(); }, 30000);
      setInterval(updateStatus, 2000);              // the download indicator by the clock
      if (IN_BPM) {                                  // the screensaver hand-off (see "Screensaver")
        setTimeout(() => {
          const reg = STEAM.onScreensaver(onScreensaver);
          if (reg) registrations.push(reg);
          const s = STEAM.screensaverSetup();
          if (s) tlog(`screensaver: ${s.id || 'none'} picked, after ${s.secs ? `${s.secs} s` : 'never'}`);
          setInterval(checkIdle, 500);
        }, 3000);
      }
      if (IN_OVERLAY) {
        STEAM.overlayApp().then((app) => {
          if (!app) return;
          overlayPid = app.pid || 0;
          const it = findGame(app.appid) || STEAM.gameOf(app.appid);
          if (it) startSession(it, true);
        });
        registrations.push(STEAM.onOverlay(onOverlayActivated));
        // The Steam button becomes Tungsten's (the window's instance can
        // take a moment to show up), and Steam's menu opening over the game
        // anyway is caught quickly.
        (function takeHome(n) {
          if (STEAM.takeHomeButton(onHomeButton)) { tlog("Steam button taken: it brings up Tungsten's in-game menu"); return; }
          if (n > 0) setTimeout(() => takeHome(n - 1), 500);
          else tlog("Steam button left to Steam (Tungsten closes Steam's menu instead)");
        })(20);
        setInterval(watchSteamMenuInGame, 100);
      } else {
        const running = STEAM.runningAppIds().filter((a) => !findApp(a));   // a game already running (not one of your apps, like a controller utility)
        const it = running.map(findGame).find(Boolean) || running.map((a) => STEAM.gameOf(a, true)).find(Boolean);
        if (it) { startSession(it, true); session.fromSteam = true; }
        window.addEventListener('focus', refreshLibrary);
        setInterval(refreshLibrary, 300000);
      }
      registrations.push(STEAM.onLifetime(onAppLifetime));
      return;
    }
    if (STEAM.host()) {                                // Steam is there, still signing in: wait for it
      if (!noted) { noted = true; tlog('waiting for Steam to finish signing in'); }
      setTimeout(attempt, 750);
      return;
    }
    if (performance.now() - t0 < 20000) { setTimeout(attempt, 500); return; }
    // Steam's stores never showed up: fall back to the sample library.
    console.warn('[Tungsten] Steam library not reachable, showing the sample library');
    tlog('Steam library not reachable after 20 s, showing the sample library');
    libraryNote = '';
    setGames(SAMPLE_GAMES);
    preloadArt();
  })();
  window.addEventListener('pagehide', () => {
    if (IN_OVERLAY) { STEAM.overlayUp(false); STEAM.releaseHomeButton(); }
    for (const r of registrations) { try { if (r && r.unregister) r.unregister(); } catch (e) { /* already gone */ } }
  });
}

if (IN_STEAM) {
  if (IN_OVERLAY) root.style.top = '0px';
  placeToggle();
  setInterval(placeToggle, 1500);                // Steam re-renders its title bar now and then
  window.addEventListener('resize', placeToggle);
  if (HOST.role === 'main' && readEnabled()) STEAM.showLibrary();   // start on the library, not a store page
  watchSteamPages();
  startWithSteam();
  setEnabled(readEnabled(), false);
  if (active) takeFocus();
} else {
  setGames(SAMPLE_GAMES);
  whenLoaded(preloadArt);
}
refreshLists();
render();
selectionChanged();
layoutLegend();
if (active) startLoops();
if (active && !coldShown && COLD_AUTO) coldBoot('start');
const probeTimer = setInterval(() => { if (perfProbe.done) clearInterval(probeTimer); else startPerfProbe(); }, 20000);

// Small hook for tests and debugging (window.Tungsten in the console).
window.Tungsten = {
  state, setCategory, setItem, select, back, cycleTint, toggleMute, current, Sound,
  openDrawer, closeDrawer, drawer,
  get booting() { return !!boot; }, BOOT,
  get inputMode() { return inputMode; }, setInputMode,
  pad: { DEADZONE: PAD_DEADZONE, RELEASE: PAD_RELEASE, TRIGGER: PAD_TRIGGER },
  hold: { DELAY_MS: HOLD_DELAY_MS, STEP_MS: HOLD_STEP_MS, FAST_STEP_MS: HOLD_FAST_STEP_MS, ACCEL_AFTER_MS: HOLD_ACCEL_AFTER_MS, PAGE_ROWS, get last() { return lastHold; } },
  get session() { return session && { title: session.it.title, menu: session.menu, live: !!session.live, appid: session.it.appid }; },
  toggleInGame, resumeGame, quitGame, openInspector, closeInspector, inspector, lightbox,
  openSearch, clearSearch, applySearch, search, cols, get ui() { return UI; },
  lib: { get open() { return lib.open; }, get sel() { return lib.sel; }, get list() { return lib.list.map((g) => g.title); }, get letters() { return lib.letters.map((L) => L.ch); },
    get letter() { return (lib.letters[lib.at] || {}).ch || ''; }, get filter() { return libView.filter; }, get shown() { return lib.shown.size; }, get rows() { return lib.rows.size; },
    get focus() { const g = lib.list[lib.sel]; return g ? { appid: g.appid, title: g.title, installed: g.installed, letter: g.letter, key: g.key } : null; },
    filters: () => (lib.p ? libFilters(lib.p) : []), openLib: openLibrary, closeLib: closeLibrary, setFilter: libSetFilter, toLetter: libToLetter },
  color: { PALETTES, autoColor, daylight, get mode() { return colorMode; } },
  host: HOST, get library() { return libraryLive ? 'steam' : 'sample'; }, get games() { return GAMES.map((g) => g.title); },
  get enabled() { return enabled; }, get active() { return active; }, setEnabled, toggle: toggleTungsten, refreshLibrary,
  refreshFriends, openPage, updateStatus,
  coldBoot, skipCold, endCold, get cold() { return cold && { ui: cold.ui, t0: cold.t0 }; }, get sweep() { return coldBoost(performance.now()); }, COLD,
  flow, drawn, wallFlow, saverFlow, saverSpeed, drawField, field, ambient, AMBIENT, startAmbient, endAmbient, checkIdle, onScreensaver,
  get idle() { return (performance.now() - lastInputAt) / 1000; }, set idleSince(t) { lastInputAt = t; },
};
})();
