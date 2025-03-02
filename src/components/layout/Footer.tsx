'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();
 
    const socialLinks = [
        { label: '𝕏', href: 'https://twitter.com/dealopia' },
        { label: 'ƒ', href: 'https://facebook.com/dealopia' },
        { label: '𝕀', href: 'https://instagram.com/dealopia' },
        { label: '▶', href: 'https://youtube.com/dealopia' },
    ];

    return (
        <footer className="pt-20 pb-10 bg-bgPrimary">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16">
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-accentPink rounded-sm flex items-center justify-center font-bold text-xl">
                                D
                            </div>
                            <div className="text-xl font-semibold">Dealopia</div>
                        </Link>
                     
                        <p className="text-textSecondary text-sm mb-6 max-w-xs">
                            Dealopia connects you with the best local deals on clothes, books, wellness, and more.
                            Save money while supporting your community.
                        </p>
                     
                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all hover:bg-accentPink hover:-translate-y-1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Visit our ${social.label} page`}
                                >
                                    {social.label}
                                </a>
                            ))}
                        </div>
                    </div>
                 
                    <div>
                        <h4 className="text-lg font-semibold mb-5 pb-2 border-b border-accentPink/30 inline-block">Categories</h4>
                        <ul className="space-y-3">
                            <li><Link href="/categories/food-dining" className="text-textSecondary hover:text-accentPink transition-colors">Food & Dining</Link></li>
                            <li><Link href="/categories/fashion-apparel" className="text-textSecondary hover:text-accentPink transition-colors">Fashion & Apparel</Link></li>
                            <li><Link href="/categories/books-stationery" className="text-textSecondary hover:text-accentPink transition-colors">Books & Stationery</Link></li>
                            <li><Link href="/categories/wellness-beauty" className="text-textSecondary hover:text-accentPink transition-colors">Wellness & Beauty</Link></li>
                            <li><Link href="/categories/entertainment" className="text-textSecondary hover:text-accentPink transition-colors">Entertainment</Link></li>
                        </ul>
                    </div>
                 
                    <div>
                        <h4 className="text-lg font-semibold mb-5 pb-2 border-b border-accentPink/30 inline-block">For Businesses</h4>
                        <ul className="space-y-3">
                            <li><Link href="/businesses/list" className="text-textSecondary hover:text-accentPink transition-colors">List Your Business</Link></li>
                            <li><Link href="/businesses/dashboard" className="text-textSecondary hover:text-accentPink transition-colors">Business Dashboard</Link></li>
                            <li><Link href="/businesses/advertise" className="text-textSecondary hover:text-accentPink transition-colors">Advertise with Us</Link></li>
                            <li><Link href="/businesses/success-stories" className="text-textSecondary hover:text-accentPink transition-colors">Success Stories</Link></li>
                        </ul>
                    </div>
                 
                    <div>
                        <h4 className="text-lg font-semibold mb-5 pb-2 border-b border-accentPink/30 inline-block">Help & Support</h4>
                        <ul className="space-y-3">
                            <li><Link href="/help/how-it-works" className="text-textSecondary hover:text-accentPink transition-colors">How It Works</Link></li>
                            <li><Link href="/help/faqs" className="text-textSecondary hover:text-accentPink transition-colors">FAQs</Link></li>
                            <li><Link href="/help/contact" className="text-textSecondary hover:text-accentPink transition-colors">Contact Us</Link></li>
                            <li><Link href="/help/privacy-policy" className="text-textSecondary hover:text-accentPink transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/help/terms-of-service" className="text-textSecondary hover:text-accentPink transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
             
                <div className="pt-8 border-t border-white/10 text-center">
                    <p className="text-textSecondary text-sm">
                        © {currentYear} Dealopia. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;