const { MessageSelectMenu } = require('discord.js');
const { Kayn, REGIONS } = require('kayn')
const kayn = Kayn(process.env.LEAGUE_TOKEN)({
    region: REGIONS.OCEANIA,
    apiURLPrefix: 'https://%s.api.riotgames.com',
    locale: 'en_AU',
    debugOptions: {
        isEnabled: true,
        showKey: false,
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 1000,
        burst: false,
        shouldExitOn403: false,
    },
    cacheOptions: {
        cache: null,
        timeToLives: {
            useDefault: false,
            byGroup: {},
            byMethod: {},
        },
    },
})

async function getSummonerDetails(summonerId){
    const res = await kayn.Summoner.by.name(summonerId);
    const matchHistory = kayn.Matchlist.Recent.by.accountID(res.accountId);

    console.log(matchHistory);
    console.log(res);

}

async function getCurrentRotation(){
    const currentRot = await (await kayn.Champion.Rotation.list()).freeChampionIds;
    console.log(currentRot[0]);
    
    const reply = currentRot.join(",");
    

    return reply;
}

module.exports = {
    getSummonerDetails,
    getCurrentRotation
}

