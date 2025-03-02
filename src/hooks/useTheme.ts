"use client";

import { useState, useEffect } from "react";
import { Theme } from "@/types/theme";
import useTauriStore from "./useTauriStore";
import { LazyStore } from "@tauri-apps/plugin-store";

export function useTheme() {
  const store = useTauriStore(); // store는 Tauri 환경에서만 초기화됨

  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    if (store instanceof LazyStore) {
      async function loadTheme(store: LazyStore) {
        const savedTheme = (await store.get("theme")) as Theme;
        if (savedTheme === "light" || savedTheme === "dark") {
          setTheme(savedTheme);
          document.documentElement.setAttribute("data-theme", savedTheme);
        } else {
          store?.set("theme", theme).then(() => store.save());
        }
      }
      loadTheme(store);
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [store, theme]);

  const onChangeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    if (store) {
      store.set("theme", newTheme).then(() => store.save());
    }
  };

  return { theme, onChangeTheme };
}
