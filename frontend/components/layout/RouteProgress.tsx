"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function RouteProgress() {
  const pathname = usePathname();
  const [width, setWidth] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const isFirst = useRef(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clear = () => timers.current.forEach(clearTimeout);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    clear();

    // Reset to start
    setWidth(0);
    setOpacity(1);

    const t1 = setTimeout(() => setWidth(30),  20);   // quick jump to 30%
    const t2 = setTimeout(() => setWidth(65),  150);  // ease to 65%
    const t3 = setTimeout(() => setWidth(90),  450);  // slow crawl to 90%
    const t4 = setTimeout(() => setWidth(100), 700);  // complete
    const t5 = setTimeout(() => setOpacity(0), 900);  // fade out bar
    const t6 = setTimeout(() => setWidth(0),   1100); // reset for next nav

    timers.current = [t1, t2, t3, t4, t5, t6];
    return clear;
  }, [pathname]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: `${width}%`,
        opacity,
        background: "linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #f59e0b 100%)",
        boxShadow: "0 0 12px rgba(124, 58, 237, 0.7)",
        transition: [
          width === 0   ? "none"                          : null,
          width === 100 ? "width 0.2s ease"               : "width 0.35s ease",
          opacity === 0 ? "opacity 0.2s ease 0.1s"        : null,
        ].filter(Boolean).join(", ") || "none",
        zIndex: 99999,
        pointerEvents: "none",
        borderRadius: "0 4px 4px 0",
      }}
    />
  );
}
