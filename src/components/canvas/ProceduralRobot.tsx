import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface ProceduralRobotProps {
  actionName: string;
  position?: [number, number, number];
  scale?: number;
  rotationY?: number;
  showBubble?: boolean;
}

const ProceduralRobot: React.FC<ProceduralRobotProps> = ({ 
  actionName, 
  position = [0, 0, 0], 
  scale = 1, 
  rotationY = 0,
  showBubble = true 
}) => {
  // --- References for FK Hierarchy ---
  const rootRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  
  const leftShoulderRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const leftElbowRef = useRef<THREE.Group>(null);
  const rightElbowRef = useRef<THREE.Group>(null);

  const leftHipRef = useRef<THREE.Group>(null);
  const rightHipRef = useRef<THREE.Group>(null);
  const leftKneeRef = useRef<THREE.Group>(null);
  const rightKneeRef = useRef<THREE.Group>(null);

  const actionTimeRef = useRef(0);

  // --- Real Human Body Colors & Clothing Textures ---
  // Skin tone: Warm fair/medium tone
  const skinMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f1c27d", roughness: 0.5, metalness: 0 }), []);
  
  // Clothing: Techwear vibe (Dark grey tech t-shirt, dark cargo pants, neon trim)
  const shirtMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#222530", roughness: 0.9, metalness: 0.1 }), []);
  const pantsMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#111118", roughness: 0.8, metalness: 0 }), []);
  const shoesMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#000000", roughness: 0.5, metalness: 0.3 }), []);
  const glowMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#00ffff", emissive: "#00ffff", emissiveIntensity: 2 }), []);

  // Reset animation timer when action changes
  useEffect(() => {
    actionTimeRef.current = 0;
  }, [actionName]);

  // --- Procedural Animation Logic ---
  useFrame((state, delta) => {
    if (!rootRef.current || !torsoRef.current || !spineRef.current || !headRef.current) return;
    if (!leftShoulderRef.current || !rightShoulderRef.current || !leftHipRef.current || !rightHipRef.current) return;
    if (!leftElbowRef.current || !rightElbowRef.current || !leftKneeRef.current || !rightKneeRef.current) return;
    
    actionTimeRef.current += delta;
    const t = state.clock.getElapsedTime();
    const at = actionTimeRef.current; // Local action time

    // Reset base rotations for all joints to act as origin blends
    rootRef.current.position.set(0, 0, 0);
    rootRef.current.rotation.set(0, 0, 0);
    torsoRef.current.position.set(0, 0.4, 0); 
    torsoRef.current.rotation.set(0, 0, 0);
    spineRef.current.rotation.set(0, 0, 0);
    headRef.current.rotation.set(0, 0, 0);

    leftShoulderRef.current.rotation.set(0, 0, 0.2); // slight A-pose
    rightShoulderRef.current.rotation.set(0, 0, -0.2);
    leftElbowRef.current.rotation.set(0, 0, 0);
    rightElbowRef.current.rotation.set(0, 0, 0);
    
    leftHipRef.current.rotation.set(0, 0, 0);
    rightHipRef.current.rotation.set(0, 0, 0);
    leftKneeRef.current.rotation.set(0, 0, 0);
    rightKneeRef.current.rotation.set(0, 0, 0);

    // --- Action Implementations ---
    if (actionName === "Idle") {
      // Breathing & subtle sway
      torsoRef.current.scale.set(1, 1 + Math.sin(t * 2) * 0.02, 1 + Math.sin(t * 2) * 0.05);
      
      if (showBubble) {
        // Only track pointer if it's the main robot with the bubble
        const targetX = state.pointer.x * 0.8;
        const targetY = state.pointer.y * -0.5;
        headRef.current.rotation.y = targetX;
        headRef.current.rotation.x = targetY;
        torsoRef.current.rotation.y = targetX * 0.3;
      } else {
        // Background bots just look around slowly
        headRef.current.rotation.y = Math.sin(t * 0.5) * 0.5;
      }
      
      leftShoulderRef.current.rotation.z = 0.2 + Math.sin(t * 1.5) * 0.05;
      rightShoulderRef.current.rotation.z = -0.2 - Math.sin(t * 1.5) * 0.05;
      
      leftElbowRef.current.rotation.x = -0.1 + Math.sin(t * 1.2) * 0.05;
      rightElbowRef.current.rotation.x = -0.1 + Math.sin(t * 1.2) * 0.05;
    } 
    else if (actionName === "Dance") {
      // Bouncing and swinging
      rootRef.current.position.y = Math.abs(Math.sin(t * 4)) * 0.3;
      torsoRef.current.rotation.y = Math.sin(t * 2) * 0.5;
      headRef.current.rotation.z = Math.sin(t * 4) * 0.2;

      leftShoulderRef.current.rotation.x = Math.sin(t * 4) * 1.5;
      leftShoulderRef.current.rotation.z = 0.5;
      rightShoulderRef.current.rotation.x = Math.sin(t * 4 + Math.PI) * 1.5;
      rightShoulderRef.current.rotation.z = -0.5;

      leftElbowRef.current.rotation.x = -Math.abs(Math.sin(t * 4)) * 1.5;
      rightElbowRef.current.rotation.x = -Math.abs(Math.sin(t * 4 + Math.PI)) * 1.5;

      leftHipRef.current.rotation.x = Math.sin(t * 4) * 0.3;
      rightHipRef.current.rotation.x = Math.sin(t * 4 + Math.PI) * 0.3;
      leftKneeRef.current.rotation.x = Math.abs(Math.sin(t * 4)) * 0.5;
      rightKneeRef.current.rotation.x = Math.abs(Math.sin(t * 4 + Math.PI)) * 0.5;
    }
    else if (actionName === "Walking") {
      const walkSpeed = t * 6;
      rootRef.current.position.y = Math.abs(Math.sin(walkSpeed)) * 0.15; // head bob
      
      leftShoulderRef.current.rotation.x = Math.sin(walkSpeed) * 1.2;
      rightShoulderRef.current.rotation.x = -Math.sin(walkSpeed) * 1.2;
      
      leftHipRef.current.rotation.x = -Math.sin(walkSpeed) * 1.0;
      rightHipRef.current.rotation.x = Math.sin(walkSpeed) * 1.0;
      
      leftKneeRef.current.rotation.x = Math.max(0, Math.sin(walkSpeed) * 1.5);
      rightKneeRef.current.rotation.x = Math.max(0, -Math.sin(walkSpeed) * 1.5);
    }
    else if (actionName === "Wave") {
      rightShoulderRef.current.rotation.z = -2.5;
      rightElbowRef.current.rotation.z = Math.sin(t * 10) * 0.8;
      headRef.current.rotation.y = -0.3;
      torsoRef.current.rotation.x = Math.sin(t) * 0.02; // idle sway
    }
    else if (actionName === "Jump") {
      const jumpCycle = t * 3;
      rootRef.current.position.y = Math.max(0, Math.sin(jumpCycle) * 2);
      
      if (Math.sin(jumpCycle) > 0) {
        // In air
        leftShoulderRef.current.rotation.z = 1.5;
        rightShoulderRef.current.rotation.z = -1.5;
        leftHipRef.current.rotation.x = -0.5;
        rightHipRef.current.rotation.x = -0.5;
        leftKneeRef.current.rotation.x = 0.5;
        rightKneeRef.current.rotation.x = 0.5;
      } else {
        // Landing squash
        rootRef.current.position.y = Math.sin(jumpCycle) * 0.5;
        leftShoulderRef.current.rotation.x = -1;
        rightShoulderRef.current.rotation.x = -1;
        leftHipRef.current.rotation.x = -1;
        rightHipRef.current.rotation.x = -1;
        leftKneeRef.current.rotation.x = 2;
        rightKneeRef.current.rotation.x = 2;
        torsoRef.current.rotation.x = 0.5;
      }
    }
    else if (actionName === "Backflip") {
      // 1.5s backflip loop mapped tightly to humanoid layout
      const flipDuration = 1.5;
      const progress = (at % flipDuration) / flipDuration; 

      if (progress < 0.2) {
        // Crouch
        const p = progress / 0.2;
        rootRef.current.position.y = -0.7 * p;
        torsoRef.current.rotation.x = 0.8 * p;
        leftHipRef.current.rotation.x = -1 * p;
        rightHipRef.current.rotation.x = -1 * p;
        leftKneeRef.current.rotation.x = 2 * p;
        rightKneeRef.current.rotation.x = 2 * p;
        leftShoulderRef.current.rotation.x = -1.5 * p;
        rightShoulderRef.current.rotation.x = -1.5 * p;
      } else if (progress < 0.8) {
        // Flip in air
        const airP = (progress - 0.2) / 0.6;
        rootRef.current.position.y = Math.sin(airP * Math.PI) * 3.5;
        rootRef.current.rotation.x = airP * Math.PI * 2; // 360 rotation
        
        torsoRef.current.rotation.x = 0.5;
        leftHipRef.current.rotation.x = -2;
        rightHipRef.current.rotation.x = -2;
        leftKneeRef.current.rotation.x = 2.5;
        rightKneeRef.current.rotation.x = 2.5;
        leftShoulderRef.current.rotation.x = 2.5;
        rightShoulderRef.current.rotation.x = 2.5;
      } else {
        // Land
        const landP = (progress - 0.8) / 0.2;
        rootRef.current.position.y = -0.7 + (landP * 0.7);
        torsoRef.current.rotation.x = 0.8 - (landP * 0.8);
        leftHipRef.current.rotation.x = -1 + landP;
        rightHipRef.current.rotation.x = -1 + landP;
        leftKneeRef.current.rotation.x = 2 - (landP * 2);
        rightKneeRef.current.rotation.x = 2 - (landP * 2);
        leftShoulderRef.current.rotation.x = -1.5 + (landP * 1.5);
        rightShoulderRef.current.rotation.x = -1.5 + (landP * 1.5);
      }
    }
    else if (actionName === "Flying Kiss") {
      const kissProgress = at % 3;
      if (kissProgress < 0.5) {
        rightShoulderRef.current.rotation.x = -1.5;
        rightShoulderRef.current.rotation.z = -0.5;
        rightElbowRef.current.rotation.x = -2.5;
        headRef.current.rotation.y = 0.2;
        headRef.current.rotation.x = 0.2;
      } else if (kissProgress < 1.5) {
        rightShoulderRef.current.rotation.x = -1.5;
        rightShoulderRef.current.rotation.z = -1.5; 
        rightElbowRef.current.rotation.x = 0;
        headRef.current.rotation.x = -0.2; 
      } else {
        rightShoulderRef.current.rotation.x = -1.5 * (1 - (kissProgress - 1.5) / 1.5);
      }
    }
  });

  return (
    <group position={position} scale={scale} rotation={[0, rotationY, 0]}>
      <group ref={rootRef} position={[0, 0, 0]}>
        {/* --- PELVIS (Pants) --- */}
      <mesh material={pantsMat} position={[0, -0.2, 0]} castShadow>
        <boxGeometry args={[0.7, 0.4, 0.45]} />
      </mesh>
      
      {/* Belt/Tech Accent */}
      <mesh material={shirtMat} position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.72, 0.1, 0.47]} />
      </mesh>

      {/* --- LEGS --- */}
      {[
        { name: "Left", x: -0.25, hipRef: leftHipRef, kneeRef: leftKneeRef },
        { name: "Right", x: 0.25, hipRef: rightHipRef, kneeRef: rightKneeRef }
      ].map((leg) => (
        <group ref={leg.hipRef} position={[leg.x, -0.4, 0]} key={leg.name}>
          <mesh material={pantsMat} castShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
          </mesh>
          {/* Thigh (Pants) */}
          <mesh material={pantsMat} position={[0, -0.6, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.14, 1.2, 16]} />
          </mesh>
          
          {/* Knee */}
          <group ref={leg.kneeRef} position={[0, -1.2, 0]}>
            <mesh material={pantsMat} castShadow>
              <sphereGeometry args={[0.15, 16, 16]} />
            </mesh>
            {/* Calf (Pants) */}
            <mesh material={pantsMat} position={[0, -0.7, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.1, 1.4, 16]} />
            </mesh>
            {/* Foot (Shoes) */}
            <mesh material={shoesMat} position={[0, -1.45, 0.1]} castShadow>
              <boxGeometry args={[0.22, 0.15, 0.45]} />
            </mesh>
          </group>
        </group>
      ))}

      {/* --- TORSO (Shirt) --- */}
      <group ref={torsoRef} position={[0, 0.4, 0]}>
        <group ref={spineRef}>
          {/* Lower Torso */}
          <mesh material={shirtMat} position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.65, 0.6, 0.4]} />
          </mesh>
          {/* Upper Chest (Broader) */}
          <mesh material={shirtMat} position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[0.85, 0.7, 0.45]} />
          </mesh>
          {/* Glowing Chest Core Line (Cyberpunk accessory) */}
          <mesh material={glowMat} position={[0, 0.8, 0.23]}>
            <planeGeometry args={[0.05, 0.6]} />
          </mesh>

          {/* --- NECK AND HEAD --- */}
          {/* Neck (Skin) */}
          <mesh material={skinMat} position={[0, 1.3, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.12, 0.4, 16]} />
          </mesh>
          <group ref={headRef} position={[0, 1.6, 0]}>
            {/* Head (Skin) */}
            <mesh material={skinMat} castShadow>
              <sphereGeometry args={[0.3, 32, 32]} />
            </mesh>
            {/* AI HUD Glasses / Visor */}
            <mesh material={glowMat} position={[0, 0.05, 0.25]}>
              <boxGeometry args={[0.45, 0.1, 0.1]} />
            </mesh>
            
            {/* AI Dialogue Bubble */}
            {showBubble && (
              <Html 
                position={[0.8, 0.5, 0]} 
                center 
                distanceFactor={10} 
                className="pointer-events-none"
              >
                <div className="bg-black/80 backdrop-blur-md border border-[#00ffff]/50 text-[#00ffff] px-4 py-2 rounded-2xl rounded-bl-none text-sm font-mono whitespace-nowrap shadow-[0_0_15px_rgba(0,255,255,0.3)] animate-pulse">
                  {actionName === 'Idle' ? "Awaiting command..." : `Executing: ${actionName}`}
                </div>
              </Html>
            )}
          </group>

          {/* --- ARMS --- */}
          {[
            { name: "Left", x: -0.55, shoulderRef: leftShoulderRef, elbowRef: leftElbowRef },
            { name: "Right", x: 0.55, shoulderRef: rightShoulderRef, elbowRef: rightElbowRef }
          ].map((arm) => (
            <group ref={arm.shoulderRef} position={[arm.x, 1.0, 0]} key={arm.name}>
              {/* Shoulder Joint (Shirt) */}
              <mesh material={shirtMat} castShadow>
                <sphereGeometry args={[0.18, 16, 16]} />
              </mesh>
              {/* T-Shirt Sleeve (Short sleeve) */}
              <mesh material={shirtMat} position={[Math.sign(arm.x) * 0.05, -0.3, 0]} castShadow>
                <cylinderGeometry args={[0.16, 0.15, 0.6, 16]} />
              </mesh>
              
              {/* Upper Arm (Skin showing underneath sleeve) */}
              <mesh material={skinMat} position={[Math.sign(arm.x) * 0.05, -0.6, 0]} castShadow>
                <cylinderGeometry args={[0.12, 0.1, 0.4, 16]} />
              </mesh>
              
              {/* Elbow (Skin) */}
              <group ref={arm.elbowRef} position={[0, -0.9, 0]}>
                <mesh material={skinMat} castShadow>
                  <sphereGeometry args={[0.11, 16, 16]} />
                </mesh>
                {/* Forearm (Skin) */}
                <mesh material={skinMat} position={[0, -0.5, 0]} castShadow>
                  <cylinderGeometry args={[0.1, 0.08, 1, 16]} />
                </mesh>
                
                {/* Hand / Fingers (Skin) */}
                <group position={[0, -1.1, 0]}>
                  <mesh material={skinMat} castShadow>
                    <boxGeometry args={[0.16, 0.2, 0.1]} />
                  </mesh>
                  {/* Finger representations */}
                  {[...Array(4)].map((_, i) => (
                    <mesh material={skinMat} position={[-0.05 + i * 0.033, -0.18, 0]} key={i} castShadow>
                      <cylinderGeometry args={[0.015, 0.015, 0.25]} />
                    </mesh>
                  ))}
                  {/* Thumb */}
                  <mesh material={skinMat} position={[Math.sign(arm.x) * 0.1, -0.05, 0.05]} rotation={[0, 0, Math.sign(arm.x) * 0.5]} castShadow>
                    <cylinderGeometry args={[0.02, 0.02, 0.2]} />
                  </mesh>
                </group>
              </group>
            </group>
          ))}
        </group>
      </group>
    </group>
    </group>
  );
};

export default ProceduralRobot;
