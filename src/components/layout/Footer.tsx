import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// Third-party imports
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Tag, Twitter } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Custom hook for footer animation
const useFooterAnimation = (footerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const footerItems = footerRef.current?.querySelectorAll('.footer-item');
      
      if (footerItems) {
        gsap.set(footerItems, { opacity: 0 });
        gsap.to(footerItems, {
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
          }
        });
      }
    });

    return () => ctx.revert();
  }, [footerRef]);
};

// Footer link item type
type FooterLinkProps = {
  to: string;
  label: string;
};

const FooterLink = ({ to, label }: FooterLinkProps) => (
  <li>
    <Link to={to} className="text-neutral-400 hover:text-white transition-colors">
      {label}
    </Link>
  </li>
);

// Footer link section component
type FooterSectionProps = {
  title: string;
  links: FooterLinkProps[];
};

const FooterSection = ({ title, links }: FooterSectionProps) => (
  <div className="footer-item">
    <h3 className="font-display font-semibold text-white mb-4">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <FooterLink key={link.to} to={link.to} label={link.label} />
      ))}
    </ul>
  </div>
);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  useFooterAnimation(footerRef);

  const companyLinks = [
    { to: "/about", label: "About Us" },
    { to: "/privacy", label: "Privacy Policy" },
    { to: "/terms", label: "Terms of Service" }
  ];

  const supportLinks = [
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Contact Us" },
    { to: "/help", label: "Help Center" }
  ];

  return (
    <footer 
      ref={footerRef} 
      className="border-t border-neutral-800/50 bg-neutral-950/50 backdrop-blur-xl"
      style={{ minHeight: '350px' }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="footer-item">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-500/10 p-2 rounded-xl">
                <Tag className="w-6 h-6 text-primary-400" />
              </div>
              <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-400 to-accent-400 text-transparent bg-clip-text inline-block">
                DealOpia
              </span>
            </Link>
            <p className="text-neutral-400 text-sm">
              Discover the best local deals while supporting sustainable shopping practices.
            </p>
          </div>

          <FooterSection title="Company" links={companyLinks} />
          <FooterSection title="Support" links={supportLinks} />

          <div className="footer-item">
            <h3 className="font-display font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Github size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-white transition-colors"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-item mt-12 pt-8 border-t border-neutral-800/50 text-center text-neutral-400 text-sm">
          <p>© {new Date().getFullYear()} DealOpia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;