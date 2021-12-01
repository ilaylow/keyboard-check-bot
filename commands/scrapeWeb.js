const cheerio = require("cheerio");
const pretty = require("pretty");
const axios = require("axios");

async function scrapeSwagKeys(link){
  const html = await axios.get(link);
  const $ = await cheerio.load(html.data);
  const buyButton = pretty($(".btn__text").html());

  if (buyButton.toLowerCase() !== "sold out"){
      return true;
  }
  else{
      return false;
  }
}

async function scrapeSwitchKeys(link){
    const html = await axios.get(link);
    const $ = await cheerio.load(html.data);
    const buyButton = pretty($("button").text()).replace(/\s/g, "");;
    console.log(buyButton);
    let search = buyButton.search("Addtocart");
    
    if (search === -1){
        return false;
    }
    else{
        return true;
    }
}

module.exports = {
    scrapeSwagKeys,
    scrapeSwitchKeys
}