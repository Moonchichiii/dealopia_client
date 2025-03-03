import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'react-feather';
import { gsap } from 'gsap';
import { cn } from '@/utils/cn';

import Button from '@/components/buttons/AuthButton';
import { LanguageSwitcher } from '@/components/languageswitcher/LanguageSwitcher';
import type { NavLink } from './index';

interface MobileMenuProps {
  isOpen: boolean;
  navLinks: NavLink[];
  currentPath: string;
  onClose: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  mobileNavRef: React.RefObject<HTMLDivElement>;
  overlayRef: React.RefObject<HTMLDivElement>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navLinks,
  currentPath,
  onClose,
  onLoginClick,
  onRegisterClick,
  mobileNavRef,
  overlayRef
}) => {
  const timeline = useRef<gsap.core.Timeline | null>(null);

  // Mobile menu animation setup
  useEffect(() => {
    if (!mobileNavRef.current || !overlayRef.current) return;

    timeline.current = gsap.timeline({ paused: true })
      .fromTo(
        mobileNavRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.4, ease: 'power3.out' }
      )
      .fromTo(
        overlayRef.current,
        { opacity: 0, visibility: 'hidden' },
        { opacity: 1, visibility: 'visible', duration: 0.4, ease: 'power3.out' },
        '<'
      );

    return () => {
      if (timeline.current) {
        timeline.current.kill();
      }
    };
  }, [mobileNavRef, overlayRef]);

  // Toggle the animation when isOpen changes
  useEffect(() => {
    if (!timeline.current) return;
    
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      timeline.current.play();
    } else {
      document.body.style.overflow = '';
      timeline.current.reverse();
    }
  }, [isOpen]);

  return (
    <>
      <div
        ref={mobileNavRef}
        className="fixed top-0 right-0 w-4/5 max-w-[360px] h-full bg-[color:var(--color-bg-secondary)] z-[999] py-20 px-10 flex flex-col transform translate-x-full"
      >
        <button
          className="absolute top-6 right-6 text-[color:var(--color-text-primary)] bg-transparent border-none"
          onClick={onClose}
          aria-label="Close Menu"
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
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          <LanguageSwitcher />
          <Button
            fullWidth
            variant="secondary"
            onClick={onLoginClick}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="primary"
            onClick={onRegisterClick}
          >
            Sign Up
          </Button>
        </div>
      </div>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-[5px] z-[998] opacity-0 invisible"
        onClick={onClose}
      />
    </>
  );
};

export default MobileMenu;