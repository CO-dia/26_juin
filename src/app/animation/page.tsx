"use client";

import AnimatedBg from "@/components/animatedBg";
import { PlatformScene } from "@/components/platformScene";
import React from "react";

function Animation() {
  return (
    <div>
      <AnimatedBg />
      <PlatformScene />
      <div className="relative w-full h-screen">
        <div className="absolute top-6 left-6 bg-black/50 text-white text-7xl font-bold px-4 py-2 rounded-lg shadow-lg">
          Burmese Python
        </div>

        <div className="absolute top-1/4 ml-96 w-3/5 bg-black/40 text-white text-2xl p-4 rounded-md shadow-lg backdrop-blur-sm">
          The Burmese python is one of the largest snakes in the world. It lives
          in jungles and marshes and can reach lengths over 5 meters.
        </div>
      </div>
    </div>
  );
}

export default Animation;
