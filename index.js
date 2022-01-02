/* The code for this bot is adapted and inspired from the repository https://github.com/sitepoint-editors/discord-bot-sitepoint/tree/advanced*/

// Importing in the important stuff
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
bot.commands = new Discord.Collection();
const botCommands = require('./commands');
const Scraper = require('images-scraper');

const google = new Scraper({
  puppeteer: {
    headless: true
  }
})

const spidermanQuotes = ["You can't do this to me... I started this company... DO YOU KNOW HOW MUCH I SACRIFICED?! - 'Norman Osborn'\nhttps://www.youtube.com/watch?v=CpLzTKiWBYw&ab_channel=TheCheat",
"'See ya chump' - Black Suit Spiderman\nhttps://www.youtube.com/watch?v=pTGVoS4xB_0&ab_channel=ShadowJoe",
"'It's pizza time' - Peter Parker\nhttps://youtu.be/8yOnVGiqMNA?t=178",
"'Hello Harry' - Otto Octavius\nhttps://youtu.be/5RkrciltPx8?t=5",
"'I've been reading poetry lately... - Peter Parker\nhttps://youtu.be/l3u2gR-FGOY?t=33",
"'Strawberries' - Harry Osborn\nhttps://www.youtube.com/watch?v=ksgGECgIOek&ab_channel=OneLinerArmory",
"'Could you pay me in advance?' - Peter Parker\nhttps://youtu.be/sYekLbgY080?t=72",
"'I need that MONEY' - Peter Parker Needing That Money\nhttps://youtu.be/iCAaBWmKTDg",
"'I missed the part where that's my problem' - Peter Parker Not Having A Problem\nhttps://youtu.be/iCAaBWmKTDg?t=8",
"'The power of the sun... in the palm of my hand' - Otto Octavius With The Sun In The Palm Of His Hand\nhttps://youtu.be/_UCSZz3U7qU?t=7",
"'You got any with nuts? Go make me some. - Peter Parker Wanting Cookies With Nuts\nhttps://youtu.be/IldJm79CZKw?t=40"]

// Logins in the bot with the token
const TOKEN = process.env.BOT_TOKEN;
bot.login(TOKEN);

// Maps the bot commands to the corresponding names, e.g. maps 'ping' to ping command. {"ping": execute ping}
Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
  });

// When the bot has logged in successfully
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    bot.user.setPresence({ activities: [{ name: 'Mama Fauna', type: "WATCHING", url: "https://www.youtube.com/channel/UCO_aKKYxn4tvrqPjcTzZ6EQ" }], status: 'available'});
    /* setInterval(async () => {

      try {
        const urls = await google.scrape("cute dog", 100);
        const result = urls[Math.floor(Math.random() * urls.length)].url
        const channel = bot.channels.cache.get('868923793953947660');
        
        channel.send("Here's your random dog pic!");
        await channel.send({files: [String(result)]});

      } catch (e){
        console.log("Something went wrong...")
      }
    }, 17280000); */
    setInterval(async () => {

      // Pick a random quote from the long list of spiderman quotes...
      const channel = bot.channels.cache.get('868923793953947660');
      const randomQuoteIndex = Math.floor(Math.random() * (spidermanQuotes.length))
      channel.send(spidermanQuotes[randomQuoteIndex])

    }, 3600000);
  });

  // Bot listens to an event of message
bot.on('message', msg => {
    let msgSplit = msg.content.split(" ");
    let command = msgSplit[0];

    if (!command.startsWith('~')) return;
    else command = command.slice(1);

    let args = msgSplit.slice(1);
    console.log(msgSplit);

    if (!bot.commands.has(command)){
        msg.reply("That command does not exist unfortunately.");
        return;
    };

    try {
      bot.commands.get(command).execute(msg, args);
    } catch (error) {
      console.error(error);
      msg.reply('There was an error trying to execute that command!');
    }
});