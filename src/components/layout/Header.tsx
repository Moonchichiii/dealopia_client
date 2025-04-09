import { useEffect, useMemo, useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LogIn,
  MapPin,
  Menu,
  Moon,
  Store,
  Sun,
  Tag,
  UserPlus,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthModal } from '@/components/auth/AuthModal';
import { useLogout, useUser } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';
import { createPortal } from 'react-dom';

interface LanguageOption {
  code: string;
  name: string;
}

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ size?: number }>;
}

// New props for theme toggling
interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Header = ({ isDarkMode, toggleTheme }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { data: user } = useUser();
  const { logout } = useLogout();
  const { openSignIn, openSignUp, AuthModal } = useAuthModal();
  const [isLandscape, setIsLandscape] = useState(
    window.matchMedia('(orientation: landscape) and (max-height: 500px)').matches
  );
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > window.innerHeight * 0.03);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(
        window.matchMedia('(orientation: landscape) and (max-height: 500px)').matches
      );
    };
    window.addEventListener('resize', checkOrientation);
    return () => window.removeEventListener('resize', checkOrientation);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const languages: LanguageOption[] = useMemo(() => [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' },
    { code: 'nl', name: 'Nederlands' },
  ], []);

  const navigation: NavigationItem[] = useMemo(() => {
    const baseNavigation = [
      { name: 'Home', href: '/' },
      { name: 'Shops', href: '/shops', icon: Store },
      { name: 'About', href: '/about' },
    ];
    return isAuthenticated
      ? [...baseNavigation, { name: 'Dashboard', href: '/dashboard' }]
      : baseNavigation;
  }, [isAuthenticated]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [logout]);

  const handleLanguageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      i18n.changeLanguage(e.target.value);
    },
    [i18n]
  );

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    let overlay = document.getElementById('overlay-root');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'overlay-root';
      document.body.appendChild(overlay);
    }
  }, []);
  

  const headerStyle = {
    background: hasScrolled ? 'rgba(10, 10, 10, 0.2)' : 'transparent',
    backdropFilter: hasScrolled ? 'blur(12px)' : 'none',
    borderBottom: hasScrolled ? '1px solid rgba(38, 38, 38, 0.5)' : 'none'
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-150 transition-all duration-300"
        style={headerStyle}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center space-x-2 group"
              aria-label="DealOpia Home"
            >
              <div
                className="group-hover:bg-[rgba(139,92,246,0.2)]"
                style={{
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  padding: '0.5rem',
                  borderRadius: '0.75rem',
                  transition: 'background-color 0.2s'
                }}
              >
                <Tag className="w-6 h-6" style={{ color: '#a78bfa' }} aria-hidden="true" />
              </div>
              <span className="text-xl font-display font-bold gradient-text">
                DealOpia
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-sm font-medium transition-colors flex items-center gap-2"
                  style={{
                    color: location.pathname === item.href ? '#a78bfa' : '#d4d4d4',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.color = '#a78bfa')}
                  onMouseOut={(e) => {
                    if (location.pathname !== item.href) {
                      e.currentTarget.style.color = '#d4d4d4';
                    }
                  }}
                >
                  {item.icon && <item.icon size={16} />}
                  {item.name}
                </Link>
              ))}
              <button
                className="flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: '#d4d4d4' }}
                onClick={() => {
                  const nearMeSection = document.getElementById('near-me');
                  nearMeSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#a78bfa')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#d4d4d4')}
                aria-label="Scroll to near me deals"
              >
                <MapPin size={16} />
                <span>Near Me</span>
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-[rgba(139,92,246,0.1)] transition-colors"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-[#a78bfa]" />
                ) : (
                  <Moon size={20} className="text-[#a78bfa]" />
                )}
              </button>

              <div className="relative">
                <select
                  value={i18n.language}
                  onChange={handleLanguageChange}
                  className="focus:outline-none focus:border-[#a78bfa] focus:ring-2 focus:ring-[rgba(139,92,246,0.2)]"
                  style={{
                    backgroundColor: 'rgba(23, 23, 23, 0.5)',
                    color: '#d4d4d4',
                    border: '1px solid #404040',
                    borderRadius: '0.5rem',
                    padding: '0.375rem 2rem 0.375rem 0.75rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    appearance: 'none',
                    backgroundImage:
                      'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23d4d4d4\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.5rem center',
                    backgroundSize: '1.25rem'
                  }}
                  aria-label="Select language"
                >
                  {languages.map((lang) => (
                    <option
                      key={lang.code}
                      value={lang.code}
                      className="bg-black text-gray-300"
                    >
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 bg-[rgba(139,92,246,0.1)] text-[#a78bfa] px-4 py-2 rounded-lg font-medium transition-colors hover:bg-[rgba(139,92,246,0.2)]"
                  >
                    <span>{user?.first_name || 'Dashboard'}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] text-[#d4d4d4] hover:text-white px-4 py-2 rounded-lg font-medium transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                  >
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={openSignIn}
                    className="flex items-center gap-2 bg-[rgba(139,92,246,0.1)] text-[#a78bfa] px-4 py-2 rounded-lg font-medium transition-colors hover:bg-[rgba(139,92,246,0.2)]"
                  >
                    <LogIn size={18} aria-hidden="true" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={openSignUp}
                    className="flex items-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <UserPlus size={18} aria-hidden="true" />
                    <span>Sign Up</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-[rgba(139,92,246,0.1)] transition-colors"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <Sun size={18} className="text-[#a78bfa]" />
                ) : (
                  <Moon size={18} className="text-[#a78bfa]" />
                )}
              </button>

              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg bg-gray-900/50 hover:bg-gray-800/50 transition-colors"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-300" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-300" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {AuthModal}

      {/* Mobile Sidebar Overlay via Portal */}
      
      <AnimatePresence>
        {isMenuOpen &&
          createPortal(
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm md:hidden z-[9998]"
                onClick={closeMenu}
                aria-hidden="true"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 20 }}
                className={cn(
                  "fixed right-0 top-0 bottom-0 md:hidden flex flex-col z-[9999]",
                  isLandscape
                    ? "w-1/2 max-w-xs bg-gray-900/95 backdrop-blur-md border-l border-gray-800/50 overflow-y-auto"
                    : "w-3/4 max-w-xs bg-gray-900 border-l border-gray-800/50"
                )}
                style={{
                  height: isLandscape ? '100%' : 'auto',
                  maxHeight: '100%',
                }}
              >
                <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
                  <div></div>
                  <button
                    onClick={closeMenu}
                    className="p-1 rounded-lg hover:bg-gray-800/50 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5 text-gray-400" aria-hidden="true" />
                  </button>
                </div>
                <div className="flex flex-col h-full overflow-y-auto">
                  <nav className={cn(
                    "flex-1 space-y-1",
                    isLandscape ? "p-2" : "p-4 space-y-2"
                  )}>
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s',
                          color: location.pathname === item.href ? '#a78bfa' : '#d4d4d4',
                          backgroundColor: location.pathname === item.href ?
                            'rgba(139,92,246,0.1)' : 'transparent',
                          padding: isLandscape ? '0.5rem 0.75rem' : '0.75rem 1rem',
                          borderRadius: '0.75rem',
                          fontSize: isLandscape ? '0.8rem' : '0.875rem',
                          fontWeight: 500
                        }}
                        className={location.pathname !== item.href ? "hover:bg-[rgba(38,38,38,0.5)]" : ""}
                        onClick={closeMenu}
                      >
                        {item.icon && <item.icon size={isLandscape ? 16 : 18} />}
                        {item.name}
                      </Link>
                    ))}
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        width: '100%',
                        padding: isLandscape ? '0.5rem 0.75rem' : '0.75rem 1rem',
                        borderRadius: '0.75rem',
                        fontSize: isLandscape ? '0.8rem' : '0.875rem',
                        fontWeight: 500,
                        transition: 'colors 0.2s',
                        color: '#d4d4d4',
                        textAlign: 'left'
                      }}
                      className="hover:bg-[rgba(38,38,38,0.5)]"
                      onClick={closeMenu}
                    >
                      <MapPin size={isLandscape ? 16 : 18} />
                      <span>Near Me</span>
                    </button>
                    <div className={cn("pt-2", isLandscape ? "px-2" : "px-4")}>
                      <select
                        value={i18n.language}
                        onChange={handleLanguageChange}
                        className={cn(
                          "w-full bg-gray-800/50 text-gray-300 border border-gray-700 rounded-lg text-sm font-medium appearance-none cursor-pointer transition-all focus:outline-none focus:border-[#a78bfa] focus:ring-2 focus:ring-[rgba(139,92,246,0.2)]",
                          isLandscape ? "py-1.5 pl-2 pr-6" : "py-2 pl-3 pr-8"
                        )}
                        aria-label="Select language"
                        style={{
                          backgroundImage:
                            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%23d4d4d4\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 0.5rem center',
                          backgroundSize: '1.25rem'
                        }}
                      >
                        {languages.map((lang) => (
                          <option
                            key={lang.code}
                            value={lang.code}
                            className="bg-black text-gray-300"
                          >
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </nav>
                  <div className={cn(
                    "space-y-2 border-t border-gray-800/50",
                    isLandscape ? "p-2" : "p-4 space-y-3"
                  )}>
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/dashboard"
                          className="flex items-center justify-center gap-2 w-full bg-[rgba(139,92,246,0.1)] text-[#a78bfa] rounded-lg font-medium transition-colors hover:bg-[rgba(139,92,246,0.2)]"
                          style={{
                            padding: isLandscape ? '0.4rem 0.75rem' : '0.5rem 1rem',
                            fontSize: isLandscape ? '0.8rem' : '0.875rem'
                          }}
                          onClick={closeMenu}
                        >
                          <span>
                            {user?.first_name ? `${user.first_name}'s Dashboard` : 'Dashboard'}
                          </span>
                        </Link>
                        <button
                          onClick={() => {
                            closeMenu();
                            handleLogout();
                          }}
                          className="flex items-center justify-center gap-2 w-full bg-[rgba(255,255,255,0.05)] text-[#d4d4d4] rounded-lg font-medium transition-colors hover:bg-[rgba(255,255,255,0.1)]"
                          style={{
                            padding: isLandscape ? '0.4rem 0.75rem' : '0.5rem 1rem',
                            fontSize: isLandscape ? '0.8rem' : '0.875rem'
                          }}
                        >
                          <span>Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            closeMenu();
                            openSignIn();
                          }}
                          className="flex items-center justify-center gap-2 w-full bg-[rgba(139,92,246,0.1)] text-[#a78bfa] rounded-lg font-medium transition-colors hover:bg-[rgba(139,92,246,0.2)]"
                          style={{
                            padding: isLandscape ? '0.4rem 0.75rem' : '0.5rem 1rem',
                            fontSize: isLandscape ? '0.8rem' : '0.875rem'
                          }}
                        >
                          <LogIn size={isLandscape ? 16 : 18} aria-hidden="true" />
                          <span>Sign In</span>
                        </button>
                        <button
                          onClick={() => {
                            closeMenu();
                            openSignUp();
                          }}
                          className="flex items-center justify-center gap-2 w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white rounded-lg font-medium transition-colors"
                          style={{
                            padding: isLandscape ? '0.4rem 0.75rem' : '0.5rem 1rem',
                            fontSize: isLandscape ? '0.8rem' : '0.875rem'
                          }}
                        >
                          <UserPlus size={isLandscape ? 16 : 18} aria-hidden="true" />
                          <span>Sign Up</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </>,
            document.getElementById('overlay-root')!
          )
        }
      </AnimatePresence>
    </>
  );
};

export default Header;
