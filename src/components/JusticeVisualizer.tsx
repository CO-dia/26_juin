"use client";

import { useEffect, useRef } from "react";

export default function JusticeVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let animationId: number;
    let hue = 0;

    const setup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.6;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        source.connect(analyser);

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const baseRadius = 70;
        const spikeHeight = 70;

        const draw = () => {
          animationId = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);

          // Slowly fade old frames
          ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
          ctx.fillRect(0, 0, w, h);

          ctx.save();
          ctx.translate(cx, cy);
          ctx.beginPath();

          const len = dataArray.length;
          const angleStep = (Math.PI * 2) / len;

          for (let i = 0; i <= len; i++) {
            const index = i % len;
            const angle = i * angleStep;
            const amp = dataArray[index] / 255;
            const r = baseRadius + amp * spikeHeight;

            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.closePath();

          // 🌈 Animate hue over time
          hue = (hue + 1) % 360;
          const color = `hsl(${hue}, 100%, 60%)`;

          ctx.strokeStyle = color;
          ctx.shadowBlur = 20;
          ctx.shadowColor = color;
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.restore();
        };

        draw();
      } catch (err) {
        console.error("Microphone access error:", err);
      }
    };

    setup();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (audioContext) audioContext.close();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      style={{
        backgroundColor: "#000",
        borderRadius: "12px",
        display: "block",
        margin: "auto",
      }}
    />
  );
}
