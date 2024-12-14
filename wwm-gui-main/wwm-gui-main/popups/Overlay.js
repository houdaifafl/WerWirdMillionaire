"use client";
import { useEffect } from "react";
import styles from "./Overlay.module.css";

export default function Overlay({ visible, children }) {
	useEffect(() => {
		if (visible) {
			document.body.style.overflowY = "hidden";
		} else {
			document.body.style.overflowY = "auto";
		}
	}, [visible]);
	return (
		<>
			<div
				className={`${styles.overlay} ${
					visible ? styles.visible : styles.hidden
				}`}
			></div>
			<div
				className={`${styles.popupWrapper} ${
					visible ? styles.visible : styles.hidden
				}`}
			>
				{children}
			</div>
		</>
	);
}
