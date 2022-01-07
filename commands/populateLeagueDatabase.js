const leagueFunctions = require('../helper/obtainLeagueDetails');
const user = "hi Im Yasuo";

module.exports = {
    name: 'populateleaguedatabase',
    description: 'Populates the mongo database of league runes for each champion used.',
    async execute(msg, args) {
        if (msg.author.id !== "246639977402859520"){
            msg.reply("Unauthorised use of command. Access Denied.");
            return;
        }

        msg.reply("Populating database...")
        await leagueFunctions.extractRunesFromHistory(user, 75);

        msg.reply("Completed!")
    },
  };