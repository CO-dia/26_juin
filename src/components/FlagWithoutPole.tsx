"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function WavingFlag() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const anthemLines = [
      "Ry Tanindrazanay malala ô!",
      "Ry Madagasikara soa.",
      "Ny fitiavanay anao tsy miala,",
      "Fa ho anao doria tokoa.",
      "Tahionao, ry Zanahary",
      "Ity Nosindrazanay ity",
      "Hiadana sy ho finaritra",
      "He sambatra tokoa izahay.",
      "Ry Tanindrazanay malala ô !",
      "Irinay mba hanompoana anao.",
      "Ny tena sy fo fanahy anananay,",
      "'Zay sarobidy sy mendrika tokoa.",
      "Tahionao, ry Zanahary",
      "Ity Nosindrazanay ity",
      "Hiadana sy ho finaritra",
      "He sambatra tokoa izahay.",
      "Ry Tanindrazanay malala ô",
      "Irinay mba hitahiana anao,",
      "Ka Ilay Nahary 'zao tontolo izao",
      "No fototra ijoroan'ny satanao. ",
      "Tahionao, ry Zanahary",
      "Ity Nosindrazanay ity",
      "Hiadana sy ho finaritra",
      "He sambatra tokoa izahay.",
    ];

    let currentIndex = 0;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    containerRef.current!.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(6, 3.5, 50, 30);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
    });

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    const image = new Image();
    image.src = "/flag.jpg";

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    material.map = texture;

    function drawCouplet() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.font = "bold 60px 'Saira', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.strokeText(
        anthemLines[currentIndex],
        canvas.width / 2,
        canvas.height / 2 - 30
      );
      ctx.fillText(
        anthemLines[currentIndex],
        canvas.width / 2,
        canvas.height / 2 - 30
      );

      if (anthemLines[currentIndex + 1]) {
        ctx.strokeText(
          anthemLines[currentIndex + 1],
          canvas.width / 2,
          canvas.height / 2 + 30
        );
        ctx.fillText(
          anthemLines[currentIndex + 1],
          canvas.width / 2,
          canvas.height / 2 + 30
        );
      }

      texture.needsUpdate = true;
    }

    image.onload = drawCouplet;

    const flag = new THREE.Mesh(geometry, material);
    scene.add(flag);

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      for (let i = 0; i < geometry.attributes.position.count; i++) {
        const x = geometry.attributes.position.getX(i);
        const wave = Math.sin(x * 2 + time * 3) * 0.1;
        geometry.attributes.position.setZ(i, wave);
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    }

    function onResize() {
      const width = containerRef.current!.clientWidth;
      const height = containerRef.current!.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", onResize);
    onResize();
    animate();

    // Double click = next
    containerRef.current!.addEventListener("dblclick", () => {
      currentIndex = (currentIndex + 2) % anthemLines.length;
      drawCouplet();
    });

    // Double right-click = previous
    let rightClickTime = 0;
    containerRef.current!.addEventListener("contextmenu", (e) => {
      e.preventDefault(); // prevent native right-click

      const now = performance.now();
      if (now - rightClickTime < 400) {
        // double right-click detected
        currentIndex =
          (currentIndex - 2 + anthemLines.length) % anthemLines.length;
        drawCouplet();
      }
      rightClickTime = now;
    });

    // Cleanup
    return () => {
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen w-screen"
      style={{ background: "#000", overflow: "hidden" }}
    />
  );
}
