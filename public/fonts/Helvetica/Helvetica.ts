import localFont from "next/font/local";

export const HELVETICA = localFont({
  src: [
    {
      path: "../Helvetica/Helvetica Neue Regular.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
});
