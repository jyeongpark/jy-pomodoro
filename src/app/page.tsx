"use client";

import Button from "@/components/common/Button";
import CircularTimer from "@/components/timer/CircularTimer";
import { useTimer } from "@/hooks/useTimer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const {
    totalTime,
    remainingTime,
    isRunning,
    mode,
    startTimer,
    pauseTimer,
    resetTimer,
    handleNextSession,
  } = useTimer();

  return (
    <div>
      <h1 className="text-3xl font-bold">
        <CircularTimer
          remainingTime={remainingTime}
          totalTime={totalTime}
          isRunning={isRunning}
          mode={mode.toLowerCase().includes("break") ? "break" : "work"}
        />
      </h1>

      <h2 className="text-lg font-medium">
        {mode === "work"
          ? "Work Time 💪"
          : mode === "shortBreak"
            ? "Short Break ☕"
            : "Long Break 🏖"}
      </h2>

      <div className="flex gap-2">
        <Button
          variant={"fill"}
          size={"medium"}
          onClick={startTimer}
          disabled={isRunning}
        >
          Start
        </Button>
        <Button
          variant={"fill"}
          size={"medium"}
          onClick={pauseTimer}
          disabled={!isRunning}
        >
          Pause
        </Button>
        <Button variant={"fill"} size={"medium"} onClick={resetTimer}>
          Reset
        </Button>
        <Button variant={"fill"} size={"medium"} onClick={handleNextSession}>
          Skip
        </Button>
      </div>

      <Button
        onClick={() => router.push("/settings")}
        variant={"fill"}
        size={"medium"}
      >
        go to setting
      </Button>
    </div>
  );
}
