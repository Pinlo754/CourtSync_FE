import React from 'react';
import { motion } from 'framer-motion';

export const Logo: React.FC = () => {
  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-mint-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-mint-500/25">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white" className="drop-shadow-lg">
              <path d="M12 2L8 6v4l4-2 4 2V6l-4-4zM8 12l4 2 4-2v8l-4-4-4 4v-8z"/>
            </svg>
          </div>
          <div className="absolute -inset-2 bg-gradient-to-r from-mint-400 to-blue-400 rounded-2xl blur opacity-30 animate-pulse-slow"></div>
        </div>
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-mint-400 via-blue-400 to-mint-300 bg-clip-text text-transparent">
            CourtSync
          </h1>
          <p className="text-slate-300 text-sm font-medium tracking-wide">Premium Badminton Platform</p>
        </div>
      </div>
    </motion.div>
  );
};