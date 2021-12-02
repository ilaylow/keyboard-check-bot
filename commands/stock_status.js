const scrapeFunctions = require('./scrapeWeb');
const data = require('./websites.json');

module.exports = {
    name: 'status',
    description: 'Gets the stock status of an item from different vendors and provides the link',
    async execute(msg, args) {
        let objType = args[0].toLowerCase();

        const websiteObj = data.websites.find((e) => e.alias === objType)
        if (!websiteObj){
          msg.reply("Can't check the status of that object as it does not exist. Perform **~help status** for available objects!");
          return;
        }
        
        msg.reply('Checking stock for you...');

        let stockArr = [];
        let websiteArr = [];

        for (const i in websiteObj.vendors){
          const element = websiteObj.vendors[i];
          websiteArr.push(element.link);
        
          switch (element.vendor){
            case "swagkeys":
              let resSwagKeys = await scrapeFunctions.scrapeSwagKeys(element.link);
              stockArr.push(resSwagKeys);
              break;
            case "switchkeys":
              let resSwitchKeys = await scrapeFunctions.scrapeSwitchKeys(element.link);
              stockArr.push(resSwitchKeys);
              break;
            case "tkc":
              let resTKC = await scrapeFunctions.scrapeTKC(element.link);
              stockArr.push(resTKC);
              break;
            case "dailyclack":
              let resDaily = await scrapeFunctions.scrapeDailyClack(element.link);
              stockArr.push(resDaily);
              break;
            case "cannonkeys":
              let resCannon = await scrapeFunctions.scrapeCannonKeys(element.link);
              stockArr.push(resCannon);
              break;
          }
        }

        console.log(stockArr);

        let reply = "";
        if (stockArr.includes(true)){
          reply += "Great news! It's **in stock** in at least one of the available locations below:\n";
        } else {
          reply = "Oops... it's unfortunately **Out of stock** in **all** of the locations below...\n";
        }
        for (let i = 0; i < stockArr.length; i++){
          let stockString = "**Out of Stock**: "
          if (stockArr[i]){
            stockString = "**In Stock**: "
          }
          reply += "- " + stockString + "<" + websiteArr[i] + ">" + "\n";
      }

        msg.reply(reply);

    },
  };