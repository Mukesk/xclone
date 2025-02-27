import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // Change to "/" if deploying on root domain
  build: {
    outDir: "dist", // Ensure build output goes to "dist/"
    emptyOutDir: true
  }
});
