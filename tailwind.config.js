/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          bg: '#09090b',         // Clean obsidian / deep matte zinc
          card: '#121215',       // Elevated panel surface
          hover: '#18181c',      // Subtle card hover
          border: 'rgba(255, 255, 255, 0.08)', // Crisp hairline border
          borderHover: 'rgba(255, 255, 255, 0.16)',
          muted: '#71717a',      // Subtle secondary text
          subtle: '#a1a1aa',     // Readable muted text
        },
        accent: {
          indigo: '#6366f1',     // Modern electric indigo (Linear / Frame.io style)
          indigoLight: '#818cf8',
          emerald: '#10b981',    // Success / Payout green
          amber: '#f59e0b',      // Warning / Attention
          rose: '#f43f5e',       // Critical / Deadline
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        headline: ['var(--font-jakarta)', 'sans-serif'],
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        panel: '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
