"use client";
import React from "react";
import { useTranslation } from "react-multi-lang";
import Popup from "./Popup";

export default function CancelPopup({ onCancel, onStay, visible }) {
	const t = useTranslation();

	return (
		<Popup
			text={t("popup.cancel")}
			leftButtonText={t("button.ja")}
			rightButtonText={t("button.nein")}
			onLeftButtonClick={onCancel}
			onRightButtonClick={onStay}
			visible={visible}
		/>
	);
}
