import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import type { NavLink } from './index';

interface HeaderNavLinksProps {
  navLinks: NavLink[];
  currentPath: string;
}

const HeaderNavLinks: React.FC<HeaderNavLinksProps> = ({ navLinks, currentPath }) => {
  return (
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
  );
};

export default HeaderNavLinks;