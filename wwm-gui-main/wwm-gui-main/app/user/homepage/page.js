"use client";
import "globals";
import styles from "./homepage.module.css";
import React, { useEffect } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-multi-lang";
import useBackend from "@/backend/useBackend";
import Clickable from "@/popups/Clickable";
import Heading from "@/components/Heading";
import useProtection from "@/backend/useProtection";
import { useWindowSize } from "@uidotdev/usehooks";

export default function Page() {
    useProtection({ requiresUserLoggedIn: true });
    const router = useRouter();
    const translations = useTranslation();
    const backend = useBackend();
    const size = useWindowSize();
    const [trophyCount, setTrophyCount] = React.useState(0);

    async function loadTrophyCount() {
        const response = await backend.getTrophyCount();
        if (response.success) {
            setTrophyCount(response.count);
        }
    }

    useEffect(() => {
        loadTrophyCount();
    }, []);

    async function handleLogout() {
        const result = await backend.logout();
        if (result.success) {
            router.push("/account/log-in");
        }
    }

    const handleListoftheBest = () => {
        router.push("/user/highscores");
    };
    return (
        <main className={styles["main"]}>
            <Header
                hideAdminAccountInfo={true}
                onQuitSelected={handleLogout}
                hideAccountInfo={true}
            />
            <div className={styles["flex-container"]}>
                <img src="/images/logo.png" className={styles["logo"]}></img>
                <Heading style={{ marginBottom: size.height > 750 ? "2rem" : "1rem" }} />
                <Clickable>
                    <button
                        className={styles.child}
                        onClick={() =>
                            router.push("/user/play?type=game-of-the-day")
                        }
                    >
                        {translations("gamemode.Mode1")}
                    </button>
                </Clickable>
                <Clickable>
                    <button
                        className={styles.child}
                        onClick={() =>
                            router.push("/user/play?type=quick-game")
                        }
                    >
                        {translations("gamemode.Mode2")}
                    </button>
                </Clickable>
                <Clickable>
                    <button
                        className={styles.child}
                        onClick={() =>
                            router.push("/user/play?type=latest-show")
                        }
                    >
                        {translations("gamemode.Mode3")}
                    </button>
                </Clickable>
                <Clickable>
                    <button
                        className={styles.child}
                        onClick={() => router.push("/user/select-categories")}
                    >
                        {translations("gamemode.Mode4")}
                    </button>
                </Clickable>
            </div>
            <div className={styles["footer-wrapper"]}>
                <Clickable>
                    <button className={styles["footer-container"]} onClick={handleListoftheBest}>
                        <img
                            src="/images/user-icon.png"
                            className="icon"
                            style={{ marginLeft: "10px" }}
                        ></img>
                        <span className={styles.username}>{backend.globals.username}</span>

                        <div

                            className={styles["trophy-area"]}
                        >
                            <div>{trophyCount}</div>
                            <img src="/images/pokal.png" className="icon"></img>
                        </div>

                    </button>
                </Clickable>
            </div>
        </main>
    );
}
