"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import useTauriStore from "./useTauriStore";
import { LazyStore } from "@tauri-apps/plugin-store";
import { TimerMode } from "@/types/timer";

export function useTimer() {
  const store = useTauriStore(); // store는 Tauri 환경에서만 초기화됨

  const [mode, setMode] = useState<TimerMode>("work");

  // duration 객체로 시간을 관리
  const [duration, setDuration] = useState<{ [key in TimerMode]: number }>({
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  });

  const [remainingTime, setRemainingTime] = useState(duration[mode]);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  //  현재 모드의 전체 시간 (duration 객체에서 선택)
  const totalTime = useMemo(() => {
    return duration[mode];
  }, [mode, duration]);

  // 저장된 데이터 불러오기
  useEffect(() => {
    if (store instanceof LazyStore) {
      async function loadSettings(store: LazyStore) {
        const savedTime = await store.get("remainingTime");
        const savedMode = await store.get("mode");
        const savedDuration =
          await store.get<{ [key in TimerMode]: number }>("duration");

        if (typeof savedTime === "number") setRemainingTime(savedTime);
        if (
          savedMode === "work" ||
          savedMode === "shortBreak" ||
          savedMode === "longBreak"
        ) {
          setMode(savedMode);
        }
        if (savedDuration && typeof savedDuration === "object") {
          setDuration(savedDuration);
        }
      }
      loadSettings(store);
    }
  }, [store]);

  // 남은 시간, 모드, duration 객체 변경될 때마다 저장
  useEffect(() => {
    if (store) {
      store.set("remainingTime", remainingTime);
      store.set("mode", mode);
      store.set("duration", duration);
      store.save();
    }
  }, [remainingTime, mode, duration, store]);

  // 다음 세션 자동 전환
  const handleNextSession = () => {
    if (mode === "work") {
      setCompletedSessions((prev) => prev + 1);
      if ((completedSessions + 1) % 4 === 0) {
        setMode("longBreak");
        setRemainingTime(duration.longBreak);
      } else {
        setMode("shortBreak");
        setRemainingTime(duration.shortBreak);
      }
    } else {
      setMode("work");
      setRemainingTime(duration.work);
    }
  };

  // 타이머 시작
  const startTimer = () => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          handleNextSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 타이머 일시 정지
  const pauseTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current!);
  };

  // 타이머 초기화
  const resetTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current!);
    setRemainingTime(duration[mode]);
  };

  // 사용자 설정 시간 변경
  const updateDuration = (
    minutes: number,
    type: "work" | "shortBreak" | "longBreak",
  ) => {
    const newTime = minutes * 60;

    setDuration((prev) => {
      const newDuration = { ...prev, [type]: newTime };
      if (mode === type) setRemainingTime(newTime);
      return newDuration;
    });
  };

  return {
    totalTime,
    remainingTime,
    isRunning,
    mode,
    startTimer,
    pauseTimer,
    resetTimer,
    handleNextSession,
    updateDuration,
  };
}
