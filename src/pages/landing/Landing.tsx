import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface LandingProps {
  onExploreClick: () => void;
}

export default function LandingPage({ onExploreClick }: LandingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded] = useState(true)

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    // Setup scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#080420') // Dark background matching the app
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5 // Moved camera back a bit to see more of the scene

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Create rounded box geometry
    const boxSize = 2.2
    const roundedBoxGeometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize, 1, 1, 1)
    
    // Apply bulge to corners to make it look more rounded
    const positionAttribute = roundedBoxGeometry.attributes.position
    const vector = new THREE.Vector3()
    
    for (let i = 0; i < positionAttribute.count; i++) {
      vector.fromBufferAttribute(positionAttribute, i)
      vector.normalize().multiplyScalar(boxSize / 1.65) // Adjusted for more roundness
      positionAttribute.setXYZ(i, vector.x, vector.y, vector.z)
    }
    
    // Create a gradient material that resembles the Dealopia logo
    const material = new THREE.MeshStandardMaterial({
      color: 0xff38b4, // Hot pink color from your logo
      metalness: 0.2,
      roughness: 0.3,
      emissive: 0xff38b4,
      emissiveIntensity: 0.15
    })
    
    const cube = new THREE.Mesh(roundedBoxGeometry, material)
    
    // Position the cube higher up to appear above the text
    cube.position.y = 1.5
    
    scene.add(cube)

    // Create "D" only on the front face
    const createDFace = () => {
      // Create a canvas for the D texture
      const fontCanvas = document.createElement('canvas')
      fontCanvas.width = 512  // Increased resolution
      fontCanvas.height = 512
      const context = fontCanvas.getContext('2d')
      
      if (context) {
        // Set background to transparent
        context.clearRect(0, 0, 512, 512)
        
        // Draw white D with better styling
        context.fillStyle = '#ffffff'
        context.font = 'bold 340px Arial'  // Larger font
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText('D', 256, 256)
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(fontCanvas)
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy() // Sharper text
        
        // Create material with the texture
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.95,
          side: THREE.DoubleSide
        })
        
        // Create plane with the D texture
        const planeGeometry = new THREE.PlaneGeometry(boxSize * 0.95, boxSize * 0.95)
        const plane = new THREE.Mesh(planeGeometry, material)
        
        // Position plane exactly at the front face (fixed positioning)
        plane.position.z = boxSize / 2.8
        
        return { plane, material, geometry: planeGeometry }
      }
      
      return null
    }
    
    // Create D only for front face
    const frontFace = createDFace()
    if (frontFace) {
      cube.add(frontFace.plane)
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)
    
    // Pink light (matching the logo color)
    const pinkLight = new THREE.PointLight(0xff38b4, 2)
    pinkLight.position.set(2, 3, 4)
    scene.add(pinkLight)
    
    // Blue accent light
    const blueLight = new THREE.PointLight(0x38bdf8, 1.5)
    blueLight.position.set(-2, -1, 2)
    scene.add(blueLight)
    
    // White highlight light from top
    const whiteLight = new THREE.DirectionalLight(0xffffff, 1)
    whiteLight.position.set(0, 5, 0)
    scene.add(whiteLight)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Smooth rotation
      cube.rotation.y += 0.01
      cube.rotation.x += 0.005
      
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      roundedBoxGeometry.dispose()
      material.dispose()
      
      // Clean up front face materials and geometries
      if (frontFace) {
        frontFace.geometry.dispose()
        frontFace.material.dispose()
      }
      
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 bg-[#080420] z-50">
      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"/>

      {/* Content overlay */}
      {isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-center p-6 max-w-2xl mt-64 pointer-events-none">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 mt-20 text-white">
          <span className="text-white/90">
                DealOpia
              </span> 
              </h1>
            <h3 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-primary-400 to-blue-500">
                Discover Amazing Local Deals
              </span> 
            </h3>
            <p className="text-lg text-gray-300 mb-12">
              Find the best discounts from your favorite local shops.
              Save money while supporting your community.
            </p>
          </div>
          
          {/* Scroll indicator - centered and fixed positioning */}
          <div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-auto cursor-pointer flex flex-col items-center"
            onClick={onExploreClick}
          >
            <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-center justify-center p-1">
              <div className="w-2 h-3 bg-white rounded-full animate-pulse"/>
            </div>
            <p className="text-white/70 text-l mt-2 text-center w-full">Scroll to Explore</p>
          </div>
        </div>
      )}
    </div>
  )
}