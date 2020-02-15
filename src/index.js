const puppeteer = require('puppeteer');
const numeral = require('numeral');
const utils = require('./utils');
const daft = require('./daft');
const { Parser } = require('json2csv');
const fs = require('fs').promises;

const url = "https://www.daft.ie/price-register/dublin-city/ballsbridge/?min_beds=%2A&max_beds=%2A&min_price=25000&max_price=5000000&pt_id=%2A&keyword=&search=Search+%BB"


module.exports.getRentData = async () => {
  const browser = await puppeteer.launch({headless:true});
  const urls = await  daft.searchUrls(browser, {});
  console.log("Analyzing " + urls.length + " properties...");
  const result = [];
  for (var url of urls) {
    try {
      const r = await daft.fetchRentData(browser, url);
      result.push(r);
      console.log("Fetched: " + url)
    } catch (e) {
      console.error("Skipping: " + url)
      // console.error(e)
    }
  }
  console.log("Fetched: " + result.length + " properties");
  console.log("Skipped: " + (urls.length - result.length) + " properties");
  await saveData(result);
  await browser.close();
}



module.exports.getSaleData = async () => {
  const browser = await puppeteer.launch({headless:true});
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
  await saveData(result);
  await browser.close();
}




module.exports.getSoldData = async () => {
  const browser = await puppeteer.launch({headless:true});
  const pages = await daft.getSoldPages(browser, url);
  console.log("Crawling " + pages + " pages...");
  const result = [];
  for (var pg=1; pg<=pages; pg++) {
    try {
      const uri = url + "&pagenum=" + pg;
      const r = await daft.fetchSoldData(browser, uri);
      result.push(...r);
      console.log("Fetched page: " + pg)
    } catch (e) {
      console.error("Skipping page: " + pg)
      // console.error(e)
    }
  }
  await saveData(result);
  await browser.close();
}




const saveData = async (result) => {
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
}
