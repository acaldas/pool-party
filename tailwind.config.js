/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      sm: "0.66rem",
      base: "1rem",
      lg: "1.33rem",
      xl: "1.66rem",
      "2xl": "2.66rem",
    },
    spacing: {
      0: "0px",
      1: "4px",
      2: "8px",
      3: "12px",
      4: "16px",
      5: "20px",
      6: "24px",
      7: "28px",
      8: "32px",
      9: "48px",
      10: "64px",
    },
    screens: {
      xl: { max: "1780px" },
      lg: { max: "1380px" },
      md: { max: "1040px" },
      sm: { max: "840px" },
      xs: { max: "560px" },
    },
    extend: {
      backgroundImage: {
        blur: "background: linear-gradient(0deg, rgba(83, 214, 255, 0.05), rgba(83, 214, 255, 0.05)), rgba(255, 255, 255, 0.5)",
        "gradient-blur":
          "background: linear-gradient(0deg, rgba(83, 214, 255, 0.05), rgba(83, 214, 255, 0.05)), rgba(255, 255, 255, 0.5)",
      },
      colors: {
        purple: "#6C02EA",
        blue: "#3082FF",
        blueLight: "rgba(157, 208, 222, 0.75)",
        blueDark: "rgb(48, 135, 166)",
        pink: "#DD008B",
        pinkDark: "#B1006F",
        modal: "rgba(0, 0, 0, 0.5)",
        gray: "#949494",
      },
    },
  },
  plugins: [],
};
