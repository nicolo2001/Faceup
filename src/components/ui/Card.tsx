import React from 'react';

type CardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
};

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverable = false 
}) => {
  return (
    <div 
      onClick={onClick} 
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden
        ${hoverable ? 'transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>{children}</div>;
};

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return <div className={`px-6 py-5 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return <div className={`px-6 py-4 bg-gray-50 ${className}`}>{children}</div>;
};

export default Card;