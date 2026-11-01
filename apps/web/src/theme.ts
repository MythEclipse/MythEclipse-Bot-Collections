import * as React from "react";

export type Theme = "dark" | "light";

const storageKey = "mytheclipse.theme";
const themeColors: Record<Theme, string> = { dark: "#10120f", light: "#f6f4ec" };

/** The pre-paint script in index.html already resolved this; read it back. */
export function initialTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColors[theme]);
}

export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = React.useState<Theme>(initialTheme);

  const toggle = React.useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(storageKey, next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
