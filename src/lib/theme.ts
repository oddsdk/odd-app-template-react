export enum THEME {
  LIGHT = 'light',
  DARK = 'dark',
}

/**
 * Load the theme from localStorage or fallback to the osTheme
 * @returns THEME
 */
export const loadTheme = (): THEME => {
  const browserTheme = localStorage.getItem('theme') as THEME;
  const osTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEME.DARK
    : THEME.LIGHT;

  return browserTheme ?? (osTheme as THEME) ?? THEME.LIGHT;
};

/**
 * Store the theme in localStorage
 * @param theme
 * @returns void
 */
export const storeTheme = (theme: THEME): void => localStorage.setItem('theme', theme);
