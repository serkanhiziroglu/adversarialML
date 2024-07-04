module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
        'playwrite': ['"Playwrite GB S"', 'sans-serif'],
        'comfortaa': ['Comfortaa', 'cursive'],
      },
    },
  },
  plugins: [],
};