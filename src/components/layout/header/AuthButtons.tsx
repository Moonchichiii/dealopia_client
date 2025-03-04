import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  variant, 
  size = 'md', 
  onClick, 
  children,
  className = ''
}) => {
  // Base classes
  const baseClasses = "font-medium rounded-full transition-all duration-300";
  
  // Size classes
  const sizeClasses = {
    sm: "px-5 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg"
  };
  
  // Variant classes
  const variantClasses = {
    primary: "bg-[#FF38B4] text-white hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-0.5",
    secondary: "bg-transparent border border-gray-600 text-white hover:border-[#FF38B4] hover:text-[#FF38B4]"
  };
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface AuthButtonsProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  isLoggedIn?: boolean;
  onLogoutClick?: () => void;
  className?: string;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ 
  onLoginClick, 
  onRegisterClick, 
  isLoggedIn = false, 
  onLogoutClick,
  className = ''
}) => {
  if (isLoggedIn && onLogoutClick) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={onLogoutClick}
        className={className}
      >
        Sign Out
      </Button>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button
        variant="secondary"
        size="sm"
        onClick={onLoginClick}
      >
        Sign In
      </Button>
      <Button
        variant="primary"
        size="sm"
        onClick={onRegisterClick}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default AuthButtons;