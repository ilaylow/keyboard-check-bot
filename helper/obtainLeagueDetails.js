const riotKey = process.env.RIOT_TOKEN;
const numMatches = 10;
const axios = require("axios");
const headerObj = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    "Accept-Language": "en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://developer.riotgames.com",
    "X-Riot-Token": riotKey
}

async function getSummonerDetails(summonerName){
    const requestSummonerlink = `https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`;

    try {
        const res = await axios.get(requestSummonerlink,{headers: headerObj});

        const puuid = res.data.puuid;
        
        const requestMatchlink = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${numMatches}`;
        const resMatch = (await axios.get(requestMatchlink, {headers: headerObj})).data;
        let matchInfoTotal = {};
        let participantsList = [];
        let summonerInfo = [];
        // TODO: use the list of past match Ids to collect meaningful information, most likely a list of json objects
        // Once done extraction of any info can commence and can begin to draw inferences. 
        // For example, player requests status, and we can return, recent win status, champions lost on, won on, average cs, average match times
        for (const i in resMatch){
            const matchId = resMatch[i];

            const requestMatchInfoLink = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`;
            const matchInfoRes = (await axios.get(requestMatchInfoLink,  {headers: headerObj})).data;
            const participants = matchInfoRes.info.participants;
            
            // Separate participants between winning and losing team
            
            let teams = {'win': [], 'lose': []};
            for (const j in participants){

                if (participants[j].summonerName === summonerName){
                    summonerInfo.push(participants[j]);
                }

                if (participants[j].win){
                    teams['win'].push(participants[j]);
                }
                else{
                    teams['lose'].push(participants[j]);
                }
            }
            //console.log(teams);

            participantsList.push(participants);
            matchInfoTotal = matchInfoRes;

        }
        const summonerSummary = processSummonerInfo(summonerInfo);
        const printableSummary = convertToPrintable(summonerSummary);
        console.log(summonerSummary);
        
        return printableSummary;

    } catch(err){
        console.error(err);
    }

}

function processSummonerInfo(infoList){
    let summary = {"champions": [], "outcome": [], "runes":[], "items": [], "kills":[], "deaths": [], "assists": []};
    for (const i in infoList){
        const game = infoList[i];
        summary["champions"].push(game.championName);
        if (game.win){
            summary["outcome"].push("won");
        }
        else{
            summary["outcome"].push("lost");
        }
        summary["runes"].push(game.perks);
        summary["items"].push([game.item0, game.item1, game.item2, game.item3, game.item4, game.item5, game.item6]);
        summary["kills"].push(game.kills);
        summary["deaths"].push(game.deaths);
        summary["assists"].push(game.assists);
    }

    return summary;
}

function convertToPrintable(summonerInfo){
    let reply = "";
    reply += "Here's the information collected after analyzing your past " + numMatches + " games.\n\n";
    reply += `- You've played these champions in the order listed: **${summonerInfo["champions"]}**\n`
    reply += `- You've won/lost in this order: **${summonerInfo["outcome"]}**\n`
    reply += `- You got this many kills in the respective order: **${summonerInfo["kills"]}**\n`
    reply += `- You've died this many times in the same order: **${summonerInfo["deaths"]}**\n`
    reply += `- You've either gotten ksed or assisted this many times: **${summonerInfo["assists"]}**\n`;

    reply += "\nMore analysis can and will be done in this information, more to come soon!";

    return reply;
}

async function getSummonerNameFromUUID(uuid){

}

async function getCurrentRotation(){
    
}

module.exports = {
    getSummonerDetails,
    getCurrentRotation
}

