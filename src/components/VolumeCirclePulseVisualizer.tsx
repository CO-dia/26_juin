"use client";

import { useEffect, useRef } from "react";

export default function VolumeCirclePulseMic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let animationId: number;

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

        const centers = [
          { x: w / 4, y: h / 2 },
          { x: w / 2, y: h / 2 },
          { x: (3 * w) / 4, y: h / 2 },
        ];

        const drawRadial = (
          cx: number,
          cy: number,
          radius: number,
          sliceOffset: number
        ) => {
          const len = dataArray.length / centers.length;
          const start = Math.floor(sliceOffset * len);
          const end = Math.floor(start + len);
          const angleStep = (Math.PI * 2) / len;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.beginPath();

          for (let i = 0; i <= len; i++) {
            const index = start + (i % len);
            const angle = i * angleStep;
            const amp = dataArray[index] / 255;
            const r = radius + amp * 40;

            const x = r * Math.cos(angle);
            const y = r * Math.sin(angle);

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }

          ctx.closePath();
          ctx.strokeStyle = "aqua";
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        };

        const draw = () => {
          animationId = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);
          ctx.clearRect(0, 0, w, h);

          centers.forEach((c, i) => {
            drawRadial(c.x, c.y, 50, i); // different spectrum slices
          });
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

  return <canvas ref={canvasRef} width={600} height={400} />;
}
