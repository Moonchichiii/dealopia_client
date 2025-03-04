import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useNavigate } from 'react-router-dom'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

export default function DealopiaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if canvas is available
    if (!canvasRef.current || !containerRef.current) return

    // Get container dimensions
    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Scene setup - crucial part for background color
    const scene = new THREE.Scene()
    // Set the scene background explicitly to a dark color
    scene.background = new THREE.Color('#080420') // Very dark blue background
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5
    
    // Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true,
      alpha: false // Make sure alpha is false to prevent transparency
    })
    
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor('#080420', 1) // Set clear color explicitly
    
    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x6366f1, 0.5) // Primary brand color
    scene.add(ambientLight)
    
    const pointLight1 = new THREE.PointLight(0x6366f1, 2) // Primary light (indigo)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)
    
    const pointLight2 = new THREE.PointLight(0xf97316, 1.5) // Accent light (orange)
    pointLight2.position.set(-5, 3, -5)
    scene.add(pointLight2)

    // Geometry cache
    let mainText: THREE.Mesh
    let particles: THREE.Points
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 2000
    const posArray = new Float32Array(particleCount * 3)

    // Animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, { 
          opacity: 0, 
          duration: 0.8,
          onComplete: () => {
            if (loaderRef.current) {
              loaderRef.current.style.display = 'none'
              setIsLoaded(true)
            }
          }
        })
      }
    })

    // Font loading
    const fontLoader = new FontLoader()
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      // Main text geometry with improved settings
      const textGeometry = new TextGeometry('DealOpia', {
        font,
        size: 0.6,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.03,
        bevelOffset: 0,
        bevelSegments: 8
      })

      // Create a more interesting material
      const textMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('#6366f1'), // Primary brand color
        metalness: 0.8,
        roughness: 0.1,
      })

      mainText = new THREE.Mesh(textGeometry, textMaterial)
      textGeometry.center()
      scene.add(mainText)

      // Create floating dots (particles) with gradient colors
      for(let i = 0; i < particleCount; i++) {
        // Distribute particles in a sphere pattern around the text
        const radius = 5 + Math.random() * 5
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        
        posArray[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        posArray[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        posArray[i * 3 + 2] = radius * Math.cos(phi)
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
      
      // Create gradient particles
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.01 + Math.random() * 0.01,
        color: new THREE.Color('#f97316'), // Accent color
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
      })

      particles = new THREE.Points(particleGeometry, particleMaterial)
      scene.add(particles)

      // GSAP animations with more dynamic movement
      tl.to(progressRef.current, { 
        width: '100%', 
        duration: 1.8, 
        ease: 'power2.inOut' 
      })
      .to(mainText.rotation, { 
        y: Math.PI * 2, 
        duration: 2.5, 
        ease: 'power2.out' 
      }, '<')
      .to(camera.position, { 
        z: 3, 
        duration: 2, 
        ease: 'power4.out' 
      }, '<0.5')
      .to(particles.rotation, {
        y: Math.PI / 2,
        duration: 3,
        ease: 'power2.inOut'
      }, '<0.3')
    })

    // Enhanced scroll animations
    ScrollTrigger.create({
      trigger: ".content-section",
      start: "top 80%",
      onEnter: () => {
        gsap.to(camera.position, {
          z: 6,
          y: 1.5,
          x: 1,
          duration: 2.5,
          ease: "power2.inOut",
          onUpdate: () => camera.lookAt(new THREE.Vector3(0, 0, 0))
        })
        
        gsap.to(scene.rotation, {
          y: -0.5,
          duration: 2,
          ease: "power2.inOut"
        })
      },
      onLeaveBack: () => {
        gsap.to(camera.position, {
          z: 3,
          y: 0.5,
          x: 0,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: () => camera.lookAt(new THREE.Vector3(0, 0, 0))
        })
        
        gsap.to(scene.rotation, {
          y: 0,
          duration: 1,
          ease: "power2.inOut"
        })
      }
    })

    // Interactive elements - more responsive mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event
      const x = (clientX / width - 0.5) * 0.8
      const y = (clientY / height - 0.5) * 0.5
      
      gsap.to(scene.rotation, {
        x: -y,
        y: x,
        duration: 1.5,
        ease: "power2.out"
      })
      
      // Move light slightly with mouse for dynamic lighting
      gsap.to(pointLight1.position, {
        x: 5 + x * 2,
        y: 5 - y * 2,
        duration: 2,
        ease: "power2.out"
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop with floating effect
    const clock = new THREE.Clock()
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      
      requestAnimationFrame(animate)
      
      if (particles) {
        particles.rotation.y += 0.0005
        particles.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1
        
        // Make particles float up and down gently
        particles.position.y = Math.sin(elapsedTime * 0.3) * 0.1
      }
      
      if (mainText) {
        // Subtle floating animation for the text
        mainText.position.y = Math.sin(elapsedTime * 0.5) * 0.05
        mainText.rotation.y += 0.001
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resizing
    const handleResize = () => {
      if (!containerRef.current) return
      
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      
      renderer.setSize(newWidth, newHeight)
    }
    
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      
      // Proper cleanup of Three.js resources
      renderer.dispose()
      if (particleGeometry) particleGeometry.dispose()
      
      // Clean up other resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    }
  }, [])

  // Handle navigation
  const handleExploreClick = () => {
    navigate('/deals')
  }

  return (
    <div ref={containerRef} className="relative min-h-screen w-full bg-[#080420]">
      {/* Loading screen */}
      <div ref={loaderRef} className="fixed inset-0 z-50 bg-[#080420] flex flex-col items-center justify-center">
        <div className="mb-8">
          <h2 className="text-primary-400 text-4xl font-bold mb-2 animate-pulse">DealOpia</h2>
          <p className="text-secondary-400 text-sm">Discovering local deals...</p>
        </div>
        <div className="w-72 h-2 bg-secondary-800 rounded-full overflow-hidden">
          <div ref={progressRef} className="h-full bg-gradient-to-r from-primary-600 to-accent-500 rounded-full w-0"/>
        </div>
      </div>
      
      {/* Canvas - Full width and height */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"/>
      
      {/* UI Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-4">
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-display text-7xl md:text-9xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-primary-400 to-primary-500 drop-shadow-lg">
            DealOpia
          </h1>
          <p className="text-xl md:text-2xl text-secondary-100 max-w-2xl mb-10 font-light">
            Discover <span className="text-accent-400 font-medium">hyper-local deals</span> reimagined for the modern consumer
          </p>
          <div className="space-x-4">
            <button 
              onClick={handleExploreClick}
              className="btn-reset px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white font-medium 
                shadow-lg hover:shadow-primary-500/30 hover:scale-105 transition-all duration-300">
              Explore Deals
            </button>
            <button className="btn-reset px-8 py-4 bg-transparent border-2 border-secondary-300 text-secondary-100 rounded-xl
              hover:bg-secondary-800/30 transition-all duration-300">
              Learn More
            </button>
          </div>
          
          {/* Mouse scroll indicator */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
            <span className="block w-5 h-9 rounded-full border-2 border-secondary-300 mb-1 relative">
              <span className="block w-1 h-1 rounded-full bg-secondary-300 absolute top-1.5 left-1/2 transform -translate-x-1/2 animate-pulse"></span>
            </span>
            <span className="text-xs text-secondary-400">Scroll Down</span>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <section className="content-section relative z-10 min-h-screen pt-32 pb-20 bg-[#080420]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-500">
            Why Choose DealOpia?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Instant Savings',
                description: 'Find personalized deals tailored to your preferences and shopping habits',
                icon: '💰',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                title: 'Local Favorites',
                description: 'Discover hidden gems and popular spots in your neighborhood',
                icon: '🏙️',
                color: 'from-green-500 to-teal-500'
              },
              {
                title: 'Exclusive Offers',
                description: 'Access special promotions only available through DealOpia',
                icon: '🎁',
                color: 'from-orange-500 to-amber-500'
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="backdrop-blur-lg bg-white/5 p-8 rounded-2xl border border-white/10 shadow-xl 
                  hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <div className={`text-3xl mb-4 bg-gradient-to-br ${feature.color} w-16 h-16 flex items-center justify-center rounded-xl shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-secondary-200 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-24 text-center">
            <button className="btn-reset px-10 py-5 bg-accent-500 rounded-xl text-white font-medium shadow-lg
              hover:shadow-accent-500/30 hover:bg-accent-600 hover:scale-105 transition-all duration-300">
              Start Discovering Today
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}