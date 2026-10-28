#!/usr/bin/env python3
"""Builds Tungsten's Big Picture screensaver from tungsten.html.

Steam's Big Picture loads custom screensavers from
  <Steam>\\config\\uioverrides\\screensavers\\<name>\\index.html
(Settings > Customization > Screensaver lists them by folder name; keep the
name lowercase: Steam serves the page from https://uioverride-<name>.steamscreensavers.host,
and a host name is lowercased, so a capital letter misses the folder).

The page is the menu's background on its own: the same silk ribbons, crest
glow, threads, glints and bokeh over the same calendar + time-of-day color,
with no menu, art or text. It takes that code straight out of tungsten.html
(drawField and everything it uses), and both follow the same flow clock
(wall time), so at any moment the screensaver draws exactly the frame the
menu would. Its very first frame is drawn before the page is first shown,
right where the menu's ribbons are; from there the ribbons ease up to twice
the menu's pace over three seconds (saverFlow). Tungsten does the hand-off:
it fades its menu away before starting the screensaver, mirrors the ramp
underneath, and eases back down when the screensaver ends.

Output: dist/Tungsten-screensaver/index.html (one self-contained file).
"""
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = (HERE / 'tungsten.html').read_text(encoding='utf-8')
OUT = HERE / 'dist' / 'Tungsten-screensaver'


def block(start, end):
    """The source from the line that starts with `start` up to (not including) the line that starts with `end`."""
    i = SRC.index('\n' + start) + 1
    j = SRC.index('\n' + end, i) + 1
    return SRC[i:j]


ribbons = block("const field = $('#field');", '// 1 at 900px+ tall')
drawing = block("// Fill one ribbon's sample buffers", "/* Tungsten's flow clock")
colors = block('const PALETTES = [', 'let colorMode = 0;')

for name in ('function drawField(', 'const FLOW_EPOCH', 'function saverFlow(', 'function seeded('):
    assert name in ribbons + drawing, f'{name} moved out of the blocks the screensaver takes'
# Everything Steam-side, and the menu's own bits, stays out.
for name in ('tlog(', 'STEAM', 'session', 'perfProbe', 'drawStats', 'fieldOccluded', 'boot', 'flow.', 'COLD', 'ambient'):
    assert name not in ribbons + drawing, f'{name} in the ribbon code: the screensaver would need it too'

HTML = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Tungsten</title>
<!-- Tungsten's screensaver for Steam Big Picture: the menu's ribbons on their
     own, easing up to twice the pace. Built from tungsten.html by build_screensaver.py. -->
<style>
  html, body {{ margin: 0; width: 100%; height: 100%; overflow: hidden; background: #05080d; cursor: none; }}
  #bg {{ position: fixed; inset: 0; background: #05080d; }}
  #field, #field-soft {{ position: fixed; inset: 0; width: 100%; height: 100%; }}
  #field-soft {{ display: none; }}
</style>
</head>
<body>
<div id="bg"></div>
<canvas id="field" aria-hidden="true"></canvas>
<script>
(() => {{
'use strict';
const $ = (s) => document.querySelector(s);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const viewW = () => window.innerWidth;
const viewH = () => window.innerHeight;
const S0 = performance.now();                  // this page's 0 s: the ribbons start easing up from here

/* ── The color engine (from tungsten.html): month palette, time of day ── */
{colors}
function paint() {{
  const c = autoColor(new Date());
  const lc = LIGHT.nightCenter + (LIGHT.noonCenter - LIGHT.nightCenter) * c.day;
  const le = LIGHT.nightEdge + (LIGHT.noonEdge - LIGHT.nightEdge) * c.day;
  const sat = c.sat * (0.55 + 0.45 * c.day);
  const hue = ((c.hue % 360) + 360) % 360;
  $('#bg').style.background = `radial-gradient(ellipse at 50% 50%, hsl(${{hue.toFixed(2)}} ${{sat.toFixed(2)}}% ${{lc.toFixed(2)}}%) 0%, hsl(${{(hue + 2).toFixed(2)}} ${{Math.min(sat * 1.1, 100).toFixed(2)}}% ${{le.toFixed(2)}}%) 100%)`;
}}

/* ── The ribbons (from tungsten.html) ── */
{ribbons}
window.addEventListener('resize', resizeField);
resizeField();

{drawing}
// The flow clock: the menu's (wall time), plus what easing up has gained.
const flowNow = (now) => (reduceMotion ? 0 : wallFlow(now) + saverFlow((now - S0) / 1000));
// Drawn about 30 times a second, the way the menu draws them (a crest moves
// well under a pixel a frame even at twice the pace): the frames in between
// cost nothing, over what can be hours of idle. As in the menu, the screen's
// frame interval is measured, and the ribbons are drawn on every Nth frame
// (the whole number of frames closest to 1/30 s), so any refresh rate keeps
// an even beat.
const SAVER_FRAME_MS = 1000 / 30;
let lastDraw = -1e9, lastTick = 0, frameGap = 1000 / 60;
function frame(now) {{
  requestAnimationFrame(frame);
  const d = now - lastTick;
  lastTick = now;
  if (d > 2 && d < 50) frameGap += (d - frameGap) * 0.05;
  if (now - lastDraw < (Math.max(1, Math.round(SAVER_FRAME_MS / frameGap)) - 0.5) * frameGap) return;
  lastDraw = now;
  drawField(flowNow(now));
}}

paint();
setInterval(paint, 60000);                     // the color follows the clock
drawField(flowNow(performance.now()));         // before the first paint: no blank frame
requestAnimationFrame(frame);
window.__tungstenSaver = {{ S0, flowNow, drawField, wallFlow, saverFlow }};   // (for the tests)
}})();
</script>
</body>
</html>
"""

OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'index.html').write_text(HTML, encoding='utf-8')
print(f'  {OUT / "index.html"}  {len(HTML.encode("utf-8")):,} bytes')
