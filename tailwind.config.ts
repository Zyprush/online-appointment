import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#244E8A",
          secondary: "#6F7D42",
          accent: "#CDCDCA",
          neutral: "#384758",
          "base-100": "#ffffff",
        },
      },
      "corporate",
    ],
  },
  plugins: [require("daisyui")],
};
export default config;