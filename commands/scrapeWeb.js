const cheerio = require("cheerio");
const pretty = require("pretty");
const axios = require("axios");

async function scrapeSwagKeys(link){
  const html = await axios.get(link);
  const $ = await cheerio.load(html.data);
  const buyButton = pretty($(".btn__text").html());

  if (buyButton.toLowerCase() !== "sold out"){
      return "Great news! It's **in-stock** at ";
  }
  else{
      return "Unfortunately, it's currently **out of stock** at ";
  }
}

async function scrapeSwitchKeys(link){
    const html = await axios.get(link);
    const $ = await cheerio.load(html.data);
    const buyButton = pretty($("button").text()).replace(/\s/g, "");;
    console.log(buyButton);
    let search = buyButton.search("Addtocart");
    
    if (search === -1){
        return "Unfortunately, it's currently out of stock at ";
    }
    else{
        return "Great news! It's **in-stock** at ";
    }
}

module.exports = {
    scrapeSwagKeys,
    scrapeSwitchKeys
}