"use client";
import InputField from "@/components/InputField";
import styles from "./page.module.css";
import { useState } from "react";
import validator from "validator";
import Header from "@/components/Header";
import { useTranslation } from "react-multi-lang";
import useBackend from "@/backend/useBackend";
import { useRouter, useSearchParams } from "next/navigation";
import FooterButtons from "@/components/FooterButtons";

export default function Page() {
    const searchParams = useSearchParams();
    const backend = useBackend();
    const [placeOfBirth, setPlaceOfBirth] = useState("");
    const [favouriteColor, setFavouriteColor] = useState("");
    const [motherName, setMotherName] = useState("");
    const [errorId, setErrorId] = useState(false);

    const t = useTranslation();
    const router = useRouter();

    async function onSubmit() {
        if (
            validator.isEmpty(favouriteColor) ||
            validator.isEmpty(placeOfBirth) ||
            validator.isEmpty(motherName)
        ) {
            setErrorId("error_id.specify_error");
            return;
        }
        if (backend.globals.authToken) {
            const result = await backend.setSecurityQuestions(
                favouriteColor,
                motherName,
                placeOfBirth
            );

            if (result.success) {
                setErrorId(false);
                router.push("/user/homepage");
            } else {
                setErrorId("error_id." + result.error_id);
            }
        } else {
            const result = await backend.validateSecurityQuestions(
                searchParams.get("userIdentity"),
                favouriteColor,
                motherName,
                placeOfBirth
            );

            if (result.success) {
                setErrorId(false);
                router.push("/account/password-reset");
            } else {
                setErrorId("error_id." + result.error_id);
            }
        }
    }

    async function onBack() {
        if (backend.globals.authToken) {
            const result = await backend.deleteAccount();
            if (result.success) {
                router.push("/account/sign-up");
            }
        } else {
            router.push("/account/log-in");
        }
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
                    <InputField
                        label={t("security_ques.birthplace")}
                        type="user_identity"
                        name="user_identity"
                        value={placeOfBirth}
                        onChange={(e) => setPlaceOfBirth(e.target.value)}
                    />
                    <InputField
                        label={t("security_ques.fav_color")}
                        type="favourite_color"
                        name="favourite_color"
                        value={favouriteColor}
                        onChange={(e) => setFavouriteColor(e.target.value)}
                    />
                    <InputField
                        label={t("security_ques.mother_name")}
                        type="mother_name"
                        name="mother_name"
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
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

                    <FooterButtons onBack={onBack} onNext={onSubmit} />
                </div>
            </div>
        </>
    );
}
