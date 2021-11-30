const scrapeFunctions = require('./scrapeWeb');
const data = require('./websites.json');

module.exports = {
    name: 'status',
    description: 'Gets the stock status of the Durock POM Linear Switches from different vendors and provides the link',
    execute(msg, args) {
        msg.reply('Checking stock for you...');
        let switchType = args[0].toLowerCase();

        const websiteObj = data.websites.find((e) => e.alias === switchType)
        if (!websiteObj){
          msg.reply("Can't check the status of that object as it does not exist. Perform **~help status** for available objects!");
          return;
        }

        const swagKeysLink = websiteObj.websites[0];
        const switchKeysLink = websiteObj.websites[1];

        scrapeFunctions.scrapeSwagKeys(swagKeysLink)
        .then(response => msg.reply(response + swagKeysLink)
        );

        scrapeFunctions.scrapeSwitchKeys(switchKeysLink)
        .then(response => msg.reply(response + switchKeysLink)
        );

    },
  };