const leagueFunctions = require('../helper/obtainLeagueDetails');

module.exports = {
    name: 'getrotation',
    description: 'Gets current rotation of champions in League Of Legends',
    async execute(msg, args) {


        msg.reply("The current rotation is...");
        const currList = await leagueFunctions.getCurrentRotation();
        msg.reply(currList);
        
    },
  };