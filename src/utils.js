
module.exports.getPhone = async (page)=>{
  return await page.evaluate(() => {
    if ( $('.ContactForm__contactForm')[0].innerText.match(/Show Number/))
      $('.ContactForm__secondaryButton')[0].click()
    if ( $('.ContactForm__contactForm')[0].innerText.match(/Call[:]? (.*)/) )
      return $('.ContactForm__contactForm')[0].innerText.match(/Call[:]? (.*)/)[1]
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
