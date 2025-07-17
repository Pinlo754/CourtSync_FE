import React from 'react';
import { motion } from 'framer-motion';

interface AuthToggleProps {
  isSignUp: boolean;
  onToggle: (isSignUp: boolean) => void;
}

export const AuthToggle: React.FC<AuthToggleProps> = ({ isSignUp, onToggle }) => {
  return (
    <motion.div
      className="relative flex bg-slate-800/50 rounded-2xl p-1 mb-4 border border-slate-700/50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      {/* Animated Background Slider */}
      <motion.div
        className="absolute top-1 bottom-1 w-1/2 bg-gradient-to-r from-mint-500 to-blue-500 rounded-xl shadow-lg shadow-mint-500/25"
        initial={false}
        animate={{
          x: isSignUp ? '95%' : '0%'
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 25,
          duration: 0.5
        }}
      />

      {/* Buttons */}
      <button
        onClick={() => onToggle(false)}
        className={`relative z-10 flex-1 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-300 ${!isSignUp
          ? 'text-white'
          : 'text-slate-400 hover:text-white'
          }`}
      >
        Sign In
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`relative z-10 flex-1 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-300 ${isSignUp
          ? 'text-white'
          : 'text-slate-400 hover:text-white'
          }`}
      >
        Sign Up
      </button>
    </motion.div>
  );
};