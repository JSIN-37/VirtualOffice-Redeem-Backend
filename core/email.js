// EMAIL
const cfg = process.env; // Get server configurations

const nodemailer = require("nodemailer");

// Connect with email service
emailer = nodemailer.createTransport({
  host: cfg.EMAIL_HOST,
  port: cfg.EMAIL_PORT,
  auth: {
    user: cfg.EMAIL_ADDRESS,
    pass: cfg.EMAIL_PASSWORD,
  },
});

const sendEmail = (recipients, subject, body) => {
  emailer
    .sendMail({
      from: '"VirtualOffice" <virtualoffice@jsin37.com>', // sender address
      to: recipients, // list of receivers
      subject: subject, // Subject line
      // text: "This is a summary", // plain text body
      html: body, // html body
    })
    .then((info) => {
      // console.log({ info });
      console.log(`(✔) VirtualOffice sent an email to ${recipients}`);
    })
    .catch((err) => {
      console.log(`(✖) VirtualOffice failed to send an email.`);
      // console.log(err);
    });
};

module.exports = sendEmail;
