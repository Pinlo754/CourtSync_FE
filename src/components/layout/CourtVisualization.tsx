import React from 'react';
import { motion, cubicBezier } from 'framer-motion';

export const CourtVisualization: React.FC = () => {
  // Animated Shuttlecock
  const shuttlecockAnimation = {
    initial: { x: 60, y: 80 },
    animate: {
      x: [60, 200, 280, 200, 60],
      y: [80, 40, 80, 120, 80],
      rotate: [0, 15, -10, 20, 0]
    },
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: cubicBezier(0.42, 0, 0.58, 1)
    }
  };

  return (
    <motion.div
      className="relative mb-8"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.6 }}
    >
      {/* Court Background */}
      <div className="relative w-80 h-48 bg-gradient-to-b from-green-900/40 to-green-800/30 rounded-lg border-2 border-white/30 shadow-2xl backdrop-blur-sm">
        {/* Court Lines */}
        <div className="absolute inset-2">
          {/* Outer boundary */}
          <div className="w-full h-full border-2 border-white/50 rounded"></div>

          {/* Center line */}
          <div className="absolute top-0 left-1/2 w-0.5 h-full bg-white/50 transform -translate-x-0.5"></div>

          {/* Service lines */}
          <div className="absolute top-1/4 left-0 w-full h-0.5 bg-white/40"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-0.5 bg-white/40"></div>

          {/* Side service lines */}
          <div className="absolute top-1/4 left-1/4 w-0.5 h-1/2 bg-white/40"></div>
          <div className="absolute top-1/4 right-1/4 w-0.5 h-1/2 bg-white/40"></div>
        </div>

        {/* Net */}
        <motion.div
          className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/70 to-transparent transform -translate-y-0.5"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* Net mesh effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="absolute top-0 left-1/4 w-0.5 h-4 bg-white/50 transform -translate-y-2"></div>
          <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-white/50 transform -translate-y-2"></div>
          <div className="absolute top-0 right-1/4 w-0.5 h-4 bg-white/50 transform -translate-y-2"></div>
        </motion.div>

        {/* Animated Shuttlecock */}
        <motion.div
          className="absolute"
          initial={shuttlecockAnimation.initial}
          animate={shuttlecockAnimation.animate}
          transition={shuttlecockAnimation.transition}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" className="text-white drop-shadow-lg">
            <path fill="currentColor" d="M12 2L8 6v4l4-2 4 2V6l-4-4zM8 12l4 2 4-2v8l-4-4-4 4v-8z" />
          </svg>
          <motion.div
            className="absolute inset-0 bg-white rounded-full blur-sm opacity-30"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>

        {/* Glow effect around court */}
        <div className="absolute -inset-4 bg-gradient-to-r from-mint-500/10 via-transparent to-blue-500/10 rounded-xl blur-xl"></div>
      </div>
    </motion.div>
  );
};