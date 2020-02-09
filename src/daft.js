const numeral = require('numeral');
const utils = require('./utils');

module.exports.fetchSaleData  = async (browser, url)=>{
  const page = await browser.newPage();
  await page.goto(url);
  const price = await page.evaluate(() => $('.PropertyInformationCommonStyles__propertyPrice')[0].innerText.match(/([€$£].*)/)[1])
  const address = await page.evaluate(() => $('.PropertyMainInformation__address')[0].innerText)
  const area = await page.evaluate(() => googletag.pubads().getTargeting('area_name')[0])
  const bedrooms = await page.evaluate(() => $('.QuickPropertyDetails__iconCopy')[0].innerText)
  const bathrooms = await page.evaluate(() => $('.QuickPropertyDetails__iconCopy--WithBorder')[0].innerText)
  const furnished = await page.evaluate(() => googletag.pubads().getTargeting('furnished')[0])

  const type = await page.evaluate(() => $('.QuickPropertyDetails__propertyType')[0].innerText)
  const dateEntered = await page.evaluate(() => $('.PropertyStatistics__iconsContainer')[0].innerText.match(/Entered\/Renewed\n(.*)/)[1].replace(/\./g,'-'))
  const views = await page.evaluate(() => $('.PropertyStatistics__iconsContainer')[0].innerText.match(/Property Views\n(.*)/)[1])
  const agent = await page.evaluate(() => $('.AgentDetails__agentHeader')[0].innerText)
  const saleType = await page.evaluate(() => $('.PropertyOverview__propertyOverviewDetails')[0].innerText.match(/auction/i) ? 'Auction' : 'Sale' )

  const floorArea = await utils.getFloorArea(page);
  const phone = await utils.getPhone(page);
  const eirCode = await utils.getEirCode(page);
  const energyPerformance = await utils.getEnergyPerformance(page);
  const berRating = await utils.getBerRating(page);

  return {
    url,
    price : numeral(price).value() || undefined,
    address,
    area,
    bedrooms:numeral(bedrooms).value() || undefined,
    bathrooms:numeral(bedrooms).value() || undefined,
    eirCode,
    furnished,
    type,
    floorArea: numeral(floorArea).value() || undefined,
    berRating,
    energyPerformance: numeral(energyPerformance).value() || undefined,
    agent,
    phone,
    saleType,
    dateEntered: dateEntered,
    views: numeral(views).value() || undefined,
  }
}


module.exports.fetchRentData  = async (browser, url)=>{
  const page = await browser.newPage();
  await page.goto(url);
  const price = await utils.getRentPrice(page);
  const area = await page.evaluate(() => googletag.pubads().getTargeting('area_name')[0])
  const berRating = await page.evaluate(() => googletag.pubads().getTargeting('ber')[0])
  const bedrooms = await page.evaluate(() => googletag.pubads().getTargeting('beds')[0])
  const furnished = await page.evaluate(() => googletag.pubads().getTargeting('furnished')[0])

  const bathrooms = await page.evaluate(() => ($('#smi-summary-items')[0].innerText.match(/([0-9])[\s]*bath/i) || [])[1])
  const type = await page.evaluate(() => ($('#smi-summary-items')[0].innerText.match(/(.*)\sto rent/i) || [])[1])
  // const floorArea = await page.evaluate(() => $('.PropertyOverview__propertyOverviewDetails')[0].innerText.match(/Overall Floor Area: (.*)m2/)[1])
  const dateEntered = await page.evaluate(() => $('.description_extras')[0].innerText.match(/Entered\/Renewed[:]?\n([0-9\/\-.]*)/)[1])
  const views = await page.evaluate(() => $('.description_extras')[0].innerText.match(/Property Views[:]?\n(.*)/)[1].replace(/[,|.]/,''))
  const phone = await utils.getPhone(page);

  return {
    url,
    price : numeral(price).value() || undefined,
    area,
    bedrooms:numeral(bedrooms).value() || undefined,
    bathrooms:numeral(bedrooms).value() || undefined,
    // eirCode,
    furnished,
    type,
    // floorArea: numeral(floorArea).value() || undefined,
    berRating,
    // energyPerformance: numeral(energyPerformance).value() || undefined,
    // agent,
    phone,
    dateEntered: dateEntered,
    views: numeral(views).value() || undefined,
  }
}


module.exports.searchUrls = async (browser, searchParams) => {
  const searchUrl = "https://www.daft.ie/dublin-city/houses-for-sale/?s%5Bmxp%5D=150000";
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image')   return req.abort();
        return    req.continue();
    });
  await page.goto(searchUrl);
  const properties = await utils.getNumberOfProperties(page);
  console.log("Found ", properties,  " properties to explore...")
  const list = [];
  while (list.length < properties) {
    console.log("Checking from offset ", list.length)
    let url = searchUrl + "&offset=" + list.length
    await page.goto(url);
    const partials = await page.evaluate(() => $('a.PropertyImage__mainImageBigLink,a.PropertyImage__link').toArray().map(e=>e.href).concat($('.main_photo').parent().toArray().map(e=>e.href)))
    if (!partials || !partials.length) break;
    list.push(...partials);
  }
  return list;
}
