import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Set base path - use '/' for cPanel, or '/anambra-geo-hub/' for GitHub Pages
  base: '/',
  server: {
    host: "::",
    port: 8080,
    allowedHosts : [
      'adb44926584b.ngrok-free.app '
    ]
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
}));
