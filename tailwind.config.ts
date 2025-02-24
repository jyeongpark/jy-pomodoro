import type { Config } from "tailwindcss";

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
          background: "var(--background)",
          primary: "var(--primary)",
          secondary:  "var(--secontary)",
          text:  "var(--foreground)",
        },
      
    },
  },
  plugins: [],
} satisfies Config;
