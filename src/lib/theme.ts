export enum ThemeOptions {
  LIGHT = 'light',
  DARK = 'dark',
}

export type THEME = {
  selectedTheme: ThemeOptions;
  useDefault: boolean;
};

export const DEFAULT_THEME_KEY = "useDefaultTheme";
export const THEME_KEY = "theme";

export const getSystemDefaultTheme = (): ThemeOptions =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? ThemeOptions.DARK
    : ThemeOptions.LIGHT;

/**
 * Load the theme from localStorage or fallback to the osTheme
 * @returns THEME
 */
export const loadTheme = (): THEME => {
  const useDefault =
    localStorage.getItem(DEFAULT_THEME_KEY) !== "undefined" &&
    JSON.parse(localStorage.getItem(DEFAULT_THEME_KEY));
  const browserTheme = localStorage.getItem(THEME_KEY) as ThemeOptions;
  const osTheme = getSystemDefaultTheme();

  if (useDefault) {
    return {
      selectedTheme: getSystemDefaultTheme(),
      useDefault,
    };
  }

  return {
    selectedTheme: browserTheme ?? (osTheme as ThemeOptions) ?? ThemeOptions.LIGHT,
    useDefault,
  };
};

/**
 * Store the theme in localStorage
 * @param theme
 * @returns void
 */
export const storeTheme = (theme: ThemeOptions): void => localStorage.setItem('theme', theme);
