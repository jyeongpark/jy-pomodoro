"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import TimeDisplay from "./TimeDisplay";
import { Mode } from "@/types/timer";

export interface CircularTimerProps {
  /** 전체 시간 (초 단위) */
  totalTime: number;
  /** 남은 시간 (초 단위) */
  remainingTime: number;
  /** 모드 (작업, 휴식) */
  mode: Mode;
  /** 작동중 */
  isRunning: boolean;
  /** 원 크기 */
  size?: number;
  /** 외부 선 두께 */
  outerStrokeWidth?: number;
  /** 내부 선 두께 */
  innerStrokeWidth?: number;
}

const CircularTimer = ({
  totalTime,
  remainingTime,
  mode,
  isRunning,
  size = 120,
  outerStrokeWidth = 2,
  innerStrokeWidth = 30,
}: CircularTimerProps) => {
  const [isBlinking, setIsBlinking] = useState(false); // 60초 남았을 때 깜빡임

  const outerRadius = (size - outerStrokeWidth) / 2;
  const innerRadius = (size - innerStrokeWidth) / 2;
  const circumference = 2 * Math.PI * innerRadius; // 내부 둘레

  // 최초 설정 타이머 (60분 기준, secondary color)
  const fullTimeOffset = circumference * (1 - Math.min(totalTime / 3600, 1));

  // remainingTime 진행 원 (60분 기준, primary color)
  const remainingOffset =
    circumference * (1 - Math.min(remainingTime / 3600, 1));

  // 타이머가 끝나면 깜빡이기 시작
  useEffect(() => {
    if (remainingTime <= 60) {
      setIsBlinking(true); // 타이머가 60초가 남으면
    } else {
      setIsBlinking(false);
    }
  }, [remainingTime]);

  // 시계 눈금 (5분 = 긴 선, 1분 = 짧은 점)
  const renderClockMarks = () => {
    const marks = [];
    for (let i = 0; i < 60; i++) {
      const angle = (i * 360) / 60 - 90; // 12시 기준
      const rad = (angle * Math.PI) / 180;

      // 바깥 원 위치
      const outerX = size / 2 + Math.cos(rad) * (size / 2);
      const outerY = size / 2 + Math.sin(rad) * (size / 2);

      // 안쪽 원 위치 (긴 선 or 짧은 점)
      const innerX =
        size / 2 +
        Math.cos(rad) *
          (outerRadius -
            (i % 5 === 0 ? outerStrokeWidth + 5 : outerStrokeWidth));
      const innerY =
        size / 2 +
        Math.sin(rad) *
          (outerRadius -
            (i % 5 === 0 ? outerStrokeWidth + 5 : outerStrokeWidth));

      marks.push(
        <motion.line
          key={i}
          x1={outerX}
          y1={outerY}
          x2={innerX}
          y2={innerY}
          stroke={"var(--foreground)"}
          strokeWidth={i % 5 === 0 ? 2 : 1}
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
        />,
      );
    }
    return marks;
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={outerRadius}
        stroke="var(--foreground)"
        strokeWidth={outerStrokeWidth}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} // 12시 기준
        fill="var(--background)"
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

      {/* 전체 원 (연한 회색, 60분 기준) */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={innerRadius}
        stroke={mode === "work" ? "var(--secondary)" : "var(--break-secondary)"}
        strokeWidth={innerStrokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={fullTimeOffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} // 12시 기준
        initial={{ opacity: 0.4 }} // 연하게 보이도록 설정
        animate={{
          opacity: isBlinking ? [0.4, 0, 0.4] : [0.4],
        }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />

      {/* remainingTime 진행 원 (진한 색상) */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={innerRadius}
        stroke={mode === "work" ? "var(--primary)" : "var(--break-primary)"}
        strokeWidth={innerStrokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={remainingOffset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`} // 12시 기준
        initial={{ strokeDashoffset: circumference, opacity: 1 }}
        animate={{
          strokeDashoffset: remainingOffset,
          opacity: isBlinking ? [1, 0, 1] : [1],
        }}
        transition={
          isRunning
            ? {
                duration: 1,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }
            : { duration: 0 }
        }
      />

      {/* 5분(긴 선), 1분(짧은 점) 표시 */}
      {renderClockMarks()}

      {/* 남은 시간 텍스트 */}
      <TimeDisplay second={remainingTime} isBlinking={isBlinking} />
    </svg>
  );
};

export default CircularTimer;
