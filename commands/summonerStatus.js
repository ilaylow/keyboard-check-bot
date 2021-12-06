const leagueFunctions = require('../helper/obtainLeagueDetails');

module.exports = {
    name: 'summonerstatus',
    description: 'Gets some details ',
    async execute(msg, args) {
        let summonerId = args.join(" ");


        msg.reply("Looking up details for Summmoner: " + "**" + summonerId + "**");
        leagueFunctions.getSummonerDetails(summonerId);

    },
  };