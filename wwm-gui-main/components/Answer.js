"use client";
import { useAudioPlayer, useGlobalAudioPlayer } from "react-use-audio-player";
import styles from "./Answer.module.css";
import { useEffect } from "react";

function indexNumberToIndexLetter(index) {
	return String.fromCharCode(65 + index);
}

export default function Answer({
	index,
	text,
	correct,
	disabled,
	onSelect,
	displayResult,
}) {
	const { paused } = useGlobalAudioPlayer();
	const hoverSound = useAudioPlayer();

	useEffect(() => {
		hoverSound.load("/sound/hover.wav", {
			initialVolume: 0.5,
		});
	}, []);

	function handleHover() {
		if (!paused) hoverSound.play();
	}

	function handleClick() {
		if (disabled) return;
		onSelect();
	}

	return (
		<button
			className={`${styles.answer} ${
				displayResult ? (correct ? styles.correct : styles.wrong) : ""
			} ${disabled ? styles.disabled : ""}`}
			onClick={handleClick}
			onMouseEnter={handleHover}
		>
			<span className={styles.index}>
				{indexNumberToIndexLetter(index)}:
			</span>
			<span className={styles.answerText}>{text}</span>
		</button>
	);
}
