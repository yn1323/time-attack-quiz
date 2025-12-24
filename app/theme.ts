import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        quiz: {
          orange: {
            500: { value: "#FF8800" },
            600: { value: "#E67A00" },
          },
          yellow: {
            500: { value: "#FFE500" },
          },
          correct: { value: "#22C55E" },
          correctBg: { value: "#DCFCE7" },
          incorrect: { value: "#EF4444" },
          incorrectBg: { value: "#FEE2E2" },
          bg: { value: "#FFFDF7" },
          bgPattern: { value: "#FFF5E6" },
        },
      },
      fonts: {
        heading: { value: "var(--font-zen-maru)" },
        body: { value: "var(--font-zen-maru)" },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
