import { useEffect, useState } from 'react'
import { useRecoilState } from "recoil";

import { themeStore } from '../../stores';
import {
  THEME,
  DEFAULT_THEME_KEY,
  getSystemDefaultTheme,
  storeTheme,
  ThemeOptions
} from "../../lib/theme";

const options = [
  {
    label: 'Dark',
    value: ThemeOptions.DARK,
  },
  {
    label: 'Light',
    value: ThemeOptions.LIGHT,
  },
];

const ThemePreferences = () => {
  const defaultTheme = getSystemDefaultTheme();

  const [theme, setTheme] = useRecoilState(themeStore);
  const [selected, setSelected] = useState(theme.selectedTheme);
  const [useDefault, setUseDefault] = useState(theme.useDefault);

  const handleUpdateTheme = ({ selectedTheme, useDefault }: THEME) => {
    setTheme({
      ...theme,
      selectedTheme,
      useDefault,
    });

    storeTheme(selectedTheme);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTheme = event.target.value as ThemeOptions
    setSelected(selectedTheme);
    handleUpdateTheme({ selectedTheme, useDefault: false });
  };

  const setDefaultThemePreference = (useDefaultTheme): void => {
    setUseDefault(useDefaultTheme)
    localStorage.setItem(DEFAULT_THEME_KEY, `${useDefaultTheme}`);
    if (useDefaultTheme) {
      handleUpdateTheme({
        selectedTheme: defaultTheme,
        useDefault: useDefaultTheme,
      });
    }
  };

  useEffect(() => {
    setUseDefault(theme.useDefault)
    setSelected(theme.selectedTheme);
  }, [theme]);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg">Theme preference</h3>

      <p>
        Your theme preference is saved per device. Any newly connected device
        will adopt the preference from the device it was connected by.
      </p>

      <div>
        <div className="form-control items-start">
          <label className="label cursor-pointer">
            <input
              type="checkbox"
              name="use-default-theme"
              className="checkbox checked:bg-base-content"
              checked={useDefault}
              onChange={(event) =>
                setDefaultThemePreference(event.target.checked)
              }
            />
            <span className="label-text text-sm ml-2">Use system default</span>
          </label>
        </div>

        {options.map((option, key) => (
          <div key={key} className="form-control items-start">
            <label className="label cursor-pointer">
              <input
                type="radio"
                name="theme-preference"
                className="radio checked:bg-base-content"
                value={option.value}
                checked={selected === option.value}
                disabled={useDefault}
                onChange={handleChange}
              />
              <span className="label-text text-sm ml-2">{option.label}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThemePreferences;
