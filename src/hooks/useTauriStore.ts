import { LazyStore } from "@tauri-apps/plugin-store";
import { useEffect, useState } from "react";
import { isTauri } from "@tauri-apps/api/core"; // Tauri 환경 감지

// 클라이언트에서만 LazyStore를 로드
const useTauriStore = () => {
  const [store, setStore] = useState<LazyStore | null>(null);

  useEffect(() => {
    const loadTauriStore = async () => {
      if (typeof window === "undefined") return; // SSR 방지

      try {
        if (!isTauri()) return;
        const { LazyStore } = await import("@tauri-apps/plugin-store");
        setStore(new LazyStore("store.json"));
      } catch (error) {
        console.error("Tauri Store 로드 실패:", error);
      }
    };

    loadTauriStore();
  }, []);

  return store;
};

export default useTauriStore;
