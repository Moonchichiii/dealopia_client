/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',  
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0E0C15',
        bgSecondary: '#1A1727',
        textPrimary: '#FFFFFF',
        textSecondary: '#C9C7CF',
        accentPink: '#FF38B4',
        accentBlue: '#70BCFF',
        accentYellow: '#FCFC88',
        accentGreen: '#00F5A0',
      },
      borderRadius: {
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
      },
      boxShadow: {
        custom: '0 8px 32px rgba(0, 0, 0, 0.2)',
      },
      transitionTimingFunction: {
        custom: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}