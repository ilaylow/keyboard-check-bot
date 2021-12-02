/* The code for this bot is adapted and inspired from the repository https://github.com/sitepoint-editors/discord-bot-sitepoint/tree/advanced*/

// Importing in the important stuff
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
bot.commands = new Discord.Collection();
const botCommands = require('./commands');

// Logins in the bot with the token
const TOKEN = process.env.TOKEN;
bot.login(TOKEN);

// Maps the bot commands to the corresponding names, e.g. maps 'ping' to ping command. {"ping": execute ping}
Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
  });

// When the bot has logged in successfully
bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
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