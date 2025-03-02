'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const mobileNavRef = useRef(null);
    const overlayRef = useRef(null);
    const pathname = usePathname();

    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Toggle mobile menu
    const toggleMenu = () => {
        setIsOpen(!isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
    };

    // Close menu when path changes
    useEffect(() => {
        if (isOpen) {
            toggleMenu();
        }
    }, [pathname]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                    isScrolled ? 'bg-bgSecondary/95 backdrop-blur-md shadow-md py-4' : 'py-8'
                }`}
            >
                <div className="container flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-3 text-white no-underline">
                        <div className="w-10 h-10 bg-accentPink rounded-sm flex items-center justify-center font-bold text-xl">
                            D
                        </div>
                        <div className="text-xl font-semibold tracking-tight">Dealopia</div>
                    </Link>
                 
                    <nav className="hidden md:flex items-center gap-12">
                        <div className="flex gap-8">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Deals', path: '/deals' },
                                { name: 'Categories', path: '/categories' },
                                { name: 'Shops', path: '/shops' },
                                { name: 'About', path: '/about' },
                            ].map((link) => (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className={`text-white font-medium hover:text-accentPink transition-colors relative ${
                                        pathname === link.path ? "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:bg-accentPink" : ""
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                     
                        <div className="flex gap-4">
                            <button className="btn btn-secondary px-5 py-2 text-sm">Login</button>
                            <button className="btn btn-primary px-5 py-2 text-sm">Sign Up</button>
                        </div>
                    </nav>
                 
                    <button
                        className="md:hidden text-white p-2"
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
                className={`fixed top-0 right-0 w-4/5 max-w-[360px] h-full bg-bgSecondary z-40 pt-20 px-10 flex flex-col transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'
                }`}
            >
                <button
                    className="absolute top-6 right-6 text-white"
                    onClick={toggleMenu}
                    aria-label="Close Menu"
                >
                    <X size={24} />
                </button>
             
                <div className="flex flex-col gap-6 mb-10">
                    {[
                        { name: 'Home', path: '/' },
                        { name: 'Deals', path: '/deals' },
                        { name: 'Categories', path: '/categories' },
                        { name: 'Shops', path: '/shops' },
                        { name: 'About', path: '/about' },
                    ].map((link) => (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`text-white text-xl font-medium ${
                                pathname === link.path ? "text-accentPink" : ""
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>
             
                <div className="flex flex-col gap-4 mt-auto mb-10">
                    <button className="btn btn-secondary py-3 w-full">Login</button>
                    <button className="btn btn-primary py-3 w-full">Sign Up</button>
                </div>
            </div>
         
            {/* Overlay */}
            <div
                ref={overlayRef}
                className={`fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-sm z-30 transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                onClick={toggleMenu}
            />
        </>
    );
};

export default Header;