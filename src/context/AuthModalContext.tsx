import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type AuthModalContextType = {
    isAuthModalOpen: boolean;
    initialView: 'signIn' | 'signUp';
    openSignIn: () => void;
    openSignUp: () => void;
    closeAuthModal: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [initialView, setInitialView] = useState<'signIn' | 'signUp'>('signIn');

    const openSignIn = useCallback(() => {
        setInitialView('signIn');
        setIsAuthModalOpen(true);
    }, []);

    const openSignUp = useCallback(() => {
        setInitialView('signUp');
        setIsAuthModalOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => {
        setIsAuthModalOpen(false);
    }, []);

    return (
        <AuthModalContext.Provider
            value={{
                isAuthModalOpen,
                initialView,
                openSignIn,
                openSignUp,
                closeAuthModal
            }}
        >
            {children}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal(): AuthModalContextType {
    const context = useContext(AuthModalContext);
    if (context === undefined) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
}
