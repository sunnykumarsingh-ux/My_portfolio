import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Global state to control modal from outside
let openGameModal: () => void;

export const useGameModal = () => {
  return { openGameModal };
};

const GameModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Expose open function globally
  openGameModal = () => setIsOpen(true);

  // Load Spline script when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.12.70/build/spline-viewer.js";
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [isOpen]);

  return (
    <>
      {/* Game Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative h-[80vh] w-[90vw] max-w-5xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Game Container */}
              <div className="h-full w-full bg-gray-900">
                <spline-viewer
                  loading-anim-type="none"
                  url="https://prod.spline.design/UYgi5BdeHh6wiHQP/scene.splinecode"
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              {/* Hide Spline Logo - Bottom Right Corner */}
              <div 
                className="absolute bottom-0 right-0 h-20 w-56 bg-gray-900 z-40"
              />

              {/* Exit Button - Simple design in bottom right */}
              <motion.button
                onClick={() => setIsOpen(false)}
                className="absolute bottom-4 right-4 z-50 flex h-10 items-center gap-2 rounded-lg bg-red-500 px-4 font-semibold text-white shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>✕</span>
                <span>Exit</span>
              </motion.button>

              {/* Game Title */}
              <div className="absolute right-4 top-4 rounded-lg bg-black/50 px-4 py-2 backdrop-blur-sm">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-lg font-bold text-transparent">
                  Interactive 3D Game
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GameModal;
