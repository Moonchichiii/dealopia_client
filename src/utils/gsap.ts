'use client';

import { useEffect } from 'react';

// Import GSAP core
import { gsap } from 'gsap';

// Import and register plugins
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import { Observer } from 'gsap/Observer';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';

// Register plugins
if (typeof window !== 'undefined') {
    gsap.registerPlugin(
        ScrollTrigger,
        ScrollSmoother,
        SplitText,
        Observer,
        ScrollToPlugin,
        Draggable,
        Flip
    );
}

// Set default GSAP settings
gsap.config({
    autoSleep: 60,
    force3D: true,
    nullTargetWarn: false,
});

// Export GSAP and plugins
export {
    gsap,
    ScrollTrigger,
    ScrollSmoother,
    SplitText,
    Observer,
    ScrollToPlugin,
    Draggable,
    Flip,
};

// Hook for initializing GSAP in components
export const useGSAP = (
    callback: (ctx: gsap.Context) => void,
    dependencies: any[] = []
) => {
    useEffect(() => {
        let ctx = gsap.context(callback);
        return () => ctx.revert();
    }, dependencies);
};