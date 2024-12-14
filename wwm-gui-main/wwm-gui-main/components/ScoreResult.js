"use client";
import styles from "./ScoreResult.module.css";
import Image from "next/image";

export default function ScoreResult({ score }) {
	function scoreText(score) {
		if (score === 1000000) {
			return "Glückwunsch! Du bist virtueller Millionär!";
		} else if (score === 500000) {
			return "Glückwunsch! Du hast die halbe Million erreicht!";
		} else if (score === 125000) {
			return "Glückwunsch! Kein schlechter Gewinn!";
		} else if (score === 64000) {
			return "Glückwunsch! Du hast die 64.000€ erreicht!";
		} else if (score === 32000) {
			return "Glückwunsch! Du hast die 32.000€ erreicht!";
		} else if (score === 16000) {
			return "Glückwunsch! Du hast die 16.000€ erreicht!";
		} else if (score === 8000) {
			return "Glückwunsch! Du hast die 8.000€ erreicht!";
		} else if (score === 4000) {
			return "Glückwunsch! Du hast die 4.000€ erreicht!";
		} else if (score === 2000) {
			return "Glückwunsch! Du hast die 2.000€ erreicht!";
		} else if (score === 1000) {
			return "Glückwunsch! Du hast die 1.000€ erreicht!";
		} else if (score === 500) {
			return "Schonmal nicht leer ausgegangen!";
		} else if (score === 300) {
			return "Es ist ein kleiner Gewinn!";
		} else if (score === 200) {
			return "Es ist ein kleiner Gewinn!";
		} else if (score === 100) {
			return "Naja, immerhin etwas gewonnen!";
		} else if (score === 50) {
			return "Ein ziemlich kleiner Gewinn!";
		} else {
			return "Schade! Du hast leider nichts gewonnen!";
		}
	}
	return (
		<div className={styles.scoreResult}>
			<div className={styles.heading}>Gewinnsumme</div>
			<div className={styles.main}>
				<span>€</span>
				<span>{score}</span>
			</div>
			<div className={styles.footer}>{scoreText(score)}</div>
		</div>
	);
}
