"use client";
import { useTranslation } from "react-multi-lang";
import styles from "./JokerOutputContainer.module.css";
import Voting from "./Voting";
import Heading from "./Heading";

export default function JokerOutputContainer({
    tip,
    voting,
    showOutput,
    mode,
}) {
    const t = useTranslation();

    function generateOutput() {
        switch (mode) {
            case "tip":
                return <div className={styles.tip}>"{tip}"</div>;
            case "voting":
                return <Voting voting={voting} />;
        }
    }

    return (
        <div className={styles.containerWrapper}>
            {showOutput ? (
                <div className={styles.jokerOutputContainer}>
                    {generateOutput()}
                </div>
            ) : (
                <div className={styles.heading}>
                    <img src="/images/logo.png" />
                    <Heading />
                </div>
            )}
        </div>
    );
}
