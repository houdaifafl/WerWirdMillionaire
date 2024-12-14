"use client";
import "globals";
import React, { useState } from "react";
import styles from "./add-question.module.css";
import Header from "components/Header";
import FooterButtons from "@/components/FooterButtons";
import CancelPopup from "@/popups/CancelPopup";
import InputField from "@/components/InputField";
import { useTranslation } from "react-multi-lang";
import { useRouter } from "next/navigation";
import useBackend from "@/backend/useBackend";
import useProtection from "@/backend/useProtection";

export default function AddQuestion() {
    useProtection({ requiresAdminLoggedIn: true });
    const translation = useTranslation();
    const router = useRouter();
    const backend = useBackend();
    const [showPopup, setShowPopup] = useState(false);
    const [errorId, setErrorId] = useState(false);
    const handleBack = () => {
        setShowPopup(!showPopup);
    };

    // implementation of logic to add new ques to database
    const handleNext = async () => {
        const result = await backend.addQuestion({
            question: {
                en: ques_en,
                de: ques_de,
            },
            answers: [
                {
                    en: correct_ans_en,
                    de: correct_ans_de,
                },
                {
                    en: ans2_en,
                    de: ans2_de,
                },
                {
                    en: ans3_en,
                    de: ans3_de,
                },
                {
                    en: ans4_en,
                    de: ans4_de,
                },
            ],
            category: category,
            difficulty: difficulty,
        });
        if (result.success) {
            setErrorId(false);
            router.push("/admin/admin-menu");
        }
        else if (result.error_id === "auth_error") {
            await backend.endSession();
        }
        else {
            setErrorId("error_id." + result.error_id);
        }
    };

    const [ques_en, setQuestionEn] = useState("");
    const [ques_de, setQuestionDe] = useState("");
    const [correct_ans_en, setCorrectAnswerEn] = useState("");
    const [correct_ans_de, setCorrectAnswerDe] = useState("");
    const [ans2_en, setAnswer2En] = useState("");
    const [ans2_de, setAnswer2De] = useState("");
    const [ans3_en, setAnswer3En] = useState("");
    const [ans3_de, setAnswer3De] = useState("");
    const [ans4_en, setAnswer4En] = useState("");
    const [ans4_de, setAnswer4De] = useState("");
    const [category, setCategory] = useState("food");
    const [difficulty, setDifficulty] = useState(50);

    return (
        <main style={{ width: "100%", height: "100%" }}>
            <Header
                hideAccountInfo={true}
                hideGameInstructionsButton={true}
                hideQuitButton={true}
                isRelative={true}
            />
            <div className={styles["container-add"]}>
                <img
                    src="/images/admin-fragen.png"
                    style={{ width: "90px", height: "90px" }}
                />
                <div style={{ fontSize: "30px" }}>
                    {translation("admin_page.add_ques")}
                </div>
                <form className={styles.form}>
                    <div className={styles.section}>
                        <InputField
                            label={translation("admin_page.question")}
                            style={{ fontSize: "20px" }}
                            type={"text"}
                            value={ques_de}
                            onChange={(e) => setQuestionDe(e.target.value)}
                            small={true}
                            greyLabel={true}
                            sublabel={translation("admin_page.de")}
                        />
                        <InputField
                            type={"text"}
                            value={ques_en}
                            onChange={(e) => setQuestionEn(e.target.value)}
                            small={true}
                            greyLabel={true}
                            sublabel={translation("admin_page.en")}
                        />
                    </div>
                    <div className={styles.section}>
                        <InputField
                            label={translation("admin_page.correct_ans")}
                            style={{ fontSize: "20px" }}
                            type={"text"}
                            value={correct_ans_de}
                            onChange={(e) => setCorrectAnswerDe(e.target.value)}
                            small={true}
                            greyLabel={true}
                            sublabel={translation("admin_page.de")}
                        />
                        <InputField
                            type={"text"}
                            value={correct_ans_en}
                            onChange={(e) => setCorrectAnswerEn(e.target.value)}
                            small={true}
                            greyLabel={true}
                            sublabel={translation("admin_page.en")}
                        />
                    </div>
                    <div className={styles.section}>
                        <InputField
                            label={`${translation("admin_page.answer")} ${2}`}
                            style={{ fontSize: "20px" }}
                            type={"text"}
                            value={ans2_de}
                            onChange={(e) => setAnswer2De(e.target.value)}
                            small={true}
                            greyLabel={true}
                            sublabel={translation("admin_page.de")}
                        />
                        <InputField
                            type={"text"}
                            value={ans2_en}
                            onChange={(e) => setAnswer2En(e.target.value)}
                            small={true}
                            greyLabel={true}
                            sublabel={translation("admin_page.en")}
                        />
                    </div>
                    <div className={styles.section}>
                        <InputField
                            label={`${translation("admin_page.answer")} ${3}`}
                            style={{ fontSize: "20px" }}
                            type={"text"}
                            value={ans3_de}
                            onChange={(e) => setAnswer3De(e.target.value)}
                            small={true}
                            greyLabel={true}
                            sublabel={translation("admin_page.de")}
                        />
                        <InputField
                            type={"text"}
                            value={ans3_en}
                            onChange={(e) => setAnswer3En(e.target.value)}
                            small={true}
                            greyLabel={true}
                            sublabel={translation("admin_page.en")}
                        />
                    </div>
                    <div className={styles.section}>
                        <InputField
                            label={`${translation("admin_page.answer")} ${4}`}
                            style={{ fontSize: "20px" }}
                            type={"text"}
                            value={ans4_de}
                            onChange={(e) => setAnswer4De(e.target.value)}
                            small={true}
                            greyLabel={true}
                            sublabel={translation("admin_page.de")}
                        />
                        <InputField
                            type={"text"}
                            value={ans4_en}
                            onChange={(e) => setAnswer4En(e.target.value)}
                            small={true}
                            greyLabel={true}
                            sublabel={translation("admin_page.en")}
                        />
                    </div>
                    <div className={styles.section}>
                        <label className={styles.label}>
                            {translation("admin_page.category")}
                        </label>
                        <select
                            value={category}
                            className={styles.select}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="food">
                                {translation("categories.essen")}
                            </option>
                            <option value="film">
                                {translation("categories.film")}
                            </option>
                            <option value="geography">
                                {translation("categories.geografie")}
                            </option>
                            <option value="history">
                                {translation("categories.geschichte")}
                            </option>
                            <option value="literature">
                                {translation("categories.literatur")}
                            </option>
                            <option value="music">
                                {translation("categories.musik")}
                            </option>
                            <option value="pun">
                                {translation("categories.wortspiele")}
                            </option>
                        </select>
                    </div>
                    <div className={styles.section}>
                        <label className={styles.label}>
                            {translation("admin_page.difficulty")}
                        </label>
                        <select
                            value={difficulty}
                            className={styles.select}
                            onChange={(e) => setDifficulty(e.target.value)}
                        >
                            <option value={50}>50 €</option>
                            <option value={100}>100 €</option>
                            <option value={200}>200 €</option>
                            <option value={300}>300 €</option>
                            <option value={500}>500 €</option>
                            <option value={1000}>1.000 €</option>
                            <option value={2000}>2.000 €</option>
                            <option value={4000}>4.000 €</option>
                            <option value={8000}>8.000 €</option>
                            <option value={16000}>16.000 €</option>
                            <option value={32000}>32.000 €</option>
                            <option value={64000}>64.000 €</option>
                            <option value={125000}>125.000 €</option>
                            <option value={500000}>500.000 €</option>
                            <option value={1000000}>1 Million €</option>
                        </select>
                    </div>
                    {errorId ? (
                        <div className={`${styles.section} ${styles.error}`}>
                            <img className={styles.warningIcon} src="/images/warning.png" />
                            {translation(errorId)}
                        </div>
                    ) : ("")}
                </form>
            </div>
            <CancelPopup
                onCancel={() => router.push("/admin/admin-menu")}
                onStay={() => setShowPopup(!showPopup)}
                visible={showPopup}
            />
            <FooterButtons onBack={handleBack} onNext={handleNext} />
        </main>
    );
}
