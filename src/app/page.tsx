"use client";

import Button from "@/components/common/Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
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
