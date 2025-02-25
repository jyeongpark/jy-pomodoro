import React, { useEffect, useState } from "react";

import type { Meta } from "@storybook/react";

import BarTimer, { BarTimerProps } from "@/components/timer/BarTimer";

const meta = {
  title: "Components/BarTimer",
  component: BarTimer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    totalTime: { control: { type: "number" } },
    remainingTime: {
      control: { type: "number" },
    },
    size: {
      control: { type: "number" },
    },
    strokeWidth: { type: "number" }, // 내부 선 두께
  },
  args: {
    totalTime: 300,
    remainingTime: 202,
    size: 120,
    strokeWidth: 20,
  },
} satisfies Meta<typeof BarTimer>;

export default meta;

export const Default = (args: BarTimerProps) => {
  const { remainingTime, ...rest } = args;
  const [time, setTime] = useState(remainingTime); // 타이머 시작 값: 60초

  // 타이머가 1초마다 줄어들도록 설정
  const startTimer = () => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0; // 타이머가 끝나면 정지
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 타이머 시작
  useEffect(() => {
    startTimer();
  }, []);

  return (
    <div>
      <BarTimer {...rest} remainingTime={time} />
    </div>
  );
};
