/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#0b0d13',
          900: '#11141c',
          850: '#171b26',
          800: '#1f2433',
          700: '#2d3449',
          border: '#23293a',
          accent: '#6366f1',
          accentHover: '#4f46e5'
        }
      }
    },
  },
  plugins: [],
};
