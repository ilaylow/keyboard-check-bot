const riotKey = process.env.RIOT_TOKEN;
const numMatches = 10;
const axios = require("axios");
const champions = require("../data/champion.json");
const items = require("../data/item.json");
const runes = require("../data/runesReforged.json");
const runeModel = require("../models/ChampionRuneSchema");

const headerObj = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
    "Accept-Language": "en-AU,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://developer.riotgames.com",
    "X-Riot-Token": riotKey
}

async function getRunesForChampion(champion){
    console.log(champion);
    const result = await runeModel.ChampionRuneModel.findOne({champion: champion})
    
    if (!result){
        return "**Sorry**, this champion does **not exist** in the current database..."
    }

    // This gets the runes of our champion
    const primaryRunes = result.runes[0];
    const secondaryRunes = result.runes[1]
    const statPerks = result.statPerks;

    const primaryObj = getRuneStyle(primaryRunes.style)
    const secondaryObj = getRuneStyle(secondaryRunes.style)

    const primarySlots = primaryObj.slots;
    const secondarySlots = secondaryObj.slots.slice(1);

    const primarySlotArr = getRuneSlotPrimaryArray(primaryRunes, primarySlots);

    const combinedSecondarySlots = (secondarySlots[0].runes.concat(secondarySlots[1].runes)).concat(secondarySlots[2].runes);
    const secondarySlotArr = getRuneSlotSecondaryArray(secondaryRunes, combinedSecondarySlots);

    const primaryMsg = printPrimarySlots(primarySlotArr, primaryObj.name);
    const secondaryMsg = printSecondarySlots(secondarySlotArr, secondaryObj.name);

    console.log(primaryMsg + secondaryMsg);
    return primaryMsg + secondaryMsg;
}

function printPrimarySlots(arr, name){
    let msg = "**Primary**\n" + name + "\n\n";

    const slotSizeArr = [4,3,3,3]

    for (const i in slotSizeArr){
        for (let j=0; j < slotSizeArr[i]; j++){
            if (arr[i]-1 == j){
                msg += " x"
            }
            else{
                msg += " o"                
            }
        }
        msg += "\n"
    }
    
    msg += "\n"

    return msg
}

function printSecondarySlots(arr, name){
    let slotSizeArr;
    if (name === "Domination"){
        slotSizeArr = [3,3,4]
    } else{
        slotSizeArr = [3,3,3]
    }

    let msg = "**Secondary**\n" + name + "\n\n";

    for (const i in slotSizeArr){
        for (let j = 0; j < slotSizeArr[i]; j++){
            if ((arr[0][0] == i && arr[0][1] == j) || (arr[1][0] == i && arr[1][1] == j)){
                msg += " x"
            }
            else{
                msg += " o"
            }
        }
        msg += "\n";
    }

    return msg;
}

function getRuneSlotPrimaryArray(runes, slots){
    let slotArr = [];

    for (const i in slots){
        const currPerkNum = runes.selections[i].perk  
        const currRow = slots[i].runes

        let slotNum = 0;
        while (currRow[slotNum].id != currPerkNum){
            slotNum += 1;
        }
        slotArr.push(slotNum + 1)
    }

    return slotArr;
}

function getRuneSlotSecondaryArray(runes, slots){
    
    let slotArr = []
    for (const i in runes.selections){
        let indexNum = 0;
        while (slots[indexNum].id != runes.selections[i].perk){
            indexNum += 1
        }
        slotArr.push(indexNum);
    }

    const rowNum1 = Math.floor(slotArr[0] / 3)
    const colNum1 = slotArr[0] - (rowNum1 * 3);

    const rowNum2 = Math.floor(slotArr[1] / 3)
    const colNum2 = slotArr[1] - (rowNum2 * 3);

    return [[rowNum1, colNum1], [rowNum2, colNum2]]
}

function getRuneStyle(styleId){
    for (const i in runes){
        if (runes[i].id == styleId){
            return runes[i];
        }
    }
}

async function extractRunesFromHistory(summonerName, historyLen){
    const requestSummonerlink = `https://oc1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`;

    try {
        const res = await axios.get(requestSummonerlink,{headers: headerObj});

        const puuid = res.data.puuid;
        
        const requestMatchlink = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${historyLen}`;
        const resMatch = (await axios.get(requestMatchlink, {headers: headerObj})).data;
        const championRuneDict = {};

        for (const i in resMatch){
            const matchId = resMatch[i];

            const requestMatchInfoLink = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`;
            const matchInfoRes = (await axios.get(requestMatchInfoLink,  {headers: headerObj})).data;

            for (const j in matchInfoRes.info.participants){
                
                if (matchInfoRes.info.participants[j].summonerName.toLowerCase() == summonerName.toLowerCase()){
                    console.log(matchInfoRes.info.participants[j].perks)

                    if (!championRuneDict[matchInfoRes.info.participants[j].championName]){
                        championRuneDict[matchInfoRes.info.participants[j].championName] = [matchInfoRes.info.participants[j].perks]
                    } else{
                        championRuneDict[matchInfoRes.info.participants[j].championName].push(matchInfoRes.info.participants[j].perks);
                    }

                }
            }
        }

        console.log(championRuneDict)
        console.log(runeModel)
        for (let key in championRuneDict){
            let entry = championRuneDict[key]
            let runeEntry = entry[0];
            console.log(runeEntry)
            const presentChampion = await runeModel.ChampionRuneModel.findOne({champion: String(key).toLowerCase()})
            if (!presentChampion){
                await runeModel.ChampionRuneModel.create({champion: String(key).toLowerCase(), runes: runeEntry.styles, statPerks: runeEntry.statPerks})
            }
        }
        

    } catch(err){
        console.error(err);
        if (err.response.statusText === "Not Found"){
            return "Summoner not found. Please enter a valid name!";
        }
        return err;
    }
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
                if (participants[j].summonerName.toLowerCase() === summonerName.toLowerCase()){
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
        if (err.response.statusText === "Not Found"){
            return "Summoner not found. Please enter a valid name!";
        }
        return err;
    }

}

function processSummonerInfo(infoList){
    let summary = {"champions": [], "outcome": [], "runes":[], "items": [], "kills":[], "deaths": [], "assists": [], "score": []};
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
        summary["score"].push(`[K: ${game.kills} D:${game.deaths} A:${game.assists}]`);
    }
    
    return summary;
}

function convertToPrintable(summonerInfo){
    let reply = "";
    reply += `Here's the information collected after analyzing your past **${numMatches}** games.\n\n`;
    reply += `- You've played these **champions** in the order listed: **${summonerInfo["champions"]}**\n`
    reply += `- You've **won/lost** in this order: **${summonerInfo["outcome"]}**\n`
    reply += `- Your **score** in the same order: **${summonerInfo["score"]}**\n`

    const winRatio = calculateWinRatio(summonerInfo["outcome"]);
    reply += `- Your **win ratio** for the past **${numMatches}** games is: **${winRatio}%**.\n`;

    const mostFrequentChampion = getMostFrequentChampion(summonerInfo["champions"]);
    reply += `-Your most recent frequent champion has been **${mostFrequentChampion}**.\n`;

    reply += "\nMore analysis can and will be done in this information, more to come soon!";

    return reply;
}

function getMostFrequentChampion(championList){
    const championDict = {}
    for (const i in championList){
        const champion = championList[i];
        if (championDict[champion]){
            championDict[champion] += 1;
        }
        else{
            championDict[champion] = 1;
        }
    }

    const result = Object.entries(championDict).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    console.log(result);
    return result;
}

function calculateWinRatio(winList){
    let numWins = 0;
    for (const i in winList){
        if (winList[i] == "won") numWins++;
    }

    return ((numWins / winList.length) * 100)
}

async function getSummonerNameFromUUID(uuid){

}

async function getRotationList(){

    const getRotationLink = "https://oc1.api.riotgames.com/lol/platform/v3/champion-rotations"
    try {
        const res = (await axios.get(getRotationLink, {headers: headerObj})).data;
        const idList = res.freeChampionIds;
        console.log(res);
        let championNames = []
        
        for (const i in idList){
            const id = idList[i];
            for (const j in champions.data){
                const champion = champions.data[j];
                if (champion.key == id){
                    championNames.push(champion.name);
                    break;
                }
            }
        }

        console.log(championNames);
        return championNames;
    } catch (err){
        //console.error(err);
        return "Something went wrong...";
    }

}

async function inRotation(championName){
    const currList = await getRotationList();
    let newList = [];
    for (const i in currList) {newList.push(currList[i].toLowerCase())}

    if (newList.includes(championName)) return true;
    return false;
}

module.exports = {
    getRotationList,
    getSummonerDetails,
    inRotation,
    extractRunesFromHistory,
    getRunesForChampion
}

