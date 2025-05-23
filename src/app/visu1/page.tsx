// components/Visu1.tsx or Visu1.jsx
"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import Webcam with SSR disabled
const Webcam = dynamic(() => import("react-webcam"), { ssr: false });

function Visu1() {
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const colorCycleRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const webcam = webcamRef.current;
      const canvas = canvasRef.current;
      if (!webcam || !canvas || !webcam.video) return;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(webcam.video, 0, 0, canvas.width, canvas.height);

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;
      const time = Date.now() / 1000;

      for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

        // Animate hue shift over time
        const hue = (brightness + time * 50) % 360;
        const [r, g, b] = hslToRgb(hue / 360, 1, 0.5);

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }

      ctx.putImageData(frame, 0, 0);
    }, 33); // ~30fps

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <Webcam
        ref={webcamRef}
        audio={false}
        width={4}
        height={4}
        screenshotFormat="image/png"
        videoConstraints={videoConstraints}
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{
          filter: "blur(6px) contrast(1.7) saturate(2.5)",
          borderRadius: "12px",
        }}
      />
    </div>
  );
}

// Utility: HSL to RGB
function hslToRgb(h, s, l) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r * 255, g * 255, b * 255];
}

export default Visu1;
