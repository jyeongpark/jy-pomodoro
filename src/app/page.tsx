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
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">
        <CircularTimer
          remainingTime={remainingTime}
          totalTime={totalTime}
          isRunning={isRunning}
          mode={mode}
        />
      </h1>

      <h2 data-cy="mode-display" className="text-lg font-medium">
        {mode === "work"
          ? "Work Time 💪"
          : mode === "shortBreak"
            ? "Short Break ☕"
            : "Long Break 🏖"}
      </h2>

      <div className="flex gap-2">
        <Button
          data-cy="start-button"
          variant={"fill"}
          size={"medium"}
          onClick={startTimer}
          disabled={isRunning}
        >
          Start
        </Button>
        <Button
          data-cy="pause-button"
          variant={"fill"}
          size={"medium"}
          onClick={pauseTimer}
          disabled={!isRunning}
        >
          Pause
        </Button>
        <Button
          data-cy="reset-button"
          variant={"fill"}
          size={"medium"}
          onClick={resetTimer}
        >
          Reset
        </Button>
        <Button
          data-cy="skip-button"
          variant={"fill"}
          size={"medium"}
          onClick={handleNextSession}
        >
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
