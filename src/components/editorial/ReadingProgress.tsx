"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const p = total > 0 ? h.scrollTop / total : 0;
      setProgress(Math.max(0, Math.min(1, p)));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed top-16 inset-x-0 h-[2px] z-30 pointer-events-none"
      aria-hidden
    >
      <div
        className="reading-progress h-full bg-brand"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
