/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}'
  ],
  theme: {
    extend: {
      colors: {
        'canvas-button': '#004B88',
        'canvas': '#97C8FF',
        'section-dim': 'rgba(255, 255, 255, .7)'
      }
    }
  },
  plugins: [],
}

