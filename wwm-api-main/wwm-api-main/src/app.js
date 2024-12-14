const express = require("express");
const errorHandler = require("./errorhandling/errorHandler");
const log = require("npmlog");
const cors = require("cors");
const nocache = require("nocache");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.disable("etag");
app.use(nocache());

app.use(function (req, res, next) {
	log.info("Request", `${req.method} ${req.originalUrl}`);
	res.on("finish", function () {
		log.info(
			"Response",
			`${req.method} ${req.originalUrl} ${res.statusCode}`
		);
	});
	next();
});

app.use("/questions", require("./routes/questions"));
app.use("/user", require("./routes/user"));
app.use("/player", require("./routes/player"));
app.use("/highscores", require("./routes/highscores"));
app.use(errorHandler);

module.exports = app;
