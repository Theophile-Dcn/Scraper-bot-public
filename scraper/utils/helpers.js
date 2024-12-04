import fs from 'fs';

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const clickNextButton = async (page) => {
  let count = 1;
  try {
    await page.$eval('#nextPage', (el) => el.click());
    count++;
    console.log(`Changement de page, page n°${count}`);
  } catch (error) {
    console.log('No next button found');
  }
};

export const extractNumberFromString = (idString) => {
  return idString.replace(/[^0-9]/g, '');
};

export const saveDataToJson = (data) => {
  console.log('step 7');
  console.log('Sauvegarde des données dans un fichier JSON');
  console.log('Pour le moment, les données sont sauvegardées en Json');
  console.log('--------------------------------');
  console.log('data', data);
  const dataArray = Array.isArray(data) ? data : [data];

  fs.writeFileSync(
    'allLocations.json',
    JSON.stringify(dataArray, null, 2),
    'utf-8'
  );
};

export default sleep;
