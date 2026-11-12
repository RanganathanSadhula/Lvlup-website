"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LearningRedirectPage() {
  const router = useRouter();
  const { activeStudent } = useAuth();

  useEffect(() => {
    const studentId = activeStudent?.id || "aarav";
    router.replace(`/learning/${studentId}`);
  }, [activeStudent, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F4F3EE]">
      <div className="size-6 animate-spin rounded-full border-2 border-[#FF6026] border-t-transparent" />
    </div>
  );
}

