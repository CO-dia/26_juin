"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

export default function WavingFlag() {
  const containerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 6;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(4, 2, 50, 30);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      wireframe: false,
    });

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/flag.jpg", (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      material.map = texture;
      material.needsUpdate = true;
    });

    const flag = new THREE.Mesh(geometry, material);
    flag.position.set(0.05, 3, 0); // position flag at top of pole
    scene.add(flag);

    // Flagpole (longer and aligned)
    const poleHeight = 6;
    const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, poleHeight, 16);
    const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.position.set(-2, poleHeight / 6, 0); // pole base at y = 0
    scene.add(pole);

    // Optional base
    const baseGeometry = new THREE.CylinderGeometry(0.1, 0.2, 0.2, 16);
    const base = new THREE.Mesh(baseGeometry, poleMaterial);
    base.position.set(-2, -2, 0);
    scene.add(base);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5).normalize();
    scene.add(light);

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const time = clock.getElapsedTime();

      for (let i = 0; i < geometry.attributes.position.count; i++) {
        const x = geometry.attributes.position.getX(i);
        const isEdge = Math.abs(x + 2) < 0.05;

        if (!isEdge) {
          const wave = Math.sin(x * 2 + time * 3) * 0.1;
          geometry.attributes.position.setZ(i, wave);
        } else {
          geometry.attributes.position.setZ(i, 0);
        }
      }

      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      renderer.dispose();
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100vh", background: "#000" }}
    />
  );
}
