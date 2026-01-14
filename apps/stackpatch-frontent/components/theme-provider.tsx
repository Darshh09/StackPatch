"use client";

import { useTheme as useNextThemes } from "next-themes";

type Theme = "dark" | "light";
type Coords = { x: number; y: number };

/**
 * Thin wrapper around `next-themes` that adds a click-position aware `toggleTheme`.
 * Works with the existing `RootProvider` theme setup.
 */
export function useTheme(): {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: (coords?: Coords) => void;
} {
  const { setTheme, resolvedTheme } = useNextThemes();

  const theme: Theme = resolvedTheme === "dark" ? "dark" : "light";

  const handleSetTheme = (next: Theme) => {
    setTheme(next);
  };

  const toggleTheme = (coords?: Coords) => {
    const root = document.documentElement;
    const next: Theme = theme === "light" ? "dark" : "light";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (coords) {
      root.style.setProperty("--x", `${coords.x}px`);
      root.style.setProperty("--y", `${coords.y}px`);
    }

    // If View Transitions isn't available (or user prefers reduced motion), just switch.
    if (prefersReducedMotion || typeof document.startViewTransition !== "function") {
      handleSetTheme(next);
      return;
    }

    // Call startViewTransition with proper context
    document.startViewTransition(() => {
      handleSetTheme(next);
    });
  };

  return { theme, setTheme: handleSetTheme, toggleTheme };
}

