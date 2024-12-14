"use client";
import styles from "./InputField.module.css";

export default function InputField({
	label,
	type,
	name,
	value,
	onChange,
	small,
	greyLabel,
	sublabel,
	style
}) {
	return (
		<div className={small ? styles.smallInput : styles.input}>
			{label && (
				<label htmlFor={name} style={style}>
					{label}
				</label>
			)}
			{greyLabel && (
				<label className={styles.greyLabel}>
					{sublabel}
				</label>
			)}
			<input type={type} name={name} value={value} onChange={onChange} />
		</div>
	);
}
