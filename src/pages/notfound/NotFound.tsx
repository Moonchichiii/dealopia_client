import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFound.css'; 

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
        <div className="not-found-container">
            <h1 className="error-code">404</h1>
            <div className="error-animation">
                <span>😵</span>
            </div>
            <h2 className="error-message">Page Not Found</h2>
            <p className="error-joke">{joke}</p>
            <p className="timer">Going back in {count} seconds...</p>
            <button className="back-button" onClick={goBack}>
                Take Me Back Now!
            </button>
            <div className="random-elements">
                <div className="tumbling-element">🧦</div>
                <div className="floating-element">🧩</div>
                <div className="spinning-element">🔍</div>
            </div>
        </div>
    );
};

export default NotFound;