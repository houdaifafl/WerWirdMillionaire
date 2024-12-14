"use client";
import { useTranslation } from "react-multi-lang";
import styles from "./ContinueWithoutScoringPopup.module.css";
import Overlay from "./Overlay";
import Clickable from "./Clickable";

export default function ContinueWithoutScoringPopup({
	visible,
	onContinue,
	onEnd,
}) {
	const t = useTranslation();

	function continuePlaying() {
		onContinue();
	}

	function endGame() {
		onEnd();
	}

	return (
		<Overlay visible={visible}>
			<div className={styles.popup}>
				<div className={styles.header}>
					<h1>{t("popup.oh_no")}</h1>
					<img src="/images/logo-fail.png" className={styles.img} />
				</div>

				<div className={styles.content}>
					{t("popup.play_without_winning")}
				</div>

				<div className={styles.footer}>
					<Clickable>
						<button
							className={styles.button}
							onClick={continuePlaying}
						>
							{t("button.weiterspielen")}
						</button>
					</Clickable>
					<Clickable>
						<button className={styles.button} onClick={endGame}>
							{t("button.beenden")}
						</button>
					</Clickable>
				</div>
			</div>
		</Overlay>
	);
}
