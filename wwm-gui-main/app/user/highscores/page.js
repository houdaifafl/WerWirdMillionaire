"use client";
import styles from "./page.module.css";
import HighscoreTable from "@/components/HighscoreTable";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-multi-lang";
import useProtection from "@/backend/useProtection";
import useBackend from "@/backend/useBackend";

export default function Page() {
    useProtection({ requiresUserLoggedIn: true });
    const backend = useBackend();
    const router = useRouter();
    const t = useTranslation();

    return (
        <div className={styles.highscores}>
            <Header
                style={{ position: "relative" }}
                hideAdminAccountInfo={true}
                hideQuitButton={true}
            />
            <HighscoreTable
                username={backend.globals.username}
                onMainMenuClick={() => router.push("/user/homepage")}
                style={{ paddingBottom: "2rem" }}
            />
        </div>
    );
}
