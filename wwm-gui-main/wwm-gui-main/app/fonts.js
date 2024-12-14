import { Audiowide, Alumni_Sans, Red_Hat_Mono } from "next/font/google";

export const audioWide = Audiowide({
	subsets: ["latin"],
	variable: "--font-audio-wide",
	weight: "400",
	display: "swap",
});

export const alumniSans = Alumni_Sans({
	subsets: ["latin"],
	variable: "--font-alumni-sans",
	display: "swap",
});

export const mono = Red_Hat_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
	weight: "700",
});
