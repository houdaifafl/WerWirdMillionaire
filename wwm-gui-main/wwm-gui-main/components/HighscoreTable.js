"use client";
import Clickable from "@/popups/Clickable";
import BasicButton from "./BasicButton";
import styles from "./HighscoreTable.module.css";
import HighscoreUserResult from "./HighscoreUserResult";
import { useEffect, useState } from "react";
import { useTranslation } from "react-multi-lang";
import useBackend from "@/backend/useBackend";

/**
 *
 * @param {{
 * 	username: string,
 * 	onMainMenuClick: () => void,
 * 	style: React.CSSProperties
 * }} param0
 * @returns
 */
export default function HighscoreTable({ username, onMainMenuClick, style }) {
    const t = useTranslation();
    const backend = useBackend();
    const [highscoreInterval, setHighscoreInterval] = useState("month");
    const [highscores, setHighscores] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [playerHighscore, setPlayerHighscore] = useState(500);
    const [playerRank, setPlayerRank] = useState(12);
    const pageSize = 10;

    async function loadHighscores() {
        let result;
        switch (highscoreInterval) {
            case "today":
                result = await backend.getDailyHighscores();
                break;
            case "week":
                result = await backend.getWeeklyHighscores();
                break;
            case "month":
                result = await backend.getMonthlyHighscores();
                break;
            default:
                throw new Error("Invalid highscore interval");
        }
        if (result.success) {
            setHighscores(result.highscores);
            setPlayerHighscore(result.playerHighscore);
            setPlayerRank(result.playerRank);
        }
    }

    useEffect(() => {
        loadHighscores();
    }, []);

    useEffect(() => {
        loadHighscores();
    }, [highscoreInterval]);

    function highscoresOfCurrentPage(page) {
        return highscores.slice(page * pageSize, (page + 1) * pageSize);
    }

    function loadHighscoresOfThisMonth() {
        setHighscoreInterval("month");
    }

    function loadHighscoresOfThisWeek() {
        setHighscoreInterval("week");
    }

    function loadHighscoresOfToday() {
        setHighscoreInterval("today");
    }

    function nextPage() {
        const next = pageNumber + 1;
        if (next * pageSize < highscores.length) {
            setPageNumber(next);
        }
    }

    function previousPage() {
        const previous = pageNumber - 1;
        if (previous >= 0) {
            setPageNumber(previous);
        }
    }

    function lastPage() {
        const last = highscores.length / pageSize;
        const lastFloored = Math.floor(last);
        if (lastFloored === last) setPageNumber(lastFloored - 1);
        else {
            setPageNumber(lastFloored);
        }
    }

    return (
        <div className={styles.highscoreTable} style={style}>
            <div className={styles.topBar}>
                <BasicButton
                    text={t("bestlist.heute")}
                    onClick={loadHighscoresOfToday}
                    highlighted={highscoreInterval === "today"}
                />
                <BasicButton
                    text={t("bestlist.woche")}
                    onClick={loadHighscoresOfThisWeek}
                    highlighted={highscoreInterval === "week"}
                />
                <BasicButton
                    text={t("bestlist.monat")}
                    onClick={loadHighscoresOfThisMonth}
                    highlighted={highscoreInterval === "month"}
                />
            </div>
            <h1 className={styles.h1}>{t("bestlist.title")}</h1>
            <div className={styles.results}>
                {highscoresOfCurrentPage(pageNumber).map((highscore, index) => (
                    <HighscoreUserResult
                        key={index}
                        username={highscore.username}
                        score={highscore.score}
                        rank={index + 1 + pageNumber * pageSize}
                        player={highscore.username === username}
                    />
                ))}
            </div>
            <div className={styles.controlBar}>
                <div className={styles.left}>
                    <Clickable>
                        <img
                            src="/images/darrow-left.png"
                            onClick={() => setPageNumber(0)}
                            className={styles.firstButton}
                        />
                    </Clickable>
                    <Clickable>
                        <img
                            src="/images/arrow-left.png"
                            onClick={previousPage}
                            className={styles.previousButton}
                        />
                    </Clickable>
                </div>
                <div className={styles.right}>
                    <Clickable>
                        <img
                            src="/images/arrow-right.png"
                            onClick={nextPage}
                            className={styles.nextButton}
                        />
                    </Clickable>
                    <Clickable>
                        <img
                            src="/images/darrow-right.png"
                            className={styles.lastButton}
                            onClick={lastPage}
                        />
                    </Clickable>
                </div>
            </div>
            <div className="full-width-container">
                <HighscoreUserResult
                    username={t("bestlist.du")}
                    score={playerHighscore}
                    rank={playerRank}
                    player
                />
            </div>

            <BasicButton
                text={t("bestlist.homepage")}
                onClick={onMainMenuClick}
                style={{
                    position: "fixed",
                    bottom: "0",
                    left: "0",
                    margin: "1rem",
                    boxSizing: "border-box",
                    width: "calc(100% - 2rem)",
                }}
            />
        </div>
    );
}
