import { useState, useEffect, useRef, useMemo } from "react";
import { LazyStore } from "@tauri-apps/plugin-store";

const store = new LazyStore("settings.json");

export function useTimer() {
  const [mode, setMode] = useState<"work" | "shortBreak" | "longBreak">("work");
  const [workTime, setWorkTime] = useState(25 * 60);
  const [shortBreakTime, setShortBreakTime] = useState(5 * 60);
  const [longBreakTime, setLongBreakTime] = useState(15 * 60);
  const [remainingTime, setRemainingTime] = useState(workTime);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  //  현재 모드의 전체 시간 (workTime, shortBreakTime, longBreakTime 중 하나)
  const totalTime = useMemo(() => {
    return mode === "work"
      ? workTime
      : mode === "shortBreak"
        ? shortBreakTime
        : longBreakTime;
  }, [mode, workTime, shortBreakTime, longBreakTime]);

  // 저장된 데이터 불러오기
  useEffect(() => {
    async function loadSettings() {
      const savedTime = await store.get("remainingTime");
      const savedMode = await store.get("mode");

      if (typeof savedTime === "number") setRemainingTime(savedTime);
      if (
        savedMode === "work" ||
        savedMode === "shortBreak" ||
        savedMode === "longBreak"
      ) {
        setMode(savedMode);
      }
    }
    loadSettings();
  }, []);

  // 남은 시간 변경될 때마다 저장
  useEffect(() => {
    store.set("remainingTime", remainingTime).then(() => store.save());
  }, [remainingTime]);

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
    setRemainingTime(
      mode === "work"
        ? workTime
        : mode === "shortBreak"
          ? shortBreakTime
          : longBreakTime,
    );
  };

  // 다음 세션 자동 전환
  const handleNextSession = () => {
    if (mode === "work") {
      setCompletedSessions((prev) => prev + 1);
      if ((completedSessions + 1) % 4 === 0) {
        setMode("longBreak");
        setRemainingTime(longBreakTime);
      } else {
        setMode("shortBreak");
        setRemainingTime(shortBreakTime);
      }
    } else {
      setMode("work");
      setRemainingTime(workTime);
    }

    store.set("mode", mode).then(() => store.save());
  };

  // 사용자 설정 시간 변경
  const setDuration = (
    minutes: number,
    type: "work" | "shortBreak" | "longBreak",
  ) => {
    const newTime = minutes * 60;
    if (type === "work") {
      setWorkTime(newTime);
      if (mode === "work") setRemainingTime(newTime);
    } else if (type === "shortBreak") {
      setShortBreakTime(newTime);
      if (mode === "shortBreak") setRemainingTime(newTime);
    } else {
      setLongBreakTime(newTime);
      if (mode === "longBreak") setRemainingTime(newTime);
    }
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
    setDuration,
  };
}
