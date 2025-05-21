"use client";

import { Italiana } from "next/font/google";
import { TypeAnimation } from "react-type-animation";

const italiana = Italiana({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-italiana",
});

export default function Heni() {
  return (
    <div
      className={`${italiana.className} text-9xl w-screen h-screen flex items-center justify-center`}
    >
      <div className="relative flex items-center justify-center">
        {/* Left animated part */}
        <TypeAnimation
          sequence={[
            "",
            3000,
            "",
            500,
            "Le\u00A0",
            3000,
            "",
            500,
            "POC",
            3000,
            "",
            800,
          ]}
          wrapper="span"
          speed={{ type: "keyStrokeDelayInMs", value: 250 }}
          deletionSpeed={{ type: "keyStrokeDelayInMs", value: 250 }}
          repeat={Infinity}
          cursor={false}
          className="text-right inline-block min-w-[6ch]" // fix width for alignment
        />

        {/* Center H */}
        <span className="inline-block w-[1ch] text-center">H</span>

        {/* Right animated part */}
        <TypeAnimation
          sequence={[
            "ENI",
            3000,
            "",
            500,
            "",
            3000,
            "",
            800,
            "O",
            2700,
            "",
            800,
          ]}
          wrapper="span"
          speed={{ type: "keyStrokeDelayInMs", value: 250 }}
          deletionSpeed={{ type: "keyStrokeDelayInMs", value: 250 }}
          repeat={Infinity}
          className="text-left inline-block min-w-[6ch]"
        />
      </div>
    </div>
  );
}
