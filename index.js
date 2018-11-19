const Discord = require('discord.js');

const client = new Discord.Client();
const fs = require('fs');
const config = require('./config.json');

client.on('error', e => console.error(e));
client.on('warn', e => console.warn(e));
process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);


client.on('message', message => {
    const swearWords = ['nigger', 'nigga', 'niggar', 'niggor', 'niggr', 'nig', 'nigg', 'niggr', 'fag', 'faggot', 'fagg'];
    if (swearWords.some(word => message.cleanContent.toLowerCase().includes(word))) {
        message.delete();
        message.reply(`your sentence included a banned word. Please don't use any banned words. `).then(msg => msg.delete(3000)).catch(err => console.error(err));
    }
});

// Status set
client.on('ready', () => {
    console.log('Bot is active!');
    client.setInterval(() => {
        const Status = [
            `People say I'm hot  ${config.prefix}help`,
            `I'm here to help  ${config.prefix}help`,
            `You'll never see me coming  ${config.prefix}help`,
            `${config.version}  ${config.prefix}updates`,
        ];

        client.user.setActivity(Status[Math.floor(Math.random() * Status.length)], { 'type': 'PLAYING' });
        client.user.setStatus('online');
    }, 30 * 1000);
});
// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        const eventFunction = require(`./events/${file}`);
        const eventName = file.split('.')[0];
        // super-secret recipe to call events with all their proper arguments *after* the `client` var.
        client.on(eventName, (...args) => {
            try {
                eventFunction.run(client, ...args);
            } catch (err) {
                console.error(err);
            }
        });
    });
});

client.on('message', message => {
    if (message.author.bot) return;
    if (message.content.indexOf(config.prefix) !== 0) return;

    // This is the best way to define args. Trust me.
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // The list of if/else is replaced with those simple 2 lines:
    try {
        const commandFile = require(`./commands/${command}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        console.error(err);
    }
});

client.login(config.token).catch(err => console.error(`Bot failed with: ${err}`));