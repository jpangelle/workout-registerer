const puppeteer = require('puppeteer');
const { DateTime } = require('luxon');
require('dotenv').config();
const { login } = require('./login');
const { sendMessage } = require('./sendMessage');
const { logError } = require('./logError');

async function joinWorkout(page, signUpDate) {
  await page.click(
    '#AthleteTheme_wtLayoutNormal_block_wtMenu_AthleteTheme_wt67_block_wt37',
  );

  // find 8:00am row under the corresponding sign up date
  const timeRow = await page.waitForXPath(
    `//span[text()[contains(., '${signUpDate}')]]/parent::td/parent::tr/following-sibling::tr[4]`,
  );

  const time = await page.evaluate(
    element => element.children[0].innerText,
    timeRow,
  );

  if (time === '8:00 AM CrossFit') {
    await timeRow.click('td:nth-child(3) > div > a');
    await page.waitForXPath(
      `//*[text()[contains(., 'Reservation Confirmed')]]`,
    );
  }
}

async function signUpForWorkout() {
  const signUpDate = DateTime.local().plus({ days: 1 }).toFormat('MM/dd/yyyy');

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto(
      'https://app.wodify.com/SignIn/Login?OriginalURL=&RequiresConfirm=false',
      {
        waitUntil: 'networkidle2',
      },
    );

    await login(page);

    try {
      await joinWorkout(page, signUpDate);

      const message = `You have been signed up for the 8:00 AM workout on ${signUpDate}`;

      await sendMessage(message);
    } catch (error) {
      logError({
        error,
        message: 'error joining workout',
      });
    }

    await browser.close();
  } catch (error) {
    logError({
      error,
      message: 'error signing up for workout',
    });
  }
}

setInterval(() => {
  const dt = DateTime.local();
  const weekday = dt.weekday;

  // in between 8:30am and 9:30am
  const isSignUpTime =
    (dt.hour >= 8 && dt.minute >= 30) || (dt.hour <= 9 && dt.minute <= 30);

  // sign up on Monday, Wednesday, or Saturday
  const signUpDays = [1, 3, 6];

  if (signUpDays.includes(weekday) && isSignUpTime) {
    signUpForWorkout();
  }
}, 1000 * 60 * 60);
