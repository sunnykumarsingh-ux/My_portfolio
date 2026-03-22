import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

interface RobotModelProps {
  actionName: string; // The current action string to play
}

const RobotModel: React.FC<RobotModelProps> = ({ actionName }) => {
  const group = useRef<THREE.Group>(null);
  
  // Attempt to load the robot.glb. If it doesn't exist, this will throw an error in dev,
  // but we handle that by instructing the user to drop the file in /public.
  // The user should ensure the GLB file contains animations matching the button names.
  const { scene, animations } = useGLTF("/robot.glb") as any;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // If we have an active action in the GLB that matches actionName
    const action = actions[actionName];
    
    if (action) {
      // Fade into the new action smoothly over 0.5 seconds
      action.reset().fadeIn(0.5).play();

      // Ensure single-play animations (like jump, backflip) don't loop endlessly
      if (
        actionName.toLowerCase().includes("jump") ||
        actionName.toLowerCase().includes("backflip") ||
        actionName.toLowerCase().includes("wave") ||
        actionName.toLowerCase().includes("kiss")
      ) {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true; // Stop on the last frame
      } else {
        // Idle and Dance usually loop
        action.setLoop(THREE.LoopRepeat, Infinity);
      }

      return () => {
        // Fade out when switching to another animation
        action.fadeOut(0.5);
      };
    } else {
      console.warn(`Animation "${actionName}" not found in robot.glb! Available animations are:`, Object.keys(actions));
      
      // Fallback: If the requested action isn't found, try to play an "idle" animation
      const fallbackActionKeys = Object.keys(actions).filter(key => key.toLowerCase().includes("idle"));
      if (fallbackActionKeys.length > 0) {
        const fallBack = actions[fallbackActionKeys[0]];
        fallBack?.reset().fadeIn(0.5).play();
        return () => { fallBack?.fadeOut(0.5); };
      }
    }
  }, [actionName, actions]);

  return (
    <group ref={group} dispose={null}>
      <primitive 
        object={scene} 
        scale={2} 
        position={[0, -3.5, 0]} 
        rotation={[0, 0, 0]} 
      />
    </group>
  );
};

// Preload the model to prevent stuttering when it first loads
useGLTF.preload("/robot.glb");

export default RobotModel;
