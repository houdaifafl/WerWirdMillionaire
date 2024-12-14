"use client";
import styles from "./Game.module.css";
import JokerOutputContainer from "./JokerOutputContainer";
import Joker from "./Joker";
import { getLanguage, useTranslation } from "react-multi-lang";
import Answer from "./Answer";
import ScoreList from "./ScoreList";
import { useRouter } from "next/navigation";
import useGame from "@/backend/useGame";
import ContinueWithoutScoringPopup from "@/popups/ContinueWithoutScoringPopup";
import Loading from "./Loading";
import Popup from "@/popups/Popup";
import { useEffect } from "react";
import OKPopup from "@/popups/OKPopup";
import Clickable from "@/popups/Clickable";
import Heading from "./Heading";

export default function Game({ type, categories, cancelGame }) {
    if (!type) {
        throw new Error("No game type passed!");
    }

    const router = useRouter();
    const t = useTranslation();
    const game = useGame(type, categories, 1500);

    useEffect(() => {
        if (cancelGame) {
            game.end();
        }
    }, [cancelGame]);

    if (game.gameState === "loading") {
        return (
            <>
                <OKPopup
                    visible={Boolean(game.errorId)}
                    text={t("error_id." + game.errorId)}
                    buttonText={"OK"}
                    onClick={() => router.push("/user/homepage")}
                />
                <Loading />
            </>
        );
    } else if (game.gameState === "running") {
        return (
            <div className={styles.answerArea}>
                <ContinueWithoutScoringPopup
                    visible={game.showContinueWithoutScoringPopup}
                    onEnd={game.end}
                    onContinue={game.continueWithoutScoring}
                />
                <div className={styles.topWrapper}>
                    {!game.displayResultOfQuestion || type === "train" ? (
                        <div className={styles.jokerArea}>
                            <JokerOutputContainer
                                showOutput={
                                    game.jokerMessage || game.audienceVoting
                                }
                                mode={game.jokerMessage ? "tip" : "voting"}
                                tip={game.jokerMessage}
                                voting={game.audienceVoting}
                            />
                            <div className={styles.jokerBar}>
                                <Joker
                                    icon="/images/joker-5050.png"
                                    onSelect={game.useFiftyFiftyJoker}
                                    used={game.usedFiftyFiftyJoker}
                                />
                                <Joker
                                    icon="/images/joker-anruf.png"
                                    onSelect={game.usePhoneJoker}
                                    used={game.usedPhoneJoker}
                                />
                                <Joker
                                    icon="/images/joker-person.png"
                                    onSelect={game.usePersonFromAudienceJoker}
                                    used={game.usedPersonFromAudienceJoker}
                                />
                                <Joker
                                    icon="/images/joker-publikum.png"
                                    onSelect={game.useAudienceJoker}
                                    used={game.usedAudienceJoker}
                                />
                            </div>
                        </div>
                    ) : (
                        <ScoreList
                            currentIndex={game.questionIndex}
                            correct={
                                game.selectedAnswerIndex ===
                                game.correctAnswerIndex
                            }
                            disabled={game.scoringDisabled}
                        />
                    )}
                </div>
                <div className={styles.difficulty}>{game.difficulty} €</div>
                <h1 className={styles.question}>{game.question}</h1>
                <div className={styles.answers}>
                    {game.answers.map((answer, index) => (
                        <Answer
                            text={answer}
                            key={index}
                            index={index}
                            correct={index === game.correctAnswerIndex}
                            onSelect={() => game.selectAnswer(index)}
                            displayResult={
                                game.displayResultOfQuestion &&
                                (index === game.correctAnswerIndex ||
                                    index === game.selectedAnswerIndex)
                            }
                            disabled={
                                answer === "" ||
                                game.selectedAnswerIndex !== null
                            }
                        />
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div className={styles.resultScreen}>
                <img src="/images/logo.png" className={styles.logo} />
                <div className={styles.headingWrapper}>
                    <Heading />
                </div>
                {type === "train" ? (
                    <div className={styles.resultSummary}>
                        <div className={styles.heading}>{t("trainResult")}</div>
                        <div className={styles.value}>
                            ✅ {game.correctAnswers}
                        </div>
                        <div className={styles.subtext}>
                            {t("subtext.training")}
                        </div>
                    </div>
                ) : (
                    <div className={styles.resultSummary}>
                        <div className={styles.heading}>{t("score")}</div>
                        <div className={styles.value}>€ {game.score}</div>
                        <div className={styles.subtext}>{t(game.subtext)}</div>
                    </div>
                )}
                <Clickable>
                    <button
                        className={styles.menuButton}
                        onClick={() => router.push("/user/homepage")}
                    >
                        {t("menu")}
                    </button>
                </Clickable>
            </div>
        );
    }
}
