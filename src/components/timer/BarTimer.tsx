"use client";

import { motion } from "framer-motion";
import TimeDisplay from "./TimeDisplay";
import { useEffect, useState } from "react";
import { TimerMode } from "@/types/timer";

export interface BarTimerProps {
  /** 전체 시간 (초 단위) */
  totalTime: number;
  /** 모드 (작업, 휴식) */
  remainingTime: number;
  /** 모드 (작업, 휴식) */
  mode: TimerMode;
  /** 작동중 */
  isRunning: boolean;
  /** 정사각형 크기  (px)*/
  size?: number;
  /** 선 두께 (px) */
  strokeWidth?: number;
}

const BarTimer = ({
  totalTime,
  remainingTime,
  mode,
  isRunning,
  size = 120,
  strokeWidth = 20,
}: BarTimerProps) => {
  const [isBlinking, setIsBlinking] = useState(false); // 진행중 && 60초 이하 깜빡임

  const progress = (remainingTime / totalTime) * size;

  // 타이머가 끝나가면 깜빡이기 시작
  useEffect(() => {
    if (remainingTime <= 60 && isRunning) {
      setIsBlinking(true); // 타이머가 60초가 남으면
    } else {
      setIsBlinking(false);
    }
  }, [remainingTime, isRunning]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 남은 시간 텍스트 */}
      <TimeDisplay second={remainingTime} isBlinking={isBlinking} />
      {/* bar 전체 길이 */}
      <motion.line
        x1={0}
        y1={size}
        x2={size}
        y2={size}
        stroke={mode === "work" ? "var(--secondary)" : "var(--break-secondary)"}
        strokeWidth={strokeWidth}
        initial={{ opacity: 1 }}
        animate={{
          opacity: isBlinking ? [1, 0, 1] : [1],
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
      {/* 남은 시간 / 전체 시간 */}
      <motion.line
        x1={size - progress}
        y1={size}
        x2={size}
        y2={size}
        stroke={mode === "work" ? "var(--primary)" : "var(--break-primary)"}
        strokeWidth={strokeWidth}
        initial={{ opacity: 1 }}
        animate={{
          opacity: isBlinking ? [1, 0, 1] : [1],
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
    </svg>
  );
};

export default BarTimer;
