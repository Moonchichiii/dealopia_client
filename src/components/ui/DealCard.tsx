'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const DealCard = ({
    id,
    title,
    description,
    shop = { name: 'Local Shop' },
    originalPrice,
    discountedPrice,
    discountPercentage,
    type = 'default',
    icon,
    tag,
    isExclusive = false,
}) => {
    // Generate icon background color based on deal type
    const getIconClass = () => {
        switch (type) {
            case 'coffee':
                return 'bg-accentYellow text-bgPrimary';
            case 'yoga':
            case 'wellness':
                return 'bg-accentGreen text-bgPrimary';
            case 'book':
                return 'bg-accentBlue text-bgPrimary';
            case 'fashion':
                return 'bg-accentPink text-white';
            default:
                return 'bg-accentPink text-white';
        }
    };

    // Calculate discount percentage if not provided but prices are available
    const calculatedDiscount = discountPercentage || (originalPrice && discountedPrice
        ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
        : null);

    return (
        <div className="p-6 border-t border-white/5 relative group hover:bg-white/[0.02] transition-colors rounded-md">
            {isExclusive && (
                <div className="absolute top-6 right-0 font-semibold text-sm text-accentPink">
                    Exclusive
                </div>
            )}
            
            {tag && (
                <div className="absolute top-6 right-0 font-semibold text-sm text-accentPink">
                    {tag}
                </div>
            )}
            
            <div className="flex gap-4 mb-4">
                <div className={`w-12 h-12 ${getIconClass()} rounded-md flex items-center justify-center text-2xl flex-shrink-0`}>
                    {icon || (
                        type === 'coffee' ? '☕' :
                        type === 'yoga' ? '🧘' :
                        type === 'book' ? '📚' :
                        type === 'fashion' ? '👗' : '🛍️'
                    )}
                </div>
                
                <div>
                    <div className="text-textSecondary text-sm mb-1">{shop.name}</div>
                    <h3 className="text-xl font-semibold text-textPrimary mb-2 leading-snug">{title}</h3>
                </div>
            </div>
            
            {description && (
                <p className="text-textSecondary mb-4 text-base">{description}</p>
            )}
            
            <div className="flex justify-between items-center">
                <div className="flex items-baseline gap-2">
                    {originalPrice && (
                        <span className="text-textSecondary line-through text-sm">${originalPrice.toFixed(2)}</span>
                    )}
                    
                    {discountedPrice && (
                        <span className="text-accentPink font-bold text-xl">${discountedPrice.toFixed(2)}</span>
                    )}
                    
                    {calculatedDiscount && !discountedPrice && (
                        <span className="text-accentPink font-bold text-xl">{calculatedDiscount}% Off</span>
                    )}
                </div>
                
                <Link 
                    href={`/deals/${id}`} 
                    className="inline-flex items-center gap-1 text-textPrimary font-semibold text-sm group-hover:text-accentPink transition-colors"
                >
                    View Deal <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    );
};

export default DealCard;