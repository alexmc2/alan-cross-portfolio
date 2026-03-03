import { Syne, Outfit } from "next/font/google";

export const fontDisplay = Syne({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

export const fontBody = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});
