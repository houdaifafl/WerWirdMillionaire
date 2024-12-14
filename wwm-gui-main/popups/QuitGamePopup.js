"use client";
import React from "react";
import { useTranslation } from "react-multi-lang";
import Popup from "./Popup";

export default function QuitGamePopup({ visible, onYes, onNo }) {
	const t = useTranslation();

	return (
		<Popup
			text={t("popup.quit")}
			leftButtonText={t("button.ja")}
			rightButtonText={t("button.nein")}
			onLeftButtonClick={onYes}
			onRightButtonClick={onNo}
			visible={visible}
		/>
	);
}
