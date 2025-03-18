// MobileMenu.tsx - Simplified version
import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

import AuthButtons from './AuthButtons';
import { LanguageSwitcher } from '@/components/languageswitcher/LanguageSwitcher';
import type { NavLink } from './index';

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  currentPath: string;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  isLoggedIn?: boolean;
  userData?: any;
  onLogout?: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navLinks,
  currentPath,
  onClose,
  onLoginClick,
  onRegisterClick,
  isLoggedIn = false,
  onLogout
}) => {
  // Add body scroll lock effect
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  return (
    <>
      {/* Menu Panel with CSS transitions instead of GSAP */}
      <div
        className={cn(
          "fixed top-0 right-0 w-4/5 max-w-[360px] h-full bg-[color:var(--color-bg-secondary)] z-[999] py-20 px-10 flex flex-col",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          // Only show when open to improve accessibility
          !isOpen && "invisible"
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-[color:var(--color-text-primary)] rounded-full hover:bg-white/10 z-[1000]"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col gap-6 mb-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-[color:var(--color-text-primary)] text-xl font-medium",
                currentPath === link.path && "text-[color:var(--color-accent-pink)]"
              )}
              onClick={onClose}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-auto mb-10">
          <LanguageSwitcher />
        </div>
        <div className="flex flex-col gap-4 mt-auto">
          {isLoggedIn && onLogout ? (
            <AuthButtons
              onLogoutClick={onLogout}
              isLoggedIn={true}
            />
          ) : (
            <AuthButtons
              onLoginClick={onLoginClick}
              onRegisterClick={onRegisterClick}
            />
          )}
        </div>
      </div>

      {/* Overlay with CSS transitions */}
      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]",
          "transition-opacity duration-300 ease-out",
          isOpen ? "opacity-100" : "opacity-0",
          // Only show when open
          !isOpen && "invisible"
        )}
        onClick={onClose}
      />
    </>
  );
};

export default MobileMenu;