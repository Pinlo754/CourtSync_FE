import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'danger' | 'adding' | 'custom' | 'page' | 'detail' | 'disabled';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  children,
  icon: Icon,
  variant = 'primary',
  className = ""
}) => {
  const baseClasses = "w-full py-2.5 px-4 rounded-xl font-semibold text-sm shadow-lg transform transition-all duration-300 flex items-center justify-center space-x-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-mint-500 to-blue-500 text-white shadow-mint-500/25 hover:shadow-xl hover:shadow-mint-500/30 hover:scale-[1.02]",
    secondary: "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-slate-700/50 hover:text-white",
    page: "bg-slate-600/50 text-slate-200 border border-slate-700/50 opacity-50 hover:bg-blue-400 hover:text-slate-800 hover:text-bold hover:opacity-100",
    detail: "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-mint-500/50 hover:text-slate-600",
    adding: "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-gradient-to-r hover:from-blue-600 hover:to-mint-500 hover:text-white",
    danger: "bg-slate-800/50 text-slate-300 border border-slate-700/50 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-300 hover:text-white",
    disabled: "bg-slate-800/50 text-slate-300 border border-slate-700/50",
    custom: className
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      whileHover={{ scale: loading || disabled ? 1 : 1.02 }}
      whileTap={{ scale: loading || disabled ? 1 : 0.98 }}
    >
      {loading ? (
        <motion.div
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        <>
          <span>{children}</span>
          {Icon && <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
        </>
      )}
    </motion.button>
  );
};