import React, { useEffect, useState } from "react";

import type { Meta } from "@storybook/react";

import CircularTimer, {
  CircularTimerProps,
} from "@/components/timer/CircularTimer";

const meta = {
  title: "Components/CircularTimer",
  component: CircularTimer,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    totalTime: { control: { type: "number" } },
    remainingTime: {
      control: { type: "number" },
    },
    size: { type: "number" }, // 원 크기
    outerStrokeWidth: { type: "number" }, // 외부 선 두께
    innerStrokeWidth: { type: "number" }, // 내부 선 두께
  },
  args: {
    totalTime: 3400,
    remainingTime: 59,
    mode: "work",
    size: 120,
    outerStrokeWidth: 2,
    innerStrokeWidth: 30,
  },
} satisfies Meta<typeof CircularTimer>;

export default meta;

export const Default = (args: CircularTimerProps) => {
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
      <CircularTimer {...rest} remainingTime={time} />
    </div>
  );
};
