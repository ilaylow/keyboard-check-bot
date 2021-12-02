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

async function scrapeTKC(link){
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

async function scrapeDailyClack(link){
    const html = await axios.get(link);
  const $ = await cheerio.load(html.data);
  const buyButton = pretty($("#AddToCartText-product-template").html());

  if (buyButton.toLowerCase() !== "sold out"){
      return true;
  }
  else{
      return false;
  }
}

async function scrapeCannonKeys(link){
    const html = await axios.get(link);
  const $ = await cheerio.load(html.data);
  const buyButton = pretty($("#AddToCartText-product-template").html());

  if (buyButton.toLowerCase() !== "sold out"){
      return true;
  }
  else{
      return false;
  }
}

module.exports = {
    scrapeSwagKeys,
    scrapeSwitchKeys,
    scrapeTKC,
    scrapeDailyClack,
    scrapeCannonKeys
}