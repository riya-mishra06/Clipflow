/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        outline: "#958ea0",
        "outline-variant": "#494454",
        background: "#111318",
        surface: "#111318",
        "surface-dim": "#111318",
        "surface-bright": "#37393f",
        "surface-variant": "#33353a",
        "surface-tint": "#d0bcff",
        "surface-container-lowest": "#0c0e13",
        "surface-container-low": "#1a1b21",
        "surface-container": "#1e1f25",
        "surface-container-high": "#282a2f",
        "surface-container-highest": "#33353a",
        "on-surface": "#e2e2e9",
        "on-surface-variant": "#cbc3d7",
        "on-background": "#e2e2e9",
        "inverse-surface": "#e2e2e9",
        "inverse-on-surface": "#2e3036",

        primary: "#d0bcff",
        "primary-container": "#a078ff",
        "on-primary": "#3c0091",
        "on-primary-container": "#340080",
        "primary-fixed": "#e9ddff",
        "primary-fixed-dim": "#d0bcff",
        "on-primary-fixed": "#23005c",
        "on-primary-fixed-variant": "#5516be",
        "inverse-primary": "#6d3bd7",

        secondary: "#cebdff",
        "secondary-container": "#4f319c",
        "on-secondary": "#381385",
        "on-secondary-container": "#bea8ff",
        "secondary-fixed": "#e8ddff",
        "secondary-fixed-dim": "#cebdff",
        "on-secondary-fixed": "#21005e",
        "on-secondary-fixed-variant": "#4f319c",

        tertiary: "#4edea3",
        "tertiary-container": "#00a572",
        "on-tertiary": "#003824",
        "on-tertiary-container": "#00311f",
        "tertiary-fixed": "#6ffbbe",
        "tertiary-fixed-dim": "#4edea3",
        "on-tertiary-fixed": "#002113",
        "on-tertiary-fixed-variant": "#005236",

        error: "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",

        // Studio legacy palette alias
        studio: {
          950: '#0b0d13',
          900: '#11141c',
          850: '#171b26',
          800: '#1f2433',
          700: '#2d3449',
          border: '#23293a',
          accent: '#8b5cf6',
          accentHover: '#7c3aed'
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      }
    },
  },
  plugins: [],
};
