import { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, useAnimations, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

// Soldier model URL from Three.js examples
const SOLDIER_MODEL_URL = "https://threejs.org/examples/models/gltf/Soldier.glb";

interface SoldierProps {
  animationState: "idle" | "walk" | "run";
  transitionDuration?: number;
  timeScale?: number;
}

function Soldier({ animationState, transitionDuration = 0.5, timeScale = 1 }: SoldierProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(SOLDIER_MODEL_URL);
  const { actions, mixer } = useAnimations(animations, group);
  
  // Clone the scene to avoid sharing issues
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  
  // Store previous animation state for crossfading
  const prevStateRef = useRef<"idle" | "walk" | "run">("idle");
  
  // Animation indices from the Soldier.glb file:
  // animations[0] = idle
  // animations[1] = run  
  // animations[3] = walk
  const animationMap = useMemo(() => ({
    idle: actions[animations[0].name],
    run: actions[animations[1].name],
    walk: actions[animations[3]?.name || animations[2]?.name],
  }), [actions, animations]);

  // Set up initial animation
  useEffect(() => {
    // Enable shadows on all meshes
    clonedScene.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    // Initialize all actions
    Object.values(animationMap).forEach((action) => {
      if (action) {
        action.enabled = true;
        action.setEffectiveWeight(0);
        action.play();
      }
    });

    // Start with idle
    if (animationMap.idle) {
      animationMap.idle.setEffectiveWeight(1);
    }

    return () => {
      mixer.stopAllAction();
    };
  }, [clonedScene, animationMap, mixer]);

  // Handle animation transitions with crossfading
  useEffect(() => {
    const prevAction = animationMap[prevStateRef.current];
    const nextAction = animationMap[animationState];

    if (prevAction && nextAction && prevStateRef.current !== animationState) {
      // Set up the next action
      nextAction.enabled = true;
      nextAction.setEffectiveTimeScale(timeScale);
      nextAction.setEffectiveWeight(1);
      
      // Crossfade from previous to next
      prevAction.crossFadeTo(nextAction, transitionDuration, true);
      
      prevStateRef.current = animationState;
    }

    // Update time scale for current animation
    if (nextAction) {
      nextAction.setEffectiveTimeScale(timeScale);
    }
  }, [animationState, animationMap, transitionDuration, timeScale]);

  // Update mixer each frame
  useFrame((_, delta) => {
    mixer.update(delta);
  });

  return (
    <group ref={group} position={[0, 0, 0]} scale={2}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload the model
useGLTF.preload(SOLDIER_MODEL_URL);

interface AnimatedSoldierSceneProps {
  animationState?: "idle" | "walk" | "run";
  transitionDuration?: number;
  timeScale?: number;
  autoRotate?: boolean;
}

function Scene({ 
  animationState = "walk", 
  transitionDuration = 0.5, 
  timeScale = 1,
  autoRotate = true 
}: AnimatedSoldierSceneProps) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(2, 2, -4);
    camera.lookAt(0, 1, 0);
  }, [camera]);

  return (
    <>
      {/* Lighting */}
      <hemisphereLight intensity={2} groundColor="#8d8d8d" position={[0, 20, 0]} />
      <directionalLight
        intensity={2}
        position={[-3, 10, -10]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.1}
        shadow-camera-far={40}
        shadow-camera-top={2}
        shadow-camera-bottom={-2}
        shadow-camera-left={-2}
        shadow-camera-right={2}
      />
      
      {/* Environment */}
      <Environment preset="city" />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#cbcbcb" depthWrite={false} />
      </mesh>
      
      {/* Grid helper for visual reference */}
      <gridHelper args={[100, 100, 0x888888, 0xcccccc]} position={[0, 0.01, 0]} />
      
      {/* Animated Soldier */}
      <Soldier 
        animationState={animationState} 
        transitionDuration={transitionDuration}
        timeScale={timeScale}
      />
      
      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        autoRotate={autoRotate}
        autoRotateSpeed={1}
        minDistance={2}
        maxDistance={10}
        target={[0, 1, 0]}
      />
    </>
  );
}

// Main exported component with controls
export default function AnimatedSoldier() {
  const [animationState, setAnimationState] = useState<"idle" | "walk" | "run">("walk");
  const [timeScale, setTimeScale] = useState(1);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="relative h-full w-full">
      {/* Control Panel */}
      <div className="absolute left-4 top-4 z-10 rounded-lg bg-black/70 p-4 text-white backdrop-blur-sm">
        <h3 className="mb-3 text-sm font-bold text-[#915eff]">Animation Controls</h3>
        
        <div className="mb-3 space-y-2">
          <label className="text-xs text-gray-300">Animation State:</label>
          <div className="flex gap-2">
            {(["idle", "walk", "run"] as const).map((state) => (
              <button
                key={state}
                onClick={() => setAnimationState(state)}
                className={`rounded px-3 py-1 text-xs capitalize transition-colors ${
                  animationState === state
                    ? "bg-[#915eff] text-white"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                {state}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <label className="mb-1 block text-xs text-gray-300">
            Speed: {timeScale.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={timeScale}
            onChange={(e) => setTimeScale(parseFloat(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-gray-700 accent-[#915eff]"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="autoRotate"
            checked={autoRotate}
            onChange={(e) => setAutoRotate(e.target.checked)}
            className="h-4 w-4 accent-[#915eff]"
          />
          <label htmlFor="autoRotate" className="cursor-pointer text-xs text-gray-300">
            Auto Rotate
          </label>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ fov: 45, near: 1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "linear-gradient(to bottom, #a0a0a0, #e0e0e0)" }}
      >
        <Scene 
          animationState={animationState} 
          timeScale={timeScale}
          autoRotate={autoRotate}
        />
      </Canvas>
    </div>
  );
}
