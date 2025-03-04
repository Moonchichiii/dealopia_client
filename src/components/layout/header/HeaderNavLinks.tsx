import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import type { NavLink } from '@/components/layout/header/index';

interface HeaderNavLinksProps {
  navLinks: NavLink[];
  currentPath: string;
  className?: string; // Add a className prop for flexibility
}

const HeaderNavLinks: React.FC<HeaderNavLinksProps> = ({ 
  navLinks, 
  currentPath,
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-6 md:gap-8 ${className}`}>
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={cn(
            "text-[color:var(--color-text-primary)] font-medium hover:text-[color:var(--color-accent-pink)] transition-colors relative whitespace-nowrap",
            currentPath === link.path && "after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:w-full after:bg-[color:var(--color-accent-pink)]"
          )}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default HeaderNavLinks;