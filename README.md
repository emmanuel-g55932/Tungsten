# Tungsten

A console-style home screen for Steam Big Picture, inspired by the PS3 menu. Your games and the rest of Steam sit on a cross-shaped menu made for a TV and a controller, over slow ribbons in a color that changes with the month. It runs inside Steam through [Millennium](https://steambrew.app/), so there's no extra launcher to set up: Big Picture is still there underneath, and holding one button brings it back.

![Moving through Tungsten's menu with a controller](https://raw.githubusercontent.com/emmanuel-g55932/Tungsten/media/tour.webp)

Version 1.5.1. This is a beta, made with AI assistance (see [How it was made](#how-it-was-made)). There's also [a one-minute tour with sound](https://github.com/emmanuel-g55932/Tungsten/raw/media/tungsten-tour-720p60.mp4) (MP4, 720p at 60 fps).

## What you get

- **A cross menu for your games.** GAMES lists what's installed, most recently played first, with each game's art behind the menu when you stop on it. Games you added to Steam yourself (an emulator, another store's launcher) are in there too.
- **An A to Z Library.** Every game you own on a cross of its own: the letters across the top, the games down, a filter for installed games, favorites and your Steam collections, and search.
- **An in-game menu.** Press the Steam or PS button in a game and Tungsten's menu comes up over it, with Resume Game and Quit Game on top. Search, your apps and the rest of the menu work there too.
- **Your apps.** Steam software, tools you use and anything in a "Utilities" or "Apps" collection go in APPS and open next to whatever you're playing.
- **Game Details.** Playtime, achievements, your screenshots, DLC and Steam Cloud status for the focused game.
- **Downloads, Screenshots, Friends and Power** as pages of their own, in the same style.
- **Button hints that match your controller:** PlayStation shapes on a DualSense or DualShock, letters on Xbox pads and the Steam Deck, Nintendo's letters on a Switch pad.
- **A startup movie, sounds and a screensaver** that picks up the menu's ribbons where they are. Steam's own menu sounds are held back while Tungsten is on screen, so they don't play over Tungsten's.
- **A way out at any time.** Hold View (Create on a DualSense) or press Ctrl + Shift + X and you're back in Steam's own interface.

## A closer look

Every clip here is Tungsten itself, recorded at 60 frames a second with a sample library.

**Game Details.** Y (Triangle) on a game, then Game Details: playtime, Steam Cloud, achievements, friends who own it, and your screenshots. The focus ring moves through it like the rest of the menu.

![Opening Game Details for a game](https://raw.githubusercontent.com/emmanuel-g55932/Tungsten/media/details.webp)

**The Library.** Every game you own, with the letters across the top. LB / RB (L1 / R1) jump a letter, LT / RT (L2 / R2) jump eight games, and Y (Triangle) picks what it shows.

![Moving through the Library by letter](https://raw.githubusercontent.com/emmanuel-g55932/Tungsten/media/library.webp)

**In a game.** The Steam or PS button brings the menu up over the game, with Resume Game and Quit Game first and the game's name in the corner.

![Starting a game, then the in-game menu](https://raw.githubusercontent.com/emmanuel-g55932/Tungsten/media/ingame.webp)

**Color and the screensaver.** X (Square) cycles through a color for each month. Left alone, the menu follows the month and the time of day, and the screensaver carries the ribbons on by themselves.

![Changing the color, then the screensaver](https://raw.githubusercontent.com/emmanuel-g55932/Tungsten/media/color.webp)

**Startup.** Big Picture opens on a short startup movie with its own sound. The B key plays it again.

![The startup movie](https://raw.githubusercontent.com/emmanuel-g55932/Tungsten/media/boot.webp)

## Screenshots

| | |
|---|---|
| ![The menu](https://raw.githubusercontent.com/emmanuel-g55932/Tungsten/main/images/home.jpg) | ![A game in focus, with its art](https://raw.githubusercontent.com/emmanuel-g55932/Tungsten/main/images/game.jpg) |
| ![Game Details](https://raw.githubusercontent.com/emmanuel-g55932/Tungsten/main/images/inspector.jpg) | ![The Library, A to Z](https://raw.githubusercontent.com/emmanuel-g55932/Tungsten/main/images/library.jpg) |
| ![The in-game menu](https://raw.githubusercontent.com/emmanuel-g55932/Tungsten/main/images/ingame.jpg) | ![February's color](https://raw.githubusercontent.com/emmanuel-g55932/Tungsten/main/images/color.jpg) |

The clips and screenshots use a sample library. Game art belongs to its publishers and is loaded from Steam.

## Before you install

- **It's a beta.** So far it has been used on one PC: Windows 11, Steam in English, Millennium 3.x and a DualSense, on a 2560×1600 screen at 130 Hz. The layout has also been checked in testing from 720p to 4K and on ultrawide screens. It hasn't been tried on Linux or a Steam Deck.
- **Steam updates can break parts of it.** Tungsten reads Steam's library and controls Big Picture from inside the Steam client, and Valve changes those insides from time to time. When that happens, the part that broke stops working until Tungsten is updated. The switch back to Steam's own interface keeps working, and if Tungsten can't read your library at all, it shows a sample library instead of nothing.
- **You need** Steam on Windows with [Millennium](https://steambrew.app/) installed, and Millennium's **Allow JavaScript insertions** setting turned on (it's on by default). Tungsten is mostly script, so nothing appears without it.

## Install

**From Millennium's store** (once Tungsten is listed there):

1. In the Steam window, open the **Steam** menu at the top left and choose **Millennium**.
2. Go to **Themes**, click **Install a theme**, and enter Tungsten's ID from its page on [steambrew.app/themes](https://steambrew.app/themes).
3. Pick **Tungsten** as the client theme, then quit Steam and start it again.

**By hand:**

1. Quit Steam completely (Steam menu, then Exit).
2. Download this repository (Code, then Download ZIP) and copy its folder into Steam's `millennium\themes` folder, renamed to `Tungsten`, so that this file ends up at:

   `C:\Program Files (x86)\Steam\millennium\themes\Tungsten\skin.json`

   (Use your own Steam folder if Steam is installed somewhere else.)
3. Start Steam. Open the **Steam** menu, choose **Millennium**, go to **Themes**, and pick **Tungsten**.
4. Check that **Allow JavaScript insertions** and **Allow StyleSheet insertions** are on (General, in the Themes section).
5. Quit Steam and start it again. A full restart works better than Millennium's "Restart Now" button, which in Big Picture can set off the "Save As" problem described under [If something looks wrong](#if-something-looks-wrong).

## Controls

| Action | Controller (Xbox / PlayStation) | Keyboard | Mouse |
|---|---|---|---|
| Change category | D-pad, left stick, LB / RB (L1 / R1) | Left / Right, A / D | Shift + wheel, click a category |
| Move through a column | D-pad, left stick | Up / Down, W / S | Wheel, click an item |
| Jump 8 games | LT / RT (L2 / R2) | Page Up / Page Down | |
| Jump a letter (in the Library) | D-pad Left / Right, LB / RB (L1 / R1) | Left / Right | Click a letter |
| Play / select | A (Cross) | Enter | Click the focused game, or its Play button |
| Back | B (Circle) | Esc, Backspace | |
| Options for a game or app | Y (Triangle) | O, Tab | Right-click |
| Game Details | Y (Triangle), then Game Details | Space | Details button |
| In-game menu | Menu (Options), or the Steam / PS button in a game | I, Home | |
| Background color | X (Square) | T | |
| Mute sounds | View (Create), a tap | M | |
| Switch to Steam's own interface | View (Create), held a little over a second | Ctrl + Shift + X, F12 | Title bar button |
| Search your games | R3, or Up at the top of GAMES, then A (Cross) | Ctrl + F or /, or Up at the top of GAMES and type | Click the search box |
| Play the startup movie again | | B | |

Hold a direction to keep moving: after a short pause it steps 10 times a second, and after a second and a half 16 times a second.

The hints at the bottom of the screen show the buttons for where you are, in your controller's symbols, and switch to keyboard keys when you use the keyboard (G switches them by hand).

**Searching with a controller:** R3, or Up from the top of GAMES, selects the search box. Pressing A (Cross) on it opens the on-screen keyboard: the D-pad moves, A types, X (Square) deletes, Y (Triangle) adds a space, and Menu (Options) or R3 is done. GAMES filters as you type; in the Library the search covers every game you own. B (Circle) closes the keyboard, and pressing it again clears the search.

## Where Tungsten shows up

- **Big Picture:** Tungsten is the home screen. Steam's own menu still opens over it (the Steam or PS button, or F1 / Ctrl + 1 on a keyboard), and Steam's pages still work. When one of them is open (Store, Settings, Steam's own Library), Tungsten steps aside until you go back. When you start a game, Tungsten stays up and switches to its in-game menu while the game runs; when the game closes, you're back in the launcher. If a game hasn't started ten seconds after Play (an update to download first, say), Tungsten shows Steam's page for it so you can see what's going on.
- **The normal Steam window:** Tungsten covers the library, just under Steam's title bar. Store and Community pages open over it as usual.
- **The in-game overlay:** while Tungsten is on, the Steam or PS button brings up Tungsten's in-game menu over the game instead of Steam's, and pressing it again goes back to the game. Quick Access still opens as usual. To get Steam's own overlay back for that game, switch Tungsten off in the overlay.

## Switching between Tungsten and Steam

Any of these switch Tungsten on or off, and Steam remembers the choice:

- hold the controller's **View** button (Create on a DualSense) for a little over a second. A line fills under "Hold: Steam" while you hold it, so you can let go if you didn't mean it.
- **Ctrl + Shift + X**
- **F12**
- in the normal Steam window, the small button in the title bar next to the window buttons

Big Picture and the normal window share the setting. In a game's overlay the switch only lasts for that game. While Tungsten is off, Steam is untouched: every Tungsten style is scoped to Tungsten's own container, and the script only listens for the switch.

## Your games and apps

- **GAMES** shows the games installed on this PC, most recently played first, including non-Steam games you added yourself. If none are installed, it shows your recent games.
- **Library** is the first item in GAMES. It opens every game you own on a cross of its own: the letters you have games under sit where the categories are (numbers and symbols first, as #), and the games run down under them A to Z. A leading "The" doesn't count, so The Witcher is under W. Left / Right jump a letter, Up / Down go game by game. Games that aren't installed are dimmed with a small download mark, and A on one opens Steam's install dialog. Y (Triangle) opens **Show**: All Games, Installed, Favorites and each of your Steam collections. The Library remembers what it showed and where you were.
- **APPS** starts with your apps, most recently used first: Steam software you have installed, tools you've used (SteamVR, but never Proton or Steam's redistributables), and everything in a Steam collection named Utilities, Apps, Applications, Software, Tools or Programs. An app opens without the game launch animation, and from the in-game menu it opens next to the game you're playing. Steam can't tell a non-Steam app from a non-Steam game, so those start in GAMES: press Y (Triangle) on one and choose **Move to APPS** to move it for good (**Move to GAMES** moves it back).
- **Game Details** shows your playtime, when you last played, Steam Cloud status, achievements, your screenshots and your DLC. Its gear button opens the game's Steam Properties.
- Names, playtime and art come from Steam, including any custom art you've set. A game with no art gets a generated cover, so the layout never breaks.

Tungsten reads your library once Steam has finished signing in, so in Big Picture your games show up a few seconds after sign-in.

## The other columns

Downloads, Screenshots, Power and your friends are Tungsten's own pages. Every other item opens Steam's own page, menu or dialog.

| Column | Item | Opens |
|---|---|---|
| APPS | your apps | listed first |
| | Web Browser | Steam's web browser |
| | Music Player | Quick Access, on the Soundtracks tab |
| | Remote Play | Remote Play settings |
| | Desktop Mode | leaves Big Picture for the Steam window |
| MEDIA | Screenshots | Tungsten's Screenshots page, by game |
| | Game Clips | Steam's media page, showing your clips |
| | Soundtracks | the Soundtracks tab of Steam's library |
| FRIENDS | Friends & Chat, Voice Chat | Quick Access, on the Friends or Voice tab |
| | Recent Players, Add a Friend | those Community pages |
| | your friends | listed below, in-game first; A on one: Chat or View Profile |
| STORE | Featured, Specials, Wishlist, Points Shop | those Store pages |
| SYSTEM | Settings, Controller | Steam's settings (in a game: that game's controller layout) |
| | Downloads | Tungsten's Downloads page: pause, resume, start now, remove, play |
| | Power | Sleep, Restart, Shut Down, Restart Steam, Exit Big Picture |

Items that only work in one place (Big Picture, the overlay or the Steam window) only appear there. Power runs things the way Steam's own Power menu does, and asks for a second press before anything that closes Steam or the PC.

## While a game is running

- **Resume Game** goes back to the game. **Quit Game** asks once, then closes the game the way Steam's Exit button does.
- The in-game menu draws no ribbons and nothing moves by itself while it's open, so it costs the game as little as possible.
- Steam runs one game at a time, so quit the one that's running before you start another. Apps don't count: they open next to the game.

## The screensaver

`extras/screensaver` holds a Big Picture screensaver: the menu's ribbons on their own, picked up exactly where the menu left them. To use it:

1. Copy its `tungsten` folder into Steam's custom screensaver folder, so that this file ends up at:

   `C:\Program Files (x86)\Steam\config\uioverrides\screensavers\tungsten\index.html`

   Keep the folder name in lowercase, or Steam shows an error page instead.
2. Restart Steam, then in Big Picture open Settings > Customization > Screensaver and pick **tungsten**. The time before it starts is under Steam's Power settings (it needs a time there, not Never).

## Good to know

- **F12** is also Steam's default screenshot key, so in a game it may take a screenshot too. Holding View or Ctrl + Shift + X switches without that.
- The layout scales with the screen: 16:9, 16:10, 4:3 and ultrawides keep the same proportions from 720p to 4K, and nothing is tied to a refresh rate.
- Sounds start after your first key press, click or controller press.
- Tungsten is in English, with US-style dates.
- Tungsten writes short status lines to Steam's own log, `Steam\logs\webhelper_js.txt`, all starting with `[Tungsten]`. They're the first thing to look at if something goes wrong.

## If something looks wrong

- **Nothing appears:** check that Allow JavaScript insertions is on, then hold View (or press Ctrl + Shift + X) in case Tungsten was switched off.
- **Sample games show instead of yours:** your library didn't load within 20 seconds. Restart Steam. If it keeps happening, a Steam update probably changed something; please open an issue.
- **Steam itself looks off:** switch Tungsten off. If Steam still looks wrong, the cause is somewhere else, since every Tungsten style is scoped to Tungsten.
- **Steam opens a "Save As" box for a file called `login` (or `apprunning`), then stops responding:** this is a startup timing problem between Millennium and Big Picture, and it happens with any theme or none. Cancel the box, quit Steam (from Task Manager if it won't respond) and start it again. Millennium's "Restart Now" button can set it off in Big Picture, so restart Steam fully instead.

To report a bug, open an [issue](https://github.com/emmanuel-g55932/Tungsten/issues) with what happened, your controller, and if you can, the `[Tungsten]` lines from `Steam\logs\webhelper_js.txt`.

## Privacy

Tungsten doesn't collect or send anything. It reads your library from the Steam client on your own PC, loads the Inter font from Google Fonts and game art from Steam's servers, and keeps its few settings (on or off, the Library filter, games you star, apps you moved) in Steam's local storage.

## Remove

Pick another theme in Millennium's Themes settings, or delete the `Tungsten` folder from `millennium\themes` and restart Steam.

## How it was made

Tungsten was made with AI assistance. The code, the tests and this README were written by Claude, an AI model made by Anthropic, working from my direction: I decided what it should do and how it should look and feel, tried every version on my own PC, and sent it back whenever something was off. Bug reports come to me, and fixes are made the same way.

## Files

| File | What it does |
|---|---|
| `skin.json` | The theme manifest: name, version, and which Steam windows get which files |
| `libraryroot.custom.js` | All of Tungsten: the interface, the Steam library bridge, input and sounds |
| `libraryroot.custom.css` | Tungsten's styles, all scoped to `#tungsten-root` |
| `bigpicture.custom.*`, `friends.custom.*` | Empty on purpose; Millennium's default patches ask for them |
| `extras/screensaver/` | The optional Big Picture screensaver |
| `source/` | The single source file (`tungsten.html`, which also runs on its own in a browser as a preview) and the build scripts that turn it into the theme files |
| `images/` | The pictures on this page and the store page (the clips live on the `media` branch) |

## License

[MIT](LICENSE). Steam and Steam Big Picture are trademarks of Valve Corporation. PlayStation and PS3 are trademarks of Sony Interactive Entertainment. Tungsten isn't affiliated with or endorsed by either.
