import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Language {
    code: string;
    name: string;
}

const languages: Language[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' }
];

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    
    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
    
    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsOpen(false);
    };
    
    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-textSecondary hover:text-textPrimary transition-colors p-2 rounded-md"
                aria-label="Change language"
            >
                <Languages size={18} />
                <span className="text-sm font-medium hidden sm:inline">{currentLanguage.name}</span>
                <ChevronDown size={16} className={cn("transition-transform", isOpen && "rotate-180")} />
            </button>
            
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 py-1 bg-bgSecondary rounded-md shadow-lg border border-white/5 z-50">
                    {languages.map(language => (
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