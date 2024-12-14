import "./globals.css";
import {
    getLanguage,
    setDefaultLanguage,
    setTranslations,
} from "react-multi-lang";
import de from "../languages/de.json";
import en from "../languages/en.json";
import { CookiesProvider } from "next-client-cookies/server";
import Context from "@/backend/Context";
import { alumniSans, audioWide, mono } from "./fonts";

setTranslations({ de, en });
setDefaultLanguage("de");

export default function RootLayout({ children }) {
    return (
        <html
            className={`${audioWide.variable} ${alumniSans.variable} ${mono.variable}`}
        >
            <head>
                <link rel="manifest" href="/manifest.json" />
                <title>WWM</title>
            </head>
            <body>
                <CookiesProvider>
                    <Context>{children}</Context>
                </CookiesProvider>
            </body>
        </html>
    );
}
