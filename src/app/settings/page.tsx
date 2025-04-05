"use client";

import {} from "react";

import { useRouter } from "next/navigation";
import ThemeDropdown from "@/components/ThemeDropdown";
import Button from "@/components/common/Button";
import Stepper from "@/components/common/Stepper";

const Settings = () => {
  const router = useRouter();

  const moveHome = () => {
    router.replace("/");
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div>
        <h1>테마 설정</h1>
        <ThemeDropdown />
      </div>
      <div>
        <h1>시간 설정</h1>
        <Stepper />
      </div>

      <Button onClick={moveHome} variant={"fill"} size={"small"}>
        홈으로
      </Button>
    </div>
  );
};

export default Settings;
