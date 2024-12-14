const QuestionController = require("../controllers/QuestionController");

module.exports = async function () {
    await QuestionController.selectGameOfTheDay();
}