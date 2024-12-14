var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'millionarw@gmail.com',
    pass: 'btzo rsrj tiri szgn'
  }
});

var mailOptions = {
  from: 'millionarw@gmail.com',
  to: 'millionarw@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});