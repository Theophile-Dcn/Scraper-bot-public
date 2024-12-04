import sleep, {
  extractNumberFromString,
  saveDataToJson
} from '../utils/helpers.js';

export const getLocationIds = async (page) => {
  const locationsIds = await page.$$eval('.item-reservation', (elements) =>
    elements.map((element) => {
      const referenceSpan = element.querySelector(
        '#locations-ajax > div > div.head.d-flex.flex-row.align-items-center.position-relative > div.reference.pe-3.ps-2 > span'
      );
      return referenceSpan ? referenceSpan.textContent : null;
    })
  );
  console.log('step 4');
  console.log(
    'Récupération du texte de la balise des locations => exemple : id452665'
  );
  console.log('--------------------------------');
  console.log(locationsIds);
  console.log('--------------------------------');
  return locationsIds;
};
export const getLocationDetails = async (page, locationIds, TARGET_URL) => {
  const idWithOnlyNumbers = locationIds.map((id) =>
    extractNumberFromString(id)
  );
  console.log('step 5');
  console.log('convertir les string récupérées en nombre');
  console.log('idWithOnlyNumbers', idWithOnlyNumbers);
  console.log('--------------------------------');
  const allLocationData = [];

  for (const id of idWithOnlyNumbers) {
    await page.goto(`${TARGET_URL}/mon-compte/location/${id}/detail`);
    const locationData = await getDataFromLocation(page);
    if (locationData) {
      allLocationData.push(locationData);
    }
    await page.goBack();
    await sleep(5000);
  }
  console.log('step 6');
  console.log('Extraction des données des locations');
  console.log('allLocationData', allLocationData);
  console.log('--------------------------------');

  saveDataToJson(allLocationData);
};

export async function getDataFromLocation(page) {
  const locationData = await page.evaluate(() => {
    // Récupérer le numéro de location
    const locationElement = document.querySelector(
      'h3.fs-3.m-0.text-uppercase'
    );
    const locationId = locationElement
      ? locationElement.textContent.replace(/\D/g, '')
      : null;

    // Récupérer la date de départ
    const dateDepartureElement = document.querySelector(
      '#center-column > div.container.pb-5 > section.row.pt-5 > div.col-lg-7.col-12.row.ps-2.mb-lg-0.mb-5.fs-6.ps-3 > div:nth-child(1) > div > div:nth-child(1) > span'
    );
    const dateDeparture = dateDepartureElement
      ? dateDepartureElement.textContent
          .trim()
          .match(/\d{2}\/\d{2}\/\d{4}/)?.[0]
      : null;

    // Récupérer la date d'arrivée
    const dateArrivalElement = document.querySelector(
      '#center-column > div.container.pb-5 > section.row.pt-5 > div.col-lg-7.col-12.row.ps-2.mb-lg-0.mb-5.fs-6.ps-3 > div.col-lg-6.d-flex.align-items-center.my-lg-0.my-3 > div > div:nth-child(1) > span'
    );
    const dateArrival = dateArrivalElement
      ? dateArrivalElement.textContent.trim().match(/\d{2}\/\d{2}\/\d{4}/)?.[0]
      : null;

    // Récupérer le gain
    const gainElement = document.querySelector(
      '#center-column > div.container.pb-5 > section.row.pt-5 > div.col-lg-5.col-12.bg-primary.row.px-5.py-4 > div.col-12.d-flex.justify-content-center.justify-content-lg-between > div.col-9 > h3 > span'
    );
    const gain = gainElement ? gainElement.textContent.trim() : null;

    // Récupérer les options
    const optionsDetails = Array.from(document.querySelectorAll('.my-3 .row'))
      .slice(1)
      .map((row) => {
        const columns = row.querySelectorAll('.col');
        return {
          nom: columns[0]?.textContent.trim(),
          type: columns[1]?.textContent.trim(),
          prix: columns[2]?.textContent.trim(),
          quantite: columns[3]?.textContent.trim(),
          nombreDeJours: columns[4]?.textContent.trim(),
          total: columns[5]?.textContent.trim()
        };
      });

    // Récupérer le client
    const clientElement = document.querySelector('h4 > a');
    const clientName = clientElement ? clientElement.textContent.trim() : null;

    // Récupérer le numéro de téléphone
    const telephoneElement = document.querySelector(
      'div > p.m-0.col-lg-6.col-12:nth-of-type(2)'
    );
    const telephone = telephoneElement
      ? telephoneElement.textContent.trim().match(/\+?\d+/)?.[0]
      : null;

    return {
      clientName,
      locationId,
      dateDeparture,
      dateArrival,
      gain,
      optionsDetails,
      telephone
    };
  });

  if (locationData) {
    console.log('--------------------------------');
    // console.log('Client:', locationData.clientName);
    console.log('Numéro de location:', locationData.locationId);
    console.log('Gain:', locationData.gain);
    // console.log('Numéro de téléphone:', locationData.telephone);
    console.log('Date de départ:', locationData.dateDeparture);
    console.log("Date d'arrivée:", locationData.dateArrival);
    console.log('Détails des options:', locationData.optionsDetails);
    console.log('--------------------------------');
  } else {
    console.error('Impossible de trouver le numéro de location.');
  }
  return locationData;
}
