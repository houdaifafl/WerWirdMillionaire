const UserController = require("../controllers/UserController")
const Question = require("../models/Question")

module.exports = async function () {
    // reset daily highscores
    await UserController.resetDailyHighscores();

}