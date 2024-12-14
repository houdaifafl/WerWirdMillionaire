const UserController = require("../controllers/UserController");

module.exports = async function () {
    // reset monthly highscore
    await UserController.resetMonthlyHighscores();
};
