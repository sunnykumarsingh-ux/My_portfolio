import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTheme } from "../../context/ThemeContext";

const InteractiveParticles = ({ count = 3000 }) => {
  const points = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Generate particles
  const [positions, rawPositions] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const rawPositions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      rawPositions[i * 3] = x;
      rawPositions[i * 3 + 1] = y;
      rawPositions[i * 3 + 2] = z;
    }
    return [positions, rawPositions];
  }, [count]);

  const targetColor = useMemo(() => {
    return isDark ? new THREE.Color("#915EFF") : new THREE.Color("#3b82f6");
  }, [isDark]);

  useFrame((state) => {
    if (!points.current) return;

    const time = state.clock.getElapsedTime();
    const positions = points.current.geometry.attributes.position.array as Float32Array;

    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const rawX = rawPositions[i3];
      const rawY = rawPositions[i3 + 1];
      const rawZ = rawPositions[i3 + 2];

      const dx = mouseX - rawX;
      const dy = mouseY - rawY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Particles move slightly based on time (swirling)
      const moveX = Math.sin(time * 0.5 + rawY) * 0.5;
      const moveY = Math.cos(time * 0.5 + rawX) * 0.5;

      // Mouse interaction: push away or pull
      let force = 0;
      if (dist < 4) {
        force = (4 - dist) * 0.2;
      }

      positions[i3] = rawX + moveX - (dx * force);
      positions[i3 + 1] = rawY + moveY - (dy * force);
      positions[i3 + 2] = rawZ + Math.sin(time + rawX) * 0.5;
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.y = time * 0.05;
    points.current.rotation.z = time * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={targetColor}
        transparent
        opacity={isDark ? 0.8 : 0.6}
        sizeAttenuation={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default InteractiveParticles;
