import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

interface LandingProps {
  onExploreClick: () => void;
}

export default function LandingPage({ onExploreClick }: LandingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !textRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#080420');
    
    // Camera setup with responsive FOV
    const fov = window.innerWidth < 768 ? 85 : 75;
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Make cube smaller
    const boxSize = 1.2;
    const segments = 32;
    const radius = 0.02;
    const geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize, segments, segments, segments);
    
    // Apply subtle rounding to vertices
    const positionAttribute = geometry.attributes.position;
    const vector = new THREE.Vector3();
    
    for (let i = 0; i < positionAttribute.count; i++) {
      vector.fromBufferAttribute(positionAttribute, i);
      vector.normalize().multiplyScalar(boxSize / 2);
      
      const direction = vector.clone().normalize();
      vector.add(direction.multiplyScalar(radius));
      
      positionAttribute.setXYZ(i, vector.x, vector.y, vector.z);
    }

    // Create material with custom properties
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xff38b4,
      metalness: 0.3,
      roughness: 0.2,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2,
      emissive: 0xff38b4,
      emissiveIntensity: 0.2
    });

    const cube = new THREE.Mesh(geometry, material);
    // Start cube above the screen
    cube.position.y = 10;
    scene.add(cube);

    // Create D texture function
    const createDTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      
      if (context) {
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#ffffff';
        context.font = 'bold 340px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('D', 256, 256);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        return texture;
      }
      return null;
    };

    // Create and add D faces
    const addDFace = (position: THREE.Vector3, rotation: THREE.Euler) => {
      const texture = createDTexture();
      if (texture) {
        const planeMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide
        });
        
        const planeGeometry = new THREE.PlaneGeometry(boxSize * 0.95, boxSize * 0.95);
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        
        plane.position.copy(position);
        plane.rotation.copy(rotation);
        
        cube.add(plane);
        return { geometry: planeGeometry, material: planeMaterial };
      }
      return null;
    };

    // Add D faces to all six sides
    const faces = [
      // Front
      addDFace(
        new THREE.Vector3(0, 0, boxSize / 3 + 0.01),
        new THREE.Euler(0, 0, 0)
      ),
      // Back
      addDFace(
        new THREE.Vector3(0, 0, -boxSize / 3 - 0.01),
        new THREE.Euler(0, Math.PI, 0)
      ),
      // Right
      addDFace(
        new THREE.Vector3(boxSize / 2 + 0.01, 0, 0),
        new THREE.Euler(0, Math.PI / 3, 0)
      ),
      // Left
      addDFace(
        new THREE.Vector3(-boxSize / 2 - 0.01, 0, 0),
        new THREE.Euler(0, -Math.PI / 2, 0)
      ),
      // Top
      addDFace(
        new THREE.Vector3(0, boxSize / 2 + 0.01, 0),
        new THREE.Euler(-Math.PI / 2, 0, 0)
      ),
      // Bottom
      addDFace(
        new THREE.Vector3(0, -boxSize / 2 - 0.01, 0),
        new THREE.Euler(Math.PI / 2, 0, 0)
      )
    ];

    // Enhanced lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.PointLight(0xff38b4, 2);
    mainLight.position.set(2, 3, 4);
    scene.add(mainLight);

    const accentLight = new THREE.PointLight(0x38bdf8, 1.5);
    accentLight.position.set(-2, -1, 2);
    scene.add(accentLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1);
    topLight.position.set(0, 5, 0);
    scene.add(topLight);

    // Hide both the text and cube initially
    gsap.set(textRef.current.children, { opacity: 0, y: 30 });
    gsap.set(cube.position, { y: 20 });

    // Animation sequence - changed order to animate text first
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });

    // First animate the text with a bounce
    tl.to(textRef.current.children, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.3,
      ease: "bounce.out"
    })
    // Then make the cube fall down
    .to(cube.position, {
      y: -1.0, // Position the cube below the text
      duration: 1.2,
      ease: "bounce.out"
    }, "+=0.3")
    // Start rotation after the bounce
    .to(cube.rotation, {
      y: Math.PI * 2,
      duration: 8,
      ease: "none",
      repeat: -1
    }, "-=0.3");

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Responsive handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.fov = window.innerWidth < 768 ? 85 : 75;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      
      // Clean up all faces
      faces.forEach(face => {
        if (face) {
          face.geometry.dispose();
          face.material.dispose();
        }
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 bg-[#080420]">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div ref={textRef} className="text-center p-6 max-w-2xl mt-40 pointer-events-none">
          <h1 className="mt-10 text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">DealOpia</span>
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              Discover Amazing Local Deals
            </span>
          </h2>
          <p className="text-xl text-white mb-12 font-medium">
            Find the best discounts from your favorite local shops.
            Save money while supporting your community.
          </p>
        </div>
        
        <div 
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer flex flex-col items-center"
          onClick={onExploreClick}
        >
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-center justify-center p-1">
            <div className="w-2 h-3 bg-white rounded-full animate-[bounce_1.5s_infinite]" />
          </div>
          <p className="text-white/70 text-lg mt-2 text-center w-full">
            Scroll to Explore
          </p>
        </div>
      </div>
    </div>
  );
}
