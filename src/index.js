const puppeteer = require('puppeteer');
const numeral = require('numeral');
const utils = require('./utils');
const daft = require('./daft');

const url = "https://www.daft.ie/dublin/houses-for-auction/dublin-2/11-pearse-square-dublin-2-dublin-2373911/"
let browser;

const init = async ()=>{
  browser = await puppeteer.launch();
}





const fetchSaleData  = async (url)=>{
  const page = await browser.newPage();
  await page.goto(url);
  const price = await page.evaluate(() => $('.PropertyInformationCommonStyles__propertyPrice')[0].innerText.match(/([€$£].*)/)[1])
  const address = await page.evaluate(() => $('.PropertyMainInformation__address')[0].innerText)
  const bedrooms = await page.evaluate(() => $('.QuickPropertyDetails__iconCopy')[0].innerText)
  const bathrooms = await page.evaluate(() => $('.QuickPropertyDetails__iconCopy--WithBorder')[0].innerText)
  const type = await page.evaluate(() => $('.QuickPropertyDetails__propertyType')[0].innerText)
  const floorArea = await page.evaluate(() => $('.PropertyOverview__propertyOverviewDetails')[0].innerText.match(/Overall Floor Area: (.*)m2/)[1])
  const dateEntered = await page.evaluate(() => $('.PropertyStatistics__iconsContainer')[0].innerText.match(/Entered\/Renewed\n(.*)/)[1].replace(/\./g,'-'))
  const views = await page.evaluate(() => $('.PropertyStatistics__iconsContainer')[0].innerText.match(/Property Views\n(.*)/)[1])
  const agent = await page.evaluate(() => $('.AgentDetails__agentHeader')[0].innerText)
  const saleType = await page.evaluate(() => $('.PropertyOverview__propertyOverviewDetails')[0].innerText.match(/auction/i) ? 'Auction' : 'Sale' )

  const phone = await utils.getPhone(page);
  const eirCode = await utils.getEirCode(page);
  const energyPerformance = await utils.getEnergyPerformance(page);
  const berRating = await utils.getBerRating(page);


  return {
    url,
    price : numeral(price).value(),
    address,
    bedrooms:numeral(bedrooms).value(),
    bathrooms:numeral(bedrooms).value(),
    eirCode,
    type,
    floorArea: numeral(floorArea).value(),
    berRating,
    energyPerformance: numeral(energyPerformance).value(),
    agent,
    phone,
    saleType,
    dateEntered: dateEntered,
    views: numeral(views).value(),
  }
}


module.exports.rents = async () => {

}

module.exports.sales = async () => {

}

module.exports = async () => {
  await init();
  // await page.screenshot({path: 'example.png'});

  const sale = await fetchSaleData(url);
  // Get the "viewport" of the page, as reported by the page.
  // const dimensions = await page.evaluate(() => {
  //   return {
  //     width: document.documentElement.clientWidth,
  //     height: document.documentElement.clientHeight,
  //     deviceScaleFactor: window.devicePixelRatio
  //   };
  // });

  console.log('Sale data:', sale);

  await browser.close();
};
