import React from 'react';
import { motion } from 'framer-motion';

interface AuthToggleProps {
  isSignUp: boolean;
  onToggle: (isSignUp: boolean) => void;
}

export const AuthToggle: React.FC<AuthToggleProps> = ({ isSignUp, onToggle }) => {
  return (
    <motion.div 
      className="flex bg-slate-800/50 rounded-2xl p-1 mb-4 border border-slate-700/50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <button
        onClick={() => onToggle(false)}
        className={`flex-1 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-300 ${
          !isSignUp 
            ? 'bg-gradient-to-r from-mint-500 to-blue-500 text-white shadow-lg shadow-mint-500/25' 
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Sign In
      </button>
      <button
        onClick={() => onToggle(true)}
        className={`flex-1 py-2 px-3 rounded-xl font-medium text-sm transition-all duration-300 ${
          isSignUp 
            ? 'bg-gradient-to-r from-mint-500 to-blue-500 text-white shadow-lg shadow-mint-500/25' 
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Sign Up
      </button>
    </motion.div>
  );
};