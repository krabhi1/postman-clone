import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import * as path from 'path'
export default defineConfig({
  plugins: [react(), dts({ include:["src/lib"]})],
  build: {
    lib: {
      entry: resolve(__dirname, "./src/lib/main.tsx"),
      // name: 'shared-ui',
      fileName: (format) => `main.js`, 
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime","zustand","use-immer","immer","shared-ui","react-router-dom","common-utils","react-dom"],
      // output:{
      //   globals:{
      //     react: 'React'
      //   }
      // }
    },
  },
});
