"use client";

import { Italiana } from "next/font/google";
import { useEffect, useState } from "react";

const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italiana",
});

const sequence = [
  { left: "", right: "ENI", delay: 3000 },
  { left: "Le\u00A0", right: "", delay: 3000 },
  { left: "POC", right: "O", delay: 5000 },
];

const TYPING_SPEED = 300; // ms per character
const DELETING_SPEED = 300;

export default function Heni() {
  const [stepIndex, setStepIndex] = useState(0);
  const [displayedLeft, setDisplayedLeft] = useState("");
  const [displayedRight, setDisplayedRight] = useState("");
  const [mode, setMode] = useState<"typing" | "deleting">("typing");

  useEffect(() => {
    const { left, right, delay } = sequence[stepIndex];

    const fullLeft = left;
    const fullRight = right;

    const maxLength = Math.max(fullLeft.length, fullRight.length);
    let charIndex = 0;

    const interval = setInterval(
      () => {
        charIndex++;

        if (mode === "typing") {
          setDisplayedLeft(fullLeft.slice(0, charIndex));
          setDisplayedRight(fullRight.slice(0, charIndex));
          if (charIndex >= maxLength) {
            clearInterval(interval);
            setTimeout(() => setMode("deleting"), delay);
          }
        } else {
          setDisplayedLeft(fullLeft.slice(0, maxLength - charIndex));
          setDisplayedRight(fullRight.slice(0, maxLength - charIndex));
          if (charIndex >= maxLength) {
            clearInterval(interval);
            setMode("typing");
            setStepIndex((prev) => (prev + 1) % sequence.length);
          }
        }
      },
      mode === "typing" ? TYPING_SPEED : DELETING_SPEED
    );

    return () => clearInterval(interval);
  }, [stepIndex, mode]);

  return (
    <div
      className={`${italiana.className} text-9xl w-screen h-screen flex items-center justify-center`}
    >
      <div className="flex justify-center ">
        <span className="text-right inline-block min-w-[6ch] relative">
          {displayedLeft}
        </span>

        <span className="inline-block w-[1ch] text-center">H</span>

        {/* Right with cursor */}
        <span className="text-left inline-block min-w-[6ch] relative">
          {displayedRight}
          {/* <span className="blinking-cursor">|</span> */}
        </span>
      </div>
      {/*       <div className="relative flex items-center justify-center">
        <TypeAnimation
          sequence={[
            "HENI",
            3000,
            "",
            500,
            "Le H",
            3000,
            "",
            500,
            "POCHO",
            3000,
            "",
            1000,
          ]}
          wrapper="span"
          speed={5}
          deletionSpeed={5}
          repeat={Infinity}
          className="text-left inline-block min-w-[6ch]"
        />
      </div> */}
    </div>
  );
}
