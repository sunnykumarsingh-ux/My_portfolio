import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RoboticCursor = () => {
  const cursorRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!cursorRef.current || !outerRingRef.current) return;

    // Convert normalized mouse coordinates (-1 to 1) to world space bounds roughly
    const targetX = (state.pointer.x * state.viewport.width) / 2;
    const targetY = (state.pointer.y * state.viewport.height) / 2;

    // Smooth lerp for tracking movement
    cursorRef.current.position.lerp(new THREE.Vector3(targetX, targetY, 5), 0.15);
    
    // Rotate the drone rings based on time
    const time = state.clock.getElapsedTime();
    outerRingRef.current.rotation.x = time * 2;
    outerRingRef.current.rotation.y = time * 3;
    
    // Slight bobbing
    cursorRef.current.position.y += Math.sin(time * 5) * 0.05;
  });

  return (
    <group ref={cursorRef}>
      {/* Inner Glowing Core */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={3} />
        <pointLight color="#00ffff" intensity={2} distance={5} />
      </mesh>
      
      {/* Outer Rotating Ring */}
      <mesh ref={outerRingRef}>
        <torusGeometry args={[0.2, 0.02, 16, 32]} />
        <meshStandardMaterial color="#915EFF" emissive="#915EFF" emissiveIntensity={2} wireframe />
      </mesh>
    </group>
  );
};

export default RoboticCursor;
