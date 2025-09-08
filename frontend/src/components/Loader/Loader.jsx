import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import logoVideo from "../../assets/logo.mp4";

const Loader = () => {
  const controls = useAnimation();

  useEffect(() => {
    // Fly to header after delay
    const timer = setTimeout(() => {
      controls.start({
        scale: 0.5,
        y: -200,
        transition: {
          type: "spring",
          stiffness: 50,
          damping: 14,
          duration: 1.4,
        },
      });
    }, 6000);

    return () => clearTimeout(timer);
  }, [controls]);

  return (
    <div
      className="
        fixed inset-0 z-[9999] flex flex-col items-center justify-center
        bg-white animate-[fadeOut_1s_ease_forwards_4.2s]
      "
    >
      {/* Logo */}
      <motion.div
        layoutId="shared-logo"
        initial={{ scale: 1.5, y: 0 }}
        animate={controls}
        className="animate-[pulse_3s_ease-in-out]"
      >
        <video
          src={logoVideo}
          className="w-[200px] rounded-xl transition-all duration-700 ease-in-out"
          autoPlay
          loop
          muted
          playsInline
        />
      </motion.div>

      {/* Jumping math icons */}
      <div className="flex gap-4 text-3xl mt-6 text-blue-600">
        <motion.span animate={{ y: [0, -15, 0] }} transition={{ duration: 1, repeat: Infinity }}>
          ∑
        </motion.span>
        <motion.span
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
        >
          √
        </motion.span>
        <motion.span
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
        >
          π
        </motion.span>
        <motion.span
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
        >
          ∞
        </motion.span>
      </div>

      {/* Optional text */}
      <p className="mt-4 text-lg text-gray-700">Loading Math Senseacademy...</p>

      {/* Tailwind keyframes */}
      <style>
        {`
          @keyframes fadeOut {
            to { opacity: 0; visibility: hidden; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1.5); }
            50% { transform: scale(2.2); }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
