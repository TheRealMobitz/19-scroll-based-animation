## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

The BookingPage can be accessed by navigating to /booking in the browser after starting the development server, or by clicking the "Booking" link in the navigation bar.

Key Features and Techniques
Shader-Based Graphics:

Custom shader implementation for the reactive orbs using THREE.ShaderMaterial
Vertex and fragment shaders with pulsing effects and rim lighting
Mouse-reactive movement with smooth transitions
Particle Systems:

Star particle implementation using THREE.Points
Dynamic particle movement synchronized with HomePage particle system
Performance-optimized with buffer attributes and custom geometry
Particle reset logic based on camera position
Interactive 3D Elements:

Buildings with hover effects and animations
Cloud formations with organic floating movements
Background stars using drei's Stars component
Sparkles for atmospheric depth
UI Integration:

Seamless integration of 3D background with functional React UI
Interactive filter system with animations using GSAP
Dynamic hotel listing with search, filter, and sort capabilities
Responsive design for various screen sizes
Performance Optimizations:

Memoized data generation for static elements
Efficient shader calculations
Object pooling for particles
Minimal re-renders with React hooks