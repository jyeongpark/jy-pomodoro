"use client";

import { useTheme } from "@/context/ThemeContext";
import { Theme } from "@/types/theme";

export default function ThemeDropdown() {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <div className="relative inline-block">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as Theme)}
        className="rounded border bg-background px-1 py-2 text-foreground"
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
