import React from 'react';
import { Tag } from 'lucide-react';

interface LogoButtonProps {
  onClick?: () => void;
  className?: string;
}

const LogoButton: React.FC<LogoButtonProps> = ({ 
  onClick,
  className = '',
}) => {
  return (
    <button 
      className={`flex items-center gap-2 bg-transparent border-0 cursor-pointer ${className}`} 
      onClick={onClick}
      aria-label="Dealopia">      
      <Tag className="w-8 h-8 text-white-700" /> 
      <span className="text-xl font-semibold">DealOpia</span>
    </button>
  );
};

export default LogoButton;
