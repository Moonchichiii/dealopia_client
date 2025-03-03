import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, Heart, ShoppingBag } from 'react-feather';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

interface UserMenuProps {
  user: UserData;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 hover:text-[color:var(--color-accent-pink)] transition-colors"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={`${user.firstName} ${user.lastName}`} 
            className="w-8 h-8 rounded-full object-cover border-2 border-[color:var(--color-accent-pink)]" 
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[color:var(--color-accent-pink)] flex items-center justify-center text-white">
            {user.firstName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden sm:inline font-medium">{user.firstName}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-[color:var(--color-bg-secondary)] rounded-md shadow-lg z-10 border border-white/10">
          <div className="px-4 py-2 text-sm text-[color:var(--color-text-secondary)] border-b border-white/10">
            <p>{user.firstName} {user.lastName}</p>
            <p className="truncate">{user.email}</p>
          </div>
          
          <Link 
            to="/profile" 
            className="block px-4 py-2 text-sm text-[color:var(--color-text-primary)] hover:bg-white/5 flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} />
            Profile
          </Link>
          
          <Link 
            to="/favorites" 
            className="block px-4 py-2 text-sm text-[color:var(--color-text-primary)] hover:bg-white/5 flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <Heart size={16} />
            Favorites
          </Link>
          
          <Link 
            to="/my-deals" 
            className="block px-4 py-2 text-sm text-[color:var(--color-text-primary)] hover:bg-white/5 flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <ShoppingBag size={16} />
            My Deals
          </Link>
          
          <Link 
            to="/settings" 
            className="block px-4 py-2 text-sm text-[color:var(--color-text-primary)] hover:bg-white/5 flex items-center gap-2"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} />
            Settings
          </Link>
          
          <div className="border-t border-white/10 mt-1"></div>
          
          <button 
            className="block w-full text-left px-4 py-2 text-sm text-[color:var(--color-text-primary)] hover:bg-white/5 flex items-center gap-2"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;