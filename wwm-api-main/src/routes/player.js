const express = require("express");

const router = express.Router();
const UserController = require("../controllers/UserController");
const asyncHandler = require("./asyncHandler");

router.get("/trophy-count", asyncHandler(async (req, res) => {
    const auth_token = req.get("auth_token");

    const trophyCount = await UserController.getTrophyCount(auth_token);

    res.status(200).json({
        success: true,
        count: trophyCount,
    });
}));

module.exports = router;
