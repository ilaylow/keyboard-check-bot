const scrapeFunctions = require('./scrapeWeb');
const data = require('./websites.json');

module.exports = {
    name: 'status',
    description: 'Gets the stock status of the Durock POM Linear Switches from different vendors and provides the link',
    execute(msg, args) {
        let switchType = args[0].toLowerCase();

        const websiteObj = data.websites.find((e) => e.alias === switchType)
        if (!websiteObj){
          msg.reply("Can't check the status of that object as it does not exist. Perform **~help status** for available objects!");
          return;
        }
        
        msg.reply('Checking stock for you...');

        const swagKeysLink = websiteObj.websites[0];
        const switchKeysLink = websiteObj.websites[1];

        let websiteArr = [swagKeysLink, switchKeysLink];

        let inStock = false;
        let stockArr = [];
        scrapeFunctions.scrapeSwagKeys(swagKeysLink)
        .then((response) => {inStock = inStock || response; stockArr.push(response); console.log(response)}
        );

        scrapeFunctions.scrapeSwitchKeys(switchKeysLink)
        .then((response) => {inStock = inStock || response; stockArr.push(response); console.log(response)}
        );
        // TODO: FIX THIS 
        // Due to the asynchronous nature of promises, you cannot use the promises to set something and use that later, the promises will
        // execute concurrently you smartass
        console.log(inStock);
        let reply;
        if (inStock){
          reply += "Great news! It's **in stock** in at least one of the available locations below:\n";
          for (let i = 0; i < stockArr.length; i++){
              let stockString = "**Out of Stock**: "
              if (stockArr[i]){
                stockString = "**In Stock**: "
              }
              reply += "- " + stockString + websiteArr[i] + "\n";
          }

        } else {
          reply = "Oops... it's unfortunately **Out of stock** in all locations..."
        }

        msg.reply(reply);

    },
  };