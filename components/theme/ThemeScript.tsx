/**
 * Pre-hydration theme setup. A tiny synchronous script that runs in the
 * document head before first paint: it reads the stored preference and adds the
 * `dark` class to <html> when needed, so there is no flash of the wrong theme.
 *
 * Default is light: only an explicit stored value of "dark" switches the skin.
 * A visitor with no stored preference (even on a dark-mode OS) always gets the
 * warm white default, as the brief requires. The OS preference is deliberately
 * NOT consulted here.
 *
 * @module components/theme/ThemeScript
 */

/** Storage key shared with {@link components/theme/ThemeToggle}. */
export const THEME_STORAGE_KEY = "theme";

/** UA chrome colors per theme; must match `--background` in globals.css. */
export const THEME_COLOR = { light: "#f7f5f0", dark: "#0a0a0b" } as const;

const SCRIPT = `(function(){try{var d=localStorage.getItem('${THEME_STORAGE_KEY}')==='dark';var e=document.documentElement;e.classList[d?'add':'remove']('dark');var m=document.querySelector('meta[name="theme-color"]');if(m){m.setAttribute('content',d?'${THEME_COLOR.dark}':'${THEME_COLOR.light}');}}catch(e){}})();`;

/** Blocking inline script; render once, first in <body> of the root layout. */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
