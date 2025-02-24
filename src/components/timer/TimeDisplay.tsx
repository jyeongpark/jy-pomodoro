"use client";
import { motion } from "framer-motion";

import React from "react";
import { formatSecond } from "../../utils/date";

export interface TimeDisplayProps {
  /** 남은 초 mm:ss 형태 */
  second: number;
  /** 깜빡이 효과 */
  isBlinking: boolean;
}

const TimeDisplay = ({ second, isBlinking }: TimeDisplayProps) => {
  return (
    <motion.text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="20"
      fill="var(--foreground)"
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
    >
      {formatSecond(second)}
    </motion.text>
  );
};

export default TimeDisplay;
