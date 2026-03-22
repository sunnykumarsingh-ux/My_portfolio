import Typewriter from "../atoms/Typewriter";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import CanvasLoader from "../layout/Loader";
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from "@react-three/drei";
import ProceduralRobot from "../canvas/ProceduralRobot";
import CyberpunkEnvironment from "../canvas/CyberpunkEnvironment";
import RoboticCursor from "../canvas/RoboticCursor";
import RobotCrowd from "../canvas/RobotCrowd";
import { motion } from "framer-motion";
import { navLinks } from "../../constants";

const Hero = () => {
  // Available actions that the user wants
  // IMPORTANT: The names of the actions here should match the animation names inside the `robot.glb` file.
  // Mixamo often names them like "Idle", "Dance", "Backflip", "Jump", "Flying Kiss", "Wave".
  // We'll use case-sensitive names typical of Mixamo, but the user may need to rename them in Blender later if they don't match.
  const [currentAction, setCurrentAction] = useState("Idle");

  const actionButtons = [
    { label: "Idle", name: "Idle" },
    { label: "Dance", name: "Dance" },
    { label: "Backflip", name: "Backflip" },
    { label: "Jump", name: "Jump" },
    { label: "Fly Kiss", name: "Flying Kiss" },
    { label: "Wave", name: "Wave" },
  ];

  return (
    <section className={`relative mx-auto h-screen w-full overflow-hidden bg-black`}>
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ alpha: false, antialias: true }} dpr={[1, 2]}>
          <color attach="background" args={["#030510"]} />
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
          
          <Suspense fallback={<CanvasLoader />}>
            <Environment preset="night" />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} color="#00ffff" castShadow />
            <pointLight position={[-10, 5, -10]} intensity={2} color="#915EFF" />
            
            {/* Cyberpunk Elements */}
            <CyberpunkEnvironment />
            <RoboticCursor />
            
            {/* Background Robot Crowd */}
            <RobotCrowd />
            
            {/* The Humanoid Robot */}
            <ProceduralRobot actionName={currentAction} />
            
            <ContactShadows position={[0, -2.5, 0]} opacity={0.7} scale={10} blur={2} color="#00ffff" />
            
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Vignette Overlay for dark atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none" />
      
      {/* Central Identity / Title (Holographic projection) */}
      <div
        className={`absolute inset-0 top-[80px] sm:top-[120px] mx-auto max-w-7xl px-6 flex flex-col items-center gap-1 z-20 pointer-events-none`}
      >
        <div className="border border-[#00ffff]/30 bg-[#00ffff]/5 px-8 py-4 rounded-xl backdrop-blur-sm shadow-[0_0_20px_rgba(0,255,255,0.1)] text-center">
          <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">
            <span className="text-[#00ffff]">
              <Typewriter text="Sunny" speed={150} />
            </span>{" "}
            <Typewriter text="Kumar" speed={150} delay={800} />
          </h1>
          <p className="text-[#a1a1aa] mt-2 font-mono uppercase tracking-wider text-sm sm:text-base">
            System Online • Developer Protocol
          </p>
        </div>
      </div>

      {/* Holographic Navigation Panels (Left Side) */}
      <div className="absolute top-[30%] left-5 sm:left-10 flex flex-col gap-4 z-30 pointer-events-auto">
        <h3 className="text-[#00ffff] font-mono text-xs uppercase tracking-[0.2em] mb-2 opacity-70">Directory Access</h3>
        <div className="flex flex-col gap-3 border-l border-[#00ffff]/30 pl-4">
          {navLinks.map((nav) => (
            <a
              key={nav.id}
              href={`#${nav.id}`}
              className="text-white font-mono uppercase text-sm px-4 py-2 border border-[#00ffff]/0 hover:border-[#00ffff]/50 bg-black/20 hover:bg-[#00ffff]/10 backdrop-blur-md transition-all duration-300 hover:pl-6 focus:outline-none"
            >
              &gt; {nav.title}
            </a>
          ))}
        </div>
      </div>

      {/* Interactive Control Panel for Robot (Right Side) */}
      <div className="absolute top-[30%] right-5 sm:right-10 flex flex-col gap-3 z-30 pointer-events-auto items-end">
        <h3 className="text-[#915EFF] font-mono text-xs uppercase tracking-[0.2em] mb-2 opacity-70">Action Protocols</h3>
        <div className="flex flex-col gap-2 border-r border-[#915EFF]/30 pr-4">
          {actionButtons.map((btn) => (
            <button
              key={btn.name}
              onClick={() => setCurrentAction(btn.name)}
              className={`px-4 py-2 font-mono text-xs uppercase text-right w-32 transition-all duration-300 border backdrop-blur-md
                ${
                  currentAction === btn.name
                    ? "bg-[#915EFF]/40 text-white border-[#915EFF] shadow-[0_0_15px_rgba(145,94,255,0.4)] pr-6"
                    : "bg-black/40 text-[#aaa6c3] border-white/10 hover:bg-[#915EFF]/20 hover:text-white hover:border-[#915EFF]/50"
                }
              `}
            >
              [ {btn.label} ]
            </button>
          ))}
        </div>
      </div>

      <div className="xs:bottom-10 absolute bottom-32 flex w-full items-center justify-center z-20 pointer-events-auto">
        <a href="#about">
          <div className="border-secondary flex h-[64px] w-[35px] items-start justify-center rounded-3xl border-4 p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="bg-secondary mb-1 h-3 w-3 rounded-full"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
