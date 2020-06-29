const dotenv = require('dotenv');
const puppeteer = require('puppeteer');
const { DateTime } = require('luxon');
const { login } = require('./login');
const { sendMessage } = require('./sendMessage');
const { logError } = require('./logError');

dotenv.config();

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

signUpForWorkout();
