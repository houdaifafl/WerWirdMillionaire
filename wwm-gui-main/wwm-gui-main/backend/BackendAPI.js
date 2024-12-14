import { Globals } from "./useGlobals";
import axios from "axios";

export class BackendAPI {
    /**
     * Sets the globals variable.
     * @param {Globals}
     * @hidden
     */
    setGlobals(globals) {
        /**
         * Holds all application wide globals.
         * @type {Globals}
         */
        this.globals = globals;
    }

    /**
     * Requests to login.
     * @param {string} userIdentity email or password
     * @param {string} password password
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     *  success: true,
     *  username: string,
     *  is_admin: boolean,
     *  auth_token: string,
     * }}
     */
    async login(userIdentity, password) {
        try {
            const result = await axios.post(
                `${this.globals.api}/user/login`,
                {
                    user_identity: userIdentity,
                    password: password,
                },
                { validateStatus: () => true }
            );

            if (result?.data?.success) {
                this.globals.setAuthSession({
                    username: result.data.username,
                    authToken: result.data.auth_token,
                    isAdmin: result.data.is_admin === 1,
                });
            }
            return result.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Requests to end Session when auth_error.
    */
    async endSession() {
        this.globals.setAuthSession({
            username: null,
            authToken: null,
            isAdmin: null,
        });
    }

    /**
     * Deletes the logged in account.
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     *  success: true
     * }}
     */
    async deleteAccount() {
        try {
            const result = await axios.delete(
                `${this.globals.api}/user/`,
                {
                    validateStatus: () => true,
                    headers: { auth_token: this.globals.authToken },
                }
            );

            let deletedAccount = result?.data?.success;

            if (
                deletedAccount ||
                result?.data?.error_id === "auth_error"
            ) {
                this.globals.setAuthSession({
                    username: null,
                    authToken: null,
                    isAdmin: null,
                });
            }

            return {
                success: deletedAccount,
            };
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Requests to logout.
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     *  success: true,
     * }}
     */
    async logout() {
        try {
            const result = await axios.post(
                `${this.globals.api}/user/logout`,
                {},
                {
                    validateStatus: () => true,
                    headers: { auth_token: this.globals.authToken },
                }
            );

            let loggedOut = false;

            if (
                result?.data?.success ||
                result?.data?.error_id === "auth_error"
            ) {
                this.globals.setAuthSession({
                    username: null,
                    authToken: null,
                    isAdmin: null,
                });
                loggedOut = true;
            }

            return {
                success: loggedOut,
            };
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Requests to signup.
     * @param {string} surname The player's surname
     * @param {string} lastname The player's lastname
     * @param {string} email The player's email
     * @param {string} password The player's password
     * @param {string} birthday The player's birthday
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     *  success: true,
     *  username: string,
     *  is_admin: boolean,
     *  auth_token: string,
     * }}
     */
    async signup(surname, lastname, email, password, birthday) {
        try {
            const result = await axios.post(
                `${this.globals.api}/user/signup`,
                {
                    surname: surname,
                    lastname: lastname,
                    email: email,
                    password: password,
                    birthday: birthday,
                },
                { validateStatus: () => true }
            );

            if (result.data.success) {
                this.globals.setSecurityQuestionsAnswered(false);
                this.globals.setAuthSession({
                    username: result.data.username,
                    authToken: result.data.auth_token,
                    isAdmin: false,
                });
            }

            return result.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Sets the security questions for the logged in user.
     * @param {string} favourite_color The user's favourite color
     * @param {string} mother_name The user's mother's name
     * @param {string} place_of_birth The user's place of birth
     * @returns {{
     * 		success: false,
     * 		message: string,
     * 		error_id: string
     * } | {
     * 		success: true,
     * }}
     */
    async setSecurityQuestions(favourite_color, mother_name, place_of_birth) {
        try {
            const result = await axios.post(
                `${this.globals.api}/user/security-questions`,
                {
                    favourite_color: favourite_color,
                    mother_name: mother_name,
                    place_of_birth: place_of_birth,
                },
                {
                    validateStatus: () => true,
                    headers: { auth_token: this.globals.authToken },
                }
            );
            if (result.data.success) {
                this.globals.setSecurityQuestionsAnswered(true);
            }
            return result.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Validates the security questions for the user having the passed identity.
     * Sets the reset_password_token automatically in the background.
     * @param {string} userIdentity username or email
     * @param {string} favouriteColor
     * @param {string} motherName
     * @param {string} placeOfBirth
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     *  | {
     *  success: true,
     *  reset_password_token: string
     * }}
     */
    async validateSecurityQuestions(
        userIdentity,
        favouriteColor,
        motherName,
        placeOfBirth
    ) {
        try {
            const result = await axios.patch(
                `${this.globals.api}/user/security-questions`,
                {
                    user_identity: userIdentity,
                    favourite_color: favouriteColor,
                    mother_name: motherName,
                    place_of_birth: placeOfBirth,
                },
                { validateStatus: () => true }
            );

            if (result.data.success) {
                this.globals.setPasswordResetToken(
                    result.data.reset_password_token
                );
            }

            return result.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Resets the user's password. Before calling this function the user needs to
     * answer the security questions correctly. Call `vaildateSecurityQuestions()` for this purpose.
     * @param {string} newPassword
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     * success: true,
     * username: string,
     * is_admin: boolean,
     * auth_token: string,
     * }}
     */
    async resetPassword(newPassword) {
        try {
            const result = await axios.post(
                `${this.globals.api}/user/reset-password`,
                {
                    password: newPassword,
                },
                {
                    validateStatus: () => true,
                    headers: {
                        reset_password_token: this.globals.passwordResetToken,
                    },
                }
            );

            if (result.data.success) {
                this.globals.setPasswordResetToken(null);
                this.globals.setAuthSession({
                    username: result.data.username,
                    authToken: result.data.auth_token,
                    isAdmin: result.data.is_admin,
                });
            }

            return result.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Gets 15 questions for the desired modes. If the desired mode is `"train"` you can additionally
     * pass a string array with the selected modes. If you don't pass any category all categories are enabled.
     * @param {"quick-game" | "train" | "latest-show" | "game-of-the-day"} mode
     * @param {("film" | "pun" | "literature" | "history" | "geography" | )[]} categories#
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     * success: true,
     * questions:
     *     ({
     *         id: number,
     *         question: {
     *             en: string,
     *             de: string,
     *         },
     *         answers: [
     *             {
     *                 en: string,
     *                 de: string,
     *             },
     *             {
     *                 en: string,
     *                 de: string,
     *             },
     *             {
     *                 en: string,
     *                 de: string,
     *             },
     *             {
     *                 en: string,
     *                 de: string,
     *             }
     *         ],
     *         category: string,
     *         difficulty: number,
     *     })[]
     * }}
     */
    async getQuestions(mode, categories) {
        try {
            let categoriesString = "?";
            if (categories) {
                for (let i = 0; i < categories.length; i++) {
                    if (!categories[i]) break;
                    categoriesString += `category${i}=${categories[i]}&`;
                }
                categoriesString = categoriesString.substring(
                    0,
                    categoriesString.length - 1
                );
            }
            const result = await axios.get(
                `${this.globals.api}/questions/${mode}${categoriesString}`,
                {
                    validateStatus: () => true,
                    headers: { auth_token: this.globals.authToken },
                }
            );
            return result.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Gets the daily highscores using the users auth_token.
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     * success: true,
     * highscores: ({
     *   username: string,
     *   score: number
     * })[],
     * playerHighscore: number,
     * playerRank: number
     * }}
     */
    async getDailyHighscores() {
        try {
            const result = await axios.get(
                `${this.globals.api}/highscores/today`,
                {
                    validateStatus: () => true,
                    headers: { auth_token: this.globals.authToken },
                }
            );
            return result.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Gets the weekly highscores using the users auth_token.
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     * success: true,
     * highscores: ({
     *   username: string,
     *   score: number
     * })[],
     * playerHighscore: number,
     * playerRank: number
     * }}
     */
    async getWeeklyHighscores() {
        try {
            const result = await axios.get(
                `${this.globals.api}/highscores/week`,
                {
                    validateStatus: () => true,
                    headers: { auth_token: this.globals.authToken },
                }
            );
            return result.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Gets the monthly highscores using the users auth_token.
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     * success: true,
     * highscores: ({
     *   username: string,
     *   score: number
     * })[],
     * playerHighscore: number,
     * playerRank: number
     * }}
     */
    async getMonthlyHighscores() {
        try {
            const result = await axios.get(
                `${this.globals.api}/highscores/month`,
                {
                    validateStatus: () => true,
                    headers: { auth_token: this.globals.authToken },
                }
            );
            return result.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Uploads the result of a game.
     * @param {number} score
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | { success: true }}
     */
    async uploadGameResult(score) {
        try {
            const result = await axios.post(
                `${this.globals.api}/highscores`,
                {
                    score,
                },
                {
                    validateStatus: () => true,
                    headers: { auth_token: this.globals.authToken },
                }
            );
            return result.data;
        } catch (error) {
            return {
                success: false,
                error_id: "network_error",
                message: error.message,
            };
        }
    }

    /**
     * Gets the trophy count of the logged in user.
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     *  success: true,
     *  count: number,
     * }}
     */
    async getTrophyCount() {
        try {
            const response = await axios.get(
                `${this.globals.api}/player/trophy-count`,
                {
                    validateStatus: () => true,
                    headers: { auth_token: this.globals.authToken },
                }
            );

            return response.data;
        } catch (error) {
            return {
                success: false,
                error_id: "network_error",
                message: error.message,
            };
        }
    }

    /**
     * Gets all questions.
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     *  success: true,
     *  questions:
     *     ({
     *         id: number,
     *         question: {
     *             en: string,
     *             de: string,
     *         },
     *         answers: [
     *             {
     *                 en: string,
     *                 de: string,
     *             },
     *             {
     *                 en: string,
     *                 de: string,
     *             },
     *             {
     *                 en: string,
     *                 de: string,
     *             },
     *             {
     *                 en: string,
     *                 de: string,
     *             }
     *         ],
     *         category: string,
     *         difficulty: number,
     *     })[]
     * }}
     */
    async getAllQuestions() {
        try {
            const response = await axios.get(`${this.globals.api}/questions`, {
                validateStatus: () => true,
                headers: { auth_token: this.globals.authToken },
            });
            return response.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Creates a new question.
     * @param {{
     *         id: number,
     *         question: {
     *             en: string,
     *             de: string,
     *         },
     *         answers: [
     *             {
     *                 en: string,
     *                 de: string,
     *             },
     *             {
     *                 en: string,
     *                 de: string,
     *             },
     *             {
     *                 en: string,
     *                 de: string,
     *             },
     *             {
     *                 en: string,
     *                 de: string,
     *             }
     *         ],
     *         category: string,
     *         difficulty: number,
     *     }} question
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     *  success: true,
     * }}
     */
    async addQuestion(question) {
        try {
            const response = await axios.post(
                `${this.globals.api}/questions`,
                {
                    id: question.id,
                    question: {
                        en: question.question.en,
                        de: question.question.de,
                    },
                    answers: [
                        {
                            en: question.answers[0].en,
                            de: question.answers[0].de,
                        },
                        {
                            en: question.answers[1].en,
                            de: question.answers[1].de,
                        },
                        {
                            en: question.answers[2].en,
                            de: question.answers[2].de,
                        },
                        {
                            en: question.answers[3].en,
                            de: question.answers[3].de,
                        },
                    ],
                    category: question.category,
                    difficulty: question.difficulty,
                },
                {
                    validateStatus: () => true,
                    headers: { auth_token: this.globals.authToken },
                }
            );
            return response.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Edits an existing question.
     * @param {{
     *         id?: number,
     *         question?: {
     *             en?: string,
     *             de?: string,
     *         },
     *         answers?: [
     *             {
     *                 en?: string,
     *                 de?: string,
     *             },
     *             {
     *                 en?: string,
     *                 de?: string,
     *             },
     *             {
     *                 en?: string,
     *                 de?: string,
     *             },
     *             {
     *                 en?: string,
     *                 de?: string,
     *             }
     *         ],
     *         category?: string,
     *         difficulty?: number,
     *     }} question
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     *  success: true,
     * }}
     */
    async editQuestion(question) {
        try {
            const questionData = {
                question: {},
                answers: [],
            };

            if (question.id) {
                questionData.id = question.id;
            }

            if (question.question) {
                if (question.question.en) {
                    questionData.question.en = question.question.en;
                }
                if (question.question.de) {
                    questionData.question.de = question.question.de;
                }
            }

            if (question.answers) {
                for (let i = 0; i < question.answers.length; i++) {
                    const answer = question.answers[i];
                    const formattedAnswer = {};

                    if (answer.en) {
                        formattedAnswer.en = answer.en;
                    }
                    if (answer.de) {
                        formattedAnswer.de = answer.de;
                    }

                    questionData.answers.push(formattedAnswer);
                }
            }

            if (question.category) {
                questionData.category = question.category;
            }

            if (question.difficulty) {
                questionData.difficulty = question.difficulty;
            }

            const response = await axios.patch(
                `${this.globals.api}/questions/${question.id}`,
                questionData,
                {
                    validateStatus: () => true,
                    headers: { auth_token: this.globals.authToken },
                }
            );

            return response.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Deletes the question with the passed id.
     * @param {number} questionId
     * @returns {{
     *  success: false,
     *  message: string,
     *  error_id: string
     * } | {
     *  success: true,
     * }}
     */
    async deleteQuestion(questionId) {
        try {
            const response = await axios.delete(
                `${this.globals.api}/questions/${questionId}`,
                {
                    validateStatus: () => true,
                    headers: { auth_token: this.globals.authToken },
                }
            );
            return response.data;
        } catch (err) {
            return {
                success: false,
                error_id: "network_error",
                message: err.message,
            };
        }
    }

    /**
     * Select a question.
     * @param {null | {
     *id: number;
     *question: {
     *    en: string;
     *    de: string;
     *};
     *answers: [{
     *    en: string;
     *    de: string;
     * }, {
     *    en: string;
     *      de: string;
     *  }, {
     *       en: string;
     *       de: string;
     *   }, {
     *       en: string;
     *      de: string;
     *  }];
     *   category: string;
     *   difficulty: number;
     *}} question
     */
    selectQuestion(question) {
        this.globals.setSelectedQuestion(question);
    }
}

export default new BackendAPI();
