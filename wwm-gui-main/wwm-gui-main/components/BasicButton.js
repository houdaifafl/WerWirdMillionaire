"use client";
import { useGlobalAudioPlayer, useAudioPlayer } from "react-use-audio-player";
import styles from "./BasicButton.module.css";
import { useEffect } from "react";

/**
 *
 * @param {{
 * 	text: string,
 * 	onClick: () => void,
 * 	highlighted: boolean,
 * 	style: React.CSSProperties
 * }} param0
 * @returns
 */
export default function BasicButton({
	text,
	onClick,
	highlighted,
	style,
	big,
	fitContent,
}) {
	const { paused } = useGlobalAudioPlayer();
	const hoverSound = useAudioPlayer();
	const clickSound = useAudioPlayer();

	useEffect(() => {
		hoverSound.load("/sound/hover.wav", {
			initialVolume: 0.5,
		});
		clickSound.load("/sound/click.wav");
	}, []);

	function handleClick() {
		if (!paused) clickSound.play();
		onClick();
	}

	function handleHover() {
		if (!paused) hoverSound.play();
	}

	return (
		<button
			className={`${styles.basicButton} ${
				highlighted ? styles.highlighted : ""
			} ${big ? styles.big : ""} ${fitContent ? styles.fitContent : ""}`}
			onClick={handleClick}
			onMouseEnter={handleHover}
			style={style}
		>
			{text}
		</button>
	);
}
