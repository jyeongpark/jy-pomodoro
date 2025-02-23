"use client";

import {} from "react";

import { useRouter } from "next/navigation";
import ThemeDropdown from "@/components/ThemeDropdown";
import Button from "@/components/common/Button";

const Settings = () => {
  const router = useRouter();

  const moveHome = () => {
    router.replace("/");
  };

  return (
    <div className="flex justify-normal p-4">
      <h1>테마 설정</h1>
      <ThemeDropdown />
      <Button onClick={moveHome} variant={"fill"} size={"small"}>
        홈으로
      </Button>
    </div>
  );
};

export default Settings;
