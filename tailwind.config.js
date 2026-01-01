/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mid Century Modern / Art Deco Palette
        'mcm': {
          // Warm tones
          'burnt-orange': '#D2691E',
          'mustard': '#E3A857',
          'olive': '#7A8450',
          'coral': '#FF6B6B',
          // Cool tones
          'teal': '#2A7F7F',
          'seafoam': '#95CFC5',
          'navy': '#1A3045',
          'deep-teal': '#1A4D4D',
          // Neutrals
          'cream': '#F5F1E8',
          'warm-cream': '#FFF8E7',
          'charcoal': '#2D2D2A',
          'slate': '#4A4A47',
          // Accents
          'gold': '#DAA520',
          'rust': '#B7410E',
          'sage': '#9CAF88',
        }
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'retro': '2px',
      },
      boxShadow: {
        'retro': '8px 8px 0px rgba(0, 0, 0, 0.1)',
        'retro-lg': '12px 12px 0px rgba(0, 0, 0, 0.15)',
        'inset-retro': 'inset 4px 4px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
