import React from 'react';

interface LogoButtonProps {
  onClick?: () => void;
  variant?: 'icon-only' | 'full' | 'responsive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showText?: boolean; // New prop to explicitly control text display
}

const LogoButton: React.FC<LogoButtonProps> = ({ 
  onClick, 
  variant = 'responsive', 
  size = 'md',
  className = '',
  showText = true // Default to showing text
}) => {
  // Size classes for the logo mark
  const sizeClasses = {
    sm: "w-8 h-8 text-base",
    md: "w-10 h-10 text-xl",
    lg: "w-12 h-12 text-2xl"
  };
  
  // Text size classes
  const textSizeClasses = {
    sm: "text-sm",
    md: "text-xl",
    lg: "text-2xl"
  };
  
  // Common classes for the logo mark
  const logoMarkClasses = `bg-[#FF38B4] rounded-xl flex items-center justify-center text-white font-bold ${sizeClasses[size]}`;
  
  return (
    <button 
      className={`flex items-center gap-2 bg-transparent border-0 cursor-pointer ${className}`} 
      onClick={onClick}
      aria-label="Dealopia"
    >
      <div className={logoMarkClasses}>D</div>
      
      {showText && (variant === 'full' || (variant === 'responsive' && size !== 'sm')) && (
        <div className={`mr-5 font-semibold tracking-tight ${textSizeClasses[size]} hidden sm:block`}>
          Dealopia
        </div>
      )}
    </button>
  );
};

export default LogoButton;