"use client";
import Overlay from "./Overlay";
import { useTranslation } from "react-multi-lang";
import styles from "./GameInstructions.module.css";
import Clickable from "./Clickable";

export default function ({ visible, onClose }) {
	const t = useTranslation();

	return (
		<Overlay visible={visible}>
			<div className={styles.popup}>
				<div className={styles.title}>{t("instructions.title")}</div>
				<div className={styles.section}>
					<h2>{t("instructions.quickgame")}</h2>
					<p>{t("instructions.quickgameexp")}</p>
				</div>
				<div className={`${styles.section} ${styles.colored}`}>
					<h2>{t("instructions.lastprogramm")}</h2>
					<p>{t("instructions.lastprogrammexp")}</p>
				</div>
				<div className={styles.section}>
					<h2>{t("instructions.gameoftheday")}</h2>
					<p>{t("instructions.gameofthedayexp")}</p>
				</div>
				<div className={`${styles.section} ${styles.colored}`}>
					<h2>{t("instructions.trainingmode")}</h2>
					<p>{t("instructions.trainingmodeexp")}</p>
				</div>
				<div className={`${styles.section}`}>
					<h2>{t("instructions.joker")}</h2>
					<p>{t("instructions.jokerexp")}</p>
				</div>
				<div className={`${styles.section} ${styles.colored}`}>
					<h2>{t("instructions.end")}</h2>
					<p>{t("instructions.endexp")}</p>
				</div>
				<Clickable>
					<button onClick={onClose} className={styles.closeButton}>
						OK
					</button>
				</Clickable>
			</div>
		</Overlay>
	);
}
