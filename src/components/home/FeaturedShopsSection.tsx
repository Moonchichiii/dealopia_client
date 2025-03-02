'use client';

import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';

// Sample featured shops data
const featuredShops = [
    {
        id: 'shop1',
        name: 'Urban Threads',
        initials: 'UT',
        initialsColor: 'pink', // pink, green, blue, yellow
        category: 'Fashion & Apparel',
        description: 'A boutique clothing store featuring local designers and sustainable fashion for all styles.',
        activeDeals: 8,
        rating: 4.8
    },
    {
        id: 'shop2',
        name: 'Green Earth Market',
        initials: 'GE',
        initialsColor: 'green',
        category: 'Grocery & Produce',
        description: 'Organic, locally-sourced produce and grocery items. Supporting local farmers since 2010.',
        activeDeals: 5,
        rating: 4.7
    },
    {
        id: 'shop3',
        name: 'Serenity Spa',
        initials: 'SS',
        initialsColor: 'blue',
        category: 'Wellness & Beauty',
        description: 'A peaceful sanctuary offering massages, facials, and holistic wellness treatments.',
        activeDeals: 3,
        rating: 4.9
    },
    {
        id: 'shop4',
        name: 'Page & Binding',
        initials: 'PB',
        initialsColor: 'yellow',
        category: 'Books & Stationery',
        description: 'Independent bookstore with a carefully curated selection and cozy reading nooks.',
        activeDeals: 6,
        rating: 4.6
    }
];

const FeaturedShopsSection = () => {
    // Get color class based on shop initials color
    const getInitialsColorClass = (color) => {
        const colors = {
            pink: 'bg-accentPink text-white',
            green: 'bg-accentGreen text-bgPrimary',
            blue: 'bg-accentBlue text-bgPrimary',
            yellow: 'bg-accentYellow text-bgPrimary',
        };
     
        return colors[color] || colors.pink;
    };

    return (
        <section className="bg-bgPrimary py-24">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Featured Local Shops
                    </h2>
                    <p className="text-textSecondary text-lg max-w-2xl mx-auto">
                        Discover these amazing local businesses with great offers
                    </p>
                </div>
             
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredShops.map((shop) => (
                        <Link
                            key={shop.id}
                            href={`/shops/${shop.id}`}
                            className="transition-transform hover:-translate-y-2 duration-300"
                        >
                            <div className="h-full bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col">
                                <div className="flex gap-5 mb-3">
                                    <div className={`w-16 h-16 ${getInitialsColorClass(shop.initialsColor)} rounded-2xl flex items-center justify-center font-bold text-xl flex-shrink-0`}>
                                        {shop.initials}
                                    </div>
                                 
                                    <div>
                                        <h3 className="text-xl font-semibold mb-1">{shop.name}</h3>
                                        <div className="text-sm text-textSecondary mb-1">{shop.category}</div>
                                    </div>
                                </div>
                             
                                <p className="text-textSecondary text-sm flex-grow mb-4">
                                    {shop.description}
                                </p>
                             
                                <div className="flex justify-between items-center text-sm mt-auto">
                                    <span className="text-accentPink font-semibold">
                                        {shop.activeDeals} Active Deals
                                    </span>
                                 
                                    <span className="flex items-center text-accentYellow">
                                        <Star className="w-4 h-4 mr-1 fill-accentYellow" />
                                        {shop.rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedShopsSection;