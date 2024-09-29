import fs from "node:fs";
import path from "node:path";
import child_process from "node:child_process";

import { defineConfig } from "vite";
import vitePluginReactSWC from "@vitejs/plugin-react-swc";

const baseFolder =
    process.env.APPDATA !== undefined && process.env.APPDATA !== ""
        ? `${process.env.APPDATA}/ASP.NET/https`
        : `${process.env.HOME}/.aspnet/https`;

const certificateName = "FU.OJ.Client";
const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (
        0 !==
        child_process.spawnSync(
            "dotnet",
            [
                "dev-certs",
                "https",
                "--export-path",
                certFilePath,
                "--format",
                "Pem",
                "--no-password",
            ],
            { stdio: "inherit" },
        ).status
    ) {
        throw new Error("Could not create certificate.");
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vitePluginReactSWC()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"), // Adjust 'src' to match your project structure
            //'components': path.resolve(__dirname, 'src/components'),
            //'ui': path.resolve(__dirname, 'src/components/ui'),
            //'lib': path.resolve(__dirname, 'src/lib'),
            //'utils': path.resolve(__dirname, 'src/lib/utils'),
            //'hooks': path.resolve(__dirname, 'src/hooks'),
        },
    },
    server: {
        port: 5173,
        https: {
            key: fs.readFileSync(keyFilePath),
            cert: fs.readFileSync(certFilePath),
        },
    },
});
