"use client";
import styles from "./OKPopup.module.css";
import Overlay from "./Overlay";
import Clickable from "./Clickable";

export default function OKPopup({ text, buttonText, onClick, visible }) {
	return (
		<Overlay visible={visible}>
			<div className={styles.popup}>
				<div className={styles.popupText}>{text}</div>
				<Clickable>
					<button className={styles.button} onClick={onClick}>
						{buttonText}
					</button>
				</Clickable>
			</div>
		</Overlay>
	);
}
