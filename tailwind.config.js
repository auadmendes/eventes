/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // 👈 very important
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#FFFFFF", // white
          primary: "#0071B7",    // flag blue
          secondary: "#E91E63",  // flag pink
          accent: "#87CEEB",     // light blue
          text: "#1E293B",       // dark slate text
        },
        dark: {
          background: "#0F172A", // dark slate
          primary: "#1E40AF",    // deep blue
          secondary: "#BE185D",  // dark pink
          accent: "#38BDF8",     // cyan
          text: "#F1F5F9",       // light text
        },
      },
    },
  },
  plugins: [],
};
