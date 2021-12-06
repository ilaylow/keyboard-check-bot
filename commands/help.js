const data = require('./websites.json');

module.exports = {
    name: 'help',
    description: 'Shows available commands and how to use them!',
    execute(msg, args) {
      if (args.length == 0){
          msg.reply('The list of available commands are as follows:\n\
          - **stockstatus [object]**. To see how to use this in more detail, type **~help stockstatus**.\n\
          - **getrotation**. Gets the current rotation of Champions in League of Legends.\n\
          - **summonerstatus [summoner_name]**. Gets important info regarding a specific summoner in League of Legends.');
      }
      else{
          switch (args[0]){
              
              case "stockstatus":
                  let items = [];
                  data.websites.forEach(element => items.push(element.alias));

                  let reply = "You may use the ~status command to check the stock status of the items allowed by this bot. Currently, the bot allows you to check for items: \n";

                  data.websites.forEach(element => reply += "- " + element.alias + "  (" + element.name + ")\n");

                  reply += "\nFor example, try ~status krytox205g0.";

                  msg.reply(reply);
          }
      }


      // Check args for how to use a specific commands
    },
  };