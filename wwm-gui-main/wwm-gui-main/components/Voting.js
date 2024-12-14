"use client";
import styles from "./Voting.module.css";
import { BarChart, Bar, XAxis, ResponsiveContainer } from "recharts";

export default function Voting({ voting }) {
	if (!voting) return <></>;

	const votingData = [
		{ option: "A", votes: voting[0] },
		{ option: "B", votes: voting[1] },
		{ option: "C", votes: voting[2] },
		{ option: "D", votes: voting[3] },
	];

	return (
		<div className={styles.voting}>
			<ResponsiveContainer
				style={{ maxWidth: "15rem" }}
				width="100%"
				height={120}
			>
				<BarChart data={votingData}>
					<Bar dataKey={"votes"} label="dfd" barSize={15} />
					<XAxis dataKey="option" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}
