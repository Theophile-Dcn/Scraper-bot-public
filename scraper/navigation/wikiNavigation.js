import sleep from '../utils/helpers.js';

export const navigateToLogin = async (page, TARGET_URL) => {
  console.log('Step 1');
  console.log('navigateToLogin');
  console.log('--------------------------------');
  await page.goto(TARGET_URL + '/connexion');
  await sleep(1000);
  await page.type('#username', process.env.COMPTE_EMAIL);
  await page.type('#password', process.env.COMPTE_PASSWORD);
  // Attendre que le bouton soit visible
  await page.evaluate(() => {
    document.querySelector('#modal-login').submit();
  });
  try {
    await page.waitForNavigation({ timeout: 10000 });
    console.log('step 2');
    console.log('Soumission du formulaire de connexion');
    console.log('Connexion réussie');
    console.log('--------------------------------');
  } catch {
    const errorMessage = await page
      .$eval('.alert-danger', (el) => el.textContent)
      .catch(() => null);
    if (errorMessage) {
      console.error('Erreur de connexion:', errorMessage);
    } else {
      console.error(
        'La page n’a pas redirigé et aucune erreur spécifique détectée.'
      );
    }
  }
};

export const navigateToLocation = async (page, TARGET_URL) => {
  console.log('Step 3');
  console.log('navigate To Location');
  console.log('--------------------------------');

  await page.goto(TARGET_URL + '/mon-compte/mes-locations');
  await sleep(5000);
};
