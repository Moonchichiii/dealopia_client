import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { cn } from '@/utils/cn';

import AuthButtons from '@/components/layout/header/AuthButtons';
import { LanguageSwitcher } from '@/components/languageswitcher/LanguageSwitcher';
import type { NavLink } from '@/components/layout/header/index';

interface MobileMenuProps {
    isOpen: boolean;
    navLinks: NavLink[];
    currentPath: string;
    onClose: () => void;
    onLoginClick: () => void;
    onRegisterClick: () => void;
    mobileNavRef: React.RefObject<HTMLDivElement>;
    overlayRef: React.RefObject<HTMLDivElement>;
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
    mobileNavRef,
    overlayRef,
    isLoggedIn = false,
    onLogout
}) => {
   
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    
    // Reference to track if menu is fully closed
    const isClosedRef = useRef(true);

    // Initialize GSAP timeline only once on mount
    useEffect(() => {
        if (!mobileNavRef.current || !overlayRef.current) return;

        // Create a GSAP timeline for the animation sequence
        timelineRef.current = gsap.timeline({ 
            paused: true,
            onComplete: () => { isClosedRef.current = false },
            onReverseComplete: () => { isClosedRef.current = true }
        })
            .set(overlayRef.current, { visibility: 'visible', opacity: 0 })
            .set(mobileNavRef.current, { visibility: 'visible', x: '100%' })
            .to(overlayRef.current, { 
                opacity: 1, 
                duration: 0.3, 
                ease: 'power2.out' 
            })
            .to(mobileNavRef.current, { 
                x: '0%', 
                duration: 0.4, 
                ease: 'power3.out' 
            }, '<0.1');

        // Set initial state of elements
        gsap.set(mobileNavRef.current, { visibility: 'hidden', x: '100%' });
        gsap.set(overlayRef.current, { visibility: 'hidden', opacity: 0 });

        return () => {
            // Clean up the timeline when component unmounts
            if (timelineRef.current) {
                timelineRef.current.kill();
            }
        };
    }, []);

    // Handle toggle animation when isOpen changes
    useEffect(() => {
        if (!timelineRef.current) return;
        
        if (isOpen) {
            // Lock scrolling when menu opens
            document.body.style.overflow = 'hidden';
            
            // This ensures the elements are visible before animating
            gsap.set([mobileNavRef.current, overlayRef.current], { visibility: 'visible' });
            
            // Play the animation forward
            timelineRef.current.play();
        } else if (!isClosedRef.current) {
            
            document.body.style.overflow = '';
            
            // Play the animation in reverse to close
            timelineRef.current.reverse();
        }
    }, [isOpen]);

   
    return (
        <>
            {/* Menu Panel */}
            <div
                ref={mobileNavRef}
                className="fixed top-0 right-0 w-4/5 max-w-[360px] h-full bg-[color:var(--color-bg-secondary)] z-[999] py-20 px-10 flex flex-col"
                style={{ visibility: 'hidden' }}
            >
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

            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
                style={{ visibility: 'hidden' }} // Initially hidden, GSAP will control this
                onClick={onClose}
            />
        </>
    );
};

export default MobileMenu;
