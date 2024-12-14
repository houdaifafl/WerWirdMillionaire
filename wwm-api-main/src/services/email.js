const UserController = require("../controllers/UserController");
const nodemailer = require("nodemailer");
const log = require("npmlog");

module.exports = async function () {
	const winner = await UserController.winnerOfTheMonth();

	var transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: "millionarw@gmail.com",
			pass: "btzo rsrj tiri szgn",
		},
	});

	var mailOptions = {
		from: "millionarw@gmail.com",
		to: winner.email,
		subject: "Wer wird Millionär? - Sie sind Gewinner des Monats!",
		text: `
    Herzlichen Glückwunsch ${winner.username}!
    Mit einem herausragenden Score von ${winner.score.toLocaleString()}€ sind sie
    Gewinner des Monats! Wir gratulieren Ihnen herzlich und wünschen Ihnen weiterhin
    viel Spaß mit unserem Spiel!
    `,
		html: `
    <h3>Herzlichen Glückwunsch <i>${winner.username}</i>!</h3>
    <p>Mit einem herausragenden Score von ${winner.score.toLocaleString()}€ sind sie
    Gewinner des Monats! Wir gratulieren Ihnen herzlich und wünschen Ihnen weiterhin
    viel Spaß mit unserem Spiel!</p>
    `,
		amp: `
    <!doctype html>
    <html ⚡4email>
      <head>
        <meta charset="utf-8">
        <style amp4email-boilerplate>body{visibility:hidden}</style>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <style amp-custom>
          h3 {
            color: red;
          }
        </style>
      </head>
      <body>
        <h3>Herzlichen Glückwunsch <i>${winner.username}</i>!</h3>
        <p>Mit einem herausragenden Score von ${winner.score.toLocaleString()}€ sind sie
        Gewinner des Monats! Wir gratulieren Ihnen herzlich und wünschen Ihnen weiterhin
        viel Spaß mit unserem Spiel!</p>
      </body>
    `,
	};

	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			log.error("EmailService", error);
		} else {
			log.info("EmailService", `Email sent to '${winner.email}'!`);
		}
	});
};
