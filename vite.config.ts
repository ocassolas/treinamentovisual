import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    middlewareMode: false,
    // Serve index.html for all requests (SPA fallback)
    middleware: (req, res, next) => {
      if (req.url.match(/^\/[^.]*$/) && !req.url.startsWith('/node_modules')) {
        req.url = '/index.html';
      }
      next();
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    // For production build preview
    allowedHosts: 'all',
  },
}));
