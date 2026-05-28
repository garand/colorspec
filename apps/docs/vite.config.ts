import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from "node:url"

const config = defineConfig({
  resolve: {
    alias: {
      "@colorspec/core": fileURLToPath(new URL("../../packages/core/src/index.ts", import.meta.url)),
    },
    tsconfigPaths: true,
  },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
})

export default config
