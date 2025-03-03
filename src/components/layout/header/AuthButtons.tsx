import React from 'react';
import Button from '@/components/buttons/AuthButton';

interface AuthButtonsProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  isLoggedIn?: boolean;
  onLogoutClick?: () => void;
}

const AuthButtons: React.FC<AuthButtonsProps> = ({ 
  onLoginClick, 
  onRegisterClick, 
  isLoggedIn = false, 
  onLogoutClick 
}) => {
  if (isLoggedIn && onLogoutClick) {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={onLogoutClick}
      >
        Sign Out
      </Button>
    );
  }

  return (
    <>
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
    </>
  );
};

export default AuthButtons;