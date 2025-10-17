// RUTA: inventorypro/vite.config.mjs
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tagger from "@dhiwise/component-tagger";
import path from "path"; // <-- Añade esta línea

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        outDir: "build",
        chunkSizeWarningLimit: 2000,
    },
    plugins: [tsconfigPaths(), react(), tagger()],
    server: {
        port: "4028",
        host: "0.0.0.0",
        strictPort: true,
        allowedHosts: ['.amazonaws.com', '.builtwithrocket.new']
    },
    // --- Añade esta sección ---
    resolve: {
        alias: {
        // Esto le dice a Vite que '@/' significa 'la carpeta src/'
        '@': path.resolve(__dirname, './src'),
        },
    },
    // -------------------------
});