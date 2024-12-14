"use client";
import { useState } from "react";
import { getLanguage, setLanguage, useTranslation } from "react-multi-lang";
import styles from "./Header.module.css";
import GameInstructions from "@/popups/GameInstructions";
import useBackend from "@/backend/useBackend";
import { useGlobalAudioPlayer } from "react-use-audio-player";
import Clickable from "@/popups/Clickable";

export default function Header({
    hideSoundButton,
    hideLanguageButton,
    hideQuitButton,
    hideGameInstructionsButton,
    hideAccountInfo,
    hideAdminAccountInfo,
    onQuitSelected,
    isRelative
}) {
    const backend = useBackend();
    const { play, pause, paused } = useGlobalAudioPlayer();
    const [showGameInstructions, setShowGameInstructions] = useState(false);

    function toggleSound() {
        if (paused) play();
        else pause();
    }

    function toggleLanguage() {
        if (getLanguage() === "de") setLanguage("en");
        else setLanguage("de");
    }

    // instead of default class names use modular css classNames (e.g. className="icon-container" -> className={styles["icon-container"]}): DO THIS NOW
    return (
        <main
            style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between", 
            }}
            className={ isRelative ? styles.relative : styles.main}
        >
            <div className={styles.leftArea}>
                {!hideSoundButton && (
                    <Clickable>
                        <button
                            className={styles["icon-container"]}
                            onClick={toggleSound}
                        >
                            <img
                                src={
                                    !paused
                                        ? "/images/sound-aktiviert.png"
                                        : "/images/sound-deaktiviert.png"
                                }
                                className={styles["icon"]}
                            />
                        </button>
                    </Clickable>
                )}
                {!hideLanguageButton && (
                    <Clickable>
                        <button
                            className={styles["icon-container"]}
                            onClick={toggleLanguage}
                        >
                            <img
                                src={
                                    getLanguage() === "de"
                                        ? "/images/deutsch.png"
                                        : "/images/englisch.png"
                                }
                                className={styles["icon"]}
                            />
                        </button>
                    </Clickable>
                )}
                {!hideQuitButton && (
                    <Clickable>
                        <button
                            className={styles["icon-container"]}
                            onClick={onQuitSelected}
                        >
                            <img
                                src="/images/exit.png"
                                className={styles["icon"]}
                            />
                        </button>
                    </Clickable>
                )}
            </div>
            <div className={styles.rightArea}>
                {!hideAdminAccountInfo && (
                    <div
                        className={`${styles["text-button"]} ${styles["accountInfo"]}`}
                    >
                        <img
                            src="/images/user-icon.png"
                            className={styles["user-icon"]}
                        ></img>
                        <div>{backend.globals.username || "no_user"}</div>
                    </div>
                )}
                {!hideAccountInfo && (
                    <div className={`${styles["text-button"]} ${styles["accountInfo"]}`}>
                        <span className={styles["username"]}>{backend.globals.username || "no_user"}</span>
                    </div>
                )}
                {!hideGameInstructionsButton && (
                    <Clickable>
                        <button
                            className={styles["icon-container"]}
                            onClick={() => setShowGameInstructions(true)}
                        >
                            <img
                                src="/images/fragezeichen.png"
                                className={styles["icon"]}
                            ></img>
                        </button>
                    </Clickable>
                )}
            </div>

            <GameInstructions
                visible={showGameInstructions}
                onClose={() => setShowGameInstructions(false)}
            />
        </main>
    );
}
