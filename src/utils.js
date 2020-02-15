const numeral = require('numeral');

module.exports.getPhone = async (page)=>{
  return await page.evaluate(() => {
    if ( $('.ContactForm__contactForm')[0] && $('.ContactForm__contactForm')[0].innerText.match(/Show Number/i))
      $('.ContactForm__secondaryButton')[0].click();
    if ( $('.smi-contact-numbers')[0] && $('.smi-contact-numbers')[0].innerText.match(/Show Number/i))
      $('.smi-contact-numbers>button')[0].click();
    if ( $('.ContactForm__contactForm,.smi-contact-numbers')[0].innerText.match(/Call[:]? (.*)/) )
      return $('.ContactForm__contactForm,.smi-contact-numbers')[0].innerText.match(/Call[:]? (.*)/)[1]
  })
}

module.exports.getEirCode = async (page)=>{
  return  await page.evaluate(() => {
    if ($('.PropertyMainInformation__eircode')[0]
          && $('.PropertyMainInformation__eircode')[0].innerText.match(/Eircode: (.*)/))
      return $('.PropertyMainInformation__eircode')[0].innerText.match(/Eircode: (.*)/)[1]
  })
}

module.exports.getEnergyPerformance = async (page)=>{
  return  await page.evaluate(() => {
    if ($('.BERDetails__berDetailsContainer')[0]
          && $('.BERDetails__berDetailsContainer')[0].innerText.match(/Energy Performance Indicator: (.*) k/))
      return $('.BERDetails__berDetailsContainer')[0].innerText.match(/Energy Performance Indicator: (.*) k/)[1]
  })
}

module.exports.getBerRating = async (page)=>{
  return  await page.evaluate(() => {
    if ($('img[alt="Ber Icon Energy Rate"]')[0]
          && $('img[alt="Ber Icon Energy Rate"]')[0].src.match(/ber_(.*)\.svg/))
      return $('img[alt="Ber Icon Energy Rate"]')[0].src.match(/ber_(.*)\.svg/)[1]
  })
}

module.exports.getRentPrice = async (page)=>{
  const p = await page.evaluate(() => $('#smi-price-string')[0].innerText)
  if (p.match(/month/i))
    return numeral(p.match(/([€£$][0-9,.]*)/)[1]).value();
  if (p.match(/week/i))
    return numeral(p.match(/([€£$][0-9,.]*)/)[1]).value() * 4.345;
}

module.exports.getFloorArea = async (page)=>{
  return  await page.evaluate(() => {
    if ($('.PropertyOverview__propertyOverviewDetails')[0].innerText.match(/Overall Floor Area: (.*)m2/))
      return $('.PropertyOverview__propertyOverviewDetails')[0].innerText.match(/Overall Floor Area: (.*)m2/)[1]
  })
}

module.exports.getNumberOfProperties = async (page)=>{
  const p = await page.evaluate(() => {
    if ($('div.section')[0]
          && $('div.section')[0].innerText.match(/Found ([0-9,]*) properties/))
      return $('div.section')[0].innerText.match(/Found ([0-9,]*) properties/)[1];
  })
  if (p) return numeral(p).value();
  return 0;
}


module.exports.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
