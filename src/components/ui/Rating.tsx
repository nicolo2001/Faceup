import React from 'react';
import { Star, StarHalf } from 'lucide-react';

type RatingProps = {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
};

const Rating: React.FC<RatingProps> = ({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const valueStyles = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Round to nearest 0.5
  const roundedValue = Math.round(value * 2) / 2;
  const fullStars = Math.floor(roundedValue);
  const hasHalfStar = roundedValue % 1 !== 0;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, index) => (
          <Star
            key={`full-${index}`}
            className={`${sizeStyles[size]} text-amber-400 fill-amber-400`}
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <StarHalf
            className={`${sizeStyles[size]} text-amber-400 fill-amber-400`}
          />
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, index) => (
          <Star
            key={`empty-${index}`}
            className={`${sizeStyles[size]} text-gray-300`}
          />
        ))}
      </div>

      {showValue && (
        <span className={`ml-1 font-medium text-gray-700 ${valueStyles[size]}`}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;