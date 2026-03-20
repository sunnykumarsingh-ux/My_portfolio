import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GameModal = () => {
  const [isOpen, setIsOpen] = useState(false);

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
      {/* Game Button - (◔‿◔) */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed left-8 top-24 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-lg font-bold text-white shadow-lg transition-all hover:scale-110"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
        title="Play Game"
      >
        (◔‿◔)
      </motion.button>

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

              {/* Exit Button - Advanced Colorful Close */}
              <motion.button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 px-6 font-bold text-white shadow-lg transition-all hover:scale-105"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(255, 100, 100, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">✕</span>
                <span>Exit</span>
              </motion.button>

              {/* Game Title */}
              <div className="absolute left-4 top-4 rounded-lg bg-black/50 px-4 py-2 backdrop-blur-sm">
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
