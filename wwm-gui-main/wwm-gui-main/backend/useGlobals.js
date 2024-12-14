import { createContext, useContext, useRef, useState } from "react";

export const GlobalsContext = createContext();

export class Globals {
	/**
	 * @param {{
	 *  selectedQuestion: {
	 *   id: number,
	 *  question: {
	 *   en: string,
	 *   de: string,
	 *  },
	 * 	answers: [
	 * 			{
	 * 				en: string,
	 * 				de: string,
	 * 			},
	 * 			{
	 * 				en: string,
	 * 				de: string,
	 * 			},
	 * 			{
	 * 				en: string,
	 * 				de: string,
	 * 			},
	 * 			{
	 * 				en: string,
	 * 				de: string,
	 * 			},
	 * 		],
	 * 	category: string,
	 * 	difficulty: number,
	 * 	},
	 *  api: string,
	 *  username: string,
	 *  authToken: string,
	 *  passwordResetToken: string,
	 *  isAdmin: boolean,
	 *  securityQuestionsAnswered: boolean,
	 *  secretType: string,
	 *  setSecretType: (secret: string) => void,
	 *  setAuthSession: (session: {
	 *    username: string,
	 *    authToken: string,
	 *    isAdmin: boolean,
	 *  }) => void,
	 *  setSelectedQuestion: (question: null | {
	 *   id: number,
	 *  question: {
	 *   en: string,
	 *   de: string,
	 *  },
	 * 	answers: [
	 * 			{
	 * 				en: string,
	 * 				de: string,
	 * 			},
	 * 			{
	 * 				en: string,
	 * 				de: string,
	 * 			},
	 * 			{
	 * 				en: string,
	 * 				de: string,
	 * 			},
	 * 			{
	 * 				en: string,
	 * 				de: string,
	 * 			},
	 * 		],
	 * 	category: string,
	 * 	difficulty: number,
	 * 	}) => void,
	 *  setPasswordResetToken: (passwordResetToken: string) => void,
	 *  setSecurityQuestionsAnswered: (securityQuestionsAnswered: boolean) => void,
	 * }} globals
	 */
	constructor(globals) {
		/**
		 * The url to the backend api, e.g. `http://localhost:8000`.
		 * @public
		 * @type {string}
		 */
		this.api = globals.api;

		/**
		 * The selected question. Is null if no question is selected.
		 */
		this.selectedQuestion = globals.selectedQuestion;

		/**
		 * The username of the logged in user. Is null if no player is logged in.
		 * @public
		 * @type {string | null}
		 */
		this.username = globals.username;
		/**
		 * The authToken of the logged in user. Is null if no player is logged in.
		 * @public
		 * @type {string}
		 */
		this.authToken = globals.authToken;
		/**
		 * The password reset token to reset the password. By default it's null.
		 * @public
		 * @type {string | null}
		 */
		this.passwordResetToken = globals.passwordResetToken;
		/**
		 * Whether the logged in user is an admin.
		 * @public
		 * @type {boolean}
		 */
		this.isAdmin = globals.isAdmin;
		/**
		 * Whether the security questions are answered.
		 * @public
		 * @type {boolean}
		 */
		this.securityQuestionsAnswered = globals.securityQuestionsAnswered;
		/**
		 * Some secret feature...
		 * @public
		 * @type {boolean}
		 */
		this.secretType = globals.secretType;

		/**
		 * Some secret feature...
		 * @public
		 * @type {(boolean) => void})}
		 */
		this.setSecretType = globals.setSecretType;

		/**
		 * Sets the authentification session of the logged in user.
		 * @public
		 * @type {(session: {
		 *  username: string,
		 *  authToken: string,
		 *  isAdmin: boolean,
		 * } | {
		 *  username: null,
		 *  authToken: null,
		 *  isAdmin: null,
		 * } ) => void}
		 */
		this.setAuthSession = globals.setAuthSession;

		/**
		 * Sets whether the security questions are answered.
		 * @public
		 * @type {(boolean) => void}
		 */
		this.setSecurityQuestionsAnswered =
			globals.setSecurityQuestionsAnswered;

		/**
		 * Sets the password reset token of the logged in user.
		 * @public
		 * @type {(string) => void}
		 */
		this.setPasswordResetToken = globals.setPasswordResetToken;

		/**
		 * Sets the selected question.
		 * @public
		 * @type {(question: null | {
		 *   id: number,
		 *  question: {
		 *   en: string,
		 *   de: string,
		 *  },
		 * 	answers: [
		 * 			{
		 * 				en: string,
		 * 				de: string,
		 * 			},
		 * 			{
		 * 				en: string,
		 * 				de: string,
		 * 			},
		 * 			{
		 * 				en: string,
		 * 				de: string,
		 * 			},
		 * 			{
		 * 				en: string,
		 * 				de: string,
		 * 			},
		 * 		],
		 * 	category: string,
		 * 	difficulty: number,
		 * 	}) => void}
		 *
		 */
		this.setSelectedQuestion = globals.setSelectedQuestion;
	}
}

/**
 * @returns {Globals}
 */
export default function () {
	const context = useContext(GlobalsContext);

	return context;
}
