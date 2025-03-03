import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
    const navigate = useNavigate();
    const [joke, setJoke] = useState<string>('');
    const [count, setCount] = useState<number>(10);

    // Collection of funny 404 jokes
    const jokes = [
        "I searched high and low for this page. Turns out, it's just low.",
        "This page is playing an excellent game of hide and seek!",
        "Error 404: Page not found. It probably went to get coffee.",
        "The page you're looking for is socially distancing itself from the internet.",
        "This page has been abducted by aliens. We're negotiating its return.",
        "Oops! This page went on vacation without telling anyone.",
        "This URL is as real as my motivation to exercise.",
        "Plot twist: There was no page to begin with!",
    ];

    const goBack = () => {
        navigate(-1); 
    };

    useEffect(() => {
        // Get a random joke
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        setJoke(randomJoke);

        // Auto-countdown timer
        const timer = setInterval(() => {
            setCount((prevCount) => {
                if (prevCount <= 1) {
                    clearInterval(timer);
                    goBack();
                    return 0;
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="text-center max-w-lg z-10">
                <h1 className="text-7xl md:text-9xl font-bold mb-4 text-accent-pink">404</h1>
                <div className="text-5xl mb-6">😵</div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
                <p className="text-text-secondary mb-6 italic">{joke}</p>
                <p className="mb-4">Going back in {count} seconds...</p>
                <button 
                    onClick={goBack}
                    className="bg-accent-pink text-white px-6 py-3 rounded-full font-medium hover:bg-accent-pink/90 transition-colors"
                >
                    Take Me Back Now!
                </button>
            </div>
            {/* Random elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="animate-bounce absolute top-1/4 left-1/4 text-3xl">🧦</div>
                <div className="animate-pulse absolute top-1/3 right-1/4 text-3xl">🧩</div>
                <div className="animate-spin absolute bottom-1/3 left-1/3 text-3xl">🔍</div>
            </div>
        </div>
    );
};

export default NotFound;