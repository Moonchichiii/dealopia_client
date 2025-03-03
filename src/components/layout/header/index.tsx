import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu } from 'lucide-react';

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

import LogoButton from '@/components/buttons/LogoButton';
import { LanguageSwitcher } from '@/components/languageswitcher/LanguageSwitcher';
import MobileMenu from './MobileMenu';
import HeaderNavLinks from './HeaderNavLinks';
import AuthButtons from './AuthButtons';
import HeaderSearch from './HeaderSearch';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import { AuthModal } from './AuthModal';

export interface NavLink {
    name: string;
    path: string;
}

export const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loginOpen, setLoginOpen] = useState<boolean>(false);
    const [registerOpen, setRegisterOpen] = useState<boolean>(false);
    const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // This would come from your auth context

    const headerRef = useRef<HTMLElement>(null);
    const mobileNavRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    
    // Mock user data - in reality, this would come from your auth context
    const userData = {
        id: '123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatar: undefined
    };

    const navLinks: NavLink[] = [
        { name: 'Home', path: '/' },
        { name: 'Deals', path: '/deals' },
        { name: 'Categories', path: '/categories' },
        { name: 'Shops', path: '/shops' },
        { name: 'About', path: '/about' },
    ];

    // Mock logout function
    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    // Listen for route changes
    useEffect(() => {
        const handleLocationChange = (): void => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);

    // Toggle mobile menu
    const toggleMenu = (): void => {
        setIsOpen(!isOpen);
    };

    // Header scroll animation for sticky behavior
    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        // Set initial state
        gsap.set(header, {
            backgroundColor: 'transparent',
            backdropFilter: 'none',
            boxShadow: 'none',
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%'
        });

        const scrollTrigger = ScrollTrigger.create({
            start: 'top top',
            end: '+=100',
            toggleClass: { className: 'header-scrolled', targets: header },
            onUpdate: (self): void => {
                // Transform it on scroll
                gsap.to(header, {
                    backgroundColor: self.progress > 0 ? 'var(--color-bg-secondary)' : 'transparent',
                    boxShadow: self.progress > 0 ? '0 5px 20px rgba(0, 0, 0, 0.2)' : 'none',
                    backdropFilter: self.progress > 0 ? 'blur(10px)' : 'none',
                    padding: self.progress > 0 ? '15px 0' : '40px 0',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        });

        return () => {
            scrollTrigger.kill();
        };
    }, []);

    // Close menu when path changes
    useEffect(() => {
        if (isOpen) {
            toggleMenu();
        }
    }, [currentPath, isOpen]);

    return (
        <>
            <header
                ref={headerRef}
                className="fixed top-0 left-0 w-full z-[1000] transition-all duration-300 py-10 bg-transparent"
            >
                <div className="container mx-auto px-5 md:px-10 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-3 text-[color:var(--color-text-primary)] no-underline">
                        <LogoButton />
                        <div className="text-xl font-semibold tracking-tight">Dealopia</div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-12">
                        <HeaderNavLinks navLinks={navLinks} currentPath={currentPath} />

                        <div className="flex items-center gap-4">
                            <HeaderSearch />
                            <ThemeToggle />
                            <LanguageSwitcher />
                            
                            {isLoggedIn ? (
                                <UserMenu 
                                    user={userData} 
                                    onLogout={handleLogout} 
                                />
                            ) : (
                                <AuthButtons 
                                    onLoginClick={() => setLoginOpen(true)} 
                                    onRegisterClick={() => setRegisterOpen(true)} 
                                />
                            )}
                        </div>
                    </nav>

                    <button
                        type="button"
                        className="md:hidden text-[color:var(--color-text-primary)] bg-transparent border-none flex items-center justify-center"
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            {/* Mobile Navigation */}
            <MobileMenu 
                isOpen={isOpen} 
                navLinks={navLinks} 
                currentPath={currentPath}
                onClose={toggleMenu}
                onLoginClick={() => setLoginOpen(true)}
                onRegisterClick={() => setRegisterOpen(true)}
                mobileNavRef={mobileNavRef}
                overlayRef={overlayRef}
                isLoggedIn={isLoggedIn}
                userData={userData}
                onLogout={handleLogout}
            />

            {/* Auth modals */}
            <AuthModal 
                isLoginOpen={loginOpen}
                isRegisterOpen={registerOpen}
                onLoginClose={() => setLoginOpen(false)}
                onRegisterClose={() => setRegisterOpen(false)}
            />
        </>
    );
};

export default Header;