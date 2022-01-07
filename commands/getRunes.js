const leagueFunctions = require('../helper/obtainLeagueDetails');

module.exports = {
    name: 'getrunes',
    description: 'Gets the ',
    async execute(msg, args) {
        const championName = args[0].toLowerCase();

        let reply = await leagueFunctions.getRunesForChampion(championName);
        reply += "\nBest of luck in your game! ^-^"
        msg.reply(reply);
    },
  };