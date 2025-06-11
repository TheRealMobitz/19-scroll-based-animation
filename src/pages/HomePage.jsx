import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, PerspectiveCamera, useFBX } from '@react-three/drei';
import Navigation from '../components/Navigation';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Parameters
const parameters = {
  materialColor: '#ffeded',
  particlesSpeed: 0.1,
  particlesTwinkle: true
};

const objectsDistance = 4;
const sections = [
  { id: 0, y: 0 },
  { id: 1, y: -objectsDistance },
  { id: 2, y: -objectsDistance * 2 }
];

function ElectronicsModel({ position, modelPath }) {
  const meshRef = useRef();
  const fbx = useFBX(modelPath);
  
  // Safe texture loading with better error handling
  const [texture, setTexture] = useState(null);
  
  useEffect(() => {
    const loadTexture = async () => {
      try {
        const tex = await new Promise((resolve, reject) => {
          const loader = new THREE.TextureLoader();
          loader.load(
            '/assets/Textures.png', // Fixed: removed /static/ prefix
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
            color: parameters.materialColor
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
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
    <group ref={meshRef} position={position} onClick={handleClick}>
      <primitive object={fbx.clone()} />
    </group>
  );
}

function MacBookModel({ position }) {
  const meshRef = useRef();
  const fbx = useFBX('/assets/MacBook_silver.fbx'); // Fixed: removed /static/ prefix
  
  useEffect(() => {
    if (fbx) {
      fbx.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshToonMaterial({
            color: '#c0c0c0'
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      // MUCH smaller scale - barely visible
      fbx.scale.setScalar(0.00001);
    }
  }, [fbx]);
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.08;
    meshRef.current.rotation.y += delta * 0.1;
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
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
    <group ref={meshRef} position={position} onClick={handleClick}>
      <primitive object={fbx.clone()} />
    </group>
  );
}

// Fixed Quest2 Model to prevent ALL VR texture loading
function Quest2Model({ position }) {
  const meshRef = useRef();
  
  // Use a custom loader that intercepts and prevents texture loading
  const [fbxModel, setFbxModel] = useState(null);
  
  useEffect(() => {
    const loadModel = async () => {
      try {
        const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js');
        const loader = new FBXLoader();
        
        loader.load('/assets/Quest2_lowpoly.fbx', (fbx) => { // Fixed: removed /static/ prefix
          // Immediately override all materials before any texture loading
          fbx.traverse((child) => {
            if (child.isMesh) {
              // Completely replace material and clear ALL texture references
              const newMaterial = new THREE.MeshToonMaterial({
                color: '#f0f0f0',
                transparent: false
              });
              
              // Dispose old material to prevent texture loading
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => mat.dispose());
                } else {
                  child.material.dispose();
                }
              }
              
              child.material = newMaterial;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          fbx.scale.setScalar(0.0005);
          setFbxModel(fbx);
        }, undefined, (error) => {
          console.warn('Quest2 model failed to load:', error);
        });
      } catch (error) {
        console.warn('Failed to load Quest2 model:', error);
      }
    };
    
    loadModel();
  }, []);
  
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
  
  if (!fbxModel) return null;
  
  return (
    <group ref={meshRef} position={position} onClick={handleClick}>
      <primitive object={fbxModel.clone()} />
    </group>
  );
}

function Particles({ count = 150 }) {
  const particlesRef = useRef();
  
  // Safe particle texture loading with correct path
  const [texture, setTexture] = useState(null);
  
  useEffect(() => {
    const loadParticleTexture = async () => {
      try {
        const tex = await new Promise((resolve, reject) => {
          const loader = new THREE.TextureLoader();
          loader.load(
            '/textures/particles/8.png', // Fixed: removed /static/ prefix
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
  
  const particlePositions = useMemo(() => {
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
        color={parameters.materialColor}
        transparent
        alphaMap={texture}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

function SectionBasedCameraController() {
  const cameraGroup = useRef();
  const { camera } = useThree();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState(0);
  const targetY = useRef(0);
  
  useEffect(() => {
    let ticking = false;
    
    const handleMouseMove = (event) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setCursor({
            x: event.clientX / window.innerWidth - 0.5,
            y: event.clientY / window.innerHeight - 0.5
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset;
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
  }, [currentSection]);
  
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

export default function HomePage() {
  return (
    <>
      <Navigation />
      <Canvas 
        className="webgl"
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
        
        {/* 3D Models with corrected paths */}
        <ElectronicsModel position={[3, 0, 0]} modelPath="/assets/electronics_007.fbx" />
        <MacBookModel position={[-3, -objectsDistance, 0]} />
        <Quest2Model position={[3, -objectsDistance * 2, 0]} />
        
        <Particles count={150} />
        
        <SectionBasedCameraController />
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
      </Canvas>
      
      <div className="projects-container">
        <section className="section project-section" data-section="0">
          <div className="project-card">
            <div className="project-number">01</div>
            <div className="project-content">
              <h1>Mobin Teymourpour
                <span className="project-subtitle">THREE.JS Developer</span>
              </h1>
              <p className="project-description">
                Creating immersive 3D web experiences with passion and precision. 
                Specializing in interactive graphics, particle systems, and cutting-edge WebGL applications.
              </p>
              <div className="project-tech">
                <span className="tech-tag">Three.js</span>
                <span className="tech-tag">WebGL</span>
                <span className="tech-tag">React</span>
                <span className="tech-tag">GSAP</span>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section project-section" data-section="1">
          <div className="project-card">
            <div className="project-number">02</div>
            <div className="project-content">
              <h2>Projects
                <span className="project-subtitle">Creative & Technical Solutions</span>
              </h2>
              <p className="project-description">
                Explore my portfolio of interactive 3D applications and web experiences. 
                From material testing systems to immersive visualizations.
              </p>
              <div className="project-links">
                <Link to="/projects" className="project-link primary">View Projects</Link>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section project-section" data-section="2">
          <div className="project-card">
            <div className="project-number">03</div>
            <div className="project-content">
              <h2>Contact
                <span className="project-subtitle">Let's Collaborate</span>
              </h2>
              <p className="project-description">
                Ready to bring your ideas to life with cutting-edge 3D technology? 
                Let's discuss your next project and create something amazing together.
              </p>
              <div className="project-links">
                <Link to="/contact" className="project-link primary">Get In Touch</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <div className="scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </>
  );
}