import React from 'react';
import Modal from '@/components/modal/Modal';
import Login from '@/features/auth/components/Login';
import Register from '@/features/auth/components/Register';

interface AuthModalProps {
  isLoginOpen: boolean;
  isRegisterOpen: boolean;
  onLoginClose: () => void;
  onRegisterClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isLoginOpen,
  isRegisterOpen,
  onLoginClose,
  onRegisterClose
}) => {
  return (
    <>
      <Modal 
        isOpen={isLoginOpen} 
        onClose={onLoginClose}
        title="Sign In"
      >
        <React.Suspense fallback={<p>Loading login form...</p>}>
          <Login onClose={onLoginClose} />
        </React.Suspense>
      </Modal>

      <Modal 
        isOpen={isRegisterOpen} 
        onClose={onRegisterClose}
        title="Create Account"
      >
        <React.Suspense fallback={<p>Loading registration form...</p>}>
          <Register onClose={onRegisterClose} />
        </React.Suspense>
      </Modal>
    </>
  );
};

export default AuthModal;