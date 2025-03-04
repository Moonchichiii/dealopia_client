// components/Loader.tsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

gsap.registerPlugin(MorphSVGPlugin)

interface LoaderProps {
    progress?: number;
    isInitial?: boolean;
}

export default function Loader({ progress = 0, isInitial = false }: LoaderProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const svgPathRef = useRef<SVGPathElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    
    // Modern geometric shapes for morphing
    const shapes = [
        'M12 2.5L20 7.5V16.5L12 21.5L4 16.5V7.5L12 2.5', // Diamond
        'M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z', // Circle
        'M12 3.5L18 7V17L12 20.5L6 17V7L12 3.5', // Hexagon
        'M12 4C15.3137 4 18 6.68629 18 10V14C18 17.3137 15.3137 20 12 20C8.68629 20 6 17.3137 6 14V10C6 6.68629 8.68629 4 12 4Z', // Rounded rectangle
    ]

    useEffect(() => {
        const tl = gsap.timeline({ 
            repeat: -1,
            defaults: { duration: 1.2, ease: 'power2.inOut' }
        })
        
        shapes.forEach(shape => {
            tl.to(svgPathRef.current, {
                morphSVG: shape,
                duration: 1.5
            }, '<0.5')
        })

        return () => tl.kill()
    }, [])

    useEffect(() => {
        if (!progressRef.current) return

        // Animated percentage count with decimal precision
        gsap.to(progressRef.current, {
            innerText: progress,
            duration: 0.7,
            snap: { innerText: 1 },
            modifiers: {
                innerText: value => `${Math.round(value)}%`
            },
            onUpdate: () => {
                if (progressRef.current) {
                    const currentProgress = Math.round(Number(progressRef.current.innerText))
                    gsap.to(svgPathRef.current, {
                        strokeOpacity: 0.5 + (currentProgress / 200),
                        duration: 0.3
                    })
                }
            }
        })

        // Auto-remove animation
        if (progress >= 100 && containerRef.current) {
            gsap.to(containerRef.current, {
                opacity: 0,
                duration: 0.8,
                ease: 'power4.out',
                onComplete: () => {
                    if (containerRef.current) {
                        containerRef.current.style.display = 'none'
                    }
                }
            })
        }
    }, [progress])

    const containerClasses = `fixed inset-0 z-[9999] bg-[#121826]/70 backdrop-blur-xl flex flex-col items-center justify-center transition-opacity duration-300`

    return (
        <div ref={containerRef} className={containerClasses}>
            <div className="flex flex-col items-center space-y-4">
                {/* Animated icon with gradient stroke */}
                <svg className="w-20 h-20" viewBox="0 0 24 24">
                    <path
                        ref={svgPathRef}
                        d={shapes[0]}
                        fill="none"
                        stroke="url(#loaderGradient)"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <defs>
                        <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#6366f1" /> {/* Primary */}
                            <stop offset="100%" stopColor="#ec4899" /> {/* Pink */}
                        </linearGradient>
                    </defs>
                </svg>
                
                {/* Percentage display with animated text */}
                <div className="flex flex-col items-center space-y-2">
                    <div className="text-lg font-medium text-white/90 tracking-wider">
                        Loading Experience
                    </div>
                    <div 
                        ref={progressRef}
                        className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-pink-500 bg-clip-text text-transparent"
                    >
                        0%
                    </div>
                </div>
            </div>
        </div>
    )
}