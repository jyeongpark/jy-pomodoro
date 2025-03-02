"use client";

import { useTheme } from "@/hooks/useTheme";
import { Theme } from "@/types/theme";
import { createContext, ReactNode, useContext } from "react";

interface ThemeContextProps {
  theme: Theme;
  onChangeTheme: (theme: Theme) => void;
  availableThemes: Theme[];
}

const themes: Theme[] = ["light", "dark"]; // 추가 가능!

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { theme, onChangeTheme } = useTheme();

  return (
    <ThemeContext.Provider
      value={{ theme, onChangeTheme, availableThemes: themes }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeProvider, useThemeContext };
