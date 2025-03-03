// components/Loader.tsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

gsap.registerPlugin(MorphSVGPlugin)

export default function Loader({ progress = 0 }: { progress?: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgPathRef = useRef<SVGPathElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  
  // Morph shapes for the loader icon
  const shapes = [
    'M12 1L22 12L12 23L2 12L12 1',          // Diamond
    'M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22S22 17.5 22 12S17.5 2 12 2', // Circle
    'M12 1H22V12H12V23H2V12H12V1',         // Square diamond
    'M12 1L22 8.5V15.5L12 23L2 15.5V8.5L12 1' // Hexagon
  ]

  useEffect(() => {
    // Main timeline
    const tl = gsap.timeline({ repeat: -1 })
    
    // Shape morphing animation
    shapes.forEach(shape => {
      tl.to(svgPathRef.current, {
        duration: 1.5,
        morphSVG: shape,
        ease: 'power2.inOut'
      })
    })

    // Floating particles animation
    gsap.from('.particle', {
      duration: 2,
      scale: 0,
      opacity: 0,
      y: () => gsap.utils.random(-50, 50),
      x: () => gsap.utils.random(-50, 50),
      stagger: 0.1,
      repeat: -1,
      repeatRefresh: true,
      ease: 'elastic.out(1, 0.5)'
    })

    return () => {
      tl.kill()
    }
  }, [])

  useEffect(() => {
    if (!progressRef.current) return

    // Progress text animation
    gsap.to(progressRef.current, {
      innerText: progress,
      duration: 0.5,
      snap: 'innerText',
      onUpdate: () => {
        if (progressRef.current) {
          progressRef.current.innerText = `${Math.round(Number(progressRef.current.innerText))}%`
        }
      }
    })

    // Progress bar animation
    gsap.to('.progress-bar', {
      scaleX: progress / 100,
      duration: 0.5,
      ease: 'power2.out'
    })

    // Auto-remove when complete
    if (progress >= 100 && containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'power4.inOut',
        onComplete: () => {
          if (containerRef.current) {
            containerRef.current.style.display = 'none'
          }
        }
      })
    }
  }, [progress])

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] bg-secondary-950/95 backdrop-blur-xl flex flex-col items-center justify-center">
      {/* Animated center icon */}
      <svg className="w-32 h-32" viewBox="0 0 24 24">
        <path
          ref={svgPathRef}
          d={shapes[0]}
          fill="none"
          stroke="url(#loaderGradient)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="loaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--color-primary-500))" />
            <stop offset="100%" stopColor="hsl(var(--color-accent-500))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-accent-500 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Progress display */}
      <div className="mt-8 flex items-center gap-4">
        <span ref={progressRef} className="text-accent-500 text-xl font-mono">0%</span>
        <div className="w-32 h-1 bg-secondary-800 rounded-full overflow-hidden">
          <div className="progress-bar h-full bg-accent-500 origin-left scale-x-0" />
        </div>
      </div>

      {/* Animated text */}
      <div className="mt-6 overflow-hidden">
        <h2 className="text-display text-2xl font-semibold text-primary-50">
          <span className="inline-block animate-pulse">✨</span> Discovering Local Deals
        </h2>
      </div>
    </div>
  )
}