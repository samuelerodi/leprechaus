const puppeteer = require('puppeteer');
const numeral = require('numeral');
const utils = require('./utils');
const daft = require('./daft');
const { Parser } = require('json2csv');
const fs = require('fs').promises;




const url = "https://www.daft.ie/dublin/apartments-for-rent/grand-canal-dock/capital-dock-residence-sir-john-rogersons-quay-grand-canal-dock-dublin-1980709/"




module.exports = async () => {
  const browser = await puppeteer.launch({headless:true});
  // await page.screenshot({path: 'example.png'});

  // const sale = await daft.fetchSaleData(browser, url);
  // const rent = await daft.fetchRentData(browser, url);
  const urls = await  daft.searchUrls(browser, {});
  console.log("Analyzing " + urls.length + " properties...");
  const result = [];
  for (var url of urls) {
    try {
      const r = await daft.fetchSaleData(browser, url);
      result.push(r);
      console.log("Fetched: " + url)
    } catch (e) {
      console.error("Skipping: " + url)
      // console.error(e)
    }
  }
  console.log("Fetched: " + result.length + " properties");
  console.log("Skipped: " + (urls.length - result.length) + " properties");
  if (!result.length ) return;
  const fields = Object.keys(result[0]);
  const opts = { fields };

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(result);
    console.log("Saving results in ./result.csv")
    await fs.writeFile('result.csv', csv);
  } catch (err) {
    console.error(err);
  }

  // Get the "viewport" of the page, as reported by the page.
  // const dimensions = await page.evaluate(() => {
  //   return {
  //     width: document.documentElement.clientWidth,
  //     height: document.documentElement.clientHeight,
  //     deviceScaleFactor: window.devicePixelRatio
  //   };
  // });

  await browser.close();
};
