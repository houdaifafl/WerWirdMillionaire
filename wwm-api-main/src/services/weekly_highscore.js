const UserController = require("../controllers/UserController");

module.exports = async function () {
  // reset weekly highscores
  await UserController.resetWeeklyHighscores();
};
