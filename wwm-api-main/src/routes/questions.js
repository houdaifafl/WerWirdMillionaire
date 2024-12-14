const express = require("express");
const asyncHandler = require("./asyncHandler");
const Question = require("../models/Question");
const router = express.Router();
const QuestionController = require("../controllers/QuestionController");
router.use(express.json());

// Admin requests to adds a new question
router.post(
	"/",
	asyncHandler(async (req, res) => {
		const auth_token = req.headers["auth_token"];
		const id = req.params.id;

		const newQuestion = Question.fromJSON(undefined, req.body);

		await QuestionController.insertQuestion(auth_token, newQuestion);

		res.status(201).json({ success: true, id });
	})
);

// Admin requests to update a new question
router.patch(
	"/:id",
	asyncHandler(async (req, res) => {
		const auth_token = req.get("auth_token");
		const id = req.params.id;
		const updatedQuestion = Question.fromJSON(id, req.body);

		await QuestionController.editQuestion(auth_token, id, updatedQuestion);

		res.status(201).json({ success: true });
	})
);

// Admin requests to remove an existing question
router.delete(
	"/:id",
	asyncHandler(async (req, res) => {
		const auth_token = req.get("auth_token");
		const id = req.params.id;
		await QuestionController.deleteQuestion(auth_token, id);

		res.status(201).json({ success: true });
	})
);

/**
 * Get all questions.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Object} - JSON response containing a list of all questions or an error message.
 */
router.get(
	"/",
	asyncHandler(async (req, res) => {
		const questions = await QuestionController.getAllQuestions(
			req.get("auth_token")
		);

		const result = questions.map((question) => question.toJSON());

		res.status(200).json({
			success: true,
			questions: result,
		});
	})
);

/**
 * Get the questions of the game of the day.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Object} - JSON response containing a list of the game of the day questions or an error message.
 */
router.get(
	"/game-of-the-day",
	asyncHandler(async (req, res) => {
		const questions = await QuestionController.getGameOfTheDayQuestions(
			req.get("auth_token")
		);

		const result = questions.map((question) => question.toJSON());

		res.status(200).json({
			success: true,
			questions: result,
		});
	})
);

/**
 * Get random questions for a quick game.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Object} - JSON response containing a list of the quick game questions or an error message.
 */
router.get(
	"/quick-game",
	asyncHandler(async (req, res) => {
		const questions = await QuestionController.getQuickGameQuestions(
			req.get("auth_token")
		);

		const result = questions.map((question) => question.toJSON());

		res.status(200).json({
			success: true,
			questions: result,
		});
	})
);

/**
 * Get the questions of the latest show.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Object} - JSON response containing a list of the latest show questions or an error message.
 */
router.get(
	"/latest-show",
	asyncHandler(async (req, res) => {
		const questions = await QuestionController.getLatestShowQuestions(
			req.get("auth_token")
		);

		const result = questions.map((question) => question.toJSON());

		res.status(200).json({
			success: true,
			questions: result,
		});
	})
);

/**
 * Get random questions for training
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Object} - JSON response containing a list of the training questions or an error message.
 */
router.get(
	"/train",
	asyncHandler(async (req, res) => {
		const categories = Object.values(req.query);

		const questions = await QuestionController.getTrainQuestions(
			req.get("auth_token"),
			categories
		);

		const result = questions.map((question) => question.toJSON());

		res.status(200).json({
			success: true,
			questions: result,
		});
	})
);

module.exports = router;
