const dotenv = require('dotenv');
const puppeteer = require('puppeteer');
const { DateTime } = require('luxon');
const { login } = require('./login');
const { sendMessage } = require('./sendMessage');
const { logError } = require('./logError');

dotenv.config();

async function joinWorkout(page) {
  // click Calendar tab
  await page.click(
    '#AthleteTheme_wtLayoutNormal_block_wtMenu_AthleteTheme_wt67_block_wt37',
  );

  // find registration button for the first occurring 8:00am class
  const reservationButton = await page.waitForXPath(
    '//span[@title="8:00 AM CrossFit"]/../../..//a[@title="Make Reservation"]',
  );

  await reservationButton.click();

  // verify class was joined
  await page.waitForXPath(`//*[text()[contains(., 'Reservation Confirmed')]]`);
}

async function signUpForWorkout() {
  const signUpDate = DateTime.local().plus({ days: 2 }).toFormat('MM/dd/yyyy');
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: 'chromium-browser',
      // headless: false,
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
      await joinWorkout(page);
      const message = `You have been signed up for the 8:00 AM workout on ${signUpDate}.`;
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
