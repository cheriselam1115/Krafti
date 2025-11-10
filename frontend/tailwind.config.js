/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f3',
          100: '#fce8e4',
          200: '#f9d5ce',
          300: '#f5b6aa',
          400: '#ee8d7a',
          500: '#e3694f',
          600: '#cf4d34',
          700: '#ad3d28',
          800: '#903624',
          900: '#783224',
          950: '#41160f',
        },
        secondary: {
          50: '#f5f7fa',
          100: '#eaeff4',
          200: '#d0dce7',
          300: '#a7bed2',
          400: '#779cb9',
          500: '#5780a2',
          600: '#446687',
          700: '#38536e',
          800: '#31465c',
          900: '#2d3d4e',
          950: '#1e2834',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
