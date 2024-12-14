"use client";
import React, { useEffect, useState } from "react";
import styles from "./admin-menu.module.css";
import Header from "/components/Header";
import { useRouter } from "next/navigation";
import Clickable from "@/popups/Clickable";
import useBackend from "@/backend/useBackend";
import { useTranslation, getLanguage } from "react-multi-lang";
import useProtection from "@/backend/useProtection";

export default function Page() {
    useProtection({ requiresAdminLoggedIn: true });
    const router = useRouter();
    const backend = useBackend();
    const [questions, setQuestions] = useState([]);
    const t = useTranslation();

    async function loadQuestions() {
        const result = await backend.getAllQuestions();
        if (result.success) {
            setQuestions(result.questions);
        } else {
            console.error(result.error_id + " : " + result.error_message);
        }
    }

    useEffect(() => {
        loadQuestions();
    }, []);

    async function handleLogout() {
        const result = await backend.logout();
        if (result.success) {
            router.push("/account/log-in");
        }
    }

    // to perform any necessary logic before navigating to the edit page
    const handleEditQuestion = (question) => {
        backend.selectQuestion(question);
        router.push("/admin/edit-question");
    };

    return (
        <main className={styles.main}>
            <Header
                hideAccountInfo={true}
                hideGameInstructionsButton={true}
                onQuitSelected={handleLogout}
                isRelative={true}
            />
            <div className={styles["main-container"]}>
                <div className={styles["questions-container"]}>
                    {questions.map((question) => (
                        <div
                            key={question.id}
                            className={styles["question-container"]}
                        >
                            <div className={styles.question}>
                                {question.question[getLanguage()]}
                            </div>
                            <div
                                className={`${styles["text-button"]} ${styles.category}`}
                            >
                                {t(`categories.${question.category}`)}
                            </div>
                            <Clickable>
                                <button
                                    className={styles["text-button"]}
                                    onClick={() => handleEditQuestion(question)}
                                >
                                    <img
                                        src="/images/bearbeiten.png"
                                        className={styles.icon}
                                    />
                                </button>
                            </Clickable>
                        </div>
                    ))}
                </div>
                <Clickable
                    style={{ position: "relative", marginBottom: "10px" }}
                >
                    <button
                        className={styles["icon-container"]}
                        onClick={() => router.push("/admin/add-question")}
                    >
                        <img src="/images/plus.png" className={styles.icon} />
                    </button>
                </Clickable>
            </div>
        </main>
    );
}
