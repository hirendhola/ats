import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [react(), nodePolyfills({
    protocolImports: true,
  }),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), 
      fs: "browserify-fs", // Use a browser-compatible version of fs
    },
  },

})
