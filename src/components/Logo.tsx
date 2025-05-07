
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = "md", 
  variant = "dark" 
}) => {
  // Size mapping
  const sizeMap = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14"
  };
  
  // Color mapping based on variant
  const textColor = variant === 'dark' ? 'text-white' : 'text-g6-blue';

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`font-bold ${sizeMap[size]}`}>
        {/* SVG Logo */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 100 60" 
          className={`${sizeMap[size]}`}
        >
          <g fill={variant === 'dark' ? '#FFFFFF' : '#1A3361'}>
            <path d="M30,10 L30,50 L15,50 L15,10 L30,10 Z" />
            <path d="M48,10 C55.7,10 62,16.3 62,24 C62,31.7 55.7,38 48,38 L40,38 L40,50 L25,50 L25,10 L48,10 Z M47,25 C48.7,25 50,23.7 50,22 C50,20.3 48.7,19 47,19 L40,19 L40,25 L47,25 Z" />
            <circle cx="75" cy="25" r="15" />
          </g>
        </svg>
      </div>
      <div className={`ml-2 font-bold ${textColor} ${size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-base'}`}>
        Grupo6 Capital
      </div>
    </div>
  );
};

export default Logo;
