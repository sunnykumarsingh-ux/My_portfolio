import { useState, useEffect } from "react";
import ProceduralRobot from "./ProceduralRobot";

const ACTIONS = ["Idle", "Dance", "Wave", "Jump", "Walking", "Backflip"];

interface CrowdBot {
  id: number;
  position: [number, number, number];
  rotationY: number;
  scale: number;
  action: string;
}

const generateCrowd = (count: number): CrowdBot[] => {
  const crowd: CrowdBot[] = [];
  for (let i = 0; i < count; i++) {
    // Generate them behind the main robot in a semi-circle or spread
    const angle = Math.random() * Math.PI - Math.PI / 2; // -90 to 90 degrees
    const radius = 8 + Math.random() * 15; // 8 to 23 units away
    
    // X, Z coordinates based on angle and radius
    const x = Math.sin(angle) * radius;
    const z = -Math.cos(angle) * radius - 5; // offset them backwards
    
    crowd.push({
      id: i,
      position: [x, 0, z],
      rotationY: Math.random() * Math.PI * 2,
      scale: 0.6 + Math.random() * 0.4, // 60% to 100% scale
      action: ACTIONS[Math.floor(Math.random() * ACTIONS.length)]
    });
  }
  return crowd;
};

const RobotCrowd = () => {
  const [bots, setBots] = useState<CrowdBot[]>(() => generateCrowd(10));

  useEffect(() => {
    // Every 3 seconds, pick a random robot and change its action
    const interval = setInterval(() => {
      setBots(prevBots => {
        const newBots = [...prevBots];
        const randomIdx = Math.floor(Math.random() * newBots.length);
        const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
        
        // Slightly rotate the robot when it changes action
        newBots[randomIdx] = {
          ...newBots[randomIdx],
          action: randomAction,
          rotationY: newBots[randomIdx].rotationY + (Math.random() - 0.5)
        };
        return newBots;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <group>
      {bots.map((bot) => (
        <ProceduralRobot
          key={bot.id}
          actionName={bot.action}
          position={bot.position}
          scale={bot.scale}
          rotationY={bot.rotationY}
          showBubble={false}
        />
      ))}
    </group>
  );
};

export default RobotCrowd;
