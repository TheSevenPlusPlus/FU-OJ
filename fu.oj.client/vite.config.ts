import path from "node:path";
import { defineConfig } from "vite";
import vitePluginReactSWC from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vitePluginReactSWC()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"), // Adjust 'src' to match your project structure
        },
    },
    server: {
        host: "0.0.0.0",
        port: 5173,
        strictPort: true,
    },
});
