import React, { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import LoginForm from '@/components/forms/LoginForm';

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await login(email, password);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would redirect to Google OAuth
      window.location.href = '/api/v1/auth/google/';
    } catch (error) {
      setIsLoading(false);
      console.error('Google login error:', error);
    }
  };

  const handleSwitchToRegister = () => {
    onClose(); // Close login modal
    onSwitchToRegister(); // Open register modal
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <LoginForm 
        onSubmit={handleLoginSubmit}
        onGoogleLogin={handleGoogleLogin}
        isLoading={isLoading}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </div>
  );
};

export default Login;
