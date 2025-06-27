"use client";

import "./globals.css";
import { useEffect, useRef, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showOverlay, setShowOverlay] = useState(false);
  const lastClickTime = useRef<number | null>(null);
  const DOUBLE_CLICK_DELAY = 400;

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button !== 1) return;

      const now = Date.now();
      if (
        lastClickTime.current &&
        now - lastClickTime.current < DOUBLE_CLICK_DELAY
      ) {
        e.preventDefault();
        setShowOverlay((prev) => !prev);
        lastClickTime.current = null;
      } else {
        lastClickTime.current = now;
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    return () => window.removeEventListener("mousedown", handleMouseDown);
  }, []);

  return (
    <html lang="en">
      <body>
        {children}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-[1500ms] ${
            showOverlay
              ? "opacity-100 bg-opacity-90 pointer-events-auto"
              : "opacity-0 bg-opacity-0 pointer-events-none"
          } bg-black`}
        >
          <img
            src="/stand-by.png"
            alt="Overlay"
            className="w-screen h-screen object-contain"
          />
        </div>
      </body>
    </html>
  );
}
