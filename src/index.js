const dotenv = require('dotenv');
const puppeteer = require('puppeteer');
const { login } = require('./login');
const { sendMessage } = require('./sendMessage');
const { logError } = require('./logError');

dotenv.config();

async function joinWorkout(page) {
  await page.click(
    '#AthleteTheme_wtLayoutNormal_block_wtMenu_AthleteTheme_wt67_block_wt37',
  );

  // find registration button for first 8:00am class
  const reservationButton = await page.waitForXPath(
    `//span[@title="8:00 AM CrossFit"]/../../..//a[@title="Make Reservation"]`,
  );

  await reservationButton.click();

  await page.waitForXPath(`//*[text()[contains(., 'Reservation Confirmed')]]`);
}

async function signUpForWorkout() {
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
      const message = `You have been signed up for the 8:00 AM workout.`;
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
