import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
    message: string;
    show: boolean;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, show }) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="mb-3 p-3 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center space-x-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{
                        opacity: { duration: 0.3 },
                        y: { duration: 0.3 }
                    }}
                >
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-xs">{message}</span>
                </motion.div>
            )}
        </AnimatePresence>
    );
}; 