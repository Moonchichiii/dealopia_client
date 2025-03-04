import React, { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import RegisterForm from '@/components/forms/RegisterForm';

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose, onSwitchToLogin }) => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      await register(formData);
      onClose();
      // Could redirect to verification page or show success message
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setIsLoading(true);
      // In a real implementation, this would redirect to Google OAuth
      window.location.href = '/api/v1/auth/google/';
    } catch (error) {
      setIsLoading(false);
      console.error('Google signup error:', error);
    }
  };

  const handleSwitchToLogin = () => {
    onClose(); // Close register modal
    onSwitchToLogin(); // Open login modal
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
          {error}
        </div>
      )}
      
      <RegisterForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        onGoogleSignup={handleGoogleSignup}
        isLoading={isLoading}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};

export default Register;