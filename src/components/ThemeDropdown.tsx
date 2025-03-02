"use client";

import { useThemeContext } from "@/context/ThemeContext";
import { Theme } from "@/types/theme";

export default function ThemeDropdown() {
  const { theme, onChangeTheme, availableThemes } = useThemeContext();

  return (
    <div className="relative inline-block">
      <select
        value={theme}
        onChange={(e) => onChangeTheme(e.target.value as Theme)}
        className="text-foreground rounded border bg-background px-1 py-2"
      >
        {availableThemes.map((t) => (
          <option key={t} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
