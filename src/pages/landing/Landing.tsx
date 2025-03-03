// components/DealopiaCanvas.tsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

gsap.registerPlugin(ScrollTrigger)

export default function DealopiaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffd700, 1.5)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    // Geometry cache
    let mainText: THREE.Mesh
    let particles: THREE.Points
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 1000
    const posArray = new Float32Array(particleCount * 3)

    // Animation timeline
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(loaderRef.current, { opacity: 0, display: 'none', duration: 0.5 })
      }
    })

    // Font loading
    const fontLoader = new FontLoader()
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      // Main text geometry
      const textGeometry = new TextGeometry('DealOpia', {
        font,
        size: 0.5,
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      })

      // Materials
      const textMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color('hsl(240, 60%, 65%)'),
        metalness: 0.7,
        roughness: 0.2
      })

      mainText = new THREE.Mesh(textGeometry, textMaterial)
      textGeometry.center()
      scene.add(mainText)

      // Particles
      for(let i = 0; i < particleCount; i++) {
        posArray[i * 3] = (Math.random() - 0.5) * 10
        posArray[i * 3 + 1] = (Math.random() - 0.5) * 10
        posArray[i * 3 + 2] = (Math.random() - 0.5) * 10
      }

      particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
      const particleMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: new THREE.Color('hsl(30, 100%, 50%)'),
        transparent: true
      })

      particles = new THREE.Points(particleGeometry, particleMaterial)
      scene.add(particles)

      // Camera positioning
      camera.position.z = 5

      // GSAP animations
      tl.to(progressRef.current, { width: '100%', duration: 2, ease: 'power4.out' })
        .to(mainText.rotation, { y: Math.PI * 2, duration: 3, ease: 'power4.out' }, '<')
        .to(camera.position, { z: 3, duration: 2, ease: 'power2.out' }, '<')
    })

    // Scroll animations
    ScrollTrigger.create({
      trigger: ".content-section",
      start: "top center",
      onEnter: () => {
        gsap.to(camera.position, {
          z: 7,
          y: 2,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => camera.lookAt(scene.position)
        })
      }
    })

    // Interactive elements
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event
      const x = (clientX / window.innerWidth - 0.5) * 0.5
      const y = (clientY / window.innerHeight - 0.5) * 0.5
      
      gsap.to(scene.rotation, {
        x: -y,
        y: x,
        duration: 2,
        ease: "power2.out"
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      if (particles) particles.rotation.y += 0.001
      renderer.render(scene, camera)
    }
    animate()

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      renderer.dispose()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-0">
      {/* Loading screen */}
      <div ref={loaderRef} className="absolute inset-0 z-50 bg-secondary-950 flex items-center justify-center">
        <div className="w-64 h-2 bg-secondary-800 rounded-full">
          <div ref={progressRef} className="h-full bg-accent-500 rounded-full w-0"/>
        </div>
      </div>
      
      <canvas ref={canvasRef} className="absolute inset-0"/>
      
      {/* UI Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-display text-6xl md:text-8xl font-bold mb-6 text-primary-50 mix-blend-difference">
          DealOpia
        </h1>
        <p className="text-xl md:text-2xl text-secondary-100 max-w-2xl mb-8 mix-blend-difference">
          Discover hyper-local deals reimagined
        </p>
        <button className="btn-reset px-8 py-3 bg-accent-500 rounded-lg text-primary-50 
          hover:bg-accent-600 transition-colors animate-slide-in-right">
          Explore Deals
        </button>
      </div>

      {/* Content sections */}
      <section className="content-section relative z-10 h-screen pt-20">
        <div className="grid md:grid-cols-3 gap-8 container mx-auto px-4">
          {['Instant Savings', 'Local Favorites', 'Exclusive Offers'].map((feature, i) => (
            <div key={i} className="prose-custom bg-white bg-opacity-90 p-6 rounded-xl backdrop-blur-lg">
              <h3 className="text-primary-600">{feature}</h3>
              <p className="text-secondary-600">Discover amazing deals tailored to your neighborhood</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}