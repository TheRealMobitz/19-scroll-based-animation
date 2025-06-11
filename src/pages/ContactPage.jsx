import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, PerspectiveCamera } from '@react-three/drei';
import Navigation from '../components/Navigation';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Enhanced Torus component with gradient
function TorusObject() {
  const meshRef = useRef();
  const gradientTexture = useTexture('/textures/gradients/5.jpg');
  
  gradientTexture.magFilter = THREE.NearestFilter;
  gradientTexture.generateMipmaps = false;
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.08;
    meshRef.current.rotation.y += delta * 0.1;
    
    // Floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
  });

  const handleClick = () => {
    gsap.to(meshRef.current.rotation, {
      duration: 2,
      ease: 'power2.inOut',
      x: '+=12',
      y: '+=6'
    });
  };
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]} onClick={handleClick}>
      <torusGeometry args={[1.2, 0.5, 20, 80]} />
      <meshToonMaterial color="#ffeded" gradientMap={gradientTexture} />
    </mesh>
  );
}

// Secondary floating objects for visual interest
function FloatingObjects() {
  const sphere1Ref = useRef();
  const sphere2Ref = useRef();
  const sphere3Ref = useRef();
  const gradientTexture = useTexture('/textures/gradients/5.jpg');
  
  gradientTexture.magFilter = THREE.NearestFilter;
  gradientTexture.generateMipmaps = false;
  
  useFrame((state, delta) => {
    if (sphere1Ref.current) {
      sphere1Ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.5 + 2;
      sphere1Ref.current.rotation.x += delta * 0.3;
    }
    if (sphere2Ref.current) {
      sphere2Ref.current.position.y = Math.cos(state.clock.elapsedTime * 0.8) * 0.3 - 2;
      sphere2Ref.current.rotation.z += delta * 0.2;
    }
    if (sphere3Ref.current) {
      sphere3Ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.4 + 3;
      sphere3Ref.current.rotation.y += delta * 0.4;
    }
  });
  
  return (
    <>
      <mesh ref={sphere1Ref} position={[-3, 2, -2]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshToonMaterial color="#ff6b6b" gradientMap={gradientTexture} />
      </mesh>
      <mesh ref={sphere2Ref} position={[3, -2, -1]}>
        <octahedronGeometry args={[0.4]} />
        <meshToonMaterial color="#4ecdc4" gradientMap={gradientTexture} />
      </mesh>
      <mesh ref={sphere3Ref} position={[3, 0, -3]}>
        <dodecahedronGeometry args={[0.35]} />
        <meshToonMaterial color="#ffe66d" gradientMap={gradientTexture} />
      </mesh>
    </>
  );
}

// Enhanced Particles component
function Particles({ count = 150 }) {
  const particlesRef = useRef();
  const texture = useTexture('/textures/particles/8.png');
  
  useFrame((state, delta) => {
    if (!particlesRef.current || !particlesRef.current.geometry) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) * 0.003 + 0.002;
      positions[i3] += Math.cos(state.clock.elapsedTime * 0.3 + i * 0.05) * 0.001;
      
      if (positions[i3 + 1] > 8) {
        positions[i3 + 1] = -8;
        positions[i3] = (Math.random() - 0.5) * 15;
        positions[i3 + 2] = (Math.random() - 0.5) * 15;
      }
    }
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });
  
  const particlePositions = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = -Math.random() * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return positions;
  }, [count]);

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
        size={0.12}
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

// Enhanced Camera controller
function CameraController() {
  const cameraGroup = useRef();
  const { camera } = useThree();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      setCursor({
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!cameraGroup.current) return;
    
    const parallaxX = cursor.x * 0.8;
    const parallaxY = -cursor.y * 0.8;
    
    cameraGroup.current.position.x += (parallaxX - cameraGroup.current.position.x) * 4 * delta;
    cameraGroup.current.position.y += (parallaxY - cameraGroup.current.position.y) * 4 * delta;
  });

  return <group ref={cameraGroup} />;
}

// Main component
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Message submitted! Thank you for reaching out. I\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };
  
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
      >
        <color attach="background" args={['#1e1a20']} />
        <fog attach="fog" args={['#1e1a20', 12, 25]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[2, 2, 1]} intensity={1.2} />
        <pointLight position={[-2, 2, 2]} intensity={0.8} color="#ff6b6b" />
        <pointLight position={[2, -2, 2]} intensity={0.6} color="#4ecdc4" />
        
        <TorusObject />
        <FloatingObjects />
        <Particles count={150} />
        <CameraController />
        
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
      </Canvas>
      
      <section className="contact-wrapper">
        <div className="contact-container">
          <div className="contact-header">
            <h1>Get In Touch</h1>
            <p className="contact-subtitle">Let's create something amazing together</p>
          </div>
          
          <div className="contact-content">
            <div className="contact-info">
              <h3>Contact Information</h3>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <h4>Email</h4>
                  <p>therealmobitz@outlook.com</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-details">
                  <h4>Location</h4>
                  <p>Mashhad, Iran</p>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-details">
                  <h4>Phone</h4>
                  <p>+98 (915) 683-5236</p>
                </div>
              </div>
              
              <div className="social-section">
                <h4>Follow Me</h4>
                <div className="social-links">
                  <a href="https://github.com/TheRealMobitz" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <i className="fab fa-github"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/mobin-teymourpour-b39460279" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="https://www.instagram.com/therealmobitz" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>Send Message</h3>
              
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input 
                  type="text" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                  placeholder="Your full name"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea 
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required 
                  placeholder="Tell me about your project..."
                  rows="6"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i>
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}