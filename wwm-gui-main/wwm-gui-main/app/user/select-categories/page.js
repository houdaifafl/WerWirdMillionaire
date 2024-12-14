"use client";
import React, { useState } from "react";
import { useTranslation } from "react-multi-lang";
import "globals";
import styles from "./categories.module.css";
import Header from "@/components/Header";
import FooterButtons from "@/components/FooterButtons";
import Clickable from "@/popups/Clickable";
import useProtection from "@/backend/useProtection";

export default function Page() {
	useProtection({ requiresUserLoggedIn: true });
	const translations = useTranslation();
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [themenCount, setThemenCount] = useState(0);

	const handleButtonClick = (categoryName) => {
		const isSelected = selectedCategories.includes(categoryName);

		if (isSelected) {
			setSelectedCategories(
				selectedCategories.filter((name) => name !== categoryName)
			);
			setThemenCount(themenCount - 1);
		} else {
			setSelectedCategories([...selectedCategories, categoryName]);
			setThemenCount(themenCount + 1);
		}
	};

	function categoriesQuery() {
		return selectedCategories
			.map((category, index) => `category${index + 1}=${category}`)
			.join("&");
	}

	return (
		<main className={styles["main"]}>
			<Header hideAdminAccountInfo={true} hideQuitButton={true} />
			<div>
				<div className={styles["flex-container"]}>
					<button className={styles.count}>
						<div>{translations("categories.themen")}</div>
						<div>{themenCount}/7</div>
					</button>
				</div>
				<div className={styles["flex-container"]}>
					<Clickable>
						<button
							className={`${styles["category-container"]} ${
								selectedCategories.includes("food")
									? `${styles.selected}`
									: ""
							}`}
							onClick={() => handleButtonClick("food")}
						>
							<div
								className={`${styles["thema-container"]} ${
									selectedCategories.includes("food")
										? `${styles.selected}`
										: ""
								}`}
							>
								<img
									src="/images/thema-essen.png"
									className={styles.thema}
								/>
							</div>
							{translations("categories.essen")}
						</button>
					</Clickable>
					<Clickable>
						<button
							className={`${styles["category-container"]} ${
								selectedCategories.includes("film")
									? `${styles.selected}`
									: ""
							}`}
							onClick={() => handleButtonClick("film")}
						>
							<div
								className={`${styles["thema-container"]} ${
									selectedCategories.includes("film")
										? `${styles.selected}`
										: ""
								}`}
							>
								<img
									src="/images/thema-film.png"
									className={styles.thema}
								/>
							</div>
							{translations("categories.film")}
						</button>
					</Clickable>
				</div>
				<div className={styles["flex-container"]}>
					<Clickable>
						<button
							className={`${styles["category-container"]} ${
								selectedCategories.includes("geography")
									? `${styles.selected}`
									: ""
							}`}
							onClick={() => handleButtonClick("geography")}
						>
							<div
								className={`${styles["thema-container"]} ${
									selectedCategories.includes("geography")
										? `${styles.selected}`
										: ""
								}`}
							>
								<img
									src="/images/thema-geografie.png"
									className={styles.thema}
								/>
							</div>
							{translations("categories.geografie")}
						</button>
					</Clickable>
					<Clickable>
						<button
							className={`${styles["category-container"]} ${
								selectedCategories.includes("history")
									? `${styles.selected}`
									: ""
							}`}
							onClick={() => handleButtonClick("history")}
						>
							<div
								className={`${styles["thema-container"]} ${
									selectedCategories.includes("history")
										? `${styles.selected}`
										: ""
								}`}
							>
								<img
									src="/images/thema-geschichte.png"
									className={styles.thema}
								/>
							</div>
							{translations("categories.geschichte")}
						</button>
					</Clickable>
				</div>
				<div className={styles["flex-container"]}>
					<Clickable>
						<button
							className={`${styles["category-container"]} ${
								selectedCategories.includes("literature")
									? `${styles.selected}`
									: ""
							}`}
							onClick={() => handleButtonClick("literature")}
						>
							<div
								className={`${styles["thema-container"]} ${
									selectedCategories.includes("literature")
										? `${styles.selected}`
										: ""
								}`}
							>
								<img
									src="/images/thema-literatur.png"
									className={styles.thema}
								/>
							</div>
							{translations("categories.literatur")}
						</button>
					</Clickable>
					<Clickable>
						<button
							className={`${styles["category-container"]} ${
								selectedCategories.includes("music")
									? `${styles.selected}`
									: ""
							}`}
							onClick={() => handleButtonClick("music")}
						>
							<div
								className={`${styles["thema-container"]} ${
									selectedCategories.includes("music")
										? `${styles.selected}`
										: ""
								}`}
							>
								<img
									src="/images/thema-musik.png"
									className={styles.thema}
								/>
							</div>
							{translations("categories.musik")}
						</button>
					</Clickable>
				</div>
				<div className={styles["flex-container"]}>
					<Clickable>
						<button
							className={`${styles["category-container"]} ${
								selectedCategories.includes("pun")
									? `${styles.selected}`
									: ""
							}`}
							onClick={() => handleButtonClick("pun")}
						>
							<div
								className={`${styles["thema-container"]} ${
									selectedCategories.includes("pun")
										? `${styles.selected}`
										: ""
								}`}
							>
								<img
									src="/images/thema-word.png"
									className={styles.thema}
								/>
							</div>
							{translations("categories.wortspiele")}
						</button>
					</Clickable>
				</div>
			</div>
			<div className={styles.footer}>
				<FooterButtons
					onBack="/user/homepage"
					onNext={`/user/play?type=train&${categoriesQuery()}`}
				></FooterButtons>
			</div>
		</main>
	);
}
