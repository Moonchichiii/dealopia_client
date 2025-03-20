import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tag, LogIn, Menu, X, UserPlus, Store, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > window.innerHeight * 0.03); // 3% of viewport height
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
    { code: 'nl', name: 'Nederlands' },
  ];

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Shops', href: '/shops', icon: Store },
    { name: 'About', href: '/about' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasScrolled 
          ? 'bg-stone-950/20 backdrop-blur-xl border-b border-stone-800/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            aria-label="DealOpia Home"
          >
            <div className="bg-primary-500/10 p-2 rounded-xl group-hover:bg-primary-500/20 transition-colors">
              <Tag className="w-6 h-6 text-primary-400" aria-hidden="true" />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-400 to-accent-400 text-transparent bg-clip-text">
              DealOpia
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                  location.pathname === item.href
                    ? 'text-primary-400'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {item.icon && <item.icon size={16} />}
                {item.name}
              </Link>
            ))}
            <button
              className="flex items-center gap-2 text-sm font-medium text-stone-300 hover:text-white transition-colors"
              onClick={() => {/* Handle location click */}}
            >
              <MapPin size={16} />
              <span>Near Me</span>
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="bg-stone-900/50 text-stone-300 border border-stone-800 rounded-lg px-3 py-1.5 text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50 cursor-pointer transition-all"
              aria-label="Select language"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-stone-950">
                  {lang.name}
                </option>
              ))}
            </select>

            <Link
              to="/signin"
              className="flex items-center gap-2 bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 px-4 py-2 rounded-lg transition-colors"
            >
              <LogIn size={18} aria-hidden="true" />
              <span className="font-medium">Sign In</span>
            </Link>

            <Link
              to="/signup"
              className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <UserPlus size={18} aria-hidden="true" />
              <span className="font-medium">Sign Up</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-stone-900/50 hover:bg-stone-800/50 transition-colors"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-stone-300" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6 text-stone-300" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-3/4 max-w-sm bg-stone-900 border-l border-stone-800/50 md:hidden"
            >
              <div className="flex flex-col h-full overflow-y-auto">
                <div className="p-4 border-b border-stone-800/50">
                  <select
                    value={i18n.language}
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    className="w-full bg-stone-800/50 text-stone-300 border border-stone-700 rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50"
                    aria-label="Select language"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-stone-950">
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        location.pathname === item.href
                          ? 'bg-primary-500/10 text-primary-400'
                          : 'text-stone-300 hover:bg-stone-800/50 hover:text-white'
                      }`}
                    >
                      {item.icon && <item.icon size={18} />}
                      {item.name}
                    </Link>
                  ))}
                  <button
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-stone-300 hover:bg-stone-800/50 hover:text-white transition-colors"
                    onClick={() => {/* Handle location click */}}
                  >
                    <MapPin size={18} />
                    <span>Near Me</span>
                  </button>
                </nav>
                <div className="p-4 space-y-3 border-t border-stone-800/50">
                  <Link
                    to="/signin"
                    className="flex items-center justify-center gap-2 w-full bg-primary-500/10 hover:bg-primary-500/20 text-primary-400 px-4 py-2 rounded-lg transition-colors"
                  >
                    <LogIn size={18} aria-hidden="true" />
                    <span className="font-medium">Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <UserPlus size={18} aria-hidden="true" />
                    <span className="font-medium">Sign Up</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;