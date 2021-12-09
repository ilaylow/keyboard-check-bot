const leagueFunctions = require('../helper/obtainLeagueDetails');

module.exports = {
    name: 'inrotation',
    description: 'Checks if champion is within current rotation',
    async execute(msg, args) {
        const championName = args[0].toLowerCase();
        const result = await leagueFunctions.inRotation(championName);
        if (result){
            msg.reply("Yes!");
        }
        else{
            msg.reply("Nope...");
        }
        
    },
  };