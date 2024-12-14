"use client";
import styles from "./ScoreList.module.css";

const scores = [
	{ index: 14, text: "€ 1.000.000" },
	{ index: 13, text: "€ 500.000" },
	{ index: 12, text: "€ 125.000" },
	{ index: 11, text: "€ 64.000" },
	{ index: 10, text: "€ 32.000" },
	{ index: 9, text: "€ 16.000" },
	{ index: 8, text: "€ 8.000" },
	{ index: 7, text: "€ 4.000" },
	{ index: 6, text: "€ 2.000" },
	{ index: 5, text: "€ 1.000" },
	{ index: 4, text: "€ 500" },
	{ index: 3, text: "€ 300" },
	{ index: 2, text: "€ 200" },
	{ index: 1, text: "€ 100" },
	{ index: 0, text: "€ 50" },
];

export default function ScoreList({ currentIndex, correct, disabled }) {
	const scoreItems = scores.map((score) => (
		<div
			className={`${styles.scoreItem} ${
				currentIndex === score.index ? styles.currentScore : ""
			} ${disabled ? styles.disabled : !correct ? styles.wrong : ""} `}
			key={score.index}
		>
			{/*<span className={styles.scoreIndex}>{score.index+1}:</span>*/}
			<span className={styles.scoreText}>{score.text}</span>
		</div>
	));

	return <div className={styles.scoreList}>{scoreItems}</div>;
}
