"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-multi-lang";
import styles from "./FooterButtons.module.css";
import "app/globals.css";
import Clickable from "@/popups/Clickable";

export default function NextBackButtons({
	onBack,
	onNext,
	leftButtonText,
	rightButtonText,
}) {
	const router = useRouter();
	const translations = useTranslation();
	const handleBack = () => {
		if (typeof onBack === "string") {
			router.push(onBack);
		} else if (typeof onBack === "function") {
			onBack();
		}
	};
	const handleNext = () => {
		if (typeof onNext === "string") {
			router.push(onNext);
		} else if (typeof onNext === "function") {
			onNext();
		}
	};

	// adapt classNames for module.css
	return (
		<div className={styles["btn-group"]}>
			<Clickable style={{ position: "relative" }}>
				<button
					className={styles["zurueck-button"]}
					onClick={handleBack}
				>
					{leftButtonText || translations("button.zurück")}
				</button>
			</Clickable>
			<Clickable style={{ position: "relative" }}>
				<button
					className={styles["weiter-button"]}
					onClick={handleNext}
				>
					{rightButtonText || translations("button.weiter")}
				</button>
			</Clickable>
		</div>
	);
}
