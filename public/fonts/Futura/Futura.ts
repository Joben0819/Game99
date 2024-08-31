import localFont from "next/font/local";

export const FUTURA = localFont({
  src: [
    {
      path: "../Futura/FuturaRegular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../Futura/FuturaMedium.ttf",
      weight: "500",
      style: "normal",
    },

    {
      path: "../Futura/FuturaBold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-futura",
});
