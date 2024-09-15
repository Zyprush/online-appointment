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
          primary: "#43766C",
          secondary: "#B19470",
          accent: "#F8FAE5",
          neutral: "#76453B",
          "base-100": "#ffffff",
        },
      },
      "corporate",
    ],
  },
  plugins: [require("daisyui")],
};
export default config;