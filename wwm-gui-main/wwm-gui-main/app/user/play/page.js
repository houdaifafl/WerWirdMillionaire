"use client";
import styles from "./page.module.css";
import Game from "@/components/Game";
import Header from "@/components/Header";
import QuitGamePopup from "@/popups/QuitGamePopup";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-multi-lang";
import useProtection from "@/backend/useProtection";

export default function () {
	useProtection({ requiresUserLoggedIn: true });
	const [cancelGame, setCancelGame] = useState(false);
	const t = useTranslation();

	const searchParams = useSearchParams();

	const type = searchParams.get("type") || "quick-game";
	const categories = [
		searchParams.get("category1"),
		searchParams.get("category2"),
		searchParams.get("category3"),
		searchParams.get("category4"),
		searchParams.get("category5"),
		searchParams.get("category6"),
		searchParams.get("category7"),
		searchParams.get("category8"),
	];
	const [showQuitGamePopup, setShowQuitGamePopup] = useState(false);

	return (
		<div className={styles.content}>
			<QuitGamePopup
				visible={showQuitGamePopup}
				onYes={() => {
					setCancelGame(true);
					setShowQuitGamePopup(false);
				}}
				onNo={() => setShowQuitGamePopup(false)}
			/>
			<Header
				hideAdminAccountInfo={true}
				hideQuitButton={cancelGame}
				onQuitSelected={() => setShowQuitGamePopup(true)}
			/>
			<Game type={type} categories={categories} cancelGame={cancelGame} />
		</div>
	);
}
