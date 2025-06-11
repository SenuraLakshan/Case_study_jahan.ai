import {defineConfig} from "vite";

export default defineConfig({
    server: {
        port: 5174,  // Explicitly set port
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})