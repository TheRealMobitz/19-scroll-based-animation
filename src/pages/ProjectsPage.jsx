import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, PerspectiveCamera, useFBX } from '@react-three/drei';
import Navigation from '../components/Navigation';
import * as THREE from 'three';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const objectsDistance = 4;
const sections = [
  { id: 0, y: 0 },
  { id: 1, y: -objectsDistance },
  { id: 2, y: -objectsDistance * 2 }
];

// Electronics Model Component with corrected path and fallback
function ElectronicsProjectModel({ position, modelPath, rotation }) {
  const meshRef = useRef();
  const fbx = useFBX(modelPath);
  
  // Safe texture loading with better error handling
  const [texture, setTexture] = useState(null);
  
  useEffect(() => {
    // Try to load texture, but don't crash if it fails
    const loadTexture = async () => {
      try {
        const tex = await new Promise((resolve, reject) => {
          const loader = new THREE.TextureLoader();
          loader.load(
            '/assets/Textures.png', // Fixed path
            resolve,
            undefined,
            reject
          );
        });
        setTexture(tex);
      } catch (error) {
        console.warn('Electronics texture not found, using fallback material');
        setTexture(null);
      }
    };
    
    loadTexture();
  }, []);
  
  useEffect(() => {
    if (fbx) {
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshToonMaterial({
            map: texture,
            color: '#ffeded'
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Much smaller scale for electronics in projects page
      fbx.scale.setScalar(0.0008);
    }
  }, [fbx, texture]);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.12;
  });

  const handleClick = () => {
    if (!meshRef.current) return;
    gsap.to(meshRef.current.rotation, {
      duration: 1.5,
      ease: 'power2.inOut',
      x: '+=6',
      y: '+=3',
      z: '+=1.5'
    });
  };
  
  return (
    <group ref={meshRef} position={position} rotation={rotation} onClick={handleClick}>
      <primitive object={fbx.clone()} />
    </group>
  );
}

// Fixed Quest2 Model without texture dependencies to prevent VR texture loading
function Quest2ProjectModel({ position, rotation }) {
  const meshRef = useRef();
  const fbx = useFBX('/assets/Quest2_lowpoly.fbx'); // Fixed path
  
  useEffect(() => {
    if (fbx) {
      fbx.traverse((child) => {
        if (child.isMesh) {
          // Completely override the material to prevent texture loading
          child.material = new THREE.MeshToonMaterial({
            color: '#f5f5f5',
            transparent: false
          });
          
          // Clear any existing material properties that might reference textures
          child.material.map = null;
          child.material.normalMap = null;
          child.material.emissiveMap = null;
          child.material.roughnessMap = null;
          child.material.metalnessMap = null;
          child.material.aoMap = null;
          
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Much smaller scale for Quest2 in projects page
      fbx.scale.setScalar(0.0006);
    }
  }, [fbx]);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.12;
  });

  const handleClick = () => {
    if (!meshRef.current) return;
    gsap.to(meshRef.current.rotation, {
      duration: 1.5,
      ease: 'power2.inOut',
      x: '+=6',
      y: '+=3',
      z: '+=1.5'
    });
  };
  
  return (
    <group ref={meshRef} position={position} rotation={rotation} onClick={handleClick}>
      <primitive object={fbx.clone()} />
    </group>
  );
}

// MacBook Model for 3D Text Project with corrected path and material
function MacBookProjectModel({ position, rotation }) {
  const meshRef = useRef();
  const fbx = useFBX('/assets/MacBook_silver.fbx'); // Fixed path
  
  useEffect(() => {
    if (fbx) {
      fbx.traverse((child) => {
        if (child.isMesh) {
          // Fixed: Remove metalness and roughness from MeshToonMaterial
          child.material = new THREE.MeshToonMaterial({
            color: '#e0e0e0'
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // Much smaller scale for MacBook in projects page
      fbx.scale.setScalar(0.0003);
    }
  }, [fbx]);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.12;
  });

  const handleClick = () => {
    if (!meshRef.current) return;
    gsap.to(meshRef.current.rotation, {
      duration: 1.5,
      ease: 'power2.inOut',
      x: '+=6',
      y: '+=3',
      z: '+=1.5'
    });
  };
  
  return (
    <group ref={meshRef} position={position} rotation={rotation} onClick={handleClick}>
      <primitive object={fbx.clone()} />
    </group>
  );
}

// Enhanced Particles component with safe texture loading
function Particles({ count = 200 }) {
  const particlesRef = useRef();
  
  // Safe particle texture loading
  const [texture, setTexture] = useState(null);
  
  useEffect(() => {
    const loadParticleTexture = async () => {
      try {
        const tex = await new Promise((resolve, reject) => {
          const loader = new THREE.TextureLoader();
          loader.load(
            '/static/textures/particles/8.png',
            resolve,
            undefined,
            reject
          );
        });
        setTexture(tex);
      } catch (error) {
        console.warn('Particle texture not found, using fallback');
        setTexture(null);
      }
    };
    
    loadParticleTexture();
  }, []);
  
  const particlePositions = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 20 - 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);
  
  const lastUpdateTime = useRef(0);
  
  useFrame((state, delta) => {
    if (!particlesRef.current?.geometry?.attributes?.position) return;
    
    if (state.clock.elapsedTime - lastUpdateTime.current < 0.05) return;
    lastUpdateTime.current = state.clock.elapsedTime;
    
    const positions = particlesRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002 + 0.001;
      
      if (positions[i3 + 1] > 10) {
        positions[i3 + 1] = -10;
        positions[i3] = (Math.random() - 0.5) * 20;
        positions[i3 + 2] = (Math.random() - 0.5) * 20;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08}
        color="#ffeded"
        transparent
        alphaMap={texture}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Section-based Camera controller
function SectionBasedCameraController() {
  const cameraGroup = useRef();
  const { camera } = useThree();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState(0);
  const targetY = useRef(0);

  const handleMouseMove = useCallback((event) => {
    setCursor({
      x: event.clientX / window.innerWidth - 0.5,
      y: event.clientY / window.innerHeight - 0.5
    });
  }, []);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const sectionHeight = window.innerHeight;
          const newSection = Math.round(scrollTop / sectionHeight);
          const clampedSection = Math.max(0, Math.min(sections.length - 1, newSection));
          
          if (clampedSection !== currentSection) {
            setCurrentSection(clampedSection);
            targetY.current = sections[clampedSection].y;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleMouseMove, currentSection]);

  useFrame((state, delta) => {
    if (!cameraGroup.current) return;
    
    camera.position.y += (targetY.current - camera.position.y) * 3 * delta;
    
    const parallaxX = cursor.x * 0.5;
    const parallaxY = -cursor.y * 0.5;
    
    cameraGroup.current.position.x += (parallaxX - cameraGroup.current.position.x) * 2 * delta;
    cameraGroup.current.position.y += (parallaxY - cameraGroup.current.position.y) * 2 * delta;
  });

  return <group ref={cameraGroup} />;
}

export default function ProjectsPage() {
  return (
    <>
      <Navigation />
      <Canvas 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%',
          height: '100%'
        }} 
        dpr={[1, 2]}
        linear
        gl={{ 
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={['#1e1a20']} />
        <fog attach="fog" args={['#1e1a20', 15, 25]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 2, 1]} intensity={1.2} />
        <pointLight position={[-2, -2, -2]} intensity={0.8} color="#ff6b6b" />
        
        {/* Projects with relevant 3D models - corrected paths */}
        <ElectronicsProjectModel 
          position={[3, 0, 0]} 
          modelPath="/assets/electronics_010.fbx"
          rotation={[0, 0, 0]} 
        />
        
        <Quest2ProjectModel 
          position={[-3, -objectsDistance, 0]} 
          rotation={[0, 0, 0]} 
        />
        
        <MacBookProjectModel 
          position={[3, -objectsDistance * 2, 0]} 
          rotation={[0, 0, 0]} 
        />
        
        <Particles count={200} />
        
        <SectionBasedCameraController />
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
      </Canvas>
      
      <div className="projects-container">
        <div className="section project-section" data-section="0">
          <div className="project-card">
            <div className="project-number">01</div>
            <div className="project-content">
              <h2>Three.js Portfolio
                <span className="project-subtitle">Interactive 3D Web Experience</span>
              </h2>
              <p className="project-description">
                An immersive portfolio website showcasing advanced Three.js capabilities with 
                scroll-based animations, particle systems, and interactive 3D objects. Features 
                responsive design and optimized performance.
              </p>
              <div className="project-tech">
                <span className="tech-tag">Three.js</span>
                <span className="tech-tag">React</span>
                <span className="tech-tag">GSAP</span>
                <span className="tech-tag">WebGL</span>
              </div>
              <div className="project-links">
                <Link to="/" className="project-link primary">View Live</Link>
                <a href="#" className="project-link secondary">Source Code</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="section project-section" data-section="1">
          <div className="project-card">
            <div className="project-number">02</div>
            <div className="project-content">
              <h2>Physical Material Tester
                <span className="project-subtitle">Advanced WebGL Rendering</span>
              </h2>
              <p className="project-description">
                A sophisticated system for experimenting with physically-based materials in Three.js. 
                Features real-time material editing, lighting controls, and export functionality 
                for production workflows.
              </p>
              <div className="project-tech">
                <span className="tech-tag">WebGL</span>
                <span className="tech-tag">PBR Materials</span>
                <span className="tech-tag">React</span>
                <span className="tech-tag">Dat.GUI</span>
              </div>
              <div className="project-links">
                <a href="https://therealmobitzmaterials-therealmobitz-mobitzs-projects.vercel.app/" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="project-link primary">
                  View Live
                </a>
                <a href="#" className="project-link secondary">Source Code</a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="section project-section" data-section="2">
          <div className="project-card">
            <div className="project-number">03</div>
            <div className="project-content">
              <h2>3D Text Visualization
                <span className="project-subtitle">Typography in 3D Space</span>
              </h2>
              <p className="project-description">
                An interactive 3D text visualization showcasing advanced typography techniques 
                in Three.js. Features dynamic text generation, custom fonts, and animated 
                text effects with particle integration.
              </p>
              <div className="project-tech">
                <span className="tech-tag">Three.js</span>
                <span className="tech-tag">Typography</span>
                <span className="tech-tag">Animations</span>
                <span className="tech-tag">Particles</span>
              </div>
              <div className="project-links">
                <a href="https://therealmobitz3dtext-mobitzs-projects.vercel.app/" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="project-link primary">
                  View Live
                </a>
                <a href="#" className="project-link secondary">Source Code</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="scroll-indicator">
        <span>Scroll to explore projects</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </>
  );
}