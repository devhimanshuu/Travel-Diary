/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      display: ["Poppins", "sans-serif"],
    },
    extend: {
      //Colors used
      primary: "#05B6D3",
      secondary: "#EF863E",
    },
    backgroundImage: {
      "login-bg-img": "url('./src/assets/images/bg-image-sm.jpg')",
      "signup-bg-img": "url('./src/assets/images/signup-bg.jpg')",
    },
  },
  plugins: [],
};
