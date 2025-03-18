import React from 'react';
// Using non-deprecated icons
import { MessageSquare, Share2, Image, Film } from 'lucide-react';
import LogoButton from '@/components/buttons/LogoButton';

// Define types for social links
interface SocialLink {
    label: string;
    href: string;
    icon: React.ReactNode;
}

// Footer component with TypeScript
const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    // Updated social links with alternative Lucide icons
    const socialLinks: SocialLink[] = [
        { 
            label: 'Twitter',
            href: 'https://twitter.com/dealopia',
            icon: <MessageSquare className="w-5 h-5" />
        },
        { 
            label: 'Facebook',
            href: 'https://facebook.com/dealopia',
            icon: <Share2 className="w-5 h-5" />
        },
        { 
            label: 'Instagram',
            href: 'https://instagram.com/dealopia',
            icon: <Image className="w-5 h-5" />
        },
        { 
            label: 'YouTube',
            href: 'https://youtube.com/dealopia',
            icon: <Film className="w-5 h-5" />
        },
    ];
    
    return (
        <footer className="pt-20 pb-10 bg-secondary-900 text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16">
                    <div className="lg:col-span-1">
                        <a href="/" className="flex items-center gap-3 mb-6">
                            
                                <LogoButton />
                            
                            
                        </a>
                        <p className="text-secondary-300 text-sm mb-6 max-w-xs">
                            Dealopia connects you with the best local deals on clothes, books, wellness, and more.
                            Save money while supporting your community.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-secondary-800 flex items-center justify-center transition-all hover:bg-primary-600 hover:-translate-y-1 duration-300"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Visit our ${social.label} page`}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-5 pb-2 border-b border-primary-500/30 inline-block text-display">Categories</h4>
                        <ul className="space-y-3">
                            <li><a href="/categories/food-dining" className="text-secondary-300 hover:text-primary-300 transition-colors">Food & Dining</a></li>
                            <li><a href="/categories/fashion-apparel" className="text-secondary-300 hover:text-primary-300 transition-colors">Fashion & Apparel</a></li>
                            <li><a href="/categories/books-stationery" className="text-secondary-300 hover:text-primary-300 transition-colors">Books & Stationery</a></li>
                            <li><a href="/categories/wellness-beauty" className="text-secondary-300 hover:text-primary-300 transition-colors">Wellness & Beauty</a></li>
                            <li><a href="/categories/entertainment" className="text-secondary-300 hover:text-primary-300 transition-colors">Entertainment</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-5 pb-2 border-b border-primary-500/30 inline-block text-display">For Businesses</h4>
                        <ul className="space-y-3">
                            <li><a href="/businesses/list" className="text-secondary-300 hover:text-primary-300 transition-colors">List Your Business</a></li>
                            <li><a href="/businesses/dashboard" className="text-secondary-300 hover:text-primary-300 transition-colors">Business Dashboard</a></li>
                            <li><a href="/businesses/advertise" className="text-secondary-300 hover:text-primary-300 transition-colors">Advertise with Us</a></li>
                            <li><a href="/businesses/success-stories" className="text-secondary-300 hover:text-primary-300 transition-colors">Success Stories</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-5 pb-2 border-b border-primary-500/30 inline-block text-display">Help & Support</h4>
                        <ul className="space-y-3">
                            <li><a href="/help/how-it-works" className="text-secondary-300 hover:text-primary-300 transition-colors">How It Works</a></li>
                            <li><a href="/help/faqs" className="text-secondary-300 hover:text-primary-300 transition-colors">FAQs</a></li>
                            <li><a href="/help/contact" className="text-secondary-300 hover:text-primary-300 transition-colors">Contact Us</a></li>
                            <li><a href="/help/privacy-policy" className="text-secondary-300 hover:text-primary-300 transition-colors">Privacy Policy</a></li>
                            <li><a href="/help/terms-of-service" className="text-secondary-300 hover:text-primary-300 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div className="pt-8 border-t border-secondary-700 text-center">
                    <p className="text-secondary-400 text-sm">    © {currentYear} Dealopia. All rights reserved.</p>
                                    
                      </div>    
                      </div>          
                      </footer>
                );
                          };


export default Footer;
