import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

const AbstractShape = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.rotation.x = time * 0.2;
    meshRef.current.rotation.y = time * 0.3;
  });

  return (
    <Icosahedron ref={meshRef} args={[1.5, 30]} scale={window.innerWidth < 768 ? 1.5 : 2.2}>
      <MeshDistortMaterial
        color={isDark ? "#2a154d" : "#e0f2fe"}
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.2}
        metalness={0.8}
        transmission={0.6}
        thickness={isDark ? 1 : 0.5}
        envMapIntensity={isDark ? 1.5 : 1}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </Icosahedron>
  );
};

export default AbstractShape;
