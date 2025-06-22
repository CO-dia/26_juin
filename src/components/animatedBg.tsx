import React from "react";

function AnimatedBg() {
  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="fixed top-0 left-0 w-screen h-screen object-cover z-[-1]"
    >
      <source src="/animated_bg.mp4" type="video/mp4" />
    </video>
  );
}

export default AnimatedBg;
