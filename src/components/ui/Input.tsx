import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type InputProps = {
  id: string;
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const Input: React.FC<InputProps> = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  value,
  onChange,
  icon,
  className = '',
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={id}
          name={name}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full rounded-lg border ${
            error ? 'border-red-500' : 'border-gray-300'
          } py-2 ${
            icon ? 'pl-10' : 'pl-3'
          } ${isPassword ? 'pr-10' : 'pr-3'} shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
            disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;