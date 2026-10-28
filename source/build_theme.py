"""Build the Tungsten Millennium theme from tungsten.html.

tungsten.html is the single source. It holds three marked parts:
  <style id="tungsten-css">   every Tungsten rule, scoped to #tungsten-root
  <div id="tungsten-root">    the interface markup
  <script id="tungsten-js">   the script (it mounts the markup itself in Steam)

This writes dist/Tungsten/ (the theme folder) and dist/Tungsten-millennium-<version>.zip:
  skin.json                   Millennium manifest
  libraryroot.custom.css      the scoped styles
  libraryroot.custom.js       the script, with the markup embedded
  bigpicture.custom.*, friends.custom.*   empty, for Millennium's default patches
  README.md                   install and use

Run: python3 build_theme.py
"""
import json
import os
import re
import shutil
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, 'tungsten.html')
DIST = os.path.join(HERE, 'dist')
NAME = 'Tungsten'
VERSION = '1.5.1'
AUTHOR = 'emmanuel-g55932'
REPO = ('emmanuel-g55932', 'Tungsten')            # GitHub owner and repository (Millennium's store reads it)
RAW = f'https://raw.githubusercontent.com/{REPO[0]}/{REPO[1]}/main'
OUT = os.path.join(DIST, NAME)


def between(s, start, end, what):
    i = s.find(start)
    if i < 0:
        sys.exit(f'build: {what}: start marker not found')
    i += len(start)
    j = s.find(end, i)
    if j < 0:
        sys.exit(f'build: {what}: end marker not found')
    return s[i:j]


src = open(SRC, encoding='utf-8').read()

css = between(src, '<style id="tungsten-css">', '</style>', 'css').strip('\n')
markup = between(src, '<div id="tungsten-root">\n', '\n</div>\n\n<script id="tungsten-js">', 'markup')
js = between(src, '<script id="tungsten-js">', '</script>', 'js').strip('\n')

# The markup is indented two spaces inside the root in tungsten.html.
markup = '\n'.join(ln[2:] if ln.startswith('  ') else ln for ln in markup.split('\n')).strip('\n')


# ---------- checks ----------

def css_blocks(text):
    """Top-level (prelude, body) pairs, comments skipped."""
    out, i, n, buf = [], 0, len(text), ''
    while i < n:
        if text.startswith('/*', i):
            i = text.index('*/', i) + 2
            continue
        ch = text[i]
        if ch == '{':
            depth, j = 1, i + 1
            while depth:
                if text.startswith('/*', j):
                    j = text.index('*/', j) + 2
                    continue
                if text[j] == '{':
                    depth += 1
                elif text[j] == '}':
                    depth -= 1
                j += 1
            out.append((buf.strip(), text[i + 1:j - 1]))
            buf, i = '', j
            continue
        buf += ch
        i += 1
    return out


def split_selectors(prelude):
    parts, depth, cur = [], 0, ''
    for ch in prelude:
        if ch in '([':
            depth += 1
        elif ch in ')]':
            depth -= 1
        if ch == ',' and depth == 0:
            parts.append(cur.strip())
            cur = ''
        else:
            cur += ch
    parts.append(cur.strip())
    return parts


def check_scope(text, where='top'):
    """Every style rule must start at #tungsten-root or #tungsten-toggle."""
    bad, rules = [], 0
    for prelude, body in css_blocks(text):
        if prelude.startswith('@media') or prelude.startswith('@supports') or prelude.startswith('@container'):
            b, r = check_scope(body, prelude)
            bad += b
            rules += r
            continue
        if prelude.startswith('@keyframes'):
            if not prelude.split()[1].startswith('tg-'):
                bad.append(f'{where}: keyframes without the tg- prefix: {prelude}')
            continue
        if prelude.startswith('@property'):
            if not prelude.split()[1].startswith('--tg-'):
                bad.append(f'{where}: @property without the --tg- prefix: {prelude}')
            continue
        if prelude.startswith('@'):
            bad.append(f'{where}: unexpected at-rule: {prelude}')
            continue
        rules += 1
        for sel in split_selectors(prelude):
            if not re.match(r'#tungsten-(root|toggle)(?![\w-])', sel):
                bad.append(f'{where}: unscoped selector: {sel}')
    return bad, rules


bad, rule_count = check_scope(css)
if bad:
    sys.exit('build: CSS scope check failed:\n  ' + '\n  '.join(bad))
if re.search(r'(?<![\w-])\d*\.?\d+v[wh]\b', re.sub(r'/\*.*?\*/', '', css, flags=re.S)):
    sys.exit('build: CSS still uses vw/vh (Tungsten measures against its root with cqw/cqh)')

if js.count("'__TUNGSTEN_MARKUP__'") != 1:
    sys.exit('build: the markup placeholder must appear exactly once in the script')
if f"const VERSION = '{VERSION}';" not in js or "el.setAttribute('data-version', VERSION)" not in js:
    sys.exit(f'build: script version does not match {VERSION}')
for needle in ('<style', '<script', 'tungsten-page'):
    if needle in markup:
        sys.exit(f'build: unexpected {needle} in the markup')


# ---------- libraryroot.custom.css ----------

CSS_HEAD = f'''@charset "UTF-8";
/* Tungsten {VERSION} · libraryroot.custom.css · Millennium theme for Steam

   Every rule below is scoped to #tungsten-root (Tungsten itself) or
   #tungsten-toggle (its button in Steam's title bar). Steam's own windows,
   menus, settings and dialogs never match them, so Steam looks exactly as it
   does without the theme whenever Tungsten is switched off or not mounted.
   Animation and custom property names carry a tg- prefix for the same reason.

   Generated from tungsten.html by build_theme.py. Edit the source and rebuild. */

'''
css_out = CSS_HEAD + css + '\n'

# ---------- libraryroot.custom.js ----------

JS_HEAD = f'''/* Tungsten {VERSION} · libraryroot.custom.js · Millennium theme for Steam

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

'''
markup_js = json.dumps(markup, ensure_ascii=False)
js_out = JS_HEAD + js.replace("'__TUNGSTEN_MARKUP__'", markup_js, 1) + '\n'

# ---------- skin.json ----------

skin = {
    'name': NAME,
    'author': AUTHOR,
    'version': VERSION,
    'description': ('A console-style home screen for Steam Big Picture: your games and the rest of Steam on a '
                    'cross-shaped menu made for a TV and a controller, with an A to Z library, an in-game menu '
                    'in the overlay, and your apps. Hold View (or press Ctrl + Shift + X) to switch back to Steam\'s own '
                    'interface at any time. Beta, made with AI assistance (see the README).'),
    'tags': ['Big Picture', 'Launcher', 'Controller', 'Dark'],
    'github': {'owner': REPO[0], 'repo_name': REPO[1]},
    'header_image': f'{RAW}/images/header.jpg',
    'splash_image': f'{RAW}/images/splash.jpg',
    'UseDefaultPatches': True,
    'Patches': [
        # The main window, Big Picture ("Steam Big Picture Mode") and every
        # other window with "Steam" in its title.
        {
            'MatchRegexString': '.*SharedJSContext.*|.*Steam.*',
            'TargetCss': 'libraryroot.custom.css',
            'TargetJs': 'libraryroot.custom.js',
        },
        # The in-game overlay ("SP Overlay: ...").
        {
            'MatchRegexString': '.*SteamOverlay.*|.*Overlay.*',
            'TargetCss': 'libraryroot.custom.css',
            'TargetJs': 'libraryroot.custom.js',
        },
    ],
}
skin_out = json.dumps(skin, indent=4, ensure_ascii=False) + '\n'

# ---------- stubs ----------

STUB_CSS = '''/* Tungsten styles nothing in Big Picture's menus or the friends list
   (Big Picture itself gets libraryroot.custom.css). This file is here
   because Millennium's default patches ask for it. */
'''
STUB_JS = '''/* Tungsten runs nothing in Big Picture's menus or the friends list
   (Big Picture itself gets libraryroot.custom.js). This file is here
   because Millennium's default patches ask for it. */
'''

# ---------- README ----------

README = open(os.path.join(HERE, 'theme_readme.md'), encoding='utf-8').read().replace('{VERSION}', VERSION)

# ---------- write ----------

if os.path.isdir(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT)
files = {
    'skin.json': skin_out,
    'libraryroot.custom.css': css_out,
    'libraryroot.custom.js': js_out,
    'bigpicture.custom.css': STUB_CSS,
    'bigpicture.custom.js': STUB_JS,
    'friends.custom.css': STUB_CSS,
    'friends.custom.js': STUB_JS,
    'README.md': README,
}
for name, text in files.items():
    with open(os.path.join(OUT, name), 'w', encoding='utf-8', newline='\n') as f:
        f.write(text)

# The Big Picture screensaver (the menu's ribbons on their own) is built from
# the same source; it goes in the zip as its own folder (see the README).
import subprocess
subprocess.run([sys.executable, os.path.join(HERE, 'build_screensaver.py')], check=True)
SAVER = os.path.join(DIST, f'{NAME}-screensaver', 'index.html')

zpath = os.path.join(DIST, f'{NAME}-millennium-{VERSION}.zip')
if os.path.exists(zpath):
    os.remove(zpath)
with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED) as z:
    for name in files:
        z.write(os.path.join(OUT, name), f'{NAME}/{name}')
    z.write(SAVER, f'{NAME}-screensaver/{NAME.lower()}/index.html')   # lowercase: Steam serves it from a host name

json.loads(open(os.path.join(OUT, 'skin.json'), encoding='utf-8').read())   # valid JSON
print(f'built {OUT}')
for name in files:
    print(f'  {name:26s} {os.path.getsize(os.path.join(OUT, name)):>8,d} bytes')
print(f'  {os.path.basename(zpath):26s} {os.path.getsize(zpath):>8,d} bytes')
print(f'  CSS rules checked: {rule_count}, all scoped')
