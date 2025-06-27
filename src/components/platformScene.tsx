import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

export function PlatformScene() {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
      }}
      camera={{ position: [0, 2, 5], fov: 50 }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 3, 0]} intensity={2} />

      {/* Smaller circular platform in bottom-right corner */}
      <mesh position={[1.2, -0.8, 1.5]} rotation={[-Math.PI / 6, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.6, 0.1, 64]} />
        <meshStandardMaterial color="#4c8cff" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Add your OBJ model */}
      <ObjWithMaterial objPath="/snake/snake.obj" mtlPath="/snake/snake.mtl" />
    </Canvas>
  );
}

function ObjWithMaterial({ objPath, mtlPath }) {
  const [object, setObject] = useState();

  useEffect(() => {
    const mtlLoader = new MTLLoader();
    mtlLoader.load(mtlPath, (materials) => {
      materials.preload();

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(objPath, (obj) => {
        setObject(obj);
      });
    });
  }, [objPath, mtlPath]);

  if (!object) return null;

  return (
    <primitive
      object={object}
      position={[1.1, -0.1, 2.5]}
      scale={[0.4, 0.4, 0.4]}
      rotation={[Math.PI * 1.39, 0, 0]}
    />
  );
}
