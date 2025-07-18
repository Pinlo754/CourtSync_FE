import React from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  type?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  icon?: LucideIcon;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
  className = "",
}) => {
  return (
    <div className={`group ${className}`}>
      <label className="block text-xs font-medium text-slate-300 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-mint-400 transition-colors" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-9 pr-3 py-2.5 bg-slate-800/50 border-2 border-slate-700/50 rounded-xl focus:border-mint-500 focus:outline-none transition-all duration-300 text-white text-sm placeholder-slate-500 hover:border-slate-600/50 focus:bg-slate-800/70 focus:shadow-lg focus:shadow-mint-500/10"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
