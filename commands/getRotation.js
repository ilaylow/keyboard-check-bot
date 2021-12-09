const leagueFunctions = require('../helper/obtainLeagueDetails');

module.exports = {
    name: 'getrotation',
    description: 'Gets current rotation of champions in League of Legends',
    async execute(msg, args) {

        const rotationList = await leagueFunctions.getRotationList();
        msg.reply("The current free champions this rotation are:\n -" + rotationList);
        
    },
  };