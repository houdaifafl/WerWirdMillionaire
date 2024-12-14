"use client";
import InputField from "@/components/InputField";
import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";
import BasicButton from "@/components/BasicButton";
import validator from "validator";
import Header from "@/components/Header";
import { useTranslation } from "react-multi-lang";
import useBackend from "@/backend/useBackend";
import { useRouter } from "next/navigation";
import useProtection from "@/backend/useProtection";

export default function Page() {
    useProtection({ requiresUserLoggedOut: true });
    const backend = useBackend();
    const [surname, setSurname] = useState("");
    const [lastname, setLastname] = useState("");
    const [birthday, setBirthday] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [errorId, setErrorId] = useState(false);

    const t = useTranslation();
    const router = useRouter();

    async function onSubmit() {
        if (password !== passwordRepeat) {
            setErrorId("error_id.password_notmatch");
            return;
        }

        const result = await backend.signup(
            surname,
            lastname,
            email,
            password,
            birthday
        );

        if (result.success) {
            setErrorId(null);
            router.push("/account/security-questions");
        } else {
            setErrorId("error_id." + result.error_id);
        }
    }

    return (
        <div style={{ width: "100%", height: "100%", position: "relative", overflowY: "scroll" }}>
            <Header
                hideAccountInfo={true}
                hideAdminAccountInfo={true}
                hideQuitButton={true}
            />
            <div className={styles.form}>
                <div className={styles.login}>
                    <img src="/images/logo-lock.png" className={styles.logo} />
                    <InputField
                        label={t("account.vorname")}
                        type="text"
                        name="surname"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        small
                    />
                    <InputField
                        label={t("account.name")}
                        type="text"
                        name="lastname"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        small
                    />
                    <InputField
                        label={t("account.birthday")}
                        type="date"
                        name="birthday"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        small
                    />
                    <InputField
                        label={t("account.email")}
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        small
                    />
                    <InputField
                        label={t("account.password")}
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        small
                    />
                    <InputField
                        label={t("account.repeat_password")}
                        type="password"
                        name="passwordRepeat"
                        value={passwordRepeat}
                        onChange={(e) => setPasswordRepeat(e.target.value)}
                        small
                    />

                    <div className={styles.error}>
                        {errorId ? (
                            <>
                                <img
                                    className={styles.warningIcon}
                                    src="/images/warning.png"
                                />
                                {t(errorId)}
                            </>
                        ) : (
                            ""
                        )}
                    </div>

                    <BasicButton
                        text="Sign Up"
                        style={{ margin: "1rem 0rem" }}
                        onClick={onSubmit}
                        fitContent
                    />

                    <Link href="/account/log-in" className={styles.link}>
                        {t("account.with_account")} Log In
                    </Link>
                </div>
            </div>
        </div>
    );
}
