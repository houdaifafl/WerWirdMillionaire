"use client";
import edit_ques_styles from "./edit-question.module.css";
import styles from "../add-question/add-question.module.css";
import "globals";
import React, { useState } from "react";
import Header from "components/Header";
import FooterButtons from "@/components/FooterButtons";
import DeletePopup from "@/popups/DeletePopup";
import CancelPopup from "@/popups/CancelPopup";
import InputField from "@/components/InputField";
import Clickable from "@/popups/Clickable";
import { useTranslation } from "react-multi-lang";
import { useRouter } from "next/navigation";
import useBackend from "@/backend/useBackend";
import useProtection from "@/backend/useProtection";

export default function EditQuestion() {
    useProtection({ requiresAdminLoggedIn: true });
    const router = useRouter();


    const translation = useTranslation();
    const backend = useBackend();
    const [showDeletePopup, setDeletePopupVisible] = useState(false);
    const [showCancelPopup, setShowCancelPopup] = useState(false);
    const [errorId, setErrorId] = useState(false);
    if (!backend.globals.selectedQuestion) {
        router.push("../");
    }

    // implementation of logic to update existing ques in database
    const handleNext = async () => {
        const result = await backend.editQuestion({
            id: backend.globals.selectedQuestion.id,
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

    // implementation of logic to delete a question in database
    const OnDeleteQuestion = async () => {
        await backend.deleteQuestion(backend.globals.selectedQuestion.id);
        router.push("/admin/admin-menu");
    };

    const [ques_en, setQuestionEn] = useState(
        backend.globals.selectedQuestion?.question?.en || ""
    );
    const [ques_de, setQuestionDe] = useState(
        backend.globals.selectedQuestion?.question?.de || ""
    );
    const [correct_ans_en, setCorrectAnswerEn] = useState(
        backend.globals.selectedQuestion?.answers[0]?.en || ""
    );
    const [correct_ans_de, setCorrectAnswerDe] = useState(
        backend.globals.selectedQuestion?.answers[0]?.de || ""
    );
    const [ans2_en, setAnswer2En] = useState(
        backend.globals.selectedQuestion?.answers[1]?.en || ""
    );
    const [ans2_de, setAnswer2De] = useState(
        backend.globals.selectedQuestion?.answers[1]?.de || ""
    );
    const [ans3_en, setAnswer3En] = useState(
        backend.globals.selectedQuestion?.answers[2]?.en || ""
    );
    const [ans3_de, setAnswer3De] = useState(
        backend.globals.selectedQuestion?.answers[2]?.de || ""
    );
    const [ans4_en, setAnswer4En] = useState(
        backend.globals.selectedQuestion?.answers[3]?.en || ""
    );
    const [ans4_de, setAnswer4De] = useState(
        backend.globals.selectedQuestion?.answers[3]?.de || ""
    );
    const [category, setCategory] = useState(
        backend.globals.selectedQuestion?.category || ""
    );
    const [difficulty, setDifficulty] = useState(
        backend.globals.selectedQuestion?.difficulty || ""
    );

    return (
        <main
            style={{
                width: "100%",
                height: "100%",
            }}
        >
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
                    {translation("admin_page.edit_ques")}
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
                        <div
                            className={edit_ques_styles["list-icon-container"]}
                        >
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
                            <Clickable>
                                <button
                                    className={
                                        edit_ques_styles["icon-container"]
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setDeletePopupVisible(!showDeletePopup);
                                    }}
                                >
                                    <img
                                        src="/images/mull.png"
                                        className={edit_ques_styles.icon}
                                    />
                                </button>
                            </Clickable>
                        </div>
                    </div>
                    {errorId ? (
                        <div className={`${styles.section} ${styles.error}`}>
                            <img className={styles.warningIcon} src="/images/warning.png" />
                            {translation(errorId)}
                        </div>
                    ) : ("")}
                </form>
            </div>
            <DeletePopup
                onYes={OnDeleteQuestion}
                onNo={() => setDeletePopupVisible(!showDeletePopup)}
                popup_visible={showDeletePopup}
            />
            <CancelPopup
                onCancel={() => router.push("/admin/admin-menu")}
                onStay={() => setShowCancelPopup(!showCancelPopup)}
                visible={showCancelPopup}
            />
            <FooterButtons
                onBack={() => setShowCancelPopup(!showCancelPopup)}
                onNext={handleNext}
            />
        </main>
    );
}
