module.exports = function get_age(date) {
	const today = new Date();
	let age = today.getFullYear() - date.getFullYear();
	const m = today.getMonth() - date.getMonth();

	if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
		age--;
	}

	return age;
};
