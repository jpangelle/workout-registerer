const dotenv = require('dotenv');
const { logError } = require('./logError');

dotenv.config();

async function login(page) {
  try {
    // username
    await page.type('#Input_UserName', process.env.USERNAME);

    // password
    await page.type('#Input_Password', process.env.PASSWORD);

    // submit login
    await page.click('.signin-btn');

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
  } catch (error) {
    logError({
      error,
      message: 'error logging in',
    });
  }
}

module.exports = { login };
