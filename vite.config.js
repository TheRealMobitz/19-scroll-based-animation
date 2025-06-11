import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    publicDir: 'static',
    base: './',
    server: {
        host: true,
        open: !('SANDBOX_URL' in process.env || 'CODESANDBOX_HOST' in process.env),
        fs: {
            strict: false
        }
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    three: ['three', '@react-three/fiber', '@react-three/drei']
                }
            }
        },
        assetsDir: 'assets',
        copyPublicDir: true
    },
    define: {
        global: 'globalThis',
    },
    // Explicit asset handling for your structure
    assetsInclude: ['**/*.fbx', '**/*.png', '**/*.jpg', '**/*.jpeg'],
    optimizeDeps: {
        exclude: ['three']
    }
});