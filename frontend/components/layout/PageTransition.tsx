"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef, ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const isFirst = useRef(true);

  useEffect(() => {
    // Skip the very first render — only animate on subsequent navigations
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    // Step 1: instantly hide new content (no transition)
    setShow(false);

    // Step 2: wait two animation frames so the browser has painted the hidden
    // state, then enable the CSS transition and reveal
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(raf2);
    });

    return () => cancelAnimationFrame(raf1);
  }, [pathname]);

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0px)" : "translateY(14px)",
        transition: show ? "opacity 0.32s ease, transform 0.32s ease" : "none",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
