import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  className?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  value,
  onChange,
  placeholder,
  label,
  className = ""
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`group ${className}`}>
      <label className="block text-xs font-medium text-slate-300 mb-1">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-mint-400 transition-colors" />
        <input
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-9 pr-10 py-2.5 bg-slate-800/50 border-2 border-slate-700/50 rounded-xl focus:border-mint-500 focus:outline-none transition-all duration-300 text-white text-sm placeholder-slate-500 hover:border-slate-600/50 focus:bg-slate-800/70 focus:shadow-lg focus:shadow-mint-500/10"
          placeholder={placeholder}
        />
        <motion.button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-mint-400 transition-colors flex items-center justify-center w-4 h-4"
          whileHover={{ opacity: 0.8 }}
          // whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {showPassword ? (
              <motion.div
                key="hide"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <EyeOff className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div
                key="show"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Eye className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};