const nodemailer = require("nodemailer");
const moment = require("moment");
const cron = require("node-cron");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `ashutosh@gmail.com`,
    pass: `Ashu@12345`,
  },
});

let mailOptions = {
  from: "dhamasunny98@gmail.com",
  subject: "You have interview scheduled for IB!",
};

const scheduleEmail = (invitee, time) => {
  let scheduleCronString = `${moment(time)
    .subtract(10, "minutes")
    .format("m H DD M")} *`;
  console.log("Scheduling email with ", scheduleCronString);
  cron.schedule(scheduleCronString, () => {
    mailOptions["to"] = invitee;
    mailOptions["text"] = `You have your email scheduled for ${time}`;
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  });
};

module.exports = {
  scheduleEmail,
};
