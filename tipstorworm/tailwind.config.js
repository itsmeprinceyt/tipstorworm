/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'blackcustom': '4px 4px 0px rgba(0, 0, 0, 1)',
        'yellowcustom': '4px 4px 0px rgba(234, 179, 8, 1)',
        'greencustom': '4px 4px 0px rgba(34, 197, 94, 1)',
      },
      textShadow: {
        'default': '2px 2px 4px rgba(0, 0, 0, 0.5)',
        'md': '3px 3px 6px rgba(0, 0, 0, 0.5)',
        'lg': '5px 5px 10px rgba(0, 0, 0, 0.5)',
        'hard': '5px 5px 0px rgba(0, 0, 0, 1)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-md': {
          textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          textShadow: '5px 5px 10px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-hard': {
          textShadow: '5px 5px 0px rgba(0, 0, 0, 1)',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
