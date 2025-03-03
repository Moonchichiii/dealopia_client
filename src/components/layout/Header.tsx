import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'react-feather';
import { cn } from '@/utils/cn';

import LanguageSwitcher from '@/components/LanguageSwitcher';

import Button from '@/components/Button';
import Login from '@/components/Login';
import Register from '@/components/Register';

interface NavLink {
    name: string;
    path: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/70" onClick={onClose}></div>
            <div className="relative z-10 bg-[color:var(--color-bg-primary)] p-6 rounded-lg w-full max-w-md">
                {children}
            </div>
        </div>
    );
};

export const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loginOpen, setLoginOpen] = useState<boolean>(false);
    const [registerOpen, setRegisterOpen] = useState<boolean>(false);
    const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);

    const headerRef = useRef<HTMLElement>(null);
    const mobileNavRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const timeline = useRef<gsap.core.Timeline | null>(null);

    const navLinks: NavLink[] = [
        { name: 'Home', path: '/' },
        { name: 'Deals', path: '/deals' },
        { name: 'Categories', path: '/categories' },
        { name: 'Shops', path: '/shops' },
        { name: 'About', path: '/about' },
    ];

    // Listen for route changes
    useEffect(() => {
        const handleLocationChange = (): void => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener('popstate', handleLocationChange);
        return () => window.removeEventListener('popstate', handleLocationChange);
    }, []);

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
    }, []);

    // Toggle mobile menu
    const toggleMenu = (): void => {
        if (timeline.current) {
            if (isOpen) {
                document.body.style.overflow = '';
                timeline.current.reverse();
            } else {
                document.body.style.overflow = 'hidden';
                timeline.current.play();
            }
            setIsOpen(!isOpen);
        }
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
    }, [currentPath]);

    return (
        <>
            <header
                ref={headerRef}
                className="fixed top-0 left-0 w-full z-[1000] transition-all duration-300"
                style={{
                    padding: '40px 0',
                    background: 'transparent'
                }}
            >
                <div className="container mx-auto px-5 md:px-10 flex justify-between items-center"></div>
                    <Link to="/" className="flex items-center gap-3 text-[color:var(--color-text-primary)] no-underline">
                        <div className="w-10 h-10 bg-[color:var(--color-accent-pink)] rounded-sm flex items-center justify-center font-bold text-xl">
                            D
                        </div>
                        <div className="text-xl font-semibold tracking-tight">Dealopia</div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-12">
                        <div className="flex gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={cn(
                                        "text-[color:var(--color-text-primary)] font-medium hover:text-[color:var(--color-accent-pink)] transition-colors relative",
                                        currentPath === link.path && "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:bg-[color:var(--color-accent-pink)]"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <LanguageSwitcher />
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setLoginOpen(true)}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => setRegisterOpen(true)}
                            >
                                Sign Up
                            </Button>
                        </div>
                    </nav>

                    <button
                        className="md:hidden text-[color:var(--color-text-primary)] bg-transparent border-none flex items-center justify-center"
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </header>

            {/* Mobile Navigation */}
            <div
                ref={mobileNavRef}
                className="fixed top-0 right-0 w-4/5 max-w-[360px] h-full bg-[color:var(--color-bg-secondary)] z-[999] py-20 px-10 flex flex-col transform translate-x-full"
            >
                <button
                    className="absolute top-6 right-6 text-[color:var(--color-text-primary)] bg-transparent border-none"
                    onClick={toggleMenu}
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
                        onClick={() => setLoginOpen(true)}
                    >
                        Sign In
                    </Button>
                    <Button
                        fullWidth
                        variant="primary"
                        onClick={() => setRegisterOpen(true)}
                    >
                        Sign Up
                    </Button>
                </div>
            </div>

            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-[5px] z-[998] opacity-0 invisible"
                onClick={toggleMenu}
            />

            {/* Auth modals */}
            {loginOpen && (
                <Modal isOpen={loginOpen} onClose={() => setLoginOpen(false)}>
                    <React.Suspense fallback={<p>Loading login form...</p>}>
                        <Login onClose={() => setLoginOpen(false)} />
                    </React.Suspense>
                </Modal>
            )}

            {registerOpen && (
                <Modal isOpen={registerOpen} onClose={() => setRegisterOpen(false)}>
                    <React.Suspense fallback={<p>Loading registration form...</p>}>
                        <Register onClose={() => setRegisterOpen(false)} />
                    </React.Suspense>
                </Modal>
            )}
        </>
    );
};