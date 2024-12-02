import React, {
  memo,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import { Theme, ThemeName } from "./types";
import { DEFAULT_THEME } from "./default.theme";

interface ProvidedValue {
  theme: Theme;
  toggleTheme: () => void;
}

interface Props {
  initial: Theme;
  children?: ReactNode;
}

const ThemeContext = React.createContext<ProvidedValue>({
  theme: DEFAULT_THEME,
  toggleTheme: () => {},
});

export const ThemeProvider = memo((props: Props) => {
  const [theme, setTheme] = useState<Theme>(props.initial);

  const ToggleThemeCallback = useCallback(() => {
    setTheme((currentTheme) => {
      if (currentTheme.name === ThemeName.Default) {
        return DEFAULT_THEME;
      }
      return currentTheme;
    });
  }, []);

  const providedValue: ProvidedValue = {
    theme,
    toggleTheme: ToggleThemeCallback,
  };

  return (
    <ThemeContext.Provider value={providedValue}>
      {props.children}
    </ThemeContext.Provider>
  );
});
// Creating a custom context consumer hook for function components
export const useTheme = () => useContext(ThemeContext);
