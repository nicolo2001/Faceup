import React from 'react';

type AvatarProps = {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  fallback?: string;
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  status,
  className = '',
  fallback,
}) => {
  const sizeStyles = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
  };

  const [imageError, setImageError] = React.useState(!src);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {!imageError && src ? (
        <img
          src={src}
          alt={alt}
          onError={handleImageError}
          className={`${sizeStyles[size]} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${sizeStyles[size]} rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-medium`}
        >
          {fallback ? fallback : alt.charAt(0).toUpperCase()}
        </div>
      )}
      
      {status && (
        <span
          className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${statusColors[status]}`}
        />
      )}
    </div>
  );
};

export default Avatar;