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
    const [identity, setIdentity] = useState("");
    const [password, setPassword] = useState("");
    const [errorId, setErrorId] = useState(false);

    const t = useTranslation();
    const router = useRouter();

    async function onSubmit() {
        if (validator.isEmpty(password) || validator.isEmpty(identity)) {
            setErrorId("error_id.specify_error");
            return;
        }
        const result = await backend.login(identity, password);

        if (result.success) {
            setErrorId(false);
            if (result.is_admin) {
                router.push("/admin/admin-menu");
            } else {
                router.push("/user/homepage");
            }
        } else {
            setErrorId("error_id." + result.error_id);
        }
    }

    function handleResetPassword() {
        if (validator.isEmpty(identity)) {
            setErrorId("error_id.password_reset_needs_user_identity_error");
            return;
        }
        router.push("/account/security-questions?userIdentity=" + identity);
    }

    return (
        <>
            <Header
                hideAccountInfo={true}
                hideAdminAccountInfo={true}
                hideQuitButton={true}
            />
            <div className={styles.form}>
                <div className={styles.login}>
                    <img src="/images/logo-lock.png" className={styles.logo} />
                    <h1 className={styles.h1}>log-in</h1>
                    <InputField
                        label={t("account.email_username")}
                        type="identity"
                        name="identity"
                        value={identity}
                        onChange={(e) => {
                            if (e.target.value === "im a gangster") {
                                backend.globals.setSecretType("gangster");
                            } else if (e.target.value === "let gandalf dance") {
                                backend.globals.setSecretType("gandalf");
                            } else if (
                                e.target.value === "i love the moonlight"
                            ) {
                                backend.globals.setSecretType("moonlight");
                            }
                            setIdentity(e.target.value);
                        }}
                    />
                    <InputField
                        label={t("account.password")}
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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

                    <div className={styles.link} onClick={handleResetPassword}>
                        {t("account.forgot_password")}
                    </div>

                    <BasicButton
                        text="Log In"
                        style={{ margin: "1rem 0rem" }}
                        onClick={onSubmit}
                        fitContent
                    />

                    <Link href="/account/sign-up" className={styles.link}>
                        {t("account.no_account")} Sign Up
                    </Link>
                </div>
            </div>
        </>
    );
}
