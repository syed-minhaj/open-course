import type { Config } from "tailwindcss";
import  color  from "tailwindcss/colors";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--color-primary)",
        prePrimary: "var(--color-prePrimary)",
        secondary: "var(--color-secondary)",
        tertiary: "var(--color-tertiary)",
        accent: "var(--color-accent)",
      },
      height: {
        "screen": "100dvh",
      },
      width: {
        "screen": "100svw",
      },
      minHeight: {
        "screen": "100dvh",
      },
      minWidth: {
        "screen": "100dvw",
      },
    },
  },
  plugins: [],
  darkMode: "class",
} satisfies Config;
