/**
 * User model. An instance of this class represents a user.
 */
class User {
	/**
	 * Creates a new user. Does not validate the passed parameters.
	 * @param {string} username the username of the user
	 * @param {string} email the email of the user
	 * @param {string} password the password of the user (hashed)
	 * @param {boolean} admin true if the user is an admin
	 * @param {number} highscore_daily the daily highscore of the user
	 * @param {number} highscore_weekly the weekly highscore of the user
	 * @param {number} highscore_monthly the monthly highscore of the user
	 * @param {number} monthly_wins the monthly wins of the user
	 * @param {string} favorite_color the favorite color of the user
	 * @param {string} name_mother the name of the mother of the user
	 * @param {string} place_of_birth the place of birth of the user
	 * @param {string | null} auth_token the auth_token of the user
	 * @param {string | null} reset_password_token the reset_password_token of the user
	 */
	constructor(
		username,
		email,
		password,
		admin,
		highscore_daily,
		highscore_weekly,
		highscore_monthly,
		monthly_wins,
		favorite_color,
		name_mother,
		place_of_birth,
		auth_token,
		reset_password_token
	) {
		this.username = username;
		this.email = email;
		this.password = password;
		this.admin = admin;
		this.highscore_daily = highscore_daily;
		this.highscore_weekly = highscore_weekly;
		this.highscore_monthly = highscore_monthly;
		this.monthly_wins = monthly_wins;
		this.favorite_color = favorite_color;
		this.name_mother = name_mother;
		this.place_of_birth = place_of_birth;
		this.auth_token = auth_token;
		this.reset_password_token = reset_password_token;
	}

	/**
	 * Converts the user to a simplified JSON object.
	 * @returns {User} the user as JSON
	 */
	toJSON() {
		return {
			username: this.username,
			email: this.email,
			password: this.password,
			admin: this.admin,
			highscore_daily: this.highscore_daily,
			highscore_weekly: this.highscore_weekly,
			monthly_wins: this.monthly_wins,
			favorite_color: this.favorite_color,
			name_mother: this.name_mother,
			place_of_birth: this.place_of_birth,
			auth_token: this.auth_token,
			reset_password_token: this.reset_password_token,
		};
	}
}

module.exports = User;
