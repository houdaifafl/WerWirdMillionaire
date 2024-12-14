const resetDailyHighscoresService = require("./daily_highscore");
const resetWeeklyHighscoresService = require("./weekly_highscore");
const selectGameOfTheDayService = require("./game_of_the_day");
const emailService = require("./email");
const resetMonthlyHighscoreService = require("./monthly_highscore");

const log = require("npmlog");
const weekNumber = require("current-week-number");

const updateIntervalInSeconds = 60;

function monthlyInterval() {
	let latestMonth = new Date().getMonth();
	log.info("MonthlyInterval", `It's month ${latestMonth + 1}`);

	const interval = setInterval(() => {
		const now = new Date();
		const currentMonth = now.getMonth();
		log.info("MonthlyInterval", `It's month ${currentMonth + 1}`);
		if (
			latestMonth != currentMonth &&
			now.getDate() === 1 &&
			now.getHours() === 0 &&
			now.getMinutes() <= 2
		) {
			log.info("MonthlyInterval", `It's a new month!`);

			emailService();
			resetMonthlyHighscoreService();

			latestMonth = now.getMonth();
		}
	}, 1000 * updateIntervalInSeconds);
	return interval;
}

function weeklyInterval() {
	let latestWeek = weekNumber(new Date());
	log.info("WeeklyInterval", `It's week ${latestWeek}`);

	const interval = setInterval(() => {
		const now = new Date();
		const currentWeek = weekNumber(now);
		log.info("WeeklyInterval", `It's week ${currentWeek}`);
		if (
			latestWeek != currentWeek &&
			now.getHours() === 0 &&
			now.getMinutes() <= 2
		) {
			log.info("WeeklyInterval", `It's a new week!`);

			resetWeeklyHighscoresService();

			latestWeek = currentWeek;
		}
	}, 1000 * updateIntervalInSeconds);
	return interval;
}

function dailyInterval() {
	let latestDay = new Date().getDate();
	log.info("DailyInterval", `It's day ${latestDay}`);

	const interval = setInterval(() => {
		const now = new Date();
		const currentDay = now.getDate();

		log.info("DailyInterval", `It's day ${currentDay}`);
		if (
			latestDay != currentDay &&
			now.getHours() === 0 &&
			now.getMinutes() <= 2
		) {
			log.info("DailyInterval", `It's a new day!`);

			resetDailyHighscoresService();
			selectGameOfTheDayService();

			latestDay = currentDay;
		}
	}, 1000 * updateIntervalInSeconds);
	return interval;
}

monthlyInterval();
weeklyInterval();
dailyInterval();
