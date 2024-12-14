"use client";
import { useAudioPlayer, useGlobalAudioPlayer } from "react-use-audio-player";
import styles from "./Clickable.module.css";
import { useEffect } from "react";

export default function ({ children, disableHover, disableClick, style }) {
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
		if (!paused && !disableClick) clickSound.play();
	}

	function handleHover() {
		if (!paused && !disableHover) hoverSound.play();
	}

	return (
		<div
			className={styles.clickable}
			onClick={handleClick}
			onMouseEnter={handleHover}
			style={style}
		>
			{children}
		</div>
	);
}
