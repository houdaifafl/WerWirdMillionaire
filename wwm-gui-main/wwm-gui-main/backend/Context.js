"use client";
import { Globals, GlobalsContext } from "./useGlobals";
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import {
    getLanguage,
    setDefaultLanguage,
    setTranslations,
} from "react-multi-lang";
import de from "../languages/de.json";
import en from "../languages/en.json";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import Confetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";
import axios from "axios";

setTranslations({ de, en });
setDefaultLanguage("de");

function evaluateBooleanCookie(cookies, cookieName) {
    if (cookies.get(cookieName) === "true") return true;
    if (cookies.get(cookieName) === "false") return false;
    return null;
}

export default function Context({ children }) {
    const size = useWindowSize();
    const cookies = useCookies();
    const [authSession, setAuthSession] = useState({
        username: cookies.get("username") || null,
        authToken: cookies.get("auth_token") || null,
        isAdmin: evaluateBooleanCookie(cookies, "is_admin"),
    });
    const [securityQuestionsAnswered, setSecurityQuestionsAnswered] =
        useState(null);

    const [passwordResetToken, setPasswordResetToken] = useState(
        cookies.get("password_reset_token") || null
    );
    const [secretType, setSecretType] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);

    const audio = useGlobalAudioPlayer();
    useEffect(() => {
        let backgroundSoundPath = "/sound/sound.mp3";
        if (secretType) {
            backgroundSoundPath = `/sound/secrets/${secretType}.mp3`;
            document.getElementsByTagName("html")[0].classList.add("secret");
        }
        audio.load(backgroundSoundPath, {
            loop: true,
            autoplay: secretType !== null,
            initialVolume: 0.15,
        });
    }, [secretType]);

    useEffect(() => {
        axios.defaults.headers = {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
        };
    }, []);

    return (
        <GlobalsContext.Provider
            value={
                new Globals({
                    username: authSession.username,
                    authToken: authSession.authToken,
                    isAdmin: authSession.isAdmin,
                    passwordResetToken,
                    securityQuestionsAnswered,
                    secretType,
                    selectedQuestion,
                    setSelectedQuestion,
                    setSecretType,
                    setAuthSession: (session) => {
                        setAuthSession(session);
                        if (session.authToken === null) {
                            cookies.remove("username");
                            cookies.remove("auth_token");
                            cookies.remove("is_admin");
                        } else {
                            cookies.set("username", session.username);
                            cookies.set("auth_token", session.authToken);
                            cookies.set("is_admin", session.isAdmin);
                        }
                    },
                    setPasswordResetToken: (passwordResetToken) => {
                        setPasswordResetToken(passwordResetToken);
                        if (passwordResetToken === null) {
                            cookies.remove("password_reset_token");
                        } else {
                            cookies.set(
                                "password_reset_token",
                                passwordResetToken
                            );
                        }
                    },
                    setSecurityQuestionsAnswered: (
                        securityQuestionsAnswered
                    ) => {
                        setSecurityQuestionsAnswered(securityQuestionsAnswered);
                    },
                    api: process.env.BACKEND_API_URL,
                })
            }
        >
            {secretType && <Confetti style={{ position: "fixed" }} width={size.width} height={size.height} />}
            {children}
        </GlobalsContext.Provider>
    );
}
