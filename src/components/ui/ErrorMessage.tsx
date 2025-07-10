import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  show: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="mb-3 p-3 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{
            opacity: 1,
            x: [0, -5, 5, -5, 5, 0],
          }}
          exit={{ opacity: 0, x: 10 }}
          transition={{
            x: { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
            opacity: { duration: 0.3 }
          }}
        >
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-300 text-xs">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};