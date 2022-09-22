import { createContext, useLayoutEffect, useState, type ReactNode } from 'react';

export enum THEME {
  LIGHT = 'light',
  DARK = 'dark',
}

/**
 * Load the theme from localStorage or fallback to the osTheme
 * @returns THEME
 */
const loadTheme = (): THEME => {
  const browserTheme = localStorage.getItem('theme') as THEME;
  const osTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEME.DARK
    : THEME.LIGHT;

  return browserTheme ?? (osTheme as THEME) ?? "light";
};

// Create Theme Context
const ThemeContext = createContext({
  theme: loadTheme(),
  updateTheme: (theme: THEME) => {},
});

export default ThemeContext;

// Create Theme Provider
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(loadTheme());

  // paints the app before it renders elements
  useLayoutEffect(() => {
    const lastTheme = loadTheme();
    updateTheme(lastTheme);

    // if state changes, repaint the app
  }, [theme]);

  const updateTheme = (theme: THEME): void => {
    setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        updateTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
