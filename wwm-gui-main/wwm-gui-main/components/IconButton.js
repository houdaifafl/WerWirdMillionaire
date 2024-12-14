"use client";
import styles from "./IconButton.module.css";
import Image from "next/image";

export default function IconButton({ icon, onClick }) {
	return (
		<button className={styles.iconButton} onClick={onClick}>
			<Image src={icon} width={26} height={26} />
		</button>
	);
}
