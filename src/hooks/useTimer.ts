"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import useTauriStore from "./useTauriStore";
import { LazyStore } from "@tauri-apps/plugin-store";
import { TimerMode } from "@/types/timer";

export function useTimer() {
  const store = useTauriStore(); // store는 Tauri 환경에서만 초기화됨

  const [mode, setMode] = useState<TimerMode>("work"); // 기본 모드는 'work'

  // duration 객체로 시간을 관리
  const [duration, setDuration] = useState<{ [key in TimerMode]: number }>({
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  });

  const [remainingTime, setRemainingTime] = useState(duration[mode]); // 초기 타이머 시간
  const [isRunning, setIsRunning] = useState(false); // 타이머 실행 여부
  const [completedSessions, setCompletedSessions] = useState(0); // 완료된 세션 수
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // 타이머 interval을 참조

  // 현재 모드의 전체 시간 (duration 객체에서 선택)
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
          savedMode &&
          (savedMode === "work" ||
            savedMode === "shortBreak" ||
            savedMode === "longBreak")
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

  // 모드나 실행 상태가 바뀌면 타이머 재설정
  useEffect(() => {
    // 기존 타이머 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // 새로운 타이머 시작
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!); // 타이머 종료
            handleNextSession(); // 세션 변경
            return 0;
          }
          return prev - 1; // 남은 시간이 1초씩 줄어듬
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [mode, isRunning]);

  // 타이머 시작
  const startTimer = () => {
    if (isRunning) return; // 이미 타이머가 실행 중이면 중복 실행 방지
    setIsRunning(true);

    // 이전 타이머가 있으면 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // 타이머 일시 정지
  const pauseTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null; // intervalRef를 null로 초기화
    }
  };

  // 타이머 초기화
  const resetTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current); // 타이머 종료
      intervalRef.current = null; // intervalRef를 null로 초기화
    }
    setRemainingTime(duration[mode]); // 현재 모드의 초기 시간으로 초기화
  };

  // 세션 변경
  const handleNextSession = () => {
    let nextMode: TimerMode;
    if (mode === "work") {
      const nextSessions = completedSessions + 1;

      // 4번의 work 후 longBreak
      if (nextSessions % 4 === 0) {
        nextMode = "longBreak";
      } else {
        nextMode = "shortBreak";
      }

      setCompletedSessions(nextSessions); // 세션 완료 수 증가
    } else {
      nextMode = "work";
    }

    setMode(nextMode); // 모드 변경
    setRemainingTime(duration[nextMode]); // 현재 모드의 초기 시간으로 초기화
  };

  // 사용자 설정 시간 변경
  const updateDuration = (
    minutes: number,
    type: "work" | "shortBreak" | "longBreak",
  ) => {
    const newTime = minutes * 60;

    setDuration((prev) => {
      const newDuration = { ...prev, [type]: newTime };
      if (mode === type) setRemainingTime(newTime); // 현재 모드와 동일하면 남은 시간도 변경
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
