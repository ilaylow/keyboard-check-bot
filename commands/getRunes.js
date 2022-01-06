const leagueFunctions = require('../helper/obtainLeagueDetails');

module.exports = {
    name: 'getrunes',
    description: 'Gets the ',
    async execute(msg, args) {
        const championName = args[0].toLowerCase();

        leagueFunctions.getRunesForChampion(championName);

    },
  };