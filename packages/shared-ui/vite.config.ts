import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import * as path from 'path'
export default defineConfig({
  plugins: [react(), dts({ include: ["src/lib" ,"src/components"] })],
  build: {
    lib: {
      entry: resolve(__dirname, "./src/lib/main.ts"),
      // name: 'shared-ui',
      fileName: (format) => `main.js`,
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react/jsx-runtime","common-store","zustand","common-utils","react-dom"],
      // output:{
      //   globals:{
      //     react: 'React'
      //   }
      // }
    },
  },
});
