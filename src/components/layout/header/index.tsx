import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
// Import hook
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
// Import components
import HeaderNavLinks from './HeaderNavLinks';
import HeaderSearch from './HeaderSearch';
import ThemeToggle from './ThemeToggle';
import AuthButtons from './AuthButtons';
import MobileMenu from './MobileMenu';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
// Define navigation links interface
export interface NavLink {
  name: string;
  path: string;
}
const Header: React.FC = () => {
  // Use our custom header scroll hook
  const headerRef = useHeaderScroll();
  
  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for auth modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  
  // Refs for mobile menu animation
  const mobileNavRef = React.useRef<HTMLDivElement>(null);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  
  // User authentication state (mock for now)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  
  // Get current location for active nav highlighting
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Define navigation links
  const navLinks: NavLink[] = [
    { name: 'Home', path: '/' },
    { name: 'Deals', path: '/deals' },
    { name: 'Categories', path: '/categories' },
    { name: 'Shops', path: '/shops' },
    { name: 'About', path: '/about' },
  ];
  // Handle auth modal functions
  const handleLoginClick = () => {
    setIsLoginOpen(true);
    setIsRegisterOpen(false);
    setIsMobileMenuOpen(false);
  };
  const handleRegisterClick = () => {
    setIsRegisterOpen(true);
    setIsLoginOpen(false);
    setIsMobileMenuOpen(false);
  };
  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };
  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };
  // Mock logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
  };
  return (
    <>
      <header 
        ref={headerRef}
        className="fixed top-0 left-0 w-full z-150 transition-all duration-300"
      >
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between h-full">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--accent-pink)] rounded-md flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <div className="text-[color:var(--color-text-primary)] text-xl font-semibold tracking-tight">
              Dealopia
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <HeaderNavLinks navLinks={navLinks} currentPath={currentPath} />
          </div>

          {/* Right Section: Search, Theme Toggle, Auth */}
          <div className="flex items-center gap-2 md:gap-4">
            <HeaderSearch className="hidden md:block" />
            <ThemeToggle />
            
            {/* User Menu or Auth Buttons */}
            <div className="hidden md:block">
              {isLoggedIn && userData ? (
                <UserMenu user={userData} onLogout={handleLogout} />
              ) : (
                <AuthButtons
                  onLoginClick={handleLoginClick}
                  onRegisterClick={handleRegisterClick}
                />
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-[color:var(--color-text-primary)] rounded-full hover:bg-white/5"
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu (Portal) */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        navLinks={navLinks}
        currentPath={currentPath}
        onClose={() => setIsMobileMenuOpen(false)}
        onLoginClick={handleLoginClick}
        onRegisterClick={handleRegisterClick}
        mobileNavRef={mobileNavRef}
        overlayRef={overlayRef}
        isLoggedIn={isLoggedIn}
        userData={userData}
        onLogout={handleLogout}
      />

      {/* Auth Modals */}
      <AuthModal
        isLoginOpen={isLoginOpen}
        isRegisterOpen={isRegisterOpen}
        onLoginClose={() => setIsLoginOpen(false)}
        onRegisterClose={() => setIsRegisterOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
};

export default Header;