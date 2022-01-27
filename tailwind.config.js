module.exports = {
  content: ["./src/**/*.{tsx,jsx,ts,js}"],
  theme: {
    extend: {
      height: (theme) => ({
        "screen/2": "50vh",
        "screen/3": "calc(100vh / 3)",
        "screen/4": "calc(100vh / 4)",
        "screen/5": "calc(100vh / 5)",
        "screen-90": "90vh",
        "screen-80": "80vh",
        "full-minus-nav": "calc(100vh - 134px)",
      }),
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
