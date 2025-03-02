import { useState, useEffect } from "react";
import { LazyStore } from "@tauri-apps/plugin-store";
import { Theme } from "@/types/theme";

const store = new LazyStore("settings.json");

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    async function loadTheme() {
      const savedTheme = (await store.get("theme")) as Theme;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    }
    loadTheme();
  }, []);

  const onChangeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    store.set("theme", newTheme).then(() => store.save());
  };

  return { theme, onChangeTheme };
}
