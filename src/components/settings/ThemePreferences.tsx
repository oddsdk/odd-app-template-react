import { useState } from 'react'
import { useRecoilState } from "recoil";

import { themeStore } from '../../stores';
import { THEME, storeTheme } from "../../lib/theme";

const options = [
  {
    label: 'Dark',
    value: THEME.DARK,
  },
  {
    label: 'Light',
    value: THEME.LIGHT,
  },
];

const ThemePreferences = () => {
  const [theme, setTheme] = useRecoilState(themeStore);
  const [selected, setSelected] = useState(theme);

  const handleUpdateTheme = (newTheme: THEME) => {
    setTheme(newTheme);
    storeTheme(newTheme)
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected(event.target.value as THEME);
    handleUpdateTheme(event.target.value as THEME);
  };

  return (
    <>
      <h3 className="text-lg mb-4">Theme preference</h3>

      {options.map((option, key) => (
        <div key={key} className="form-control items-start">
          <label className="label cursor-pointer">
            <input
              type="radio"
              name="theme-preference"
              className="radio checked:bg-base-content"
              value={option.value}
              checked={selected === option.value}
              onChange={handleChange}
            />
            <span className="label-text text-sm ml-2">{option.label}</span>
          </label>
        </div>
      ))}
    </>
  );
}

export default ThemePreferences;
