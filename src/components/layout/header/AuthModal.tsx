import React from 'react';
import Modal from '@/components/modal/Modal';
import Login from '@/features/auth/components/Login';
import Register from '@/features/auth/components/Register';

interface AuthModalProps {
    isLoginOpen: boolean;
    isRegisterOpen: boolean;
    onLoginClose: () => void;
    onRegisterClose: () => void;
    onSwitchToRegister: () => void;
    onSwitchToLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
    isLoginOpen,
    isRegisterOpen,
    onLoginClose,
    onRegisterClose,
    onSwitchToRegister,
    onSwitchToLogin
}) => {
    return (
        <>
            <Modal
                isOpen={isLoginOpen}
                onClose={onLoginClose}
                title="Sign In"
                size="md"
                position="center"
                contentClassName="p-0 overflow-hidden rounded-lg sm:rounded-xl shadow-lg max-w-[95vw] sm:max-w-md md:max-w-lg"
            >
                <div className="relative w-full">
                    <React.Suspense 
                        fallback={
                            <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 h-40 sm:h-48 md:h-56">
                                <div className="animate-pulse flex flex-col items-center">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
                                    <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading login form...</p>
                                </div>
                            </div>
                        }
                    >
                        <Login 
                            onClose={onLoginClose} 
                            onSwitchToRegister={onSwitchToRegister}
                        />
                    </React.Suspense>
                </div>
            </Modal>

            <Modal
                isOpen={isRegisterOpen}
                onClose={onRegisterClose}
                title="Create Account"
                size="md"
                position="center"
                contentClassName="p-0 overflow-hidden rounded-lg sm:rounded-xl shadow-lg max-w-[95vw] sm:max-w-md md:max-w-lg"
            >
                <div className="relative w-full">
                    <React.Suspense 
                        fallback={
                            <div className="flex items-center justify-center p-4 sm:p-6 md:p-8 h-40 sm:h-48 md:h-56">
                                <div className="animate-pulse flex flex-col items-center">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-4 border-t-transparent border-primary animate-spin"></div>
                                    <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading registration form...</p>
                                </div>
                            </div>
                        }
                    >
                        <Register 
                            onClose={onRegisterClose}
                            onSwitchToLogin={onSwitchToLogin}
                        />
                    </React.Suspense>
                </div>
            </Modal>
        </>
    );
};

export default AuthModal;
