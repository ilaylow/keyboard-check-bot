const riotKey = process.env.RIOT_TOKEN;
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
        
        const requestMatchlink = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=50`;
        const resMatch = await axios.get(requestMatchlink, {headers: headerObj});
        
        
        console.log(resMatch.data);
        return resMatch.data;

    } catch(err){
        console.error(err);
    }

}

async function getCurrentRotation(){
    
}

module.exports = {
    getSummonerDetails,
    getCurrentRotation
}

