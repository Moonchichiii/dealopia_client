import { useState, useCallback } from 'react';

export const useAuthModal = () => {
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

  return {
    isAuthModalOpen,
    initialView,
    openSignIn,
    openSignUp,
    closeAuthModal
  };
};