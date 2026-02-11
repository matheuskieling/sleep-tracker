/** @type {import('tailwindcss').Config} */
const colors = require("./src/config/colors");

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
      fontSize: {
        "heading-xl": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "heading-m": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body": ["16px", { lineHeight: "24px" }],
        "caption": ["12px", { lineHeight: "16px" }],
      },
      borderRadius: {
        "card": "16px",
        "button": "14px",
        "pill": "9999px",
      },
      boxShadow: {
        "card": "0 2px 8px rgba(0, 0, 0, 0.06)",
        "card-lg": "0 4px 16px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
