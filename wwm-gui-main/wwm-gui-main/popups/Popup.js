"use client";
import styles from "./Popup.module.css";
import Overlay from "./Overlay";
import Clickable from "./Clickable";

export default function Popup({
	text,
	leftButtonText,
	rightButtonText,
	onLeftButtonClick,
	onRightButtonClick,
	visible,
}) {
	return (
		<Overlay visible={visible}>
			<div className={styles.popup}>
				<div className={styles.popupText}>{text}</div>
				<div className={styles.buttonArea}>
					<div className={styles.leftButton}>
						<Clickable>
							<button
								className={styles.leftButton}
								onClick={onLeftButtonClick}
							>
								{leftButtonText}
							</button>
						</Clickable>
					</div>
					<div className={styles.rightButton}>
						<Clickable>
							<button
								className={styles.rightButton}
								onClick={onRightButtonClick}
							>
								{rightButtonText}
							</button>
						</Clickable>
					</div>
				</div>
			</div>
		</Overlay>
	);
}
