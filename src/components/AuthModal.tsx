import { useState, useEffect } from 'react';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'signIn' | 'signUp';
};

const AuthModal: React.FC<AuthModalProps> = ({ 
    isOpen, 
    onClose, 
    initialView = 'signIn' 
}) => {
    const [view, setView] = useState<'signIn' | 'signUp'>(initialView);

    const handleViewToggle = () => {
        setView(view === 'signIn' ? 'signUp' : 'signIn');
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
                aria-hidden="true"
            />
            
            {/* Modal */}
            <div 
                className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <div 
                    className="bg-neutral-900/90 border border-neutral-800/50 rounded-2xl w-full max-w-md transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {view === 'signIn' ? (
                        <SignIn isModal={true} onToggleView={handleViewToggle} onSuccess={onClose} />
                    ) : (
                        <SignUp isModal={true} onToggleView={handleViewToggle} onSuccess={onClose} />
                    )}
                </div>
            </div>
        </>
    );
};

export default AuthModal;
