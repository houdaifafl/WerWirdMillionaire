"use client";

import HashLoader from "react-spinners/HashLoader";
import styles from "./Loading.module.css";

export default function Loading() {
	return (
		<div className={styles.loading}>
			<HashLoader color="#00b1aa" size={150} />;
		</div>
	);
}
