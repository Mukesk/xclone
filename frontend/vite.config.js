import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Use "/" if deploying to a custom domain
  build: {
    outDir: "dist/", // Ensure build output goes to "dist/"
    emptyOutDir: true,
  }
});
