"use client";
import styles from "./HighscoreUserResult.module.css";

export default function HighscoreUserResult({ rank, username, score, player }) {
	function rankTo3Digits(rank) {
		if (rank < 10) return `00${rank}`;
		else if (rank < 100) return `0${rank}`;
		else return rank;
	}

	return (
		<div
			className={`${styles.highscoreUserResult} ${
				rank === 1 ? styles.first : ""
			} ${player ? styles.player : ""}`}
		>
			<div>
				<span className={styles.rank}>{rankTo3Digits(rank)}</span>
				<span className={styles.username}>{username}</span>
			</div>
			<span className={styles.score}>{score.toLocaleString()} €</span>
		</div>
	);
}
