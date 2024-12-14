"use client";
import styles from "./Heading.module.css";
import { useTranslation } from "react-multi-lang";

export default function (props) {
    const t = useTranslation();
    return <h1 className={styles.heading} style={props.style || {}}>{t("gamemode.game")}</h1>;
}
