"use client";
import Clickable from "@/popups/Clickable";
import styles from "./Joker.module.css";
import { useState } from "react";

export default function Joker({ onSelect, icon, used }) {
	function handleClick() {
		if (used) return;
		else onSelect();
	}

	return (
		<Clickable>
			<div
				className={`${styles.joker} ${used ? styles.selected : ""}`}
				onClick={handleClick}
			>
				<img src={icon} />
			</div>
		</Clickable>
	);
}
