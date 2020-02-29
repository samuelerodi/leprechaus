const search = require("./src");
const url = "https://www.daft.ie/price-register/dublin-city/ballsbridge/?min_beds=%2A&max_beds=%2A&min_price=25000&max_price=5000000&pt_id=%2A&keyword=&search=Search+%BB"


const SALE_URL = process.env.SALE_URL || "";
const SOLD_URL = process.env.SOLD_URL || "";
const RENT_URL = process.env.RENT_URL || "";

Promise.resolve(true)
  .then(()=>{
    if (SALE_URL) {
      console.log("\n\n------------------------\n\n")
      console.log("Analyzing SALE data starting from search url:\n" + SALE_URL + "\n\n")
      return search.getSaleData(SALE_URL);
    }
  }).then(()=>{
    if (SOLD_URL){
      console.log("\n\n------------------------\n\n")
      console.log("Analyzing SOLD data starting from search url:\n" + SOLD_URL + "\n\n")
      return search.getSoldData(SOLD_URL);
     }
  }).then(()=>{
    if (RENT_URL){
      console.log("\n\n------------------------\n\n")
      console.log("Analyzing RENT data starting from search url:\n" + RENT_URL + "\n\n")
      return search.getRentData(RENT_URL);
     }
  }).then(()=>{
    console.log("\n\n------------------------\n\n")
    console.log("Finished processing... Bye!")
    process.exit()
  });
