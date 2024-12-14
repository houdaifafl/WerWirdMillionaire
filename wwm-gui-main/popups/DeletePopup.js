"use client";
import React from "react";
import { useTranslation } from "react-multi-lang";
import Popup from "./Popup";

export default function DeletePopup({ onYes, onNo, popup_visible }) {
	const t = useTranslation();

	return (
		<Popup
			text={t("popup.delete")}
			leftButtonText={t("button.ja")}
			rightButtonText={t("button.nein")}
			onLeftButtonClick={onYes}
			onRightButtonClick={onNo}
			visible={popup_visible}
		/>
	);
}
