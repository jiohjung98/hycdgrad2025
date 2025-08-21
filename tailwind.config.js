/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nanum': ['NanumSquare_Neo', 'sans-serif'],
        'pretendard': ['Pretendard', 'sans-serif'],
      },
      colors: {
        'cyan': {
          900: '#164e63',
        },
        'red': {
          500: '#ef4444',
        },
        'teal': {
          50: '#f0fdfa',
        },
        'zinc': {
          800: '#27272a',
        },
      },
      maxWidth: {
        'desktop': '1506px',
        'mobile': '706px',
      },
    },
  },
  plugins: [],
}

