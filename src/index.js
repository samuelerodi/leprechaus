const puppeteer = require('puppeteer');
const numeral = require('numeral');
const utils = require('./utils');
const daft = require('./daft');
const { Parser } = require('json2csv');
const fs = require('fs').promises;



module.exports.getRentData = async (url) => {
  const browser = await puppeteer.launch({headless:true});
  const urls = await  daft.searchUrls(browser, url);
  console.log("Analyzing " + urls.length + " properties...");
  const result = [];
  for (var url of urls) {
    try {
      const r = await daft.fetchRentData(browser, url);
      result.push(r);
      console.log("Fetched: " + url)
    } catch (e) {
      console.error("Skipping: " + url)
      console.error(e)
    }
  }
  console.log("Fetched: " + result.length + " properties");
  console.log("Skipped: " + (urls.length - result.length) + " properties");
  await saveData(result, "rent");
  await browser.close();
}



module.exports.getSaleData = async (url) => {
  const browser = await puppeteer.launch({headless:true});
  const urls = await  daft.searchUrls(browser, url);
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
  await saveData(result, "sale");
  await browser.close();
}




module.exports.getSoldData = async (url) => {
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
  await saveData(result, "sold");
  await browser.close();
}




const saveData = async (result, filename) => {
  if (!result.length ) return;
  const fields = Object.keys(result[0]);
  const opts = { fields };

  try {
    const parser = new Parser(opts);
    const csv = parser.parse(result);
    const output = "./result/" + (filename || "result") + ".csv"
    console.log("Saving results in " + output)
    await fs.mkdir("./result").catch(()=>{});
    await fs.writeFile(output, csv);
  } catch (err) {
    console.error(err);
  }
}
