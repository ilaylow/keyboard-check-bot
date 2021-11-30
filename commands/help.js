const data = require('./websites.json');

module.exports = {
    name: 'help',
    description: 'Shows available commands and how to use them!',
    execute(msg, args) {
      if (args.length == 0){
          msg.reply('The list of available commands are as follows:\n - ~status [object-name]. To learn how to use this, type ~help status\n');
      }
      else{
          switch (args[0]){
              
              case "status":
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