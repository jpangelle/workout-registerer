const dotenv = require('dotenv');
const Twilio = require('twilio');

dotenv.config();

const twilioClient = new Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

const sendMessage = async message =>
  twilioClient.messages.create({
    body: `${message}`,
    to: process.env.MY_PHONE_NUMBER,
    from: process.env.TWILIO_PHONE_NUMBER,
  });

module.exports = { sendMessage };
