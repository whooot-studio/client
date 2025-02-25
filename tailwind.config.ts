import type { Config } from "tailwindcss";
import "tailwindcss/defaultTheme";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        blurple: {
          50: "#ECEEFE",
          100: "#DEE0FC",
          200: "#BDC2FA",
          300: "#9CA3F7",
          400: "#7A85F5",
          500: "#5865F2",
          600: "#1C2DED",
          700: "#0E1DB9",
          800: "#0A137B",
          900: "#050A3E",
          950: "#02041C",
        },
      },
    },
    aspectRatio: {
      auto: "auto",
      square: "1 / 1",
      video: "16 / 9",
    },
  },
};
