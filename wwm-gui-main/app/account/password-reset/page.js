"use client";
import InputField from "@/components/InputField";
import styles from "./page.module.css";
import Link from "next/link";
import { useState } from "react";
import BasicButton from "@/components/BasicButton";
import validator from "validator";
import Loading from "@/components/Loading";
import Header from "@/components/Header";
import { useTranslation } from "react-multi-lang";
import useBackend from "@/backend/useBackend";
import { useRouter, useSearchParams } from "next/navigation";
import FooterButtons from "@/components/FooterButtons";
import useProtection from "@/backend/useProtection";

export default function Page() {
	useProtection({ requiresUserLoggedOut: true });
	const searchParams = useSearchParams();
	const backend = useBackend();
	const [password, setPassword] = useState("");
	const [repeatPassword, setPasswordRepeat] = useState("");
	const [errorId, setErrorId] = useState(false);

	const t = useTranslation();
	const router = useRouter();

	async function onSubmit() {
		if (validator.isEmpty(repeatPassword) || validator.isEmpty(password)) {
			setErrorId("error_id.specify_error");
			return;
		}

		if (password !== repeatPassword) {
			setErrorId("error_id.password_notmatch");
			return;
		}
		const result = await backend.resetPassword(password);

		if (result.success) {
			if (result.is_admin) {
				router.push("/admin/admin-menu");
			} else {
				router.push("/user/homepage");
			}
			setErrorId(false);
		} else {
			setErrorId("error_id." + result.error_id);
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
						label={t("account.new_password")}
						type="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputField
						label={t("account.repeat_password")}
						type="password"
						name="password_repeat"
						value={repeatPassword}
						onChange={(e) => setPasswordRepeat(e.target.value)}
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

					<FooterButtons
						onBack={() => router.push("/account/log-in")}
						onNext={onSubmit}
					/>
				</div>
			</div>
		</>
	);
}
