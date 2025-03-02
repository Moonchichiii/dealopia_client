'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import gsap from 'gsap';

const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' }
] as const;

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];
    
    const handleLanguageChange = (code: string) => {
        i18n.changeLanguage(code);
        setIsOpen(false);
    };

    // GSAP animation for the dropdown
    useEffect(() => {
        if (dropdownRef.current) {
            if (isOpen) {
                gsap.set(dropdownRef.current, { opacity: 0, y: -10 });
                gsap.to(dropdownRef.current, { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.3, 
                    ease: "power3.out" 
                });
            }
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={menuRef} className="relative">
            <button
                className="flex items-center space-x-2 py-2 px-3 rounded-md hover:bg-white/5 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Change language"
            >
                <Languages size={18} />
                <span className="text-sm font-medium hidden sm:inline">{currentLanguage.name}</span>
                <ChevronDown 
                    size={16} 
                    className={cn("transition-transform", isOpen && "rotate-180")} 
                    ref={ref => {
                        if (ref && isOpen) {
                            gsap.to(ref, { rotation: 180, duration: 0.3 });
                        } else if (ref && !isOpen) {
                            gsap.to(ref, { rotation: 0, duration: 0.3 });
                        }
                    }}
                />
            </button>
            
            {isOpen && (
                <div 
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-40 py-1 bg-bgSecondary rounded-md shadow-lg border border-white/5 z-50"
                >
                    {LANGUAGES.map(language => (
                        <button
                            key={language.code}
                            onClick={() => handleLanguageChange(language.code)}
                            className={cn(
                                "block px-4 py-2 text-sm w-full text-left",
                                language.code === i18n.language
                                    ? "bg-accentPink/10 text-accentPink font-medium"
                                    : "text-textSecondary hover:text-textPrimary hover:bg-white/5"
                            )}
                        >
                            {language.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};