import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Github, Twitter } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(footerRef.current?.querySelectorAll('.footer-item'), {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom-=100',
          toggleActions: 'play none none reverse'
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="border-t border-stone-800/50 bg-stone-950/50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="footer-item">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-primary-500/10 p-2 rounded-xl">
                <Tag className="w-6 h-6 text-primary-400" />
              </div>
              <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-400 to-accent-400 text-transparent bg-clip-text">
                DealOpia
              </span>
            </Link>
            <p className="text-stone-400 text-sm">
              Discover the best local deals while supporting sustainable shopping practices.
            </p>
          </div>

          <div className="footer-item">
            <h3 className="font-display font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-stone-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-stone-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-stone-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-item">
            <h3 className="font-display font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-stone-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-stone-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-stone-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-item">
            <h3 className="font-display font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors"
              >
                <Github size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-item mt-12 pt-8 border-t border-stone-800/50 text-center text-stone-400 text-sm">
          <p>© {new Date().getFullYear()} DealOpia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;