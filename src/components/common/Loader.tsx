// components/Loader.tsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

gsap.registerPlugin(MorphSVGPlugin)

interface LoaderProps {
  progress?: number;
  isInitial?: boolean; // Flag to determine if this is the initial app loader
}

export default function Loader({ progress = 0, isInitial = false }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgPathRef = useRef<SVGPathElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  
  // Simpler loader shape for better brand alignment
  const shapes = [
    'M12 1L22 12L12 23L2 12L12 1', // Diamond
    'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22S22 17.5 22 12S17.5 2 12 2', // Circle
  ]

  useEffect(() => {
    // Main timeline for morphing
    const tl = gsap.timeline({ 
      repeat: -1,
      defaults: { duration: isInitial ? 1.2 : 0.8 } 
    })
    
    // Shape morphing animation
    shapes.forEach(shape => {
      tl.to(svgPathRef.current, {
        morphSVG: shape,
        ease: 'power1.inOut'
      })
    })

    // Text animation for title - only for initial loader
    if (isInitial && textRef.current) {
      gsap.from(textRef.current.children, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out'
      })
    }

    return () => {
      tl.kill()
    }
  }, [isInitial])

  useEffect(() => {
    if (!progressRef.current) return

    // Progress text animation
    gsap.to(progressRef.current, {
      innerText: progress,
      duration: 0.3,
      snap: { innerText: 1 },
      onUpdate: () => {
        if (progressRef.current) {
          progressRef.current.innerText = `${Math.round(Number(progressRef.current.innerText))}%`
        }
      }
    })

    // Progress bar animation
    gsap.to('.progress-bar', {
      scaleX: progress / 100,
      duration: 0.3,
      ease: 'power1.out'
    })

    // Auto-remove when complete
    if (progress >= 100 && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.4,
        ease: 'power3.out',
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none'
          }
        }
      })
    }
  }, [progress])

  // Different styles based on whether this is the initial app loader or a component loader
  const containerClasses = isInitial
    ? "fixed inset-0 z-[9999] bg-[#121826] flex flex-col items-center justify-center"
    : "fixed inset-0 z-[9999] bg-[#121826]/90 backdrop-blur-md flex flex-col items-center justify-center";

  return (
    <div ref={containerRef} className={containerClasses}>
      {isInitial ? (
        // Initial app loader with brand styling
        <div className="max-w-lg text-center px-4">
          <div className="mb-8">
            <div className="inline-flex items-center mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary-500 text-white flex items-center justify-center text-2xl font-bold mr-3">
                D
              </div>
              <span className="text-white text-2xl font-bold">Dealopia</span>
            </div>
            
            <div ref={textRef} className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-primary-400 to-blue-500 bg-clip-text text-transparent">
                Discover Amazing Local Deals
              </h1>
              <p className="text-secondary-300">
                Find the best discounts from your favorite local shops.
                Save money while supporting your community.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-48 h-1.5 bg-secondary-800 rounded-full overflow-hidden mb-3">
              <div className="progress-bar h-full bg-gradient-to-r from-pink-500 via-primary-500 to-blue-500 origin-left scale-x-0 rounded-full" />
            </div>
            <span ref={progressRef} className="text-secondary-400 text-sm font-mono">0%</span>
          </div>
        </div>
      ) : (
        // Component loader - more compact
        <div className="flex flex-col items-center">
          {/* Animated icon */}
          <svg className="w-16 h-16 mb-4" viewBox="0 0 24 24">
            <path
              ref={svgPathRef}
              d={shapes[0]}
              fill="none"
              stroke="url(#loaderGradient)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ff38b4" /> {/* Pink */}
                <stop offset="50%" stopColor="#6366f1" /> {/* Primary */}
                <stop offset="100%" stopColor="#38bdf8" /> {/* Blue */}
              </linearGradient>
            </defs>
          </svg>
          
          {/* Progress display */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-1 bg-secondary-800 rounded-full overflow-hidden mb-2">
              <div className="progress-bar h-full bg-gradient-to-r from-pink-500 to-primary-500 origin-left scale-x-0" />
            </div>
            <span ref={progressRef} className="text-secondary-400 text-sm">0%</span>
          </div>
        </div>
      )}
    </div>
  )
}