const express = require("express");
const router = express.Router();

const asyncHandler = require("./asyncHandler");
const UserController = require("../controllers/UserController");

router.post(
	"/",
	asyncHandler(async (req, res) => {
		await UserController.uploadHighscore(
			req.get("auth_token"),
			req.body.score
		);

		res.status(201).json({ success: true });
	})
);

// Endpoint zum Abrufen der monatlichen Highscores
router.get(
	"/month",
	asyncHandler(async (req, res) => {
		const result = await UserController.getMonthlyHighscores(
			req.get("auth_token")
		);

		res.status(200).json({
			success: true,
			highscores: result.highscores,
			playerRank: result.playerRank,
			playerHighscore: result.playerHighscore,
		});
	})
);

// Endpoint zum Abrufen der heutigen Highscores
router.get(
	"/today",
	asyncHandler(async (req, res) => {
		const result = await UserController.getDailyHighscores(
			req.get("auth_token")
		);

		res.status(200).json({
			success: true,
			highscores: result.highscores,
			playerRank: result.playerRank,
			playerHighscore: result.playerHighscore,
		});
	})
);

// Endpoint zum Abrufen der Highscores der aktuellen Woche
router.get(
	"/week",
	asyncHandler(async (req, res) => {
		const result = await UserController.getWeeklyHighscores(
			req.get("auth_token")
		);

		res.status(200).json({
			success: true,
			highscores: result.highscores,
			playerRank: result.playerRank,
			playerHighscore: result.playerHighscore,
		});
	})
);

module.exports = router;
