"use client";

import { TooltipWrapper } from "@/components/tooltip-wrapper";
import { ThemeToggleButton } from "@/components/theme-toggle-advanced";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="px-2">
        <div className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="px-2">
      <TooltipWrapper label="Toggle light/dark mode" asChild>
        <ThemeToggleButton variant="circle" start="bottom-center" />
      </TooltipWrapper>
    </div>
  );
}
