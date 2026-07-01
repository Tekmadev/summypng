"use client";

import { MoonIcon, SunIcon } from "@/components/site/icons";
import { THEME_COLOR, THEME_STORAGE_KEY } from "@/components/theme/ThemeScript";

/**
 * Light/dark theme toggle for the header bar.
 *
 * The theme is a `dark` class on <html>, set before paint by
 * {@link ThemeScript}. This control flips that class and persists the choice.
 * Which glyph shows is driven entirely by CSS (the `dark:` variant), not React
 * state: a moon in light mode (tap to go dark), a sun in dark mode (tap to go
 * light). Keeping it stateless means no hydration mismatch and no icon flash
 * for visitors who stored a dark preference.
 *
 * @module components/theme/ThemeToggle
 */
export function ThemeToggle({ className = "" }: { readonly className?: string }) {
  const toggle = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    // Keep the mobile UA chrome color in sync with the page.
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDark ? THEME_COLOR.dark : THEME_COLOR.light);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    } catch {
      // Private mode / storage disabled: the toggle still works for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className={`inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-foreground/80 transition-colors duration-300 ease-cinematic hover:text-foreground ${className}`}
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
      <span className="sr-only">Toggle light and dark theme</span>
    </button>
  );
}
