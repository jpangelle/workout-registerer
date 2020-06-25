const twilio = require('twilio');
require('dotenv').config();

const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const sendMessage = async message => {
  return twilioClient.messages.create({
    body: `${message}`,
    to: process.env.MY_PHONE_NUMBER,
    from: process.env.TWILIO_PHONE_NUMBER,
  });
};

module.exports = { sendMessage };
