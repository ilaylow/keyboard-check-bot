const leagueFunctions = require('../helper/obtainLeagueDetails');

module.exports = {
    name: 'getrotation',
    description: 'Gets current rotation of champions in League Of Legends',
    async execute(msg, args) {

        const currList = await leagueFunctions.getCurrentRotation();
        msg.reply("The current free champions this rotation are:\n -" + currList);
        
    },
  };