import 'dotenv/config';
import puppeteer from 'puppeteer';
import {
  navigateToLocation,
  navigateToLogin
} from './navigation/wikiNavigation.js';
import {
  getLocationDetails,
  getLocationIds
} from './pageInteractions/getData.js';
import sleep, { clickNextButton } from './utils/helpers.js';

const TARGET_URL = process.env.TARGET_URL;

(async () => {
  let locationIds = [];
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(TARGET_URL);
  await sleep(500);
  await navigateToLogin(page, TARGET_URL);
  await sleep(500);
  await navigateToLocation(page, TARGET_URL);

  // Tant que le bouton nextPage n'a pas la classe 'disabled'
  while (
    !(await page.$eval('#nextPage.btn.btn-primary', (el) => el.disabled))
  ) {
    console.log('nextPage is clickable');
    await sleep(500);
    locationIds = await getLocationIds(page);
    await sleep(500);
    await getLocationDetails(page, locationIds, TARGET_URL);
    await sleep(500);
    locationIds = [''];
    await clickNextButton(page, TARGET_URL);
    await sleep(500);
  }

  // Récupérer les IDs une dernière fois si le bouton est désactivé
  console.log('Récupération des IDs sur la dernière page');
  locationIds = await getLocationIds(page);
  await sleep(500);
  await getLocationDetails(page, locationIds, TARGET_URL);

  await browser.close();
})();
