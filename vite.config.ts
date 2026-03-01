import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base to repo name for GitHub Pages deployment
  // Override with: BASE_PATH=/wavelength npm run build
  base: process.env.BASE_PATH ?? "/",
});
